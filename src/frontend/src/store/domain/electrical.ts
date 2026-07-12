import type {
  ComponentConfig,
  Diagnostic,
  ElectricalConnection,
  ElectricalConnectionKind,
  InterfaceConfig,
} from '../types';

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

export function countInterfaces(components: ComponentConfig[]) {
  return components.reduce((count, component) => count + (component.interfaces || []).length, 0);
}
