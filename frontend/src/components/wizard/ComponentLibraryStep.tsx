import React, { useState, useMemo } from 'react';
import { 
    Layout, Typography, Button, Space, Modal, Card, 
    Empty, Form, Input, InputNumber, Select, 
    Row, Col, Tag, Divider, List, Tabs
} from 'antd';
import { 
    PlusOutlined, DeleteOutlined, 
    SettingOutlined, SearchOutlined,
    AppstoreOutlined, BuildOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import masterRegistry from '../../store/master_registry.json';

const { Title, Text } = Typography;
const { Option } = Select;

export const ComponentLibraryStep: React.FC = () => {
    const { config, addComponent, removeComponent, activeComponentId, setActiveComponent } = useProjectStore();
    const [isAddModalOpen, setIsAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const components = config.components;

    return (
        <div className="content-grid" style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
            <div className="section-title">
                <AppstoreOutlined /> 3. 骨架装配与组件配置
            </div>

            <div style={{ 
                flex: 1, 
                display: 'flex', 
                gap: 0, 
                overflow: 'hidden',
                background: '#1c2128', // Solid Dark
                borderRadius: 12,
                border: '1px solid var(--border-strong)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
            }}>
                {/* ━━━ Left: Sidebar List ━━━ */}
                <div style={{ 
                    width: 320, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRight: '1px solid var(--border-default)',
                    background: 'rgba(0,0,0,0.2)'
                }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-default)' }}>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            block 
                            onClick={() => setIsAddModal(true)}
                            style={{ height: 40, borderRadius: 8, fontWeight: 600 }}
                        >
                            添加新组件
                        </Button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                        {components.length === 0 ? (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无组件" style={{ marginTop: 40 }} />
                        ) : (
                            <List
                                dataSource={components}
                                renderItem={comp => (
                                    <div 
                                        key={comp.id}
                                        onClick={() => setActiveComponent(comp.id)}
                                        className={`component-item ${activeComponentId === comp.id ? 'active' : ''}`}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            marginBottom: 4,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            transition: 'all 0.2s',
                                            background: activeComponentId === comp.id ? 'var(--accent-soft)' : 'transparent',
                                            border: '1px solid',
                                            borderColor: activeComponentId === comp.id ? 'var(--accent)' : 'transparent'
                                        }}
                                    >
                                        <div style={{ 
                                            width: 32, height: 32, 
                                            borderRadius: 6, 
                                            background: 'var(--bg-main)', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '1px solid var(--border-default)'
                                        }}>
                                            <BuildOutlined style={{ color: activeComponentId === comp.id ? 'var(--accent)' : 'var(--text-muted)' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: 13, color: activeComponentId === comp.id ? '#fff' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {comp.alias}
                                            </div>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                                {comp.name}
                                            </div>
                                        </div>
                                        <Button 
                                            type="text" size="small" danger
                                            icon={<DeleteOutlined />}
                                            onClick={e => { e.stopPropagation(); removeComponent(comp.id); }}
                                        />
                                    </div>
                                )}
                            />
                        )}
                    </div>
                </div>

                {/* ━━━ Right: Detail Panel ━━━ */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0d1117' }}>
                    {activeComponentId ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Tag color="blue" style={{ marginBottom: 4 }}>{components.find(c => c.id === activeComponentId)?.category}</Tag>
                                    <Title level={4} style={{ margin: 0 }}>{components.find(c => c.id === activeComponentId)?.alias}</Title>
                                </div>
                                <Space>
                                    <Button icon={<SettingOutlined />}>高级设置</Button>
                                    <Button icon={<QuestionCircleOutlined />} />
                                </Space>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                                <ComponentPropertyPanel 
                                    projectId={useProjectStore.getState().projectId} 
                                    selectedUuid={activeComponentId} 
                                />
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Empty description="选择一个组件以查看和编辑其详细参数" />
                        </div>
                    )}
                </div>
            </div>

            {/* Add Component Modal Placeholder */}
            <Modal title="从库中选择组件" open={isAddModalOpen} onCancel={() => setIsAddModal(false)} footer={null} width={800}>
                <Input prefix={<SearchOutlined />} placeholder="搜索组件 (雷达, 电机, 控制器...)" style={{ marginBottom: 20 }} />
                <div style={{ height: 400, overflowY: 'auto' }}>
                    {/* Registry List would go here */}
                    <Text type="secondary">注册表组件加载中...</Text>
                </div>
            </Modal>

            <style>{`
                .component-item:hover {
                    background: rgba(255,255,255,0.05) !important;
                }
                .component-item.active:hover {
                    background: var(--accent-soft) !important;
                }
            `}</style>
        </div>
    );
};

export default ComponentLibraryStep;
