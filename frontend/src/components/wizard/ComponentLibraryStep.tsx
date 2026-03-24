import React, { useState, useMemo, useEffect } from 'react';
import { 
    Typography, Button, Space, Modal, Card, 
    Input, Row, Col, Tag, Divider, Tree, List, Spin,
    Menu, Badge, Tooltip
} from 'antd';
import { 
    PlusOutlined, DeleteOutlined, 
    SettingOutlined, SearchOutlined,
    AppstoreOutlined, BuildOutlined,
    DeploymentUnitOutlined,
    PlusCircleOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined,
    RadarChartOutlined,
    DesktopOutlined,
    BulbOutlined,
    ControlOutlined,
    RobotOutlined,
    InfoCircleOutlined,
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
        activeComponentId, setActiveComponent, updateComponent
    } = useProjectStore();
    const [isAddModalOpen, setIsAddModal] = useState(false);
    const [isNamingModalOpen, setIsNamingModalOpen] = useState(false);
    const [pendingComponent, setPendingComponent] = useState<any>(null);
    const [tempAlias, setTempAlias] = useState('');
    const [tempName, setTempName] = useState('');
    
    const [libraryData, setLibraryData] = useState<Record<string, any[]>>({});
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSubStep, setCurrentSubStep] = useState(1);

    const components = config.components;


    const subSteps = [
        { title: '底盘配置', description: '完善底盘属性', categories: ['CHASSIS'], systems: ['ChassisSys'], icon: <RobotOutlined /> },
        { title: '核心控制板', description: '主控制器 / 扩展控制板', categories: ['MAINCPU', 'CONTROL', 'IO_BOARD', 'INTERGRATEDCONTROLLER'], systems: ['ControlSys'], icon: <DeploymentUnitOutlined /> },
        { title: '动力系统', description: '轮组、电机、驱动器、编码器', categories: ['ACTOR', 'DRIVER', 'MOTOR', 'DRIVEWHEEL'], systems: ['DriverSys', 'ActorSys', 'SensorSys'],
            // Encoder-type sensors also belong here
            encoderKeywords: ['encoder', 'encode', '编码器', '拉线', '角度编码'],
            icon: <ThunderboltOutlined /> },
        { title: '感知避障', description: '激光雷达、相机、超声波、IMU', categories: ['LASER', 'CAMERA', 'TOF', 'SENSOR'],
            // Exclude encoder-type sensors (they belong to power system)
            excludeKeywords: ['encoder', 'encode', '编码器', '拉线', '角度编码'],
            systems: ['SensorSys'],
            navigationAlert: true,
            icon: <RadarChartOutlined /> },
        { title: '电源管理', description: '电池及充电模块', categories: ['BATTERY', 'ENERGYCONTROLLER'], systems: ['EnergySys'], icon: <ThunderboltOutlined /> },
        { title: '触点交互', description: '按鈕及紧急停止', categories: ['BUTTON'], systems: ['InteractiveSys'], icon: <SafetyCertificateOutlined /> },
        { title: '信息显示', description: '显示屏、指示灯', categories: ['DISPLAY', 'SCREEN'], systems: ['InteractiveSys'], icon: <DesktopOutlined />, optional: true },
        { title: '灯带氛围', description: 'LED 状态灯条', categories: ['LED', 'LIGHT'], systems: ['InteractiveSys'], icon: <BulbOutlined />, optional: true },
        { title: '其他扩展', description: 'IO模块、其他传感器', categories: ['IO', 'OTHER', 'COMMUNICATION', 'AUTOBODY'], systems: ['CommunicateSys', 'AutobodySys'], icon: <ControlOutlined /> },
    ];


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

    const filteredComponents = useMemo(() => {
        const step = subSteps[currentSubStep - 1];
        const allowedCategories = step.categories;
        const excludeKws: string[] = (step as any).excludeKeywords || [];
        const encoderKws: string[] = (step as any).encoderKeywords || [];

        return components.filter(c => {
            const catMatch = allowedCategories.includes(c.category);
            const alias = (c.alias || '').toLowerCase();
            const name = (c.name || '').toLowerCase();
            const searchStr = alias + ' ' + name;

            // If this step has explict encoder keywords → include encoder-matching components even when category doesn't match
            if (encoderKws.length > 0 && encoderKws.some(kw => searchStr.includes(kw))) {
                return true;
            }
            // If not a category match, exclude
            if (!catMatch) return false;
            // Exclude components matching excludeKeywords
            if (excludeKws.length > 0 && excludeKws.some(kw => searchStr.includes(kw))) {
                return false;
            }
            return true;
        });
    }, [components, currentSubStep]);

    const treeData = useMemo(() => {
        const map: Record<string, any> = {};
        const roots: any[] = [];
        components.forEach(c => {
            map[c.id] = {
                title: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, color: '#f0f6fc' }}>{c.alias}</span>
                        <Text type="secondary" style={{ fontSize: 9, fontFamily: 'var(--font-mono)', opacity: 0.5 }}>{c.name}</Text>
                    </div>
                ),
                key: c.id,
                icon: <BuildOutlined style={{ fontSize: 13, color: 'var(--accent)' }} />,
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

    const handlePrepareAdd = (entity: any) => {
        try {
            const newComp = ImportService.mapEntityToComponent(entity.full_data);
            setPendingComponent(newComp);
            setTempAlias(newComp.alias);
            setTempName(newComp.name);
            setIsNamingModalOpen(true);
        } catch (err) {
            console.error("Failed to map component", err);
        }
    };

    const handleConfirmAdd = () => {
        if (pendingComponent) {
            const finalComp = { 
                ...pendingComponent, 
                alias: tempAlias || pendingComponent.alias,
                name: tempName || pendingComponent.name 
            };
            addComponentFromConfig(finalComp);
            setIsNamingModalOpen(false);
            setIsAddModal(false);
            setPendingComponent(null);
        }
    };

    const getModuleType = (entity: any): string => {
        const full = entity.full_data || {};
        // CRITICAL: Backend typo is 'moduleComponets'. Testing shows it is the primary key.
        const comp = (full.moduleComponets || full.module_componets || full.moduleComponents || full.module_components || [])[0];
        if (!comp) return '';
        
        const gen = comp.generalAttr || comp.general_attr || {};
        return gen.mainModuleType?.comboType?.typeKey || 
               gen.mainModuleType?.typeKey ||
               gen.main_module_type?.combo_type?.type_key ||
               '';
    };

    const currentStepInfo = subSteps[currentSubStep - 1];

    return (
        <div className="content-grid" style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
            <div className="section-title">
                <PartitionOutlined /> 3. 骨架装配与硬件拓扑 - {currentStepInfo.title}
            </div>

            <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden', background: '#1c2128', borderRadius: 12, border: '1px solid var(--border-strong)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
                {/* ━━━ Left: Sub-Step Navigation ━━━ */}
                <div style={{ width: 220, borderRight: '1px solid var(--border-default)', background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Text strong style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>装配流程指导</Text>
                    </div>
                    <Menu
                        mode="inline"
                        selectedKeys={[currentSubStep.toString()]}
                        style={{ background: 'transparent', border: 'none', padding: '12px 0' }}
                        onClick={({ key }) => setCurrentSubStep(parseInt(key))}
                        items={subSteps.map((step, idx) => ({
                            key: (idx + 1).toString(),
                            icon: step.icon,
                            label: (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingLeft: 4 }}>
                                    <span style={{ fontSize: 13 }}>{step.title}</span>
                                    {step.optional ? <Tag style={{ margin: 0, fontSize: 9 }}>可选</Tag> : (
                                        components.some(c => step.categories.includes(c.category)) ? <Badge status="success" /> : <Badge status="default" />
                                    )}
                                </div>
                            )
                        }))}
                    />
                </div>

                {/* ━━━ Middle: Local List & Tree ━━━ */}
                <div style={{ width: 340, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-default)', background: 'rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border-default)', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f6fc' }}>{currentStepInfo.title}</div>
                                <Text type="secondary" style={{ fontSize: 11 }}>{currentStepInfo.description}</Text>
                            </div>
                            {currentSubStep > 1 && (
                                <Button 
                                    type="primary" 
                                    size="small"
                                    icon={<PlusOutlined />} 
                                    onClick={() => setIsAddModal(true)}
                                    className="add-btn-refined"
                                >
                                    新增
                                </Button>
                            )}
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                <BuildOutlined style={{ fontSize: 12, color: 'var(--accent)' }} />
                                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>已添加组件 (精简列表)</span>
                            </div>
                            {filteredComponents.length === 0 ? (
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 8, border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                        {currentSubStep === 1 ? "底盘已固化，请点击查看属性" : "暂无组件，请点击上方“新增”按钮"}
                                    </Text>
                                </div>
                            ) : (
                                <List
                                    size="small"
                                    dataSource={filteredComponents}
                                    renderItem={item => (
                                        <div 
                                            key={item.id}
                                            onClick={() => setActiveComponent(item.id)}
                                            className={`compact-list-item ${activeComponentId === item.id ? 'active' : ''}`}
                                            style={{ 
                                                padding: '10px 12px', 
                                                borderRadius: 6, 
                                                cursor: 'pointer',
                                                marginBottom: 4,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                transition: 'all 0.2s',
                                                background: activeComponentId === item.id ? 'var(--accent-soft)' : 'transparent'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <Badge color={activeComponentId === item.id ? 'var(--accent)' : 'rgba(255,255,255,0.2)'} />
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: activeComponentId === item.id ? 'var(--accent)' : '#f8f9fa' }}>{item.alias}</span>
                                                    <Text type="secondary" style={{ fontSize: 10, opacity: 0.5 }}>{item.name}</Text>
                                                </div>
                                            </div>
                                            {activeComponentId === item.id && <Tooltip title="正在配置中"><SettingOutlined style={{ color: 'var(--accent)', fontSize: 12 }} /></Tooltip>}
                                        </div>
                                    )}
                                />
                            )}
                        </div>
                        
                        <Divider plain style={{ margin: '24px 0' }}>
                            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>全域硬件层级关系</Text>
                        </Divider>
                        <div style={{ padding: '0 4px' }}>
                            <Tree 
                                showIcon 
                                showLine={{ showLeafIcon: false }}
                                treeData={treeData} 
                                selectedKeys={activeComponentId ? [activeComponentId] : []} 
                                onSelect={(keys) => keys[0] && setActiveComponent(keys[0] as string)} 
                                blockNode 
                                className="custom-hardware-tree-v2" 
                                style={{ background: 'transparent', fontSize: 12 }} 
                            />
                        </div>
                    </div>
                </div>

                {/* ━━━ Right: Multi-Tab Detail Panel ━━━ */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0d1117' }}>
                    {activeComponentId ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)', background: 'linear-gradient(to right, rgba(88,166,255,0.08), transparent)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Space direction="vertical" size={2}>
                                        <Space size={6}>
                                            <Tag color="#1f6feb" style={{ border: 'none', borderRadius: 4, margin: 0, fontSize: 10 }}>{components.find(c => c.id === activeComponentId)?.category}</Tag>
                                            <Tag style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 4, margin: 0, fontSize: 10, color: '#8b949e' }}>{components.find(c => c.id === activeComponentId)?.type}</Tag>
                                        </Space>
                                        <Title level={4} style={{ margin: '8px 0 0 0', color: '#f0f6fc', fontWeight: 600 }}>{components.find(c => c.id === activeComponentId)?.alias}</Title>
                                    </Space>
                                    <Space>
                                        {components.find(c => c.id === activeComponentId)?.category !== 'CHASSIS' && (
                                            <Tooltip title="从项目中移除该组件">
                                                <Button size="small" icon={<DeleteOutlined />} danger ghost onClick={() => removeComponent(activeComponentId)} style={{ borderRadius: 6 }}>移除</Button>
                                            </Tooltip>
                                        )}
                                        <Button size="small" type="primary" ghost icon={<EditOutlined />} onClick={() => {
                                            const currentComp = components.find(c => c.id === activeComponentId);
                                            if (currentComp) {
                                                setPendingComponent(currentComp);
                                                setTempAlias(currentComp.alias);
                                                setTempName(currentComp.name);
                                                setIsNamingModalOpen(true);
                                            }
                                        }} style={{ borderRadius: 6 }}>修改信息</Button>
                                    </Space>
                                </div>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                                <ComponentPropertyPanel projectId={useProjectStore.getState().projectId} selectedUuid={activeComponentId} />
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                            <div style={{ padding: 40, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '50%', marginBottom: 24 }}>
                                <DeploymentUnitOutlined style={{ fontSize: 60, color: 'var(--accent)' }} />
                            </div>
                            <Title level={5} style={{ color: '#8b949e' }}>就绪并等待参数标定</Title>
                            <Text type="secondary" style={{ maxWidth: 300, textAlign: 'center' }}>系统已根据左侧进度加载过滤规则。请选中上方“已添加组件”列表中的项开始配置其安装 pose 与私有参数。</Text>
                        </div>
                    )}
                </div>
            </div>

            {/* ━━━ Naming Modal ━━━ */}
            <Modal
                title={<Space><EditOutlined style={{ color: 'var(--accent)' }} />{pendingComponent?.id && components.some(c => c.id === pendingComponent.id) ? '修改组件信息' : '配置新组件'}</Space>}
                open={isNamingModalOpen}
                onOk={() => {
                    if (pendingComponent?.id && components.some(c => c.id === pendingComponent.id)) {
                        updateComponent(pendingComponent.id, { alias: tempAlias, name: tempName });
                        setIsNamingModalOpen(false);
                    } else {
                        handleConfirmAdd();
                    }
                }}
                onCancel={() => setIsNamingModalOpen(false)}
                okText="确定"
                cancelText="取消"
                width={460}
                centered
                className="naming-modal"
            >
                <div style={{ padding: '10px 0' }}>
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ marginBottom: 8 }}>
                            <Text strong style={{ fontSize: 12, color: '#f0f6fc' }}>设备别名 (Alias)</Text>
                            <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>易记的中文/名称，如：左前激光</Text>
                        </div>
                        <Input 
                            autoFocus
                            size="large"
                            placeholder="例如: 差速底盘" 
                            value={tempAlias} 
                            onChange={e => setTempAlias(e.target.value)}
                        />
                    </div>
                    <div>
                        <div style={{ marginBottom: 8 }}>
                            <Text strong style={{ fontSize: 12, color: '#f0f6fc' }}>技术标识符 (Name / ID)</Text>
                            <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>系统唯一标识，如：diffChassis</Text>
                        </div>
                        <Input 
                            size="large"
                            placeholder="例如: diffChassis" 
                            value={tempName} 
                            onChange={e => setTempName(e.target.value)}
                            onPressEnter={() => {
                                if (pendingComponent?.id && components.some(c => c.id === pendingComponent.id)) {
                                    updateComponent(pendingComponent.id, { alias: tempAlias, name: tempName });
                                    setIsNamingModalOpen(false);
                                } else {
                                    handleConfirmAdd();
                                }
                            }}
                        />
                    </div>
                    <div style={{ marginTop: 24, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                        <Tag color="cyan" style={{ border: 'none', margin: 0, fontSize: 10 }}>Hardware Model: {pendingComponent?.type}</Tag>
                    </div>
                </div>
            </Modal>

            {/* ━━━ Component Market Modal ━━━ */}
            <Modal title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <AppstoreOutlined style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: 16, fontWeight: 600 }}>数字孪生资源库 - {currentStepInfo.title}</span>
                </div>
            } open={isAddModalOpen} onCancel={() => setIsAddModal(false)} footer={null} width={1000} style={{ top: 40 }} className="library-modal">
                <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(88,166,255,0.05)', borderRadius: 8, border: '1px solid rgba(88,166,255,0.1)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <InfoCircleOutlined style={{ color: 'var(--accent)' }} />
                    <Text style={{ fontSize: 12 }}>当前处于【{currentStepInfo.title}】搭建环节，已为您智能过滤资源库。设备标识已支持 Alias 与 Name 双重定义。</Text>
                </div>
                <Row gutter={24} align="middle" style={{ marginBottom: 24 }}>
                    <Col flex="1">
                        <Input size="large" prefix={<SearchOutlined />} placeholder="搜索型号、描述、制造商..." style={{ borderRadius: 8, background: 'rgba(255,255,255,0.02)' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </Col>
                </Row>
                <div style={{ height: 'calc(80vh - 220px)', overflowY: 'auto', paddingRight: 8 }}>
                    {loadingLibrary ? <div style={{ textAlign: 'center', padding: 100 }}><Spin tip="索引数字孪生资源库中..." /></div> : (
                        Object.keys(libraryData).filter(sys => currentStepInfo.systems.includes(sys)).map(sys => {
                            const filtered = libraryData[sys].filter(e => {
                                const matchSearch = e.moduleGroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                  e.file_name.toLowerCase().includes(searchTerm.toLowerCase());
                                if (!matchSearch) return false;

                                const rawTypeKey = getModuleType(e);
                                const rawLower = rawTypeKey.toLowerCase();
                                const fileName = (e.file_name || '').toLowerCase();
                                const groupName = (e.moduleGroupName || '').toLowerCase();
                                const searchStr = rawLower + ' ' + fileName + ' ' + groupName;

                                // ━━━ Normalize IO-board typeKeys into IO_BOARD ━━━
                                // Source JSONs use 'extendedlnterface' (lowercase l - typo), 'extendedInterface', 'ioModule'
                                let normalizedType: string;
                                if (
                                    rawLower === 'extendedlnterface' || rawLower === 'extendedinterface' ||
                                    rawLower === 'iomodule' || rawLower === 'safetyiomodule'
                                ) {
                                    normalizedType = 'IO_BOARD';
                                } else if (rawLower === 'safetycontroller') {
                                    normalizedType = 'CONTROL';
                                } else if (rawLower === 'powercontroller') {
                                    normalizedType = 'ENERGYCONTROLLER';
                                } else {
                                    normalizedType = rawTypeKey.toUpperCase();
                                }

                                const excludeKws: string[] = (currentStepInfo as any).excludeKeywords || [];
                                const encoderKws: string[] = (currentStepInfo as any).encoderKeywords || [];

                                // ━━━ Encoder keyword inclusion ━━━
                                // If this step wants encoders, include if encoder keyword matches
                                if (encoderKws.length > 0 && encoderKws.some(kw => searchStr.includes(kw))) {
                                    return true;
                                }

                                // ━━━ Linkage Filter for Chassis ━━━
                                if (normalizedType === 'CHASSIS' || currentStepInfo.categories.includes('CHASSIS')) {
                                    if (config.identity.driveType === 'STANDARD_DIFF' && !fileName.includes('diff')) return false;
                                    if (config.identity.driveType === 'SINGLE_STEER' && !fileName.includes('single')) return false;
                                    if (config.identity.driveType === 'DUAL_STEER' && !fileName.includes('double') && !fileName.includes('dual')) return false;
                                }

                                // ━━━ Category match ━━━
                                if (!currentStepInfo.categories.includes(normalizedType)) {
                                    // Fallback: INTERGRATEDCONTROLLER maps to CONTROL category
                                    if (normalizedType === 'INTERGRATEDCONTROLLER' && currentStepInfo.categories.includes('CONTROL')) {
                                        // allow through, will be checked below
                                    } else if (normalizedType === 'MAINCPU' && currentStepInfo.categories.includes('CONTROL')) {
                                        // allow through
                                    } else {
                                        return false;
                                    }
                                }

                                // ━━━ Keyword exclusion (e.g. encoder sensors OUT of 感知避障) ━━━
                                if (excludeKws.length > 0 && excludeKws.some(kw => searchStr.includes(kw))) {
                                    return false;
                                }

                                return true;
                            });
                            if (filtered.length === 0) return null;

                            return (
                                <div key={sys} style={{ marginBottom: 40 }}>
                                    <Divider orientation="left" plain>
                                        <Text strong style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 }}>{sys}</Text>
                                    </Divider>
                                    <Row gutter={[20, 20]}>
                                        {filtered.map(entity => {
                                            const full = entity.full_data || {};
                                            const comp = (full.moduleComponets || full.module_componets || full.moduleComponents || full.module_components || [])[0];
                                            const ifaceAbility = comp?.interfaceAbility || comp?.interface_ability || {};
                                            const ifaceCounts = (ifaceAbility.busInterfaceAbility || ifaceAbility.bus_interface_ability || [])
                                                .map((ia: any) => `${ia.busInterfaceNums || ia.bus_interface_nums}x ${ia.busInterfaceType || ia.bus_interface_type}`)
                                                .join(', ');

                                            return (
                                                <Col span={8} key={entity.file_name}>
                                                    <Card hoverable variant="borderless" size="small" className="library-card" onClick={() => handlePrepareAdd(entity)}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '4px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                                                                <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.03)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <BuildOutlined style={{ fontSize: 24, color: 'var(--accent)' }} />
                                                                </div>
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div style={{ fontWeight: 600, fontSize: 14, color: '#f0f6fc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                        {entity.moduleGroupName}
                                                                    </div>
                                                                    <Text type="secondary" style={{ fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.6 }}>{entity.file_name}</Text>
                                                                </div>
                                                                <PlusCircleOutlined className="add-icon" style={{ fontSize: 24, color: 'var(--accent)', opacity: 0.2 }} />
                                                            </div>
                                                            {ifaceCounts && (
                                                                <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8, marginBottom: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>已声明电气接口</div>
                                                                    <div style={{ fontSize: 11, color: '#58a6ff', fontWeight: 500 }}>{ifaceCounts}</div>
                                                                </div>
                                                            )}
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Space size={4}>
                                                                    {(() => {
                                                                        const eType = getModuleType(entity).toUpperCase();
                                                                        return currentStepInfo.categories.includes('LASER') && (config.identity.navigationMethod === 'LASER_SLAM' || config.identity.navigationMethod === 'REFLECTOR') && (eType === 'LASER' || entity.file_name.toLowerCase().includes('laser'));
                                                                    })() && (
                                                                        <Tag color="var(--success)" bordered={false} style={{ fontSize: 9, margin: 0 }}>导航必需参数</Tag>
                                                                    )}
                                                                    <Tag color="default" bordered={false} style={{ fontSize: 9, margin: 0, background: 'rgba(255,255,255,0.05)' }}>MODEL V4</Tag>
                                                                    <Tag color="blue" bordered={false} style={{ fontSize: 9, margin: 0, opacity: 0.8 }}>PREMIUM</Tag>
                                                                </Space>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </div>
                            );
                        })
                    )}
                </div>
            </Modal>

            <style>{`
                .custom-hardware-tree-v2 .ant-tree-node-content-wrapper { padding: 4px 8px !important; border-radius: 6px !important; transition: all 0.2s !important; }
                .custom-hardware-tree-v2 .ant-tree-node-selected { background-color: var(--accent-soft) !important; color: var(--accent) !important; }
                .custom-hardware-tree-v2 .ant-tree-switcher { display: flex; align-items: center; justify-content: center; }

                .compact-list-item:hover { background: rgba(255,255,255,0.04) !important; }
                .compact-list-item.active { 
                    background: var(--accent-soft) !important; 
                    box-shadow: inset 2px 0 0 var(--accent);
                }

                .library-card { 
                    background: #1c2128 !important; 
                    border: 1px solid #30363d !important; 
                    border-radius: 12px !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    padding: 4px !important;
                }
                .library-card:hover { 
                    border-color: var(--accent) !important; 
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.5) !important;
                    background: #21262d !important;
                }
                .library-card:hover .add-icon { opacity: 1 !important; transform: scale(1.1); transition: all 0.2s; }
                
                .add-btn-refined {
                    border-radius: 6px !important;
                    box-shadow: 0 4px 12px rgba(31,111,235,0.3) !important;
                    font-weight: 600 !important;
                }
                
                .naming-modal .ant-modal-content {
                    background: #1c2128 !important;
                    border: 1px solid #30363d !important;
                }
                .naming-modal .ant-modal-header {
                    background: transparent !important;
                    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                }
                .naming-modal .ant-modal-title { color: #f0f6fc !important; }
            `}</style>
        </div>
    );
};

export default ComponentLibraryStep;
