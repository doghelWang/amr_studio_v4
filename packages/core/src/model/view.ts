/**
 * Read-only views over the decoded proto messages.
 * Nothing here copies model data into a second shape: rows keep a reference to the proto element they describe.
 */
import type { Project } from '../codec/cmodel';
import {
  DataType, DataTypeName,
  type BaseElement, type Component, type FuncArrayAttr, type FuncAttribute, type FuncComboAttr,
  type InterfaceGroup, type ModuleInfo,
} from '../proto/index';

export type Scalar = string | number | boolean;

const VALUE_FIELDS = [
  'string_value', 'bool_value', 'int32_value', 'uint32_value', 'int64_value', 'uint64_value',
  'float_value', 'double_value', 'bytes_value', 'ip_value', 'string_fix', 'combo_type',
] as const;
const MAX_FIELDS = ['int32_maxvalue', 'uint32_maxvalue', 'int64_maxvalue', 'uint64_maxvalue', 'float_maxvalue', 'double_maxvalue'];
const MIN_FIELDS = ['int32_minvalue', 'uint32_minvalue', 'int64_minvalue', 'uint64_minvalue', 'float_minvalue', 'double_minvalue'];

const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k) && (o as Record<string, unknown>)[k] != null;
const num = (v: unknown): number => (typeof v === 'number' ? v : Number(String(v)));

/** Which oneof member currently holds the value (undefined when the element has no value set). */
export function valueField(el: BaseElement | FuncAttribute): (typeof VALUE_FIELDS)[number] | undefined {
  return VALUE_FIELDS.find((f) => own(el, f));
}

/** The element's value. COMBOX → the selected `type_key`. Unset → '' . */
export function valueOf(el: BaseElement | FuncAttribute | undefined): Scalar {
  if (!el) return '';
  const f = valueField(el);
  if (!f) return '';
  const v = (el as Record<string, unknown>)[f];
  if (f === 'combo_type') return (v as { type_key: string }).type_key ?? '';
  if (f === 'bytes_value') return `<${(v as Uint8Array).length} bytes>`;
  if (f === 'int64_value' || f === 'uint64_value') return num(v);
  if (f === 'float_value') return Number((v as number).toPrecision(7));
  return v as Scalar;
}

export function rangeOf(el: BaseElement): { min?: number; max?: number } {
  const mx = MAX_FIELDS.find((f) => own(el, f));
  const mn = MIN_FIELDS.find((f) => own(el, f));
  return { min: mn ? num(el[mn]) : undefined, max: mx ? num(el[mx]) : undefined };
}

export interface Option { key: string; desc: string }
export interface AttrRow {
  /** Stable address inside the module, e.g. `private/scanAttr/usageMode=AREA/areaCnt`. */
  path: string;
  section: 'general' | 'private' | 'interface' | 'struct';
  group: string;
  key: string;
  desc: string;
  type: string;
  value: Scalar;
  unit: string;
  min?: number;
  max?: number;
  options?: Option[];
  hidden: boolean;
  required: boolean;
  readonly: boolean;
  basic: boolean;
  depth: number;
  el: BaseElement;
}

function pushRows(
  out: AttrRow[], els: BaseElement[] | undefined, prefix: string, section: AttrRow['section'], group: string, depth: number,
  keyOf: (el: BaseElement, i: number) => string = (el) => el.key,
): void {
  (els ?? []).forEach((el, i) => {
    const key = keyOf(el, i);
    const path = `${prefix}/${key}`;
    const combo = own(el, 'combo_type') ? el.combo_type! : undefined;
    const options: Option[] | undefined = combo
      ? combo.type_groups.map((g) => ({ key: g.key, desc: g.desc }))
      : el.fixed_source?.length ? el.fixed_source.map((s) => ({ key: s, desc: s })) : undefined;
    out.push({
      path, section, group, key, desc: el.desc, type: DataTypeName[el.type] ?? String(el.type),
      value: valueOf(el), unit: el.unit, ...rangeOf(el), options,
      hidden: el.bool_hide, required: el.bool_mustfill, readonly: el.bool_noeditable, basic: el.bool_basic, depth, el,
    });
    // COMBOX rule: only the selected option's sub-parameters are live.
    if (combo) {
      const sel = combo.type_groups.find((g) => g.key === combo.type_key);
      if (sel) pushRows(out, sel.array_cmob_ele, `${path}=${sel.key}`, section, group, depth + 1);
    }
  });
}

const GENERAL_FIELDS = [
  'module_name', 'module_desc', 'module_uuid', 'version_info', 'sub_sys_type', 'main_module_type',
  'sub_module_type', 'vender_name', 'module_dsc_type', 'module_icon', 'module_3d_icon',
] as const;

/** Every live parameter of a module as flat rows. */
export function rows(c: Component): AttrRow[] {
  const out: AttrRow[] = [];
  const g = c.general_attr;
  if (g) {
    // General fields are addressed by their proto field name (their own `key` is not always filled in).
    const present = GENERAL_FIELDS.filter((f) => g[f]);
    pushRows(out, present.map((f) => g[f]!), 'general', 'general', 'general', 0, (_el, i) => present[i]);
    pushRows(out, g.extend_params, 'general', 'general', 'general', 0);
  }
  for (const grp of c.private_attr?.private_attrs ?? []) pushRows(out, grp.array_base_ele, `private/${grp.key}`, 'private', grp.desc || grp.key, 0);
  for (const ig of c.interface_params?.interface_Group ?? []) {
    pushRows(out, ig.interface_attrs?.interface_params_array, `if/${ig.key}/attr`, 'interface', ig.key, 0);
    pushRows(out, ig.interface_params?.interface_params_array, `if/${ig.key}/param`, 'interface', ig.key, 0);
  }
  pushRows(out, c.struct_param?.extend_params, 'struct', 'struct', 'mounting', 0);
  for (const seg of c.struct_param?.segmented_limits_params ?? []) pushRows(out, seg.array_base_ele, `struct/${seg.key}`, 'struct', seg.desc || seg.key, 0);
  return out;
}

export const findRow = (c: Component, path: string): AttrRow | undefined => rows(c).find((r) => r.path === path);
/** Value at a path, or undefined when the path is not live in this module. */
export const get = (c: Component, path: string): Scalar | undefined => findRow(c, path)?.value;
export const getNum = (c: Component, path: string): number | undefined => {
  const v = get(c, path);
  return v === undefined || v === '' ? undefined : Number(v);
};

/* ───────── modules ───────── */

export interface ModuleRef { comp: Component; group: ModuleInfo; parentGroup?: ModuleInfo }

export function modules(p: Project): ModuleRef[] {
  const out: ModuleRef[] = [];
  const walk = (g: ModuleInfo, parent?: ModuleInfo) => {
    for (const comp of g.module_componets) out.push({ comp, group: g, parentGroup: parent });
    for (const child of g.more_module_info) walk(child, g);
  };
  walk(p.comp);
  return out;
}

export const nameOf = (c: Component): string => String(valueOf(c.general_attr?.module_name));
export const uuidOf = (c: Component): string => String(valueOf(c.general_attr?.module_uuid));
export const mainTypeOf = (c: Component): string => String(valueOf(c.general_attr?.main_module_type));
export const subTypeOf = (c: Component): string => String(valueOf(c.general_attr?.sub_module_type));
export const vendorOf = (c: Component): string => String(valueOf(c.general_attr?.vender_name));
export const productOf = (c: Component): string => String(valueOf(c.general_attr?.module_dsc_type));
export const sysOf = (c: Component): string => String(valueOf(c.general_attr?.sub_sys_type));

export function findModule(p: Project, nameOrUuid: string): ModuleRef | undefined {
  return modules(p).find((m) => nameOf(m.comp) === nameOrUuid || uuidOf(m.comp) === nameOrUuid);
}

export function shapeOf(c: Component): { kind: 'box' | 'cylinder' | 'sphere'; l: number; w: number; h: number } | undefined {
  const s = c.general_attr?.module_shape;
  if (!s) return undefined;
  if (s.box) return { kind: 'box', l: s.box.size_len, w: s.box.size_width, h: s.box.size_height };
  if (s.cylinder) return { kind: 'cylinder', l: s.cylinder.diameter, w: s.cylinder.diameter, h: s.cylinder.height };
  if (s.sphere) return { kind: 'sphere', l: s.sphere.diameter, w: s.sphere.diameter, h: s.sphere.diameter };
  return undefined;
}

export interface Pose { x: number; y: number; z: number; roll: number; pitch: number; yaw: number; parentUuid: string; hasPose: boolean }
export function poseOf(c: Component): Pose {
  const n = (k: string) => getNum(c, `struct/${k}`);
  const x = n('locCoordX'), y = n('locCoordY');
  return {
    x: x ?? 0, y: y ?? 0, z: n('locCoordZ') ?? 0,
    roll: n('locCoordROLL') ?? 0, pitch: n('locCoordPITCH') ?? 0, yaw: n('locCoordYAW') ?? 0,
    parentUuid: String(get(c, 'struct/parentNodeUuid') ?? ''),
    hasPose: x !== undefined || y !== undefined,
  };
}

/* ───────── interfaces and links ───────── */

export interface Port { module: ModuleRef; iface: InterfaceGroup }
export const interfacesOf = (c: Component): InterfaceGroup[] => c.interface_params?.interface_Group ?? [];
export const portLabel = (p: Port): string => `${nameOf(p.module.comp)}.${p.iface.key}`;

export function portIndex(p: Project): Map<string, Port> {
  const idx = new Map<string, Port>();
  for (const m of modules(p)) for (const iface of interfacesOf(m.comp)) if (iface.interface_uuid) idx.set(iface.interface_uuid, { module: m, iface });
  return idx;
}

/** Parameter of an interface, looked up in its runtime params first, then its fixed attributes. */
export function ifaceValue(iface: InterfaceGroup, key: string): Scalar | undefined {
  const find = (els?: BaseElement[]) => els?.find((e) => e.key === key);
  const el = find(iface.interface_params?.interface_params_array) ?? find(iface.interface_attrs?.interface_params_array);
  return el ? valueOf(el) : undefined;
}

export interface Link { a: Port; b: Port; reciprocal: boolean }
/** Unique physical links (a↔b counted once). Self-links and dangling UUIDs are left to the validator. */
export function links(p: Project): Link[] {
  const idx = portIndex(p);
  const seen = new Set<string>();
  const out: Link[] = [];
  for (const port of idx.values()) {
    for (const peerId of new Set(port.iface.linked_interface_uuid)) {
      const peer = idx.get(peerId);
      if (!peer || peer.iface === port.iface) continue;
      const id = [port.iface.interface_uuid, peerId].sort().join('|');
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({ a: port, b: peer, reciprocal: peer.iface.linked_interface_uuid.includes(port.iface.interface_uuid) });
    }
  }
  return out;
}

/** Groups of ports that are electrically one bus (connected components over links), per interface type. */
export function buses(p: Project): { type: string; ports: Port[] }[] {
  const idx = portIndex(p);
  const seen = new Set<string>();
  const out: { type: string; ports: Port[] }[] = [];
  for (const start of idx.values()) {
    if (seen.has(start.iface.interface_uuid) || start.iface.linked_interface_uuid.length === 0) continue;
    const ports: Port[] = [];
    const stack = [start];
    while (stack.length) {
      const cur = stack.pop()!;
      if (seen.has(cur.iface.interface_uuid)) continue;
      seen.add(cur.iface.interface_uuid);
      ports.push(cur);
      for (const id of cur.iface.linked_interface_uuid) {
        const peer = idx.get(id);
        if (peer && !seen.has(id)) stack.push(peer);
      }
      // links are sometimes recorded on one side only: follow them backwards too
      for (const other of idx.values()) if (!seen.has(other.iface.interface_uuid) && other.iface.linked_interface_uuid.includes(cur.iface.interface_uuid)) stack.push(other);
    }
    if (ports.length > 1) out.push({ type: start.iface.type, ports });
  }
  return out;
}

/* ───────── function bindings (FuncDesc) ───────── */

export interface Binding {
  func: string; child: string; childDesc: string; attrKey: string; groupName: string;
  key: string; module: string; el: FuncAttribute;
}
/** References from functions to modules (FIXED_E attributes holding a module name). */
export function bindings(p: Project): Binding[] {
  const out: Binding[] = [];
  for (const fn of p.func.function ?? []) {
    for (const ch of fn.child_function ?? []) {
      for (const a of ch.attr ?? []) {
        const arr = (g: FuncArrayAttr | undefined) => {
          for (const el of g?.attr_params ?? []) {
            if (own(el, 'string_fix') || el.type === DataType.FIXED_E) {
              out.push({ func: fn.type, child: ch.type, childDesc: ch.desc, attrKey: a.key, groupName: g!.group_name || g!.group_key, key: el.key, module: String(valueOf(el)), el });
            }
          }
        };
        const combo = (c: FuncComboAttr | undefined) => {
          if (!c) return;
          c.array_attr?.forEach(arr);
          c.combox_attr?.forEach(combo);
        };
        arr(a.array_param);
        combo(a.combox_param);
      }
    }
  }
  return out;
}

/** Names of the functions configured in FuncDesc, e.g. `safetyAbility/safetySensor`. */
export function functionList(p: Project): { func: string; child: string; desc: string; instances: number }[] {
  const out: { func: string; child: string; desc: string; instances: number }[] = [];
  for (const fn of p.func.function ?? []) for (const ch of fn.child_function ?? []) out.push({ func: fn.type, child: ch.type, desc: ch.desc, instances: ch.attr?.length ?? 0 });
  return out;
}
