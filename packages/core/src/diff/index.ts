/**
 * Semantic diff of two projects. Modules are matched by name; links are compared by the module.port they
 * reach, not by UUID; version stamps and UUIDs are ignored, so two exports of the same design compare equal.
 */
import type { Project } from '../codec/cmodel';
import { toPlain } from '../proto/index';
import { interfacesOf, modules, nameOf, portIndex, portLabel, rows, shapeOf, type Scalar } from '../model/view';

export type Flat = Map<string, Scalar>;
export interface Change { path: string; a?: Scalar; b?: Scalar }
export interface ModuleDiff { module: string; changes: Change[] }
export interface ProjectDiff {
  added: string[];
  removed: string[];
  modules: ModuleDiff[];
  functions: Change[];
  abilities: Change[];
  files: Change[];
  total: number;
}

const IGNORED = new Set(['general/version_info', 'general/module_uuid']);

/** One module as path → value (live parameters, ranges, links, shape). */
export function flattenModule(p: Project, name: string): Flat {
  const out: Flat = new Map();
  const m = modules(p).find((x) => nameOf(x.comp) === name);
  if (!m) return out;
  const idx = portIndex(p);
  const byUuid = new Map(modules(p).map((x) => [String(rows(x.comp).find((r) => r.path === 'general/module_uuid')?.value ?? ''), nameOf(x.comp)]));
  out.set('(group)', m.group.module_group_name);
  out.set('(disabled)', m.comp.bool_disable);
  for (const r of rows(m.comp)) {
    if (IGNORED.has(r.path)) continue;
    out.set(r.path, r.key === 'parentNodeUuid' ? byUuid.get(String(r.value)) ?? String(r.value) : r.value);
    if (r.min !== undefined || r.max !== undefined) out.set(`${r.path} [range]`, `${r.min ?? ''} … ${r.max ?? ''}`);
    if (r.unit) out.set(`${r.path} [unit]`, r.unit);
  }
  const sh = shapeOf(m.comp);
  if (sh) out.set('shape', `${sh.kind} ${sh.l}×${sh.w}×${sh.h}`);
  out.set('interfaces', (m.comp.interface_ability?.bus_interface_ability ?? []).map((b) => `${b.bus_interface_type}×${b.bus_interface_nums}`).join(' '));
  for (const iface of interfacesOf(m.comp)) {
    const peers = [...new Set(iface.linked_interface_uuid)].map((u) => (idx.has(u) ? portLabel(idx.get(u)!) : `?${u.slice(0, 8)}`)).sort();
    out.set(`if/${iface.key}/links`, peers.join(', '));
  }
  return out;
}

const LABELS = ['key', 'type', 'group_key', 'comb_name', 'name'];
/** Generic flatten of a plain object; list items are addressed by their key/type where they have one. */
export function flattenPlain(o: unknown, prefix = '', out: Flat = new Map()): Flat {
  if (Array.isArray(o)) {
    const seen = new Map<string, number>();
    o.forEach((item, i) => {
      let label = String(i);
      if (item && typeof item === 'object') {
        const k = LABELS.find((l) => typeof (item as Record<string, unknown>)[l] === 'string' && (item as Record<string, unknown>)[l] !== '');
        if (k) label = String((item as Record<string, unknown>)[k]);
      }
      const n = (seen.get(label) ?? 0) + 1;
      seen.set(label, n);
      flattenPlain(item, `${prefix}[${n > 1 ? `${label}#${n}` : label}]`, out);
    });
  } else if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) flattenPlain(v, prefix ? `${prefix}/${k}` : k, out);
  } else if (o !== undefined && o !== null) {
    out.set(prefix, o as Scalar);
  }
  return out;
}

function compare(a: Flat, b: Flat): Change[] {
  const out: Change[] = [];
  for (const k of new Set([...a.keys(), ...b.keys()])) {
    const va = a.get(k), vb = b.get(k);
    if (va !== vb) out.push({ path: k, a: va, b: vb });
  }
  return out.sort((x, y) => x.path.localeCompare(y.path));
}

/**
 * Function instances get generated keys (e.g. `ledUniqueKey_26071`), so they are matched by content:
 * an instance that only changed its generated key is not reported.
 */
function flattenFunctions(p: Project): Flat {
  const out: Flat = new Map();
  const plain = toPlain('func', p.func) as { version?: string; function?: { type: string; child_function?: { type: string; attr?: Record<string, unknown>[] }[] }[] };
  if (plain.version) out.set('version', plain.version);
  for (const fn of plain.function ?? []) for (const ch of fn.child_function ?? []) {
    const seen = new Map<string, number>();
    for (const a of ch.attr ?? []) {
      const body = flattenPlain({ ...a, key: undefined });
      const name = [...body].find(([k]) => /attr_params\[funName\]\/string_value$/.test(k))?.[1];
      const base = String(name ?? String(a.key).replace(/_\d+$/, ''));
      const n = (seen.get(base) ?? 0) + 1;
      seen.set(base, n);
      const id = `${fn.type}/${ch.type}/${n > 1 ? `${base}#${n}` : base}`;
      out.set(id, 'present');
      for (const [k, v] of body) out.set(`${id}: ${k.replace(/combox_param\/|array_param\/|array_attr|attr_params/g, '').replace(/\/+/g, '/').replace(/^\//, '')}`, v);
    }
    if (!(ch.attr ?? []).length) out.set(`${fn.type}/${ch.type}`, 'present');
  }
  return out;
}

export function diffProjects(a: Project, b: Project): ProjectDiff {
  const na = modules(a).map((m) => nameOf(m.comp)), nb = modules(b).map((m) => nameOf(m.comp));
  const sa = new Set(na), sb = new Set(nb);
  const mods: ModuleDiff[] = [];
  for (const name of na.filter((n) => sb.has(n))) {
    const changes = compare(flattenModule(a, name), flattenModule(b, name));
    if (changes.length) mods.push({ module: name, changes });
  }
  const functions = compare(flattenFunctions(a), flattenFunctions(b));
  const abilities = compare(flattenPlain(toPlain('abi', a.abi)), flattenPlain(toPlain('abi', b.abi)));
  // Files that are not one of the three model files (calibration JSON etc.) are compared byte for byte.
  const kinds = new Set(['MODEL_COMP', 'MODEL_FUNC', 'CAPABILITY']);
  const extra = (p: Project) => new Map(p.desc.filter((d) => !kinds.has(d.type)).map((d) => [`${d.type}: ${d.name}`, d.md5 || 'present'] as [string, Scalar]));
  const files = compare(extra(a), extra(b)).map((c) => ({ path: c.path, a: c.a === undefined ? undefined : c.b === undefined ? 'present' : 'content A', b: c.b === undefined ? undefined : c.a === undefined ? 'present' : 'content B' }));
  const added = nb.filter((n) => !sa.has(n)), removed = na.filter((n) => !sb.has(n));
  return {
    added, removed, modules: mods, functions, abilities, files,
    total: added.length + removed.length + mods.reduce((n, m) => n + m.changes.length, 0) + functions.length + abilities.length + files.length,
  };
}
