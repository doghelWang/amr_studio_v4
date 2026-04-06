import React, { useState, useMemo } from 'react';
import { Form, InputNumber, Row, Col, Typography, Empty, Card, Badge, Space, Tooltip, Segmented } from 'antd';
import { AimOutlined, CompassOutlined, InboxOutlined, ZoomInOutlined, EyeOutlined, EyeInvisibleOutlined, BorderOuterOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { CoordinateVisualizer } from '../visualizer/CoordinateVisualizer';

const { Text, Title } = Typography;

// Axis configuration with themed colors
const AXIS_CONFIG = [
  { key: 'mountX', label: 'X', unit: 'mm', color: 'var(--red)', desc: '前后位置' },
  { key: 'mountY', label: 'Y', unit: 'mm', color: 'var(--green)', desc: '左右位置' },
  { key: 'mountZ', label: 'Z', unit: 'mm', color: 'var(--accent)', desc: '高度' },
  { key: 'mountRoll', label: 'Roll', unit: '°', color: 'var(--orange)', desc: '横滚角' },
  { key: 'mountPitch', label: 'Pitch', unit: '°', color: 'var(--purple)', desc: '俯仰角' },
  { key: 'mountYaw', label: 'Yaw', unit: '°', color: 'var(--accent-text)', desc: '偏航角' },
];

// Group axes by category
const POSITION_AXES = AXIS_CONFIG.slice(0, 3);
const ROTATION_AXES = AXIS_CONFIG.slice(3);

export const MountingStep: React.FC<{ onExport?: () => void }> = () => {
  const { config, updateComponent } = useProjectStore();
  const components = config.components;
  const [activeId, setActiveId] = useState<string | undefined>(components[0]?.id);
  const [viewMode, setViewMode] = useState<'split' | 'iso'>('split');
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);

  // Filter out chassis root, keep only mounted components
  const mountableComponents = useMemo(() =>
    components.filter(c => c.category !== 'CHASSIS' || c.id !== 'chassis-root'),
    [components]
  );

  // Auto-select first component if none selected
  React.useEffect(() => {
    if (!activeId && mountableComponents.length > 0) {
      setActiveId(mountableComponents[0]?.id);
    }
  }, [mountableComponents, activeId]);

  // Get active component
  const activeComponent = useMemo(() =>
    mountableComponents.find(c => c.id === activeId),
    [mountableComponents, activeId]
  );

  // Group components by category for organized list
  const groupedComponents = useMemo(() => {
    const groups: Record<string, typeof components> = {};
    mountableComponents.forEach(c => {
      const cat = c.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(c);
    });
    return groups;
  }, [mountableComponents]);

  // Category display names
  const categoryLabels: Record<string, string> = {
    SENSOR: '传感器',
    DRIVER: '驱动器',
    MOTOR: '电机',
    BATTERY: '电池',
    MAINCPU: '主控',
    DRIVEWHEEL: '驱动轮',
    DRIVE_WHEEL: '驱动轮',
    BUTTON: '按钮',
    SCREEN: '屏幕',
    Other: '其他',
  };

  // Category colors
  const categoryColors: Record<string, string> = {
    SENSOR: 'var(--red)',
    DRIVER: 'var(--orange)',
    MOTOR: 'var(--green)',
    BATTERY: 'var(--purple)',
    MAINCPU: 'var(--accent)',
    DRIVEWHEEL: 'var(--accent-text)',
    DRIVE_WHEEL: 'var(--accent-text)',
    BUTTON: 'var(--yellow)',
    SCREEN: 'var(--cyan)',
  };

  if (components.length === 0) {
    return (
      <div className="mounting-empty-state">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary" style={{ color: 'var(--text-muted)' }}>
              请先在 Step 3 "组件库" 中添加硬件模块
            </Text>
          }
        />
      </div>
    );
  }

  const inputNumberStyles = {
    width: '100%',
    background: 'var(--bg-hover)',
    borderColor: 'transparent',
    color: 'var(--text-primary)',
  };

  return (
    <div className="mounting-step-container">
      {/* Header */}
      <div className="mounting-header">
        <div className="mounting-title-group">
          <div className="section-icon mounting-icon">
            <AimOutlined />
          </div>
          <div>
            <Title level={5} className="mounting-title">物理安装配置</Title>
            <Text type="secondary" className="mounting-subtitle">
              设置组件在底盘坐标系中的 6-DOF 位姿 (单位: mm / °)
            </Text>
          </div>
        </div>
        <Segmented
          value={viewMode}
          onChange={(v) => setViewMode(v as 'split' | 'iso')}
          options={[
            { value: 'split', icon: <BorderOuterOutlined />, label: '多视图' },
            { value: 'iso', icon: <ZoomInOutlined />, label: '单视图' },
          ]}
          className="view-mode-toggle"
        />
      </div>

      {/* Main Content */}
      <div className="mounting-content">
        {/* Left: Visualizer */}
        <div className={`visualizer-panel ${viewMode}`}>
          <Card
            className="visualizer-card"
            bodyStyle={{ padding: 0, height: '100%' }}
          >
            <div className="visualizer-container">
              <CoordinateVisualizer
                activeId={activeId}
                onSelect={setActiveId}
                viewMode={viewMode}
              />
            </div>
            <div className="visualizer-overlay">
              {activeComponent && (
                <Badge
                  color={categoryColors[activeComponent.category] || 'var(--text-muted)'}
                  text={
                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                      {activeComponent.alias || activeComponent.name}
                    </span>
                  }
                />
              )}
            </div>
          </Card>
        </div>

        {/* Right: Component List + Coordinate Editor */}
        <div className="editor-panel">
          {/* Component List */}
          <Card
            title={
              <Space size="small">
                <CompassOutlined style={{ color: 'var(--accent)' }} />
                <span style={{ color: 'var(--text-primary)' }}>组件列表</span>
                <Badge
                  count={mountableComponents.length}
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
                />
              </Space>
            }
            className="component-list-card"
            bodyStyle={{ padding: 0 }}
          >
            <div className="component-list-scroll">
              {Object.entries(groupedComponents).map(([category, items]) => (
                <div key={category} className="component-group">
                  <div className="component-group-header">
                    <span
                      className="category-dot"
                      style={{ backgroundColor: categoryColors[category] || 'var(--text-muted)' }}
                    />
                    <Text type="secondary" className="category-label">
                      {categoryLabels[category] || category}
                    </Text>
                    <Badge count={items.length} className="category-count" />
                  </div>
                  {items.map(comp => (
                    <div
                      key={comp.id}
                      className={`component-item ${activeId === comp.id ? 'active' : ''}`}
                      onClick={() => setActiveId(comp.id)}
                    >
                      <div className="component-item-content">
                        <Text
                          strong
                          className="component-name"
                          style={{ color: activeId === comp.id ? 'var(--accent)' : 'var(--text-primary)' }}
                        >
                          {comp.alias || comp.name}
                        </Text>
                        <Text type="secondary" className="component-type">{comp.type}</Text>
                      </div>
                      {activeId === comp.id && (
                        <div className="active-indicator" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* Coordinate Editor */}
          <Card
            title={
              <Space size="small">
                <BorderOuterOutlined style={{ color: 'var(--accent)' }} />
                <span style={{ color: 'var(--text-primary)' }}>
                  {activeComponent ? (activeComponent.alias || activeComponent.name) : '请选择组件'}
                </span>
              </Space>
            }
            className="editor-card"
          >
            {activeComponent ? (
              <Form layout="vertical" size="small" className="coordinate-form">
                {/* Position Section */}
                <div className="axis-section">
                  <Text type="secondary" className="axis-section-title">
                    <span className="axis-section-icon" style={{ color: 'var(--red)' }}>⊕</span>
                    位置坐标 (线性偏移)
                  </Text>
                  <Row gutter={[12, 12]}>
                    {POSITION_AXES.map(axis => (
                      <Col span={8} key={axis.key}>
                        <Tooltip title={axis.desc} placement="top">
                          <div
                            className={`axis-input-group ${hoveredAxis === axis.key ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredAxis(axis.key)}
                            onMouseLeave={() => setHoveredAxis(null)}
                          >
                            <div className="axis-label" style={{ color: axis.color }}>
                              {axis.label}
                              <span className="axis-unit">({axis.unit})</span>
                            </div>
                            <InputNumber
                              value={(activeComponent as any)[axis.key] ?? 0}
                              onChange={v => updateComponent(activeComponent.id, { [axis.key]: v ?? 0 })}
                              style={inputNumberStyles}
                              bordered={false}
                              controls
                              size="small"
                            />
                          </div>
                        </Tooltip>
                      </Col>
                    ))}
                  </Row>
                </div>

                <div className="axis-divider" />

                {/* Rotation Section */}
                <div className="axis-section">
                  <Text type="secondary" className="axis-section-title">
                    <span className="axis-section-icon" style={{ color: 'var(--purple)' }}>↻</span>
                    旋转角度 (欧拉角)
                  </Text>
                  <Row gutter={[12, 12]}>
                    {ROTATION_AXES.map(axis => (
                      <Col span={8} key={axis.key}>
                        <Tooltip title={axis.desc} placement="top">
                          <div
                            className={`axis-input-group ${hoveredAxis === axis.key ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredAxis(axis.key)}
                            onMouseLeave={() => setHoveredAxis(null)}
                          >
                            <div className="axis-label" style={{ color: axis.color }}>
                              {axis.label}
                              <span className="axis-unit">({axis.unit})</span>
                            </div>
                            <InputNumber
                              value={(activeComponent as any)[axis.key] ?? 0}
                              onChange={v => updateComponent(activeComponent.id, { [axis.key]: v ?? 0 })}
                              style={inputNumberStyles}
                              bordered={false}
                              controls
                              size="small"
                            />
                          </div>
                        </Tooltip>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Quick actions */}
                <div className="editor-actions">
                  <Space size="small" wrap>
                    <Tooltip title="重置 Z 轴为 0">
                      <button
                        className="quick-action-btn"
                        onClick={() => updateComponent(activeComponent.id, { mountZ: 0 })}
                      >
                        置底
                      </button>
                    </Tooltip>
                    <Tooltip title="重置所有角度为 0">
                      <button
                        className="quick-action-btn"
                        onClick={() => updateComponent(activeComponent.id, {
                          mountRoll: 0, mountPitch: 0, mountYaw: 0
                        })}
                      >
                        归平
                      </button>
                    </Tooltip>
                    <Tooltip title="重置所有位置为 0">
                      <button
                        className="quick-action-btn"
                        onClick={() => updateComponent(activeComponent.id, {
                          mountX: 0, mountY: 0, mountZ: 0
                        })}
                      >
                        居中
                      </button>
                    </Tooltip>
                  </Space>
                </div>
              </Form>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<Text type="secondary">从左侧列表选择组件进行配置</Text>}
              />
            )}
          </Card>
        </div>
      </div>

      <style>{`
        .mounting-step-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .mounting-empty-state {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mounting-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px 16px;
          flex-shrink: 0;
        }

        .mounting-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mounting-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--accent-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          font-size: 20px;
        }

        .mounting-title {
          margin: 0 !important;
          color: var(--text-primary) !important;
          font-size: 18px !important;
        }

        .mounting-subtitle {
          font-size: 12px;
          color: var(--text-muted);
        }

        .view-mode-toggle {
          background: var(--bg-hover);
        }

        .view-mode-toggle .ant-segmented-item {
          color: var(--text-secondary);
        }

        .view-mode-toggle .ant-segmented-item-selected {
          color: var(--accent);
          background: var(--accent-soft);
        }

        .mounting-content {
          flex: 1;
          display: flex;
          gap: 20px;
          padding: 0 24px 24px;
          min-height: 0;
        }

        .visualizer-panel {
          flex: 1.5;
          min-width: 400px;
          display: flex;
          flex-direction: column;
        }

        .visualizer-panel.iso {
          flex: 2;
        }

        .visualizer-card {
          flex: 1;
          background: var(--bg-card);
          border-color: var(--border-default);
          position: relative;
          overflow: hidden;
        }

        .visualizer-container {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .visualizer-overlay {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: var(--bg-hover);
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-default);
          backdrop-filter: blur(4px);
        }

        .editor-panel {
          flex: 1;
          min-width: 320px;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .component-list-card {
          flex: 0 1 auto;
          max-height: 45%;
          background: var(--bg-card);
          border-color: var(--border-default);
          overflow: hidden;
        }

        .component-list-scroll {
          max-height: 280px;
          overflow-y: auto;
          padding: 8px 0;
        }

        .component-group {
          margin-bottom: 4px;
        }

        .component-group-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px 4px;
          font-size: 12px;
        }

        .category-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .category-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex: 1;
        }

        .category-count .ant-badge-count {
          background: var(--bg-hover);
          color: var(--text-muted);
          font-size: 10px;
          min-width: 16px;
          height: 16px;
          line-height: 16px;
        }

        .component-item {
          padding: 10px 16px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .component-item:hover {
          background: var(--bg-hover);
        }

        .component-item.active {
          background: var(--accent-soft);
        }

        .component-item-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .component-name {
          font-size: 13px;
          transition: color 0.2s;
        }

        .component-type {
          font-size: 11px;
          color: var(--text-muted);
        }

        .active-indicator {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }

        .editor-card {
          flex: 1;
          background: var(--bg-card);
          border-color: var(--border-default);
          min-height: 0;
        }

        .editor-card .ant-card-body {
          height: calc(100% - 57px);
          overflow-y: auto;
        }

        .coordinate-form {
          height: 100%;
        }

        .axis-section {
          margin-bottom: 16px;
        }

        .axis-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          margin-bottom: 12px;
          color: var(--text-secondary);
        }

        .axis-section-icon {
          font-size: 14px;
          font-weight: bold;
        }

        .axis-input-group {
          background: var(--bg-main);
          border-radius: 8px;
          padding: 8px 12px;
          border: 1px solid var(--border-default);
          transition: all 0.2s ease;
        }

        .axis-input-group:hover,
        .axis-input-group.hovered {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent-soft);
        }

        .axis-label {
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .axis-unit {
          font-size: 10px;
          opacity: 0.7;
          font-weight: normal;
        }

        .ant-input-number {
          background: transparent !important;
        }

        .ant-input-number-input {
          color: var(--text-primary) !important;
          font-size: 14px;
          font-weight: 500;
          text-align: right;
          padding: 0 !important;
        }

        .ant-input-number-handler {
          border-color: var(--border-default);
        }

        .ant-input-number-handler-up,
        .ant-input-number-handler-down {
          background: var(--bg-hover);
          border-color: var(--border-default);
          color: var(--text-secondary);
        }

        .ant-input-number-handler-up:hover,
        .ant-input-number-handler-down:hover {
          color: var(--accent);
        }

        .axis-divider {
          height: 1px;
          background: var(--border-default);
          margin: 16px 0;
        }

        .editor-actions {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-default);
        }

        .quick-action-btn {
          background: var(--bg-hover);
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-action-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-soft);
        }

        /* Scrollbar styling */
        .component-list-scroll::-webkit-scrollbar,
        .editor-card .ant-card-body::-webkit-scrollbar {
          width: 6px;
        }

        .component-list-scroll::-webkit-scrollbar-track,
        .editor-card .ant-card-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .component-list-scroll::-webkit-scrollbar-thumb,
        .editor-card .ant-card-body::-webkit-scrollbar-thumb {
          background: var(--border-default);
          border-radius: 3px;
        }

        .component-list-scroll::-webkit-scrollbar-thumb:hover,
        .editor-card .ant-card-body::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .mounting-content {
            flex-direction: column;
          }

          .editor-panel {
            max-width: none;
            flex-direction: row;
          }

          .component-list-card {
            flex: 0 0 280px;
            max-height: none;
          }

          .component-list-scroll {
            max-height: 320px;
          }

          .editor-card {
            flex: 1;
          }
        }

        @media (max-width: 768px) {
          .mounting-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .editor-panel {
            flex-direction: column;
          }

          .component-list-card {
            flex: 0 1 auto;
            max-height: 200px;
          }
        }
      `}</style>
    </div>
  );
};
