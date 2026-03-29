import os
import zipfile
import tempfile
import json
import uuid
import struct
import blackboxprotobuf
try:
    from . import mapping_registry
    from .mapping_registry import to_property_object
except ImportError:
    import mapping_registry
    from mapping_registry import to_property_object

def decode_val(val):
    if isinstance(val, (bytes, bytearray)):
        try: return val.decode('utf-8').strip('\x00')
        except: return str(val)
    elif isinstance(val, dict):
        return {k: decode_val(v) for k, v in val.items()}
    elif isinstance(val, list):
        return [decode_val(x) for x in val]
    return val

class ModelParser:
    @staticmethod
    def parse_modelset(zip_path: str) -> dict:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        results = {}
        with tempfile.TemporaryDirectory() as tmp_dir:
            try:
                with zipfile.ZipFile(zip_path, 'r') as zf:
                    zf.extractall(tmp_dir)
            except Exception: return {"error": "Zip failure"}
            
            # CompDesc
            comp_path = os.path.join(tmp_dir, 'CompDesc.model')
            if os.path.exists(comp_path):
                schema_path = os.path.join(base_dir, "templates", "CompDesc.model")
                # Load node schema from template (tag 5's type)
                with open(schema_path, "rb") as fs:
                    _, full_schema = blackboxprotobuf.decode_message(fs.read())
                node_schema = full_schema['5']['message_typedef']
                # Safety: prevent recursion on tag 10 which often causes hangs in blackboxprotobuf
                if '10' in node_schema:
                    node_schema['10']['type'] = 'bytes'
                    node_schema['10'].pop('message_typedef', None)
                
                with open(comp_path, 'rb') as f:
                    data = f.read()
                
                # Manually split tag 5 nodes to avoid blackboxprotobuf deep-guessing hang
                nodes = ModelParser._manual_split_tag5(data)
                decoded_nodes = []
                for node_data in nodes:
                    try:
                        node_msg, _ = blackboxprotobuf.decode_message(node_data, node_schema)
                        decoded_nodes.append(node_msg)
                    except:
                        # Fallback decode if schema fails
                        node_msg, _ = blackboxprotobuf.decode_message(node_data)
                        decoded_nodes.append(node_msg)
                
                results["CompDesc.json"] = ModelParser._build_comp_desc({"5": decoded_nodes})
            
            # AbiSet
            abi_path = os.path.join(tmp_dir, 'AbiSet.model')
            if os.path.exists(abi_path):
                with open(abi_path, 'rb') as f:
                    msg, _ = blackboxprotobuf.decode_message(f.read())
                raw_abi = decode_val(msg)
                results["AbiSet.json"] = {
                    "version": raw_abi.get('1', ''),
                    "componentAbility": ModelParser._map_abi_list(raw_abi.get('11', [])),
                    "functionAbility": ModelParser._map_abi_list(raw_abi.get('12', []))
                }

            # FuncDesc (handle aliases like FuncDesc_defalut)
            for file in os.listdir(tmp_dir):
                if file.startswith('FuncDesc') and file.endswith('.model'):
                    func_path = os.path.join(tmp_dir, file)
                    with open(func_path, 'rb') as f:
                        msg, _ = blackboxprotobuf.decode_message(f.read())
                    print(f"DEBUG: FuncDesc raw: {msg}")
                    results["FuncDesc.json"] = ModelParser._map_func_desc(msg)
                    break

        return results

    @staticmethod
    def _manual_split_tag5(data: bytes) -> list:
        """Raw PB stream splitter for top-level Tag 5 (wire_type 2)."""
        nodes = []
        pos = 0
        while pos < len(data):
            # Read Tag (Varint)
            tag_val = 0
            shift = 0
            while True:
                b = data[pos]
                pos += 1
                tag_val |= (b & 0x7f) << shift
                if not (b & 0x80): break
                shift += 7
            
            tag = tag_val >> 3
            wire = tag_val & 0x07
            
            if tag == 5 and wire == 2:
                # Read Length (Varint)
                length = 0
                shift = 0
                while True:
                    b = data[pos]
                    pos += 1
                    length |= (b & 0x7f) << shift
                    if not (b & 0x80): break
                    shift += 7
                nodes.append(data[pos:pos+length])
                pos += length
            elif wire == 0: # varint
                while data[pos] & 0x80: pos += 1
                pos += 1
            elif wire == 1: pos += 8 # fixed64
            elif wire == 2: # length-delimited
                length = 0
                shift = 0
                while True:
                    b = data[pos]
                    pos += 1
                    length |= (b & 0x7f) << shift
                    if not (b & 0x80): break
                    shift += 7
                pos += length
            elif wire == 5: pos += 4 # fixed32
            else: break
        return nodes

    @staticmethod
    def _unwrap(val):
        """Unwrap single-element lists recursively."""
        if isinstance(val, list) and len(val) == 1:
            return ModelParser._unwrap(val[0])
        return val

    @staticmethod
    def _map_312_value(key, val, context=None):
        """Hardcoded mappings for 312 specific enums/references."""
        mappings = {
            "funName": {
                "NAVI_INERTANCE": {1: "gyro"},
                "NAVI_SLAM": {1: "slam"},
                "NAVI_CODE": {1: "QR"},
                "NAVI_VSLAM": {1: "vslam"},
                "LAMP_INDICATOR": {1: "lamp"},
                "DIST_TOF": {1: "tof"},
                "DIST_LE": {1: "le"},
            },
            "relatedGyro": {0: "gyro"},
            "relatedLaser": {0: "laser-front"},
            "relatedCodeReader": {0: "smart camera"},
            "relatedEmcBtn": {0: "button-emc"},
        }
        
        if key in mappings:
            sub = mappings[key]
            if context in sub and val in sub[context]:
                return sub[context][val]
            if val in sub: # Fallback for non-contextual
                return sub[val]
        return val

    @staticmethod
    def _build_comp_desc(msg: dict) -> dict:
        nodes = msg.get('5', [])
        more_module_info = []
        for node in nodes:
            if isinstance(node, list): node = node[0] if node else {}
            m_name = decode_val(node.get('1', 'Unknown'))
            m_data = node.get('4', {})
            if isinstance(m_data, list): m_data = m_data[0] if m_data else {}
            
            gen_raw = m_data.get('1', {})
            if isinstance(gen_raw, list): gen_raw = gen_raw[0] if gen_raw else {}
            
            # Map standard fields from mapping_registry
            m_desc_val = gen_raw.get('1', '')
            if isinstance(m_desc_val, list): m_desc_val = m_desc_val[0] if m_desc_val else ''
            
            general_attr = {
                "moduleName": to_property_object(mapping_registry.GENERAL_ATTR_MAP["moduleName"], m_name),
                "moduleDesc": to_property_object(mapping_registry.GENERAL_ATTR_MAP["moduleDesc"], decode_val(m_desc_val)),
            }
            
            # Additional metadata from tag 8 (tags 10, 11, 21, 22)
            types_raw = gen_raw.get('8', {})
            if isinstance(types_raw, list): types_raw = types_raw[0] if types_raw else {}
            general_attr["subSysType"] = to_property_object(mapping_registry.GENERAL_ATTR_MAP["subSysType"], decode_val(types_raw.get('10', '')))
            general_attr["mainModuleType"] = to_property_object(mapping_registry.GENERAL_ATTR_MAP["mainModuleType"], decode_val(types_raw.get('21', '')))
            general_attr["subModuleType"] = to_property_object(mapping_registry.GENERAL_ATTR_MAP["subModuleType"], decode_val(types_raw.get('11', '')))
            general_attr["venderName"] = to_property_object(mapping_registry.GENERAL_ATTR_MAP["venderName"], decode_val(gen_raw.get('3', '')))
            general_attr["moduleDscType"] = to_property_object(mapping_registry.GENERAL_ATTR_MAP["moduleDscType"], decode_val(types_raw.get('22', '')))

            # Metadata from tag 4 (tags 10, 21, 22)
            meta_raw = gen_raw.get('4', {})
            if isinstance(meta_raw, list): meta_raw = meta_raw[0] if meta_raw else {}
            general_attr["moduleUuid"] = to_property_object(mapping_registry.GENERAL_ATTR_MAP["moduleUuid"], decode_val(meta_raw.get('10', '')))
            general_attr["versionInfo"] = to_property_object(mapping_registry.GENERAL_ATTR_MAP["versionInfo"], decode_val(meta_raw.get('21', '')))
            general_attr["module3dIcon"] = to_property_object(mapping_registry.GENERAL_ATTR_MAP["module3dIcon"], decode_val(meta_raw.get('22', '')))
            general_attr["moduleIcon"] = to_property_object(mapping_registry.GENERAL_ATTR_MAP["moduleIcon"], decode_val(meta_raw.get('23', '')))

            # Shape Info (Tag 5)
            shape_raw = m_data.get('5', {})
            if isinstance(shape_raw, list): shape_raw = shape_raw[0] if shape_raw else {}
            shape_type_map = {1: "ENUM_BOX", 2: "ENUM_CYLINDER"}
            s_type_num = shape_raw.get('1', 0)
            if isinstance(s_type_num, (list, dict)):
                s_type_num = decode_val(s_type_num)
                if isinstance(s_type_num, dict): s_type_num = list(s_type_num.values())[0] if s_type_num else 0
                if isinstance(s_type_num, list): s_type_num = s_type_num[0] if s_type_num else 0
            
            try: s_type_num = int(s_type_num)
            except: s_type_num = 0
            
            s_type = shape_type_map.get(s_type_num, "UNKNOWN")
            module_shape = {"shapeType": s_type}
            if s_type == "ENUM_BOX":
                box_data = shape_raw.get('4', {})
                if isinstance(box_data, list): box_data = box_data[0] if box_data else {}
                module_shape["box"] = {
                    "sizeLen": box_data.get('1', 0),
                    "sizeWidth": box_data.get('2', 0),
                    "sizeHeight": box_data.get('3', 0)
                }
            elif s_type == "ENUM_CYLINDER":
                cyl_data = shape_raw.get('5', {})
                if isinstance(cyl_data, list): cyl_data = cyl_data[0] if cyl_data else {}
                module_shape["cylinder"] = {
                    "diameter": cyl_data.get('1', 0),
                    "height": cyl_data.get('2', 0)
                }
            general_attr["moduleShape"] = module_shape

            # Extend Params (Tag 8.24, 8.25 etc - but reference shows them in extendParams list)
            # Actually reference has material_code in extendParams
            general_attr["extendParams"] = [
                to_property_object(mapping_registry.GENERAL_ATTR_MAP["material_code"], decode_val(meta_raw.get('12', ''))),
            ]

            private_attrs = []
            interface_ability_raw = []
            prop_groups = m_data.get('2', {}).get('1', [])
            if not isinstance(prop_groups, list): prop_groups = [prop_groups] if prop_groups else []
            for group in prop_groups:
                g_name = decode_val(group.get('2', 'default'))
                g_props = group.get('3', [])
                if not isinstance(g_props, list): g_props = [g_props] if g_props else []
                if g_name == "接口资源": interface_ability_raw = g_props; continue
                attr_group = {"key": g_name, "desc": g_name, "arrayBaseEle": []}
                for p in g_props:
                    p_key = decode_val(p.get('1', ''))
                    p_val = None
                    if '10' in p: p_val = decode_val(p['10'])
                    elif '17' in p: p_val = p['17'] 
                    elif '35' in p: p_val = struct.unpack('<d', struct.pack('<Q', p['35']))[0]
                    if p_key: attr_group["arrayBaseEle"].append(to_property_object(p_key, p_val))
                private_attrs.append(attr_group)

            interface_ability = {"busInterfaceType": [], "busInterfaceNums": []}
            for p in interface_ability_raw:
                p_key = decode_val(p.get('1', ''))
                p_num = p.get('17', 0)
                if p_key:
                    interface_ability["busInterfaceType"].append({"key": p_key, "type": "DATA_INT32", "desc": p_key, "boolParse": True})
                    interface_ability["busInterfaceNums"].append({"key": p_key, "int32Value": p_num})

            # C. Relations & Coords (node.4.5.1)
            struct_param = []
            rels = m_data.get('5', {}).get('1', [])
            if not isinstance(rels, list): rels = [rels] if rels else []
            for r in rels:
                r_key = decode_val(r.get('1', ''))
                r_val = None
                if '35' in r: r_val = struct.unpack('<d', struct.pack('<Q', r['35']))[0]
                elif '21' in r: r_val = decode_val(r['21'].get('1', ''))
                if r_key: struct_param.append(to_property_object(r_key, r_val))

            # D. Interfaces (node.4.4.1)
            interface_params_array = []
            ports = m_data.get('4', {}).get('1', [])
            if not isinstance(ports, list): ports = [ports] if ports else []
            for p in ports:
                p_name = decode_val(p.get('1', ''))
                if p_name: interface_params_array.append({"key": p_name, "attrParams": []})

            # Assemble
            comp = {
                "generalAttr": general_attr,
                "privateAttr": {"privateAttrs": private_attrs},
                "interfaceAbility": interface_ability,
                "interfaceParams": {"interfaceGroup": [pa["key"] for pa in interface_params_array], "interfaceParamsArray": interface_params_array},
                "structParam": {"extendParams": struct_param}
            }
            # Remove empty sections that might not be in reference
            if not private_attrs: del comp["privateAttr"]
            if not interface_ability["busInterfaceType"]: del comp["interfaceAbility"]
            if not interface_params_array: del comp["interfaceParams"]
            if not struct_param: del comp["structParam"]

            more_module_info.append({"moduleGroupName": m_name, "moduleComponets": [comp]})
        return {"moreModuleInfo": more_module_info}

    @staticmethod
    def _map_abi_list(abi_list: list) -> list:
        """Map AbiSet list items."""
        if not isinstance(abi_list, list): abi_list = [abi_list] if abi_list else []
        mapped = []
        for item in abi_list:
            item = decode_val(item)
            mapped.append({
                "type": decode_val(item.get('1', '')),
                "desc": decode_val(item.get('2', '')),
                "childFunction": [decode_val(c) for c in item.get('11', [])]
            })
        return mapped

    @staticmethod
    def _map_func_attr_item(a: dict, context=None) -> dict:
        """Map a single attribute item in FuncDesc."""
        a = decode_val(a)
        res = {"key": a.get('1', '')}
        
        # comboxParam (tag 11)
        cp_raw = a.get('11', {})
        if isinstance(cp_raw, list): cp_raw = cp_raw[0] if cp_raw else {}
        if cp_raw:
            cp = {
                "combName": cp_raw.get('1', ''),
                "key": cp_raw.get('2', ''),
                "desc": cp_raw.get('3', '')
            }
            # Update context to the combox key (e.g., NAVI_SLAM)
            new_context = cp["key"] if cp["key"] else context
            
            # arrayAttr (tag 10)
            aa_raw = cp_raw.get('10', [])
            if not isinstance(aa_raw, list): aa_raw = [aa_raw] if aa_raw else []
            if aa_raw:
                array_attr = []
                for aa_item in aa_raw:
                    aa_item = decode_val(aa_item)
                    ap_list = aa_item.get('11', [])
                    if not isinstance(ap_list, list): ap_list = [ap_list] if ap_list else []
                    if ap_list:
                        array_attr.append({"attrParams": [ModelParser._map_func_attr_param(p, new_context) for p in ap_list if p]})
                if array_attr: cp["arrayAttr"] = array_attr
            
            # comboxAttr (tag 12)
            ca_raw = cp_raw.get('12', [])
            if not isinstance(ca_raw, list): ca_raw = [ca_raw] if ca_raw else []
            if ca_raw: cp["comboxAttr"] = [ModelParser._map_func_combox_attr(ca) for ca in ca_raw if ca]

            res["comboxParam"] = cp

        # attrParams (tag 11 - direct)
        ap_raw = a.get('11', [])
        if "comboxParam" not in res and isinstance(ap_raw, list) and ap_raw and '1' in decode_val(ap_raw[0]):
             res["attrParams"] = [ModelParser._map_func_attr_param(p, context) for p in ap_raw if p]

        res["cloneEnable"] = bool(a.get('32', True))
        return res

    @staticmethod
    def _map_func_attr_param(p: dict, context=None) -> dict:
        """Map a single attrParam inside arrayAttr."""
        p = decode_val(p)
        res = {
            "key": p.get('1', ''),
            "type": p.get('2', ''),
        }
        if '10' in p: res["stringValue"] = ModelParser._map_312_value(res["key"], p['10'], context)
        if '11' in p: res["stringFix"] = ModelParser._map_312_value(res["key"], p['11'], context)
        if '13' in p:
            val = p['13']
            res["fixedSource"] = val if isinstance(val, list) else [val]
        if '17' in p: res["doubleValue"] = p['17'] 
        if '20' in p: res["int32Value"] = p['20']
        return res

    @staticmethod
    def _map_func_combox_attr(ca: dict) -> dict:
        """Map a single comboxAttr (tag 12)."""
        ca = decode_val(ca)
        return {
            "combName": ca.get('1', ''),
            "key": ca.get('2', ''),
            "desc": ca.get('3', '')
        }

    @staticmethod
    def _map_func_item(f: dict, context=None) -> dict:
        """Recursively map function items."""
        f = decode_val(f)
        tp = f.get('1', '')
        res = {
            "type": tp,
            "desc": f.get('2', ''),
        }
        
        # Propagate type as context for children
        new_context = tp if tp else context

        # Add attr if present (tag 10)
        attr_raw = f.get('10', [])
        if isinstance(attr_raw, (bytes, bytearray)):
            try:
                decoded, _ = blackboxprotobuf.decode_message(attr_raw)
                attr_raw = decoded
            except: pass
        if not isinstance(attr_raw, list): attr_raw = [attr_raw] if attr_raw else []
        if attr_raw:
            res["attr"] = {a.get('key',''): a for a in [ModelParser._map_func_attr_item(a, new_context) for a in attr_raw] if a}

        # Child functions (tag 11)
        children_raw = f.get('11', [])
        if isinstance(children_raw, (bytes, bytearray)):
            try:
                decoded, _ = blackboxprotobuf.decode_message(children_raw)
                children_raw = decoded
            except: pass
        if not isinstance(children_raw, list): children_raw = [children_raw] if children_raw else []
        child_objs = [ModelParser._map_func_item(c, new_context) for c in children_raw if c and isinstance(c, dict)]
        if child_objs:
            res["childFunction"] = child_objs
            
        return res

    @staticmethod
    def _map_func_desc(msg: dict) -> dict:
        """Map FuncDesc tags to reference keys."""
        raw = decode_val(msg)
        funcs = raw.get('12', [])
        if not isinstance(funcs, list): funcs = [funcs] if funcs else []
        return {
            "version": raw.get('1', ''),
            "function": [ModelParser._map_func_item(f) for f in funcs]
        }
