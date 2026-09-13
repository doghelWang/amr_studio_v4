import type { ComponentConfig, RobotConfig } from '../types';

/**
 * 装配域是工坊的 view-only 投影。
 * 它不创建 Proto 字段、不改 parentNodeUuid，也不参与导出；源数据仍以
 * ComponentConfig、接口和显式父子关系为准。
 */
export type AssemblyViewMode = 'body' | 'transparent' | 'wheel' | 'exploded';

export type AssemblyNode = {
  key: string;
  label: string;
  hint: string;
  kind: 'root' | 'group' | 'component';
  component?: ComponentConfig;
  children: AssemblyNode[];
  source: 'explicit-parent' | 'view-group';
};

export type AssemblyCoverage = {
  chassis: boolean;
  expectedWheels: number;
  wheels: number;
  drivers: number;
  motors: number;
  encoders: number;
  sensors: number;
  power: number;
  control: number;
  unpositioned: number;
  connectedInterfaces: number;
  busConnections: number;
};

const WHEEL_COUNTS: Record<string, number> = {
  STANDARD_DIFF: 2,
  SINGLE_STEER: 1,
  DUAL_STEER: 2,
  QUAD_STEER: 4,
};

const isEncoder = (component: ComponentConfig) => {
  const text = `${component.type} ${component.name} ${component.subModuleTypeKey || ''} ${component.mainModuleTypeKey || ''}`.toLowerCase();
  return component.category === 'SENSOR' && text.includes('encod');
};

const isMotor = (component: ComponentConfig) => component.category === 'MOTOR' || component.category === 'ACTOR';
const isDriver = (component: ComponentConfig) => component.category === 'DRIVER' || component.category === 'DRIVE';
const isWheel = (component: ComponentConfig) => component.category === 'DRIVEWHEEL';

const groupOf = (component: ComponentConfig) => {
  if (isWheel(component) || isDriver(component) || isMotor(component) || isEncoder(component)) return 'drive';
  if (component.category === 'SENSOR' || component.category === 'VISUAL' || component.category === 'SENSORPROCESSOR') return 'sensing';
  if (component.category === 'BATTERY' || component.category === 'ENERGYCONTROLLER') return 'power';
  if (component.category === 'MAINCPU' || component.category === 'CONTROL' || component.category === 'INTERGRATEDCONTROLLER' || component.category === 'COMMUNICATION' || component.category === 'NETWORK') return 'control';
  return 'other';
};

const groupMeta: Record<string, { label: string; hint: string }> = {
  drive: { label: '动力与反馈', hint: '轮组 → 驱动器 → 电机 → 编码器' },
  sensing: { label: '感知与安全', hint: '激光、视觉、避障、急停' },
  power: { label: '电源与能源', hint: '电池与能源控制' },
  control: { label: '主控与通信', hint: '主控、控制器、网络与总线' },
  other: { label: '其他装备', hint: '未归入参考视图分组的模块' },
};

function componentNode(component: ComponentConfig, source: AssemblyNode['source']): AssemblyNode {
  return {
    key: component.id,
    label: component.alias || component.name || 'unknown',
    hint: `${component.category || 'unknown'} · ${component.parentNodeUuid ? '显式父节点' : '根级引用'}`,
    kind: 'component',
    component,
    children: [],
    source,
  };
}

/** Builds a hierarchy without mutating or inferring exported relationships. */
export function buildAssemblyTree(config: RobotConfig): AssemblyNode {
  const components = config.components || [];
  const byParent = new Map<string, ComponentConfig[]>();
  components.forEach(component => {
    const key = component.parentNodeUuid || '__root__';
    const list = byParent.get(key) || [];
    list.push(component);
    byParent.set(key, list);
  });

  const buildChildren = (parentId: string): AssemblyNode[] => (byParent.get(parentId) || []).map(component => ({
    ...componentNode(component, 'explicit-parent'),
    children: buildChildren(component.id),
  }));

  const chassis = components.find(component => component.category === 'CHASSIS');
  const root: AssemblyNode = {
    key: 'assembly-reference-root',
    label: config.identity.robotName || 'AMR',
    hint: 'OpenAMR MMP 参考视图 · 不写回模型',
    kind: 'root',
    children: [],
    source: 'view-group',
  };

  if (chassis) {
    root.children.push({ ...componentNode(chassis, 'explicit-parent'), children: buildChildren(chassis.id) });
  }

  // Components with explicit parent links are already represented above. The
  // following groups are intentionally a second, non-exporting index so that
  // the user can audit the OpenAMR-like assembly disciplines even when source
  // hierarchy is incomplete.
  const grouped = new Map<string, ComponentConfig[]>();
  components.filter(component => component.category !== 'CHASSIS').forEach(component => {
    const group = groupOf(component);
    const list = grouped.get(group) || [];
    list.push(component);
    grouped.set(group, list);
  });
  root.children.push(...Array.from(grouped.entries()).map(([key, items]) => ({
    key: `view-${key}`,
    label: groupMeta[key].label,
    hint: `${groupMeta[key].hint} · 视图分组`,
    kind: 'group' as const,
    source: 'view-group' as const,
    children: items.map(item => componentNode(item, 'view-group')),
  })));
  return root;
}

export function getAssemblyCoverage(config: RobotConfig): AssemblyCoverage {
  const components = config.components || [];
  const connections = components.flatMap(component => component.interfaces || []);
  const linked = connections.filter(iface => (iface.linkedInterfaceUuid || []).length > 0);
  return {
    chassis: components.some(component => component.category === 'CHASSIS'),
    expectedWheels: WHEEL_COUNTS[config.identity.driveType] || 0,
    wheels: components.filter(isWheel).length,
    drivers: components.filter(isDriver).length,
    motors: components.filter(isMotor).length,
    encoders: components.filter(isEncoder).length,
    sensors: components.filter(component => component.category === 'SENSOR' || component.category === 'VISUAL').length,
    power: components.filter(component => component.category === 'BATTERY' || component.category === 'ENERGYCONTROLLER').length,
    control: components.filter(component => ['MAINCPU', 'CONTROL', 'INTERGRATEDCONTROLLER', 'COMMUNICATION', 'NETWORK'].includes(component.category)).length,
    unpositioned: components.filter(component => component.category !== 'CHASSIS' && [component.mountX, component.mountY, component.mountZ, component.mountRoll, component.mountPitch, component.mountYaw].every(value => value === undefined || value === null || Number(value) === 0)).length,
    connectedInterfaces: linked.length,
    busConnections: linked.filter(iface => ['CAN', 'RS485', 'RS232', 'UART', 'ETH', 'ETHERNET'].includes((iface.type || '').toUpperCase())).length,
  };
}

export const assemblyGroupMeta = groupMeta;
