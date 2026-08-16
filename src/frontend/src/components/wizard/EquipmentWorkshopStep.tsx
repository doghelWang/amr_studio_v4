import React, { useMemo, useState } from 'react';
import {
  Alert, Badge, Button, Card, Checkbox, Col, Empty, InputNumber, List, Progress, Row,
  Select, Space, Statistic, Tag, Tooltip, Typography, message,
} from 'antd';
import {
  AimOutlined, ApiOutlined, AudioOutlined, CheckCircleOutlined,
  CompassOutlined, ControlOutlined, DeploymentUnitOutlined, DisconnectOutlined,
  ExperimentOutlined, LinkOutlined, PlusOutlined,
  RobotOutlined, SafetyCertificateOutlined, SettingOutlined, ThunderboltOutlined,
  ZoomInOutlined, ZoomOutOutlined,
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { ImportService } from '../../store/ImportService';
import { ElectricalInterfaceMatrixStep } from './ElectricalInterfaceMatrixStep';
import { auditInterfaceParameters, buildElectricalConnections, getCompatibleInterfaceTargets, summarizeElectricalConnections } from '../../store/domain/electrical';
import { auditModelIntegrity } from '../../store/domain/integrity';
import { summarizeFunctionProcesses } from '../../store/domain/functions';
import { assemblyGroupMeta, buildAssemblyTree, getAssemblyCoverage, type AssemblyNode, type AssemblyViewMode } from '../../store/domain/assembly';
import { DRIVE_TYPE_LABELS, type ComponentConfig } from '../../store/types';
import EquipmentWebGLScene from './EquipmentWebGLScene';

const { Text, Title } = Typography;

/**
 * 这是产品交互层的功能分组，不是 Proto 的新枚举。
 * 真正的模块类别、属性、接口和关系仍全部来自 schemaRegistry / ComponentConfig。
 */
const FUNCTION_GROUPS = [
  { key: 'movement', label: '行走与动力', hint: '底盘、驱动、轮组、电机', icon: <DeploymentUnitOutlined />, categories: ['DRIVEWHEEL', 'DRIVER', 'MOTOR', 'DRIVE', 'ACTOR'] },
  { key: 'localization', label: '定位与导航', hint: '激光、视觉、定位处理', icon: <CompassOutlined />, categories: ['SENSOR', 'SENSORPROCESSOR', 'VISUAL'] },
  { key: 'avoidance', label: '避障与安全', hint: '安全传感、碰撞、急停', icon: <SafetyCertificateOutlined />, categories: ['SENSOR', 'SENSORPROCESSOR', 'BUTTON', 'IO_BOARD'] },
  { key: 'power', label: '能源与充电', hint: '电池、能源控制、充电相关', icon: <ThunderboltOutlined />, categories: ['BATTERY', 'ENERGYCONTROLLER'] },
  { key: 'control', label: '主控与通信', hint: '主控、VCU、网络、总线', icon: <ControlOutlined />, categories: ['MAINCPU', 'CONTROL', 'INTERGRATEDCONTROLLER', 'COMMUNICATION', 'NETWORK', 'EXTENDEDLNTERFACE'] },
  { key: 'interaction', label: '声光与人机', hint: '屏幕、按钮、扬声器、灯光', icon: <AudioOutlined />, categories: ['AUDIO', 'LIGHT', 'BUTTON', 'SCREEN', 'IO_BOARD'] },
] as const;

const PHASES = [
  { key: 'prepare', label: '准备', desc: '资料与器件清单' },
  { key: 'structure', label: '结构装配', desc: '底盘与安装坐标' },
  { key: 'electrical', label: '电气连接', desc: '接口、总线、电源' },
  { key: 'function', label: '功能绑定', desc: '能力与器件关联' },
  { key: 'validate', label: '整车校验', desc: '校验、监控、调试' },
] as const;

const POSITION_SLOTS = [
  { key: 'front', label: '前部', icon: '↑' },
  { key: 'rear', label: '后部', icon: '↓' },
  { key: 'left', label: '左侧', icon: '←' },
  { key: 'right', label: '右侧', icon: '→' },
  { key: 'top', label: '顶部', icon: '◇' },
  { key: 'center', label: '中心', icon: '＋' },
] as const;

const PREP_CHECKLIST = [
  { key: 'can-card', label: 'CAN 卡已准备', source: 'Wiki：造车前的工具准备' },
  { key: 'serial-adapter', label: 'USB-485/232 转换卡已准备', source: 'Wiki：造车前的工具准备' },
  { key: 'eth-can-gui', label: 'EthCanGui 已准备', source: 'Wiki：造车前的工具准备' },
] as const;

const CALIBRATION_CHECKLIST = [
  { key: 'calib-tools', label: '卷尺、激光水平仪、记号笔已准备', source: 'Wiki：调试车辆前的准备工作' },
  { key: 'zeroing', label: '现场标零已完成', source: 'Wiki：控制器上电及功能激活' },
  { key: 'wheel-params', label: '轴距、轮半径、减速比、编码器线数和电机反转已核对', source: 'Wiki：实施过程 FAQ' },
  { key: 'calibration-result', label: '现场标定结果已记录', source: 'Wiki：标定' },
  { key: 'repeatability', label: '重复到点精度实测达到 ±5 mm', source: 'Wiki：货物开箱和基础功能检查' },
] as const;

type CatalogItem = {
  id: string;
  title: string;
  source: string;
  category: string;
  type: string;
  data: any;
  raw: any;
};

const CATEGORY_LABELS: Record<string, string> = {
  CHASSIS: '底盘', DRIVEWHEEL: '驱动轮', DRIVER: '驱动器', MOTOR: '电机',
  SENSOR: '传感器', SENSORPROCESSOR: '传感处理', VISUAL: '视觉', BATTERY: '电池',
  ENERGYCONTROLLER: '能源控制', MAINCPU: '主控', CONTROL: '控制',
  INTERGRATEDCONTROLLER: '集成控制', COMMUNICATION: '通信', NETWORK: '网络',
  BUTTON: '按钮', SCREEN: '屏幕', AUDIO: '音频', LIGHT: '灯光', IO_BOARD: 'IO板',
};

const getCategoryLabel = (category: string) => CATEGORY_LABELS[category] || category || '未知类别';
const componentOptionLabel = (component: ComponentConfig) => `${component.alias || component.name} · ${component.id.slice(0, 8)}`;

// Visual classification only. It does not infer protocol, dimensions or
// function; all geometry remains a schematic representation of the source
// module category/type and actual pose fields.
const getVisualKind = (component: ComponentConfig): 'wheel' | 'lidar' | 'button' | 'battery' | 'controller' | 'io' | 'motor' | 'driver' | 'module' => {
  const text = `${component.category} ${component.type} ${component.name} ${component.alias}`.toUpperCase();
  if (component.category === 'DRIVEWHEEL' || text.includes('WHEEL')) return 'wheel';
  if (component.category === 'SENSOR' && (text.includes('LASER') || text.includes('LIDAR') || text.includes('LS-'))) return 'lidar';
  if (component.category === 'BUTTON' || text.includes('BUTTON') || text.includes('EMERGENCY') || text.includes('ESTOP')) return 'button';
  if (component.category === 'BATTERY') return 'battery';
  if (component.category === 'MAINCPU' || component.category === 'CONTROL' || component.category === 'INTERGRATEDCONTROLLER') return 'controller';
  if (component.category === 'IO_BOARD') return 'io';
  if (component.category === 'MOTOR' || text.includes('MOTOR')) return 'motor';
  if (component.category === 'DRIVER' || text.includes('DRIVER')) return 'driver';
  return 'module';
};

const getExplodedAnchor = (kind: ReturnType<typeof getVisualKind>, index: number) => {
  const anchors: Record<string, Array<{ x: number; y: number }>> = {
    // X is front/rear and Y is left/right. These anchors are only used to
    // separate unresolved origin poses in the engineering exploded view.
    wheel: [{ x: 50, y: 14 }, { x: 50, y: 86 }, { x: 28, y: 14 }, { x: 72, y: 86 }],
    lidar: [{ x: 78, y: 50 }, { x: 28, y: 50 }],
    button: [{ x: 84, y: 30 }, { x: 84, y: 70 }, { x: 72, y: 50 }],
    battery: [{ x: 44, y: 50 }],
    controller: [{ x: 52, y: 50 }, { x: 66, y: 50 }],
    io: [{ x: 38, y: 62 }, { x: 38, y: 38 }],
    motor: [{ x: 50, y: 25 }, { x: 50, y: 75 }],
    driver: [{ x: 34, y: 30 }, { x: 34, y: 70 }],
  };
  const group = anchors[kind] || [{ x: 50, y: 50 }];
  return group[index % group.length];
};

const flattenRegistry = (value: any, source = 'schemaRegistry'): any[] => {
  if (Array.isArray(value)) return value.flatMap(item => flattenRegistry(item, source));
  if (!value || typeof value !== 'object') return [];
  const hasPayload = Boolean(value.full_data || value.data_json || value.data_xml || value.moduleComponets || value.module_componets || value.generalAttr);
  const own = hasPayload ? [{ ...value, __source: source }] : [];
  return own.concat(Object.entries(value).flatMap(([key, child]) => flattenRegistry(child, `${source}.${key}`)));
};

const getEntityPayload = (entity: any) => entity.full_data || entity.data_json || entity.data_xml || entity;

const catalogKey = (entity: any, mapped: any) => [
  entity.file_name, entity.moduleGroupName, mapped?.name, mapped?.type,
].filter(Boolean).join('|');

const classify = (category: string) => FUNCTION_GROUPS.find(group => group.categories.includes(category as never))?.key || 'control';

const positionState = (component: ComponentConfig) => {
  const values = [component.mountX, component.mountY, component.mountZ, component.mountRoll, component.mountPitch, component.mountYaw];
  const rawStruct = component.rawCmodelComponent?.structParam || component.rawCmodelComponent?.struct_param || component.rawStructParam || {};
  const rawExtend = rawStruct.extendParams || rawStruct.extend_params || [];
  const coordinateKeys = new Set(['locCoordX', 'locCoordY', 'locCoordZ', 'locCoordROLL', 'locCoordPITCH', 'locCoordYAW']);
  const hasExplicitCoordinates = Array.isArray(rawExtend) && rawExtend.some((param: any) => coordinateKeys.has(param.key)
    && ['doubleValue', 'double_value', 'floatValue', 'float_value', 'int32Value', 'int32_value', 'int64Value', 'int64_value']
      .some(valueKey => Object.prototype.hasOwnProperty.call(param, valueKey)));
  return hasExplicitCoordinates || values.some(value => value !== undefined && value !== null && Number(value) !== 0) ? '已定位' : '待定位';
};

const connectionCount = (component: ComponentConfig) => component.interfaces.reduce((total, iface) => total + (iface.linkedInterfaceUuid || []).length, 0);

export const EquipmentWorkshopStep: React.FC<{ onExport?: () => void }> = () => {
  const {
    config, schemaRegistry, schemaRegistrySource, activeComponentId, setActiveComponent, addComponentFromConfig,
    updateStructuralParam, createConnection, fetchSchemas,
  } = useProjectStore();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [groupKey, setGroupKey] = useState<string>('movement');
  const [phaseKey, setPhaseKey] = useState<string>('structure');
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [selectedInstalledId, setSelectedInstalledId] = useState<string | null>(activeComponentId);
  const [parentId, setParentId] = useState<string>(config.components.find(component => component.category === 'CHASSIS')?.id || '');
  const [sourceComponentId, setSourceComponentId] = useState<string>();
  const [sourceInterfaceUuid, setSourceInterfaceUuid] = useState<string>();
  const [targetComponentId, setTargetComponentId] = useState<string>();
  const [targetInterfaceUuid, setTargetInterfaceUuid] = useState<string>();
  const [draftPose, setDraftPose] = useState({ mountX: 0, mountY: 0, mountZ: 0, mountRoll: 0, mountPitch: 0, mountYaw: 0 });
  const [sessionChecklist, setSessionChecklist] = useState<Record<string, boolean>>({});
  const [cameraView, setCameraView] = useState<'iso' | 'top' | 'front' | 'side' | 'free'>('iso');
  const [zoomCommand, setZoomCommand] = useState(0);
  const [explodeView, setExplodeView] = useState(false);
  const [assemblyView, setAssemblyView] = useState<AssemblyViewMode>('body');

  const chassis = config.components.find(component => component.category === 'CHASSIS');
  const installed = useMemo(() => config.components.filter(component => component.category !== 'CHASSIS'), [config.components]);

  const catalog = useMemo<CatalogItem[]>(() => {
    const seen = new Set<string>();
    return flattenRegistry(schemaRegistry)
      .map((entity: any) => {
        try {
          const data = getEntityPayload(entity);
          const mapped = ImportService.mapEntityToComponent(data, schemaRegistry);
          if (!mapped || mapped.category === 'CHASSIS') return null;
          const key = catalogKey(entity, mapped);
          if (seen.has(key)) return null;
          seen.add(key);
          return {
            id: key || `${mapped.category}:${mapped.type}`,
            title: entity.moduleGroupName || entity.name || mapped.alias || mapped.name,
            source: entity.__source || 'schemaRegistry',
            category: mapped.category,
            type: mapped.type,
            data,
            raw: entity,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean) as CatalogItem[];
  }, [schemaRegistry]);

  const visibleCatalog = catalog.filter(item => classify(item.category) === groupKey);
  const selectedCatalog = catalog.find(item => item.id === selectedCatalogId);
  const selectedInstalled = installed.find(component => component.id === selectedInstalledId);
  const sourceComponent = config.components.find(component => component.id === sourceComponentId);
  const targetComponent = config.components.find(component => component.id === targetComponentId);
  const compatibleTargets = sourceComponentId && sourceInterfaceUuid
    ? getCompatibleInterfaceTargets(config.components, sourceComponentId, sourceInterfaceUuid)
    : [];
  const compatibleTargetComponentIds = new Set(compatibleTargets.map(item => item.component.id));
  const chassisReady = Boolean(chassis && config.identity.robotName && config.identity.chassisLength && config.identity.chassisWidth);
  const positionReady = installed.length > 0 && installed.every(component => positionState(component) === '已定位');
  const connectionReady = installed.length > 0 && installed.every(component => component.interfaces.length === 0 || connectionCount(component) > 0);
  const progress = Math.round(([chassisReady, installed.length > 0, positionReady, connectionReady].filter(Boolean).length / 4) * 100);
  const currentPhase = PHASES.find(phase => phase.key === phaseKey) || PHASES[1];
  const integrityIssues = useMemo(() => auditModelIntegrity(config), [config]);
  const parameterIssues = useMemo(() => auditInterfaceParameters(config.components), [config.components]);
  const electricalSummary = useMemo(() => summarizeElectricalConnections(buildElectricalConnections(config.components)), [config.components]);
  const functionSummary = useMemo(() => summarizeFunctionProcesses(config.functionProcesses, config.rawFuncDesc), [config.functionProcesses, config.rawFuncDesc]);
  const assemblyTree = useMemo(() => buildAssemblyTree(config), [config]);
  const assemblyCoverage = useMemo(() => getAssemblyCoverage(config), [config]);
  const assemblyPhase = [
    { key: 'base', label: '基座', done: Boolean(assemblyCoverage.chassis) },
    { key: 'wheel', label: '轮组', done: assemblyCoverage.wheels >= assemblyCoverage.expectedWheels && assemblyCoverage.expectedWheels > 0 },
    { key: 'drive', label: '动力反馈', done: assemblyCoverage.drivers >= assemblyCoverage.expectedWheels && assemblyCoverage.motors >= assemblyCoverage.expectedWheels },
    { key: 'sense', label: '感知安全', done: assemblyCoverage.sensors > 0 },
    { key: 'wire', label: '总线连接', done: assemblyCoverage.busConnections > 0 },
    { key: 'accept', label: '验收', done: integrityIssues.every(issue => issue.severity !== 'ERROR') && parameterIssues.every(issue => issue.severity !== 'error') },
  ];
  const toggleChecklist = (key: string, checked: boolean) => setSessionChecklist(current => ({ ...current, [key]: checked }));
  const prepDone = PREP_CHECKLIST.filter(item => sessionChecklist[item.key]).length;
  const calibrationDone = CALIBRATION_CHECKLIST.filter(item => sessionChecklist[item.key]).length;
  const cameraPresets = {
    iso: { label: '装配透视' },
    top: { label: '顶视 XY' },
    front: { label: '前视 YZ' },
    side: { label: '侧视 XZ' },
  } as const;
  const phaseBrief: Record<string, string> = {
    prepare: '先确认机型身份、底盘尺寸和器件资料；没有来源的模块不会被工坊虚构出来。',
    structure: '把模块装到车体层级中，再为每个模块确认父节点和 6-DOF 安装位姿。',
    electrical: '结构完成只代表“装上了”；选择真实接口并建立通信、电源或 IO 连接。',
    function: '把已连接的硬件映射到定位、避障、运动、交互等软件能力。',
    validate: '检查模型完整性、层级、坐标、连接和在线调试条件，再进入导出。',
  };

  const renderAssemblyNode = (node: AssemblyNode, depth = 0): React.ReactNode => {
    const selected = node.component?.id === selectedInstalledId;
    return <div key={node.key} className={`assembly-node assembly-node-${node.kind} ${selected ? 'selected' : ''}`} style={{ marginLeft: depth * 8 }}>
      <button type="button" onClick={() => node.component && selectInstalled(node.component)} disabled={!node.component}>
        <span className="assembly-node-mark">{node.kind === 'component' ? '•' : node.kind === 'root' ? '⌂' : '＋'}</span>
        <span><strong>{node.label}</strong><small>{node.hint}</small></span>
        {node.source === 'view-group' && <Tag>只读分组</Tag>}
      </button>
      {node.children.map(child => renderAssemblyNode(child, depth + 1))}
    </div>;
  };

  const applyPositionSlot = (slotKey: typeof POSITION_SLOTS[number]['key']) => {
    if (!chassis) return;
    const halfLength = Number(chassis.shape?.length || config.identity.chassisLength || 0) / 2;
    const halfWidth = Number(chassis.shape?.width || config.identity.chassisWidth || 0) / 2;
    // 这是由当前底盘尺寸推导的“装配意图预览”，不是来自 Proto 的默认安装值。
    const slotPose = {
      front: { mountX: halfLength, mountY: 0, mountZ: draftPose.mountZ },
      rear: { mountX: -halfLength, mountY: 0, mountZ: draftPose.mountZ },
      left: { mountX: 0, mountY: halfWidth, mountZ: draftPose.mountZ },
      right: { mountX: 0, mountY: -halfWidth, mountZ: draftPose.mountZ },
      top: { mountX: 0, mountY: 0, mountZ: Number(chassis.shape?.height || config.identity.chassisHeight || 0) },
      center: { mountX: 0, mountY: 0, mountZ: draftPose.mountZ },
    }[slotKey];
    setDraftPose(pose => ({ ...pose, ...slotPose }));
  };

  const selectInstalled = (component: ComponentConfig) => {
    setSelectedInstalledId(component.id);
    setActiveComponent(component.id);
    setDraftPose({ mountX: component.mountX, mountY: component.mountY, mountZ: component.mountZ, mountRoll: component.mountRoll, mountPitch: component.mountPitch, mountYaw: component.mountYaw });
    setParentId(component.parentNodeUuid || chassis?.id || '');
  };

  const installSelected = () => {
    if (!selectedCatalog || !chassis) return;
    try {
      const component = ImportService.mapEntityToComponent(selectedCatalog.data, schemaRegistry);
      if (!component) return;
      addComponentFromConfig({ ...component, parentNodeUuid: parentId || chassis.id, ...draftPose });
      messageApi.success(`已装配：${selectedCatalog.title}。坐标仍以当前输入为准，请继续校验。`);
      setSelectedCatalogId(null);
    } catch (error) {
      messageApi.error('该模块缺少可解析的完整模型数据，未执行装配。');
    }
  };

  const applyPose = () => {
    if (!selectedInstalled) return;
    updateStructuralParam(selectedInstalled.id, { parentNodeUuid: parentId || null, ...draftPose });
    messageApi.success('结构关系与安装位姿已更新。');
  };

  const connect = () => {
    if (!sourceComponentId || !sourceInterfaceUuid || !targetComponentId || !targetInterfaceUuid) return;
    const result = createConnection(sourceComponentId, sourceInterfaceUuid, targetComponentId, targetInterfaceUuid);
    if (result.ok) messageApi.success('电气连接已建立');
    else messageApi.error(result.message || '连接未建立');
  };

  const ifaceOptions = (component?: ComponentConfig, compatibleOnly = false) => {
    const candidates = component?.interfaces || [];
    const filtered = compatibleOnly
      ? compatibleTargets.filter(item => item.component.id === component?.id).map(item => item.iface)
      : candidates;
    return filtered.map(iface => ({ value: iface.interfaceUuid, label: `${iface.label || iface.key || '接口'} · ${iface.type || 'unknown'}` }));
  };

  return (
    <div className="equipment-workshop">
      {messageContextHolder}
      <div className="workshop-hero">
        <div>
          <Tag color="cyan">WORKSHOP / 构车任务</Tag>
          <Title level={2}>装备式构车工坊</Title>
          <Text type="secondary">把 Wiki 的构车 SOP 变成一条可回溯的装配任务链：先准备，再装配，再连线，最后绑定能力并校验。</Text>
        </div>
        <div className="workshop-progress"><Progress type="circle" percent={progress} size={72} /><div><Text strong>整车完成度</Text><br /><Text type="secondary">模型仍以 Proto 数据为准</Text></div></div>
      </div>

      <div className="phase-track">
        {PHASES.map((phase, index) => {
          const active = phase.key === phaseKey;
          const done = index === 0 ? chassisReady : index === 1 ? positionReady : index === 2 ? connectionReady : false;
          return <button key={phase.key} className={`phase-node ${active ? 'active' : ''} ${done ? 'done' : ''}`} onClick={() => setPhaseKey(phase.key)}>
            <span className="phase-index">{done ? <CheckCircleOutlined /> : index + 1}</span><span><strong>{phase.label}</strong><small>{phase.desc}</small></span>
          </button>;
        })}
      </div>
      <div className="assembly-phase-strip" aria-label="OpenAMR 参考装配阶段">
        <span className="assembly-phase-title">总成构建进度</span>
        {assemblyPhase.map((step, index) => <span key={step.key} className={`assembly-phase-step ${step.done ? 'done' : ''}`}><i>{step.done ? '✓' : index + 1}</i>{step.label}</span>)}
        <Text type="secondary">参考 MMP 层级 · 只读审计投影</Text>
      </div>

      <Alert className="wiki-gate" type="info" showIcon message={`当前任务：${currentPhase.label} · ${currentPhase.desc}`} description={phaseBrief[currentPhase.key]} />

      {phaseKey === 'electrical' && (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <ElectricalInterfaceMatrixStep />
        </div>
      )}

      {phaseKey === 'prepare' && (
        <Card title="Wiki 准备门" style={{ marginTop: 16, marginBottom: 16 }}>
          <Space wrap>
            <Tag color={chassisReady ? 'success' : 'warning'}>{chassisReady ? '底盘身份/尺寸已确认' : '底盘身份/尺寸待确认'}</Tag>
            <Tag color={schemaRegistrySource === 'api' ? 'success' : 'warning'}>{schemaRegistrySource === 'api' ? '在线模块来源' : '模块来源待确认'}</Tag>
            <Tag>器件清单 {installed.length} 项</Tag>
          </Space>
          <Alert style={{ marginTop: 12 }} type="info" showIcon message="Wiki 要求先完成器件选型、适配范围和构车资料收集。模块名称不能替代真实型号、协议和现场参数。" />
          <Card size="small" title="造车前工具与现场边界" style={{ marginTop: 12 }}>
            <Space wrap>
              <Tag color={prepDone === PREP_CHECKLIST.length ? 'success' : 'warning'}>工具准备 {prepDone}/{PREP_CHECKLIST.length}</Tag>
            </Space>
            <Space direction="vertical" style={{ width: '100%', marginTop: 10 }}>
              {PREP_CHECKLIST.map(item => <Checkbox key={item.key} checked={Boolean(sessionChecklist[item.key])} onChange={event => toggleChecklist(item.key, event.target.checked)}>{item.label} <Text type="secondary">（{item.source}）</Text></Checkbox>)}
            </Space>
            <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Wiki《造车前的工具准备》将以上工具列为造车/调试准备项；当前页面只登记准备状态，不伪造“已具备”。
            </Typography.Text>
            <Alert style={{ marginTop: 10 }} type="info" showIcon message="SRC-2000 示例：24V、纹波 ≤150mVpp、系统最小工作电流 2A（不含 Power DO）；不得与电机或大功耗设备共用 DCDC。" />
            <Alert style={{ marginTop: 10 }} type="warning" showIcon message="SRC-2000 连接示例默认控制器 IP 为 192.168.192.5、PC 使用 192.168.192.x；该示例不作为任意 ETH 模块 IP 默认值，模块 IP 仍须按模板/现场资料填写。" />
          </Card>
        </Card>
      )}

      {phaseKey === 'function' && (
        <Card title="功能绑定门" style={{ marginTop: 16, marginBottom: 16 }}>
          <Space wrap>
            <Tag color={functionSummary.processCount > 0 ? 'success' : 'warning'}>FuncDesc {functionSummary.processCount || functionSummary.rawFunctionCount} 项</Tag>
            <Tag color={config.abilities.functionAbility?.length ? 'success' : 'warning'}>functionAbility {config.abilities.functionAbility?.length || 0} 项</Tag>
            <Tag color={functionSummary.readonlyCount > 0 ? 'warning' : 'default'}>只读/关系待确认 {functionSummary.readonlyCount}</Tag>
          </Space>
          <Alert style={{ marginTop: 12 }} type="warning" showIcon message="功能过程与硬件的组件/接口/连接关系若未由源 FuncDesc 明确提供，将保持 unresolved，不自动猜测。" />
          <Card size="small" title="Wiki 二次开发门" style={{ marginTop: 12 }}>
            <Space wrap>
              <Tag color="warning">机构/执行脚本 unresolved</Tag>
              <Tag color="warning">第三方通信 API unresolved</Tag>
              <Tag color="warning">按钮/灯光/扬声器反馈 unresolved</Tag>
              <Tag color="warning">任务互锁与异常反馈 unresolved</Tag>
            </Space>
            <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Wiki 将机构控制、第三方通信、人机交互和任务互锁作为二次开发闭环；当前 Proto/模型未提供可验证的脚本入口、API、反馈和互锁字段，因此只登记为 unresolved。
            </Typography.Text>
          </Card>
        </Card>
      )}

      {phaseKey === 'validate' && (
        <Card title="Wiki 整车校验门" style={{ marginTop: 16, marginBottom: 16 }}>
          <Space wrap>
            <Tag color={integrityIssues.some(issue => issue.severity === 'ERROR') ? 'error' : 'success'}>结构完整性错误 {integrityIssues.filter(issue => issue.severity === 'ERROR').length}</Tag>
            <Tag color={parameterIssues.some(issue => issue.severity === 'error') ? 'error' : 'success'}>接口参数错误 {parameterIssues.filter(issue => issue.severity === 'error').length}</Tag>
            <Tag>电气连接 {electricalSummary.total}</Tag>
          </Space>
          <Alert style={{ marginTop: 12 }} type={integrityIssues.length || parameterIssues.length ? 'warning' : 'success'} showIcon message={integrityIssues.length || parameterIssues.length ? '存在待处理或 unresolved 项，请进入“审计导出”查看明细。' : '当前已通过已实现的结构和模板参数检查。'} />
          <Card size="small" title="Wiki 调车/标定验收门" style={{ marginTop: 12 }}>
            <Space wrap>
              <Tag color={calibrationDone === CALIBRATION_CHECKLIST.length ? 'success' : 'warning'}>调车/标定 {calibrationDone}/{CALIBRATION_CHECKLIST.length}</Tag>
            </Space>
            <Space direction="vertical" style={{ width: '100%', marginTop: 10 }}>
              {CALIBRATION_CHECKLIST.map(item => <Checkbox key={item.key} checked={Boolean(sessionChecklist[item.key])} onChange={event => toggleChecklist(item.key, event.target.checked)}>{item.label} <Text type="secondary">（{item.source}）</Text></Checkbox>)}
            </Space>
            <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Wiki 要求调试前准备卷尺、激光水平仪和记号笔，并核对轴距、轮半径、减速比、编码器线数和电机反转；标零和现场标定属于运行态验收，当前 Proto/模型没有可确认的实测结果，因此保持 unresolved。
            </Typography.Text>
          </Card>
        </Card>
      )}

      <Row gutter={[16, 16]} className="workshop-grid">
        <Col xs={24} lg={4}>
          <Card title="功能装备栏" extra={<Badge count={installed.length} showZero />} className="workshop-card function-card">
            {FUNCTION_GROUPS.map(group => <button key={group.key} className={`function-item ${group.key === groupKey ? 'selected' : ''}`} onClick={() => setGroupKey(group.key)}>
              <span className="function-icon">{group.icon}</span><span><strong>{group.label}</strong><small>{group.hint}</small></span><span className="function-count">{installed.filter(item => group.categories.includes(item.category as never)).length}</span>
            </button>)}
          </Card>
          <Card title="装配清单" className="workshop-card installed-card">
            {installed.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有装备，先从左侧选择模块" /> : <List size="small" dataSource={installed} renderItem={component => <List.Item className={selectedInstalledId === component.id ? 'list-selected' : ''} onClick={() => selectInstalled(component)}>
              <List.Item.Meta avatar={<span className="status-dot" data-state={positionState(component) === '已定位' ? 'ok' : 'warn'} />} title={componentOptionLabel(component)} description={`${getCategoryLabel(component.category)} · ${positionState(component)}`} />
              <Tag>{connectionCount(component)}/{component.interfaces.length}</Tag>
            </List.Item>} />}
          </Card>
          <Card title="总成树 · MMP 参考" className="workshop-card assembly-tree-card">
            <div className="assembly-reference-note">参考 OpenAMR 的底盘、轮组、感知和电气分层；“只读分组”只用于审核视图，不写回 parentNodeUuid。</div>
            <div className="assembly-tree">{renderAssemblyNode(assemblyTree)}</div>
            <div className="assembly-coverage">
              <div><span>底盘</span><b>{assemblyCoverage.chassis ? '已识别' : '缺失'}</b></div>
              <div><span>轮组</span><b>{assemblyCoverage.wheels}/{assemblyCoverage.expectedWheels || '?'}</b></div>
              <div><span>总线</span><b>{assemblyCoverage.busConnections}</b></div>
              <div><span>待定位</span><b>{assemblyCoverage.unpositioned}</b></div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card className="workshop-card chassis-card" title={<Space><RobotOutlined />底盘中心 · Robot Body</Space>} extra={<Tag color={chassisReady ? 'success' : 'warning'}>{chassisReady ? '基础资料就绪' : '待填写身份/尺寸'}</Tag>}>
            <div className="scene-hud-3d">
              <div><span className="scene-kicker">AMR / {config.identity.robotName || 'unknown'}</span><strong>{DRIVE_TYPE_LABELS[config.identity.driveType] || config.identity.driveType} · 空间装配视图</strong><Text type="secondary">轮组、动力、电池与传感器按装配层级表达</Text></div>
              <div className="scene-hud-metrics"><span><b>{installed.filter(item => getVisualKind(item) === 'wheel').length}</b>轮组</span><span><b>{installed.filter(item => getVisualKind(item) === 'motor').length}</b>电机</span><span><b>{installed.filter(item => getVisualKind(item) === 'lidar').length}</b>雷达</span><span><b>{installed.filter(item => getVisualKind(item) === 'battery').length}</b>电池</span></div>
            </div>
            <div className="scene-toolbar-3d">
              <Space size={4} wrap>
                {(Object.keys(cameraPresets) as Array<keyof typeof cameraPresets>).map(view => <Button key={view} size="small" type={cameraView === view ? 'primary' : 'default'} onClick={() => setCameraView(view)}>{cameraPresets[view].label}</Button>)}
                {([['body', '半透整车'], ['transparent', '内部透视'], ['wheel', '轮组总成'], ['exploded', '工程爆炸']] as Array<[AssemblyViewMode, string]>).map(([mode, label]) => <Button key={mode} size="small" type={assemblyView === mode ? 'primary' : 'default'} onClick={() => { setAssemblyView(mode); setExplodeView(mode === 'exploded'); }}>{label}</Button>)}
                <Button size="small" type={explodeView ? 'primary' : 'default'} onClick={() => setExplodeView(value => !value)}>{explodeView ? '关闭未定位展开' : '展开未定位模块'}</Button>
                <Button size="small" icon={<ZoomOutOutlined />} aria-label="缩小 3D 视图" onClick={() => setZoomCommand(current => current - 1)} />
                <Button size="small" icon={<ZoomInOutlined />} aria-label="放大 3D 视图" onClick={() => setZoomCommand(current => current + 1)} />
              </Space>
              <Text type="secondary">WebGL 实时渲染 · 拖拽旋转 · 右键平移 · 滚轮缩放 · {explodeView ? '待定位停放位仅用于观察，不写回坐标' : '按模型真实位姿装配'}</Text>
            </div>
            <div className={`chassis-scene chassis-scene-3d chassis-scene-webgl assembly-view-${assemblyView}`}>
              <div className="workbench-corner-mark workbench-corner-mark-tl">ASSEMBLY / 03</div>
              <div className="workbench-corner-mark workbench-corner-mark-tr">WEBGL / THREE.JS</div>
              <div className="workbench-axis-readout"><span>X+ = 前</span><span>Y+ = 左</span><span>Z+ = 上</span><span>原点 = 车体中心地面</span></div>
              <EquipmentWebGLScene
                config={config}
                components={installed}
                selectedComponentId={selectedInstalledId}
                cameraView={cameraView}
                assemblyView={assemblyView}
                explodeUnresolved={explodeView}
                zoomCommand={zoomCommand}
                onSelectComponent={selectInstalled}
              />
              <div className="scene-dimension-readout"><b>L×W×H</b><span>{config.identity.chassisLength || 'unknown'} × {config.identity.chassisWidth || 'unknown'} × {config.identity.chassisHeight || 'unknown'}</span></div>
              <div className={`scene-component-frame-readout ${selectedInstalled ? 'has-selection' : ''}`}>
                {selectedInstalled ? <>
                  <b>LOCAL FRAME · {selectedInstalled.alias || selectedInstalled.name}</b>
                  <span>XYZ · {selectedInstalled.mountX ?? 'unknown'} / {selectedInstalled.mountY ?? 'unknown'} / {selectedInstalled.mountZ ?? 'unknown'}</span>
                  <span>RPY · {selectedInstalled.mountRoll ?? 'unknown'}° / {selectedInstalled.mountPitch ?? 'unknown'}° / {selectedInstalled.mountYaw ?? 'unknown'}°</span>
                  <small>局部 X 红 · Y 绿 · Z 蓝；舵轮箭头表示局部 +X 朝向</small>
                </> : <><b>LOCAL FRAME</b><span>点击部件，检查其源 XYZ / RPY 与局部轴</span></>}
              </div>
              <div className="scene-legend"><span><i className="legend-dot center" />半透明底盘外壳</span><span><i className="legend-dot equipment" />内部器件 · 配置 Shape / 位姿</span><span><i className="legend-dot pending" />黄色 = 待定位/重复位姿</span><span className="scene-note">外壳透明度仅影响显示，不修改模型数据</span></div>
            </div>
            <Row gutter={12} className="chassis-stats"><Col span={8}><Statistic title="长" value={config.identity.chassisLength || 'unknown'} suffix={config.identity.chassisLength ? '·' : ''} /></Col><Col span={8}><Statistic title="宽" value={config.identity.chassisWidth || 'unknown'} suffix={config.identity.chassisWidth ? '·' : ''} /></Col><Col span={8}><Statistic title="高" value={config.identity.chassisHeight || 'unknown'} suffix={config.identity.chassisHeight ? '·' : ''} /></Col></Row>
          </Card>
          <Card title={<Space><ApiOutlined />电气连接 · 从“能看见”到“能通信”</Space>} className="workshop-card wiring-card">
            <Row gutter={8} align="middle"><Col span={6}><Select placeholder="源模块" value={sourceComponentId} onChange={value => { setSourceComponentId(value); setSourceInterfaceUuid(undefined); setTargetComponentId(undefined); setTargetInterfaceUuid(undefined); }} options={config.components.map(component => ({ value: component.id, label: componentOptionLabel(component) }))} /></Col><Col span={6}><Select placeholder="源接口" value={sourceInterfaceUuid} onChange={value => { setSourceInterfaceUuid(value); setTargetComponentId(undefined); setTargetInterfaceUuid(undefined); }} options={ifaceOptions(sourceComponent)} /></Col><Col span={1}><LinkOutlined /></Col><Col span={6}><Select placeholder="目标模块" value={targetComponentId} onChange={value => { setTargetComponentId(value); setTargetInterfaceUuid(undefined); }} options={config.components.filter(component => component.id !== sourceComponentId && (!sourceInterfaceUuid || compatibleTargetComponentIds.has(component.id))).map(component => ({ value: component.id, label: componentOptionLabel(component) }))} /></Col><Col span={5}><Select placeholder="目标接口" value={targetInterfaceUuid} onChange={setTargetInterfaceUuid} options={ifaceOptions(targetComponent, Boolean(sourceInterfaceUuid))} /></Col></Row>
            {sourceInterfaceUuid && <Text type="secondary">目标接口已按类型和 DI/DO 方向过滤；总线参数一致性由审计阶段检查。</Text>}
            <Button type="primary" icon={<LinkOutlined />} onClick={connect} disabled={!sourceInterfaceUuid || !targetInterfaceUuid} className="connect-button">建立连接</Button>
            <div className="connection-summary">{config.components.flatMap(component => component.interfaces.flatMap(iface => (iface.linkedInterfaceUuid || []).map(target => ({ component, iface, target })))).length === 0 ? <Text type="secondary">当前没有已记录的接口连接。连接校验仍由领域层执行。</Text> : <Text type="success"><CheckCircleOutlined /> 已有接口连接记录，可在原“接口连线”高级视图中继续审计。</Text>}</div>
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card title={<Space><ExperimentOutlined />模块库 · {FUNCTION_GROUPS.find(group => group.key === groupKey)?.label}</Space>} className="workshop-card catalog-card">
            {catalog.length > 0 && <Alert banner type={schemaRegistrySource === 'static-snapshot' ? 'warning' : 'success'} showIcon message={schemaRegistrySource === 'static-snapshot' ? '当前使用项目生成的模块快照进行验证；线上 API 路由恢复后会自动优先使用 API。' : '当前使用在线模块注册表。'} />}
            {visibleCatalog.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={catalog.length === 0 ? <Space direction="vertical"><span>schemaRegistry 尚未加载，无法安全展示模块</span><Button size="small" icon={<ApiOutlined />} onClick={() => fetchSchemas()}>重新加载模块库</Button></Space> : '当前功能组没有可用模块'} /> : <List dataSource={visibleCatalog.slice(0, 30)} renderItem={item => <List.Item className={selectedCatalogId === item.id ? 'catalog-selected' : ''} onClick={() => setSelectedCatalogId(item.id)} actions={[<Button key="install" type={selectedCatalogId === item.id ? 'primary' : 'default'} size="small" icon={<PlusOutlined />} onClick={() => setSelectedCatalogId(item.id)}>选择</Button>]}> 
              <List.Item.Meta title={item.title || 'unknown'} description={<Space size={4}><Tag>{getCategoryLabel(item.category)}</Tag><Text type="secondary">{item.type || 'unknown'}</Text></Space>} />
            </List.Item>} />}
          </Card>

          <Card title={<Space><SettingOutlined />装备详情与安装位姿</Space>} className="workshop-card detail-card">
            {selectedCatalog ? <><Tag color="cyan">待装配</Tag><Title level={4}>{selectedCatalog.title}</Title><Text type="secondary">来源：{selectedCatalog.source}</Text><Select className="full-control" value={parentId} onChange={setParentId} options={config.components.map(component => ({ value: component.id, label: `挂载到：${componentOptionLabel(component)}` }))} /><div className="slot-picker"><Text type="secondary">先选装配意图，再确认坐标（仅为尺寸推导预览）</Text><div className="slot-grid">{POSITION_SLOTS.map(slot => <Button key={slot.key} size="small" onClick={() => applyPositionSlot(slot.key)}><span>{slot.icon}</span>{slot.label}</Button>)}</div></div><div className="pose-grid">{(['mountX', 'mountY', 'mountZ', 'mountRoll', 'mountPitch', 'mountYaw'] as const).map(key => <label key={key}><span>{key.replace('mount', '')}</span><InputNumber value={draftPose[key]} onChange={value => setDraftPose(pose => ({ ...pose, [key]: Number(value || 0) }))} /></label>)}</div><Button type="primary" block icon={<PlusOutlined />} onClick={installSelected}>装配到车辆</Button></> : selectedInstalled ? <><Tag color={positionState(selectedInstalled) === '已定位' ? 'success' : 'warning'}>{positionState(selectedInstalled)}</Tag><Title level={4}>{componentOptionLabel(selectedInstalled)}</Title><Text type="secondary">{getCategoryLabel(selectedInstalled.category)} · {selectedInstalled.type || 'unknown'}</Text><Select className="full-control" value={parentId} onChange={setParentId} options={config.components.map(component => ({ value: component.id, label: `挂载到：${componentOptionLabel(component)}` }))} /><div className="slot-picker"><Text type="secondary">调整装备意图（不会覆盖坐标，点击后请确认数值）</Text><div className="slot-grid">{POSITION_SLOTS.map(slot => <Button key={slot.key} size="small" onClick={() => applyPositionSlot(slot.key)}><span>{slot.icon}</span>{slot.label}</Button>)}</div></div><div className="pose-grid">{(['mountX', 'mountY', 'mountZ', 'mountRoll', 'mountPitch', 'mountYaw'] as const).map(key => <label key={key}><span>{key.replace('mount', '')}</span><InputNumber value={draftPose[key]} onChange={value => setDraftPose(pose => ({ ...pose, [key]: Number(value || 0) }))} /></label>)}</div><Button type="primary" block icon={<AimOutlined />} onClick={applyPose}>保存结构关系与位姿</Button><div className="detail-footnote"><Text type="secondary">接口 {selectedInstalled.interfaces.length} 个 · 已连接 {connectionCount(selectedInstalled)} 个</Text></div></> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="选择一个模块进行装配或定位" />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EquipmentWorkshopStep;
