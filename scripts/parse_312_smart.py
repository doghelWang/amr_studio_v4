import os
import zipfile
import tempfile
import struct
import json
import blackboxprotobuf
from pathlib import Path

# --- Helper Functions ---
def fixed64_to_float(val):
    if not isinstance(val, int): return val
    return struct.unpack('<d', struct.pack('<Q', val))[0]

def decode_str(val):
    if isinstance(val, (bytes, bytearray)):
        try: return val.decode('utf-8').strip('\x00')
        except: return str(val)
    return val

class SmartAMRParser:
    def __init__(self):
        self.lib_path = Path("docs/参考信息/ModuleLibrary")
        self.board_path = self.lib_path / "board_desc"
        self.attr_path = self.lib_path / "ModuleAttrTem"
        self.schema_path = Path("backend/templates/CompDesc.model")
        self.templates = {}
        self._load_templates()

    def _load_templates(self):
        """Pre-load hardware spec templates to provide semantic context."""
        # Load MCU/Board specs
        for json_file in self.board_path.rglob("*.json"):
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    self.templates.update(json.load(f))
            except: pass

    def parse(self, cmodel_path):
        print(f"🔍 Analyzing {cmodel_path} with Semantic Intelligence...")
        
        with tempfile.TemporaryDirectory() as tmp_dir:
            with zipfile.ZipFile(cmodel_path, 'r') as zf:
                zf.extractall(tmp_dir)
            
            # 1. Load Protobuf Schema
            with open(self.schema_path, "rb") as f:
                _, schema = blackboxprotobuf.decode_message(f.read())
            
            # 2. Decode CompDesc
            with open(Path(tmp_dir) / 'CompDesc.model', 'rb') as f:
                msg, _ = blackboxprotobuf.decode_message(f.read(), schema)

            modules = msg.get('5', [])
            if not isinstance(modules, list): modules = [modules]

            print(f"\n[REPORT] Robot Configuration Summary (Found {len(modules)} Modules)")
            print("="*80)

            # Build a lookup table for topology
            module_map = {}
            for mod in modules:
                name = decode_str(mod.get('1', 'Unknown'))
                configs = mod.get('4', [])
                if not isinstance(configs, list): configs = [configs]
                if not configs: continue
                
                meta_data = configs[0].get('1', {})
                if isinstance(meta_data, list) and len(meta_data) > 0:
                    meta = meta_data[0]
                else:
                    meta = meta_data
                
                uuid_val = decode_str(meta.get('4', {}).get('10', 'Unknown-UUID'))
                m_type = decode_str(meta.get('8', {}).get('21', {}).get('1', 'Unknown'))
                module_map[uuid_val] = {"name": name, "type": m_type}

            # Detail Analysis
            for mod in modules:
                name = decode_str(mod.get('1', 'Unknown'))
                configs = mod.get('4', [])
                if not isinstance(configs, list): configs = [configs]
                if not configs: continue
                config = configs[0]
                
                meta_data = config.get('1', {})
                if isinstance(meta_data, list) and len(meta_data) > 0:
                    meta = meta_data[0]
                else:
                    meta = meta_data
                
                m_type = decode_str(meta.get('8', {}).get('21', {}).get('1', 'Unknown'))
                model_name = decode_str(meta.get('8', {}).get('1', 'Unknown'))
                
                print(f"\n📦 MODULE: {name}")
                print(f"   ├─ Class: {m_type}")
                print(f"   ├─ Hardware Spec: {model_name}")
                
                # Check against board_desc library
                if model_name in self.templates:
                    spec = self.templates[model_name]
                    print(f"   ├─ [Library Match] Confirmed hardware resources for {model_name}")

                # Parse Attributes by Category
                prop_groups = config.get('2', [])
                if not isinstance(prop_groups, list): prop_groups = [prop_groups]
                
                for group in prop_groups:
                    g_name = decode_str(group.get('2', 'Attr'))
                    print(f"   ├─ ⚙️  Group: {g_name}")
                    items = group.get('3', [])
                    if not isinstance(items, list): items = [items]
                    for item in items:
                        k = decode_str(item.get('1', ''))
                        v = item.get('3', item.get('4', decode_str(item.get('5', ''))))
                        if isinstance(v, int) and v > 0xFFFFFFFF: v = fixed64_to_float(v)
                        print(f"   │   ├── {k}: {v}")

                # Electrical Connectivity
                interfaces = config.get('4', [])
                if not isinstance(interfaces, list): interfaces = [interfaces]
                if interfaces and interfaces[0]:
                    print(f"   ├─ 🔌 Electrical Connections:")
                    for iface in interfaces:
                        if_name = decode_str(iface.get('1', ''))
                        if_type = decode_str(iface.get('2', ''))
                        target_uuid = decode_str(iface.get('6', ''))
                        target_name = module_map.get(target_uuid, {}).get('name', f"ID:{target_uuid[:8]}") if target_uuid else "None"
                        print(f"   │   └── Port {if_name} ({if_type}) ──► {target_name}")

                # 6D Pose Data
                struct_params = config.get('5', [])
                if not isinstance(struct_params, list): struct_params = [struct_params]
                if struct_params and struct_params[0]:
                    print(f"   └─ 📍 6D Pose (Mounting):")
                    # Mapping known tags for Structural Params
                    # Tag 17/45 usually contains the coordinate double values
                    pass

if __name__ == "__main__":
    parser = SmartAMRParser()
    parser.parse("docs/ModelSet312.cmodel")
