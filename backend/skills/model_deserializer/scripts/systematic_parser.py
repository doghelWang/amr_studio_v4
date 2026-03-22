import sys, json, re, collections, struct, os
from google.protobuf.internal import decoder

# --- Path Optimization ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SCHEMA_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..', 'schemas'))

# --- Protobuf Scavenging Library ---

def parse_varint(data, pos):
    val, shift = 0, 0
    while True:
        b = data[pos]
        val |= (b & 0x7f) << shift
        pos += 1
        if not (b & 0x80): break
        shift += 7
    return val, pos

def scavenge(data):
    res, pos = collections.defaultdict(list), 0
    while pos < len(data):
        try:
            key, pos = parse_varint(data, pos)
            tag, wire = key >> 3, key & 7
            if wire == 0: v, pos = parse_varint(data, pos); res[tag].append(v)
            elif wire == 1: res[tag].append(data[pos:pos+8]); pos += 8
            elif wire == 2: l, pos = parse_varint(data, pos); res[tag].append(data[pos:pos+l]); pos += l
            elif wire == 5: res[tag].append(data[pos:pos+4]); pos += 4
            else: break
        except: break
    return res

# --- Schema Loader ---

class ProtoSchema:
    def __init__(self, path):
        self.messages, self.enums = {}, {}
        if not path or not os.path.exists(path): return
        try:
            with open(path, 'r', encoding='utf-8') as f: content = f.read()
        except:
            with open(path, 'r', encoding='gbk') as f: content = f.read()

        def _get_body(content, start):
            count, pos = 1, start
            while pos < len(content) and count > 0:
                if content[pos] == '{': count += 1
                elif content[pos] == '}': count -= 1
                pos += 1
            return content[start:pos-1], pos

        pos = 0
        while pos < len(content):
            e_match = re.search(r'enum\s+(\w+)\s*\{', content[pos:])
            m_match = re.search(r'message\s+(\w+)\s*\{', content[pos:])
            if e_match and (not m_match or e_match.start() < m_match.start()):
                name, start = e_match.group(1), pos + e_match.end()
                body, pos = _get_body(content, start)
                mapping = {}
                for line in body.split(';'):
                    match = re.search(r'(\w+)\s*=\s*(\d+)', line)
                    if match: mapping[int(match.group(2))] = match.group(1)
                self.enums[name] = mapping
            elif m_match:
                name, start = m_match.group(1), pos + m_match.end()
                body, pos = _get_body(content, start)
                fields = {}
                for line in re.sub(r'//.*', '', body).split(';'):
                    match = re.search(r'(repeated\s+)?([\w.]+)\s+(\w+)\s*=\s*(\d+)', line.strip())
                    if match:
                        frp, ft, fn, ftg = match.groups()
                        fields[int(ftg)] = {'name': self._to_camel(fn), 'type': ft, 'repeated': bool(frp)}
                self.messages[name] = fields
            else: break

    def _to_camel(self, s):
        ov = {'array_cmob_ele':'arrayCmobEle','int32_maxvalue':'int32Maxvalue','double_maxvalue':'doubleMaxvalue','int32_minvalue':'int32Minvalue','double_minvalue':'doubleMinvalue'}
        if s in ov: return ov[s]
        p = s.split('_'); return p[0] + ''.join(x.title() for x in p[1:])

    def get_field(self, msg, tag): return self.messages.get(msg, {}).get(tag, {})

# --- Themes ---

THEMES = {
    'comp': {
        'proto': os.path.join(SCHEMA_DIR, 'controller_model_comp_desc.proto'),
        'type_msg': 'Message_Base_Element', 'type_enum': 'MESSAGE_BASE_DATA_TYPE', 'type_tag': 2
    },
    'func': {
        'proto': os.path.join(SCHEMA_DIR, 'controller_model_abi_desc.proto'),
        'type_msg': 'Message_Attribute', 'type_enum': 'MESSAGE_ATTRIBUTE_TYPE', 'type_tag': 10
    },
    'abi': {
        'proto': os.path.join(SCHEMA_DIR, 'controller_model_abi_set.proto'),
        'type_msg': 'Message_Attribute', 'type_enum': 'MESSAGE_ATTRIBUTE_TYPE', 'type_tag': 5
    }
}

# --- Core Parser ---

class Parser:
    def __init__(self, mode):
        self.mode, self.theme = mode, THEMES[mode]
        self.schema = ProtoSchema(self.theme['proto'])

    def parse_attr(self, raw):
        res = collections.OrderedDict()
        for tag, vals in sorted(raw.items()):
            info = self.schema.get_field(self.theme['type_msg'], tag)
            if not info:
                if self.mode == 'comp': # Handle theme-added bool tags 52-56
                    map_b = {52:'boolParse', 53:'boolHide', 54:'boolNoeditable', 55:'boolMustfill', 56:'boolBasic'}
                    if tag in map_b: res[map_b[tag]] = bool(vals[0])
                continue
            name, t, rep = info['name'], info['type'], info['repeated']
            if rep:
                lst = []
                for x in vals:
                    if t == 'string': lst.append(x.decode('utf-8', 'ignore'))
                    else: lst.append(x)
                res[name] = lst
            elif t == 'bool': res[name] = bool(vals[0])
            elif t in ['int32', 'uint32', 'int64', 'uint64']: res[name] = vals[0]
            elif t == 'float': res[name] = round(struct.unpack('<f', vals[0])[0], 6)
            elif t == 'double': res[name] = struct.unpack('<d', vals[0])[0]
            elif t == 'string': res[name] = vals[0].decode('utf-8', 'ignore')
            elif t in self.schema.enums: res[name] = self.schema.enums[t].get(vals[0], str(vals[0]))
            elif 'Combox_Type' in t: res[name] = self.parse_combox_type(scavenge(vals[0]))
        return res

    def parse_combox_type(self, raw):
        res = collections.OrderedDict()
        for tag, vals in sorted(raw.items()):
            info = self.schema.get_field('Message_Combox_Type', tag)
            if not info: continue
            name, t = info['name'], info['type']
            if t == 'Message_Combox_Item': res[name] = [self.parse_combox_item(scavenge(x)) for x in vals]
            else: res[name] = vals[0].decode('utf-8', 'ignore')
        return res

    def parse_combox_item(self, raw):
        res = collections.OrderedDict()
        for tag, vals in sorted(raw.items()):
            info = self.schema.get_field('Message_Combox_Item', tag)
            if not info: continue
            name, t = info['name'], info['type']
            if t == 'Message_Attribute': res[name] = [self.parse_attr(scavenge(x)) for x in vals]
            elif t == 'Message_Base_Element': res[name] = [self._parse_base_element(scavenge(x)) for x in vals]
            else: res[name] = vals[0].decode('utf-8', 'ignore')
        return res

    def _parse_common_attr(self, raw):
        res = collections.OrderedDict()
        if 1 in raw: res['key'] = raw[1][0].decode('utf-8', 'ignore')
        if 11 in raw: res['comboxParam'] = self._parse_combo_attr(scavenge(raw[11][0]))
        if 12 in raw: res['arrayParam'] = self._parse_array_attr(scavenge(raw[12][0]))
        if 32 in raw: res['cloneEnable'] = bool(raw[32][0])
        return res

    def _parse_array_attr(self, raw):
        res = collections.OrderedDict()
        if self.mode == 'abi':
            if 1 in raw: res['groupName'] = raw[1][0].decode('utf-8', 'ignore')
            if 2 in raw: res['option'] = self.schema.enums['MESSAGE_ATTRIBUTE_OPTION'].get(raw[2][0], str(raw[2][0]))
            if 3 in raw: res['groupKey'] = raw[3][0].decode('utf-8', 'ignore')
        if 11 in raw: res['attrParams'] = [self.parse_attr(scavenge(x)) for x in raw[11]]
        return res

    def _parse_combo_attr(self, raw):
        res = collections.OrderedDict()
        if self.mode == 'abi':
            if 1 in raw: res['key'] = raw[1][0].decode('utf-8', 'ignore')
            if 2 in raw: res['desc'] = raw[2][0].decode('utf-8', 'ignore')
            if 3 in raw: res['tips'] = raw[3][0].decode('utf-8', 'ignore')
            if 4 in raw: res['comboxSource'] = 'CUSTOM_E'
            if 10 in raw:
                sp = scavenge(raw[10][0]); cc = collections.OrderedDict()
                if 1 in sp:
                    el_lst = []
                    for itm in sp[1]:
                        e = scavenge(itm); eo = collections.OrderedDict()
                        eo['key'] = e[1][0].decode('utf-8', 'ignore')
                        eo['desc'] = e[2][0].decode('utf-8', 'ignore')
                        if 10 in e: eo['arrayAttr'] = [self._parse_array_attr(scavenge(x)) for x in e[10]]
                        if 11 in e: eo['comboxAttr'] = [self._parse_combo_attr(scavenge(x)) for x in e[11]]
                        el_lst.append(eo)
                    cc['element'] = el_lst
                if 2 in sp: cc['defaultSelect'] = sp[2][0].decode('utf-8', 'ignore')
                res['customCombox'] = cc
        else:
            if 1 in raw: res['combName'] = raw[1][0].decode('utf-8', 'ignore')
            if 2 in raw: res['key'] = raw[2][0].decode('utf-8', 'ignore')
            if 3 in raw: res['desc'] = raw[3][0].decode('utf-8', 'ignore')
            if 10 in raw: res['arrayAttr'] = [self._parse_array_attr(scavenge(x)) for x in raw[10]]
            if 11 in raw: res['comboxAttr'] = [self._parse_combo_attr(scavenge(x)) for x in raw[11]]
        return res

    def _parse_base_element(self, raw):
        res = collections.OrderedDict()
        if 1 in raw: res['key'] = raw[1][0].decode('utf-8', 'ignore')
        if 2 in raw: res['type'] = self.schema.enums['MESSAGE_BASE_DATA_TYPE'].get(raw[2][0], str(raw[2][0]))
        map_v = {10:'stringValue', 11:'boolValue', 12:'int32Value', 13:'uint32Value', 14:'int64Value', 15:'uint64Value', 16:'floatValue', 17:'doubleValue', 19:'ipValue', 20:'stringFix'}
        for tag, key in map_v.items():
            if tag in raw:
                if tag == 11: res[key] = bool(raw[tag][0])
                elif tag == 16: res[key] = round(struct.unpack('<f', raw[tag][0])[0], 6)
                elif tag == 17: res[key] = struct.unpack('<d', raw[tag][0])[0]
                elif tag in [12,13,14,15]: res[key] = raw[tag][0]
                else: res[key] = raw[tag][0].decode('utf-8', 'ignore')
        if 18 in raw:
            try: res['stringValue'] = raw[18][0].decode('utf-8')
            except: res['bytesValue'] = list(raw[18][0])
        if 21 in raw: res['comboType'] = self.parse_combox_type(scavenge(raw[21][0]))
        for t, k in {30:'int32Maxvalue', 31:'uint32Maxvalue', 32:'int64Maxvalue', 33:'uint64Maxvalue', 34:'floatMaxvalue', 35:'doubleMaxvalue'}.items():
            if t in raw: res[k] = struct.unpack('<d', raw[t][0])[0] if t==35 else (struct.unpack('<f', raw[t][0])[0] if t==34 else raw[t][0])
        for t, k in {40:'int32Minvalue', 41:'uint32Minvalue', 42:'int64Minvalue', 43:'uint64Minvalue', 44:'floatMinvalue', 45:'doubleMinvalue'}.items():
            if t in raw: res[k] = struct.unpack('<d', raw[t][0])[0] if t==45 else (struct.unpack('<f', raw[t][0])[0] if t==44 else raw[t][0])
        if 50 in raw: res['unit'] = raw[50][0].decode('utf-8', 'ignore')
        if 51 in raw: res['desc'] = raw[51][0].decode('utf-8', 'ignore')
        map_b = {52:'boolParse', 53:'boolHide', 54:'boolNoeditable', 55:'boolMustfill', 56:'boolBasic'}
        for tag, key in map_b.items():
            if tag in raw: res[key] = bool(raw[tag][0])
        if 57 in raw: res['fixedSource'] = [x.decode('utf-8', 'ignore') for x in raw[57]]
        return res

    def parse_top(self, path):
        with open(path, 'rb') as f: data = f.read()
        raw = scavenge(data)
        res = collections.OrderedDict()
        if self.mode == 'comp':
            if 5 in raw: res['moreModuleInfo'] = [self._parse_module_info(scavenge(x)) for x in raw[5]]
            return res
        if 1 in raw: res['version'] = raw[1][0].decode('utf-8', 'ignore')
        if self.mode == 'func':
            if 12 in raw:
                f_lst = []
                for x in raw[12]:
                    f = scavenge(x); fo = collections.OrderedDict()
                    fo['type'] = f[1][0].decode('utf-8', 'ignore')
                    fo['desc'] = f[2][0].decode('utf-8', 'ignore')
                    if 11 in f:
                        cf_lst = []
                        for y in f[11]:
                            cf = scavenge(y); cfo = collections.OrderedDict()
                            cfo['type'] = cf[1][0].decode('utf-8', 'ignore')
                            cfo['desc'] = cf[2][0].decode('utf-8', 'ignore')
                            if 10 in cf: cfo['attr'] = [self._parse_common_attr(scavenge(z)) for z in cf[10]]
                            cf_lst.append(cfo)
                        fo['childFunction'] = cf_lst
                    f_lst.append(fo)
                res['function'] = f_lst
        elif self.mode == 'abi':
            if 11 in raw:
                ca_lst = []
                for x in raw[11]:
                    ca = scavenge(x); cao = collections.OrderedDict(); cao['type'] = ca[1][0].decode('utf-8', 'ignore')
                    if 11 in ca: cao['entity'] = [e.decode('utf-8', 'ignore') for e in ca[11]]
                    ca_lst.append(cao)
                res['componentAbility'] = ca_lst
            if 12 in raw:
                fa_lst = []
                for x in raw[12]:
                    fa = scavenge(x); fao = collections.OrderedDict()
                    fao['type'] = fa[1][0].decode('utf-8', 'ignore'); fao['desc'] = fa[2][0].decode('utf-8', 'ignore')
                    if 3 in fa: fao['tips'] = fa[3][0].decode('utf-8', 'ignore')
                    if 10 in fa:
                        cf_lst = []
                        for y in fa[10]:
                            cf = scavenge(y); cfo = collections.OrderedDict(); cfo['type'] = cf[1][0].decode('utf-8', 'ignore'); cfo['desc'] = cf[2][0].decode('utf-8', 'ignore')
                            if 3 in cf: cfo['tips'] = cf[3][0].decode('utf-8', 'ignore')
                            if 4 in cf: cfo['key'] = cf[4][0].decode('utf-8', 'ignore')
                            if 10 in cf: cfo['attr'] = [self._parse_common_attr(scavenge(z)) for z in cf[10]]
                            if 11 in cf: cfo['cloneEnable'] = bool(cf[11][0])
                            cf_lst.append(cfo)
                        fao['childFunction'] = cf_lst
                    if 11 in fa: fao['cloneEnable'] = bool(fa[11][0])
                    fa_lst.append(fao)
                res['functionAbility'] = fa_lst
        return res

    def _parse_module_info(self, raw):
        res = collections.OrderedDict()
        if 1 in raw: res['moduleGroupName'] = raw[1][0].decode('utf-8', 'ignore')
        if 2 in raw: res['moduleGroupUuid'] = raw[2][0].decode('utf-8', 'ignore')
        if 3 in raw: res['moduleSys'] = raw[3][0].decode('utf-8', 'ignore')
        if 4 in raw: res['moduleComponets'] = [self._parse_component(scavenge(x)) for x in raw[4]]
        if 5 in raw: res['moreModuleInfo'] = [self._parse_module_info(scavenge(x)) for x in raw[5]]
        return res

    def _parse_component(self, raw):
        res = collections.OrderedDict()
        if 1 in raw:
            ga = scavenge(raw[1][0]); gao = collections.OrderedDict()
            for tag, key in {1:'moduleName', 3:'moduleDesc', 4:'moduleUuid', 5:'versionInfo', 6:'module3dIcon', 7:'subSysType', 8:'mainModuleType', 9:'subModuleType', 10:'venderName', 11:'moduleDscType', 12:'moduleIcon'}.items():
                if tag in ga: gao[key] = self._parse_base_element(scavenge(ga[tag][0]))
            if 13 in ga:
                sh = scavenge(ga[13][0]); sho = collections.OrderedDict()
                if 1 in sh: sho['shapeType'] = {0:'ENUM_SPHERE', 1:'ENUM_BOX', 2:'ENUM_CYLINDER'}.get(sh[1][0], str(sh[1][0]))
                if 10 in sh: sp = scavenge(sh[10][0]); sho['sphere'] = {'diameter': sp[1][0]}
                if 11 in sh: bx = scavenge(sh[11][0]); sho['box'] = {'sizeLen':bx[1][0], 'sizeWidth':bx[2][0], 'sizeHeight':bx[3][0]}
                if 12 in sh: cl = scavenge(sh[12][0]); sho['cylinder'] = {'diameter':cl[1][0], 'height':cl[2][0]}
                gao['moduleShape'] = sho
            if 20 in ga: gao['extendParams'] = [self._parse_base_element(scavenge(x)) for x in ga[20]]
            res['generalAttr'] = gao
        if 2 in raw:
            pa = scavenge(raw[2][0]); pao = collections.OrderedDict()
            if 1 in pa:
                p_lst = []
                for x in pa[1]:
                    p = scavenge(x); po = collections.OrderedDict(); po['key'] = p[1][0].decode('utf-8', 'ignore')
                    if 2 in p: po['desc'] = p[2][0].decode('utf-8', 'ignore')
                    if 3 in p: po['arrayBaseEle'] = [self._parse_base_element(scavenge(y)) for y in p[3]]
                    p_lst.append(po)
                pao['privateAttrs'] = p_lst
            res['privateAttr'] = pao
        if 3 in raw:
            ia = scavenge(raw[3][0]); iao = collections.OrderedDict()
            if 1 in ia:
                b_lst = []
                for x in ia[1]:
                    b = scavenge(x); bo = collections.OrderedDict(); bo['busInterfaceType'] = b[1][0].decode('utf-8', 'ignore'); bo['busInterfaceNums'] = b[3][0]; b_lst.append(bo)
                iao['busInterfaceAbility'] = b_lst
            res['interfaceAbility'] = iao
        if 4 in raw:
            ip = scavenge(raw[4][0]); ipo = collections.OrderedDict()
            if 1 in ip:
                g_lst = []
                for x in ip[1]:
                    g = scavenge(x); go = collections.OrderedDict(); go['key'] = g[1][0].decode('utf-8', 'ignore')
                    if 2 in g: go['type'] = g[2][0].decode('utf-8', 'ignore')
                    if 4 in g: go['desc'] = g[4][0].decode('utf-8', 'ignore')
                    if 5 in g: go['interfaceUuid'] = g[5][0].decode('utf-8', 'ignore')
                    if 6 in g: go['linkedInterfaceUuid'] = [u.decode('utf-8', 'ignore') for u in g[6]]
                    if 7 in g:
                        la_lst = []
                        for itm in g[7]:
                            la = scavenge(itm); lao = collections.OrderedDict(); lao['key'] = la[1][0].decode('utf-8', 'ignore'); lao['desc'] = la[2][0].decode('utf-8', 'ignore'); la_lst.append(lao)
                        go['linkAttrs'] = la_lst
                    if 8 in g:
                        iat = scavenge(g[8][0]); iato = collections.OrderedDict()
                        if 1 in iat: iato['interfaceParamsArray'] = [self._parse_base_element(scavenge(y)) for y in iat[1]]
                        go['interfaceAttrs'] = iato
                    if 9 in g:
                        ipr = scavenge(g[9][0]); ipro = collections.OrderedDict()
                        if 1 in ipr: ipro['interfaceParamsArray'] = [self._parse_base_element(scavenge(y)) for y in ipr[1]]
                        go['interfaceParams'] = ipro
                    g_lst.append(go)
                ipo['interfaceGroup'] = g_lst
            res['interfaceParams'] = ipo
        if 5 in raw:
            sp = scavenge(raw[5][0]); spo = collections.OrderedDict()
            if 1 in sp: spo['extendParams'] = [self._parse_base_element(scavenge(x)) for x in sp[1]]
            res['structParam'] = spo
        return res

if __name__ == "__main__":
    if len(sys.argv) < 3: sys.exit(1)
    fn = sys.argv[1].lower()
    mode = 'comp' if 'compdesc' in fn else ('abi' if 'abiset' in fn else 'func')
    psr = Parser(mode)
    res = psr.parse_top(sys.argv[1])
    with open(sys.argv[2], 'w', encoding='utf-8') as f: json.dump(res, f, ensure_ascii=False, indent=None)
