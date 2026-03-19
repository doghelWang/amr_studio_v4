import os, sys, json, argparse, blackboxprotobuf, struct, subprocess, re
from collections import OrderedDict

def bits_to_double(bits):
    try: return struct.unpack('d', struct.pack('Q', int(bits)))[0]
    except: return bits

def unescape_protoc(s):
    if not isinstance(s, str): return s
    try:
        res = bytearray()
        i = 0
        while i < len(s):
            if s[i] == '\\':
                if i + 3 < len(s) and s[i+1:i+4].isdigit():
                    res.append(int(s[i+1:i+4], 8)); i += 4
                elif i+1 < len(s) and s[i+1] == '\\': res.append(ord('\\')); i += 2
                elif i+1 < len(s) and s[i+1] == '"': res.append(ord('"')); i += 2
                else: res.extend(s[i].encode('utf-8')); i += 1
            else: res.extend(s[i].encode('utf-8')); i += 1
        return res.decode('utf-8', errors='replace')
    except: return s

def parse_protoc_raw(model_path):
    cmd = f"protoc --decode_raw < \"{model_path}\""
    text = subprocess.check_output(cmd, shell=True).decode('utf-8')
    root = OrderedDict(); stack = [root]
    for line in text.splitlines():
        orig_line = line
        line = line.strip()
        if not line: continue
        if line == "}":
            if len(stack) > 1: stack.pop(); continue
        m_msg = re.match(r'^(\d+)\s*\{', line)
        if m_msg:
            tag = m_msg.group(1); sub = OrderedDict()
            if tag not in stack[-1]: stack[-1][tag] = []
            stack[-1][tag].append(sub); stack.append(sub); continue
        m_val = re.match(r'^(\d+):\s*(.*)', line)
        if m_val:
            tag = m_val.group(1); val = m_val.group(2)
            if val.startswith('"'): val = unescape_protoc(val.strip('"'))
            else:
                try: val = float(val) if '.' in val else int(val, 0)
                except: pass
            if tag not in stack[-1]: stack[-1][tag] = []
            stack[-1][tag].append(val); continue
    return root

def customize(val, name, config):
    ns = str(name)
    if any(x in ns for x in ["cloneEnable", "copyEnable", "boolValue"]) or ns.startswith("bool") or (config and config.get("type") == "bool"):
        try: return bool(int(val)) if not isinstance(val, (bool, list, dict)) else val
        except: return val
    if "double" in ns.lower() or ns in ["35", "45"] or (config and config.get("type") == "double"):
        if isinstance(val, int) and (val > 1000000 or val < -1000000): val = bits_to_double(val)
        if isinstance(val, float) and val.is_integer(): val = int(val)
    return val

def apply_m(obj, m_node, m_root, path, root_type, depth=0, cache=None):
    if cache is None: cache = {}
    if depth > 100: return obj
    
    if isinstance(obj, bytes):
        try: return obj.decode('utf-8')
        except: return obj.hex()
    if not isinstance(obj, (dict, list)): return obj

    obj_id = id(obj)
    if obj_id in cache: return cache[obj_id]
    
    if isinstance(obj, list):
        res = [apply_m(i, m_node, m_root, path, root_type, depth + 1, cache) for i in obj]
        cache[obj_id] = res
        return res

    if isinstance(obj, dict):
        grouped = {}
        for tag, v in obj.items():
            ts = str(tag).split('-')[0]; name = None; config = None
            if m_node and 'fields' in m_node and ts in m_node['fields']:
                name = m_node['fields'][ts]; config = m_node.get('children', {}).get(name)
            if name is None:
                ok = m_root.get('GLOBAL_OVERRIDES', {}).get('keys', {})
                if ts in ok: name = ok[ts]
            if name is None: name = ts
            if str(name).isdigit(): continue
            if name not in grouped: grouped[name] = {'v': [], 'c': config}
            if isinstance(v, list): grouped[name]['v'].extend(v)
            else: grouped[name]['v'].append(v)

        new_obj = OrderedDict()
        for i_name, info in grouped.items():
            ns = str(i_name); proc = []
            for item in info['v']:
                p_item = apply_m(item, info['c'], m_root, path + [ns], root_type, depth + 1, cache)
                p_item = customize(p_item, ns, info['c'])
                vm = None
                if m_node and 'value_mappings' in m_node and ns in m_node['value_mappings']: vm = m_node['value_mappings'][ns]
                else: 
                    ovv = m_root.get('GLOBAL_OVERRIDES', {}).get('values', {})
                    if ns in ovv: vm = ovv[ns]
                if vm and str(p_item) in vm: p_item = vm[str(p_item)]
                proc.append(p_item)
            
            # AbiSet/FuncDesc structural tweaks
            if root_type in ["AbiSet", "FuncDesc"] and ns in ["attr", "10", "11"] and "element" not in path:
                if proc and isinstance(proc[0], dict) and not any(k in proc[0] for k in ["key", "desc"]):
                    p_i = proc[0]; ap = []; ca = []
                    for k, v_raw in p_i.items():
                        if k in ["attr", "10", "11"]: (ca if "comboxAttr" in str(v_raw) or "comboxParam" in str(v_raw) else ap).extend(v_raw if isinstance(v_raw, list) else [v_raw])
                    res = OrderedDict()
                    if ap: res["arrayAttr"] = [OrderedDict([("attrParams", ap)])]
                    if ca: res["comboxAttr"] = ca
                    proc = [res]

            is_arr = info['c'].get('is_array', False) if info['c'] else False
            if ns in ["fixedSource", "entity", "moduleList", "moduleComponets", "function", "componentAbility", "functionAbility", "childFunction", "attr", "comboxAttr"]: is_arr = True
            if is_arr: new_obj[ns] = proc
            elif len(proc) > 1: new_obj[ns] = proc
            else: new_obj[ns] = proc[0] if proc else None
        
        if root_type == "AbiSet" and "key" in new_obj and isinstance(new_obj["key"], (str, bytes)) and "element" not in path and "attrParams" not in path:
             if any(ns in path for ns in ["childFunction", "componentAbility", "functionAbility"]):
                 # structural wrapping for some specific keys would go here if needed
                 pass
        if root_type == "CompDesc" and "moduleName" in new_obj:
            ordered = OrderedDict(); cols = ["moduleName", "moduleShape", "subSysType", "moduleDscType"]
            for k in cols:
                if k in new_obj: ordered[k] = new_obj[k]
            for k, v in new_obj.items():
                if k not in ordered: ordered[k] = v
            new_obj = ordered
        cache[obj_id] = new_obj
        return new_obj
    return obj

def deserialize(model_path, out_p, map_p):
    with open(map_p, 'r') as f: m = json.load(f)
    sys.setrecursionlimit(10000); fn = os.path.basename(model_path).lower()
    rv = "AbiSet" if "abiset" in fn else "FuncDesc" if "funcdesc" in fn else "CompDesc"
    if rv == "CompDesc":
        msg = parse_protoc_raw(model_path)
    else:
        with open(model_path, 'rb') as f: data = f.read()
        msg, _ = blackboxprotobuf.decode_message(data)
    
    body = apply_m(msg, m.get(rv), m, [rv], rv); res = OrderedDict()
    if rv == "AbiSet":
        res["version"] = "V1.0"; res["componentAbility"] = body.get("componentAbility", [])
        res["functionAbility"] = body.get("functionAbility", []); res["cloneEnable"] = True
    elif rv == "FuncDesc":
        res["version"] = "V1.0"; res["function"] = body.get("function", [])
    elif rv == "CompDesc":
        res = body
        if isinstance(res, dict) and "moreModuleInfo" in res: res = {"moreModuleInfo": res["moreModuleInfo"]}
    
    with open(out_p, 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, separators=(',', ':'), sort_keys=False)
    print(f"Done {rv} -> {out_p}")

if __name__ == "__main__":
    p = argparse.ArgumentParser(); p.add_argument("input"); p.add_argument("-o", "--output")
    args = p.parse_args(); map_p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "312_mappings.json")
    deserialize(args.input, args.output if args.output else args.input + ".json", map_p)
