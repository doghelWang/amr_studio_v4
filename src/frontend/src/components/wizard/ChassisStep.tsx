import React, { useEffect, useState, useMemo } from 'react';
import { 
    Form, InputNumber, Select, Row, Col, Divider, Card, 
    Typography, Tabs, Tooltip, Switch, Space, Tag, Input
} from 'antd';
import { 
    BuildOutlined, ColumnWidthOutlined, HolderOutlined, 
    ThunderboltOutlined, InfoCircleOutlined, SyncOutlined, 
    IdcardOutlined, PartitionOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { DRIVE_TYPE_LABELS } from '../../store/types';
import { PowerSystemStep } from './PowerSystemStep';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import { ChassisVisualizer } from '../visualizer/ChassisVisualizer';

import { Modal, message } from 'antd';

const { Option } = Select;
const { Title, Text } = Typography;

export const ChassisStep: React.FC<{ onExport?: () => void }> = ({ onExport }) => {
    const { config, setIdentity, updateAttribute, updateComponent } = useProjectStore();
    const { identity } = config;
    const [syncFullLoad, setSyncFullLoad] = useState(true);

    const handleUpdate = (fields: any) => {
        if ('driveType' in fields && fields.driveType !== identity.driveType) {
            const powerComps = config.components.filter(c => 
                ['DRIVEWHEEL', 'DRIVER', 'MOTOR', 'ACTOR'].includes(c.category)
            );
            if (powerComps.length > 0) {
                Modal.confirm({
                    title: '更换底盘驱动类型',
                    content: `检测到当前已配置 ${powerComps.length} 个动力组件。更换驱动类型将清除现有轮组映射。确定要继续吗？`,
                    onOk: () => setIdentity(fields)
                });
                return;
            }
        }
        setIdentity(fields);
    };

    const handleOffsetChange = (field: string, v: number | null) => {
        if (v === null) return;
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

    const renderHeaderField = (label: string, field: string, value: string, isSelect = false, options?: any[]) => (
        <Space size={4}>
            <Text type="secondary" style={{ fontSize: 12 }}>{label}:</Text>
            {isSelect ? (
                <Select 
                    size="small" 
                    variant="borderless" 
                    style={{ fontWeight: 600, minWidth: 120, borderBottom: '1px dashed var(--border-default)' }}
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

    const tabItems = [
        {
            key: 'chassis',
            label: <span><BuildOutlined /> 2-1. 尺寸与中心</span>,
            children: (
                <div style={{ padding: '16px 0' }}>
                    <Row gutter={24} style={{ alignItems: 'flex-start' }}>
                        <Col xs={24} lg={8} style={{ display: 'flex', flexDirection: 'column' }}>
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

                        <Col xs={24} lg={16} style={{ minHeight: 500 }}>
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
                </div>
            )
        },
        {
            key: 'attributes',
            label: <span><HolderOutlined /> 2-2. 运动性能配置</span>,
            children: (
                <div style={{ padding: '16px 0' }}>
                    <Row gutter={24} style={{ alignItems: 'flex-start' }}>
                        <Col xs={24} lg={8} style={{ display: 'flex', flexDirection: 'column' }}>
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
                                
                                <Divider />
                                <Title level={5} style={{ color: 'var(--accent)', fontSize: 14, marginBottom: 16 }}>
                                    <ColumnWidthOutlined /> 物理质量参数 (归属底盘)
                                </Title>
                                <Form layout="vertical">
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <Form.Item label="底盘自重"><InputNumber style={{ width: '100%' }} value={identity.selfWeight} suffix="kg" onChange={v => setIdentity({ selfWeight: v as number })} /></Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="额定负载"><InputNumber style={{ width: '100%' }} value={identity.totalLoadWeight} suffix="kg" onChange={v => setIdentity({ totalLoadWeight: v as number })} /></Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>

                        <Col xs={24} lg={16} style={{ minHeight: 500 }}>
                            <Card className="smart-card" variant="borderless">
                                <Form layout="vertical">
                                    <Title level={5} style={{ color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <ThunderboltOutlined /> 核心运动学指标 (Dynamics)
                                    </Title>
                                    <Row gutter={12}>
                                        <Col span={6}><Form.Item label="最大线速度"><InputNumber style={{ width: '100%' }} value={identity.maxSpeed} suffix="mm/s" onChange={v => handleUpdate({ maxSpeed: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="最大线加速度"><InputNumber style={{ width: '100%' }} value={identity.maxAccel} suffix="mm/s²" onChange={v => handleUpdate({ maxAccel: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="最大线减速度"><InputNumber style={{ width: '100%' }} value={identity.maxDecel} suffix="mm/s²" onChange={v => handleUpdate({ maxDecel: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="避障最大减速度"><InputNumber style={{ width: '100%' }} value={identity.avoidMaxDec} suffix="mm/s²" onChange={v => handleUpdate({ avoidMaxDec: v as number })} /></Form.Item></Col>
                                    </Row>

                                    <Divider orientation="left" plain>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Text strong style={{ color: 'var(--accent)' }}>满载性能 (Full Load)</Text>
                                            <Switch size="small" checkedChildren="同步" unCheckedChildren="独立" checked={syncFullLoad} onChange={setSyncFullLoad} />
                                        </div>
                                    </Divider>
                                    
                                    <Row gutter={12}>
                                        <Col span={6}><Form.Item label="最大线速度"><InputNumber style={{ width: '100%' }} disabled={syncFullLoad} value={syncFullLoad ? Math.round(identity.maxSpeed * 0.8) : identity.maxSpeedFull} suffix="mm/s" onChange={v => !syncFullLoad && handleUpdate({ maxSpeedFull: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="最大线加速度"><InputNumber style={{ width: '100%' }} disabled={syncFullLoad} value={syncFullLoad ? Math.round(identity.maxAccel * 0.4) : identity.maxAccelFull} suffix="mm/s²" onChange={v => !syncFullLoad && handleUpdate({ maxAccelFull: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="最大线减速度"><InputNumber style={{ width: '100%' }} disabled={syncFullLoad} value={syncFullLoad ? Math.round(identity.maxDecel * 0.5) : identity.maxDecelFull} suffix="mm/s²" onChange={v => !syncFullLoad && handleUpdate({ maxDecelFull: v as number })} /></Form.Item></Col>
                                        <Col span={6}><Form.Item label="避障减速度"><InputNumber style={{ width: '100%' }} disabled={syncFullLoad} value={syncFullLoad ? identity.avoidMaxDec : identity.avoidMaxDecFull} suffix="mm/s²" onChange={v => !syncFullLoad && handleUpdate({ avoidMaxDecFull: v as number })} /></Form.Item></Col>
                                    </Row>

                                    {chassisComponent && (
                                        <div style={{ marginTop: 24 }}>
                                            <Divider orientation="left" plain><small>底盘本体私有属性 (Official CModel Registry)</small></Divider>
                                            <ComponentPropertyPanel 
                                                component={chassisComponent}
                                                onAttributeChange={(groupId, attrKey, val, subKey) => {
                                                    updateAttribute(chassisComponent.id, groupId, attrKey, val, subKey);
                                                }}
                                            />
                                        </div>
                                    )}
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        },
        {
            key: 'power',
            label: <span><ThunderboltOutlined /> 2-3. 动力组成</span>,
            children: (
                <div style={{ height: 'calc(100vh - 250px)', marginTop: 16 }}>
                    <PowerSystemStep />
                </div>
            )
        }
    ];

    return (
        <div className="content-grid" style={{ padding: 0 }}>
            <div className="chassis-identity-header" style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px 24px',
                borderRadius: '12px',
                marginBottom: 24,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Space size={32}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ 
                            width: 40, height: 40, borderRadius: 10, 
                            background: 'linear-gradient(135deg, var(--accent) 0%, #1d4ed8 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <IdcardOutlined style={{ fontSize: 20, color: 'white' }} />
                        </div>
                        <div>
                            <Text strong style={{ fontSize: 16, display: 'block' }}>{identity.robotName || '未命名机器人'}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>{DRIVE_TYPE_LABELS[identity.driveType]}</Text>
                        </div>
                    </div>

                    <Space split={<Divider type="vertical" />} size={24}>
                        {renderHeaderField('机器人名称', 'robotName', identity.robotName)}
                        {renderHeaderField('底盘驱动', 'driveType', identity.driveType, true, Object.entries(DRIVE_TYPE_LABELS).map(([k,v]) => ({ label: v, value: k })))}
                        <Space size={4}>
                            <Text type="secondary" style={{ fontSize: 12 }}>外形尺寸:</Text>
                            <Text strong>{identity.chassisLength} × {identity.chassisWidth} × {identity.chassisHeight} mm</Text>
                        </Space>
                    </Space>
                </Space>

                {onExport && (
                    <Tooltip title="导出当前底盘配置为 .cmodel 工业包">
                        <Space className="export-hint" style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={onExport}>
                            <SyncOutlined />
                            <Text strong style={{ color: 'inherit' }}>工业级导出</Text>
                        </Space>
                    </Tooltip>
                )}
            </div>

            <Tabs 
                defaultActiveKey="chassis"
                className="step-tabs"
                items={tabItems}
            />
        </div>
    );
};
