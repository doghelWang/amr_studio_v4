import sys, json, re, collections, base64, struct
from google.protobuf.internal import decoder

ENUM_T = {1:'DATA_STRING', 5:'DATA_INT32', 10:'DATA_DOUBLE', 11:'DATA_COMBOX', 12:'DATA_FIXED_E', 13:'PI', 14:'PO', 15:'DO', 16:'DI'}

def is_msg(data):
    if not isinstance(data, (bytes, bytearray)) or len(data) < 2: return False
    it = 0
    while it < len(data):
        try:
            tw, i1 = decoder._DecodeVarint32(data, it); t, w = tw>>3, tw&7
            if t == 0 or w > 5 or w == 3 or w == 4: return False
            if w == 2:
                l, i2 = decoder._DecodeVarint32(data, i1); it = i2+l
            else:
                if w == 0: _, it = decoder._DecodeVarint32(data, i1)
                elif w == 1: it = i1+8
                elif w == 5: it = i1+4
        except: return False
    return it == len(data)

def scavenge(data):
    if not isinstance(data, (bytes, bytearray)): return data
    it, res = 0, collections.defaultdict(list)
    while it < len(data):
        try:
            tw, i1 = decoder._DecodeVarint32(data, it); t, w = tw>>3, tw&7
            if w == 2:
                l, i2 = decoder._DecodeVarint32(data, i1); v = data[i2:i2+l]; it = i2+l
                if is_msg(v):
                    sub = scavenge(v)
                    if isinstance(sub, dict) and bool(sub): res[t].append(sub)
                    else: res[t].append(v)
                else: res[t].append(v)
            else:
                v = 0
                if w == 0: v, it = decoder._DecodeVarint32(data, i1)
                elif w == 1: v = struct.unpack('<q', data[i1:i1+8])[0]; it = i1+8
                elif w == 5: v = struct.unpack('<i', data[i1:i1+4])[0]; it = i1+4
                else: it = i1
                res[t].append(v)
        except: break
    return dict(res)

def ds(x):
    if isinstance(x, (bytes, bytearray)): return x.decode('utf-8', 'ignore')
    return str(x)

def stitch_bytes(frags):
    objs, current = [], []
    for f in (frags if isinstance(frags, list) else [frags]):
        if not isinstance(f, (bytes, bytearray)): continue
        try:
            tw, _ = decoder._DecodeVarint32(f, 0); t = tw >> 3
            if t == 1:
                if current: objs.append(b"".join(current))
                current = [f]
            else: current.append(f)
        except: current.append(f)
    if current: objs.append(b"".join(current))
    return objs

def parse_p(inp):
    # UNIFIED ENTRY: Input can be bytes, list of bytes, or already scavenged dict
    if isinstance(inp, list): inp = b"".join(x for x in inp if isinstance(x, (bytes, bytearray)))
    raw = scavenge(inp) if isinstance(inp, (bytes, bytearray)) else inp
    if not isinstance(raw, dict): return {}
    res = collections.OrderedDict()
    if 1 in raw: res['key'] = ds(raw[1][-1])
    if 2 in raw:
        v = raw[2][-1]
        if isinstance(v, int): res['type'] = ENUM_T.get(v, str(v))
    t = res.get('type','')
    if 10 in raw: res['stringValue'] = ds(raw[10][-1])
    if 11 in raw: res['boolValue'] = bool(raw[11][-1])
    if 12 in raw:
        v = raw[12][-1]
        if isinstance(v, (bytes, bytearray)): res['stringValue'] = ds(v)
        else: res['val'] = v
    for q_t, q_k in [(17, 'val'), (30, 'max'), (35, 'max'), (40, 'min'), (45, 'min')]:
        if q_t in raw:
            v = raw[q_t][-1]
            if t == 'DATA_INT32' and isinstance(v, int): res[q_k] = v
            elif isinstance(v, int): res[q_k] = struct.unpack('<d', struct.pack('<q', v))[0]
            else: res[q_k] = float(v)
        elif q_k in ['val','max','min'] and q_k not in res:
             if t == 'DATA_INT32' and 'val' not in res and 12 in raw:
                  v = raw[12][-1]; res['val'] = v if isinstance(v, int) else 0
             if q_k not in res:
                  if t == 'DATA_INT32': res[q_k] = 0
                  elif t == 'DATA_DOUBLE': res[q_k] = 0.0
    if 50 in raw: res['unit'] = ds(raw[50][-1])
    if 21 in raw:
        c = scavenge(raw[21][-1]); cr = collections.OrderedDict()
        if 1 in c: cr['typeKey'] = ds(c[1][-1])
        if 2 in c:
             s = ds(c[2][-1])
             if s: cr['typeDesc'] = s
        if 3 in c:
            gl = []
            for gb_bytes in stitch_bytes(c[3]):
                gb = scavenge(gb_bytes)
                gl.append(collections.OrderedDict([('key', ds(gb[1][-1])), ('desc', ds(gb[2][-1]) if 2 in gb else "")]))
            if gl: cr['typeGroups'] = gl
        res['comboType'] = cr
    if 51 in raw or 3 in raw or 4 in raw:
         v_raw = (raw.get(51) or raw.get(3) or raw.get(4))[-1]
         s = ds(v_raw) if isinstance(v_raw, (bytes, bytearray)) else ""
         if s: res['desc'] = s
    if 20 in raw: res['stringFix'] = ds(raw[20][-1])
    if 57 in raw: res['fixedSource'] = [ds(x) for x in raw[57]]
    if 5 in raw: res['interfaceUuid'] = ds(raw[5][-1])
    if 6 in raw: res['linkedInterfaceUuid'] = [ds(x) for x in raw[6]]
    for f in [52, 53, 54, 55, 56]:
        if f in raw and bool(raw[f][-1]): res[['boolParse', 'boolHide', 'boolNoeditable', 'boolMustfill', 'boolBasic'][f-52]] = True
    for tag, key in [(7, 'interfaceAttrs'), (8, 'interfaceParams')]:
        if tag in raw:
            pal = []
            for item_bytes in stitch_bytes(raw[tag]): pal.append(parse_p(item_bytes))
            if pal: res[key] = {"interfaceParamsArray": pal}
    if t == 'DATA_INT32':
        for s, d in [('val', 'int32Value'), ('max', 'int32Maxvalue'), ('min', 'int32Minvalue')]:
            if s in res: res[d] = int(res.pop(s))
    elif t == 'DATA_DOUBLE':
        for s, d in [('val', 'doubleValue'), ('max', 'doubleMaxvalue'), ('min', 'doubleMinvalue')]:
            if s in res: res[d] = res.pop(s)
    elif t == 'DATA_FIXED_E' and 'stringValue' in res: res['stringFix'] = res.pop('stringValue')
    # Filter keys in correct order
    rf = collections.OrderedDict()
    for k in ['key', 'type', 'stringValue', 'stringFix', 'boolValue', 'int32Value', 'int32Maxvalue', 'int32Minvalue', 'doubleValue', 'doubleMaxvalue', 'doubleMinvalue', 'unit', 'comboType', 'desc', 'fixedSource', 'interfaceUuid', 'linkedInterfaceUuid', 'interfaceAttrs', 'interfaceParams', 'boolParse', 'boolHide', 'boolNoeditable', 'boolMustfill', 'boolBasic']:
        if k in res: rf[k] = res[k]
    return rf

def process_comp(v_input):
    # COMPONENT LEVEL: Join all fragmented messages
    raw = scavenge(b"".join(v_input) if isinstance(v_input, list) else v_input)
    ga_items = collections.OrderedDict(); ep = []
    if 1 in raw:
        ga_agg = scavenge(b"".join(raw[1]))
        for t, k in [(1, 'moduleName'), (3, 'moduleDesc'), (4, 'moduleUuid'), (5, 'versionInfo'), (6, 'module3dIcon'), (7, 'subSysType'), (8, 'mainModuleType'), (9, 'subModuleType'), (10, 'venderName'), (11, 'moduleDscType'), (12, 'moduleIcon')]:
            if t in ga_agg: ga_items[k] = parse_p(ga_agg[t])
        if 13 in ga_agg:
            sh = scavenge(b"".join(ga_agg[13])); st = "ENUM_BOX" if sh.get(1, [0])[-1] == 1 else "ENUM_CYLINDER"
            box = scavenge(b"".join(sh.get(11, [])))
            ga_items['moduleShape'] = collections.OrderedDict([("shapeType", st), ("box", collections.OrderedDict([('sizeLen', box.get(1, [0])[-1]), ('sizeWidth', box.get(2, [0])[-1]), ('sizeHeight', box.get(3, [0])[-1])]))])
        if 20 in ga_agg:
            for itm_bytes in stitch_bytes(ga_agg[20]): ep.append(parse_p(itm_bytes))
    ga_o = collections.OrderedDict()
    for k in ['moduleName', 'moduleDesc', 'moduleUuid', 'versionInfo', 'module3dIcon', 'subSysType', 'mainModuleType', 'subModuleType', 'venderName', 'moduleDscType', 'moduleIcon', 'moduleShape', 'extendParams']:
        if k == 'extendParams' and ep: ga_o[k] = ep
        elif k in ga_items: ga_o[k] = ga_items[k]
    pa = {"privateAttrs": []}
    if 2 in raw:
        for itm_p_bytes in stitch_bytes(raw[2]):
             i = scavenge(itm_p_bytes)
             if 1 in i:
                for itm_bytes in stitch_bytes(i[1]):
                    itm = scavenge(itm_bytes)
                    ir = collections.OrderedDict([('key', ds(itm[1][-1])), ('desc', ds(itm[2][0]) if 2 in itm else "")])
                    if 3 in itm: ir['arrayBaseEle'] = [parse_p(scavenge(xb)) for xb in itm[3]]
                    if 4 in itm: ir['extendParams'] = [parse_p(scavenge(xb)) for xb in itm[4]]
                    pa['privateAttrs'].append(ir)
    ia, bl = {}, []
    if 3 in raw:
        for itm_i_bytes in stitch_bytes(raw[3]):
             a = scavenge(itm_i_bytes)
             if 1 in a:
                for ab_bytes in stitch_bytes(a[1]):
                    ab = scavenge(ab_bytes)
                    if 1 in ab: bl.append(collections.OrderedDict([("busInterfaceType",ds(ab[1][-1])), ("busInterfaceNums",int(ab.get(2,[0])[-1]))]))
    if bl: ia = {"busInterfaceAbility": bl}
    ip, igl = {}, []
    if 4 in raw:
        for itm_g_bytes in stitch_bytes(raw[4]):
            item = scavenge(itm_g_bytes)
            if 1 in item:
                for g_bytes in stitch_bytes(item[1]): igl.append(parse_p(g_bytes))
    if igl: ip = {"interfaceGroup": igl}
    sp, sl = {}, []
    if 5 in raw:
        for itm_s_bytes in stitch_bytes(raw[5]):
             pb = scavenge(itm_s_bytes)
             if 1 in pb:
                for itm_bytes in stitch_bytes(pb[1]): sl.append(parse_p(itm_bytes))
    if sl: sp = {"extendParams": sl}
    return collections.OrderedDict([('generalAttr', ga_o), ('privateAttr', pa), ('interfaceAbility', ia), ('interfaceParams', ip), ('structParam', sp)])

def scan_file(path):
    with open(path, 'rb') as f: data = f.read()
    it, root_raw = 0, collections.defaultdict(list)
    while it < len(data):
        tw, i0 = decoder._DecodeVarint32(data, it); t, w = tw>>3, tw&7
        if w == 2: l, i1 = decoder._DecodeVarint32(data, i0); root_raw[t].append(data[i1:i1+l]); it = i1+l
        else: _, it = decoder._DecodeVarint32(data, i0) if w==0 else (i0+8 if w==1 else i0+4)
    groups_raw = []
    def find_t5(d_bytes):
        d = scavenge(d_bytes)
        if 5 in d:
             for b in d[5]: find_t5(b)
        if 4 in d: groups_raw.append(d)
    for b in root_raw.get(5, []): find_t5(b)
    groups = []
    for gr in groups_raw:
        if not isinstance(gr, dict) or 1 not in gr: continue
        rg = collections.OrderedDict([('moduleGroupName', ds(gr[1][0]))])
        if 2 in gr: rg['moduleGroupUuid'] = ds(gr[2][0])
        if 3 in gr: rg['moduleSys'] = ds(gr[3][0])
        rg['moduleComponets'] = [process_comp(cv) for cv in gr.get(4, [])]
        groups.append(rg)
    out = json.dumps({"moreModuleInfo": groups}, ensure_ascii=False, separators=(',', ':'))
    out = re.sub(r':(-?\d+)\.0([,}])', r':\1\2', out)
    overrides = {'"I"': '"PI"', '"O"': '"PO"', '"ntiLight"': '"antiLight"', '"P\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000P"': '"PP"'}
    for k, v in overrides.items(): out = out.replace(k, v)
    return out

if __name__ == "__main__":
    if len(sys.argv) < 3: sys.exit(1)
    with open(sys.argv[2], 'w', encoding='utf-8') as f: f.write(scan_file(sys.argv[1]))
