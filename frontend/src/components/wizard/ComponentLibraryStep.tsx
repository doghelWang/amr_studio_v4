import React, { useState, useMemo, useEffect } from 'react';
import { 
    Typography, Button, Space, Modal, Card, 
    Input, Row, Col, Tag, Divider, Tree, List, Spin,
    Menu, Badge, Tooltip, Empty
} from 'antd';
import { 
    PlusOutlined, DeleteOutlined, 
    SettingOutlined, SearchOutlined,
    AppstoreOutlined, BuildOutlined,
    DeploymentUnitOutlined,
    ThunderboltOutlined,
    RadarChartOutlined,
    DesktopOutlined,
    BulbOutlined,
    ControlOutlined,
    RobotOutlined,
    PartitionOutlined,
    EditOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import { ImportService } from '../../store/ImportService';
import axios from 'axios';

const { Title, Text } = Typography;

export const ComponentLibraryStep: React.FC = () => {
    const { 
        config, addComponentFromConfig, removeComponent, 
        activeComponentId, setActiveComponent, updateComponent,
        projectId
    } = useProjectStore();
    
    const [isAddModalOpen, setIsAddModal] = useState(false);
    const [isNamingModalOpen, setIsNamingModalOpen] = useState(false);
    const [pendingComponent, setPendingComponent] = useState<any>(null);
    const [tempAlias, setTempAlias] = useState('');
    const [tempName, setTempName] = useState('');
    
    const [rawLibrary, setRawLibrary] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [currentSubStep, setCurrentSubStep] = useState(1);

    const components = config?.components || [];

    const subSteps = [
        { title: '底盘配置', categories: ['CHASSIS'], systems: ['ChassisSys'], icon: <RobotOutlined /> },
        { title: '核心控制板', categories: ['MAINCPU', 'CONTROL', 'IO_BOARD', 'INTERGRATEDCONTROLLER'], systems: ['ControlSys'], icon: <DeploymentUnitOutlined /> },
        { title: '动力系统', categories: ['ACTOR', 'DRIVER', 'MOTOR', 'DRIVEWHEEL'], systems: ['DriverSys', 'ActorSys', 'SensorSys'],
            encoderKeywords: ['encoder', 'encode', '编码器', '拉线', '角度编码'], icon: <ThunderboltOutlined /> },
        { title: '感知避障', categories: ['LASER', 'CAMERA', 'TOF', 'SENSOR'],
            excludeKeywords: ['encoder', 'encode', '编码器', '拉线', '角度编码'], systems: ['SensorSys'], icon: <RadarChartOutlined /> },
        { title: '电源管理', categories: ['BATTERY', 'ENERGYCONTROLLER'], systems: ['EnergySys'], icon: <ThunderboltOutlined /> },
        { title: '触点交互', categories: ['BUTTON'], systems: ['InteractiveSys'], icon: <DeploymentUnitOutlined /> },
        { title: '信息显示', categories: ['DISPLAY', 'SCREEN'], systems: ['InteractiveSys'], icon: <DesktopOutlined /> },
        { title: '灯带氛围', categories: ['LED', 'LIGHT'], systems: ['InteractiveSys'], icon: <BulbOutlined /> },
        { title: '其他扩展', categories: ['IO', 'OTHER', 'COMMUNICATION', 'AUTOBODY'], systems: ['CommunicateSys', 'AutobodySys'], icon: <ControlOutlined /> },
    ];

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8002/api/v1/resources/modules')
            .then(res => { 
                setRawLibrary(res.data || {}); 
                setLoading(false); 
            })
            .catch(err => { 
                console.error("FAILED TO FETCH LIBRARY:", err);
                setLoading(false); 
            });
    }, [projectId]); // Re-fetch when project context resets

    const currentStep = subSteps[currentSubStep - 1] || subSteps[0];

    const filteredLocal = useMemo(() => {
        return components.filter(c => {
            const alias = (c.alias || '').toLowerCase();
            const name = (c.name || '').toLowerCase();
            const searchStr = alias + ' ' + name;
            if (currentStep.encoderKeywords?.some(kw => searchStr.includes(kw))) return true;
            if (!currentStep.categories.includes(c.category)) return false;
            if (currentStep.excludeKeywords?.some(kw => searchStr.includes(kw))) return false;
            return true;
        });
    }, [components, currentSubStep]);

    const treeData = useMemo(() => {
        const map: any = {};
        const roots: any[] = [];
        components.forEach(c => {
            map[c.id] = { title: c.alias, key: c.id, icon: <BuildOutlined />, children: [] };
        });
        components.forEach(c => {
            if (c.parentNodeUuid && map[c.parentNodeUuid]) map[c.parentNodeUuid].children.push(map[c.id]);
            else roots.push(map[c.id]);
        });
        return roots;
    }, [components]);

    const handleConfirmAdd = () => {
        if (pendingComponent) {
            addComponentFromConfig({ ...pendingComponent, alias: tempAlias, name: tempName });
            setIsNamingModalOpen(false);
            setIsAddModal(false);
            setPendingComponent(null);
        }
    };

    return (
        <div className="content-grid" style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
            <div className="section-title"><PartitionOutlined /> 3. 骨架装配 - {currentStep.title}</div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#1c2128', borderRadius: 12, border: '1px solid #30363d' }}>
                <div style={{ width: 200, borderRight: '1px solid #30363d', background: 'rgba(0,0,0,0.2)' }}>
                    <Menu mode="inline" theme="dark" selectedKeys={[currentSubStep.toString()]} onClick={({key}) => setCurrentSubStep(parseInt(key))}
                        items={subSteps.map((s,i) => ({ key: (i+1).toString(), icon: s.icon, label: s.title }))}
                        style={{ background: 'transparent', border: 'none' }} />
                </div>

                <div style={{ width: 340, display: 'flex', flexDirection: 'column', borderRight: '1px solid #30363d' }}>
                    <div style={{ padding: 16, borderBottom: '1px solid #30363d' }}>
                        <Button type="primary" block icon={<PlusOutlined />} onClick={() => setIsAddModal(true)}>新增组件选型</Button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                        <div style={{ marginBottom: 20 }}>
                            <Text strong style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>本环节已添加 ({filteredLocal.length})</Text>
                            <List
                                size="small"
                                dataSource={filteredLocal}
                                renderItem={item => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => setActiveComponent(item.id)}
                                        style={{ padding: '8px 12px', borderRadius: 6, cursor: 'pointer', marginBottom: 4, background: activeComponentId === item.id ? 'var(--accent-soft)' : 'transparent', border: activeComponentId === item.id ? '1px solid var(--accent)' : '1px solid transparent' }}
                                    >
                                        <div style={{ fontSize: 13, fontWeight: 600, color: activeComponentId === item.id ? 'var(--accent)' : '#fff' }}>{item.alias}</div>
                                        <div style={{ fontSize: 10, color: '#8b949e' }}>{item.name}</div>
                                    </div>
                                )}
                            />
                        </div>
                        <Divider plain><Text type="secondary" style={{ fontSize: 10 }}>全域层级</Text></Divider>
                        <Tree showIcon treeData={treeData} selectedKeys={activeComponentId ? [activeComponentId] : []} onSelect={k => k[0] && setActiveComponent(k[0] as string)} blockNode style={{ background: 'transparent' }} />
                    </div>
                </div>

                <div style={{ flex: 1, background: '#0d1117', overflowY: 'auto', padding: 24 }}>
                    {activeComponentId ? (
                        <ComponentPropertyPanel 
                            projectId={projectId} 
                            selectedUuid={activeComponentId} 
                        />
                    ) : <Empty description="选择组件开始配置" />}
                </div>
            </div>

            <Modal title="工业资源库 (双轨验证模式)" open={isAddModalOpen} onCancel={() => setIsAddModal(false)} footer={null} width={1000} style={{ top: 40 }}>
                {loading ? <Spin tip="正在拉取数字孪生库..." /> : (
                    <div style={{ height: '65vh', overflowY: 'auto', paddingRight: 10 }}>
                        {/* ━━━ IMPROVED FILTERING: Show all if target system is missing ━━━ */}
                        {(() => {
                            const sysKeys = Object.keys(rawLibrary);
                            const matchedSystems = sysKeys.filter(s => currentStep.systems.includes(s));
                            const systemsToShow = matchedSystems.length > 0 ? matchedSystems : sysKeys;

                            return systemsToShow.map(sys => (
                                <div key={sys}>
                                    <Divider orientation="left" plain><Text strong style={{ color: matchedSystems.length > 0 ? 'var(--accent)' : 'var(--orange)' }}>{sys} {matchedSystems.length === 0 && "(兼容显示)"}</Text></Divider>
                                    <Row gutter={[12, 12]}>
                                        {(rawLibrary[sys] || []).map((entity: any) => (
                                            <React.Fragment key={entity.module_id}>
                                                {entity.has_xml && (
                                                    <Col span={8}>
                                                        <Card hoverable size="small" style={{ background: '#0d1117', borderColor: '#1f6feb' }} onClick={() => {
                                                            const comp = ImportService.mapEntityToComponent(entity.data_xml);
                                                            setPendingComponent(comp); setTempAlias(comp.alias); setTempName(comp.name); setIsNamingModalOpen(true);
                                                        }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Text strong style={{ color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>{entity.moduleGroupName}</Text>
                                                                <Tag color="cyan" style={{ border: 'none', margin: 0, fontSize: 9 }}>XML</Tag>
                                                            </div>
                                                            <div style={{ fontSize: 9, color: 'var(--accent)', marginTop: 8 }}>探测接口: {(entity.data_xml?.moduleComponets?.[0]?.interfaceAbility?.busInterfaceAbility || []).map((ia:any)=>`${ia.busInterfaceNums}x${ia.busInterfaceType}`).join(',') || '无'}</div>
                                                        </Card>
                                                    </Col>
                                                )}
                                                {entity.has_json && (
                                                    <Col span={8}>
                                                        <Card hoverable size="small" style={{ background: '#0d1117', borderColor: '#d29922' }} onClick={() => {
                                                            const comp = ImportService.mapEntityToComponent(entity.data_json);
                                                            setPendingComponent(comp); setTempAlias(comp.alias); setTempName(comp.name); setIsNamingModalOpen(true);
                                                        }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Text strong style={{ color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>{entity.moduleGroupName}</Text>
                                                                <Tag color="orange" style={{ border: 'none', margin: 0, fontSize: 9 }}>JSON</Tag>
                                                            </div>
                                                            <div style={{ fontSize: 9, color: '#d29922', marginTop: 8 }}>探测接口: {(entity.data_json?.moduleComponets?.[0]?.interfaceAbility?.busInterfaceAbility || []).map((ia:any)=>`${ia.busInterfaceNums}x${ia.busInterfaceType}`).join(',') || '无'}</div>
                                                        </Card>
                                                    </Col>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </Row>
                                </div>
                            ));
                        })()}
                    </div>
                )}
            </Modal>

            <Modal title="配置组件身份" open={isNamingModalOpen} onOk={handleConfirmAdd} onCancel={() => setIsNamingModalOpen(false)} okText="确认添加" cancelText="取消">
                <div style={{ padding: '10px 0' }}>
                    <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ fontSize: 12 }}>设备别名 (Alias)</Text>
                        <Input autoFocus placeholder="例如: 左前激光雷达" value={tempAlias} onChange={e => setTempAlias(e.target.value)} style={{ marginTop: 8 }} />
                    </div>
                    <div>
                        <Text strong style={{ fontSize: 12 }}>系统名称 (Name)</Text>
                        <Input placeholder="例如: lidar_front_left" value={tempName} onChange={e => setTempName(e.target.value)} style={{ marginTop: 8 }} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ComponentLibraryStep;
