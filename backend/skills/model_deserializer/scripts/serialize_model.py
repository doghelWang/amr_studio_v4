import sys, json, struct, os, argparse
from collections import OrderedDict

TAG_MAP = {
    "version": "1", "componentAbility": "11", "functionAbility": "12", "function": "12",
    "type": "1", "desc": "51", "childFunction": "11", "attr": "10",
    "moreModuleInfo": "5", "moduleGroupName": "1", "moduleComponets": "4",
    "generalAttr": "1", "moduleName": "1", "moduleDesc": "3", "moduleUuid": "4",
    "versionInfo": "5", "module3dIcon": "6", "subSysType": "7", "mainModuleType": "8",
    "subModuleType": "9", "venderName": "10", "moduleDscType": "11",
    "moduleIcon": "12", "moduleShape": "13", "metadata": "20",
    "interfaceAbility": "2", "privateAttr": "4", "interfaceParams": "3", "structParam": "5",
    "key": "1", "tips": "3", "category": "4", "attributes": "3", "interfaceAttrs": "8",
    "stringValue": "10", "uint32Value": "11", "int32Value": "13", "boolValue": "14",
    "doubleValue": "17", "defaultValue": "12", "doubleMaxvalue": "35", "doubleMinvalue": "45",
    "unit": "50", "boolParse": "52", "boolHide": "53", "boolNoeditable": "54",
    "boolMustfill": "55", "boolBasic": "56", "enumValue": "30", "comboType": "21",
    "typeKey": "1", "typeDesc": "2", "typeGroups": "3", "comboxParam": "11",
    "combName": "1", "arrayAttr": "10", "attrParams": "11"
}

FIXED64_TAGS = ["12", "17", "35", "45"]

# Structural re-wrapping rules calibrated for test.cmodel
# L1: Group level (Tag 1 wrap)
# L2: Field level within components (Tag 1 wrap)
NEEDS_WRAP_L1 = ["generalAttr"]
NEEDS_WRAP_L2 = ["attributes", "interfaceAttrs", "interfaceParams", "attr", "attrParams"]
NEEDS_WRAP_SUB_L2 = ["moduleName", "moduleDesc", "moduleUuid", "versionInfo", "module3dIcon",
                     "subSysType", "mainModuleType", "subModuleType", "venderName", "moduleDscType",
                     "moduleIcon", "moduleShape", "metadata"]

def perform_mapping(payload, k_parent=None):
    if not isinstance(payload, (dict, list)): return payload
    if isinstance(payload, list):
        items = [perform_mapping(x) for x in payload]
        if k_parent in NEEDS_WRAP_L2:
            return [OrderedDict([("1", [x])]) for x in items]
        return items
    
    res = OrderedDict()
    for k, v in payload.items():
        t = TAG_MAP.get(k, k); mapped_v = perform_mapping(v, k)
        if k in NEEDS_WRAP_L1 or k in NEEDS_WRAP_SUB_L2:
            mapped_v = OrderedDict([("1", [mapped_v])])
        if t not in res: res[t] = []
        if isinstance(mapped_v, list): res[t].extend(mapped_v)
        else: res[t].append(mapped_v)
    return res

def leb128_encode(i):
    if i < 0: i += (1 << 64)
    res = bytearray()
    while True:
        byte = i & 0x7f; i >>= 7
        if i == 0: res.append(byte); break
        res.append(byte | 0x80)
    return bytes(res)

def serialize_any_msg(payload):
    buf = b""; t_keys = sorted([k for k in payload.keys() if k.isdigit()], key=int)
    for t in t_keys:
        tag = int(t)
        for val in payload[t]:
            if isinstance(val, (dict, OrderedDict)):
                inner = serialize_any_msg(val)
                buf += leb128_encode((tag << 3) | 2) + leb128_encode(len(inner)) + inner
            elif isinstance(val, str):
                s_bytes = val.encode('utf-8')
                buf += leb128_encode((tag << 3) | 2) + leb128_encode(len(s_bytes)) + s_bytes
            elif isinstance(val, bool):
                buf += leb128_encode((tag << 3) | 0) + (b'\x01' if val else b'\x00')
            elif t in FIXED64_TAGS or isinstance(val, float):
                buf += leb128_encode((tag << 3) | 1) + struct.pack('<d', float(val))
            elif isinstance(val, int):
                buf += leb128_encode((tag << 3) | 0) + leb128_encode(val)
    return buf

def serialize_model(inp, outp):
    with open(inp, 'r', encoding='utf-8') as f: data = json.load(f, object_pairs_hook=OrderedDict)
    mapped = perform_mapping(data); binary = serialize_any_msg(mapped)
    with open(outp, 'wb') as f: f.write(binary)

if __name__ == "__main__":
    p = argparse.ArgumentParser(); p.add_argument("input"); p.add_argument("-o", "--output"); args = p.parse_args()
    serialize_model(args.input, args.output if args.output else args.input + ".model")
