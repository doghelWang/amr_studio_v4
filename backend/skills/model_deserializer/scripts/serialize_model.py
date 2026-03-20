import os, sys, json, argparse, struct

# Increased recursion safety
sys.setrecursionlimit(5000)

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

FIELD_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "17", "20", "21", "30", "35", "40", "45", "50", "51", "52", "53", "54", "55", "56", "57"]
TAG_MAP = {
    "key": "1", "type": "2", "desc": "3", "interfaceUuid": "5",
    "attributes": "3", "interfaceParams": "10", "interfaceParamsArray": "1",
    "interfaceAttrs": "8", "stringValue": "10", "uint32Value": "11",
    "int32Value": "13", "boolValue": "14", "doubleValue": "17",
    "doubleMaxvalue": "35", "doubleMinvalue": "45", "defaultValue": "12",
    "unit": "50", "boolParse": "52", "boolHide": "53",
    "boolNoeditable": "54", "boolMustfill": "55", "boolBasic": "56",
    "enumValue": "30", "comboType": "21", "typeKey": "1", "typeDesc": "2",
    "typeGroups": "3", "moreModuleInfo": "5", "moduleGroupName": "1",
    "moduleComponets": "4", "generalAttr": "1", "privateAttr": "4",
    "interfaceAbility": "2", "structParam": "5", "moduleName":"1",
    "moduleDesc":"3", "moduleUuid":"4", "versionInfo":"5", "module3dIcon":"6",
    "subSysType":"7", "mainModuleType":"8", "subModuleType":"9", "venderName":"10",
    "moduleDscType":"11", "moduleIcon":"12", "moduleShape":"13", "metadata":"20",
    "box":"11", "sizeLen":"1", "sizeWidth":"2", "sizeHeight":"3"
}
TAG_ORDER_CACHE = {t: i for i, t in enumerate(FIELD_ORDER)}
TYPE_VAL_MAPS = {
    'comp': { "DATA_STRING": 1, "DATA_INT32": 2, "DATA_DOUBLE": 10, "DATA_COMBOX": 11, "DATA_FIXED_E": 12, "DATA_BOOL": 13 },
    'abi': { "STRING_E": 1, "INT32_E": 2, "DOUBLE_E": 10, "UINT32_E": 11, "BOOL_E": 5, "FIXED_E": 20 },
    'func': { "STRING_E": 1, "INT32_E": 2, "DOUBLE_E": 4, "UINT32_E": 11, "BOOL_E": 5, "FIXED_E": 20 }
}

def serialize_any_msg(payload, m_type='comp', cache=None):
    if not isinstance(payload, dict): return bytearray()
    if cache is None: cache = {}
    obj_id = id(payload)
    if obj_id in cache: return cache[obj_id]
    
    res = bytearray()
    t_keys = sorted([k for k in payload.keys() if k.isdigit()], key=lambda x: TAG_ORDER_CACHE.get(x, 999))
    for tag in t_keys:
        v_list = payload[tag]
        if not isinstance(v_list, list): v_list = [v_list]
        for v in v_list:
            if tag in ["52", "53", "54", "55", "56", "14", "5", "13", "11", "2", "30", "40", "1"]:
                if not isinstance(v, (dict, list)):
                    if v is True: val = 1
                    elif v is False: val = 0
                    elif isinstance(v, int): val = v
                    elif isinstance(v, str) and v.isdigit(): val = int(v)
                    else: val = 0
                    res += encode_tag(tag, 0); res += encode_varint(val)
                    continue
            if isinstance(v, (int, float)) and tag in ["12", "17", "35", "45"]:
                res += encode_tag(tag, 1); res += encode_fixed64(float(v))
            elif isinstance(v, (str, bytes)):
                res += encode_tag(tag, 2); b = v.encode('utf-8') if isinstance(v, str) else v; res += encode_varint(len(b)); res += b
            elif isinstance(v, dict):
                res += encode_tag(tag, 2); inner = serialize_any_msg(v, m_type, cache)
                res += encode_varint(len(inner)); res += inner
    
    cache[obj_id] = res
    return res

def perform_mapping(data, m_type):
    t_map_root = TYPE_VAL_MAPS.get(m_type, {})
    cache = {}
    def mapper(obj):
        if not isinstance(obj, dict): return obj
        obj_id = id(obj)
        if obj_id in cache: return cache[obj_id]
        res = {}
        for k, v in obj.items():
            tag = TAG_MAP.get(k, k)
            val = v if k != "type" or not isinstance(v, str) or v not in t_map_root else t_map_root[v]
            if tag not in res: res[tag] = []
            if isinstance(val, list):
                res[tag].extend([mapper(it) for it in val])
            elif isinstance(val, dict):
                res[tag].append(mapper(val))
            else:
                res[tag].append(val)
        cache[obj_id] = res
        return res
    return mapper(data)

def serialize_model(inp, outp):
    with open(inp, 'r', encoding='utf-8') as f: data = json.load(f)
    m_type = 'comp' if 'comp' in os.path.basename(inp).lower() else ('abi' if 'abi' in os.path.basename(inp).lower() else 'func')
    # Use global caching for linear structural performance
    m_tag = perform_mapping(data, m_type)
    res_bin = serialize_any_msg(m_tag, m_type, {})
    with open(outp, 'wb') as f: f.write(res_bin)

if __name__ == "__main__":
    p = argparse.ArgumentParser(); p.add_argument("input"); p.add_argument("-o", "--output"); args = p.parse_args()
    serialize_model(args.input, args.output if args.output else args.input.replace(".json", ".model"))
