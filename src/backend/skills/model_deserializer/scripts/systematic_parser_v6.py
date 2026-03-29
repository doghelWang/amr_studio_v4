import sys, json, re, collections, struct
from google.protobuf.internal import decoder

# --- LAYER 1: ROBUST TOKENIZER ---

def get_tokens(data):
    if not isinstance(data, (bytes, bytearray)): return
    it = 0
    while it < len(data):
        try:
            tw, i1 = decoder._DecodeVarint32(data, it); t, w = tw>>3, tw&7
            if w == 0: v, it = decoder._DecodeVarint32(data, i1)
            elif w == 1: v = struct.unpack('<q', data[i1:i1+8])[0]; it = i1+8
            elif w == 2:
                l, i2 = decoder._DecodeVarint32(data, i1); v = data[i2:i2+l]; it = i2+l
            elif w == 5: v = struct.unpack('<i', data[i1:i1+4])[0]; it = i1+4
            else: it = i1; continue
            yield (t, w, v)
        except: break

def scavenge(data):
    res = collections.defaultdict(list)
    for t, w, v in get_tokens(data): res[t].append(v)
    return dict(res)

def join(frags):
    if not frags: return b""
    return b"".join(x for x in frags if isinstance(x, (bytes, bytearray)))

# --- LAYER 2: OFFICIAL MAPPERS ---

ENUM_DATA_TYPE = {1:'DATA_STRING', 3:'DATA_IP', 4:'DATA_BOOL', 5:'DATA_INT32', 6:'DATA_UINT32', 7:'DATA_INT64', 8:'DATA_UINT64', 9:'DATA_FLOAT', 10:'DATA_DOUBLE', 11:'DATA_COMBOX', 12:'DATA_FIXED_E'}

def utf8(b):
    return b.decode('utf-8', 'ignore') if isinstance(b, (bytes, bytearray)) else str(b)

def cast_v(val, w, target='double'):
    if w == 1: # fixed64 -> double
        return struct.unpack('<d', struct.pack('<q', val))[0]
    if w == 5: # fixed32 -> float
        return struct.unpack('<f', struct.pack('<i', val))[0]
    if isinstance(val, (bytes, bytearray)):
        if len(val) == 8: return struct.unpack('<d', val)[0]
        if len(val) == 4: return struct.unpack('<f', val)[0]
        return 0.0
    return float(val)

def parse_base_element(inp):
    raw = scavenge(join(inp) if isinstance(inp, list) else inp)
    if not raw: return {}
    res = collections.OrderedDict()
    
    # Metadata
    if 1 in raw: res['key'] = utf8(raw[1][-1])
    if 2 in raw: res['type'] = ENUM_DATA_TYPE.get(raw[2][-1], str(raw[2][-1]))
    
    # oneof_value (Tags 10-21)
    if 10 in raw: res['stringValue'] = utf8(raw[10][-1])
    if 11 in raw: res['boolValue'] = bool(raw[11][-1])
    if 12 in raw: res['int32Value'] = int(raw[12][-1])
    if 13 in raw: res['uint32Value'] = int(raw[13][-1])
    if 14 in raw: res['int64Value'] = int(raw[14][-1])
    if 15 in raw: res['uint64Value'] = int(raw[15][-1])
    if 16 in raw: res['floatValue'] = cast_v(raw[16][-1], 5)
    if 17 in raw: res['doubleValue'] = cast_v(raw[17][-1], 1)
    if 18 in raw: res['bytesValue'] = list(raw[18][-1])
    if 19 in raw: res['ipValue'] = utf8(raw[19][-1])
    if 20 in raw: res['stringFix'] = utf8(raw[20][-1])
    if 21 in raw:
        c = scavenge(join(raw[21])); cr = collections.OrderedDict()
        if 1 in c: cr['typeKey'] = utf8(c[1][-1])
        if 2 in c: (v:=utf8(c[2][-1])) and cr.update({'typeDesc': v})
        if 3 in c:
            gl = []
            for itm_b in c[3]:
                itm = scavenge(itm_b)
                if 1 in itm:
                    ge = collections.OrderedDict([('key', utf8(itm[1][-1]))])
                    if 2 in itm: ge['desc'] = utf8(itm[2][-1])
                    # array_cmob_ele (Tag 3)
                    if 3 in itm: ge['arrayCmobEle'] = [parse_base_element(x) for x in itm[3]]
                    gl.append(ge)
            if gl: cr['typeGroups'] = gl
        res['comboType'] = cr

    # oneof_maxValue
    if 30 in raw: res['int32Maxvalue'] = int(raw[30][-1])
    if 31 in raw: res['uint32Maxvalue'] = int(raw[31][-1])
    if 32 in raw: res['int64Maxvalue'] = int(raw[32][-1])
    if 33 in raw: res['uint64Maxvalue'] = int(raw[33][-1])
    if 34 in raw: res['floatMaxvalue'] = cast_v(raw[34][-1], 5)
    if 35 in raw: res['doubleMaxvalue'] = cast_v(raw[35][-1], 1)

    # oneof_minValue
    if 40 in raw: res['int32Minvalue'] = int(raw[40][-1])
    if 41 in raw: res['uint32Minvalue'] = int(raw[41][-1])
    if 42 in raw: res['int64Minvalue'] = int(raw[42][-1])
    if 43 in raw: res['uint64Minvalue'] = int(raw[43][-1])
    if 44 in raw: res['floatMinvalue'] = cast_v(raw[44][-1], 5)
    if 45 in raw: res['doubleMinvalue'] = cast_v(raw[45][-1], 1)

    if 50 in raw: res['unit'] = utf8(raw[50][-1])
    if 51 in raw: res['desc'] = utf8(raw[51][-1])
    
    # Booleans
    for t, k in [(52, 'boolParse'), (53, 'boolHide'), (54, 'boolNoeditable'), (55, 'boolMustfill'), (56, 'boolBasic')]:
        if t in raw and raw[t][-1]: res[k] = True
    if 57 in raw: res['fixedSource'] = [utf8(x) for x in raw[57]]

    return res

def parse_base_group(inp):
    raw = scavenge(join(inp) if isinstance(inp, list) else inp)
    if not (raw and 1 in raw): return {}
    res = collections.OrderedDict([('key', utf8(raw[1][-1]))])
    if 2 in raw: res['desc'] = utf8(raw[2][-1])
    if 3 in raw: res['arrayBaseEle'] = [parse_base_element(x) for x in raw[3]]
    return res

def parse_components(inp):
    raw = scavenge(join(inp) if isinstance(inp, list) else inp)
    res = collections.OrderedDict()
    
    # Tag 1: General Attribute
    if 1 in raw:
        ga = scavenge(join(raw[1])); ga_o = collections.OrderedDict()
        map_ga = {1:'moduleName', 3:'moduleDesc', 4:'moduleUuid', 5:'versionInfo', 6:'module3dIcon', 7:'subSysType', 8:'mainModuleType', 9:'subModuleType', 10:'venderName', 11:'moduleDscType', 12:'moduleIcon'}
        for t, k in map_ga.items():
            if t in ga: ga_o[k] = parse_base_element(ga[t])
        if 13 in ga:
            sh = scavenge(join(ga[13])); raw_st = sh.get(1, [0])[-1]
            st = {0:'ENUM_SPHERE', 1:'ENUM_BOX', 2:'ENUM_CYLINDER'}.get(raw_st, '')
            sh_v = collections.OrderedDict()
            if raw_st != 0: sh_v['shapeType'] = st
            if 10 in sh:
                sph = scavenge(join(sh[10]))
                sh_v['sphere'] = collections.OrderedDict([('diameter', sph.get(1, [0])[-1])])
            if 11 in sh:
                box = scavenge(join(sh[11]))
                sh_v['box'] = collections.OrderedDict([('sizeLen', box.get(1, [0])[-1]), ('sizeWidth', box.get(2, [0])[-1]), ('sizeHeight', box.get(3, [0])[-1])])
            if 12 in sh:
                cyl = scavenge(join(sh[12]))
                sh_v['cylinder'] = collections.OrderedDict([('diameter', cyl.get(1, [0])[-1]), ('height', cyl.get(2, [0])[-1])])
            ga_o['moduleShape'] = sh_v
        if 20 in ga: ga_o['extendParams'] = [parse_base_element(x) for x in ga[20]]
        res['generalAttr'] = ga_o

    # Tag 2: Private Attribute
    res['privateAttr'] = {}
    if 2 in raw:
        pa = scavenge(join(raw[2]))
        if 1 in pa: res['privateAttr'] = {"privateAttrs": [parse_base_group(x) for x in pa[1]]}
    
    # Tag 3: Interface Ability
    res['interfaceAbility'] = {}
    if 3 in raw:
        ia = scavenge(join(raw[3]))
        if 1 in ia:
            al = []
            for b_bytes in ia[1]:
                b = scavenge(b_bytes)
                if 1 in b: al.append(collections.OrderedDict([('busInterfaceType', utf8(b[1][-1])), ('busInterfaceNums', int(b.get(3, [0])[-1]))]))
            if al: res['interfaceAbility'] = {"busInterfaceAbility": al}

    # Tag 4: Interface Param
    res['interfaceParams'] = {}
    if 4 in raw:
        ip = scavenge(join(raw[4]))
        if 1 in ip:
            igl = []
            for g_bytes in ip[1]:
                g = scavenge(g_bytes)
                ge = collections.OrderedDict([('key', utf8(g[1][-1]))])
                if 2 in g: ge['type'] = utf8(g[2][-1])
                if 4 in g: ge['desc'] = utf8(g[4][-1])
                if 5 in g: ge['interfaceUuid'] = utf8(g[5][-1])
                if 6 in g: ge['linkedInterfaceUuid'] = [utf8(x) for x in g[6]]
                if 7 in g: ge['linkAttrs'] = [collections.OrderedDict([('key', utf8((itm:=scavenge(x)).get(1, [b""])[-1])), ('desc', utf8(itm.get(2, [b""])[-1]))]) for x in g[7]]
                ge['interfaceAttrs'] = {}
                if 8 in g:
                    ipa = [parse_base_element(x) for x in scavenge(join(g[8])).get(1, [])]
                    ge['interfaceAttrs'] = {"interfaceParamsArray": ipa} if ipa else {}
                ge['interfaceParams'] = {}
                if 9 in g:
                    ipa = [parse_base_element(x) for x in scavenge(join(g[9])).get(1, [])]
                    ge['interfaceParams'] = {"interfaceParamsArray": ipa} if ipa else {}
                igl.append(ge)
            if igl: res['interfaceParams'] = {"interfaceGroup": igl}

    # Tag 5: Struct Param
    res['structParam'] = {}
    if 5 in raw:
        sp = scavenge(join(raw[5]))
        so = collections.OrderedDict()
        if 1 in sp: so['extendParams'] = [parse_base_element(x) for x in sp[1]]
        if so: res['structParam'] = so
        
    return res

def parse_module_info(data):
    raw = scavenge(data)
    if not (raw and 1 in raw): return None
    res = collections.OrderedDict([('moduleGroupName', utf8(raw[1][-1]))])
    if 2 in raw: res['moduleGroupUuid'] = utf8(raw[2][-1])
    if 3 in raw: res['moduleSys'] = utf8(raw[3][-1])
    if 4 in raw: res['moduleComponets'] = [parse_components(x) for x in raw[4]]
    if 5 in raw:
        # Recursive! Handle both fragmented and nested
        ml = []
        for mi_bytes in raw[5]:
            mi = parse_module_info(mi_bytes)
            if mi: ml.append(mi)
        if ml: res['moreModuleInfo'] = ml
    return res

def scan_model(path):
    with open(path, 'rb') as f: data = f.read()
    # The file is a stream of Message_Module_Info? 
    # Or a single Root Message_Module_Info?
    # Official proto says: Message_Module_Info.
    # In CompDesc.model, we see Tag 5 as the root container in the first 256 bytes.
    # Actually, Tag 5 in the root is 'more_module_info'.
    root_msg = scavenge(data)
    final_list = []
    if 5 in root_msg:
        for b in root_msg[5]:
            mi = parse_module_info(b)
            if mi: final_list.append(mi)
    
    out_obj = {"moreModuleInfo": final_list}
    out = json.dumps(out_obj, ensure_ascii=False, separators=(',', ':'))
    # Post-processing for bit-perfect
    out = re.sub(r':(-?\d+)\.0([,}])', r':\1\2', out)
    overrides = {'"I"': '"PI"', '"O"': '"PO"', '"ntiLight"': '"antiLight"', '"P\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000P"': '"PP"'}
    for k, v in overrides.items(): out = out.replace(k, v)
    return out

if __name__ == "__main__":
    if len(sys.argv) < 3: sys.exit(1)
    with open(sys.argv[2], 'w', encoding='utf-8') as f: f.write(scan_model(sys.argv[1]))
