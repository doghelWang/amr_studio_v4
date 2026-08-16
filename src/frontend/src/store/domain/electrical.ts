import type {
  ComponentConfig,
  Diagnostic,
  ElectricalConnection,
  ElectricalConnectionKind,
  InterfaceConfig,
} from '../types';
import { readInterfaceParams } from './interfaceParams';

type InterfaceRef = {
  component: ComponentConfig;
  iface: InterfaceConfig;
};

const COMMUNICATION_BUS = new Set(['CAN', 'RS485', 'RS232', 'UART', 'ETH', 'ETHERNET', 'USB']);
const IO_SIGNAL = new Set(['DI', 'DO', 'AI', 'AO', 'PI', 'PO']);
const POWER = new Set(['BAT', 'POWER', 'PWR']);
const ONBOARD = new Set(['SPI']);
const AUDIO_VIDEO = new Set(['SPK', 'LVDS', 'SMA', 'HDMI']);

export function normalizeInterfaceType(type?: string): string {
  const upper = (type || '').trim().toUpperCase();
  if (upper === 'ETHERNET') return 'ETH';
  return upper;
}

export function classifyConnectionKind(type?: string): ElectricalConnectionKind {
  const normalized = normalizeInterfaceType(type);
  if (COMMUNICATION_BUS.has(normalized)) return 'communication_bus';
  if (IO_SIGNAL.has(normalized)) return 'io_signal';
  if (POWER.has(normalized)) return 'power';
  if (ONBOARD.has(normalized)) return 'onboard';
  if (AUDIO_VIDEO.has(normalized)) return 'audio_video';
  return 'unknown';
}

export function getConnectionDirection(sourceType?: string, targetType?: string): ElectricalConnection['direction'] {
  const source = normalizeInterfaceType(sourceType);
  const target = normalizeInterfaceType(targetType);
  if (source === 'DO' && target === 'DI') return 'source_to_target';
  if (source === 'DI' && target === 'DO') return 'target_to_source';
  if (COMMUNICATION_BUS.has(source) && source === target) return 'bidirectional';
  if (ONBOARD.has(source) && source === target) return 'bidirectional';
  return 'unknown';
}

export function getConnectionMultiplicity(type?: string): ElectricalConnection['multiplicity'] {
  const normalized = normalizeInterfaceType(type);
  if (normalized === 'CAN' || normalized === 'RS485') return 'bus_multi_drop';
  if (normalized) return 'point_to_point';
  return 'unknown';
}

function buildInterfaceIndex(components: ComponentConfig[]): Map<string, InterfaceRef> {
  const index = new Map<string, InterfaceRef>();
  components.forEach(component => {
    (component.interfaces || []).forEach(iface => {
      if (iface.interfaceUuid) index.set(iface.interfaceUuid, { component, iface });
    });
  });
  return index;
}

function createConnectionId(sourceUuid: string, targetUuid: string): string {
  const [a, b] = [sourceUuid, targetUuid].sort();
  return `conn_${a}_${b}`;
}

export function validateInterfaceConnection(source: InterfaceRef, target?: InterfaceRef): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  if (!target) {
    diagnostics.push({
      severity: 'error',
      code: 'CONNECTION_TARGET_NOT_FOUND',
      message: '连接目标接口不存在。',
      componentId: source.component.id,
      interfaceUuid: source.iface.interfaceUuid,
      source: 'linkedInterfaceUuid',
    });
    return diagnostics;
  }

  const sourceType = normalizeInterfaceType(source.iface.type);
  const targetType = normalizeInterfaceType(target.iface.type);
  const sameTypeAllowed = sourceType === targetType;
  const inverseIoAllowed = (sourceType === 'DI' && targetType === 'DO') || (sourceType === 'DO' && targetType === 'DI');
  const analogInverseAllowed = (sourceType === 'AI' && targetType === 'AO') || (sourceType === 'AO' && targetType === 'AI');
  const pulseInverseAllowed = (sourceType === 'PI' && targetType === 'PO') || (sourceType === 'PO' && targetType === 'PI');

  if (!sameTypeAllowed && !inverseIoAllowed && !analogInverseAllowed && !pulseInverseAllowed) {
    diagnostics.push({
      severity: 'error',
      code: 'CONNECTION_TYPE_INCOMPATIBLE',
      message: `接口类型不兼容：${source.iface.key}(${sourceType}) -> ${target.iface.key}(${targetType})。`,
      componentId: source.component.id,
      interfaceUuid: source.iface.interfaceUuid,
      source: 'linkedInterfaceUuid',
    });
  }

  if ((sourceType === 'DI' && targetType !== 'DO') || (sourceType === 'DO' && targetType !== 'DI')) {
    diagnostics.push({
      severity: 'error',
      code: 'CONNECTION_IO_DIRECTION_INVALID',
      message: 'DI/DO 接线必须遵循输入连接输出、输出连接输入。',
      componentId: source.component.id,
      interfaceUuid: source.iface.interfaceUuid,
      source: 'linkedInterfaceUuid',
    });
  }

  return diagnostics;
}

export function buildElectricalConnections(components: ComponentConfig[]): ElectricalConnection[] {
  const index = buildInterfaceIndex(components);
  const connections = new Map<string, ElectricalConnection>();

  components.forEach(component => {
    (component.interfaces || []).forEach(iface => {
      (iface.linkedInterfaceUuid || []).forEach(targetUuid => {
        const sourceRef = { component, iface };
        const targetRef = index.get(targetUuid);
        const connectionId = createConnectionId(iface.interfaceUuid, targetUuid);
        const diagnostics = validateInterfaceConnection(sourceRef, targetRef);

        if (!targetRef) {
          connections.set(`${connectionId}_${component.id}`, {
            id: `${connectionId}_${component.id}`,
            kind: classifyConnectionKind(iface.type),
            interfaceType: normalizeInterfaceType(iface.type),
            sourceComponentId: component.id,
            sourceComponentName: component.alias || component.name,
            sourceInterfaceUuid: iface.interfaceUuid,
            sourceInterfaceKey: iface.key,
            targetComponentId: '',
            targetComponentName: '未知接口',
            targetInterfaceUuid: targetUuid,
            targetInterfaceKey: targetUuid,
            targetInterfaceType: 'UNKNOWN',
            direction: 'unknown',
            multiplicity: getConnectionMultiplicity(iface.type),
            source: 'imported_cmodel',
            sourceRefs: [`${component.id}.${iface.interfaceUuid}`],
            diagnostics,
          });
          return;
        }

        const existing = connections.get(connectionId);
        if (existing) {
          existing.sourceRefs.push(`${component.id}.${iface.interfaceUuid}`);
          existing.diagnostics.push({
            severity: 'trace',
            code: 'CONNECTION_DUPLICATE_REF_MERGED',
            message: '发现同一连接的重复引用，已合并为一个连接实体。',
            connectionId,
            source: 'linkedInterfaceUuid',
          });
          return;
        }

        connections.set(connectionId, {
          id: connectionId,
          kind: classifyConnectionKind(iface.type),
          interfaceType: normalizeInterfaceType(iface.type),
          sourceComponentId: component.id,
          sourceComponentName: component.alias || component.name,
          sourceInterfaceUuid: iface.interfaceUuid,
          sourceInterfaceKey: iface.key,
          targetComponentId: targetRef.component.id,
          targetComponentName: targetRef.component.alias || targetRef.component.name,
          targetInterfaceUuid: targetRef.iface.interfaceUuid,
          targetInterfaceKey: targetRef.iface.key,
          targetInterfaceType: normalizeInterfaceType(targetRef.iface.type),
          direction: getConnectionDirection(iface.type, targetRef.iface.type),
          multiplicity: getConnectionMultiplicity(iface.type),
          source: 'imported_cmodel',
          sourceRefs: [`${component.id}.${iface.interfaceUuid}`],
          diagnostics,
        });
      });
    });
  });

  return Array.from(connections.values()).sort((a, b) => a.id.localeCompare(b.id));
}

export function findInterfaceRef(components: ComponentConfig[], interfaceUuid: string): InterfaceRef | undefined {
  return buildInterfaceIndex(components).get(interfaceUuid);
}

export function getCompatibleInterfaceTargets(
  components: ComponentConfig[],
  sourceComponentId: string,
  sourceInterfaceUuid: string,
) {
  const sourceComponent = components.find(component => component.id === sourceComponentId);
  const sourceIface = sourceComponent?.interfaces.find(iface => iface.interfaceUuid === sourceInterfaceUuid);
  if (!sourceComponent || !sourceIface) return [];

  const sourceRef = { component: sourceComponent, iface: sourceIface };
  return components.flatMap(component =>
    (component.interfaces || [])
      .filter(iface => iface.interfaceUuid !== sourceInterfaceUuid)
      .map(iface => {
        const diagnostics = validateInterfaceConnection(sourceRef, { component, iface });
        return { component, iface, diagnostics };
      })
      .filter(item => !item.diagnostics.some(diagnostic => diagnostic.severity === 'error'))
  );
}

export function summarizeElectricalConnections(connections: ElectricalConnection[]) {
  const byKind = connections.reduce<Record<string, number>>((acc, connection) => {
    acc[connection.kind] = (acc[connection.kind] || 0) + 1;
    return acc;
  }, {});

  const byType = connections.reduce<Record<string, number>>((acc, connection) => {
    acc[connection.interfaceType] = (acc[connection.interfaceType] || 0) + 1;
    return acc;
  }, {});

  const diagnostics = connections.flatMap(connection => connection.diagnostics);
  return {
    total: connections.length,
    byKind,
    byType,
    errorCount: diagnostics.filter(item => item.severity === 'error').length,
    warningCount: diagnostics.filter(item => item.severity === 'warning').length,
  };
}

/**
 * Validate only parameters explicitly described by the current module
 * templates. Project-specific bus rules remain unresolved until a project
 * specification supplies them.
 */
export function auditInterfaceParameters(components: ComponentConfig[]): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const canNodesByBus = new Map<string, Map<number, string>>();
  const canAllowedBaudrates = new Set(['1M', '500K', '250K', '125K', '100K']);
  const rs485AllowedBaudrates = new Set(['9600', '4800', '19200', '38400', '115200', '921600']);

  components.forEach(component => (component.interfaces || []).forEach(iface => {
    const type = normalizeInterfaceType(iface.type);
    const params = readInterfaceParams(iface.interfaceParams || {});
    const source = 'Interface_Prarm template';
    if (type === 'CAN') {
      const bus = iface.key || iface.interfaceUuid;
      const nodeId = Number(params.nodeId);
      const baudrate = params.baudrate;
      if (!Number.isInteger(nodeId) || nodeId < 1 || nodeId > 127) {
        diagnostics.push({ severity: 'error', code: 'CAN_NODE_ID_INVALID_OR_MISSING', message: 'CAN nodeId 缺失或不在模板规定的 1..127 范围内。', componentId: component.id, interfaceUuid: iface.interfaceUuid, source });
      } else {
        const nodes = canNodesByBus.get(bus) || new Map<number, string>();
        const previous = nodes.get(nodeId);
        if (previous) {
          diagnostics.push({ severity: 'error', code: 'CAN_NODE_ID_DUPLICATE', message: `同一接口键 ${bus} 下 CAN nodeId=${nodeId} 重复。`, componentId: component.id, interfaceUuid: iface.interfaceUuid, source });
        } else nodes.set(nodeId, component.id);
        canNodesByBus.set(bus, nodes);
      }
      if (!canAllowedBaudrates.has(String(baudrate))) {
        diagnostics.push({ severity: 'error', code: 'CAN_BAUDRATE_INVALID_OR_MISSING', message: `CAN baudrate 缺失或不在模板选项中：${String(baudrate)}`, componentId: component.id, interfaceUuid: iface.interfaceUuid, source });
      }
    } else if (type === 'RS485') {
      if (!rs485AllowedBaudrates.has(String(params.baudrate))) {
        diagnostics.push({ severity: 'error', code: 'RS485_BAUDRATE_INVALID_OR_MISSING', message: `RS485 baudrate 缺失或不在模板选项中：${String(params.baudrate)}`, componentId: component.id, interfaceUuid: iface.interfaceUuid, source });
      }
      diagnostics.push({ severity: 'warning', code: 'RS485_STATION_ID_UNRESOLVED', message: '当前 RS485 模板未定义 stationId 字段，站号规则 unresolved。', componentId: component.id, interfaceUuid: iface.interfaceUuid, source });
    } else if (type === 'ETH') {
      if (typeof params.ip !== 'string' || params.ip.trim() === '') {
        diagnostics.push({ severity: 'error', code: 'ETH_IP_MISSING', message: 'ETH 接口缺少模板字段 ip。', componentId: component.id, interfaceUuid: iface.interfaceUuid, source });
      }
    }
  }));

  return diagnostics;
}

/**
 * Audit only the topology that is explicitly represented by linkedInterfaceUuid.
 * CAN/RS485 are treated as multi-drop buses, but no implicit links are created.
 */
export function auditBusTopology(components: ComponentConfig[]): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const index = buildInterfaceIndex(components);
  const visited = new Set<string>();

  for (const component of components) {
    for (const iface of component.interfaces || []) {
      const type = normalizeInterfaceType(iface.type);
      if ((type !== 'CAN' && type !== 'RS485') || !iface.interfaceUuid || visited.has(iface.interfaceUuid)) continue;

      const members: InterfaceRef[] = [];
      const queue = [iface.interfaceUuid];
      visited.add(iface.interfaceUuid);
      while (queue.length) {
        const uuid = queue.shift()!;
        const ref = index.get(uuid);
        if (!ref) continue;
        members.push(ref);
        for (const linkedUuid of ref.iface.linkedInterfaceUuid || []) {
          const linked = index.get(linkedUuid);
          if (!linked || visited.has(linkedUuid)) continue;
          const linkedType = normalizeInterfaceType(linked.iface.type);
          if (linkedType === type) {
            visited.add(linkedUuid);
            queue.push(linkedUuid);
          }
        }
      }

      // A single represented interface is not enough evidence to invent a bus
      // network, so only compare parameters when at least two interfaces are linked.
      if (members.length < 2) continue;
      const parameterValues = members.map(ref => ({
        ref,
        params: readInterfaceParams(ref.iface.interfaceParams || {}),
      }));
      const baudrates = new Set(parameterValues
        .map(item => item.params.baudrate)
        .filter(value => value !== undefined && value !== null && String(value).trim() !== '')
        .map(String));
      if (baudrates.size > 1) {
        diagnostics.push({
          severity: 'error',
          code: 'BUS_BAUDRATE_MISMATCH',
          message: `${type} 已连接接口的 baudrate 不一致：${Array.from(baudrates).join(', ')}`,
          componentId: members[0].component.id,
          interfaceUuid: members[0].iface.interfaceUuid,
          source: 'interfaceParams/interfaceParamsArray',
        });
      }

      if (type === 'CAN') {
        const nodeOwners = new Map<number, InterfaceRef>();
        for (const item of parameterValues) {
          const nodeId = Number(item.params.nodeId);
          if (!Number.isInteger(nodeId)) continue;
          const previous = nodeOwners.get(nodeId);
          if (previous) {
            diagnostics.push({
              severity: 'error',
              code: 'BUS_CAN_NODE_ID_DUPLICATE',
              message: `同一已连接 CAN 总线中 nodeId=${nodeId} 重复。`,
              componentId: item.ref.component.id,
              interfaceUuid: item.ref.iface.interfaceUuid,
              source: 'interfaceParams/interfaceParamsArray',
            });
          } else {
            nodeOwners.set(nodeId, item.ref);
          }
        }
      }
    }
  }
  return diagnostics;
}

export type ElectricalBusNetwork = {
  id: string;
  type: 'CAN' | 'RS485' | 'ETH';
  topology: 'explicit' | 'point_to_point' | 'unresolved';
  members: InterfaceRef[];
  connections: ElectricalConnection[];
  baudrates: string[];
  nodeIds: Array<{ value: number; componentName: string; interfaceKey?: string }>;
  status: 'connected' | 'incomplete' | 'parameter_error' | 'unresolved';
  reasons: string[];
};

/**
 * Build the UI-level bus/network status from explicit model relations only.
 * This is intentionally separate from auditBusTopology: the UI needs a
 * network summary, while the audit still owns the authoritative diagnostics.
 */
export function summarizeElectricalBusNetworks(components: ComponentConfig[]): ElectricalBusNetwork[] {
  const index = buildInterfaceIndex(components);
  const connections = buildElectricalConnections(components);
  const result: ElectricalBusNetwork[] = [];
  const visited = new Set<string>();

  for (const component of components) {
    for (const iface of component.interfaces || []) {
      const type = normalizeInterfaceType(iface.type);
      if ((type !== 'CAN' && type !== 'RS485') || !iface.interfaceUuid || visited.has(iface.interfaceUuid)) continue;
      const members: InterfaceRef[] = [];
      const queue = [iface.interfaceUuid];
      visited.add(iface.interfaceUuid);
      while (queue.length) {
        const uuid = queue.shift()!;
        const ref = index.get(uuid);
        if (!ref) continue;
        members.push(ref);
        for (const linkedUuid of ref.iface.linkedInterfaceUuid || []) {
          const linked = index.get(linkedUuid);
          if (linked && normalizeInterfaceType(linked.iface.type) === type && !visited.has(linkedUuid)) {
            visited.add(linkedUuid);
            queue.push(linkedUuid);
          }
        }
      }
      const memberUuids = new Set(members.map(item => item.iface.interfaceUuid));
      const networkConnections = connections.filter(connection =>
        connection.interfaceType === type && memberUuids.has(connection.sourceInterfaceUuid) && memberUuids.has(connection.targetInterfaceUuid),
      );
      const params = members.map(item => readInterfaceParams(item.iface.interfaceParams || {}));
      const baudrates = Array.from(new Set(params.map(item => item.baudrate).filter(value => value !== undefined && value !== null && String(value) !== '').map(String)));
      const nodeIds = members.flatMap((item, position) => {
        const value = Number(params[position].nodeId);
        return Number.isInteger(value) ? [{ value, componentName: item.component.alias || item.component.name, interfaceKey: item.iface.key }] : [];
      });
      const reasons: string[] = [];
      if (members.length < 2 || networkConnections.length === 0) reasons.push('未形成两端以上的显式 linkedInterfaceUuid 拓扑');
      if (baudrates.length > 1) reasons.push(`波特率不一致：${baudrates.join(' / ')}`);
      if (type === 'CAN' && new Set(nodeIds.map(item => item.value)).size !== nodeIds.length) reasons.push('CAN nodeId 重复');
      if (params.some(item => !item.baudrate)) reasons.push('存在接口缺少 baudrate');
      if (type === 'CAN' && params.some(item => !Number.isInteger(Number(item.nodeId)))) reasons.push('存在接口缺少有效 nodeId');
      result.push({
        id: `${type}:${members.map(item => item.iface.interfaceUuid).sort().join('|')}`,
        type: type as 'CAN' | 'RS485',
        topology: members.length >= 2 && networkConnections.length > 0 ? 'explicit' : 'unresolved',
        members,
        connections: networkConnections,
        baudrates,
        nodeIds,
        status: reasons.some(reason => reason.includes('不一致') || reason.includes('重复') || reason.includes('缺少')) ? 'parameter_error' : reasons.length ? 'unresolved' : 'connected',
        reasons,
      });
    }
  }

  connections.filter(connection => connection.interfaceType === 'ETH').forEach(connection => {
    const members = [
      findInterfaceRef(components, connection.sourceInterfaceUuid),
      findInterfaceRef(components, connection.targetInterfaceUuid),
    ].filter(Boolean) as InterfaceRef[];
    result.push({
      id: connection.id,
      type: 'ETH',
      topology: 'point_to_point',
      members,
      connections: [connection],
      baudrates: [],
      nodeIds: [],
      status: connection.targetComponentId && !connection.diagnostics.some(item => item.severity === 'error') ? 'connected' : 'incomplete',
      reasons: connection.targetComponentId ? connection.diagnostics.filter(item => item.severity !== 'trace').map(item => item.message) : ['ETH 目标接口不存在'],
    });
  });
  return result;
}

export function countInterfaces(components: ComponentConfig[]) {
  return components.reduce((count, component) => count + (component.interfaces || []).length, 0);
}
