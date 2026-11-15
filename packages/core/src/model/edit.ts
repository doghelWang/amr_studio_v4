/**
 * Edit operations. Each one mutates the decoded proto messages in place and marks the file dirty.
 * They keep the model structurally sound (reciprocal links, unique names, no dangling link UUIDs).
 */
import { touch, type Project } from '../codec/cmodel';
import { CompType, DataType, type BaseElement, type Component, type FuncAttribute, type InterfaceGroup, type ModuleInfo } from '../proto/index';
import {
  bindings, findRow, interfacesOf, mainTypeOf, modules, nameOf, portIndex, uuidOf, valueField,
  type Binding, type ModuleRef, type Scalar,
} from './view';

export class EditError extends Error {}

const DEFAULT_FIELD: Record<number, string> = {
  [DataType.STRING]: 'string_value', [DataType.IP]: 'string_value', [DataType.BOOL]: 'bool_value',
  [DataType.INT32]: 'int32_value', [DataType.UINT32]: 'uint32_value', [DataType.INT64]: 'int64_value',
  [DataType.UINT64]: 'uint64_value', [DataType.FLOAT]: 'float_value', [DataType.DOUBLE]: 'double_value',
  [DataType.COMBOX]: 'combo_type', [DataType.FIXED_E]: 'string_fix',
};
const INT_FIELDS = new Set(['int32_value', 'uint32_value', 'int64_value', 'uint64_value']);
const UNSIGNED = new Set(['uint32_value', 'uint64_value']);
const FLOAT_FIELDS = new Set(['float_value', 'double_value']);

export const newUuid = (): string => globalThis.crypto.randomUUID().replace(/-/g, '');

/** Set the value of one element, keeping the oneof member it already uses. */
export function setElementValue(el: BaseElement | FuncAttribute, value: Scalar): void {
  const field = valueField(el) ?? DEFAULT_FIELD[el.type];
  if (!field || field === 'bytes_value') throw new EditError(`"${el.key}" cannot be edited (type ${el.type})`);
  const rec = el as Record<string, unknown>;
  if (field === 'combo_type') {
    const combo = (rec.combo_type ??= { type_key: '', type_desc: '', type_groups: [] }) as { type_key: string; type_groups?: { key: string }[] };
    const key = String(value);
    const opts = combo.type_groups ?? [];
    if (opts.length && !opts.some((g) => g.key === key)) throw new EditError(`"${key}" is not an option of "${el.key}" (${opts.map((g) => g.key).join(', ')})`);
    combo.type_key = key;
    return;
  }
  if (field === 'bool_value') {
    if (typeof value === 'string' && !/^(true|false|0|1)$/i.test(value)) throw new EditError(`"${el.key}" expects true or false`);
    rec[field] = value === true || value === 1 || /^(true|1)$/i.test(String(value));
    return;
  }
  if (INT_FIELDS.has(field) || FLOAT_FIELDS.has(field)) {
    const n = typeof value === 'number' ? value : Number(String(value).trim());
    if (String(value).trim() === '' || !Number.isFinite(n)) throw new EditError(`"${el.key}" expects a number`);
    if (INT_FIELDS.has(field) && !Number.isInteger(n)) throw new EditError(`"${el.key}" expects a whole number`);
    if (UNSIGNED.has(field) && n < 0) throw new EditError(`"${el.key}" cannot be negative`);
    rec[field] = n;
    return;
  }
  rec[field] = String(value);
}

/** Set a module parameter addressed by its row path (see `rows`). */
export function setAttr(p: Project, m: ModuleRef, path: string, value: Scalar): void {
  if (path === 'general/module_name') return renameModule(p, m, String(value));
  if (path === 'general/module_uuid') throw new EditError('The module UUID cannot be edited');
  const row = findRow(m.comp, path);
  if (!row) throw new EditError(`${nameOf(m.comp)} has no parameter "${path}"`);
  if (row.key === 'parentNodeUuid' && row.el.combo_type) {
    // The parent is a reference to another module, not a choice from a fixed list.
    const target = modules(p).find((o) => uuidOf(o.comp) === String(value));
    if (!target) throw new EditError('The parent must be an existing module');
    if (target.comp === m.comp) throw new EditError('A module cannot be its own parent');
    row.el.combo_type.type_key = String(value);
    if (row.el.combo_type.type_groups.length === 1) row.el.combo_type.type_groups[0].key = String(value);
    touch(p, 'comp');
    return;
  }
  setElementValue(row.el, value);
  touch(p, 'comp');
}

export function setDisabled(p: Project, m: ModuleRef, disabled: boolean): void {
  m.comp.bool_disable = disabled;
  touch(p, 'comp');
}

/** Rename a module and follow the rename in function bindings and the module's own group name. */
export function renameModule(p: Project, m: ModuleRef, name: string): void {
  const next = name.trim();
  const old = nameOf(m.comp);
  if (!next) throw new EditError('A module name cannot be empty');
  if (next === old) return;
  if (modules(p).some((o) => o.comp !== m.comp && nameOf(o.comp) === next)) throw new EditError(`A module named "${next}" already exists`);
  setElementValue(m.comp.general_attr!.module_name!, next);
  if (m.group.module_group_name === old && m.group.module_componets.length === 1) m.group.module_group_name = next;
  touch(p, 'comp');
  for (const b of bindings(p)) {
    if (b.module === old) {
      setElementValue(b.el, next);
      touch(p, 'func');
    }
  }
}

function port(p: Project, uuid: string): { module: ModuleRef; iface: InterfaceGroup } {
  const found = portIndex(p).get(uuid);
  if (!found) throw new EditError(`Interface ${uuid} does not exist`);
  return found;
}

/** Connect two interfaces. The link is always written on both sides. */
export function link(p: Project, uuidA: string, uuidB: string): void {
  const a = port(p, uuidA), b = port(p, uuidB);
  if (a.iface === b.iface) throw new EditError('An interface cannot be connected to itself');
  if (a.module.comp === b.module.comp) throw new EditError('Two interfaces of the same module cannot be connected');
  if (a.iface.type !== b.iface.type) {
    const io = new Set([a.iface.type, b.iface.type]);
    const complementary = (io.has('DI') && io.has('DO')) || (io.has('PI') && io.has('PO')) || (io.has('AI') && io.has('AO'));
    if (!complementary) throw new EditError(`${a.iface.type} cannot be connected to ${b.iface.type}`);
  } else if (['DI', 'DO', 'PI', 'AI', 'AO'].includes(a.iface.type)) {
    throw new EditError(`${a.iface.type} must be connected to its counterpart, not to another ${a.iface.type}`);
  }
  if (!a.iface.linked_interface_uuid.includes(uuidB)) a.iface.linked_interface_uuid.push(uuidB);
  if (!b.iface.linked_interface_uuid.includes(uuidA)) b.iface.linked_interface_uuid.push(uuidA);
  touch(p, 'comp');
}

/** Remove a connection from both sides (also clears duplicates). */
export function unlink(p: Project, uuidA: string, uuidB: string): void {
  const idx = portIndex(p);
  const strip = (self: string, other: string) => {
    const pt = idx.get(self);
    if (pt) pt.iface.linked_interface_uuid = pt.iface.linked_interface_uuid.filter((u) => u !== other);
  };
  strip(uuidA, uuidB);
  if (uuidA !== uuidB) strip(uuidB, uuidA);
  touch(p, 'comp');
}

export function setBinding(p: Project, b: Binding, moduleName: string): void {
  setElementValue(b.el, moduleName);
  touch(p, 'func');
}

export interface AddOptions { name?: string }
/**
 * Add a catalog template to the project. A template is a module group holding one module or a whole
 * assembly (e.g. a wheel set with motors and drivers). The copy gets fresh module and interface UUIDs,
 * unique names, keeps the links inside the assembly, and hangs under the chassis when there is one.
 */
export function addTemplate(p: Project, template: ModuleInfo, opts: AddOptions = {}): ModuleRef[] {
  const group = CompType.decode(CompType.encode(template as never).finish()) as unknown as ModuleInfo;
  const added: ModuleRef[] = [];
  const walk = (g: ModuleInfo, parent?: ModuleInfo) => {
    g.module_group_uuid = newUuid();
    for (const comp of g.module_componets) added.push({ comp, group: g, parentGroup: parent ?? p.comp });
    for (const child of g.more_module_info) walk(child, g);
  };
  walk(group);
  if (added.length === 0) throw new EditError('The template holds no module');

  const taken = new Set(modules(p).map((m) => nameOf(m.comp)));
  const unique = (base: string) => {
    let name = base.trim() || 'module';
    for (let i = 1; taken.has(name); i++) name = `${base}_${i}`;
    taken.add(name);
    return name;
  };
  const moduleIds = new Map<string, string>();
  const ifaceIds = new Map<string, string>();
  for (const { comp } of added) {
    const g = comp.general_attr;
    if (!g?.module_name) throw new EditError('A template module has no name');
    setElementValue(g.module_name, unique(added.length === 1 && opts.name ? opts.name : nameOf(comp)));
    const fresh = newUuid();
    if (g.module_uuid) {
      if (uuidOf(comp)) moduleIds.set(uuidOf(comp), fresh);
      setElementValue(g.module_uuid, fresh);
    }
    for (const iface of interfacesOf(comp)) {
      const id = newUuid();
      if (iface.interface_uuid) ifaceIds.set(iface.interface_uuid, id);
      iface.interface_uuid = id;
    }
  }
  const chassis = modules(p).find((m) => mainTypeOf(m.comp) === 'chassis');
  for (const { comp } of added) {
    for (const iface of interfacesOf(comp)) {
      iface.linked_interface_uuid = iface.linked_interface_uuid.map((u) => ifaceIds.get(u)).filter((u): u is string => !!u);
    }
    const parent = comp.struct_param?.extend_params.find((e) => e.key === 'parentNodeUuid');
    const combo = parent?.combo_type;
    if (!parent || !combo) continue;
    const mapped = moduleIds.get(combo.type_key);
    if (mapped) combo.type_key = mapped;
    else if (chassis && mainTypeOf(comp) !== 'chassis') combo.type_key = uuidOf(chassis.comp);
    // the option list of a parent combo mirrors the selection
    if (combo.type_groups.length === 1) combo.type_groups[0].key = combo.type_key;
  }
  group.module_group_name = added.length === 1 ? nameOf(added[0].comp) : unique(opts.name ?? group.module_group_name);
  p.comp.more_module_info.push(group);
  touch(p, 'comp');
  return added;
}

/** Remove a module together with every link that pointed at it. Returns the function bindings left dangling. */
export function removeModule(p: Project, m: ModuleRef): Binding[] {
  const gone = new Set(interfacesOf(m.comp).map((i) => i.interface_uuid));
  for (const other of modules(p)) {
    if (other.comp === m.comp) continue;
    for (const iface of interfacesOf(other.comp)) {
      if (iface.linked_interface_uuid.some((u) => gone.has(u))) iface.linked_interface_uuid = iface.linked_interface_uuid.filter((u) => !gone.has(u));
    }
  }
  const i = m.group.module_componets.indexOf(m.comp);
  if (i < 0) throw new EditError(`${nameOf(m.comp)} is not part of this project`);
  m.group.module_componets.splice(i, 1);
  if (m.parentGroup && m.group.module_componets.length === 0 && m.group.more_module_info.length === 0) {
    const gi = m.parentGroup.more_module_info.indexOf(m.group);
    if (gi >= 0) m.parentGroup.more_module_info.splice(gi, 1);
  }
  touch(p, 'comp');
  const name = nameOf(m.comp);
  return bindings(p).filter((b) => b.module === name);
}
