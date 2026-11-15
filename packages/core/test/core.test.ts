import { readdirSync, readFileSync } from 'node:fs';
import { unzipSync } from 'fflate';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  addTemplate, bindings, buses, commit, decode, diffProjects, encode, findModule, findRow, get, interfacesOf, link, links,
  loadCatalog, md5Hex, modules, nameOf, openCmodel, poseOf, portIndex, removeModule, renameModule, restore, rows, saveCmodel,
  setAttr, setBinding, setDisabled, snapshot, subTypeOf, unlink, uuidOf, validate, EditError, CmodelError,
  type Catalog, type FileKind, type Project,
} from '../src/index';
import { readCmodel } from '../src/node';

const FIX = 'fixtures';
const fixtures = readdirSync(FIX).filter((f) => f.endsWith('.cmodel'));
const open = (name: string): Project => readCmodel(`${FIX}/${name}.cmodel`);
const same = (a: Uint8Array, b: Uint8Array) => a.length === b.length && a.every((x, i) => x === b[i]);
const KIND: Record<string, FileKind> = { MODEL_COMP: 'comp', MODEL_FUNC: 'func', CAPABILITY: 'abi' };

describe('codec: lossless round trip', () => {
  it('has the six real cmodels to test against', () => expect(fixtures.length).toBe(6));

  it.each(fixtures)('%s: every model file re-encodes byte-identical', (f) => {
    const zip = unzipSync(new Uint8Array(readFileSync(`${FIX}/${f}`)));
    const desc = JSON.parse(new TextDecoder().decode(zip['ModelFileDesc.json'])).ModelFileDesc as { name: string; type: string }[];
    let checked = 0;
    for (const d of desc) {
      const kind = KIND[d.type];
      if (!kind) continue;
      expect(same(encode(kind, decode(kind, zip[d.name])), zip[d.name]), `${d.name}`).toBe(true);
      checked++;
    }
    expect(checked).toBe(3);
  });

  it.each(fixtures)('%s: export without edits keeps every archive entry byte-identical', (f) => {
    const src = new Uint8Array(readFileSync(`${FIX}/${f}`));
    const before = unzipSync(src);
    const after = unzipSync(saveCmodel(openCmodel(src, f)));
    expect(Object.keys(after).sort()).toEqual(Object.keys(before).sort());
    for (const k of Object.keys(before)) expect(same(after[k], before[k]), k).toBe(true);
  });

  it.each(fixtures)('%s: opens without integrity issues', (f) => {
    expect(readCmodel(`${FIX}/${f}`).loadIssues).toEqual([]);
  });

  it('after an edit only the edited file changes, and its MD5 is refreshed', () => {
    const p = open('modelset');
    const before = new Map(p.entries);
    setAttr(p, findModule(p, 'laser')!, 'struct/locCoordX', 410);
    const out = unzipSync(saveCmodel(p));
    for (const [k, v] of before) {
      if (k === 'CompDesc.model' || k === 'ModelFileDesc.json') expect(same(out[k], v), k).toBe(false);
      else expect(same(out[k], v), k).toBe(true);
    }
    const desc = JSON.parse(new TextDecoder().decode(out['ModelFileDesc.json'])).ModelFileDesc as { name: string; md5: string }[];
    for (const d of desc) expect(d.md5, d.name).toBe(md5Hex(out[d.name]));
    const again = openCmodel(saveCmodel(p));
    expect(again.loadIssues).toEqual([]);
    expect(get(findModule(again, 'laser')!.comp, 'struct/locCoordX')).toBe(410);
  });

  it('an edit that is reverted restores the original bytes', () => {
    const p = open('mq-q3');
    const original = p.entries.get('CompDesc.model')!;
    const m = findModule(p, 'laser-Front')!;
    setAttr(p, m, 'struct/locCoordX', 123.5);
    setAttr(p, m, 'struct/locCoordX', 405);
    commit(p);
    expect(same(p.entries.get('CompDesc.model')!, original)).toBe(true);
  });

  it('rejects files that are not cmodels', () => {
    expect(() => openCmodel(new Uint8Array([1, 2, 3]))).toThrow(CmodelError);
  });
});

describe('view', () => {
  const expected: Record<string, number> = { 'diff-2lidar': 22, modelset: 32, 'modelset-wide': 32, 'mq-q3': 31, 'mq-q3-actuator': 41, 'default-template': 0 };
  it.each(Object.entries(expected))('%s has %i modules', (f, n) => expect(modules(open(f)).length).toBe(n));

  it('resolves the lidar parameters of the two-lidar model (COMBOX rule)', () => {
    const p = open('diff-2lidar');
    const front = findModule(p, 'laser-front')!.comp, c200 = findModule(p, 'laser-C200')!.comp;
    expect(subTypeOf(front)).toBe('laser');
    expect(get(front, 'general/vender_name')).toBe('HINSON');
    expect(get(front, 'general/module_dsc_type')).toBe('FE-50');
    expect(get(c200, 'general/module_dsc_type')).toBe('MR-LS-01F-S1533-BLACK');
    const mode = rows(front).find((r) => r.key === 'usageMode')!;
    expect(mode.value).toBe('PClOUD_LASER');
    expect(mode.options!.length).toBeGreaterThan(1);
    // only the selected option's sub-parameters are live
    const sub = rows(front).filter((r) => r.path.startsWith(`${mode.path}=`));
    expect(sub.length).toBeGreaterThan(0);
    expect(sub.every((r) => r.path.startsWith(`${mode.path}=PClOUD_LASER/`))).toBe(true);
    const fov = (c: typeof front, k: string) => rows(c).find((r) => r.key === k)!.value;
    expect([fov(front, 'actualScanRangeHorizonStart'), fov(front, 'actualScanRangeHorizonEnd')]).toEqual([-180, 180]);
    expect([fov(c200, 'actualScanRangeHorizonStart'), fov(c200, 'actualScanRangeHorizonEnd')]).toEqual([-120, 120]);
    expect(get(front, 'if/ETH_1/param/ip')).toBe('192.168.1.88');
    expect(get(c200, 'if/ETH_1/param/port')).toBe(2111);
    expect(poseOf(front)).toMatchObject({ y: 457.5, yaw: -90 });
    expect(poseOf(front).x).toBeCloseTo(553.927, 3);
    expect(poseOf(c200)).toMatchObject({ yaw: -135 });
    expect(nameOf(findModule(p, poseOf(front).parentUuid)!.comp)).toBe('chassis_diff');
  });

  it('resolves links to module.port on both ends', () => {
    const p = open('mq-q3');
    const l = links(p).map((x) => [`${nameOf(x.a.module.comp)}.${x.a.iface.key}`, `${nameOf(x.b.module.comp)}.${x.b.iface.key}`].sort().join(' ↔ '));
    expect(l).toContain('MainController.CAN_2 ↔ servo_driver_L.CAN_1');
    expect(l).toContain('MainController.ETH_2 ↔ laser-Back.ETH_1');
    const can2 = buses(p).find((b) => b.ports.some((x) => nameOf(x.module.comp) === 'servo_driver_L' && x.iface.type === 'CAN'))!;
    expect(can2.ports.map((x) => nameOf(x.module.comp)).sort()).toEqual(['MainController', 'servo_driver_L', 'servo_driver_R']);
  });

  it('lists function bindings', () => {
    const b = bindings(open('mq-q3-actuator'));
    const of = (key: string) => b.filter((x) => x.key === key).map((x) => x.module).sort();
    expect(of('relatedSafetyLaser')).toEqual(['laser-Back', 'laser-Front']);
    expect(of('relatedGyro')).toEqual(['gyro0']);
    expect(of('servoDriver')).toEqual(['motor_lift', 'motor_rotate']);
  });
});

describe('edit', () => {
  it('sets values by type and rejects wrong types and unknown options', () => {
    const p = open('diff-2lidar');
    const m = findModule(p, 'laser-front')!;
    setAttr(p, m, 'struct/locCoordYAW', 45);
    expect(poseOf(m.comp).yaw).toBe(45);
    setAttr(p, m, 'if/ETH_1/param/port', '2112');
    expect(get(m.comp, 'if/ETH_1/param/port')).toBe(2112);
    expect(() => setAttr(p, m, 'if/ETH_1/param/port', 'abc')).toThrow(EditError);
    expect(() => setAttr(p, m, 'if/ETH_1/param/port', 1.5)).toThrow(EditError);
    const mode = rows(m.comp).find((r) => r.key === 'usageMode')!;
    expect(() => setAttr(p, m, mode.path, 'NOPE')).toThrow(EditError);
    const other = mode.options!.find((o) => o.key !== mode.value)!.key;
    setAttr(p, m, mode.path, other);
    expect(get(m.comp, mode.path)).toBe(other);
    expect(rows(m.comp).filter((r) => r.path.startsWith(`${mode.path}=`)).every((r) => r.path.startsWith(`${mode.path}=${other}/`))).toBe(true);
    expect(() => setAttr(p, m, 'nope/x', 1)).toThrow(EditError);
    expect(() => setAttr(p, m, 'general/module_uuid', 'x')).toThrow(EditError);
    expect(p.dirty.has('comp')).toBe(true);
    // the edited model still encodes and reopens
    expect(modules(openCmodel(saveCmodel(p))).length).toBe(22);
  });

  it('links are written on both ends and removed from both ends', () => {
    const p = open('mq-q3');
    const idx = portIndex(p);
    const find = (mod: string, key: string) => [...idx.values()].find((x) => nameOf(x.module.comp) === mod && x.iface.key === key)!.iface;
    const a = find('MainController', 'CAN_3'), b = find('servo_driver_L', 'CAN_1');
    link(p, a.interface_uuid, b.interface_uuid);
    expect(a.linked_interface_uuid).toContain(b.interface_uuid);
    expect(b.linked_interface_uuid).toContain(a.interface_uuid);
    unlink(p, a.interface_uuid, b.interface_uuid);
    expect(a.linked_interface_uuid).not.toContain(b.interface_uuid);
    expect(b.linked_interface_uuid).not.toContain(a.interface_uuid);
    expect(() => link(p, a.interface_uuid, a.interface_uuid)).toThrow(EditError);
    expect(() => link(p, a.interface_uuid, find('MainController', 'CAN_1').interface_uuid)).toThrow(EditError);
    expect(() => link(p, a.interface_uuid, find('laser-Front', 'ETH_1').interface_uuid)).toThrow(EditError);
    expect(() => link(p, a.interface_uuid, 'missing')).toThrow(EditError);
  });

  it('rename follows through to function bindings', () => {
    const p = open('mq-q3');
    renameModule(p, findModule(p, 'laser-Front')!, 'lidar_front');
    expect(findModule(p, 'laser-Front')).toBeUndefined();
    expect(bindings(p).filter((b) => b.module === 'lidar_front').length).toBeGreaterThan(0);
    expect(bindings(p).some((b) => b.module === 'laser-Front')).toBe(false);
    expect(p.dirty).toEqual(new Set(['comp', 'func']));
    expect(() => renameModule(p, findModule(p, 'laser-Back')!, 'lidar_front')).toThrow(EditError);
    expect(() => renameModule(p, findModule(p, 'laser-Back')!, '  ')).toThrow(EditError);
    expect(validate(openCmodel(saveCmodel(p))).findings.filter((f) => f.rule === 'func.binding')).toEqual([]);
  });

  it('removing a module removes every link to it and reports dangling bindings', () => {
    const p = open('mq-q3');
    const gone = new Set(interfacesOf(findModule(p, 'laser-Back')!.comp).map((i) => i.interface_uuid));
    const dangling = removeModule(p, findModule(p, 'laser-Back')!);
    expect(modules(p).length).toBe(30);
    expect(dangling.map((b) => b.key)).toContain('relatedSafetyLaser');
    for (const m of modules(p)) for (const i of interfacesOf(m.comp)) expect(i.linked_interface_uuid.some((u) => gone.has(u))).toBe(false);
    expect(validate(p).findings.some((f) => f.rule === 'func.binding' && f.message.includes('laser-Back'))).toBe(true);
    setBinding(p, dangling.find((b) => b.key === 'relatedSafetyLaser')!, 'laser-Front');
    expect(validate(p).findings.some((f) => f.rule === 'link.dangling')).toBe(false);
  });

  it('disable flag and undo snapshot', () => {
    const p = open('modelset');
    const original = new Map(p.entries);
    const s = snapshot(p);
    setDisabled(p, findModule(p, 'speaker')!, true);
    setAttr(p, findModule(p, 'laser')!, 'struct/locCoordYAW', 90);
    expect(findModule(p, 'speaker')!.comp.bool_disable).toBe(true);
    restore(p, s);
    expect(findModule(p, 'speaker')!.comp.bool_disable).toBe(false);
    expect(poseOf(findModule(p, 'laser')!.comp).yaw).toBe(0);
    // restoring after an export still writes the restored state, and it equals the original bytes
    commit(p);
    for (const [k, v] of original) expect(same(p.entries.get(k)!, v), k).toBe(true);
  });
});

describe('catalog', () => {
  let cat: Catalog;
  beforeAll(async () => { cat = await loadCatalog(); });

  it('holds every template, including controller products and drivers with CAN ports', () => {
    expect(cat.entries.length).toBe(142);
    const controllers = cat.entries.filter((e) => e.mainType === 'mainCPU').map((e) => e.id);
    expect(controllers).toEqual(expect.arrayContaining(['MCPU-RA-MC-R318AT', 'MCPU-RA-MC-R318BN', 'MCPU-RA-MC-R349AD-21BH0']));
    const drivers = cat.entries.filter((e) => e.subType === 'subDriver');
    expect(drivers.length).toBeGreaterThan(0);
    expect(drivers.every((d) => /CAN×/.test(d.interfaces))).toBe(true);
    expect(cat.search('r318').length).toBeGreaterThanOrEqual(2);
    expect([...cat.tree().keys()]).toContain('sensor');
  });

  it('every template decodes and has a named module', () => {
    for (const e of cat.entries) {
      const t = cat.template(e.id);
      const count = t.module_componets.length + t.more_module_info.reduce((n, g) => n + g.module_componets.length, 0);
      expect(count, e.id).toBeGreaterThan(0);
    }
  });

  it('adding a single module gives it fresh ids, a unique name and the chassis as parent', () => {
    const p = open('mq-q3');
    const [m1] = addTemplate(p, cat.template('MCPU-RA-MC-R318AT'));
    const [m2] = addTemplate(p, cat.template('MCPU-RA-MC-R318AT'));
    expect(nameOf(m1.comp)).not.toBe(nameOf(m2.comp));
    expect(uuidOf(m1.comp)).toMatch(/^[0-9a-f]{32}$/);
    expect(uuidOf(m1.comp)).not.toBe(uuidOf(m2.comp));
    const ids = modules(p).flatMap((m) => interfacesOf(m.comp).map((i) => i.interface_uuid));
    expect(new Set(ids).size).toBe(ids.length);
    const again = openCmodel(saveCmodel(p));
    expect(modules(again).length).toBe(33);
    const r = validate(again);
    expect(r.findings.filter((f) => ['module.unique', 'module.parent', 'link.dangling'].includes(f.rule))).toEqual([]);
  });

  it('adding an assembly keeps its internal wiring and remaps it to the new ids', () => {
    const p = open('default-template');
    const id = cat.entries.find((e) => e.components > 1 && e.id.startsWith('DIFF_WHEELS'))!.id;
    const tpl = cat.template(id);
    const added = addTemplate(p, tpl);
    expect(added.length).toBe(6);
    const tplLinks = tpl.module_componets.flatMap((c) => interfacesOf(c)).reduce((n, i) => n + i.linked_interface_uuid.length, 0);
    const newLinks = added.flatMap((m) => interfacesOf(m.comp)).reduce((n, i) => n + i.linked_interface_uuid.length, 0);
    expect(newLinks).toBe(tplLinks);
    expect(newLinks).toBeGreaterThan(0);
    const again = openCmodel(saveCmodel(p));
    expect(modules(again).length).toBe(6);
    expect(validate(again).findings.filter((f) => ['link.dangling', 'link.reciprocal', 'module.unique'].includes(f.rule))).toEqual([]);
    expect(findRow(added[0].comp, 'general/module_name')).toBeDefined();
  });
});

describe('validate', () => {
  const ids = (p: Project, level?: string) => validate(p).findings.filter((f) => !level || f.level === level).map((f) => `${f.rule}:${f.module ?? ''}`);

  it('finds the known problems in the two-lidar model', () => {
    const r = validate(open('diff-2lidar'));
    const has = (rule: string, mod: string) => r.findings.some((f) => f.rule === rule && f.module === mod);
    expect(has('can.nodeId', 'MainController')).toBe(true);
    expect(has('lidar.heading', 'laser-front')).toBe(true);
    expect(has('lidar.forward', 'laser-C200')).toBe(true);
    expect(has('lidar.heading', 'laser-C200')).toBe(false);
    expect(has('chassis.rotateDiameter', 'chassis_diff')).toBe(true);
    expect(has('motor.rating', 'motor-left')).toBe(true);
    expect(r.errors).toBe(1);
    expect(r.findings.every((f) => f.message.length > 0)).toBe(true);
  });

  it('fixing the model clears the findings', () => {
    const p = open('diff-2lidar');
    setAttr(p, findModule(p, 'driver-left')!, 'if/CAN_1/param/nodeId', 3);
    setAttr(p, findModule(p, 'laser-front')!, 'struct/locCoordYAW', 45);
    const b = bindings(p).find((x) => x.module === 'laser-C200' && /laser/i.test(x.key))!;
    setBinding(p, b, 'laser-front');
    const after = ids(openCmodel(saveCmodel(p)));
    expect(after.filter((x) => /can\.nodeId|lidar\./.test(x))).toEqual([]);
  });

  it('production models have no errors (rules do not flag vendor conventions)', () => {
    for (const f of ['modelset', 'modelset-wide', 'mq-q3', 'mq-q3-actuator']) expect(ids(open(f), 'error'), f).toEqual([]);
  });

  it('flags the unreachable top speed with the numbers', () => {
    const f = validate(open('modelset')).findings.find((x) => x.rule === 'chassis.speed')!;
    expect(f.message).toContain('1885');
  });

  it('detects broken structure', () => {
    const p = open('mq-q3');
    const idx = [...portIndex(p).values()];
    const drv = idx.find((x) => nameOf(x.module.comp) === 'servo_driver_R' && x.iface.key === 'CAN_1')!.iface;
    const mc = idx.find((x) => nameOf(x.module.comp) === 'MainController' && x.iface.key === 'CAN_2')!.iface;
    mc.linked_interface_uuid = mc.linked_interface_uuid.filter((u) => u !== drv.interface_uuid); // one-sided
    drv.linked_interface_uuid.push('deadbeef');
    setAttr(p, findModule(p, 'servo_driver_R')!, 'if/CAN_1/param/nodeId', 3);
    setAttr(p, findModule(p, 'laser-Back')!, 'if/ETH_1/param/ip', '192.168.1.85');
    const rules = new Set(validate(p).findings.map((f) => f.rule));
    for (const r of ['link.reciprocal', 'link.dangling', 'can.nodeId', 'net.ip']) expect(rules.has(r), r).toBe(true);
  });

  it('an empty template is reported as such, not as a broken vehicle', () => {
    const r = validate(open('default-template'));
    expect(r.errors + r.warnings).toBe(0);
    expect(r.findings.map((f) => f.rule)).toEqual(['file.empty']);
  });
});

describe('diff', () => {
  it('a model equals itself', () => {
    for (const f of ['modelset', 'mq-q3-actuator']) expect(diffProjects(open(f), open(f)).total, f).toBe(0);
  });

  it('modelset vs wide variant: chassis width changes only', () => {
    const d = diffProjects(open('modelset'), open('modelset-wide'));
    expect(d.added).toEqual([]);
    expect(d.removed).toEqual([]);
    expect(Object.fromEntries(d.modules.map((m) => [m.module, m.changes.length]))).toEqual({ chassis_diff: 12, carrier: 1, diffWheel_left: 1, diffWheel_right: 1 });
    const ch = d.modules.find((m) => m.module === 'chassis_diff')!.changes;
    expect(ch.find((c) => c.path.endsWith('/wheelSpace'))).toMatchObject({ a: 603, b: 840 });
    expect(ch.find((c) => c.path === 'shape')).toMatchObject({ a: 'box 950×650×300', b: 'box 950×840×300' });
    expect(d.functions.map((c) => [c.a, c.b]).sort()).toEqual([[1032, 981], [151, 626], [301, 1252], [651, 886]].sort());
    expect(d.abilities).toEqual([]);
    expect(d.files.length).toBe(1);
    expect(d.total).toBe(20);
  });

  it('mq-q3 vs actuator: the lift-and-rotate modules are added', () => {
    const d = diffProjects(open('mq-q3'), open('mq-q3-actuator'));
    expect(d.removed).toEqual(['gyro']);
    expect(d.added.sort()).toEqual(['carrier', 'driver_lift', 'driver_rotate', 'gyro0', 'lifter', 'motor_lift', 'motor_rotate', 'proximitySensor_lift', 'proximitySensor_rotate', 'rotator', 'smart camera0'].sort());
    const mc = d.modules.find((m) => m.module === 'MainController')!.changes;
    expect(mc.find((c) => c.path === 'if/CAN_2/links')).toMatchObject({ a: 'servo_driver_L.CAN_1, servo_driver_R.CAN_1', b: 'driver_lift.CAN_1, driver_rotate.CAN_1, servo_driver_L.CAN_1, servo_driver_R.CAN_1' });
    expect(d.functions.find((c) => c.path.includes('relatedGyro'))).toMatchObject({ a: 'gyro', b: 'gyro0' });
    // unchanged LED instances whose generated keys differ are not reported
    expect(d.functions.some((c) => c.path.startsWith('HCI/led'))).toBe(false);
    expect(d.abilities).toEqual([]);
  });

  it('an edit shows up as exactly one change', () => {
    const a = open('mq-q3'), b = open('mq-q3');
    setAttr(b, findModule(b, 'laser-Front')!, 'struct/locCoordX', 400);
    const d = diffProjects(a, b);
    expect(d.total).toBe(1);
    expect(d.modules[0]).toMatchObject({ module: 'laser-Front', changes: [{ path: 'struct/locCoordX', a: 405, b: 400 }] });
  });
});
