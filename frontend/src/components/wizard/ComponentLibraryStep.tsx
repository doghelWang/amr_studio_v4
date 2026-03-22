import React, { useState, useMemo } from 'react';
import { 
    Typography, Button, Space, Modal, Card, 
    Empty, Form, Input, Select, 
    Row, Col, Tag, Divider, Tree, Badge
} from 'antd';
import { 
    PlusOutlined, DeleteOutlined, 
    SettingOutlined, SearchOutlined,
    AppstoreOutlined, BuildOutlined,
    QuestionCircleOutlined,
    DeploymentUnitOutlined,
    NodeIndexOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';

const { Title, Text } = Typography;

export const ComponentLibraryStep: React.FC = () => {
    const { config, removeComponent, activeComponentId, setActiveComponent } = useProjectStore();
    const [isAddModalOpen, setIsAddModal] = useState(false);

    const components = config.components;

    // ━━━ OPTIMIZATION: Transform Flat List to Hardware Tree ━━━
    const treeData = useMemo(() => {
        const map: Record<string, any> = {};
        const roots: any[] = [];

        // 1. Initialize nodes
        components.forEach(c => {
            map[c.id] = {
                title: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 500 }}>{c.alias}</span>
                        <Text type="secondary" style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>[{c.name}]</Text>
                    </div>
                ),
                key: c.id,
                icon: <BuildOutlined />,
                children: []
            };
        });

        // 2. Build Hierarchy
        components.forEach(c => {
            if (c.parentNodeUuid && map[c.parentNodeUuid]) {
                map[c.parentNodeUuid].children.push(map[c.id]);
            } else {
                roots.push(map[c.id]);
            }
        });

        return roots;
    }, [components]);

    return (
        <div className="content-grid" style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
            <div className="section-title">
                <AppstoreOutlined /> 3. 骨架装配与硬件拓扑 (Hardware Skeleton)
            </div>

            <div style={{ 
                flex: 1, 
                display: 'flex', 
                gap: 0, 
                overflow: 'hidden',
                background: '#1c2128',
                borderRadius: 12,
                border: '1px solid var(--border-strong)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
            }}>
                {/* ━━━ Left: Hardware Tree ━━━ */}
                <div style={{ 
                    width: 350, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRight: '1px solid var(--border-default)',
                    background: 'rgba(0,0,0,0.2)'
                }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-default)', display: 'flex', gap: 8 }}>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            style={{ flex: 1, height: 36, borderRadius: 6 }}
                            onClick={() => setIsAddModal(true)}
                        >
                            新增挂载
                        </Button>
                        <Button icon={<NodeIndexOutlined />} style={{ width: 36 }} />
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                        {components.length === 0 ? (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无硬件挂载" />
                        ) : (
                            <Tree
                                showIcon
                                defaultExpandAll
                                treeData={treeData}
                                selectedKeys={activeComponentId ? [activeComponentId] : []}
                                onSelect={(keys) => keys[0] && setActiveComponent(keys[0] as string)}
                                blockNode
                                className="custom-hardware-tree"
                                style={{ background: 'transparent' }}
                            />
                        )}
                    </div>
                    
                    <div style={{ padding: 12, background: 'rgba(0,0,0,0.1)', borderTop: '1px solid var(--border-default)' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>拓扑概准</div>
                        <Space split={<Divider type="vertical" />}>
                            <Badge status="processing" text={<span style={{fontSize: 11, color: 'var(--text-muted)'}}>总数: {components.length}</span>} />
                            <Badge status="success" text={<span style={{fontSize: 11, color: 'var(--text-muted)'}}>在线</span>} />
                        </Space>
                    </div>
                </div>

                {/* ━━━ Right: Detail Panel ━━━ */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0d1117' }}>
                    {activeComponentId ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Dashboard Header */}
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-default)', background: 'linear-gradient(to right, rgba(88,166,255,0.05), transparent)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <Space size={4} style={{ marginBottom: 8 }}>
                                            <Tag color="cyan" bordered={false}>{components.find(c => c.id === activeComponentId)?.category}</Tag>
                                            <Tag color="purple" bordered={false}>{components.find(c => c.id === activeComponentId)?.type}</Tag>
                                        </Space>
                                        <Title level={3} style={{ margin: 0, color: '#f0f6fc' }}>
                                            {components.find(c => c.id === activeComponentId)?.alias}
                                        </Title>
                                    </div>
                                    <Space>
                                        <Button icon={<DeleteOutlined />} danger onClick={() => removeComponent(activeComponentId)}>移除</Button>
                                        <Button type="primary" ghost icon={<SettingOutlined />}>参数标定</Button>
                                    </Space>
                                </div>
                                
                                <Divider style={{ margin: '16px 0', opacity: 0.5 }} />
                                
                                {/* ━━━ OPTIMIZATION: Interface Resource Dashboard ━━━ */}
                                <Row gutter={40}>
                                    <Col>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>已用/总接口 (Ability)</div>
                                        <Space size={12} style={{ marginTop: 4 }}>
                                            <div className="res-mini-tag"><span>CAN</span> <strong>1/2</strong></div>
                                            <div className="res-mini-tag"><span>DI</span> <strong>4/8</strong></div>
                                            <div className="res-mini-tag"><span>DO</span> <strong>2/4</strong></div>
                                        </Space>
                                    </Col>
                                    <Col>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>空间位姿 (6-DOF)</div>
                                        <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>
                                            X:{components.find(c => c.id === activeComponentId)?.mountX} Y:{components.find(c => c.id === activeComponentId)?.mountY}
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                                <ComponentPropertyPanel 
                                    projectId={useProjectStore.getState().projectId} 
                                    selectedUuid={activeComponentId} 
                                />
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                            <DeploymentUnitOutlined style={{ fontSize: 60, marginBottom: 20 }} />
                            <Title level={5}>请在左侧硬件树中选择节点</Title>
                            <Text type="secondary">点击节点可进入详细参数标定界面</Text>
                        </div>
                    )}
                </div>
            </div>

            <Modal title="从库中选择组件" open={isAddModalOpen} onCancel={() => setIsAddModal(false)} footer={null} width={800}>
                <Input prefix={<SearchOutlined />} placeholder="搜索组件 (雷达, 电机, 控制器...)" style={{ marginBottom: 20 }} />
                <div style={{ height: 400, overflowY: 'auto' }}>
                    <Text type="secondary">注册表组件加载中...</Text>
                </div>
            </Modal>

            <style>{`
                .custom-hardware-tree .ant-tree-node-content-wrapper {
                    padding: 4px 8px !important;
                    border-radius: 6px !important;
                    transition: all 0.2s !important;
                }
                .custom-hardware-tree .ant-tree-node-selected {
                    background-color: var(--accent-soft) !important;
                    color: var(--accent) !important;
                }
                .res-mini-tag {
                    font-size: 10px;
                    background: rgba(255,255,255,0.05);
                    padding: 2px 8px;
                    border-radius: 4px;
                    border: 1px solid var(--border-default);
                }
                .res-mini-tag span { color: var(--text-muted); margin-right: 4px; }
                .res-mini-tag strong { color: var(--accent); }
            `}</style>
        </div>
    );
};

export default ComponentLibraryStep;
