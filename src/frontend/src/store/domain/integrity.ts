import type { RobotConfig } from '../types';

export type IntegrityIssue = {
  severity: 'ERROR' | 'WARNING';
  code: string;
  message: string;
  nodeId?: string;
};

/** Structural identity and reference checks independent of module semantics. */
export function auditModelIntegrity(config: RobotConfig): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const components = config.components || [];
  const componentCounts = new Map<string, number>();
  const interfaceOwners = new Map<string, string>();
  const interfaceCounts = new Map<string, number>();
  const removedOrMissingParents: string[] = [];

  components.forEach(component => {
    componentCounts.set(component.id, (componentCounts.get(component.id) || 0) + 1);
    (component.interfaces || []).forEach(iface => {
      if (!iface.interfaceUuid) {
        issues.push({ severity: 'ERROR', code: 'INTERFACE_UUID_MISSING', message: `[${component.alias || component.name}] 接口缺少 interfaceUuid。`, nodeId: component.id });
        return;
      }
      const owner = interfaceOwners.get(iface.interfaceUuid);
      const count = (interfaceCounts.get(iface.interfaceUuid) || 0) + 1;
      interfaceCounts.set(iface.interfaceUuid, count);
      if (!owner) {
        interfaceOwners.set(iface.interfaceUuid, component.id);
      }
    });
  });

  interfaceCounts.forEach((count, uuid) => {
    if (count > 1) {
      issues.push({ severity: 'ERROR', code: 'INTERFACE_UUID_DUPLICATE', message: `接口 UUID ${uuid} 重复 ${count} 次，无法安全解析连接端点。` });
    }
  });

  componentCounts.forEach((count, id) => {
    if (count > 1) {
      issues.push({ severity: 'ERROR', code: 'COMPONENT_ID_DUPLICATE', message: `组件 ID ${id} 重复 ${count} 次，无法安全区分实例。`, nodeId: id });
    }
  });

  components.forEach(component => {
    const poseFields = ['mountX', 'mountY', 'mountZ', 'mountRoll', 'mountPitch', 'mountYaw'] as const;
    const missingPose = poseFields.filter(field => typeof component[field] !== 'number' || !Number.isFinite(component[field]));
    if (missingPose.length > 0) {
      issues.push({
        severity: 'ERROR',
        code: 'MOUNT_POSE_INVALID_OR_MISSING',
        message: `[${component.alias || component.name}] 安装位姿字段无效或缺失：${missingPose.join(', ')}。`,
        nodeId: component.id,
      });
    }
    if (component.parentNodeUuid && !components.some(parent => parent.id === component.parentNodeUuid)) {
      removedOrMissingParents.push(component.id);
      issues.push({ severity: 'ERROR', code: 'PARENT_NOT_FOUND', message: `[${component.alias || component.name}] 的父节点 ${component.parentNodeUuid} 不存在。`, nodeId: component.id });
    }

    (component.interfaces || []).forEach(iface => {
      (iface.linkedInterfaceUuid || []).forEach(targetUuid => {
        if (!interfaceOwners.has(targetUuid)) {
          issues.push({ severity: 'ERROR', code: 'LINK_TARGET_NOT_FOUND', message: `[${component.alias || component.name}] 接口 ${iface.key || iface.interfaceUuid} 指向不存在的接口 ${targetUuid}。`, nodeId: component.id });
        }
      });
    });
  });

  const componentById = new Map(components.map(component => [component.id, component]));
  components.forEach(component => {
    const visited = new Set<string>();
    let current: string | null = component.id;
    while (current) {
      if (visited.has(current)) {
        issues.push({ severity: 'ERROR', code: 'PARENT_CYCLE', message: `[${component.alias || component.name}] 的 parentNodeUuid 形成循环。`, nodeId: component.id });
        break;
      }
      visited.add(current);
      current = componentById.get(current)?.parentNodeUuid || null;
    }
  });

  if (removedOrMissingParents.length > 0) {
    issues.push({ severity: 'WARNING', code: 'STRUCTURE_INCOMPLETE', message: `存在 ${removedOrMissingParents.length} 个组件的结构父节点缺失。` });
  }

  return issues;
}
