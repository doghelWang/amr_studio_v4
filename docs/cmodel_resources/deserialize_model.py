import os, sys, json, argparse, subprocess, re, struct
from collections import OrderedDict

def unescape_protoc(s):
    if not isinstance(s, str): return s
    s = s.strip()
    if s.startswith('"') and s.endswith('"'): s = s[1:-1]
    def ro(m): return chr(int(m.group(1), 8))
    s = re.sub(r'\\+([0-7]{3})', ro, s)
    s = s.replace('\\"', '"').replace('\\\\', '\\').replace('\\n', '\n').replace('\\t', '\t')
    try: return s.encode('latin-1').decode('utf-8')
    except: return s

def parse_msg(text):
    res = OrderedDict(); stack = [(res, -1)]
    for line_raw in text.splitlines():
        if not line_raw.strip(): continue
        indent = len(line_raw) - len(line_raw.lstrip())
        line = line_raw.strip()
        while indent <= stack[-1][1] and len(stack) > 1: stack.pop()
        m_msg = re.search(r'(\d+)[:\s]*[\{<]', line); m_val = re.search(r'(\d+):\s*(.*)', line)
        if m_msg:
            tag = m_msg.group(1); sub = OrderedDict()
            if tag not in stack[-1][0]: stack[-1][0][tag] = []
            stack[-1][0][tag].append(sub); stack.append((sub, indent))
        elif m_val:
            tag, val = m_val.group(1), m_val.group(2).strip()
            while val and val[-1] in ['}', '>', ' ']: val = val[:-1]
            if tag not in stack[-1][0]: stack[-1][0][tag] = []
            final = unescape_protoc(val)
            try:
                if isinstance(final, str) and ('.' in final or 'e' in final.lower()) and not final.startswith('0x'): final = float(final)
                else: final = int(str(final), 0)
            except: pass
            stack[-1][0][tag].append(final)
    return res

TAG_TO_NAME = {
    "1": "key", "2": "type", "3": "desc", "4": "desc", "5": "interfaceUuid",
    "8": "interfaceAttrs", "9": "interfaceParams", "10": "stringValue",
    "11": "uint32Value", "12": "defaultValue", "13": "int32Value", "14": "boolValue",
    "17": "doubleValue", "21": "comboType", "30": "enumValue", "35": "doubleMaxvalue",
    "45": "doubleMinvalue", "50": "unit", "51": "desc", "52": "boolParse",
    "53": "boolHide", "54": "boolNoeditable", "55": "boolMustfill", "56": "boolBasic", "57": "fixedSource"
}

GEN_ATTR_TAGS = {
    "1": "moduleName",
    "2": "moduleUuid",
    "3": "moduleShape",
    "5": "versionInfo",
    "7": "subSysType",
    "8": "mainModuleType",
    "9": "subModuleType",
    "10": "venderName",
    "11": "moduleDscType",
    "12": "moduleIcon",
    "20": "extendParams"
}

def i2str(i):
    if not isinstance(i, (int, str)): return str(i)
    try:
        val = int(str(i), 0)
        if val == 846409581: return "mm/s2"
        if val == 1932488045: return "mm/s"
        return struct.pack('<I', val & 0xFFFFFFFF).decode('ascii', errors='ignore').rstrip('\x00')
    except: return str(i)

def i2d(i):
    try:
        val = int(str(i), 0)
        if val < 10**10: return val
        return struct.unpack('>d', struct.pack('>Q', val))[0]
    except: return i

def s_val(v):
    if v is None: return ""
    if isinstance(v, dict):
        if not v: return ""
        for t in ["1", "51", "12", "13", "11", "10", "2"]:
            if t in v and v[t]: return s_val(v[t][0])
        return v
    return str(v).strip('"')

def map_c_prop(obj, tag_map=TAG_TO_NAME):
    if not isinstance(obj, dict): return obj
    # Penetrate tag 1 if it's a wrapper (common in some proto patterns)
    # while list(obj.keys()) == ["1"] and isinstance(obj["1"][0], dict): obj = obj["1"][0]
    
    p = OrderedDict()
    for t, v_list in obj.items():
        name = tag_map.get(t, t); v = v_list[0]
        if t == "21" and isinstance(v, dict):
            ct = OrderedDict([("typeKey",s_val(v.get("1",[0])[0])), ("typeDesc",s_val(v.get("2",[0])[0]))])
            ct["typeGroups"] = [OrderedDict([("key",s_val(x.get("1",[0])[0])), ("desc",s_val(x.get("2",[0])[0]))]) for x in v.get("3", []) if isinstance(x, dict)]
            p[name] = ct
        elif t in ["52","53","54","55","56","31","32","33","34"] and not isinstance(v, dict): 
            p[name] = str(v) == "1" or str(v).lower() == "true"
        elif t in ["12","17","35","45"]: p[name] = i2d(v)
        elif isinstance(v, dict):
            res_list = [map_c_prop(x, TAG_TO_NAME) for x in v_list if isinstance(x, dict)]
            # If it's a known single message field, don't return a list
            if name in ["moduleName", "moduleUuid", "mainModuleType", "subModuleType", "moduleIcon", "subSysType", "venderName", "moduleDscType", "versionInfo"]:
                p[name] = res_list[0] if res_list else None
            else:
                p[name] = res_list
        else: p[name] = i2str(v) if t == "50" else s_val(v)
    return p

def deserialize(inp, outp):
    fn = os.path.basename(inp).lower()
    try:
        text = subprocess.check_output(f"protoc --decode_raw < \"{inp}\"", shell=True).decode("utf-8")
    except Exception as e:
        # Fallback if protoc fails or no input
        print(f"Error decoding {inp}: {e}")
        return
        
    msg = parse_msg(text)
    m_type = 'comp' if 'comp' in fn else ('abi' if 'abi' in fn else 'func')
    
    if m_type == 'func':
        res = OrderedDict([("version", s_val(msg.get("1",["V1.0"])[0])), ("function", [])])
        for f in msg.get("12", []):
            if not isinstance(f, dict): continue
            fi = OrderedDict([("type",s_val(f.get("1",[0])[0])), ("desc",s_val(f.get("51", f.get("2", [""]))[0])), ("childFunction",[])])
            for cf in f.get("11", []):
                if not isinstance(cf, dict): continue
                cci = OrderedDict([("type",s_val(cf.get("1",[0])[0])), ("desc", s_val(cf.get("51", cf.get("2", [""]))[0])), ("attr", [])])
                cci["attr"] = [map_c_prop(a) for t in ["10", "11"] for a in cf.get(t, []) if isinstance(a, dict)]
                fi["childFunction"].append(cci)
            res["function"].append(fi)
    elif m_type == 'abi':
        res = OrderedDict([("version", s_val(msg.get("1",["V1.0"])[0])), ("componentAbility", []), ("functionAbility", [])])
        for ca in msg.get("11", []):
            if not isinstance(ca, dict): continue
            c = OrderedDict([("type",s_val(ca.get("1",[0])[0])), ("desc",s_val(ca.get("51", ca.get("2", [""]))[0])), ("childFunction",[])])
            for cf in ca.get("10", []):
                if not isinstance(cf, dict): continue
                cci = OrderedDict([("type",s_val(cf.get("1",[0])[0])), ("attr",[map_c_prop(a) for t in ["11", "10"] for a in cf.get(t, []) if isinstance(a, dict)])])
                [cci.update({k:s_val(cf.get(t,[""])[0])}) for k,t in [("desc","51"),("tips","3"),("category","4")] if t in cf]
                c["childFunction"].append(cci)
            res["componentAbility"].append(c)
        for fa in msg.get("12", []):
            if not isinstance(fa, dict): continue
            idx = OrderedDict([("type",s_val(fa.get("1",[0])[0])), ("childFunction",[])])
            for cf in fa.get("10", []):
                if not isinstance(cf, dict): continue
                idx["childFunction"].append(OrderedDict([("type",s_val(cf.get("1",[0])[0])), ("attr",[map_c_prop(a) for t in ["11", "10"] for a in cf.get(t, []) if isinstance(a, dict)])]))
            res["functionAbility"].append(idx)
    else: # compdesc
        res = OrderedDict([("version", s_val(msg.get("1",["V1.0"])[0])), ("moreModuleInfo", [])])
        for mmi in msg.get("5", []):
            if not isinstance(mmi, dict): continue
            group = OrderedDict([("moduleGroupName", s_val(mmi.get("1",[0])[0])), ("moduleComponets", [])])
            for cp in mmi.get("4", []):
                if not isinstance(cp, dict): continue
                comp = OrderedDict(); ga_raw = cp.get("1", [{}])[0]
                comp["generalAttr"] = map_c_prop(ga_raw, GEN_ATTR_TAGS)
                for kn, t in [("interfaceAbility", "2"), ("privateAttr", "4"), ("interfaceParams", "3"), ("structParam", "5")]:
                    if t in cp:
                        items = []
                        for obj in cp[t]:
                            if not isinstance(obj, dict): continue
                            c = OrderedDict([( "key", s_val(obj.get("1",[0])[0]) ), ( "desc", s_val(obj.get("2",[0])[0]) )])
                            for t2, n2 in [("3","attributes"),("10","interfaceParams"),("11","attributes"),("8","interfaceAttrs")]:
                                if t2 in obj:
                                    if n2 not in c: c[n2] = []
                                    c[n2].extend([map_c_prop(x) for x in obj[t2] if isinstance(x, dict)])
                            items.append(c)
                        comp[kn] = items
                group["moduleComponets"].append(comp)
            res["moreModuleInfo"].append(group)
    
    with open(outp, 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("input")
    p.add_argument("-o", "--output")
    args = p.parse_args()
    deserialize(args.input, args.output if args.output else args.input + ".json")
