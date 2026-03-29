import sys, json, re, collections, struct, os
from google.protobuf.internal import encoder

# --- Path Optimization ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SCHEMA_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..', 'schemas'))

# --- Schema Loader ---

class ProtoSchema:
    def __init__(self, path):
        self.messages, self.enums = {}, {}
        self.reverse_fields, self.reverse_enums = {}, {}
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
                mapping, rev = {}, {}
                for line in body.split(';'):
                    match = re.search(r'(\w+)\s*=\s*(\d+)', line)
                    if match:
                        n, v = match.group(1), int(match.group(2))
                        mapping[v] = n; rev[n] = v
                self.enums[name] = mapping; self.reverse_enums[name] = rev
            elif m_match:
                name, start = m_match.group(1), pos + m_match.end()
                body, pos = _get_body(content, start)
                fields, rev = {}, {}
                for line in re.sub(r'//.*', '', body).split(';'):
                    match = re.search(r'(repeated\s+)?([\w.]+)\s+(\w+)\s*=\s*(\d+)', line.strip())
                    if match:
                        frp, ft, fn, ftg = match.groups(); camel = self._to_camel(fn)
                        fields[int(ftg)] = {'name': camel, 'type': ft, 'repeated': bool(frp)}
                        rev[camel] = {'tag': int(ftg), 'type': ft, 'repeated': bool(frp)}
                self.messages[name] = fields; self.reverse_fields[name] = rev
            else: break

    def _to_camel(self, s):
        ov = {'array_cmob_ele':'arrayCmobEle','int32_maxvalue':'int32Maxvalue','double_maxvalue':'doubleMaxvalue','int32_minvalue':'int32Minvalue','double_minvalue':'doubleMinvalue'}
        if s in ov: return ov[s]
        p = s.split('_'); return p[0] + ''.join(x.title() for x in p[1:])

    def get_tag(self, msg, field): return self.reverse_fields.get(msg, {}).get(field, {})
    def get_enum_val(self, enum, name): return self.reverse_enums.get(enum, {}).get(name, 0)

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

# --- Core Serializer ---

def varint(v): return encoder._VarintBytes(v)
def length_delim(tag, data): return varint((tag<<3)|2) + varint(len(data)) + data

class Serializer:
    def __init__(self, mode):
        self.mode, self.theme = mode, THEMES[mode]
        self.schema = ProtoSchema(self.theme['proto'])

    def encode_field(self, tag, type_name, val):
        if type_name == 'bool': return varint((tag<<3)|0) + varint(1 if val else 0)
        elif type_name in ['int32', 'uint32', 'int64', 'uint64']: return varint((tag<<3)|0) + varint(int(val))
        elif type_name == 'float': return varint((tag<<3)|5) + struct.pack('<f', float(val))
        elif type_name == 'double': return varint((tag<<3)|1) + struct.pack('<d', float(val))
        elif type_name == 'string': 
            b = val.encode('utf-8')
            ov = {'PI': b'I', 'PO': b'O', 'antiLight': b'ntiLight', 'PP': b'P\x00\x00\x00\x00\x00\x00P'}
            if val in ov: b = ov[val]
            return length_delim(tag, b)
        elif type_name in self.schema.reverse_enums:
            return varint((tag<<3)|0) + varint(self.schema.get_enum_val(type_name, val))
        return b""

    def serialize_attr(self, data):
        buf = b""
        for k, v in data.items():
            info = self.schema.get_tag(self.theme['type_msg'], k)
            if not info:
                if self.mode == 'comp':
                    map_b = {'boolParse':52, 'boolHide':53, 'boolNoeditable':54, 'boolMustfill':55, 'boolBasic':56}
                    if k in map_b and v: buf += self.encode_field(map_b[k], 'bool', v)
                continue
            tag, t, rep = info['tag'], info['type'], info['repeated']
            if rep:
                for x in v: buf += self.encode_field(tag, t, x)
            elif 'Combox_Type' in t: buf += length_delim(tag, self.serialize_combox_type(v))
            else: buf += self.encode_field(tag, t, v)
        return buf

    def serialize_combox_type(self, data):
        buf = b""
        for k, v in data.items():
            info = self.schema.get_tag('Message_Combox_Type', k)
            if not info: continue
            tag, t = info['tag'], info['type']
            if t == 'Message_Combox_Item':
                for item in v: buf += length_delim(tag, self.serialize_combox_item(item))
            else: buf += self.encode_field(tag, t, v)
        return buf

    def serialize_combox_item(self, data):
        buf = b""
        for k, v in data.items():
            info = self.schema.get_tag('Message_Combox_Item', k)
            if not info: continue
            tag, t = info['tag'], info['type']
            if t in ['Message_Attribute', 'Message_Base_Element']:
                for attr in v: buf += length_delim(tag, (self.serialize_attr(attr) if self.mode != 'comp' else self._encode_base_element(attr)))
            else: buf += self.encode_field(tag, t, v)
        return buf

    def serialize_array_attr(self, data):
        buf = b""
        if self.mode == 'abi':
            for k, t in {'groupName':1, 'option':2, 'groupKey':3}.items():
                if k in data: buf += self.encode_field(t, 'string' if k != 'option' else 'MESSAGE_ATTRIBUTE_OPTION', data[k])
        for attr in data.get('attrParams', []): buf += length_delim(11, self.serialize_attr(attr))
        return buf

    def serialize_combo_attr(self, data):
        buf = b""
        if self.mode == 'abi':
            for k, t in {'key':1, 'desc':2, 'tips':3}.items():
                if k in data: buf += self.encode_field(t, 'string', data[k])
            if data.get('comboxSource') == 'CUSTOM_E': buf += self.encode_field(4, 'uint32', 1)
            if 'customCombox' in data:
                cc = data['customCombox']; m_buf = b""
                for el in cc.get('element', []):
                    e_buf = b""
                    for ek, et in {'key':1, 'desc':2}.items():
                        if ek in el: e_buf += self.encode_field(et, 'string', el[ek])
                    for aa in el.get('arrayAttr', []): e_buf += length_delim(10, self.serialize_array_attr(aa))
                    for ca in el.get('comboxAttr', []): e_buf += length_delim(11, self.serialize_combo_attr(ca))
                    m_buf += length_delim(1, e_buf)
                if 'defaultSelect' in cc: m_buf += self.encode_field(2, 'string', cc['defaultSelect'])
                buf += length_delim(10, m_buf)
        else:
            for k, t in {'combName':1, 'key':2, 'desc':3}.items():
                if k in data: buf += self.encode_field(t, 'string', data[k])
            for aa in data.get('arrayAttr', []): buf += length_delim(10, self.serialize_array_attr(aa))
            for ca in data.get('comboxAttr', []): buf += length_delim(11, self.serialize_combo_attr(ca))
        return buf

    def serialize_common_attr(self, data):
        buf = self.encode_field(1, 'string', data.get('key', ""))
        if 'comboxParam' in data: buf += length_delim(11, self.serialize_combo_attr(data['comboxParam']))
        if 'arrayParam' in data: buf += length_delim(12, self.serialize_array_attr(data['arrayParam']))
        if data.get('cloneEnable'): buf += self.encode_field(32, 'bool', True)
        return buf

    def serialize_top(self, data):
        if self.mode == 'comp': return self.serialize_comp_desc(data)
        buf = self.encode_field(1, 'string', data.get('version', ""))
        if self.mode == 'func':
            for fn in data.get('function', []):
                f_buf = self.encode_field(1, 'string', fn.get('type', "")) + self.encode_field(2, 'string', fn.get('desc', ""))
                for cf in fn.get('childFunction', []):
                    cf_buf = self.encode_field(1, 'string', cf.get('type', "")) + self.encode_field(2, 'string', cf.get('desc', ""))
                    for attr in cf.get('attr', []): cf_buf += length_delim(10, self.serialize_common_attr(attr))
                    f_buf += length_delim(11, cf_buf)
                buf += length_delim(12, f_buf)
        elif self.mode == 'abi':
            for ca in data.get('componentAbility', []):
                ca_buf = self.encode_field(1, 'string', ca.get('type', ""))
                for ent in ca.get('entity', []): ca_buf += self.encode_field(11, 'string', ent)
                buf += length_delim(11, ca_buf)
            for fa in data.get('functionAbility', []):
                fa_buf = self.encode_field(1, 'string', fa.get('type', "")) + self.encode_field(2, 'string', fa.get('desc', ""))
                if 'tips' in fa: fa_buf += self.encode_field(3, 'string', fa['tips'])
                for cf in fa.get('childFunction', []):
                    cf_buf = self.encode_field(1, 'string', cf.get('type', "")) + self.encode_field(2, 'string', cf.get('desc', ""))
                    if 'tips' in cf: cf_buf += self.encode_field(3, 'string', cf['tips'])
                    if 'key' in cf: cf_buf += self.encode_field(4, 'string', cf['key'])
                    for attr in cf.get('attr', []): cf_buf += length_delim(10, self.serialize_common_attr(attr))
                    if cf.get('cloneEnable'): cf_buf += self.encode_field(11, 'bool', True)
                    fa_buf += length_delim(10, cf_buf)
                if fa.get('cloneEnable'): fa_buf += self.encode_field(11, 'bool', True)
                buf += length_delim(12, fa_buf)
        return buf

    def serialize_comp_desc(self, data):
        buf = b""
        for mi in data.get('moreModuleInfo', []): buf += length_delim(5, self._encode_module_info(mi))
        return buf

    def _encode_module_info(self, mi):
        buf = self.encode_field(1, 'string', mi.get('moduleGroupName', ""))
        if 'moduleGroupUuid' in mi: buf += self.encode_field(2, 'string', mi['moduleGroupUuid'])
        if 'moduleSys' in mi: buf += self.encode_field(3, 'string', mi['moduleSys'])
        if 'moduleComponets' in mi:
            for comp in mi['moduleComponets']: buf += length_delim(4, self._encode_component(comp))
        for sub in mi.get('moreModuleInfo', []): buf += length_delim(5, self._encode_module_info(sub))
        return buf

    def _encode_component(self, comp):
        buf = b""
        if 'generalAttr' in comp:
            ga = comp['generalAttr']; ga_b = b""
            map_ga = {'moduleName':1, 'moduleDesc':3, 'moduleUuid':4, 'versionInfo':5, 'module3dIcon':6, 'subSysType':7, 'mainModuleType':8, 'subModuleType':9, 'venderName':10, 'moduleDscType':11, 'moduleIcon':12}
            for k, t in map_ga.items():
                if k in ga: ga_b += length_delim(t, self._encode_base_element(ga[k]))
            if 'moduleShape' in ga:
                sh = ga['moduleShape']; sh_b = self.encode_field(1, 'uint32', {'ENUM_SPHERE':0, 'ENUM_BOX':1, 'ENUM_CYLINDER':2}.get(sh.get('shapeType', 'ENUM_SPHERE'), 0))
                if 'sphere' in sh: sh_b += length_delim(10, self.encode_field(1, 'uint32', sh['sphere']['diameter']))
                if 'box' in sh: sh_b += length_delim(11, self.encode_field(1, 'uint32', sh['box']['sizeLen']) + self.encode_field(2, 'uint32', sh['box']['sizeWidth']) + self.encode_field(3, 'uint32', sh['box']['sizeHeight']))
                if 'cylinder' in sh: sh_b += length_delim(12, self.encode_field(1, 'uint32', sh['cylinder']['diameter']) + self.encode_field(2, 'uint32', sh['cylinder']['height']))
                ga_b += length_delim(13, sh_b)
            for ext in ga.get('extendParams', []): ga_b += length_delim(20, self._encode_base_element(ext))
            buf += length_delim(1, ga_b)
        if 'privateAttr' in comp:
            pa_b = b""; pa = comp['privateAttr']
            for p in pa.get('privateAttrs', []):
                p_buf = self.encode_field(1, 'string', p.get('key', ""))
                if 'desc' in p: p_buf += self.encode_field(2, 'string', p['desc'])
                for b_el in p.get('arrayBaseEle', []): p_buf += length_delim(3, self._encode_base_element(b_el))
                pa_b += length_delim(1, p_buf)
            buf += length_delim(2, pa_b)
        if 'interfaceAbility' in comp:
            ia_b = b""; ia = comp['interfaceAbility']
            for b_itm in ia.get('busInterfaceAbility', []):
                ia_b += length_delim(1, self.encode_field(1, 'string', b_itm.get('busInterfaceType', "")) + self.encode_field(3, 'int32', b_itm.get('busInterfaceNums', 0)))
            buf += length_delim(3, ia_b)
        if 'interfaceParams' in comp:
            ipo_b = b""; ip = comp['interfaceParams']
            for g in ip.get('interfaceGroup', []):
                g_buf = self.encode_field(1, 'string', g.get('key', ""))
                for gk, gt in {'type':2, 'desc':4, 'interfaceUuid':5}.items():
                    if gk in g: g_buf += self.encode_field(gt, 'string', g[gk])
                for l_uuid in g.get('linkedInterfaceUuid', []): g_buf += self.encode_field(6, 'string', l_uuid)
                for l_at in g.get('linkAttrs', []): g_buf += length_delim(7, self.encode_field(1, 'string', l_at.get('key', "")) + self.encode_field(2, 'string', l_at.get('desc', "")))
                if 'interfaceAttrs' in g:
                    iaa = g['interfaceAttrs']; iaa_b = b""
                    for x in iaa.get('interfaceParamsArray', []): iaa_b += length_delim(1, self._encode_base_element(x))
                    g_buf += length_delim(8, iaa_b)
                if 'interfaceParams' in g:
                    ipr = g['interfaceParams']; ipr_b = b""
                    for x in ipr.get('interfaceParamsArray', []): ipr_b += length_delim(1, self._encode_base_element(x))
                    g_buf += length_delim(9, ipr_b)
                ipo_b += length_delim(1, g_buf)
            buf += length_delim(4, ipo_b)
        if 'structParam' in comp:
            sp_b = b""; sp = comp['structParam']
            for x in sp.get('extendParams', []): sp_b += length_delim(1, self._encode_base_element(x))
            buf += length_delim(5, sp_b)
        return buf

    def _encode_base_element(self, el):
        buf = self.encode_field(1, 'string', el.get('key', ""))
        if 'type' in el: buf += self.encode_field(2, 'MESSAGE_BASE_DATA_TYPE', el['type'])
        tm = {10:'stringValue', 11:'boolValue', 12:'int32Value', 13:'uint32Value', 14:'int64Value', 15:'uint64Value', 16:'floatValue', 17:'doubleValue', 19:'ipValue', 20:'stringFix'}
        for t, k in tm.items():
            if k in el:
                itype = 'float' if t==16 else ('double' if t==17 else ('bool' if t==11 else ('int32' if t==12 else ('uint32' if t==13 else ('int64' if t==14 else ('uint64' if t==15 else 'string'))))))
                buf += self.encode_field(t, itype, el[k])
        if 'bytesValue' in el: buf += length_delim(18, bytes(el['bytesValue']))
        if 'comboType' in el:
            cb = el['comboType']; cb_b = b""
            if 'typeKey' in cb: cb_b += self.encode_field(1, 'string', cb['typeKey'])
            if 'typeDesc' in cb: cb_b += self.encode_field(2, 'string', cb['typeDesc'])
            for tg in cb.get('typeGroups', []):
                tg_b = b""
                if 'key' in tg: tg_b += self.encode_field(1, 'string', tg['key'])
                if 'desc' in tg: tg_b += self.encode_field(2, 'string', tg['desc'])
                for aa in tg.get('arrayCmobEle', []): tg_b += length_delim(3, self._encode_base_element(aa))
                cb_b += length_delim(3, tg_b)
            buf += length_delim(21, cb_b)
        for k, t in {'int32Maxvalue':30, 'uint32Maxvalue':31, 'int64Maxvalue':32, 'uint64Maxvalue':33, 'floatMaxvalue':34, 'doubleMaxvalue':35}.items():
            if k in el: buf += self.encode_field(t, 'double' if t==35 else ('float' if t==34 else 'uint32'), el[k])
        for k, t in {'int32Minvalue':40, 'uint32Minvalue':41, 'int64Minvalue':42, 'uint64Minvalue':43, 'floatMinvalue':44, 'doubleMinvalue':45}.items():
            if k in el: buf += self.encode_field(t, 'double' if t==45 else ('float' if t==44 else 'uint32'), el[k])
        if 'unit' in el: buf += self.encode_field(50, 'string', el['unit'])
        if 'desc' in el: buf += self.encode_field(51, 'string', el['desc'])
        for i,k in enumerate(['boolParse','boolHide','boolNoeditable','boolMustfill','boolBasic']):
            if el.get(k): buf += self.encode_field(52+i, 'bool', True)
        if 'fixedSource' in el:
            for fs in el['fixedSource']: buf += self.encode_field(57, 'string', fs)
        return buf

if __name__ == "__main__":
    if len(sys.argv) < 3: sys.exit(1)
    fn = sys.argv[2].lower()
    mode = 'comp' if 'compdesc' in fn else ('abi' if 'abiset' in fn else 'func')
    psr = Serializer(mode)
    with open(sys.argv[1], 'r', encoding='utf-8') as f: data = json.load(f, object_pairs_hook=collections.OrderedDict)
    out = psr.serialize_top(data)
    with open(sys.argv[2], 'wb') as f: f.write(out)
