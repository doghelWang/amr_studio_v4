import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select, Row, Col, Divider, Card, Typography, Tabs, Tooltip, Switch, Space, Tag, Input } from 'antd';
import { BuildOutlined, ColumnWidthOutlined, HolderOutlined, ThunderboltOutlined, InfoCircleOutlined, SyncOutlined, IdcardOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { DRIVE_TYPE_LABELS } from '../../store/types';
import { PowerSystemStep } from './PowerSystemStep';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import { ChassisVisualizer } from '../visualizer/ChassisVisualizer';

import { Modal, message } from 'antd';

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const ChassisStep: React.FC<{ onExport?: () => void }> = () => {
    const { config, setIdentity, updateAttribute } = useProjectStore();
    const { identity } = config;
    const [syncFullLoad, setSyncFullLoad] = useState(true);

    const handleUpdate = (fields: any) => {
        // Special case: Drive Type change requires confirmation because it wipes wheels/motors
        if ('driveType' in fields && fields.driveType !== identity.driveType) {
            const powerComps = config.components.filter(c => 
                ['DRIVEWHEEL', 'DRIVER', 'MOTOR', 'ACTOR'].includes(c.category)
            );

            if (powerComps.length > 0) {
                Modal.confirm({
                    title: '更换底盘驱动类型',
                    content: `检测到当前已配置 ${powerComps.length} 个动力组件。更换驱动类型将清除现有轮组、电机及驱动器映射，以确保拓扑一致性。确定要继续吗？`,
                    okText: '确定更换',
                    cancelText: '取消',
                    maskClosable: true,
                    onOk: () => {
                        setIdentity(fields);
                        message.info(`已切换至 ${DRIVE_TYPE_LABELS[fields.driveType]}，请重新配置轮组`);
                    }
                });
                return;
            }
        }
        
        setIdentity(fields);
    };

    const handleOffsetChange = (field: string, v: number | null) => {
        if (v === null || v === undefined) return;
        const len = identity.chassisLength || 1200;
        const wid = identity.chassisWidth || 800;
        const updates: any = { [field]: v };
        if (field === 'headOffset') updates.tailOffset = Math.max(0, len - v);
        if (field === 'tailOffset') updates.headOffset = Math.max(0, len - v);
        if (field === 'leftOffset') updates.rightOffset = Math.max(0, wid - v);
        if (field === 'rightOffset') updates.leftOffset = Math.max(0, wid - v);
        setIdentity(updates);
    };

    const chassisComponent = config.components.find(c => c.category === 'CHASSIS');
    const privateAttrs = chassisComponent ? chassisComponent.privateAttrs : [];
    const motionCenterGroup = privateAttrs.find(g => g.key === 'motionCenterAttr');
    const motionCenterEles = motionCenterGroup ? motionCenterGroup.elements : [];

    const getMotionCenterVal = (key: string) => {
        const ele = motionCenterEles.find(e => (e.key || '').toLowerCase() === key.toLowerCase()) as any;
        return ele ? (ele.value ?? ele.doubleValue ?? ele.double_value ?? 0) : 0;
    };

    const headIdle = getMotionCenterVal('headOffset(Idle)') || identity.headOffset;
    const leftIdle = getMotionCenterVal('leftOffset(Idle)') || identity.leftOffset;

    const renderHeaderField = (label: string, field: string, value: string, isSelect = false, options?: any[]) => (
        <Space size={4}>
            <Text type="secondary" style={{ fontSize: 12 }}>{label}:</Text>
            {isSelect ? (
                <Select 
                    size="small" 
                    variant="borderless" 
                    style={{ fontWeight: 600, minWidth: 120, borderBottom: '1px dashed rgba(255,255,255,0.2)' }}
                    value={value}
                    options={options}
                    onChange={v => handleUpdate({ [field]: v })}
                />
            ) : (
                <Input 
                    size="small" 
                    variant="borderless" 
                    style={{ fontWeight: 600, width: 140, borderBottom: '1px dashed rgba(255,255,255,0.2)' }}
                    value={value}
                    onChange={e => handleUpdate({ [field]: e.target.value })}
                />
            )}
        </Space>
    );

    return (
        <div className="content-grid" style={{ padding: 0 }}>
            {/* ━━━ Global Identity Header Summary ━━━ */}
            <div className="chassis-identity-header" style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px 24px',
                borderBottom: '1px solid var(--border-default)',
                marginBottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Space size={32}>
                    {renderHeaderField('机器人名称', 'robotName', identity.robotName)}
                    {renderHeaderField('技术标识', 'materialCode', identity.materialCode)}
                    {renderHeaderField('底盘模型', 'driveType', identity.driveType, true, Object.entries(DRIVE_TYPE_LABELS).map(([k, v]) => ({ label: v, value: k })))}
                </Space>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Tag icon={<IdcardOutlined />} color="processing" style={{ margin: 0 }}>Step 2: 底盘与动力系统配置</Tag>
                </div>
            </div>

            <Tabs defaultActiveKey="chassis" tabPosition="top" style={{ padding: '0 24px' }} className="step2-main-tabs">
                <TabPane tab={<span><BuildOutlined /> 2-1. 尺寸与中心</span>} key="chassis">
                    <div className="section-title" style={{ marginTop: 16 }}>
                        <BuildOutlined /> 物理环境参数与运动中心
                    </div>
                    <Row gutter={24} style={{ alignItems: 'flex-start' }}>
                        <Col span={8} style={{ position: 'sticky', top: 0 }}>
                            <Card className="smart-card" variant="borderless">
                                <Title level={5} style={{ color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <HolderOutlined /> 实时运动中心预览
                                </Title>
                                <ChassisVisualizer 
                                    width={identity.chassisWidth}
                                    length={identity.chassisLength}
                                    shape={identity.chassisShape as any}
                                    headOffset={identity.headOffset}
                                    leftOffset={identity.leftOffset}
                                    components={config.components}
                                    svgSize={200}
                                />
                                <div style={{ marginTop: 20 }}>
                                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>• 红色十字为运动中心 (Motion Center)</Text>
                                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>• 绿色箭头为车头 (Head)</Text>
                                </div>
                            </Card>
                        </Col>

                        <Col span={16}>
                            <Card className="smart-card" variant="borderless">
                                <Title level={5} style={{ color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <ColumnWidthOutlined /> 物理包络 & 运动中心 (Dimensions)
                                </Title>
                                
                                <Form layout="vertical">
                                    <Row gutter={16}>
                                        <Col span={8}><Form.Item label="车长 (L)"><InputNumber style={{ width: '100%' }} value={identity.chassisLength} suffix="mm" onChange={v => handleUpdate({ chassisLength: v })} /></Form.Item></Col>
                                        <Col span={8}><Form.Item label="车宽 (W)"><InputNumber style={{ width: '100%' }} value={identity.chassisWidth} suffix="mm" onChange={v => handleUpdate({ chassisWidth: v })} /></Form.Item></Col>
                                        <Col span={8}><Form.Item label="车高 (H)"><InputNumber style={{ width: '100%' }} value={identity.chassisHeight} suffix="mm" onChange={v => handleUpdate({ chassisHeight: v })} /></Form.Item></Col>
                                    </Row>

                                    <Form.Item label="外形轮廓 (chassisShape)">
                                        <Select value={identity.chassisShape} onChange={v => handleUpdate({ chassisShape: v })}>
                                            <Option value="BOX">● 矩形 (BOX)</Option>
                                            <Option value="CYLINDER">● 圆形 (CYLINDER)</Option>
                                        </Select>
                                    </Form.Item>

                                    <Divider orientation="left" plain><small>运动中心偏移 - 空载 (Idle)</small></Divider>
                                    
                                    <Row gutter={16}>
                                        <Col span={12}><Form.Item label="前向距 (Head Offset)"><InputNumber style={{ width: '100%' }} value={identity.headOffset} suffix="mm" onChange={v => handleOffsetChange('headOffset', v as number)} /></Form.Item></Col>
                                        <Col span={12}><Form.Item label="后向距 (Tail Offset)"><InputNumber style={{ width: '100%' }} value={identity.tailOffset} suffix="mm" onChange={v => handleOffsetChange('tailOffset', v as number)} /></Form.Item></Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}><Form.Item label="左向距 (Left Offset)"><InputNumber style={{ width: '100%' }} value={identity.leftOffset} suffix="mm" onChange={v => handleOffsetChange('leftOffset', v as number)} /></Form.Item></Col>
                                        <Col span={12}><Form.Item label="右向距 (Right Offset)"><InputNumber style={{ width: '100%' }} value={identity.rightOffset} suffix="mm" onChange={v => handleOffsetChange('rightOffset', v as number)} /></Form.Item></Col>
                                    </Row>

                                    <Divider orientation="left" plain>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <small>运动中心偏移 - 满载 (Full Load)</small>
                                            <Switch size="small" checkedChildren="同空载" unCheckedChildren="独立" checked={syncFullLoad} onChange={setSyncFullLoad} />
                                        </div>
                                    </Divider>

                                    <Row gutter={16}>
                                        <Col span={12}><Form.Item label="前向距 (Full Load)"><InputNumber style={{ width: '100%' }} value={syncFullLoad ? identity.headOffset : (identity.headOffsetFull ?? identity.headOffset)} suffix="mm" disabled={syncFullLoad} onChange={v => !syncFullLoad && setIdentity({ headOffsetFull: v as number })} /></Form.Item></Col>
                                        <Col span={12}><Form.Item label="后向距 (Full Load)"><InputNumber style={{ width: '100%' }} value={syncFullLoad ? identity.tailOffset : (identity.tailOffsetFull ?? identity.tailOffset)} suffix="mm" disabled={syncFullLoad} onChange={v => !syncFullLoad && setIdentity({ tailOffsetFull: v as number })} /></Form.Item></Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}><Form.Item label="左向距 (Full Load)"><InputNumber style={{ width: '100%' }} value={syncFullLoad ? identity.leftOffset : (identity.leftOffsetFull ?? identity.leftOffset)} suffix="mm" disabled={syncFullLoad} onChange={v => !syncFullLoad && setIdentity({ leftOffsetFull: v as number })} /></Form.Item></Col>
                                        <Col span={12}><Form.Item label="右向距 (Full Load)"><InputNumber style={{ width: '100%' }} value={syncFullLoad ? identity.rightOffset : (identity.rightOffsetFull ?? identity.rightOffset)} suffix="mm" disabled={syncFullLoad} onChange={v => !syncFullLoad && setIdentity({ rightOffsetFull: v as number })} /></Form.Item></Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane tab={<span><HolderOutlined /> 2-2. 运动性能配置</span>} key="attributes">
                    <div className="section-title" style={{ marginTop: 16 }}>
                        <HolderOutlined /> 底盘运动学与性能参数
                    </div>
                    <Row gutter={24} style={{ alignItems: 'flex-start' }}>
                        <Col span={8} style={{ position: 'sticky', top: 0 }}>
                            <Card className="smart-card" variant="borderless">
                                <Title level={5} style={{ color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <HolderOutlined /> 布局预览
                                </Title>
                                <ChassisVisualizer 
                                    width={identity.chassisWidth}
                                    length={identity.chassisLength}
                                    shape={identity.chassisShape as any}
                                    headOffset={identity.headOffset}
                                    leftOffset={identity.leftOffset}
                                    components={config.components}
                                    svgSize={200}
                                />
                            </Card>
                        </Col>

                        <Col span={16}>
                            <Card className="smart-card" variant="borderless">
                                <Form layout="vertical">
                                    <Title level={5} style={{ color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <ThunderboltOutlined /> 基础运动参数 (Idle / 空载)
                                    </Title>
                                    <Row gutter={12}>
                                        <Col span={6}><Form.Item label="最大线速度"><InputNumber style={{ width: '100%' }} value={identity.maxSpeed} suffix="mm/s" onChange={v => handleUpdate({ maxSpeed: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="最大线加速度"><InputNumber style={{ width: '100%' }} value={identity.maxAccel} suffix="mm/s²" onChange={v => handleUpdate({ maxAccel: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="最大线减速度"><InputNumber style={{ width: '100%' }} value={identity.maxDecel} suffix="mm/s²" onChange={v => handleUpdate({ maxDecel: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="避障最大减速度"><InputNumber style={{ width: '100%' }} value={identity.avoidMaxDec} suffix="mm/s²" onChange={v => handleUpdate({ avoidMaxDec: v as number })} /></Form.Item></Col>
                                    </Row>


                                    <Divider orientation="left" plain>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Title level={5} style={{ color: 'var(--accent)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <SyncOutlined spin={syncFullLoad} /> 负载性能参数 (Full Load / 满载)
                                            </Title>
                                            <Switch size="small" checkedChildren="同步" unCheckedChildren="独立" checked={syncFullLoad} onChange={setSyncFullLoad} />
                                        </div>
                                    </Divider>
                                    
                                    <Row gutter={12}>
                                        <Col span={6}><Form.Item label="最大线速度 (满载)"><InputNumber style={{ width: '100%' }} disabled={syncFullLoad} value={syncFullLoad ? Math.round(identity.maxSpeed * 0.8) : identity.maxSpeedFull} suffix="mm/s" onChange={v => !syncFullLoad && handleUpdate({ maxSpeedFull: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="最大线加速度 (满载)"><InputNumber style={{ width: '100%' }} disabled={syncFullLoad} value={syncFullLoad ? Math.round(identity.maxAccel * 0.4) : identity.maxAccelFull} suffix="mm/s²" onChange={v => !syncFullLoad && handleUpdate({ maxAccelFull: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="最大线减速度 (满载)"><InputNumber style={{ width: '100%' }} disabled={syncFullLoad} value={syncFullLoad ? Math.round(identity.maxDecel * 0.5) : identity.maxDecelFull} suffix="mm/s²" onChange={v => !syncFullLoad && handleUpdate({ maxDecelFull: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="避障最大减速度 (满载)"><InputNumber style={{ width: '100%' }} disabled={syncFullLoad} value={syncFullLoad ? identity.avoidMaxDec : identity.avoidMaxDecFull} suffix="mm/s²" onChange={v => !syncFullLoad && handleUpdate({ avoidMaxDecFull: v as number })} /></Form.Item></Col>
                                    </Row>

                                    <Divider orientation="left" plain><small>旋转性能 (Rotation)</small></Divider>
                                    <Row gutter={12}>
                                        <Col span={12}><Form.Item label="最大角速度"><InputNumber style={{ width: '100%' }} value={identity.rotateMaxAngSpeed} suffix="°/s" onChange={v => handleUpdate({ rotateMaxAngSpeed: v as number })} /></Form.Item></Col>
                                        <Col span={12}><Form.Item label="最大角加速度"><InputNumber style={{ width: '100%' }} value={identity.rotateMaxAngAcceleration} suffix="°/s²" onChange={v => handleUpdate({ rotateMaxAngAcceleration: v as number })} /></Form.Item></Col>
                                    </Row>
                                    
                                    {chassisComponent && (
                                        <div style={{ marginTop: 24 }}>
                                            <Divider orientation="left" plain><small>底盘全局参数列表 (Official CModel Registry)</small></Divider>
                                            <ComponentPropertyPanel 
                                                projectId={null}
                                                selectedUuid={chassisComponent.id} 
                                                hideTabs={true}
                                                excludeGroupKeys={['motionCenterAttr']}
                                                excludeElementKeys={[
                                                    'length', 'width', 'height', 
                                                    'maxSpeed', 'maxAccel', 'maxDecel', 'maxRotSpeed', 'maxRotAccel',
                                                    'moduleName', 'materialCode', 'manufacturer', 'moduleAlias', 'modelKey', 'category', 'robotName', 'driveType',
                                                    'wheelsNum'
                                                ]}
                                            />
                                        </div>
                                    )}


                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
                
                <TabPane tab={<span><ThunderboltOutlined /> 2-3. 动力拓扑管理</span>} key="power">
                    <div className="section-title" style={{ marginTop: 16 }}>
                        <ThunderboltOutlined /> 动力关联组件 (轮-驱-电)
                    </div>
                    <div style={{ height: 'calc(100vh - 250px)' }}>
                        <PowerSystemStep />
                    </div>
                </TabPane>
            </Tabs>
            <style>{`
                .step2-main-tabs .ant-tabs-nav::before { border-bottom: 1px solid var(--border-default); }
                .step2-main-tabs .ant-tabs-tab-active { background: rgba(56, 139, 253, 0.05); }
                .ant-input-number-suffix { color: var(--text-muted); font-size: 11px; }
            `}</style>
        </div>
    );
};
