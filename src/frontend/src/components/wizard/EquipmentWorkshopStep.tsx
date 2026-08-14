import React, { useMemo, useState } from 'react';
import {
  Alert, Badge, Button, Card, Col, Empty, InputNumber, List, Progress, Row,
  Select, Space, Statistic, Tag, Tooltip, Typography, message,
} from 'antd';
import {
  AimOutlined, ApiOutlined, AudioOutlined, CheckCircleOutlined,
  CompassOutlined, ControlOutlined, DeploymentUnitOutlined, DisconnectOutlined,
  EnvironmentOutlined, ExperimentOutlined, LinkOutlined, PlusOutlined,
  RobotOutlined, SafetyCertificateOutlined, SettingOutlined, ThunderboltOutlined,
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { ImportService } from '../../store/ImportService';
import type { ComponentConfig } from '../../store/types';

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
  const hasExplicitCoordinates = Array.isArray(rawExtend) && rawExtend.some((param: any) => coordinateKeys.has(param.key));
  return hasExplicitCoordinates || values.some(value => value !== undefined && value !== null && Number(value) !== 0) ? '已定位' : '待定位';
};

const connectionCount = (component: ComponentConfig) => component.interfaces.reduce((total, iface) => total + (iface.linkedInterfaceUuid || []).length, 0);

export const EquipmentWorkshopStep: React.FC<{ onExport?: () => void }> = () => {
  const {
    config, schemaRegistry, activeComponentId, setActiveComponent, addComponentFromConfig,
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

  const chassis = config.components.find(component => component.category === 'CHASSIS');
  const installed = config.components.filter(component => component.category !== 'CHASSIS');

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
  const chassisReady = Boolean(chassis && config.identity.robotName && config.identity.chassisLength && config.identity.chassisWidth);
  const positionReady = installed.length > 0 && installed.every(component => positionState(component) === '已定位');
  const connectionReady = installed.length > 0 && installed.every(component => component.interfaces.length === 0 || connectionCount(component) > 0);
  const progress = Math.round(([chassisReady, installed.length > 0, positionReady, connectionReady].filter(Boolean).length / 4) * 100);
  const currentPhase = PHASES.find(phase => phase.key === phaseKey) || PHASES[1];
  const phaseBrief: Record<string, string> = {
    prepare: '先确认机型身份、底盘尺寸和器件资料；没有来源的模块不会被工坊虚构出来。',
    structure: '把模块装到车体层级中，再为每个模块确认父节点和 6-DOF 安装位姿。',
    electrical: '结构完成只代表“装上了”；选择真实接口并建立通信、电源或 IO 连接。',
    function: '把已连接的硬件映射到定位、避障、运动、交互等软件能力。',
    validate: '检查模型完整性、层级、坐标、连接和在线调试条件，再进入导出。',
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

  const ifaceOptions = (component?: ComponentConfig) => (component?.interfaces || []).map(iface => ({ value: iface.interfaceUuid, label: `${iface.label || iface.key || '接口'} · ${iface.type || 'unknown'}` }));

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

      <Alert className="wiki-gate" type="info" showIcon message={`当前任务：${currentPhase.label} · ${currentPhase.desc}`} description={phaseBrief[currentPhase.key]} />

      <Row gutter={[16, 16]} className="workshop-grid">
        <Col xs={24} lg={5}>
          <Card title="功能装备栏" extra={<Badge count={installed.length} showZero />} className="workshop-card function-card">
            {FUNCTION_GROUPS.map(group => <button key={group.key} className={`function-item ${group.key === groupKey ? 'selected' : ''}`} onClick={() => setGroupKey(group.key)}>
              <span className="function-icon">{group.icon}</span><span><strong>{group.label}</strong><small>{group.hint}</small></span><span className="function-count">{installed.filter(item => group.categories.includes(item.category as never)).length}</span>
            </button>)}
          </Card>
          <Card title="装配清单" className="workshop-card installed-card">
            {installed.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有装备，先从左侧选择模块" /> : <List size="small" dataSource={installed} renderItem={component => <List.Item className={selectedInstalledId === component.id ? 'list-selected' : ''} onClick={() => selectInstalled(component)}>
              <List.Item.Meta avatar={<span className="status-dot" data-state={positionState(component) === '已定位' ? 'ok' : 'warn'} />} title={component.alias || component.name} description={`${getCategoryLabel(component.category)} · ${positionState(component)}`} />
              <Tag>{connectionCount(component)}/{component.interfaces.length}</Tag>
            </List.Item>} />}
          </Card>
        </Col>

        <Col xs={24} lg={11}>
          <Card className="workshop-card chassis-card" title={<Space><RobotOutlined />底盘中心 · Robot Body</Space>} extra={<Tag color={chassisReady ? 'success' : 'warning'}>{chassisReady ? '基础资料就绪' : '待填写身份/尺寸'}</Tag>}>
            <div className="chassis-scene">
              <div className="scene-axis axis-x" /><div className="scene-axis axis-y" />
              <div className="chassis-body" style={{ aspectRatio: `${Math.max(config.identity.chassisLength, 1)} / ${Math.max(config.identity.chassisWidth, 1)}` }}><span className="motion-center"><AimOutlined /><small>运动中心</small></span>
                {installed.map(component => {
                  const x = 50 + (Number(component.mountY || 0) / Math.max(config.identity.chassisWidth, 1)) * 46;
                  const y = 50 - (Number(component.mountX || 0) / Math.max(config.identity.chassisLength, 1)) * 46;
                  return <Tooltip key={component.id} title={`${component.alias || component.name} · ${positionState(component)}`}><button className={`equipment-marker ${selectedInstalledId === component.id ? 'selected' : ''}`} style={{ left: `${Math.max(6, Math.min(94, x))}%`, top: `${Math.max(6, Math.min(94, y))}%` }} onClick={() => selectInstalled(component)}>{component.category === 'BATTERY' ? <ThunderboltOutlined /> : component.category === 'SENSOR' ? <EnvironmentOutlined /> : <SettingOutlined />}<small>{component.alias || component.name}</small></button></Tooltip>;
                })}
              </div>
              <div className="scene-legend"><span><i className="legend-dot center" />运动中心 / 坐标原点</span><span><i className="legend-dot equipment" />已装配装备</span><span><i className="legend-dot pending" />待定位装备</span></div>
            </div>
            <Row gutter={12} className="chassis-stats"><Col span={8}><Statistic title="长" value={config.identity.chassisLength || 'unknown'} suffix={config.identity.chassisLength ? '·' : ''} /></Col><Col span={8}><Statistic title="宽" value={config.identity.chassisWidth || 'unknown'} suffix={config.identity.chassisWidth ? '·' : ''} /></Col><Col span={8}><Statistic title="高" value={config.identity.chassisHeight || 'unknown'} suffix={config.identity.chassisHeight ? '·' : ''} /></Col></Row>
          </Card>
          <Card title={<Space><ApiOutlined />电气连接 · 从“能看见”到“能通信”</Space>} className="workshop-card wiring-card">
            <Row gutter={8} align="middle"><Col span={6}><Select placeholder="源模块" value={sourceComponentId} onChange={value => { setSourceComponentId(value); setSourceInterfaceUuid(undefined); }} options={config.components.map(component => ({ value: component.id, label: component.alias || component.name }))} /></Col><Col span={6}><Select placeholder="源接口" value={sourceInterfaceUuid} onChange={setSourceInterfaceUuid} options={ifaceOptions(sourceComponent)} /></Col><Col span={1}><LinkOutlined /></Col><Col span={6}><Select placeholder="目标模块" value={targetComponentId} onChange={value => { setTargetComponentId(value); setTargetInterfaceUuid(undefined); }} options={config.components.filter(component => component.id !== sourceComponentId).map(component => ({ value: component.id, label: component.alias || component.name }))} /></Col><Col span={5}><Select placeholder="目标接口" value={targetInterfaceUuid} onChange={setTargetInterfaceUuid} options={ifaceOptions(targetComponent)} /></Col></Row>
            <Button type="primary" icon={<LinkOutlined />} onClick={connect} disabled={!sourceInterfaceUuid || !targetInterfaceUuid} className="connect-button">建立连接</Button>
            <div className="connection-summary">{config.components.flatMap(component => component.interfaces.flatMap(iface => (iface.linkedInterfaceUuid || []).map(target => ({ component, iface, target })))).length === 0 ? <Text type="secondary">当前没有已记录的接口连接。连接校验仍由领域层执行。</Text> : <Text type="success"><CheckCircleOutlined /> 已有接口连接记录，可在原“接口连线”高级视图中继续审计。</Text>}</div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<Space><ExperimentOutlined />模块库 · {FUNCTION_GROUPS.find(group => group.key === groupKey)?.label}</Space>} className="workshop-card catalog-card">
            {visibleCatalog.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={catalog.length === 0 ? <Space direction="vertical"><span>schemaRegistry 尚未加载，无法安全展示模块</span><Button size="small" icon={<ApiOutlined />} onClick={() => fetchSchemas()}>重新加载模块库</Button></Space> : '当前功能组没有可用模块'} /> : <List dataSource={visibleCatalog.slice(0, 30)} renderItem={item => <List.Item className={selectedCatalogId === item.id ? 'catalog-selected' : ''} onClick={() => setSelectedCatalogId(item.id)} actions={[<Button key="install" type={selectedCatalogId === item.id ? 'primary' : 'default'} size="small" icon={<PlusOutlined />} onClick={() => setSelectedCatalogId(item.id)}>选择</Button>]}> 
              <List.Item.Meta title={item.title || 'unknown'} description={<Space size={4}><Tag>{getCategoryLabel(item.category)}</Tag><Text type="secondary">{item.type || 'unknown'}</Text></Space>} />
            </List.Item>} />}
          </Card>

          <Card title={<Space><SettingOutlined />装备详情与安装位姿</Space>} className="workshop-card detail-card">
            {selectedCatalog ? <><Tag color="cyan">待装配</Tag><Title level={4}>{selectedCatalog.title}</Title><Text type="secondary">来源：{selectedCatalog.source}</Text><Select className="full-control" value={parentId} onChange={setParentId} options={config.components.map(component => ({ value: component.id, label: `挂载到：${component.alias || component.name}` }))} /><div className="slot-picker"><Text type="secondary">先选装配意图，再确认坐标（仅为尺寸推导预览）</Text><div className="slot-grid">{POSITION_SLOTS.map(slot => <Button key={slot.key} size="small" onClick={() => applyPositionSlot(slot.key)}><span>{slot.icon}</span>{slot.label}</Button>)}</div></div><div className="pose-grid">{(['mountX', 'mountY', 'mountZ', 'mountRoll', 'mountPitch', 'mountYaw'] as const).map(key => <label key={key}><span>{key.replace('mount', '')}</span><InputNumber value={draftPose[key]} onChange={value => setDraftPose(pose => ({ ...pose, [key]: Number(value || 0) }))} /></label>)}</div><Button type="primary" block icon={<PlusOutlined />} onClick={installSelected}>装配到车辆</Button></> : selectedInstalled ? <><Tag color={positionState(selectedInstalled) === '已定位' ? 'success' : 'warning'}>{positionState(selectedInstalled)}</Tag><Title level={4}>{selectedInstalled.alias || selectedInstalled.name}</Title><Text type="secondary">{getCategoryLabel(selectedInstalled.category)} · {selectedInstalled.type || 'unknown'}</Text><Select className="full-control" value={parentId} onChange={setParentId} options={config.components.map(component => ({ value: component.id, label: `挂载到：${component.alias || component.name}` }))} /><div className="slot-picker"><Text type="secondary">调整装备意图（不会覆盖坐标，点击后请确认数值）</Text><div className="slot-grid">{POSITION_SLOTS.map(slot => <Button key={slot.key} size="small" onClick={() => applyPositionSlot(slot.key)}><span>{slot.icon}</span>{slot.label}</Button>)}</div></div><div className="pose-grid">{(['mountX', 'mountY', 'mountZ', 'mountRoll', 'mountPitch', 'mountYaw'] as const).map(key => <label key={key}><span>{key.replace('mount', '')}</span><InputNumber value={draftPose[key]} onChange={value => setDraftPose(pose => ({ ...pose, [key]: Number(value || 0) }))} /></label>)}</div><Button type="primary" block icon={<AimOutlined />} onClick={applyPose}>保存结构关系与位姿</Button><div className="detail-footnote"><Text type="secondary">接口 {selectedInstalled.interfaces.length} 个 · 已连接 {connectionCount(selectedInstalled)} 个</Text></div></> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="选择一个模块进行装配或定位" />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EquipmentWorkshopStep;
