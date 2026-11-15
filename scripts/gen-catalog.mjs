// Builds the module catalog from catalog/modules/*.json (proto-JSON templates) and catalog/boards.
// Each template is validated against the proto schema and stored in wire form, so the app adds
// modules by decoding exactly what a .cmodel would contain.
import protobuf from 'protobufjs';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const proto = readFileSync('proto/controller_model_comp_desc.proto', 'utf8');
const root = protobuf.parse(proto, { keepCase: true }).root;
const Info = root.lookupType('AMR_MODEL_NSP.Message_Module_Info');

// The templates use protoc's JSON names (interface_Group → interfaceGroup, module_3d_icon → module3dIcon).
// Map them back to the proto field names so that nothing is dropped.
const jsonName = (f) => f.replace(/_(.)/g, (_, c) => c.toUpperCase());
const fieldOf = new Map();
(function collect(ns) {
  for (const t of ns.nestedArray ?? []) {
    if (t instanceof protobuf.Type) for (const f of t.fieldsArray) fieldOf.set(jsonName(f.name), f.name);
    collect(t);
  }
})(root);
const toProtoNames = (o) =>
  Array.isArray(o) ? o.map(toProtoNames)
    : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [fieldOf.get(k) ?? k, toProtoNames(v)]))
      : o;

const val = (el) => (el ? el.combo_type?.type_key ?? el.string_value ?? el.string_fix ?? '' : '');
const flat = (o, p = '', out = new Map()) => {
  if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) flat(v, `${p}/${k}`, out);
  else out.set(p, o);
  return out;
};

const dir = 'catalog/modules';
const entries = [];
const problems = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const json = toProtoNames(JSON.parse(readFileSync(join(dir, file), 'utf8')));
  const bytes = Info.encode(Info.fromObject(json)).finish();
  // Guard against silent loss: every value in the template must survive conversion to the wire form.
  const back = flat(Info.toObject(Info.decode(bytes), { enums: String, longs: String, defaults: false }));
  const lost = [...flat(json)].filter(([k, v]) => !back.has(k) && v !== '' && v !== false && v !== 0);
  if (lost.length) problems.push(`${file}: ${lost.length} value(s) not representable in the schema, e.g. ${lost[0][0]}`);
  const comps = json.module_componets ?? [];
  if (comps.length === 0) problems.push(`${file}: holds no component`);
  const g = comps[0]?.general_attr ?? {};
  entries.push({
    id: file.replace(/\.json$/, ''),
    name: comps.length > 1 ? json.module_group_name : val(g.module_name), desc: val(g.module_desc), sys: json.module_sys ?? '', subSys: val(g.sub_sys_type),
    mainType: val(g.main_module_type), subType: val(g.sub_module_type), vendor: val(g.vender_name), product: val(g.module_dsc_type),
    components: comps.length,
    interfaces: (comps[0]?.interface_ability?.bus_interface_ability ?? []).map((b) => `${b.bus_interface_type}×${b.bus_interface_nums}`).join(' '),
    data: Buffer.from(bytes).toString('base64'),
  });
}

const boards = {};
for (const kind of ['host', 'expansion']) {
  for (const file of readdirSync(join('catalog/boards', kind)).filter((f) => f.endsWith('.json')).sort()) {
    boards[file.replace(/\.json$/, '')] = { kind, ...JSON.parse(readFileSync(join('catalog/boards', kind, file), 'utf8')) };
  }
}

mkdirSync('packages/core/generated', { recursive: true });
writeFileSync('packages/core/generated/catalog.json', JSON.stringify({ modules: entries, boards }));
console.log(`catalog.json: ${entries.length} module templates, ${Object.keys(boards).length} boards`);
if (problems.length) {
  console.log(`${problems.length} template problem(s):`);
  for (const p of problems) console.log('  - ' + p);
}
