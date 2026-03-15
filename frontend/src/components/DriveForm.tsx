import React, { useState } from 'react';
import {
    Card, Form, InputNumber, Select, Typography, Divider,
    Row, Col, Tabs, Tag, Segmented, Space
} from 'antd';
import { useProjectStore } from '../store/useProjectStore';
import { DRIVER_MODELS } from '../store/types';
import type { WheelConfig } from '../store/types';

const { Title, Text } = Typography;

const CAN_BUS_OPTIONS = [] as { value: string; label: string }[];
void CAN_BUS_OPTIONS; // suppress -- driven by mcu.canBuses dropdown

interface WheelCardProps {
    wheel: WheelConfig;
    canBuses: string[];
}

const WheelCard: React.FC<WheelCardProps> = ({ wheel, canBuses }) => {
    const { updateWheel } = useProjectStore();
    const upd = (data: Partial<WheelConfig>) => updateWheel(wheel.id, data);

    const isSteer = wheel.type !== 'STANDARD_DIFF';

    const [viewMode, setViewMode] = useState<'IDLE' | 'FULL'>('IDLE');

    const tabItems = [
        {
            key: 'struct',
            label: '🔩 安装位置',
            children: (
                <div>
                    <Row gutter={16}>
                        <Col span={6}><Form.Item label="位置 X (mm)" tooltip="+前 -后"><InputNumber value={wheel.mountX} onChange={v => upd({ mountX: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="位置 Y (mm)" tooltip="+左 -右"><InputNumber value={wheel.mountY} onChange={v => upd({ mountY: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="位置 Z (mm)" tooltip="高度"><InputNumber value={wheel.mountZ} onChange={v => upd({ mountZ: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="安装偏航角 (°)"><InputNumber value={wheel.mountYaw} onChange={v => upd({ mountYaw: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ marginRight: 12, fontSize: 13, color: '#aaa' }}>边界偏移</span>
                        <Segmented size="small" value={viewMode} onChange={setViewMode as any} options={[{ value: 'IDLE', label: '🪶 空载 (Idle)' }, { value: 'FULL', label: '📦 满载 (Full Load)' }]} />
                    </div>
                    {viewMode === 'IDLE' ? (
                        <Row gutter={16}>
                            <Col span={12}><Form.Item label="前端 Head (mm)"><InputNumber value={wheel.headOffsetIdle} onChange={v => upd({ headOffsetIdle: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="后端 Tail (mm)"><InputNumber value={wheel.tailOffsetIdle} onChange={v => upd({ tailOffsetIdle: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="左侧 Left (mm)"><InputNumber value={wheel.leftOffsetIdle} onChange={v => upd({ leftOffsetIdle: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="右侧 Right (mm)"><InputNumber value={wheel.rightOffsetIdle} onChange={v => upd({ rightOffsetIdle: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        </Row>
                    ) : (
                        <Row gutter={16}>
                            <Col span={12}><Form.Item label="前端 Head (mm)"><InputNumber value={wheel.headOffsetFull} onChange={v => upd({ headOffsetFull: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="后端 Tail (mm)"><InputNumber value={wheel.tailOffsetFull} onChange={v => upd({ tailOffsetFull: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="左侧 Left (mm)"><InputNumber value={wheel.leftOffsetFull} onChange={v => upd({ leftOffsetFull: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="右侧 Right (mm)"><InputNumber value={wheel.rightOffsetFull} onChange={v => upd({ rightOffsetFull: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        </Row>
                    )}
                </div>
            )
        },
        {
            key: 'elec',
            label: '⚡ 电气接线',
            children: (
                <div>
                    {(wheel.components || []).map((comp, idx) => (
                        <div key={idx} style={{ background: '#1a1a1a', padding: '12px 16px', borderRadius: 8, marginBottom: 8, border: '1px solid #333' }}>
                            <div style={{ marginBottom: 8 }}>
                                <Tag color={comp.role.includes('ENCODER') ? 'orange' : 'blue'}>
                                    {comp.role === 'DRIVE_DRIVER' ? '行走驱动器' : comp.role === 'STEER_DRIVER' ? '转向驱动器' : '转向编码器'}
                                </Tag>
                                <span style={{ fontSize: 12, color: '#888' }}>{comp.role}</span>
                            </div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="型号" style={{ marginBottom: 8 }}>
                                        <Select size="small" value={comp.driverModel} 
                                            onChange={v => {
                                                const newComps = [...wheel.components];
                                                newComps[idx] = { ...comp, driverModel: v };
                                                upd({ components: newComps });
                                            }} 
                                            options={DRIVER_MODELS.map(m => ({ value: m, label: m }))} 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="CAN 总线" style={{ marginBottom: 8 }}>
                                        <Select size="small" value={comp.canBus} 
                                            onChange={v => {
                                                const newComps = [...wheel.components];
                                                newComps[idx] = { ...comp, canBus: v };
                                                upd({ components: newComps });
                                            }} 
                                            options={canBuses.map(b => ({ value: b, label: b }))} 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Node ID" style={{ marginBottom: 8 }}>
                                        <InputNumber size="small" value={comp.canNodeId} min={1} max={126}
                                            onChange={v => {
                                                const newComps = [...wheel.components];
                                                newComps[idx] = { ...comp, canNodeId: v ?? 1 };
                                                upd({ components: newComps });
                                            }} 
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                            <Divider style={{ margin: '8px 0', borderStyle: 'dashed' }} />
                            
                            <Row gutter={12}>
                                <Col span={6}>
                                    <Form.Item label="额定电压 (V)" style={{ marginBottom: 4 }}>
                                        <InputNumber size="small" value={comp.ratedVoltage} onChange={v => {
                                            const newComps = [...wheel.components];
                                            newComps[idx] = { ...comp, ratedVoltage: v ?? 0 };
                                            upd({ components: newComps });
                                        }} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="额定电流 (A)" style={{ marginBottom: 4 }}>
                                        <InputNumber size="small" value={comp.ratedCurrent} onChange={v => {
                                            const newComps = [...wheel.components];
                                            newComps[idx] = { ...comp, ratedCurrent: v ?? 0 };
                                            upd({ components: newComps });
                                        }} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="额定转速 (RPM)" style={{ marginBottom: 4 }}>
                                        <InputNumber size="small" value={comp.ratedSpeed} onChange={v => {
                                            const newComps = [...wheel.components];
                                            newComps[idx] = { ...comp, ratedSpeed: v ?? 0 };
                                            upd({ components: newComps });
                                        }} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="减速比" style={{ marginBottom: 4 }}>
                                        <InputNumber size="small" value={comp.gearRatio} onChange={v => {
                                            const newComps = [...wheel.components];
                                            newComps[idx] = { ...comp, gearRatio: v ?? 1 };
                                            upd({ components: newComps });
                                        }} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="编码器类型" style={{ marginBottom: 0 }}>
                                        <Select size="small" value={comp.encoderType} 
                                            onChange={v => {
                                                const newComps = [...wheel.components];
                                                newComps[idx] = { ...comp, encoderType: v };
                                                upd({ components: newComps });
                                            }}
                                            options={[
                                                { value: 'NONE', label: '无 (None)' },
                                                { value: 'INCREMENTAL', label: '增量式 (Incremental)' },
                                                { value: 'ABSOLUTE', label: '绝对值 (Absolute)' },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={comp.encoderType === 'ABSOLUTE' ? '分辨率 (Bits)' : '线数 (Lines)'} style={{ marginBottom: 0 }}>
                                        <InputNumber size="small" value={comp.encoderResolution} 
                                            disabled={comp.encoderType === 'NONE'}
                                            onChange={v => {
                                                const newComps = [...wheel.components];
                                                newComps[idx] = { ...comp, encoderResolution: v ?? 0 };
                                                upd({ components: newComps });
                                            }} 
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    ))}
                    {!wheel.components?.length && <div style={{ color: '#555', textAlign: 'center', padding: 12 }}>无电气组件配置</div>}
                </div>
            )
        },
        {
            key: 'kine',
            label: '🚀 运动参数',
            children: (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ marginRight: 12, fontSize: 13, color: '#aaa' }}>速度极限</span>
                        <Segmented size="small" value={viewMode} onChange={setViewMode as any} options={[{ value: 'IDLE', label: '🪶 空载 (Idle)' }, { value: 'FULL', label: '📦 满载 (Full Load)' }]} />
                    </div>
                    {viewMode === 'IDLE' ? (
                        <Row gutter={16}>
                            <Col span={8}><Form.Item label="速度 (mm/s)"><InputNumber value={wheel.maxVelocityIdle} onChange={v => upd({ maxVelocityIdle: v ?? 0 })} min={0.1} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={8}><Form.Item label="加速度 (mm/s²)"><InputNumber value={wheel.maxAccIdle} onChange={v => upd({ maxAccIdle: v ?? 0 })} min={0.1} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={8}><Form.Item label="减速度 (mm/s²)"><InputNumber value={wheel.maxDecIdle} onChange={v => upd({ maxDecIdle: v ?? 0 })} min={0.1} style={{ width: '100%' }} /></Form.Item></Col>
                        </Row>
                    ) : (
                        <Row gutter={16}>
                            <Col span={8}><Form.Item label="速度 (mm/s)"><InputNumber value={wheel.maxVelocityFull} onChange={v => upd({ maxVelocityFull: v ?? 0 })} min={0.1} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={8}><Form.Item label="加速度 (mm/s²)"><InputNumber value={wheel.maxAccFull} onChange={v => upd({ maxAccFull: v ?? 0 })} min={0.1} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={8}><Form.Item label="减速度 (mm/s²)"><InputNumber value={wheel.maxDecFull} onChange={v => upd({ maxDecFull: v ?? 0 })} min={0.1} style={{ width: '100%' }} /></Form.Item></Col>
                        </Row>
                    )}

                    <Divider style={{ margin: '12px 0' }} />
                    <Row gutter={16}>
                        <Col span={12}><Form.Item label="轮径 Diameter (mm)"><InputNumber value={wheel.diameter} onChange={v => upd({ diameter: v ?? 200 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={12}><Form.Item label="轮间距 Track (mm)"><InputNumber value={wheel.track} onChange={v => upd({ track: v ?? 650 })} style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    {isSteer && (
                        <>
                            <Divider style={{ margin: '12px 0' }} />
                            <Row gutter={16}>
                                <Col span={8}><Form.Item label="舵轮零位"><InputNumber value={wheel.zeroPos} onChange={v => upd({ zeroPos: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                                <Col span={8}><Form.Item label="左限位 (°)"><InputNumber value={wheel.leftLimit} onChange={v => upd({ leftLimit: v ?? -90 })} style={{ width: '100%' }} /></Form.Item></Col>
                                <Col span={8}><Form.Item label="右限位 (°)"><InputNumber value={wheel.rightLimit} onChange={v => upd({ rightLimit: v ?? 90 })} style={{ width: '100%' }} /></Form.Item></Col>
                            </Row>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <Card
            style={{ marginBottom: 16, background: '#141414', borderColor: '#333' }}
            title={
                <Space>
                    <span style={{ fontWeight: 700 }}>{wheel.label}</span>
                    <Tag color="purple" style={{ fontSize: 10 }}>{wheel.type}</Tag>
                    <Tag color="orange" style={{ fontSize: 10 }}>{wheel.orientation}</Tag>
                    {(wheel.components || []).map(c => (
                        <Tag key={c.role} color="cyan" style={{ fontSize: 10 }}>{c.canBus} ID:{c.canNodeId}</Tag>
                    ))}
                </Space>
            }
            size="small"
        >
            <Form layout="vertical" size="small">
                <Tabs items={tabItems} size="small" />
            </Form>
        </Card>
    );
};

export const DriveForm: React.FC = () => {
    const { config } = useProjectStore();
    const { wheels, mcu } = config;

    return (
        <div style={{ padding: 32, maxWidth: 900 }}>
            <Title level={2}>⚙️ 轮组驱动模块</Title>
            <Text type="secondary">为每组驱动模块配置安装位置、电气连接和运动学极限参数。</Text>
            <Divider />
            {wheels.map(w => <WheelCard key={w.id} wheel={w} canBuses={mcu.canBuses} />)}
        </div>
    );
};
