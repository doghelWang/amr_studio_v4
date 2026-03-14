import os
import zipfile
import struct
import re
from io import BytesIO

class BinaryScraper:
    @staticmethod
    def read_varint(stream):
        res, shift = 0, 0
        while True:
            b = stream.read(1)
            if not b: return None
            byte = ord(b)
            res |= (byte & 0x7f) << shift
            if not (byte & 0x80): return res
            shift += 7

    @classmethod
    def decode_stream(cls, data):
        stream = BytesIO(data)
        items = []
        while True:
            header = cls.read_varint(stream)
            if header is None: break
            tag, wire = header >> 3, header & 0x07
            if wire == 0: items.append((tag, cls.read_varint(stream)))
            elif wire == 1: items.append((tag, struct.unpack('<d', stream.read(8))[0]))
            elif wire == 2:
                length = cls.read_varint(stream)
                items.append((tag, stream.read(length)))
            elif wire == 5: items.append((tag, struct.unpack('<f', stream.read(4))[0]))
        return items

    @classmethod
    def deep_flatten(cls, data, props=None):
        if props is None: props = {}
        items = cls.decode_stream(data)
        current_key = None
        for tag, val in items:
            if tag == 1 and isinstance(val, bytes):
                try: current_key = val.decode('utf-8').strip()
                except: pass
            elif tag in [10, 12, 17, 5] and current_key:
                if isinstance(val, bytes):
                    try: props[current_key] = val.decode('utf-8').strip()
                    except: props[current_key] = val.hex()
                else: props[current_key] = val
            if isinstance(val, bytes) and tag in [4, 8, 9, 11, 21]:
                cls.deep_flatten(val, props)
        return props

def audit_312():
    path = "/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet312.cmodel"
    with zipfile.ZipFile(path, 'r') as zf:
        content = zf.read('CompDesc.model')
    
    # Split by module tag (Tag 5)
    root_items = BinaryScraper.decode_stream(content)
    print("\n" + "="*80)
    print(f"AMR STUDIO PRO V4 - 312 MODEL ATOMIC AUDIT REPORT")
    print("="*80 + "\n")

    for idx, (tag, val) in enumerate(root_items):
        if tag == 5:
            # val is the module block
            props = BinaryScraper.deep_flatten(val)
            
            name = props.get("module_name", "Unknown")
            m_type = props.get("main_module_type", "unknown")
            sub_type = props.get("sub_module_type", "unknown")
            uid = props.get("module_uuid", "N/A")
            parent = props.get("parentNodeUuid", "Root")
            
            print(f"📦 MODULE [{idx}]: {name}")
            print(f"   ├─ ID: {uid}")
            print(f"   ├─ Type: {m_type} / {sub_type}")
            print(f"   ├─ Topology: Parent -> {parent}")
            
            # Installation Pose
            poses = {k: v for k, v in props.items() if "Coord" in k}
            if poses: print(f"   ├─ Pose: {poses}")
            
            # Electrical Attributes
            elec = {k: v for k, v in props.items() if k in ['ipAddress', 'port', 'nodeId', 'can_bus_id', 'baudrate']}
            if elec: print(f"   ├─ Electrical: {elec}")
            
            # Other critical attributes
            others = {k: v for k, v in props.items() if k not in list(poses.keys()) + list(elec.keys()) + ['module_name', 'module_uuid', 'main_module_type', 'sub_module_type', 'parentNodeUuid']}
            if others:
                # Prune others for display
                pruned = {k: v for k, v in others.items() if not isinstance(v, str) or len(v) < 50}
                print(f"   └─ Props: {list(pruned.keys())[:10]}...")
            print("-" * 60)

if __name__ == "__main__":
    audit_312()
