/**
 * Validation. One table of rules (id, level, scope, title); each rule is a pure function of the project.
 * Findings always name the module and, where it applies, the parameter path.
 */
import type { Project } from '../codec/cmodel';
import {
  bindings, buses, get, getNum, ifaceValue, interfacesOf, links, mainTypeOf, modules, nameOf, portIndex, portLabel,
  poseOf, rows, subTypeOf, uuidOf, type ModuleRef, type Port,
} from '../model/view';

export type Level = 'error' | 'warning' | 'info';
export type Scope = 'file' | 'field' | 'topology' | 'vehicle';
export interface Finding { rule: string; level: Level; scope: Scope; module?: string; path?: string; message: string }
export interface Rule { id: string; level: Level; scope: Scope; title: string; check: (ctx: Ctx) => Omit<Finding, 'rule' | 'level' | 'scope'>[] }

interface Ctx { p: Project; mods: ModuleRef[] }
type Out = Omit<Finding, 'rule' | 'level' | 'scope'>[];

const isMotor = (m: ModuleRef) => /motor$/i.test(subTypeOf(m.comp));
const isLaser = (m: ModuleRef) => /laser/i.test(subTypeOf(m.comp));
const deg = (r: number) => (r * Math.PI) / 180;
const fmt = (n: number) => (Math.abs(n) >= 100 ? n.toFixed(0) : n.toFixed(1));
/** First live row whose path matches, as a number. */
const numAt = (m: ModuleRef, re: RegExp): number | undefined => {
  const r = rows(m.comp).find((x) => re.test(x.path));
  return r && r.value !== '' ? Number(r.value) : undefined;
};

export const RULES: Rule[] = [
  /* ───── file ───── */
  {
    id: 'file.integrity', level: 'warning', scope: 'file', title: 'Archive is consistent with ModelFileDesc.json',
    check: ({ p }) => p.loadIssues.map((message) => ({ message })),
  },
  {
    id: 'file.empty', level: 'info', scope: 'file', title: 'Model contains modules',
    check: ({ mods }) => (mods.length ? [] : [{ message: 'The component description is empty (template file)' }]),
  },

  /* ───── field ───── */
  {
    id: 'field.range', level: 'error', scope: 'field', title: 'Value is inside its declared range',
    check: ({ mods }) => {
      const out: Out = [];
      for (const m of mods) {
        const live = new Set(interfacesOf(m.comp).filter((i) => i.linked_interface_uuid.length).map((i) => i.key));
        for (const r of rows(m.comp)) {
          if (typeof r.value !== 'number' || r.min === undefined || r.max === undefined) continue;
          if (r.max <= r.min) continue; // 0…0 and similar are placeholders, not ranges
          if (r.section === 'interface' && !live.has(r.group)) continue; // unconnected ports carry template defaults
          if (r.value < r.min || r.value > r.max) {
            const where = r.section === 'interface' ? `${r.group}: ` : '';
            out.push({ module: nameOf(m.comp), path: r.path, message: `${where}${r.desc || r.key} = ${r.value} is outside ${r.min} … ${r.max}` });
          }
        }
      }
      return out;
    },
  },
  {
    id: 'field.required', level: 'warning', scope: 'field', title: 'Required parameter is filled in',
    check: ({ mods }) => {
      const out: Out = [];
      for (const m of mods) for (const r of rows(m.comp)) {
        if (r.required && r.value === '' && r.type !== 'bool') out.push({ module: nameOf(m.comp), path: r.path, message: `${r.desc || r.key} is required but empty` });
      }
      return out;
    },
  },
  {
    id: 'field.option', level: 'error', scope: 'field', title: 'Selection is one of the offered options',
    check: ({ mods }) => {
      const out: Out = [];
      for (const m of mods) for (const r of rows(m.comp)) {
        if (r.type !== 'combo' || !r.options?.length || r.key === 'parentNodeUuid') continue;
        if (!r.options.some((o) => o.key === r.value)) out.push({ module: nameOf(m.comp), path: r.path, message: `${r.desc || r.key} = "${r.value}" is not among its options` });
      }
      return out;
    },
  },
  {
    id: 'field.identity', level: 'info', scope: 'field', title: 'Vendor and model are recorded',
    check: ({ mods }) => mods
      .filter((m) => !get(m.comp, 'general/vender_name') && !get(m.comp, 'general/module_dsc_type') && !/chassis|wheel|carrier/i.test(subTypeOf(m.comp)))
      .map((m) => ({ module: nameOf(m.comp), path: 'general/vender_name', message: 'Vendor and model are both empty' })),
  },

  /* ───── topology ───── */
  {
    id: 'module.unique', level: 'error', scope: 'topology', title: 'Module names and UUIDs are unique',
    check: ({ mods }) => {
      const out: Out = [];
      for (const [label, f] of [['name', nameOf], ['UUID', uuidOf]] as const) {
        const seen = new Map<string, number>();
        for (const m of mods) seen.set(f(m.comp), (seen.get(f(m.comp)) ?? 0) + 1);
        for (const [v, n] of seen) if (n > 1 && v) out.push({ module: label === 'name' ? v : undefined, message: `${n} modules share the ${label} "${v}"` });
      }
      return out;
    },
  },
  {
    id: 'module.parent', level: 'error', scope: 'topology', title: 'Parent module exists',
    check: ({ mods }) => {
      const ids = new Set(mods.map((m) => uuidOf(m.comp)));
      return mods.filter((m) => poseOf(m.comp).parentUuid && !ids.has(poseOf(m.comp).parentUuid))
        .map((m) => ({ module: nameOf(m.comp), path: 'struct/parentNodeUuid', message: 'The parent module no longer exists' }));
    },
  },
  {
    id: 'link.self', level: 'error', scope: 'topology', title: 'A port is not linked to itself or to its own module',
    check: ({ p, mods }) => {
      const idx = portIndex(p);
      const out: Out = [];
      for (const m of mods) for (const iface of interfacesOf(m.comp)) {
        if (iface.type === 'ETH') continue; // a controller's ETH ports are bridged by its on-board switch
        const own: string[] = [];
        let self = false;
        for (const u of new Set(iface.linked_interface_uuid)) {
          if (u === iface.interface_uuid) self = true;
          else if (idx.get(u)?.module.comp === m.comp) own.push(idx.get(u)!.iface.key);
        }
        if (self) out.push({ module: nameOf(m.comp), path: `if/${iface.key}`, message: `${iface.key} is linked to itself` });
        if (own.length) out.push({ module: nameOf(m.comp), path: `if/${iface.key}`, message: `${iface.key} is linked to the module's own ${own.join(', ')}` });
      }
      return out;
    },
  },
  {
    id: 'link.dangling', level: 'error', scope: 'topology', title: 'Linked port exists',
    check: ({ p, mods }) => {
      const idx = portIndex(p);
      const out: Out = [];
      for (const m of mods) for (const iface of interfacesOf(m.comp)) {
        const missing = iface.linked_interface_uuid.filter((u) => !idx.has(u)).length;
        if (missing) out.push({ module: nameOf(m.comp), path: `if/${iface.key}`, message: `${iface.key} links to ${missing} port(s) that do not exist` });
      }
      return out;
    },
  },
  {
    id: 'link.duplicate', level: 'info', scope: 'topology', title: 'A link is recorded once',
    check: ({ mods }) => {
      const out: Out = [];
      for (const m of mods) for (const iface of interfacesOf(m.comp)) {
        if (new Set(iface.linked_interface_uuid).size !== iface.linked_interface_uuid.length) out.push({ module: nameOf(m.comp), path: `if/${iface.key}`, message: `${iface.key} lists the same link more than once` });
      }
      return out;
    },
  },
  {
    id: 'link.reciprocal', level: 'warning', scope: 'topology', title: 'Links are recorded on both ends',
    check: ({ p }) => links(p).filter((l) => !l.reciprocal)
      .map((l) => ({ module: nameOf(l.a.module.comp), path: `if/${l.a.iface.key}`, message: `${portLabel(l.a)} ↔ ${portLabel(l.b)} is recorded on one end only` })),
  },
  {
    id: 'link.type', level: 'error', scope: 'topology', title: 'Linked ports are compatible',
    check: ({ p }) => {
      const pair = (a: string, b: string) => a === b || [['DI', 'DO'], ['PI', 'PO'], ['AI', 'AO']].some(([x, y]) => (a === x && b === y) || (a === y && b === x));
      return links(p).filter((l) => l.a.module.comp !== l.b.module.comp && !pair(l.a.iface.type, l.b.iface.type))
        .map((l) => ({ module: nameOf(l.a.module.comp), path: `if/${l.a.iface.key}`, message: `${portLabel(l.a)} (${l.a.iface.type}) is linked to ${portLabel(l.b)} (${l.b.iface.type})` }));
    },
  },
  {
    id: 'can.nodeId', level: 'error', scope: 'topology', title: 'CANopen node IDs are unique on a bus',
    check: ({ p }) => {
      const out: Out = [];
      const canopen = (pt: Port) => /CANOPEN/i.test(String(ifaceValue(pt.iface, 'protocol') ?? ''));
      for (const bus of buses(p).filter((b) => b.type === 'CAN')) {
        const byId = new Map<number, Port[]>();
        for (const pt of bus.ports.filter(canopen)) {
          const id = ifaceValue(pt.iface, 'nodeId');
          if (id === undefined || id === '') continue;
          byId.set(Number(id), [...(byId.get(Number(id)) ?? []), pt]);
        }
        for (const [id, ports] of byId) if (ports.length > 1) {
          out.push({ module: nameOf(ports[0].module.comp), path: `if/${ports[0].iface.key}/param/nodeId`, message: `Node ID ${id} is used by ${ports.map(portLabel).join(' and ')} on the same CANopen bus` });
        }
      }
      return out;
    },
  },
  {
    id: 'can.terminator', level: 'info', scope: 'topology', title: 'A CAN bus has at most two terminators',
    check: ({ p }) => {
      const out: Out = [];
      for (const bus of buses(p).filter((b) => b.type === 'CAN')) {
        const withR = bus.ports.filter((pt) => /HAVE/i.test(String(ifaceValue(pt.iface, 'resistor') ?? '')) && !/NO|NONE|WITHOUT/i.test(String(ifaceValue(pt.iface, 'resistor'))));
        if (bus.ports.length >= 3 && withR.length > 2) {
          out.push({ module: nameOf(bus.ports[0].module.comp), path: `if/${bus.ports[0].iface.key}/param/resistor`, message: `${withR.length} of ${bus.ports.length} nodes have a terminator (${withR.map(portLabel).join(', ')}); only the two bus ends should` });
        }
      }
      return out;
    },
  },
  {
    id: 'bus.settings', level: 'warning', scope: 'topology', title: 'Both ends of a link use the same bus settings',
    check: ({ p }) => {
      const out: Out = [];
      for (const l of links(p)) for (const key of ['baudrate', 'protocol', 'dataBits', 'stopBits', 'parity']) {
        const a = ifaceValue(l.a.iface, key), b = ifaceValue(l.b.iface, key);
        if (a === undefined || b === undefined || a === '' || b === '' || a === b) continue;
        // a master may list several protocols (A&B); the link is fine when one side's set contains the other's
        const sa = String(a).split('&'), sb = String(b).split('&');
        if (sa.every((x) => sb.includes(x)) || sb.every((x) => sa.includes(x))) continue;
        {
          out.push({ module: nameOf(l.a.module.comp), path: `if/${l.a.iface.key}/param/${key}`, message: `${key} differs: ${portLabel(l.a)} = ${a}, ${portLabel(l.b)} = ${b}` });
        }
      }
      return out;
    },
  },
  {
    id: 'net.ip', level: 'error', scope: 'topology', title: 'IP addresses are unique',
    check: ({ p }) => {
      const byIp = new Map<string, Port[]>();
      for (const pt of portIndex(p).values()) {
        const ip = String(ifaceValue(pt.iface, 'ip') ?? '');
        if (ip) byIp.set(ip, [...(byIp.get(ip) ?? []), pt]);
      }
      return [...byIp].filter(([, ports]) => new Set(ports.map((x) => x.module.comp)).size > 1)
        .map(([ip, ports]) => ({ module: nameOf(ports[0].module.comp), path: `if/${ports[0].iface.key}/param/ip`, message: `IP ${ip} is used by ${ports.map(portLabel).join(' and ')}` }));
    },
  },
  {
    id: 'net.controllerIp', level: 'info', scope: 'topology', title: 'Controller network port has an address',
    check: ({ p }) => {
      const out: Out = [];
      for (const pt of portIndex(p).values()) {
        if (pt.iface.type !== 'ETH' || mainTypeOf(pt.module.comp) !== 'mainCPU') continue;
        const peers = pt.iface.linked_interface_uuid.filter((u) => u !== pt.iface.interface_uuid);
        if (peers.length && ifaceValue(pt.iface, 'ip') === '') out.push({ module: nameOf(pt.module.comp), path: `if/${pt.iface.key}/param/ip`, message: `${portLabel(pt)} has devices attached but no IP address` });
      }
      return out;
    },
  },
  /* ───── vehicle ───── */
  {
    id: 'vehicle.controller', level: 'error', scope: 'vehicle', title: 'Vehicle has a main controller',
    check: ({ mods }) => (mods.length && !mods.some((m) => mainTypeOf(m.comp) === 'mainCPU') ? [{ message: 'No main controller in the model' }] : []),
  },
  {
    id: 'vehicle.battery', level: 'warning', scope: 'vehicle', title: 'Vehicle has a battery',
    check: ({ mods }) => (mods.length && !mods.some((m) => mainTypeOf(m.comp) === 'battery') ? [{ message: 'No battery in the model' }] : []),
  },
  {
    id: 'vehicle.estop', level: 'warning', scope: 'vehicle', title: 'An emergency stop is bound to the safety function',
    check: ({ p, mods }) => (mods.length && !bindings(p).some((b) => /emc|emerg|estop/i.test(b.key) && b.module && b.module !== 'NONE') ? [{ message: 'No emergency-stop button is bound in the safety function' }] : []),
  },
  {
    id: 'func.binding', level: 'error', scope: 'vehicle', title: 'Function bindings point at existing modules',
    check: ({ p, mods }) => {
      if (!mods.length) return [];
      const names = new Set(mods.map((m) => nameOf(m.comp)));
      return bindings(p).filter((b) => b.module && b.module !== 'NONE' && !names.has(b.module))
        .map((b) => ({ path: `${b.func}/${b.child}/${b.key}`, message: `${b.childDesc || b.child}: "${b.key}" refers to "${b.module}", which is not in the model` }));
    },
  },
  {
    id: 'chassis.rotateDiameter', level: 'info', scope: 'vehicle', title: 'Rotation diameter covers the footprint',
    check: ({ mods }) => {
      const out: Out = [];
      for (const m of mods.filter((x) => mainTypeOf(x.comp) === 'chassis')) {
        const n = (k: string) => numAt(m, new RegExp(`/${k}\\s*\\(Idle\\)$`)) ?? 0;
        const diag = 2 * Math.hypot(Math.max(n('headOffset'), n('tailOffset')), Math.max(n('leftOffset'), n('rightOffset')));
        const row = rows(m.comp).find((r) => r.key === 'rotateDiameter');
        if (row && diag > 0 && Number(row.value) < diag - 1) out.push({ module: nameOf(m.comp), path: row.path, message: `Rotation diameter ${row.value} mm is smaller than the footprint diagonal ${fmt(diag)} mm` });
      }
      return out;
    },
  },
  {
    id: 'chassis.speed', level: 'warning', scope: 'vehicle', title: 'Maximum speed is reachable by the drive train',
    check: ({ mods }) => {
      const out: Out = [];
      const chassis = mods.find((m) => mainTypeOf(m.comp) === 'chassis');
      if (!chassis) return out;
      const vmaxRow = rows(chassis.comp).find((r) => /^maxSpeed\s*\(Idle\)$/.test(r.key));
      const wheels = mods.filter((m) => mainTypeOf(m.comp) === 'driveWheel');
      if (!vmaxRow || !wheels.length) return out;
      const radius = Math.max(...wheels.map((w) => numAt(w, /\/wheelRadius$/) ?? 0));
      const groups = new Set(wheels.map((w) => w.group));
      for (const motor of mods.filter((m) => isMotor(m) && groups.has(m.group))) {
        const rpm = numAt(motor, /\/RPM$/), gear = numAt(motor, /\/gearRatio$/);
        if (!rpm || !gear || !radius) continue;
        const v = (rpm / gear / 60) * 2 * Math.PI * radius;
        if (v < Number(vmaxRow.value) * 0.98) {
          out.push({ module: nameOf(chassis.comp), path: vmaxRow.path, message: `Max speed ${vmaxRow.value} mm/s is not reachable: ${nameOf(motor.comp)} at ${rpm} rpm through ${gear}:1 on a ${radius} mm wheel gives ${fmt(v)} mm/s` });
          break;
        }
      }
      return out;
    },
  },
  {
    id: 'lidar.heading', level: 'warning', scope: 'vehicle', title: 'Lidar faces away from the vehicle body',
    check: ({ mods }) => {
      const out: Out = [];
      for (const m of mods.filter(isLaser)) {
        const ps = poseOf(m.comp);
        const r = Math.hypot(ps.x, ps.y);
        if (r < 50) continue;
        const dot = (Math.cos(deg(ps.yaw)) * ps.x + Math.sin(deg(ps.yaw)) * ps.y) / r;
        if (dot < -0.2) out.push({ module: nameOf(m.comp), path: 'struct/locCoordYAW', message: `Mounted at (${fmt(ps.x)}, ${fmt(ps.y)}) but yaw ${ps.yaw}° points across the vehicle body` });
      }
      return out;
    },
  },
  {
    id: 'lidar.forward', level: 'warning', scope: 'vehicle', title: 'Obstacle-avoidance lasers cover the forward direction',
    check: ({ p, mods }) => {
      const bound = bindings(p).filter((b) => /laser/i.test(b.key) && /safety|obs|avoid/i.test(`${b.func}/${b.child}/${b.key}/${b.attrKey}`));
      const lasers = bound.map((b) => mods.find((m) => nameOf(m.comp) === b.module)).filter((m): m is ModuleRef => !!m);
      if (!lasers.length) return [];
      const covers = (m: ModuleRef) => {
        const s = numAt(m, /actualScanRangeHorizonStart$/), e = numAt(m, /actualScanRangeHorizonEnd$/);
        if (s === undefined || e === undefined || s === e) return true; // unknown field of view: do not guess
        let rel = (0 - poseOf(m.comp).yaw) % 360;
        if (rel > 180) rel -= 360;
        if (rel < -180) rel += 360;
        return rel >= s && rel <= e;
      };
      return lasers.some(covers) ? [] : [{ module: nameOf(lasers[0].comp), path: 'struct/locCoordYAW', message: `No obstacle-avoidance laser sees straight ahead (bound: ${lasers.map((m) => nameOf(m.comp)).join(', ')})` }];
    },
  },
  {
    id: 'motor.rating', level: 'info', scope: 'vehicle', title: 'Motor ratings are filled in',
    check: ({ mods }) => mods.filter(isMotor).filter((m) => ['torque', 'ratedCurr'].some((k) => numAt(m, new RegExp(`/${k}$`)) === 0))
      .map((m) => ({ module: nameOf(m.comp), path: 'private/motorAttr', message: 'Rated torque or current is 0' })),
  },
  {
    id: 'battery.rating', level: 'info', scope: 'vehicle', title: 'Battery ratings are filled in',
    check: ({ mods }) => mods.filter((m) => mainTypeOf(m.comp) === 'battery').filter((m) => {
      const rs = rows(m.comp).filter((r) => /rated(Voltage|Capacity)/i.test(r.key));
      return rs.length > 0 && rs.every((r) => Number(r.value) === 0);
    }).map((m) => ({ module: nameOf(m.comp), path: 'private/batteryAttr', message: 'Rated voltage and capacity are 0' })),
  },
];

export interface Report { findings: Finding[]; errors: number; warnings: number; infos: number }

export function validate(p: Project, rules: Rule[] = RULES): Report {
  const ctx: Ctx = { p, mods: modules(p) };
  const findings: Finding[] = [];
  for (const r of rules) {
    let found: Out;
    try {
      found = r.check(ctx);
    } catch (err) {
      found = [{ message: `Rule could not be evaluated: ${(err as Error).message}` }];
    }
    for (const f of found) findings.push({ rule: r.id, level: r.level, scope: r.scope, ...f });
  }
  const order: Record<Level, number> = { error: 0, warning: 1, info: 2 };
  findings.sort((a, b) => order[a.level] - order[b.level]);
  return {
    findings,
    errors: findings.filter((f) => f.level === 'error').length,
    warnings: findings.filter((f) => f.level === 'warning').length,
    infos: findings.filter((f) => f.level === 'info').length,
  };
}
