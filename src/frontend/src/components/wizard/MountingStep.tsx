import React, { useMemo, useState } from 'react';
import { Card, Col, Empty, InputNumber, Row, Segmented, Space, Tag, Tooltip, Typography } from 'antd';
import { AimOutlined, BorderOuterOutlined, EyeOutlined, RadarChartOutlined, SettingOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import type { ComponentConfig } from '../../store/types';

const { Text, Title } = Typography;

type SceneFilter = 'ALL' | 'WHEELS' | 'LASERS' | 'CAMERAS' | 'BUTTONS';

const CATEGORY_META: Record<string, { label: string; color: string; shape: 'wheel' | 'sensor' | 'control' | 'body' }> = {
  DRIVEWHEEL: { label: '驱动轮', color: '#4ea6ff', shape: 'wheel' },
  SENSOR: { label: '传感器', color: '#ff8a5b', shape: 'sensor' },
  VISUAL: { label: '视觉', color: '#7d9cff', shape: 'sensor' },
  BUTTON: { label: '按钮', color: '#ffd166', shape: 'control' },
  SCREEN: { label: '屏幕', color: '#a77bff', shape: 'control' },
  MAINCPU: { label: '主控', color: '#6ed6a9', shape: 'control' },
  DRIVER: { label: '驱动器', color: '#5de0c4', shape: 'control' },
  MOTOR: { label: '电机', color: '#9cb4ff', shape: 'control' },
};

const getComponentSignature = (component: ComponentConfig) =>
  [
    component.name,
    component.alias,
    component.srcName,
    component.type,
    component.subModuleTypeKey,
    component.mainModuleTypeKey,
    component.category,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const isLaser = (component: ComponentConfig) => {
  const signature = getComponentSignature(component);
  return (
    component.category === 'SENSOR' ||
    component.category === 'VISUAL'
  ) && (
    signature.includes('laser') ||
    signature.includes('lidar') ||
    signature.includes('ls-') ||
    signature.includes('激光')
  );
};

const isCamera = (component: ComponentConfig) => {
  const signature = getComponentSignature(component);
  return (
    component.category === 'SENSOR' ||
    component.category === 'VISUAL'
  ) && (
    signature.includes('camera') ||
    signature.includes('cam') ||
    signature.includes('视觉') ||
    signature.includes('vision')
  );
};

const isButton = (component: ComponentConfig) => {
  const signature = getComponentSignature(component);
  return component.category === 'BUTTON' || signature.includes('button') || signature.includes('按钮');
};

const filterComponent = (component: ComponentConfig, filter: SceneFilter) => {
  if (filter === 'ALL') return true;
  if (filter === 'WHEELS') return component.category === 'DRIVEWHEEL';
  if (filter === 'LASERS') return isLaser(component);
  if (filter === 'CAMERAS') return isCamera(component);
  if (filter === 'BUTTONS') return isButton(component);
  return true;
};

const toScenePosition = (component: ComponentConfig, length: number, width: number) => {
  const safeLength = Math.max(length, 1);
  const safeWidth = Math.max(width, 1);
  const x = 50 + (component.mountY / safeWidth) * 58;
  const y = 50 - (component.mountX / safeLength) * 58;
  return {
    left: `${Math.max(8, Math.min(92, x))}%`,
    top: `${Math.max(8, Math.min(92, y))}%`,
  };
};

const hasMeaningfulPose = (component: ComponentConfig) =>
  Math.abs(component.mountX) > 1 ||
  Math.abs(component.mountY) > 1 ||
  Math.abs(component.mountZ) > 1 ||
  Math.abs(component.mountYaw) > 1;

const fallbackOrbitPosition = (component: ComponentConfig, index: number) => {
  const wheelPreset = [
    { left: '26%', top: '72%' },
    { left: '74%', top: '72%' },
    { left: '26%', top: '28%' },
    { left: '74%', top: '28%' },
  ];
  const laserPreset = [
    { left: '50%', top: '18%' },
    { left: '18%', top: '50%' },
    { left: '82%', top: '50%' },
    { left: '50%', top: '82%' },
  ];
  const cameraPreset = [
    { left: '35%', top: '18%' },
    { left: '65%', top: '18%' },
    { left: '50%', top: '12%' },
  ];
  const buttonPreset = [
    { left: '82%', top: '24%' },
    { left: '18%', top: '24%' },
  ];
  const genericPreset = [
    { left: '50%', top: '50%' },
    { left: '38%', top: '56%' },
    { left: '62%', top: '56%' },
    { left: '50%', top: '66%' },
  ];

  const preset = component.category === 'DRIVEWHEEL'
    ? wheelPreset
    : isLaser(component)
      ? laserPreset
      : isCamera(component)
        ? cameraPreset
        : isButton(component)
          ? buttonPreset
          : genericPreset;

  return preset[index % preset.length];
};

const getRenderPosition = (
  component: ComponentConfig,
  length: number,
  width: number,
  zeroPoseIndex: number
) => {
  if (hasMeaningfulPose(component)) {
    return toScenePosition(component, length, width);
  }
  return fallbackOrbitPosition(component, zeroPoseIndex);
};

const polarPoint = (cx: number, cy: number, radius: number, angleDeg: number) => {
  const angle = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
};

const sectorPath = (cx: number, cy: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const outerStart = polarPoint(cx, cy, outerRadius, startAngle);
  const outerEnd = polarPoint(cx, cy, outerRadius, endAngle);
  const innerEnd = polarPoint(cx, cy, innerRadius, endAngle);
  const innerStart = polarPoint(cx, cy, innerRadius, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z'
  ].join(' ');
};

const LaserCoverageMap: React.FC<{
  chassisLength: number;
  chassisWidth: number;
  lasers: ComponentConfig[];
  activeId?: string;
  onSelect: (id: string) => void;
}> = ({ chassisLength, chassisWidth, lasers, activeId, onSelect }) => {
  const safeLength = Math.max(chassisLength, 1);
  const safeWidth = Math.max(chassisWidth, 1);
  const viewBox = 320;
  const scale = 0.18;
  const chassisBox = {
    width: safeWidth * scale,
    height: safeLength * scale,
  };
  const chassisX = (viewBox - chassisBox.width) / 2;
  const chassisY = (viewBox - chassisBox.height) / 2;

  return (
    <svg viewBox={`0 0 ${viewBox} ${viewBox}`} style={{ width: '100%', height: 320 }}>
      <defs>
        <filter id="laserGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x={chassisX} y={chassisY} width={chassisBox.width} height={chassisBox.height} rx="22" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.28)" />

      {lasers.map((laser, index) => {
        const fallback = fallbackOrbitPosition(laser, index);
        const fallbackCx = (Number.parseFloat(fallback.left) / 100) * viewBox;
        const fallbackCy = (Number.parseFloat(fallback.top) / 100) * viewBox;
        const cx = hasMeaningfulPose(laser) ? viewBox / 2 + (laser.mountY * scale) : fallbackCx;
        const cy = hasMeaningfulPose(laser) ? viewBox / 2 - (laser.mountX * scale) : fallbackCy;
        const yaw = Number(laser.mountYaw || 0);
        const start = yaw - 55;
        const end = yaw + 55;
        const warn = sectorPath(cx, cy, 12, 96, start, end);
        const stop = sectorPath(cx, cy, 6, 54, start, end);
        const isActive = laser.id === activeId;

        return (
          <g key={laser.id} onClick={() => onSelect(laser.id)} style={{ cursor: 'pointer' }}>
            <path d={warn} fill="rgba(255, 164, 86, 0.14)" stroke="rgba(255, 164, 86, 0.34)" />
            <path d={stop} fill="rgba(255, 86, 86, 0.16)" stroke="rgba(255, 86, 86, 0.38)" filter="url(#laserGlow)" />
            <circle cx={cx} cy={cy} r={isActive ? 8 : 6} fill={isActive ? '#ffd166' : '#ff8a5b'} stroke="#fff" strokeWidth="2" />
            <text x={cx + 10} y={cy - 10} fill="var(--text-secondary)" fontSize="10">{laser.alias || laser.name}</text>
          </g>
        );
      })}

      <text x={viewBox / 2} y={chassisY - 14} textAnchor="middle" fill="var(--text-muted)" fontSize="11">
        车头 / FRONT
      </text>
    </svg>
  );
};

export const MountingStep: React.FC<{ onExport?: () => void }> = () => {
  const { config, updateComponent } = useProjectStore();
  const chassis = config.components.find(component => component.category === 'CHASSIS');
  const mountableComponents = useMemo(() => config.components.filter(component => component.category !== 'CHASSIS'), [config.components]);
  const [activeId, setActiveId] = useState<string | undefined>(mountableComponents[0]?.id);
  const [sceneFilter, setSceneFilter] = useState<SceneFilter>('ALL');

  const activeComponent = useMemo(
    () => mountableComponents.find(component => component.id === activeId),
    [mountableComponents, activeId]
  );

  const visibleComponents = useMemo(
    () => mountableComponents.filter(component => filterComponent(component, sceneFilter)),
    [mountableComponents, sceneFilter]
  );

  const lasers = useMemo(() => mountableComponents.filter(isLaser), [mountableComponents]);
  const zeroPoseIndexMap = useMemo(() => {
    const counts = new Map<string, number>();
    const indexMap = new Map<string, number>();
    mountableComponents.forEach(component => {
      if (hasMeaningfulPose(component)) return;
      const bucket = component.category === 'DRIVEWHEEL'
        ? 'wheel'
        : isLaser(component)
          ? 'laser'
          : isCamera(component)
            ? 'camera'
            : isButton(component)
              ? 'button'
              : 'generic';
      const nextIndex = counts.get(bucket) || 0;
      indexMap.set(component.id, nextIndex);
      counts.set(bucket, nextIndex + 1);
    });
    return indexMap;
  }, [mountableComponents]);

  const chassisLength = config.identity.chassisLength || chassis?.shape?.length || 1200;
  const chassisWidth = config.identity.chassisWidth || chassis?.shape?.width || 800;

  if (!mountableComponents.length) {
    return (
      <div style={{ minHeight: 520, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty description="请先在步骤 2-3 或步骤 3 中添加硬件组件" />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 8px 12px' }}>
      <div className="section-header" style={{ marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <AimOutlined />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, fontSize: 20, fontFamily: 'var(--font-display)' }}>
              4. 安装布局与保护区域
            </Title>
            <Text type="secondary">
              左侧是整机 3D 风格布置，右侧是激光保护区与精确坐标编辑。重点关注轮组、相机、激光和按钮。
            </Text>
          </div>
        </div>
        <Segmented
          value={sceneFilter}
          onChange={value => setSceneFilter(value as SceneFilter)}
          options={[
            { label: '全部', value: 'ALL' },
            { label: '轮组', value: 'WHEELS' },
            { label: '激光', value: 'LASERS' },
            { label: '相机', value: 'CAMERAS' },
            { label: '按钮', value: 'BUTTONS' },
          ]}
        />
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={15}>
          <Card bodyStyle={{ padding: 18 }} style={{ minHeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Space>
                <EyeOutlined style={{ color: 'var(--accent)' }} />
                <Text strong>AMR 机体场景</Text>
              </Space>
              <Tag color="blue">{visibleComponents.length} 个可视组件</Tag>
            </div>

            <div
              style={{
                position: 'relative',
                minHeight: 520,
                borderRadius: 24,
                overflow: 'hidden',
                background:
                  'radial-gradient(circle at top, rgba(132,212,255,0.1), transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent), rgba(0,0,0,0.12)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '6% 4% 12%',
                  transformStyle: 'preserve-3d',
                  perspective: '1200px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '12% 10%',
                    transform: 'rotateX(64deg) rotateZ(-42deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: `${Math.max(220, chassisLength * 0.18)}px`,
                      height: `${Math.max(150, chassisWidth * 0.18)}px`,
                      transform: 'translate(-50%, -50%) translateZ(0px)',
                      borderRadius: 28,
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04)), var(--bg-card-strong)',
                      border: '1px solid var(--border-strong)',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.28)',
                    }}
                  />

                  {visibleComponents.map((component) => {
                    const meta = CATEGORY_META[component.category] || CATEGORY_META.SENSOR;
                    const position = getRenderPosition(
                      component,
                      chassisLength,
                      chassisWidth,
                      zeroPoseIndexMap.get(component.id) || 0
                    );
                    const isActive = component.id === activeId;
                    const isWheelComponent = meta.shape === 'wheel';
                    const size = isWheelComponent ? 28 : isLaser(component) ? 18 : isCamera(component) ? 16 : 14;

                    return (
                      <Tooltip key={component.id} title={`${meta.label} · ${component.alias || component.name}`}>
                        <div
                          onClick={() => setActiveId(component.id)}
                          style={{
                            position: 'absolute',
                            ...position,
                            width: size,
                            height: size,
                            borderRadius: isWheelComponent ? '999px' : isButton(component) ? 12 : 8,
                            background: meta.color,
                            border: isActive ? '3px solid #fff' : '2px solid rgba(255,255,255,0.45)',
                            boxShadow: isActive ? `0 0 0 8px ${meta.color}22` : `0 12px 18px ${meta.color}33`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: isActive ? 5 : 3,
                            cursor: 'pointer',
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              </div>

              <div style={{ position: 'absolute', left: 20, bottom: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                  <Tag key={key} style={{ margin: 0, background: `${meta.color}18`, border: `1px solid ${meta.color}44`, color: 'var(--text-secondary)' }}>
                    {meta.label}
                  </Tag>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={9}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <Card bodyStyle={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Space>
                  <RadarChartOutlined style={{ color: 'var(--warning)' }} />
                  <Text strong>激光保护区域</Text>
                </Space>
                <Tag color="orange">{lasers.length} 个激光</Tag>
              </div>
              {lasers.length ? (
                <LaserCoverageMap
                  chassisLength={chassisLength}
                  chassisWidth={chassisWidth}
                  lasers={lasers}
                  activeId={activeId}
                  onSelect={setActiveId}
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前没有可显示的激光组件" />
              )}
              <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>浅橙区: 警戒 / 减速区域</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>深红区: 紧急 / 停车区域</Text>
              </div>
            </Card>

            <Card bodyStyle={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Space>
                  <SettingOutlined style={{ color: 'var(--accent)' }} />
                  <Text strong>{activeComponent ? (activeComponent.alias || activeComponent.name) : '选择组件'}</Text>
                </Space>
                {activeComponent && (
                  <Tag color="blue">{CATEGORY_META[activeComponent.category]?.label || activeComponent.category}</Tag>
                )}
              </div>

              {activeComponent ? (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>位置 (mm)</Text>
                    <Row gutter={[10, 10]}>
                      {[
                        ['mountX', 'X'],
                        ['mountY', 'Y'],
                        ['mountZ', 'Z'],
                      ].map(([field, label]) => (
                        <Col span={8} key={field}>
                          <div style={{ padding: 10, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                            <InputNumber
                              size="small"
                              value={(activeComponent as any)[field] ?? 0}
                              onChange={value => updateComponent(activeComponent.id, { [field]: value ?? 0 })}
                              style={{ width: '100%' }}
                              controls
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>姿态 (deg)</Text>
                    <Row gutter={[10, 10]}>
                      {[
                        ['mountRoll', 'Roll'],
                        ['mountPitch', 'Pitch'],
                        ['mountYaw', 'Yaw'],
                      ].map(([field, label]) => (
                        <Col span={8} key={field}>
                          <div style={{ padding: 10, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                            <InputNumber
                              size="small"
                              value={(activeComponent as any)[field] ?? 0}
                              onChange={value => updateComponent(activeComponent.id, { [field]: value ?? 0 })}
                              style={{ width: '100%' }}
                              controls
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {mountableComponents.map(component => (
                      <button
                        key={component.id}
                        onClick={() => setActiveId(component.id)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 12,
                          border: component.id === activeId ? '1px solid var(--border-accent)' : '1px solid var(--border-default)',
                          background: component.id === activeId ? 'var(--accent-soft)' : 'var(--bg-card)',
                          color: component.id === activeId ? 'var(--text-bright)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        {component.alias || component.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <Empty description="从 3D 场景或下面的快捷列表中选择组件" />
              )}
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default MountingStep;
