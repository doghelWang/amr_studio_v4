import React, { useState, useMemo, useEffect } from 'react';
import { 
    Typography, Button, Space, Modal, Card, 
    Empty, Form, Input, Select, 
    Row, Col, Tag, Divider, Tree, Badge, List, Spin
} from 'antd';
import { 
    PlusOutlined, DeleteOutlined, 
    SettingOutlined, SearchOutlined,
    AppstoreOutlined, BuildOutlined,
    QuestionCircleOutlined,
    DeploymentUnitOutlined,
    NodeIndexOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import { ImportService } from '../../store/ImportService';
import axios from 'axios';

const { Title, Text } = Typography;

export const ComponentLibraryStep: React.FC = () => {
    const { config, addComponent, removeComponent, activeComponentId, setActiveComponent } = useProjectStore();
    const [isAddModalOpen, setIsAddModal] = useState(false);
    const [libraryData, setLibraryData] = useState<Record<string, any[]>>({});
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const components = config.components;

    // Load Module Library on mount
    useEffect(() => {
        setLoadingLibrary(true);
        axios.get('http://localhost:8002/api/v1/resources/modules')
            .then(res => {
                setLibraryData(res.data);
                setLoadingLibrary(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingLibrary(false);
            });
    }, []);

    const treeData = useMemo(() => {
        const map: Record<string, any> = {};
        const roots: any[] = [];
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
        components.forEach(c => {
            if (c.parentNodeUuid && map[c.parentNodeUuid]) {
                map[c.parentNodeUuid].children.push(map[c.id]);
            } else {
                roots.push(map[c.id]);
            }
        });
        return roots;
    }, [components]);

    const handleAddFromLibrary = (entity: any) => {
        try {
            const newComp = ImportService.mapEntityToComponent(entity.full_data);
            addComponent(newComp);
            setIsAddModal(false);
        } catch (err) {
            console.error("Failed to add component", err);
        }
    };

    return (
        <div className="content-grid" style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
            <div className="section-title">
                <AppstoreOutlined /> 3. 骨架装配与硬件拓扑
            </div>

            <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden', background: '#1c2128', borderRadius: 12, border: '1px solid var(--border-strong)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
                {/* ━━━ Left: Hardware Tree ━━━ */}
                <div style={{ width: 350, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-default)', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-default)', display: 'flex', gap: 8 }}>
                        <Button type="primary" icon={<PlusOutlined />} style={{ flex: 1, height: 36, borderRadius: 6 }} onClick={() => setIsAddModal(true)}>
                            新增挂载
                        </Button>
                        <Button icon={<NodeIndexOutlined />} style={{ width: 36 }} />
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                        {components.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无硬件挂载" /> : (
                            <Tree showIcon defaultExpandAll treeData={treeData} selectedKeys={activeComponentId ? [activeComponentId] : []} onSelect={(keys) => keys[0] && setActiveComponent(keys[0] as string)} blockNode className="custom-hardware-tree" style={{ background: 'transparent' }} />
                        )}
                    </div>
                </div>

                {/* ━━━ Right: Detail Panel ━━━ */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0d1117' }}>
                    {activeComponentId ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-default)', background: 'linear-gradient(to right, rgba(88,166,255,0.05), transparent)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <Space size={4} style={{ marginBottom: 8 }}>
                                            <Tag color="cyan" bordered={false}>{components.find(c => c.id === activeComponentId)?.category}</Tag>
                                            <Tag color="purple" bordered={false}>{components.find(c => c.id === activeComponentId)?.type}</Tag>
                                        </Space>
                                        <Title level={3} style={{ margin: 0, color: '#f0f6fc' }}>{components.find(c => c.id === activeComponentId)?.alias}</Title>
                                    </div>
                                    <Space>
                                        <Button icon={<DeleteOutlined />} danger onClick={() => removeComponent(activeComponentId)}>移除</Button>
                                        <Button type="primary" ghost icon={<SettingOutlined />}>参数标定</Button>
                                    </Space>
                                </div>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                                <ComponentPropertyPanel projectId={useProjectStore.getState().projectId} selectedUuid={activeComponentId} />
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                            <DeploymentUnitOutlined style={{ fontSize: 60, marginBottom: 20 }} />
                            <Title level={5}>硬件树就绪</Title>
                            <Text type="secondary">点击左侧节点进行参数标定，或点击“新增挂载”从库中添加</Text>
                        </div>
                    )}
                </div>
            </div>

            {/* ━━━ Component Market Modal ━━━ */}
            <Modal title="工业级组件超市 (Module Library)" open={isAddModalOpen} onCancel={() => setIsAddModal(false)} footer={null} width={1000} style={{ top: 40 }}>
                <Input prefix={<SearchOutlined />} placeholder="搜索雷达、电机、IO模块..." style={{ marginBottom: 20 }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <div style={{ height: 500, overflowY: 'auto' }}>
                    {loadingLibrary ? <div style={{ textAlign: 'center', padding: 100 }}><Spin tip="索引资源库中..." /></div> : (
                        Object.keys(libraryData).map(sys => (
                            <div key={sys} style={{ marginBottom: 32 }}>
                                <Title level={5} style={{ color: 'var(--accent)', borderLeft: '4px solid var(--accent)', paddingLeft: 12 }}>{sys}</Title>
                                <Row gutter={[16, 16]}>
                                    {libraryData[sys].filter(e => e.moduleGroupName.toLowerCase().includes(searchTerm.toLowerCase())).map(entity => (
                                        <Col span={8} key={entity.file_name}>
                                            <Card 
                                                hoverable 
                                                size="small"
                                                style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-default)' }}
                                                onClick={() => handleAddFromLibrary(entity)}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <BuildOutlined style={{ fontSize: 24, color: 'var(--text-muted)' }} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entity.moduleGroupName}</div>
                                                        <Text type="secondary" style={{ fontSize: 11 }}>{entity.file_name}</Text>
                                                    </div>
                                                    <PlusCircleOutlined style={{ fontSize: 18, color: 'var(--accent)' }} />
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ))
                    )}
                </div>
            </Modal>

            <style>{`
                .custom-hardware-tree .ant-tree-node-content-wrapper { padding: 4px 8px !important; border-radius: 6px !important; transition: all 0.2s !important; }
                .custom-hardware-tree .ant-tree-node-selected { background-color: var(--accent-soft) !important; color: var(--accent) !important; }
            `}</style>
        </div>
    );
};

export default ComponentLibraryStep;
