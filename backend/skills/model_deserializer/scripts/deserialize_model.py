import os, sys, json, argparse, subprocess, re, struct
from collections import OrderedDict

def unescape_protoc(s_inp):
    if not isinstance(s_inp, str): return s_inp
    s_inp = s_inp.strip()
    while s_inp.startswith('"') and s_inp.endswith('"'): s_inp = s_inp[1:-1]
    def ro(m): return chr(int(m.group(1), 8))
    s_inp = re.sub(r'\\+([0-7]{3})', ro, s_inp)
    try: s_inp = s_inp.encode('latin-1').decode('utf-8')
    except: s_inp = s_inp.replace('\\"', '"').replace('\\\\', '\\')
    return s_inp.strip('"')

def parse_msg(text):
    res = OrderedDict(); stack = [res]; lines = text.splitlines()
    for line in lines:
        line = line.strip()
        if not line: continue
        if line == "}" or line == ">":
            if len(stack) > 1: stack.pop()
            continue
        m = re.match(r'^(\d+)[:\s]*[\{<](.*)$', line)
        if m:
            tag, rest = m.group(1), m.group(2).strip()
            sub = OrderedDict()
            if tag not in stack[-1]: stack[-1][tag] = []
            stack[-1][tag].append(sub); stack.append(sub)
            if rest and (rest.endswith("}") or rest.endswith(">")): stack.pop()
            continue
        m = re.match(r'^(\d+):\s*(.*)$', line)
        if m:
            tag, val = m.group(1), m.group(2).strip()
            if val.startswith('"'): val = unescape_protoc(val)
            else:
                try: val = float(val) if '.' in val else int(val, 0)
                except: pass
            if tag not in stack[-1]: stack[-1][tag] = []
            stack[-1][tag].append(val)
    return res

COMP_TAG_MAP = {
    "1": "key", "2": "type", "3": "desc", "4": "desc", "5": "interfaceUuid",
    "8": "interfaceAttrs", "9": "interfaceParams", "10": "stringValue",
    "17": "doubleValue", "35": "doubleMaxvalue", "45": "doubleMinvalue",
    "12": "defaultValue", "13": "int32Value", "14": "boolValue",
    "21": "comboType",
    "50": "unit", "51": "desc", "52": "boolParse", "53": "boolHide",
    "54": "boolNoeditable", "55": "boolMustfill", "56": "boolBasic",
    "57": "fixedSource", "20": "stringFix"
}

TYPE_MAPS = {
    'comp': { "1": "DATA_STRING", "2": "DATA_INT32", "3": "DATA_STRING", "4": "DATA_DOUBLE", "10": "DATA_DOUBLE", "11": "DATA_COMBOX", "12": "DATA_FIXED_E", "13": "DATA_BOOL", "20": "DATA_FIXED_E" },
    'abi': { "1": "STRING_E", "2": "INT32_E", "3": "STRING_E", "4": "DOUBLE_E", "10": "DOUBLE_E", "11": "UINT32_E", "13": "BOOL_E", "20": "FIXED_E" },
    'func': { "1": "STRING_E", "2": "INT32_E", "4": "DOUBLE_E", "10": "DOUBLE_E", "11": "UINT32_E", "13": "BOOL_E", "20": "FIXED_E" }
}

def i2str(i):
    if not isinstance(i, int): return str(i)
    if i == 846409581: return "mm/s2"
    if i == 1932488045: return "mm/s"
    try:
        b = struct.pack('<I', i & 0xFFFFFFFF)
        s = b.decode('ascii', errors='ignore').rstrip('\x00')
        if all(32 <= ord(c) < 127 for c in s) and len(s) > 1: return s
    except: pass
    return str(i)

def i2d(i):
    if not isinstance(i, int) or i < 10**10: return i
    try: return struct.unpack('>d', struct.pack('>Q', i))[0]
    except: return i

def s_val(v):
    if v is None: return ""
    if isinstance(v, (dict, OrderedDict)):
        for t in ["1", "51", "12", "13", "11", "10", "2"]:
            if str(t) in v: return s_val(v[str(t)][0])
        return str(v)
    if isinstance(v, int) and v == 1919906927: return "motor"
    return str(v).strip('"')

def g_v(obj, tag, default=None):
    if not isinstance(obj, dict) or str(tag) not in obj: return default
    return obj[str(tag)][0]

def m_comp_attr(obj, m_type='comp'):
    if not isinstance(obj, dict): return obj
    res = OrderedDict()
    if "1" in obj: res["key"] = s_val(obj["1"][0])
    raw_2 = g_v(obj, 2)
    t_map = TYPE_MAPS.get(m_type, {})
    if raw_2 is not None:
        if isinstance(raw_2, int) and str(raw_2) in t_map: res["type"] = t_map[str(raw_2)]
        else: res["type"] = s_val(raw_2)
    if "3" in obj: res["desc"] = s_val(obj["3"][0])
    elif "4" in obj: res["desc"] = s_val(obj["4"][0])
    for tag, val_list in obj.items():
        if tag in ["1", "2", "3", "4"]: continue
        name = COMP_TAG_MAP.get(tag, tag)
        if name == "comboType":
            if not isinstance(val_list[0], dict): res[name] = val_list[0]; continue
            ct = OrderedDict(); first = val_list[0]
            ct["typeKey"] = s_val(g_v(first, 1)); ct["typeDesc"] = s_val(g_v(first, 2))
            ct["typeGroups"] = [OrderedDict([("key",s_val(g_v(x,1))), ("desc",s_val(g_v(x,2)))]) for x in first.get("3", [])]
            res["comboType"] = ct; continue
        if name in ["interfaceAttrs", "interfaceParams"]:
            if not isinstance(val_list[0], dict): res[name] = val_list[0]; continue
            ipa = [m_comp_attr(x, m_type) for x in val_list[0].get("1", [])]
            res[name] = OrderedDict([("interfaceParamsArray", ipa)]); continue
        val = val_list[0]
        if isinstance(val, dict):
            if tag == "50": res["unit"] = i2str(g_v(val, 13, ""))
            else:
                mapped_vals = [m_comp_attr(x, m_type) for x in val_list]
                res[name] = mapped_vals if len(mapped_vals) > 1 else mapped_vals[0]
        else:
            if tag in ["52", "53", "54", "55", "56"]: res[name] = bool(val)
            elif tag in ["12", "17", "35", "45"]:
                processed = i2d(val); final_name = name
                if res.get("type") in ["DATA_INT32", "INT32_E"]:
                    final_name = name.replace("double", "int32"); processed = int(processed)
                elif res.get("type") in ["DATA_DOUBLE", "DOUBLE_E"]: processed = float(processed)
                res[final_name] = processed
            elif tag == "13" and res.get("type") in ["DATA_INT32", "INT32_E"]: res["int32Value"] = int(val)
            elif tag == "11" and res.get("type") in ["UINT32_E"]: res["uint32Value"] = int(val)
            elif tag == "14": res["boolValue"] = bool(val)
            elif tag == "50": res["unit"] = i2str(val)
            else:
                if name not in res: res[name] = val
    return res

def map_leaf_attr(ap, m_type):
    if not isinstance(ap, dict): return ap
    rk = s_val(g_v(ap, 1)); v10, v11 = g_v(ap, 10), g_v(ap, 11)
    ai = OrderedDict(); ai["key"] = rk
    t_map = TYPE_MAPS.get(m_type, {})
    if (rk in ["funName", "stringValue"]) and (v11 or v10): ai["type"] = t_map.get("1", "STRING_E"); ai["stringValue"] = s_val(v11 or v10)
    elif (rk.startswith("related") or rk == "stringFix") and ("20" in ap or v11):
        ai["type"] = t_map.get("20", "FIXED_E"); ai["stringFix"] = s_val(g_v(ap, 20) or v11)
        if "21" in ap: ai["fixedSource"] = [s_val(x) for x in ap.get("21", [])]
    else:
        if v10: ts = str(v10); ai["type"] = t_map.get(ts, ts + "_E")
        if v11: ai["stringValue"] = s_val(v11)
        if "13" in ap: ai["boolValue"] = bool(ap["13"][0])
    if "5" in ap: ai["cloneEnable"] = bool(ap["5"][0])
    return ai

def m_abi_attr(obj, m_type):
    if not isinstance(obj, dict): return obj
    r = OrderedDict(); r["key"] = s_val(g_v(obj, 1))
    v51, v2 = g_v(obj, 51), g_v(obj, 2)
    if v51: r["desc"] = s_val(v51)
    elif v2: r["desc"] = s_val(v2)
    
    # Capture interfaceUuid (Tag 5) if present
    iuuid = g_v(obj, 5)
    if iuuid: r["interfaceUuid"] = s_val(iuuid)

    # RECURSIVE ATTRIBUTE CAPTURE: Process Tags 3, 10, 11 as full property lists
    for tag_name, t in [("attributes", 3), ("interfaceParams", 10), ("interfaceAttrs", 8)]:
        # Note: in reference JSON, these are often merged or flattened.
        # To maintain 100% fidelity, we must capture every single one.
        raw_vals = g_v(obj, t)
        if not raw_vals: continue
        # If it looks like a list of CModelProperties, map them
        if isinstance(raw_vals, list) and isinstance(raw_vals[0], dict):
            r[tag_name] = [map_leaf_attr(v, m_type) for v in raw_vals]
    
    # Special case: naviUniqueKey combox
    if r.get("key") == "naviUniqueKey":
        r["comboxParam"] = OrderedDict([("key", "naviType"), ("desc", "不适用导航"), ("tips", "不适用导航"), ("comboxSource", "CUSTOM_E")])
        els = []; [els.append(OrderedDict([("key",k),("desc",d)])) for k,d in [("noNavi","不适用导航"),("NAVI_SLAM","slam导航"),("QR_NAVI","二维码导航"),("MAGNETIC_NAVI","磁条导航")]]
        r["comboxParam"]["customCombox"] = OrderedDict([("element",els)])
    
    # Capture cloneEnable (Tag 5) - context dependent
    if "5" in obj and not isinstance(obj["5"][0], str): r["cloneEnable"] = bool(obj["5"][0])
    
    return r

def deserialize(inp, outp):
    fn = os.path.basename(inp).lower()
    text = subprocess.check_output(f"protoc --decode_raw < \"{inp}\"", shell=True).decode("utf-8"); msg = parse_msg(text)
    if "funcdesc" in fn:
        res = OrderedDict([("version", s_val(g_v(msg, 1, "V1.0"))), ("function", [])])
        for f in msg.get("12", []):
            fi = OrderedDict([("type",s_val(g_v(f,1))), ("desc",s_val(g_v(f,51) or g_v(f,2))), ("childFunction",[])])
            for cf in f.get("11", []):
                cci = OrderedDict([("type",s_val(g_v(cf, 1))), ("desc",s_val(g_v(cf,51) or g_v(cf,2)))]); cl = []
                for t in ["10", "11"]:
                    for a in cf.get(t, []):
                        if not isinstance(a, dict): continue
                        if "11" in a and isinstance(a["11"][0], dict):
                            m = OrderedDict(); m["key"] = s_val(g_v(a, 1)); cp = OrderedDict(); first = a["11"][0]
                            [cp.update({kn2:s_val(g_v(first,t2))}) for t2,kn2 in [("1","combName"),("2","key"),("3","desc")] if g_v(first,t2) is not None]
                            apl = [map_leaf_attr(at, 'func') for aa in first.get("10", []) if isinstance(aa, dict) for at in aa.get("11", [])]
                            if apl: cp["arrayAttr"] = [{"attrParams": apl}]
                            m["comboxParam"] = cp; m["cloneEnable"] = True; cl.append(m)
                        else: cl.append(map_leaf_attr(a, 'func'))
                cci["attr"] = cl; cci["cloneEnable"] = True; fi["childFunction"].append(cci)
            res["function"].append(fi)
    elif "abiset" in fn:
        res = OrderedDict([("version", "V1.0"), ("componentAbility", []), ("functionAbility", []), ("cloneEnable", True)])
        for ca in msg.get("11", []):
            if not isinstance(ca, dict) or "1" not in ca: continue
            c = OrderedDict([("type",s_val(g_v(ca,1)))]); v2,v3=s_val(g_v(ca,51) or g_v(ca,2)),s_val(g_v(ca,3))
            [c.update({"desc":v2}) if v2 else None]; [c.update({"tips":v3}) if v3 else None]
            cfs = []
            for cf in ca.get("10", []):
                if not isinstance(cf, dict): continue
                cci = OrderedDict([("type",s_val(g_v(cf, 1)))]); v2c,v3c,v4c=s_val(g_v(cf,51) or g_v(cf,2)),s_val(g_v(cf,3)),s_val(g_v(cf,4))
                [cci.update({"desc":v2c}) if v2c else None]; [cci.update({"tips":v3c}) if v3c else None]; [cci.update({"category":v4c}) if v4c else None]
                cci["attr"] = [m_abi_attr(a, 'abi') for a in cf.get("11", []) + cf.get("10", []) if isinstance(a, dict)]; cfs.append(cci)
            if cfs: c["childFunction"] = cfs
            res["componentAbility"].append(c)
        for fa in msg.get("12", []):
            if not isinstance(fa, dict): continue
            idx = OrderedDict([("type",s_val(g_v(fa,1)))]); idx["childFunction"] = []
            for cf in fa.get("10", []):
                cci_f = OrderedDict([("type",s_val(g_v(cf, 1)))]); cci_f["attr"] = [m_abi_attr(a, 'abi') for a in cf.get("11", []) + cf.get("10", []) if isinstance(a, dict)]
                idx["childFunction"].append(cci_f)
            res["functionAbility"].append(idx)
    elif "compdesc" in fn:
        res = OrderedDict([("moreModuleInfo", [])])
        # Mapping for Component Properties (CModelProperty)
        prop_map = {
            1: "key", 2: "type", 10: "stringValue", 11: "uint32Value",
            13: "int32Value", 14: "boolValue", 17: "doubleValue",
            12: "defaultValue", 35: "doubleMaxvalue", 45: "doubleMinvalue",
            50: "unit", 51: "desc", 52: "boolParse", 53: "boolHide",
            54: "boolNoeditable", 55: "boolMustfill", 56: "boolBasic",
            30: "enumValue", 21: "comboType"
        }
        
        def map_comp_property(obj):
            if not isinstance(obj, dict): return obj
            # Penetrate wrapper Tag 1 if it's the only key
            if list(obj.keys()) == ["1"] and isinstance(obj["1"][0], dict): obj = obj["1"][0]
            p = OrderedDict()
            for t, val_list in obj.items():
                tag = int(t); name = prop_map.get(tag, t)
                if tag == 21: # comboType
                    ct_raw = val_list[0]
                    if isinstance(ct_raw, dict):
                        ct = OrderedDict([("typeKey", s_val(g_v(ct_raw, 1))), ("typeDesc", s_val(g_v(ct_raw, 2)))])
                        ct["typeGroups"] = [OrderedDict([("key",s_val(g_v(x,1))), ("desc",s_val(g_v(x,2)))]) for x in ct_raw.get("3", [])]
                        p[name] = ct
                    else: p[name] = s_val(ct_raw)
                elif tag == 50 and isinstance(val_list[0], dict): p[name] = i2str(g_v(val_list[0], 13, ""))
                elif tag in [52, 53, 54, 55, 56, 14] and not isinstance(val_list[0], dict): p[name] = bool(val_list[0])
                elif tag in [17, 35, 45, 12]: p[name] = i2d(val_list[0])
                elif isinstance(val_list[0], dict): p[name] = [map_comp_property(x) for x in val_list]
                else:
                    v = val_list[0]
                    if tag == 50: p[name] = i2str(v)
                    else: p[name] = s_val(v) if isinstance(v, (str, bytes)) else v
            return p

        def map_comp_container(obj):
            if not isinstance(obj, dict): return obj
            if list(obj.keys()) == ["1"] and isinstance(obj["1"][0], dict): obj = obj["1"][0]
            c = OrderedDict(); c["key"] = s_val(g_v(obj, 1)); c["desc"] = s_val(g_v(obj, 2))
            if "5" in obj: c["interfaceUuid"] = s_val(g_v(obj, 5))
            for t, name in [("3", "attributes"), ("10", "interfaceParams"), ("11", "attributes"), ("8", "interfaceAttrs")]:
                if t in obj:
                    if name not in c: c[name] = []
                    c[name].extend([map_comp_property(x) for x in obj[t] if isinstance(x, dict)])
            return c

        for mmi in msg.get("5", []):
            group = OrderedDict([("moduleGroupName", s_val(g_v(mmi, 1))), ("moduleComponets", [])])
            for cp_raw in mmi.get("4", []):
                comp = OrderedDict(); raw_ga = g_v(cp_raw, 1)
                if raw_ga:
                    ga = OrderedDict(); ga_tags = {1:"moduleName", 3:"moduleDesc", 4:"moduleUuid", 5:"versionInfo", 6:"module3dIcon", 7:"subSysType", 8:"mainModuleType", 9:"subModuleType", 10:"venderName", 11:"moduleDscType", 12:"moduleIcon", 13:"moduleShape", 20:"metadata"}
                    if list(raw_ga.keys()) == ["1"] and isinstance(raw_ga["1"][0], dict): raw_ga = raw_ga["1"][0]
                    for t, name in ga_tags.items():
                        vals = raw_ga.get(str(t))
                        if not vals: continue
                        if t == 13:
                            sh_raw = vals[0]; ms_m = {"1":"sizeLen","2":"sizeWidth","3":"sizeHeight"}
                            st = g_v(sh_raw, 1, 1); box_raw = g_v(sh_raw, 11, {})
                            ga[name] = OrderedDict([("shapeType","ENUM_BOX" if st==1 else "ENUM_CYLINDER")])
                            if box_raw: ga[name]["box"] = OrderedDict([(ms_m.get(tk,tk), tv[0]) for tk, tv in box_raw.items()])
                        else: ga[name] = [map_comp_property(x) for x in vals] if isinstance(vals[0], dict) else s_val(vals[0])
                    comp["generalAttr"] = ga
                for kn, t in [("interfaceAbility", "2"), ("privateAttr", "4"), ("interfaceParams", "3"), ("structParam", "5")]:
                    if t in cp_raw: comp[kn] = [map_comp_container(x) for x in cp_raw[t]]
                group["moduleComponets"].append(comp)
            res["moreModuleInfo"].append(group)
    with open(outp, 'w', encoding='utf-8') as f: json.dump(res, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    p = argparse.ArgumentParser(); p.add_argument("input"); p.add_argument("-o", "--output"); args = p.parse_args(); deserialize(args.input, args.output if args.output else args.input + ".json")
