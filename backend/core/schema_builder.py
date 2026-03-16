"""
schema_builder.py
=================
AMR Studio Pro V4 - CModel 构建器 (v4.5 Deep Alignment)

Key Improvements:
1. CModelProperty: Strict encapsulation of [key, type, value, desc] using correct field numbers.
2. Template Injection: Loads a reference model and injects dynamic data instead of building from scratch.
3. IEEE-754 Precision: Guaranteed fixed64 (double) encoding for all numerical attributes.
4. Robust Schema Patching: Traverses the entire schema tree and injects industrial fields into Property messages.
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
    try:
        return struct.unpack('<Q', struct.pack('<d', float(f)))[0] & 0xFFFFFFFFFFFFFFFF
    except:
        return 0

def make_uuid() -> str:
    return str(uuid.uuid4()).replace('-', '')

class CModelProperty:
    """
    Abstractions for the 'Property' message found in CModel files.
    """
    TYPE_STRING = 1
    TYPE_DOUBLE = 10
    TYPE_INT32 = 5
    TYPE_COMBOX = 11
    TYPE_FIXED = 12
    TYPE_BOOL = 1

    @staticmethod
    def string(key: str, val: str, desc: str = "") -> dict:
        return {"1": key, "2": CModelProperty.TYPE_STRING, "10": str(val or ""), "51": desc, "52": 1}

    @staticmethod
    def double(key: str, val: float, desc: str = "", unit: str = "") -> dict:
        f64 = float_to_fixed64(val)
        return {
            "1": key, 
            "2": CModelProperty.TYPE_DOUBLE, 
            "17": f64, 
            "35": f64, 
            "50": unit, 
            "51": desc, 
            "52": 1,
            "55": 1
        }

    @staticmethod
    def int32(key: str, val: int, desc: str = "", unit: str = "") -> dict:
        return {
            "1": key, 
            "2": CModelProperty.TYPE_INT32, 
            "17": int(val or 0), 
            "30": int(val or 0),
            "50": unit, 
            "51": desc, 
            "52": 1,
            "55": 1
        }

    @staticmethod
    def combox(key: str, val: str, desc: str = "") -> dict:
        return {"1": key, "2": CModelProperty.TYPE_COMBOX, "21": {"1": val}, "51": desc, "52": 1}

class CustomCompDescBuilder:
    def __init__(self, template_path: str):
        self.template_path = template_path
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
            
        with open(template_path, 'rb') as f:
            raw = f.read()
        self.payload, self.schema = blackboxprotobuf.decode_message(raw)
        self._patch_all_messages(self.schema)
        # Clear nodes to start clean
        self.payload["5"] = []

    def _patch_all_messages(self, typedef: dict):
        """Recursively find and patch Property messages in the schema."""
        if not isinstance(typedef, dict): return
        
        # Heuristic: If it has field 1 and 2, it's likely a Property message
        if '1' in typedef and '2' in typedef:
            industrial_fields = {
                "10": {"type": "bytes", "name": "val_str"},
                "12": {"type": "int", "name": "val_fixed"},
                "17": {"type": "fixed64", "name": "val_double"},
                "30": {"type": "int", "name": "val_int"},
                "35": {"type": "fixed64", "name": "val_double_alt"},
                "50": {"type": "bytes", "name": "unit"},
                "51": {"type": "bytes", "name": "desc"},
                "52": {"type": "int", "name": "industrial_52"},
                "53": {"type": "int", "name": "industrial_53"},
                "54": {"type": "int", "name": "industrial_54"},
                "55": {"type": "int", "name": "industrial_55"},
                "56": {"type": "int", "name": "industrial_56"}
            }
            for fid, fcfg in industrial_fields.items():
                if fid not in typedef:
                    typedef[fid] = fcfg
        
        # Recurse into message fields
        for fdef in typedef.values():
            if isinstance(fdef, dict) and fdef.get('type') == 'message' and 'message_typedef' in fdef:
                self._patch_all_messages(fdef['message_typedef'])

    def _create_node(self, m_type: str, m_name: str, sub_type: str = "") -> dict:
        m_uuid = make_uuid()
        return {
            "1": m_name,
            "4": {
                "1": {
                    "1": CModelProperty.string("module_name", m_name, "模块名称"),
                    "4": CModelProperty.string("module_uuid", m_uuid, "模块Uuid"),
                    "13": {"1": 1, "11": {"1": 100, "2": 100, "3": 100}}, # Dims
                    "7": CModelProperty.combox("sub_sys_type", "ChassisSys", "子系统"),
                    "8": CModelProperty.combox("main_module_type", m_type, "主类型"),
                    "9": CModelProperty.combox("sub_module_type", sub_type or m_type, "子类型"),
                    "20": [{"1": "module_alias", "2": 1, "10": m_name, "51": "模块别名", "52": 1}]
                },
                "2": {"1": []}, # Attr groups
                "4": {"1": []}, # Eth/Interfaces
                "5": {"1": []}, # Relations
            }
        }

    def _get_uuid(self, node: dict) -> str:
        return node["4"]["1"]["4"]["10"]

    def _add_relation(self, node: dict, parent: dict, x=0.0, y=0.0, z=0.0, yaw=0.0, pitch=0.0, roll=0.0):
        p_uuid = self._get_uuid(parent)
        p_name = parent["1"]
        
        if "1" not in node["4"]["5"]:
            node["4"]["5"]["1"] = []
        rels = node["4"]["5"]["1"]
        
        rels.append({
            "1": "parentNodeUuid",
            "2": 11,
            "21": {"1": p_uuid, "2": p_name, "3": {"1": p_uuid, "2": p_name}}
        })
        
        rels.append(CModelProperty.double("locCoordX", x, "安装X", "mm"))
        rels.append(CModelProperty.double("locCoordY", y, "安装Y", "mm"))
        rels.append(CModelProperty.double("locCoordZ", z, "安装Z", "mm"))
        rels.append(CModelProperty.double("locCoordYAW", yaw, "安装YAW", "°"))
        if pitch != 0: rels.append(CModelProperty.double("locCoordPITCH", pitch, "安装PITCH", "°"))
        if roll != 0: rels.append(CModelProperty.double("locCoordROLL", roll, "安装ROLL", "°"))

    def _add_interface(self, node: dict, name: str) -> tuple:
        p_uuid = make_uuid()
        port = {"1": name, "5": p_uuid}
        if "1" not in node["4"]["4"]:
            node["4"]["4"]["1"] = []
        node["4"]["4"]["1"].append(port)
        return p_uuid, port

    def _wire(self, port_a: dict, uuid_b: str, port_b: dict, uuid_a: str):
        port_a["6"] = uuid_b
        port_b["6"] = uuid_a

    def build_from_payload(self, amr: GeneratePayload, base_template_zip: str = None) -> str:
        nodes = []
        
        # 1. Chassis
        ch_meta = amr.chassis
        chassis = self._create_node("chassis", amr.robotName, "steerChassis")
        
        props = [
            CModelProperty.double("headOffset(Idle)", ch_meta.headOffsetIdle, "距离车头", "mm"),
            CModelProperty.double("tailOffset(Idle)", ch_meta.tailOffsetIdle, "距离车尾", "mm"),
            CModelProperty.double("leftOffset(Idle)", ch_meta.leftOffsetIdle, "距离车左", "mm"),
            CModelProperty.double("rightOffset(Idle)", ch_meta.rightOffsetIdle, "距离车右", "mm"),
        ]
        chassis["4"]["2"]["1"].append({"1": "motionCenterAttr", "2": "运动中心参数", "3": props})
        
        ch_props = [
            CModelProperty.int32("wheelsNum", len(amr.wheels), "轮组个数", "个"),
            CModelProperty.double("maxSpeed(Idle)", ch_meta.maxSpeedIdle, "最大速度", "mm/s"),
            CModelProperty.double("sizeLen", ch_meta.length, "长度", "mm"),
            CModelProperty.double("sizeWidth", ch_meta.width, "宽度", "mm"),
            CModelProperty.double("sizeHeight", ch_meta.height, "高度", "mm"),
        ]
        chassis["4"]["2"]["1"].append({"1": "chassisAttr", "2": "底盘参数", "3": ch_props})
        nodes.append(chassis)

        # 2. Wheels
        for w in amr.wheels:
            wnode = self._create_node("driveWheel", w.label, w.type.lower())
            self._add_relation(wnode, chassis, w.mountX, w.mountY, w.mountZ, w.mountYaw)
            
            w_props = [
                CModelProperty.double("wheelRadius", w.diameter/2, "轮半径", "mm"),
                CModelProperty.string("softwareSpec", w.type, "软件规格")
            ]
            wnode["4"]["2"]["1"].append({"1": "wheelAttr", "2": "基本属性", "3": w_props})
            
            for comp in w.components:
                dnode = self._create_node("subDriver", f"{w.label}_{comp.role}", "driver")
                self._add_relation(dnode, wnode, 0, 0, 0)
                d_props = [
                    CModelProperty.string("model", comp.driverModel, "型号"),
                    CModelProperty.int32("canNodeId", comp.canNodeId, "节点ID"),
                    CModelProperty.double("gearRatio", comp.gearRatio or 1.0, "减速比")
                ]
                dnode["4"]["2"]["1"].append({"1": "driverAttr", "2": "驱动参数", "3": d_props})
                nodes.append(dnode)
            
            nodes.append(wnode)

        # 3. Sensors
        sensor_ifaces = []
        for s in amr.sensors:
            snode = self._create_node("sensor", s.label, s.type.lower())
            self._add_relation(snode, chassis, s.mountX, s.mountY, s.mountZ, s.mountYaw, s.mountPitch, s.mountRoll)
            
            s_props = [
                CModelProperty.string("ip", s.ipAddress, "IP"),
                CModelProperty.int32("port", s.port or 0, "Port"),
                CModelProperty.string("softwareSpec", s.model, "软件规格")
            ]
            snode["4"]["2"]["1"].append({"1": "sensorAttr", "2": "传感器参数", "3": s_props})
            
            if s.connType == "ETHERNET":
                su, sp = self._add_interface(snode, s.ethPort or "ETH")
                sensor_ifaces.append((su, sp))
            nodes.append(snode)

        # 4. MCU
        m_meta = amr.mcu or McuConfig()
        mcu = self._create_node("mainCPU", m_meta.model, "mainCPU")
        self._add_relation(mcu, chassis, m_meta.mountX, m_meta.mountY, m_meta.mountZ, m_meta.yaw, m_meta.pitch, m_meta.roll)
        
        for i, (su, sp) in enumerate(sensor_ifaces):
            mu, mp = self._add_interface(mcu, f"ETH_{i+1}")
            self._wire(mp, su, sp, mu)
            
        nodes.append(mcu)

        # 5. Package
        self.payload["5"] = nodes
        comp_bytes = blackboxprotobuf.encode_message(self.payload, self.schema)
        
        out_dir = tempfile.mkdtemp()
        safe_name = amr.robotName.replace(" ", "_").replace("/", "_")
        zip_path = os.path.join(out_dir, f"{safe_name}_ModelSet.cmodel")
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr("CompDesc.model", comp_bytes)
            manifest = {
                "ModelFileDesc": [
                    {
                        "md5": hashlib.md5(comp_bytes).hexdigest(),
                        "name": "CompDesc.model",
                        "type": "MODEL_COMP",
                        "version": "1.0"
                    }
                ]
            }
            zf.writestr("ModelFileDesc.json", json.dumps(manifest, indent=4))
        return zip_path
