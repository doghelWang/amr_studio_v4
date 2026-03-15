"""
schema_builder.py
=================
AMR Studio Pro V4 - CModel 构建器（精确版）

Schema 真实结构（通过 CompDesc.model 模板逆向提取）：
  node.4.1  = 基础信息 message
    .4       = {10: uuid_bytes}
    .8       = {21: {1: type_bytes}}
    .13      = {11: {1,2,3: int}}  ← 尺寸
  node.4.2.1 = 私有属性组列表（list of message）
    .2 = group_name(bytes), .3 = 属性(message)
  node.4.3.1 = 接口描述 list
    .1(bytes) .3(int)   ← 3 不是数组，是 int！
  node.4.4.1 = 接口端口列表（独立端口）
    .1(bytes) .5(bytes=uuid) .6(bytes=connected_uuid)
  node.4.5.1 = 关联关系/坐标 list
    .1(bytes) .2(int) .17/.35/.45(fixed64) .21(message) .50(bytes) .52/.53/.55(int)
"""

import os
import uuid
import json
import zipfile
import tempfile
import hashlib
import struct
import blackboxprotobuf
from schemas.api import GeneratePayload, McuConfig


def float_to_fixed64(f: float) -> int:
    """Encode IEEE-754 double as unsigned 64-bit integer for protobuf fixed64 fields."""
    return struct.unpack('<Q', struct.pack('<d', float(f)))[0] & 0xFFFFFFFFFFFFFFFF


def make_uuid() -> bytes:
    return str(uuid.uuid4()).replace('-', '').encode('utf-8')


class CustomCompDescBuilder:
    """
    Generates strict IEEE-754 compliant .cmodel archives.
    Uses schema extracted from the official CompDesc.model template.
    """

    def __init__(self, template_path: str):
        self.template_path = template_path
        with open(template_path, 'rb') as f:
            raw = f.read()
        _, self.schema = blackboxprotobuf.decode_message(raw)

    # ──────────────────────────────────────────
    # Node factory
    # ──────────────────────────────────────────

    def _create_node(self, m_type: str, m_name: str) -> dict:
        """Create a minimal valid CompDesc node dict."""
        m_uuid = make_uuid()
        return {
            "1": m_name.encode('utf-8'),
            "4": {
                "1": {
                    # sub-fields follow node.4.1.x schema:
                    # .1 / .3 / .4 / .5 / .6 are all message with {1,2,10,51,52...}
                    # .8 stores the module type (.21.1)
                    # .13 stores dimensions
                    "4": {"10": m_uuid},          # uuid
                    "8": {"21": {"1": m_type.encode('utf-8')}},  # type
                    "1": {"10": m_name.encode('utf-8')},         # name (display)
                    "13": {"11": {"1": 100, "2": 100, "3": 100}} # dimensions
                },
                "2": {"1": []},   # 私有属性 groups
                "4": {"1": []},   # 接口端口列表 (node.4.4.1)
                "5": {"1": []},   # 关联关系/坐标 (node.4.5.1)
            }
        }

    def _get_uuid(self, node: dict) -> bytes:
        return node["4"]["1"]["4"]["10"]

    def _get_name(self, node: dict) -> bytes:
        return node["4"]["1"]["1"]["10"]

    # ──────────────────────────────────────────
    # 关联关系与安装坐标
    # ──────────────────────────────────────────

    def _add_relation(self, node: dict, parent: dict,
                      x=0.0, y=0.0, z=0.0, yaw=0.0):
        """
        Mount node to parent, write parentNodeUuid + locCoord* entries.
        node.4.5.1 items: {1:bytes, 2:int, 17/35/45:fixed64, 21:message, 50:bytes, 52/53/55:int}
        """
        p_uuid = self._get_uuid(parent)
        p_name = self._get_name(parent)

        rels = node["4"]["5"]["1"]
        # Parent UUID reference
        rels.append({
            "1": b"parentNodeUuid",
            "2": 11,
            "21": {
                "1": p_uuid,
                "2": p_name,
                "3": {"1": p_uuid, "2": p_name},
            },
        })
        # Installation coordinates — use fixed64 for all float fields
        rels.append({"1": b"locCoordX",   "2": 10, "17": 0, "35": float_to_fixed64(x),   "45": float_to_fixed64(x),   "50": b"mm",                      "52": 1, "55": 1})
        rels.append({"1": b"locCoordY",   "2": 10, "17": 0, "35": float_to_fixed64(y),   "45": float_to_fixed64(y),   "50": b"mm",                      "52": 1, "55": 1})
        rels.append({"1": b"locCoordZ",   "2": 10, "17": 0, "35": float_to_fixed64(z),   "45": float_to_fixed64(z),   "50": b"mm",                      "52": 1, "55": 1})
        rels.append({"1": b"locCoordYAW", "2": 10, "17": 0, "35": float_to_fixed64(yaw), "45": float_to_fixed64(yaw), "50": "\xb0".encode('utf-8'),      "52": 1, "53": 1, "55": 1})
        if hasattr(node, '_roll'):
            rels.append({"1": b"locCoordROLL", "2": 10, "17": 0, "35": float_to_fixed64(getattr(node, '_roll', 0)), "45": float_to_fixed64(getattr(node, '_roll', 0)), "50": "\xb0".encode('utf-8'), "52": 1, "53": 1, "55": 1})
        if hasattr(node, '_pitch'):
            rels.append({"1": b"locCoordPITCH", "2": 10, "17": 0, "35": float_to_fixed64(getattr(node, '_pitch', 0)), "45": float_to_fixed64(getattr(node, '_pitch', 0)), "50": "\xb0".encode('utf-8'), "52": 1, "53": 1, "55": 1})

    # ──────────────────────────────────────────
    # 接口端口
    # Schema: node.4.4.1 items {1:bytes, 5:bytes(uuid), 6:bytes(connected_uuid)}
    # ──────────────────────────────────────────

    def _add_interface(self, node: dict, port_name: str) -> tuple:
        """
        Add an interface port to node.4.4.1.
        Returns (port_uuid_bytes, port_dict) for wiring.
        NOTE: field 6 is a SINGLE bytes value per schema (not a list).
              For multi-connection, call _add_interface once per connection.
        """
        port_uuid = make_uuid()
        port = {
            "1": port_name.encode('utf-8'),
            "5": port_uuid,
            # "6" = connected target UUID — filled later during wiring
        }
        node["4"]["4"]["1"].append(port)
        return port_uuid, port

    def _wire(self, port_a: dict, uuid_b: bytes, port_b: dict, uuid_a: bytes):
        """Connect two ports bidirectionally (field 6 = connected UUID bytes)."""
        port_a["6"] = uuid_b
        port_b["6"] = uuid_a

    # ──────────────────────────────────────────
    # 私有属性 (node.4.2.1 group)
    # node.4.2.1 items: {2:bytes(group_name), 3:message(props)}
    # ──────────────────────────────────────────

    def _add_prop_group(self, node: dict, group_name: str, props: list):
        node["4"]["2"]["1"].append({
            "2": group_name.encode('utf-8'),
            "3": props,
        })

    # ──────────────────────────────────────────
    # Main build
    # ──────────────────────────────────────────

    def build_from_payload(self, amr: GeneratePayload, base_template_zip: str = None) -> str:
        """Build a .cmodel archive, return the temporary zip path."""
        nodes = []

        # ── 1. 底盘 ──────────────────────────────────
        c_meta = amr.chassis
        chassis = self._create_node("chassis", amr.robotName)
        
        # A. Module Metadata (设备信息)
        self._add_prop_group(chassis, "设备信息", [
            {"1": b"moduleName",   "51": "模块名称".encode('utf-8'), "10": c_meta.name.encode('utf-8')},
            {"1": b"moduleDesc",   "51": "模块描述".encode('utf-8'), "10": c_meta.description.encode('utf-8')},
            {"1": b"module_alias", "51": "模块别名".encode('utf-8'), "10": c_meta.alias.encode('utf-8')},
            {"1": b"version_info", "51": "版本信息".encode('utf-8'), "10": c_meta.version.encode('utf-8')},
            {"1": b"sub_sys_type", "51": "子系统".encode('utf-8'),   "10": c_meta.subsystem.encode('utf-8')},
            {"1": b"vender_name",  "51": "供应商".encode('utf-8'),   "10": c_meta.vendor.encode('utf-8')},
            {"1": b"module_dsc_type", "51": "设备型号".encode('utf-8'), "10": c_meta.model.encode('utf-8')},
            {"1": b"softwareSpec", "51": "软件规格".encode('utf-8'), "10": c_meta.name.encode('utf-8')},
        ])

        # B. Motion Center Parameters (运动中心参数)
        self._add_prop_group(chassis, "运动中心参数", [
            {"1": b"headOffset(Idle)", "51": "距离头(空)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.headOffsetIdle), "50": b"mm"},
            {"1": b"tailOffset(Idle)", "51": "距离尾(空)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.tailOffsetIdle), "50": b"mm"},
            {"1": b"leftOffset(Idle)", "51": "距离左(空)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.leftOffsetIdle), "50": b"mm"},
            {"1": b"rightOffset(Idle)", "51": "距离右(空)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.rightOffsetIdle), "50": b"mm"},
            {"1": b"headOffset (Full Load)", "51": "距离头(满)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.headOffsetFull), "50": b"mm"},
            {"1": b"tailOffset (Full Load)", "51": "距离尾(满)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.tailOffsetFull), "50": b"mm"},
            {"1": b"leftOffset (Full Load)", "51": "距离左(满)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.leftOffsetFull), "50": b"mm"},
            {"1": b"rightOffset (Full Load)", "51": "距离右(满)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.rightOffsetFull), "50": b"mm"},
        ])

        # C. Chassis Attributes (底盘参数)
        self._add_prop_group(chassis, "底盘参数", [
            {"1": b"wheelsNum",    "51": "轮组个数".encode('utf-8'), "2": 5,  "17": len(amr.wheels)},
            {"1": b"sizeLen",      "51": "长度".encode('utf-8'),     "2": 10, "35": float_to_fixed64(c_meta.length), "50": b"mm"},
            {"1": b"sizeWidth",    "51": "宽度".encode('utf-8'),     "2": 10, "35": float_to_fixed64(c_meta.width),  "50": b"mm"},
            {"1": b"sizeHeight",   "51": "高度".encode('utf-8'),     "2": 10, "35": float_to_fixed64(c_meta.height), "50": b"mm"},
            
            {"1": b"maxSpeed(Idle)", "51": "线速(空)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.maxSpeedIdle), "50": b"mm/s"},
            {"1": b"maxAcceleration(Idle)", "51": "线加(空)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.maxAccIdle), "50": b"mm/s2"},
            {"1": b"maxDeceleration(Idle)", "51": "线减(空)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.maxDecIdle), "50": b"mm/s2"},
            
            {"1": b"rotateMaxAngSpeed (Idle)", "51": "角速(空)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.maxAngSpeedIdle), "50": b"deg/s"},
            {"1": b"rotateMaxAngAcceleration (Idle)", "51": "角加(空)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.maxAngAccIdle), "50": b"deg/s2"},
            {"1": b"rotateMaxAngDeceleration (Idle)", "51": "角减(空)".encode('utf-8'), "2": 10, "35": float_to_fixed64(c_meta.maxAngDecIdle), "50": b"deg/s2"},
        ])
        nodes.append(chassis)

        # ── 2. 驱动轮 ────────────────────────────────
        for w in amr.wheels:
            wnode = self._create_node("driveWheel", w.label)
            self._add_relation(wnode, chassis, w.mountX, w.mountY, w.mountZ, w.mountYaw)
            
            # Map topology type to softwareSpec
            spec_map = {
                "STANDARD_DIFF": "diffWheel-Common",
                "VERTICAL_STEER": "verticalSteerWheel-Common",
                "HORIZONTAL_STEER": "horizontalSteerWheel-Common",
                "DUAL_STEER": "dualSteerWheel-Common", # Added support
                "DIFF_STEER": "diffSteerWheel-Common"
            }
            spec = spec_map.get(w.type, "diffWheel-Common")
            
            self._add_prop_group(wnode, "轮组参数", [
                {"1": b"softwareSpec", "51": "软件规格".encode('utf-8'), "10": spec.encode('utf-8')},
                {"1": b"wheelType",    "51": "轮组类型".encode('utf-8'), "10": w.type.encode('utf-8')},
                {"1": b"wheelRadius",  "51": "轮半径".encode('utf-8'), "2": 10, "35": float_to_fixed64(w.diameter / 2), "45": float_to_fixed64(w.diameter / 2), "50": b"mm"},
            ])

            # Add driver components for each wheel (Drivers/Encoders on CAN)
            for comp in w.components:
                # Role display name mapping
                role_name = "驱动器" if "DRIVER" in comp.role else "编码器"
                dnode = self._create_node("subDriver", f"{w.label}_{comp.role}")
                self._add_relation(dnode, wnode, 0.0, 0.0, 0.0) # Relative to wheel
                
                # Power properties
                props = [
                    {"1": b"model",        "51": "型号".encode('utf-8'), "10": comp.driverModel.encode('utf-8')},
                    {"1": b"canBus",       "51": "CAN总线".encode('utf-8'), "10": comp.canBus.encode('utf-8')},
                    {"1": b"canNodeId",    "51": "节点ID".encode('utf-8'), "2": 5, "17": comp.canNodeId},
                    {"1": b"softwareSpec", "51": "软件规格".encode('utf-8'), "10": comp.driverModel.encode('utf-8')},
                    {"1": b"role",         "51": "功能角色".encode('utf-8'), "10": comp.role.encode('utf-8')},
                ]
                
                if comp.ratedVoltage: props.append({"1": b"inputVoltage", "51": "额定电压".encode('utf-8'), "2": 10, "35": float_to_fixed64(comp.ratedVoltage), "50": b"V"})
                if comp.ratedCurrent: props.append({"1": b"ratedCurr",   "51": "额定电流".encode('utf-8'), "2": 10, "35": float_to_fixed64(comp.ratedCurrent), "50": b"A"})
                if comp.ratedSpeed:   props.append({"1": b"RPM",         "51": "额定转速".encode('utf-8'), "2": 5, "17": comp.ratedSpeed, "50": b"RPM"})
                if comp.gearRatio:    props.append({"1": b"gearRatio",   "51": "减速比".encode('utf-8'), "2": 10, "35": float_to_fixed64(comp.gearRatio)})
                
                if comp.encoderType:
                    props.append({"1": b"ENCType", "51": "编码器类型".encode('utf-8'), "10": comp.encoderType.encode('utf-8')})
                    if comp.encoderResolution:
                        res_key = b"sglTurnBit" if comp.encoderType == "ABSOLUTE" else b"encoderLine"
                        props.append({"1": res_key, "51": "反传/线数".encode('utf-8'), "2": 5, "17": comp.encoderResolution})

                self._add_prop_group(dnode, "驱动器参数", props)
                nodes.append(dnode)

            nodes.append(wnode)

        # ── 3. 传感器 ────────────────────────────────
        sensor_ifaces: list[tuple] = []  # (s_uuid, s_port, snode)
        for s in amr.sensors:
            snode = self._create_node("sensor", s.label)
            # Use all pose fields
            self._add_relation(snode, chassis, s.mountX, s.mountY, s.mountZ, s.yaw)
            # One ETH port per sensor
            s_uuid, s_port = self._add_interface(snode, "ETH_1")
            sensor_ifaces.append((s_uuid, s_port, snode))
            
            # Extract software spec from model (remove vendor prefix if exists)
            s_spec = s.model.split('_')[-1] if '_' in s.model else s.model

            # Private sensor properties
            self._add_prop_group(snode, "传感器参数", [
                {"1": s.model.encode('utf-8'), "51": "型号".encode('utf-8'), "10": s.model.encode('utf-8')},
                {"1": s.type.encode('utf-8'),  "51": "类型".encode('utf-8'), "10": s.type.encode('utf-8')},
                {"1": b"softwareSpec",         "51": "软件规格".encode('utf-8'), "10": s_spec.encode('utf-8')},
            ])
            nodes.append(snode)

        # ── 4. IO 扩展模块 ──────────────────────────
        io_ifaces: list[tuple] = []
        for io in amr.ioBoards:
            ionode = self._create_node("extendedlnterface", io.label or io.model)
            self._add_relation(ionode, chassis, 0.0, 0.0, 0.0)
            self._add_prop_group(ionode, "设备信息", [
                {"1": b"model",        "51": "型号".encode('utf-8'), "10": io.model.encode('utf-8')},
                {"1": b"softwareSpec", "51": "软件规格".encode('utf-8'), "10": io.model.encode('utf-8')},
                {"1": b"canNodeId",    "51": "节点ID".encode('utf-8'), "2": 5, "17": io.canNodeId or 0},
            ])

            # Interface Resources (Phase 12)
            i_props = []
            if io.canBuses: i_props.append({"1": b"CAN", "2": 0, "17": len(io.canBuses)}) # 0 or 2 for count? Using same as MCU
            if io.diPorts:  i_props.append({"1": b"DI",  "2": 2, "17": len(io.diPorts)})
            if io.doPorts:  i_props.append({"1": b"DO",  "2": 2, "17": len(io.doPorts)})
            if io.aiPorts:  i_props.append({"1": b"AI",  "2": 2, "17": len(io.aiPorts)})
            
            if i_props:
                self._add_prop_group(ionode, "接口资源", i_props)
            # Interface to connect to MCU
            io_u, io_p = self._add_interface(ionode, "CAN_1")
            io_ifaces.append((io_u, io_p, ionode))
            nodes.append(ionode)

        # ── 5. 主控 MCU ────────────────────────────
        m_meta = amr.mcu or McuConfig()
        mcu_name = m_meta.model
        mcu = self._create_node("mainCPU", mcu_name)
        # Hack to pass roll/pitch to _add_relation without breaking schema
        setattr(mcu, '_roll', m_meta.roll)
        setattr(mcu, '_pitch', m_meta.pitch)
        self._add_relation(mcu, chassis, m_meta.mountX, m_meta.mountY, m_meta.mountZ, m_meta.yaw)
        
        # Add Module Metadata
        self._add_prop_group(mcu, "设备信息", [
            {"1": b"moduleName",   "51": "模块名称".encode('utf-8'), "10": m_meta.name.encode('utf-8')},
            {"1": b"moduleDesc",   "51": "模块描述".encode('utf-8'), "10": m_meta.description.encode('utf-8')},
            {"1": b"module_alias", "51": "模块别名".encode('utf-8'), "10": m_meta.alias.encode('utf-8')},
            {"1": b"version_info", "51": "版本信息".encode('utf-8'), "10": m_meta.version.encode('utf-8')},
            {"1": b"sub_sys_type", "51": "子系统".encode('utf-8'),   "10": m_meta.subsystem.encode('utf-8')},
            {"1": b"vender_name",  "51": "供应商".encode('utf-8'),   "10": m_meta.vendor.encode('utf-8')},
            {"1": b"module_dsc_type", "51": "设备型号".encode('utf-8'),  "10": m_meta.model.encode('utf-8')},
            {"1": b"softwareSpec", "51": "软件规格".encode('utf-8'), "10": mcu_name.encode('utf-8')},
        ])

        # Add Interface Capabilities
        ifaces = []
        if m_meta.canBuses: ifaces.append({"1": b"CAN", "2": 2, "17": len(m_meta.canBuses)})
        if m_meta.ethPorts: ifaces.append({"1": b"ETH", "2": 2, "17": len(m_meta.ethPorts)})
        if m_meta.rs232Ports: ifaces.append({"1": b"RS232", "2": 2, "17": len(m_meta.rs232Ports)})
        if m_meta.rs485Ports: ifaces.append({"1": b"RS485", "2": 2, "17": len(m_meta.rs485Ports)})
        if m_meta.speakerPorts: ifaces.append({"1": b"SPK", "2": 2, "17": len(m_meta.speakerPorts)})
        
        props = []
        for iface in ifaces:
            props.append({"1": iface["1"], "2": 2, "17": iface["17"]})
            
        self._add_prop_group(mcu, "接口资源", props)

        # Synthesize board-mounted devices
        if m_meta.hasGyro:
            gyro = self._create_node("sensor", "GYRO-VIR")
            self._add_relation(gyro, mcu, 0.0, 0.0, 0.0, 0.0)
            self._add_prop_group(gyro, "传感器参数", [
                {"1": b"moduleName",   "51": "模块名称".encode('utf-8'), "10": b"GYRO-VIR"},
                {"1": b"softwareSpec", "51": "软件规格".encode('utf-8'), "10": b"GYRO-VIR"},
                {"1": b"isBoardMounted", "51": "是否板载".encode('utf-8'), "10": b"\xe6\x98\xaf"}, # "是"
            ])
            nodes.append(gyro)

        if m_meta.hasTopCamera:
            cam_t = self._create_node("sensor", "CR-VIR-T")
            self._add_relation(cam_t, mcu, 0.0, 0.0, 0.0, 0.0)
            self._add_prop_group(cam_t, "传感器参数", [
                {"1": b"moduleName",   "51": "模块名称".encode('utf-8'), "10": b"CR-VIR-T"},
                {"1": b"softwareSpec", "51": "软件规格".encode('utf-8'), "10": b"CR-VIR"},
                {"1": b"isBoardMounted", "51": "是否板载".encode('utf-8'), "10": b"\xe6\x98\xaf"},
            ])
            nodes.append(cam_t)

        if m_meta.hasDownCamera:
            cam_d = self._create_node("sensor", "CR-VIR-D")
            self._add_relation(cam_d, mcu, 0.0, 0.0, 0.0, 0.0)
            self._add_prop_group(cam_d, "传感器参数", [
                {"1": b"moduleName",   "51": "模块名称".encode('utf-8'), "10": b"CR-VIR-D"},
                {"1": b"softwareSpec", "51": "软件规格".encode('utf-8'), "10": b"CR-VIR"},
                {"1": b"isBoardMounted", "51": "是否板载".encode('utf-8'), "10": b"\xe6\x98\xaf"},
            ])
            nodes.append(cam_d)

        # Wiring: Sensors (ETH)
        for i, (s_uuid, s_port, _snode) in enumerate(sensor_ifaces):
            mcu_uuid, mcu_port = self._add_interface(mcu, f"ETH_{i+1}")
            self._wire(mcu_port, s_uuid, s_port, mcu_uuid)
        
        # Wiring: IO Boards (CAN)
        for i, (io_uuid, io_port, _ionode) in enumerate(io_ifaces):
            mcu_uuid, mcu_port = self._add_interface(mcu, f"CAN_{i+1}")
            self._wire(mcu_port, io_uuid, io_port, mcu_uuid)

        nodes.append(mcu)

        # ── 5. Encode ──────────────────────────────
        payload = {"5": nodes}
        comp_bytes = blackboxprotobuf.encode_message(payload, self.schema)

        # ── 6. Package .cmodel ─────────────────────
        manifest = {
            "ModelFileDesc": [{
                "md5": hashlib.md5(comp_bytes).hexdigest(),
                "name": "CompDesc.model",
                "type": "MODEL_COMP",
                "version": "1.0",
            }]
        }
        out_dir = tempfile.mkdtemp()
        safe = amr.robotName.replace(" ", "_").replace("/", "_")
        zip_path = os.path.join(out_dir, f"{safe}_ModelSet.cmodel")
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr("CompDesc.model", comp_bytes)
            zf.writestr("ModelFileDesc.json", json.dumps(manifest, indent=4, ensure_ascii=False))
        return zip_path
