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
from schemas.api import GeneratePayload


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
        chassis = self._create_node("chassis", amr.robotName)
        self._add_prop_group(chassis, "底盘参数", [
            {"1": b"wheelCount",   "51": "轮组个数".encode('utf-8'), "2": 5,  "17": len(amr.wheels)},
            {"1": b"length",       "51": "车体长度".encode('utf-8'), "2": 10, "35": float_to_fixed64(amr.chassisLength), "45": float_to_fixed64(amr.chassisLength), "50": b"mm"},
            {"1": b"width",        "51": "车体宽度".encode('utf-8'), "2": 10, "35": float_to_fixed64(amr.chassisWidth),  "45": float_to_fixed64(amr.chassisWidth),  "50": b"mm"},
        ])
        nodes.append(chassis)

        # ── 2. 驱动轮 ────────────────────────────────
        for w in amr.wheels:
            wnode = self._create_node("driveWheel", w.label)
            self._add_relation(wnode, chassis, w.mountX, w.mountY, 0.0)
            nodes.append(wnode)

        # ── 3. 传感器 ────────────────────────────────
        sensor_ifaces: list[tuple] = []  # (s_uuid, s_port, snode)
        for s in amr.sensors:
            snode = self._create_node("sensor", s.label)
            self._add_relation(snode, chassis, s.mountX, s.mountY, s.mountZ)
            # One ETH port per sensor
            s_uuid, s_port = self._add_interface(snode, "ETH_1")
            sensor_ifaces.append((s_uuid, s_port, snode))
            # Private sensor properties (use field 10 for string values per real schema)
            self._add_prop_group(snode, "传感器参数", [
                {"1": s.model.encode('utf-8'), "51": "型号".encode('utf-8'), "10": s.model.encode('utf-8')},
                {"1": s.type.encode('utf-8'),  "51": "类型".encode('utf-8'), "10": s.type.encode('utf-8')},
            ])
            nodes.append(snode)

        # ── 4. 主控 MCU ────────────────────────────
        mcu = self._create_node("mainCPU", "MainController")
        self._add_relation(mcu, chassis, 0.0, 0.0, 0.0)
        for i, (s_uuid, s_port, _snode) in enumerate(sensor_ifaces):
            mcu_uuid, mcu_port = self._add_interface(mcu, f"ETH_{i+1}")
            self._wire(mcu_port, s_uuid, s_port, mcu_uuid)
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
