import React, { useState, useMemo } from 'react';
import { 
    Layout, Typography, Button, Space, Modal, Card, 
    Empty, Form, Input, InputNumber, Select, 
    Row, Col, Tag, Divider, Steps, List, Tabs
} from 'antd';
import { 
    PlusOutlined, DeleteOutlined, InfoCircleOutlined,
    ArrowLeftOutlined, ArrowRightOutlined,
    ControlOutlined, SettingOutlined, CompassOutlined,
    ThunderboltOutlined, DesktopOutlined, AppstoreOutlined,
    ApiOutlined, EnvironmentOutlined, BoxPlotOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentConfig, MainModuleType, InterfaceConfig } from '../../store/types';
import { SmartFormGrouped } from '../common/SmartForm';
import masterRegistry from '../../store/master_registry.json';

// HMR Trigger: Guided component workflow v1.2

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// ━━━ Guided Steps Definition ━━━
const COMPONENT_STEPS = [
    { 
        title: '控制系统', 
        icon: <ControlOutlined />, 
        categories: ['MAINCPU', 'INTERGRATEDCONTROLLER', 'COMMUNICATION', 'EXTENDEDLNTERFACE'], 
        desc: '配置主控、扩展IO及通讯网关' 
    },
    { 
        title: '底盘轮组', 
        icon: <SettingOutlined />, 
        categories: ['CHASSIS', 'DRIVEWHEEL', 'DRIVER'], 
        desc: '定义底盘本体、动力驱动与轮组' 
    },
    { 
        title: '传感器系统', 
        icon: <CompassOutlined />, 
        categories: ['SENSOR', 'SENSORPROCESSOR'], 
        desc: '添加激光雷达、视觉及避障传感器' 
    },
    { 
        title: '能源系统', 
        icon: <ThunderboltOutlined />, 
        categories: ['BATTERY', 'ENERGYCONTROLLER'], 
        desc: '管理电池包与电源分配单元' 
    },
    { 
        title: '交互模块', 
        icon: <DesktopOutlined />, 
        categories: ['BUTTON', 'SCREEN', 'LIGHT', 'AUDIO'], 
        desc: '配置声光提示、显示屏与人机按钮' 
    },
    { 
        title: '其他', 
        icon: <AppstoreOutlined />, 
        categories: ['ACTOR', 'AUTOBODY'], 
        desc: '添加执行机构、覆盖件等辅助组件' 
    }
];

const CATEGORY_NAMES: Record<string, string> = {
    MAINCPU: '主控制器',
    INTERGRATEDCONTROLLER: '综合控制器',
    COMMUNICATION: '通讯模块',
    EXTENDEDLNTERFACE: '扩展接口',
    CHASSIS: '底盘',
    DRIVEWHEEL: '驱动轮',
    DRIVER: '驱动器',
    SENSOR: '传感器',
    SENSORPROCESSOR: '传感器处理器',
    BATTERY: '电池',
    ENERGYCONTROLLER: '电源控制器',
    BUTTON: '按钮',
    SCREEN: '显示屏',
    LIGHT: '灯带',
    AUDIO: '音频',
    ACTOR: '执行器',
    AUTOBODY: '车身件'
};

export const ComponentLibraryStep: React.FC = () => {
    const { 
        config, activeComponentId, 
        addComponent, removeComponent, 
        setActiveComponent, updateAttribute,
        updateStructuralParam, updateShape,
        updateComponent
    } = useProjectStore();

    const [currentStep, setCurrentStep] = useState(0);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [activeCat, setActiveCat] = useState<MainModuleType | null>(null);
    const [newCompType, setNewCompType] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const components = config.components;
    const selected = activeComponentId ? components.find(c => c.id === activeComponentId) : null;

    // Categories available in current step
    const stepCategories = COMPONENT_STEPS[currentStep].categories;

    // Filter components belonging to current step
    const stepComponents = useMemo(() => {
        return components.filter(c => 
            COMPONENT_STEPS[currentStep].categories.includes(c.category)
        );
    }, [components, currentStep]);

    const availableTypes = useMemo(() => {
        if (!activeCat) return [];
        const catData = (masterRegistry as any)[activeCat] || {};
        const types = Object.keys(catData).map(typeKey => ({
            key: typeKey,
            desc: catData[typeKey].desc || typeKey,
            manufacturer: catData[typeKey].manufacturer || 'SEER',
            category: activeCat
        }));

        if (!searchQuery) return types;
        const lowerQuery = searchQuery.toLowerCase();
        return types.filter(t => 
            t.key.toLowerCase().includes(lowerQuery) || 
            t.desc.toLowerCase().includes(lowerQuery)
        );
    }, [activeCat, searchQuery]);

    const handleOpenAddModal = (cat: string) => {
        setActiveCat(cat as MainModuleType);
        setIsAddModalVisible(true);
    };

    const handleAddComponent = () => {
        if (activeCat && newCompType) {
            const id = addComponent(activeCat, newCompType);
            setActiveComponent(id);
            setIsAddModalVisible(false);
            setNewCompType(null);
            setSearchQuery('');
        }
    };

    const handleCloseAddModal = () => {
        setIsAddModalVisible(false);
        setNewCompType(null);
        setSearchQuery('');
    };

    return (
        <div className="component-library-container content-enter">
            {/* Top Navigation Steps */}
            <div className="glass-card" style={{ padding: '24px 48px', marginBottom: 24 }}>
                <Steps 
                    current={currentStep} 
                    onChange={setCurrentStep}
                    items={COMPONENT_STEPS.map(s => ({
                        title: s.title,
                        icon: s.icon,
                        description: s.title === COMPONENT_STEPS[currentStep].title ? s.desc : ''
                    }))}
                />
            </div>

            <Row gutter={24} style={{ flex: 1, minHeight: 0 }}>
                {/* Left side: Step-specific Category Picker & Current Components */}
                <Col span={10}>
                    <div className="glass-card left-sidebar-panel">
                        <Title level={5} style={{ marginBottom: 16 }}>逻辑引导: {COMPONENT_STEPS[currentStep].title}</Title>
                        
                        {/* Categories for this step */}
                        <div className="category-grid" style={{ marginBottom: 24 }}>
                            {stepCategories.map(cat => (
                                <button
                                    key={cat}
                                    className="category-btn"
                                    onClick={() => handleOpenAddModal(cat)}
                                >
                                    <div className="cat-icon">{COMPONENT_STEPS[currentStep].icon}</div>
                                    <div className="cat-label">{CATEGORY_NAMES[cat] || cat}</div>
                                    <PlusOutlined className="add-badge" />
                                </button>
                            ))}
                        </div>

                        <Divider plain style={{ margin: '0 0 16px 0' }}>已添加组件 ({stepComponents.length})</Divider>
                        
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {stepComponents.length === 0 ? (
                                <Empty description="本阶段尚未添加组件" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            ) : (
                                stepComponents.map(comp => (
                                    <div
                                        key={comp.id}
                                        className={`comp-list-item glass-item ${activeComponentId === comp.id ? 'active' : ''}`}
                                        onClick={() => setActiveComponent(comp.id)}
                                    >
                                        <div className="comp-icon">
                                            {COMPONENT_STEPS.find(s => s.categories.includes(comp.category))?.icon || <AppstoreOutlined />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                                                {comp.alias || comp.name}
                                            </div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{comp.type}</div>
                                        </div>
                                        <Button
                                            type="text" size="small" danger
                                            icon={<DeleteOutlined />}
                                            onClick={e => { e.stopPropagation(); removeComponent(comp.id); }}
                                        />
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                                disabled={currentStep === 0}
                                onClick={() => setCurrentStep(currentStep - 1)}
                                icon={<ArrowLeftOutlined />}
                            >
                                上一步
                            </Button>
                            <Button 
                                type="primary"
                                disabled={currentStep === COMPONENT_STEPS.length - 1}
                                onClick={() => setCurrentStep(currentStep + 1)}
                            >
                                下一步 <ArrowRightOutlined />
                            </Button>
                        </div>
                    </div>
                </Col>

                {/* Right side: Selected Component Detail View */}
                <Col span={14}>
                    <div className="glass-card detail-panel">
                        {selected ? (
                            <div className="component-detail-view">
                                <div style={{ marginBottom: 20, padding: '0 16px' }}>
                                    <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                                        <Space size="middle">
                                            <div className="detail-icon-box">
                                                {COMPONENT_STEPS.find(s => s.categories.includes(selected.category))?.icon}
                                            </div>
                                            <div>
                                                <Input 
                                                    value={selected.alias || selected.name} 
                                                    variant="borderless"
                                                    onChange={e => updateComponent(selected.id, { alias: e.target.value })}
                                                    style={{ fontSize: 20, fontWeight: 700, padding: 0, color: 'var(--text-primary)', width: 300 }}
                                                />
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>UUID: {selected.id}</div>
                                            </div>
                                        </Space>
                                        <Tag color="blue" bordered={false} style={{ borderRadius: 4, padding: '2px 8px' }}>
                                            {selected.type}
                                        </Tag>
                                    </Space>
                                </div>

                                <Tabs defaultActiveKey="attrs" className="glass-tabs custom-tabs">
                                    <TabPane tab={<span><SettingOutlined /> 私有属性</span>} key="attrs">
                                        <div style={{ padding: '0 16px 16px' }}>
                                            <SmartFormGrouped
                                                groups={selected.privateAttrs}
                                                onGroupChange={(groupKey, attrKey, value, subKey) => updateAttribute(selected.id, groupKey, attrKey, value, subKey)}
                                            />
                                        </div>
                                    </TabPane>
                                    
                                    <TabPane tab={<span><EnvironmentOutlined /> 安装参数</span>} key="structural">
                                        <div style={{ padding: 16 }}>
                                            <Form layout="vertical">
                                                <Form.Item label="父节点挂载" tooltip="选择该组件物理上连接的父级组件">
                                                    <Select 
                                                        placeholder="默认挂载至底盘 (Root)" 
                                                        value={selected.parentNodeUuid}
                                                        onChange={val => updateStructuralParam(selected.id, { parentNodeUuid: val })}
                                                        allowClear
                                                    >
                                                        {config.components.filter(c => c.id !== selected.id).map(c => (
                                                            <Option key={c.id} value={c.id}>{c.alias || c.name}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                
                                                <Divider plain orientation="left">安装位姿 (Pose relative to parent)</Divider>
                                                
                                                <Row gutter={24}>
                                                    {['mountX', 'mountY', 'mountZ'].map(field => (
                                                        <Col span={8} key={field}>
                                                            <Form.Item label={`${field.slice(-1).toUpperCase()} 偏移 (mm)`}>
                                                                <InputNumber 
                                                                    style={{ width: '100%' }}
                                                                    value={(selected as any)[field]}
                                                                    onChange={v => updateStructuralParam(selected.id, { [field]: v })}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    ))}
                                                </Row>
                                                <Row gutter={24}>
                                                    {['mountRoll', 'mountPitch', 'mountYaw'].map(field => (
                                                        <Col span={8} key={field}>
                                                            <Form.Item label={`${field.slice(5)} 旋转 (°)`}>
                                                                <InputNumber 
                                                                    style={{ width: '100%' }}
                                                                    value={(selected as any)[field]}
                                                                    onChange={v => updateStructuralParam(selected.id, { [field]: v })}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Form>
                                        </div>
                                    </TabPane>

                                    <TabPane tab={<span><ApiOutlined /> 逻辑接口</span>} key="interfaces">
                                        <div style={{ padding: 16 }}>
                                            <List
                                                dataSource={selected.interfaces}
                                                renderItem={(inf: InterfaceConfig) => (
                                                    <div className="glass-item interface-card" style={{ marginBottom: 12, padding: 12 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div>
                                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inf.key}</div>
                                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>协议: {inf.type}</div>
                                                            </div>
                                                            <Tag color="default" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                                                                {inf.interfaceUuid.slice(0, 8)}...
                                                            </Tag>
                                                        </div>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </TabPane>

                                    <TabPane tab={<span><BoxPlotOutlined /> 物理形状</span>} key="shape">
                                        <div style={{ padding: 16 }}>
                                            <Form layout="vertical">
                                                <Form.Item label="碰撞盒类型">
                                                    <Select 
                                                        value={selected.shape?.type || 'BOX'}
                                                        onChange={val => updateShape(selected.id, { ...selected.shape, type: val as any })}
                                                    >
                                                        <Option value="BOX">长方体 (Box)</Option>
                                                        <Option value="CYLINDER">圆柱体 (Cylinder)</Option>
                                                        <Option value="SPHERE">球体 (Sphere)</Option>
                                                    </Select>
                                                </Form.Item>
                                                
                                                {(selected.shape?.type === 'BOX' || !selected.shape?.type) && (
                                                    <Row gutter={16}>
                                                        <Col span={8}>
                                                            <Form.Item label="长 (L)">
                                                                <InputNumber 
                                                                    style={{ width: '100%' }} 
                                                                    value={selected.shape?.length || 0}
                                                                    onChange={v => updateShape(selected.id, { ...selected.shape, type: 'BOX', length: v } as any)}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item label="宽 (W)">
                                                                <InputNumber 
                                                                    style={{ width: '100%' }} 
                                                                    value={selected.shape?.width || 0}
                                                                    onChange={v => updateShape(selected.id, { ...selected.shape, type: 'BOX', width: v } as any)}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item label="高 (H)">
                                                                <InputNumber 
                                                                    style={{ width: '100%' }} 
                                                                    value={selected.shape?.height || 0}
                                                                    onChange={v => updateShape(selected.id, { ...selected.shape, type: 'BOX', height: v } as any)}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                )}
                                                
                                                {selected.shape?.type === 'CYLINDER' && (
                                                    <Row gutter={16}>
                                                        <Col span={12}>
                                                            <Form.Item label="直径 (D)">
                                                                <InputNumber 
                                                                    style={{ width: '100%' }} 
                                                                    value={selected.shape?.diameter || 0}
                                                                    onChange={v => updateShape(selected.id, { ...selected.shape, type: 'CYLINDER', diameter: v } as any)}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item label="高度 (H)">
                                                                <InputNumber 
                                                                    style={{ width: '100%' }} 
                                                                    value={selected.shape?.height || 0}
                                                                    onChange={v => updateShape(selected.id, { ...selected.shape, type: 'CYLINDER', height: v } as any)}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                )}
                                            </Form>
                                            <div className="glass-item" style={{ padding: 12, textAlign: 'center', marginTop: 12 }}>
                                                <BoxPlotOutlined style={{ fontSize: 24, marginBottom: 8, opacity: 0.5 }} />
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>3D 形状预览加载中...</div>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon"><InfoCircleOutlined /></div>
                                <div className="empty-text">请在左侧添加或选择一个组件进行配置</div>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Add Component Modal - Redesigned as a Gallery */}
            <Modal
                title={
                    <div style={{ paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                        <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <PlusOutlined style={{ color: 'var(--accent)' }} />
                            <span>规格选择: {activeCat ? (CATEGORY_NAMES[activeCat] || activeCat) : ''}</span>
                        </Title>
                    </div>
                }
                open={isAddModalVisible}
                onCancel={handleCloseAddModal}
                footer={null}
                className="glass-modal gallery-modal"
                width={800}
                centered
            >
                <div style={{ marginTop: 20 }}>
                    <Input 
                        prefix={<InfoCircleOutlined style={{ opacity: 0.5 }} />}
                        placeholder="搜索型号、名称或规格关键词..."
                        size="large"
                        variant="filled"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ marginBottom: 24, borderRadius: 12 }}
                        allowClear
                    />

                    <div className="model-grid-container">
                        {availableTypes.length === 0 ? (
                            <Empty description="未找到匹配的型号" style={{ padding: '40px 0' }} />
                        ) : (
                            <Row gutter={[16, 16]}>
                                {availableTypes.map(t => (
                                    <Col span={8} key={t.key}>
                                        <div 
                                            className={`model-card ${newCompType === t.key ? 'selected' : ''}`}
                                            onClick={() => setNewCompType(t.key)}
                                            onDoubleClick={handleAddComponent}
                                        >
                                            <div className="model-card-header">
                                                <div className="model-icon">
                                                    {COMPONENT_STEPS.find(s => s.categories.includes(activeCat!))?.icon}
                                                </div>
                                                <Tag bordered={false} color="blue" style={{ margin: 0, fontSize: 10 }}>{t.manufacturer}</Tag>
                                            </div>
                                            <div className="model-name">{t.key}</div>
                                            <div className="model-desc">{t.desc}</div>
                                            <div className="model-card-footer">
                                                <Button 
                                                    type={newCompType === t.key ? "primary" : "default"} 
                                                    block 
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setNewCompType(t.key);
                                                        // Short delay for visual feedback before adding
                                                        setTimeout(handleAddComponent, 100);
                                                    }}
                                                >
                                                    {newCompType === t.key ? '已选择' : '添加此型号'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        ) }
                    </div>
                </div>
            </Modal>

            <style>{`
                .component-library-container {
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 180px);
                }
                .left-sidebar-panel {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    padding: 24px !important;
                }
                .detail-panel {
                    height: 100%;
                    overflow-y: auto;
                }
                .component-library-container .category-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
                    gap: 12px;
                }
                .component-library-container .category-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 16px;
                    border-radius: 12px;
                    border: 1px solid var(--border-subtle);
                    background: rgba(255, 255, 255, 0.03);
                    cursor: pointer;
                    transition: all 0.3s;
                    position: relative;
                    color: var(--text-secondary);
                }
                .component-library-container .category-btn:hover {
                    border-color: var(--accent);
                    background: var(--accent-soft);
                    color: var(--accent-text);
                    transform: translateY(-2px);
                }
                .component-library-container .cat-icon {
                    font-size: 24px;
                    margin-bottom: 8px;
                }
                .component-library-container .cat-label {
                    font-size: 12px;
                    font-weight: 600;
                }
                .component-library-container .add-badge {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    font-size: 12px;
                    opacity: 0.5;
                }
                
                /* Enhanced List Items */
                .comp-list-item {
                    padding: 16px !important;
                    margin-bottom: 12px !important;
                    border: 1px solid transparent;
                }
                .comp-list-item:hover {
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(255, 255, 255, 0.1);
                }
                .comp-list-item.active {
                    background: var(--accent-soft) !important;
                    border-color: var(--accent) !important;
                    box-shadow: var(--shadow-glow);
                }
                .comp-list-item .comp-icon {
                    width: 36px;
                    height: 36px;
                    font-size: 18px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    color: var(--accent);
                }

                /* Model Gallery Card */
                .model-grid-container {
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 4px;
                }
                .model-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-subtle);
                    border-radius: 12px;
                    padding: 16px;
                    height: 100%;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .model-card:hover {
                    background: rgba(255, 255, 255, 0.07);
                    border-color: var(--accent-soft);
                    transform: translateY(-4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                .model-card.selected {
                    background: var(--accent-soft);
                    border-color: var(--accent);
                }
                .model-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .model-icon {
                    font-size: 20px;
                    color: var(--accent);
                }
                .model-name {
                    font-weight: 700;
                    font-size: 15px;
                    color: var(--text-primary);
                    margin-top: 4px;
                }
                .model-desc {
                    font-size: 12px;
                    color: var(--text-muted);
                    flex: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.4;
                }
                .model-card-footer {
                    margin-top: 8px;
                }

                .detail-icon-box {
                    width: 48px;
                    height: 48px;
                    background: var(--accent-soft);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    color: var(--accent-text);
                    box-shadow: var(--shadow-glow);
                }
                .interface-card {
                    border: 1px solid var(--border-subtle);
                    border-radius: 8px;
                    transition: border-color 0.3s;
                }
                .interface-card:hover {
                    border-color: var(--accent-soft);
                }
                .custom-tabs .ant-tabs-nav::before {
                    border-bottom-color: var(--border-subtle) !important;
                }
            `}</style>
        </div>
    );
};

export default ComponentLibraryStep;
