import os, sys, json, argparse, struct
from collections import OrderedDict

# --- Low Level Protobuf Binary Encoding ---

def encode_varint(n):
    if n < 0: n += (1 << 64)
    res = bytearray()
    while True:
        towrite = n & 0x7f
        n >>= 7
        if n: res.append(towrite | 0x80)
        else: res.append(towrite); break
    return res

def encode_fixed64(f): return struct.pack('<d', float(f))
def encode_tag(tag, wire_type): return encode_varint((int(tag) << 3) | wire_type)

# --- Mapping Configuration ---

FIELD_ORDER = ["1", "2", "3", "4", "5", "10", "11", "12", "13", "14", "17", "20", "21", "30", "35", "45", "50", "51", "52", "53", "54", "55", "56", "57", "8", "9"]

TYPE_VAL_MAPS = {
    'comp': { "DATA_STRING": 1, "DATA_INT32": 2, "DATA_DOUBLE": 10, "DATA_COMBOX": 11, "DATA_FIXED_E": 12, "DATA_BOOL": 13 },
    'abi': { "STRING_E": 1, "INT32_E": 2, "DOUBLE_E": 10, "UINT32_E": 11, "BOOL_E": 5, "FIXED_E": 20 },
    'func': { "STRING_E": 1, "INT32_E": 2, "DOUBLE_E": 4, "UINT32_E": 11, "BOOL_E": 5, "FIXED_E": 20 }
}

TAG_MAP = {
    "key": "1", "type": "2", "desc": "3", "interfaceUuid": "5",
    "interfaceAttrs": "8", "interfaceParams": "9", "stringValue": "10",
    "doubleValue": "17", "doubleMaxvalue": "35", "doubleMinvalue": "45",
    "int32Value": "13", "boolValue": "14", "uint32Value": "11",
    "comboType": "21", "unit": "50", "boolParse": "52", "boolHide": "53",
    "boolNoeditable": "54", "boolMustfill": "55", "boolBasic": "56",
    # Structure mapping (Contextual based on parent)
    "moreModuleInfo": "5", "moduleGroupName": "1", "moduleComponets": "4",
    "generalAttr": "1", "privateAttr": "4", "interfaceAbility": "2", 
    "interfaceParams": "3", "structParam": "5", "moduleShape": "13",
    "moduleName": "1", "moduleUuid": "10", "moduleDesc": "51", "versionInfo": "2",
    "sizeLen": "1", "sizeWidth": "2", "sizeHeight": "3", "box": "1",
    "componentAbility": "11", "functionAbility": "12", "childFunction": "11",
    "typeKey": "1", "typeDesc": "2", "typeGroups": "3", "combName": "1",
    "interfaceParamsArray": "1", "function": "12"
}

def serialize_any_msg(payload, m_type='comp', depth=0):
    if depth > 100: print("Recursion depth exceeded!"); return bytearray()
    if not isinstance(payload, dict): return bytearray()
    res = bytearray()
    # Prioritize FIELD_ORDER for bit-perfection
    t_list = [t for t in FIELD_ORDER if t in payload] + [k for k in payload if k not in FIELD_ORDER]
    for tag in t_list:
        val_list = payload[tag]
        if not isinstance(val_list, list): val_list = [val_list]
        for v in val_list:
            if tag in ["52", "53", "54", "55", "56"] or (tag == "13" and isinstance(v, bool)) or (tag == "5" and isinstance(v, bool)):
                res += encode_tag(tag, 0); res += encode_varint(1 if v else 0)
            elif tag in ["2", "11", "13", "30"] and not isinstance(v, (dict, list)):
                if isinstance(v, str) and not v.isdigit(): # Tag 2 version/type string
                    res += encode_tag(tag, 2); b = v.encode('utf-8'); res += encode_varint(len(b)); res += b
                else: res += encode_tag(tag, 0); res += encode_varint(int(v))
            elif tag in ["12", "17", "35", "45"] and isinstance(v, (float, int)):
                res += encode_tag(tag, 1); res += encode_fixed64(v)
            elif isinstance(v, str):
                res += encode_tag(tag, 2); b = v.encode('utf-8'); res += encode_varint(len(b)); res += b
            elif isinstance(v, dict):
                res += encode_tag(tag, 2); inner = serialize_any_msg(v, m_type, depth + 1)
                res += encode_varint(len(inner)); res += inner
    return res

def map_recursive(d, m_type):
    if not isinstance(d, dict): return d
    res = OrderedDict(); t_map = TYPE_VAL_MAPS.get(m_type, {})
    for k, v in d.items():
        tag = TAG_MAP.get(k, k)
        val = v[0] if isinstance(v, list) and len(v)>0 and not isinstance(v[0], dict) else v
        if k == "type" and isinstance(val, str) and val in t_map: res[tag] = t_map[val]; continue
        if k == "unit":
            if isinstance(v, str) and not v.isdigit(): res["50"] = v
            else: res["50"] = int(v or 0)
            continue
        if isinstance(v, list): res[tag] = [map_recursive(i, m_type) for i in v]
        elif isinstance(v, dict): res[tag] = map_recursive(v, m_type)
        else: res[tag] = v
    return res

def serialize_model(inp_json, outp_model):
    with open(inp_json, 'r', encoding='utf-8') as f: data = json.load(f, object_pairs_hook=OrderedDict)
    fn = os.path.basename(inp_json).lower(); res_bin = bytearray()
    
    # Standard mapping for all types since TAG_MAP is now comprehensive
    m_type = 'comp' if 'compdesc' in fn else ('abi' if 'abiset' in fn else 'func')
    mapped_payload = map_recursive(data, m_type)
    
    # Special handling for CompDesc version string at root
    if "compdesc" in fn and "version" in data:
        # Actually CompDesc root has no version, only inner components do.
        pass
    elif "funcdesc" in fn and "version" in data:
        res_bin += encode_tag(1, 2); b = data["version"].encode('utf-8')
        res_bin += encode_varint(len(b)); res_bin += b
        # Continue with mapped_payload (Tag 1 version already handled)
        if "1" in mapped_payload: del mapped_payload["1"]

    res_bin += serialize_any_msg(mapped_payload, m_type)
    with open(outp_model, 'wb') as f: f.write(res_bin)

if __name__ == "__main__":
    p = argparse.ArgumentParser(); p.add_argument("input"); p.add_argument("-o", "--output"); args = p.parse_args()
    serialize_model(args.input, args.output if args.output else args.input.replace(".json", ".model"))
