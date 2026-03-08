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

    const isSteer = wheel.orientation !== 'FRONT_LEFT' && wheel.orientation !== 'FRONT_RIGHT' && wheel.orientation !== 'REAR_LEFT' && wheel.orientation !== 'REAR_RIGHT';

    const [viewMode, setViewMode] = useState<'IDLE' | 'FULL'>('IDLE');

    const tabItems = [
        {
            key: 'struct',
            label: '🔩 安装位置',
            children: (
                <div>
                    <Row gutter={16}>
                        <Col span={8}><Form.Item label="位置 X (mm)" tooltip="+前 -后"><InputNumber value={wheel.mountX} onChange={v => upd({ mountX: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="位置 Y (mm)" tooltip="+左 -右"><InputNumber value={wheel.mountY} onChange={v => upd({ mountY: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="安装偏航角 (°)"><InputNumber value={wheel.mountYaw} onChange={v => upd({ mountYaw: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ marginRight: 12, fontSize: 13, color: '#aaa' }}>边界偏移</span>
                        <Segmented size="small" value={viewMode} onChange={setViewMode as any} options={[{ value: 'IDLE', label: '🪶 空载 (Idle)' }, { value: 'FULL', label: '📦 满载 (Full Load)' }]} />
                    </div>
                    {viewMode === 'IDLE' ? (
                        <Row gutter={16}>
                            <Col span={12}><Form.Item label="前端偏移 Head (mm)"><InputNumber value={wheel.headOffsetIdle} onChange={v => upd({ headOffsetIdle: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="后端偏移 Tail (mm)"><InputNumber value={wheel.tailOffsetIdle} onChange={v => upd({ tailOffsetIdle: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="左端偏移 Left (mm)"><InputNumber value={wheel.leftOffsetIdle} onChange={v => upd({ leftOffsetIdle: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="右端偏移 Right (mm)"><InputNumber value={wheel.rightOffsetIdle} onChange={v => upd({ rightOffsetIdle: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        </Row>
                    ) : (
                        <Row gutter={16}>
                            <Col span={12}><Form.Item label="前端偏移 Head (mm)"><InputNumber value={wheel.headOffsetFull} onChange={v => upd({ headOffsetFull: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="后端偏移 Tail (mm)"><InputNumber value={wheel.tailOffsetFull} onChange={v => upd({ tailOffsetFull: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="左端偏移 Left (mm)"><InputNumber value={wheel.leftOffsetFull} onChange={v => upd({ leftOffsetFull: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={12}><Form.Item label="右端偏移 Right (mm)"><InputNumber value={wheel.rightOffsetFull} onChange={v => upd({ rightOffsetFull: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        </Row>
                    )}
                </div>
            )
        },
        {
            key: 'elec',
            label: '⚡ 电气接线',
            children: (
                <Row gutter={16}>
                    <Col span={12}><Form.Item label="驱动器型号"><Select value={wheel.driverModel} onChange={v => upd({ driverModel: v })} options={DRIVER_MODELS.map(m => ({ value: m, label: m }))} style={{ width: '100%' }} /></Form.Item></Col>
                    <Col span={12}>
                        <Form.Item label="CAN 总线">
                            <Select value={wheel.canBus} onChange={v => upd({ canBus: v })} options={canBuses.map(b => ({ value: b, label: b }))} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}><Form.Item label="CAN 节点 ID (1-126)"><InputNumber value={wheel.canNodeId} onChange={v => upd({ canNodeId: v ?? 1 })} min={1} max={126} style={{ width: '100%' }} /></Form.Item></Col>
                    <Col span={12}>
                        <Form.Item label="电机方向">
                            <Segmented value={wheel.motorPolarity} onChange={v => upd({ motorPolarity: v as any })} options={[{ label: '正转', value: 'FORWARD' }, { label: '反转', value: 'REVERSE' }]} />
                        </Form.Item>
                    </Col>
                </Row>
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
                            <Col span={8}><Form.Item label="最大速度 (mm/s)"><InputNumber value={wheel.maxVelocityIdle} onChange={v => upd({ maxVelocityIdle: v ?? 0 })} min={1} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={8}><Form.Item label="加速度 (mm/s²)"><InputNumber value={wheel.maxAccIdle} onChange={v => upd({ maxAccIdle: v ?? 0 })} min={1} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={8}><Form.Item label="减速度 (mm/s²)"><InputNumber value={wheel.maxDecIdle} onChange={v => upd({ maxDecIdle: v ?? 0 })} min={1} style={{ width: '100%' }} /></Form.Item></Col>
                        </Row>
                    ) : (
                        <Row gutter={16}>
                            <Col span={8}><Form.Item label="最大速度 (mm/s)"><InputNumber value={wheel.maxVelocityFull} onChange={v => upd({ maxVelocityFull: v ?? 0 })} min={1} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={8}><Form.Item label="加速度 (mm/s²)"><InputNumber value={wheel.maxAccFull} onChange={v => upd({ maxAccFull: v ?? 0 })} min={1} style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={8}><Form.Item label="减速度 (mm/s²)"><InputNumber value={wheel.maxDecFull} onChange={v => upd({ maxDecFull: v ?? 0 })} min={1} style={{ width: '100%' }} /></Form.Item></Col>
                        </Row>
                    )}
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
                    <Tag color="orange" style={{ fontSize: 10 }}>{wheel.orientation}</Tag>
                    <Tag color="blue" style={{ fontSize: 10 }}>{wheel.canBus} · ID{wheel.canNodeId}</Tag>
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
