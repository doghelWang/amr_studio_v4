import React, { useState } from 'react';
import {
    Card, Form, InputNumber, Select, Typography, Divider,
    Row, Col, Tabs, Tag, Space, Empty, Alert, Button, Modal, Input, App as AntdApp
} from 'antd';
import { PlusOutlined, SaveOutlined, EditOutlined, ProjectOutlined } from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import { DRIVER_MODELS, SENSOR_MODELS } from '../store/types';
import type { WheelConfig, WheelComponent, SensorConfig } from '../store/types';

const { Title, Text } = Typography;

// --- Quick DI Sensor Add Modal ---
const QuickSensorModal: React.FC<{
    open: boolean;
    onClose: () => void;
    referencePose: { x: number; y: number; z: number; yaw: number };
    onAdded: (id: string) => void;
}> = ({ open, onClose, referencePose, onAdded }) => {
    const { message } = AntdApp.useApp();
    const { addSensor } = useProjectStore();
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields().then(values => {
            const newSensor: Omit<SensorConfig, 'id'> = {
                label: values.label,
                type: 'IMU', 
                model: values.model,
                mountX: referencePose.x,
                mountY: referencePose.y,
                mountZ: referencePose.z,
                mountYaw: referencePose.yaw,
                mountPitch: 0,
                mountRoll: 0,
                usageNavi: false,
                usageObs: false,
                connType: 'CAN',
                ipAddress: '',
                port: 0,
                ethPort: '',
                baudRate: 115200,
                serialPort: ''
            };
            addSensor(newSensor as any);
            message.success(`传感器 ${values.label} 已添加并继承坐标`);
            onClose();
            form.resetFields();
        });
    };

    return (
        <Modal title="快速添加转向零位/限位器 (DI类型)" open={open} onOk={handleOk} onCancel={onClose} okText="创建并继承坐标">
            <Alert 
                message="空间位置继承" 
                description={`该传感器将自动继承所在轮组的安装坐标: [X:${referencePose.x}, Y:${referencePose.y}, Z:${referencePose.z}]`}
                type="success" 
                showIcon 
                style={{ marginBottom: 16 }}
            />
            <Form form={form} layout="vertical">
                <Form.Item name="label" label="实例名称" rules={[{ required: true }]}>
                    <Input placeholder="例如: left_wheel_zero_sw" prefix={<EditOutlined />} />
                </Form.Item>
                <Form.Item name="model" label="硬件型号" rules={[{ required: true }]}>
                    <Select options={[
                        { value: 'PROXIMITY_V1', label: '电感式接近开关' },
                        { value: 'PHOTOELECTRIC_V1', label: '光电限位开关' },
                        { value: 'MECHANICAL_V1', label: '机械式行程开关' }
                    ]} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

interface WheelCardProps {
    wheel: WheelConfig;
    canBuses: string[];
    availableSensors: { id: string; label: string }[];
}

const ComponentEditor: React.FC<{
    comp: WheelComponent;
    idx: number;
    wheelId: string;
    canBuses: string[];
}> = ({ comp, idx, wheelId, canBuses }) => {
    const { updateWheel, config } = useProjectStore();
    const updComp = (data: Partial<WheelComponent>) => {
        const wheel = config.wheels.find(w => w.id === wheelId);
        if (!wheel) return;
        const newComps = [...wheel.components];
        newComps[idx] = { ...comp, ...data };
        updateWheel(wheelId, { components: newComps });
    };

    return (
        <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: 8, marginBottom: 12, border: '1px solid #333' }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                    <Input 
                        size="small" 
                        value={comp.role} 
                        onChange={e => updComp({ role: e.target.value as any })}
                        style={{ width: 140, background: '#222', border: 'none', color: '#1677ff', fontWeight: 'bold' }}
                    />
                    <Tag color={comp.role.includes('STEER') ? 'orange' : 'blue'}>驱动实例</Tag>
                </Space>
                <Text type="secondary" style={{ fontSize: 12 }}>UUID: {idx}-{wheelId.slice(0,4)}</Text>
            </div>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="硬件型号">
                        <Select size="small" value={comp.driverModel} 
                            onChange={v => updComp({ driverModel: v })} 
                            options={DRIVER_MODELS.map(m => ({ value: m, label: m }))} 
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="CAN总线">
                        <Select size="small" value={comp.canBus} 
                            onChange={v => updComp({ canBus: v })} 
                            options={canBuses.map(b => ({ value: b, label: b }))} 
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Node ID">
                        <InputNumber size="small" value={comp.canNodeId} min={1} max={127}
                            onChange={v => updComp({ canNodeId: v ?? 1 })} 
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Divider style={{ margin: '12px 0', borderStyle: 'dashed', borderColor: '#444' }} />
            <Row gutter={12}>
                <Col span={6}><Form.Item label="电压 (V)"><InputNumber size="small" value={comp.ratedVoltage} onChange={v => updComp({ ratedVoltage: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                <Col span={6}><Form.Item label="转速 (RPM)"><InputNumber size="small" value={comp.ratedSpeed} onChange={v => updComp({ ratedSpeed: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                <Col span={6}><Form.Item label="减速比"><InputNumber size="small" value={comp.gearRatio} onChange={v => updComp({ gearRatio: v ?? 1 })} style={{ width: '100%' }} /></Form.Item></Col>
                <Col span={6}><Form.Item label="抱闸"><Select size="small" value={comp.hasBrake ? 'YES' : 'NO'} onChange={v => updComp({ hasBrake: v === 'YES' })} options={[{value:'YES', label:'有'}, {value:'NO', label:'无'}]} style={{ width: '100%' }} /></Form.Item></Col>
            </Row>
        </div>
    );
};

const WheelCard: React.FC<WheelCardProps> = ({ wheel, canBuses, availableSensors }) => {
    const { updateWheel } = useProjectStore();
    const [viewMode, setViewMode] = useState<'IDLE' | 'FULL'>('IDLE');
    const [quickAddOpen, setQuickAddOpen] = useState(false);

    const upd = (data: Partial<WheelConfig>) => updateWheel(wheel.id, data);
    const isSteerCapable = wheel.type !== 'STANDARD_DIFF';

    const items = [
        {
            key: '1',
            label: '📐 几何安装',
            children: (
                <div style={{ padding: '8px 4px' }}>
                    <Row gutter={16}>
                        <Col span={6}><Form.Item label="安装X (mm)"><InputNumber value={wheel.mountX} onChange={v => upd({ mountX: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="安装Y (mm)"><InputNumber value={wheel.mountY} onChange={v => upd({ mountY: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="安装Z (mm)"><InputNumber value={wheel.mountZ} onChange={v => upd({ mountZ: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="偏航角 (°)"><InputNumber value={wheel.mountYaw} onChange={v => upd({ mountYaw: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                </div>
            )
        },
        {
            key: '2',
            label: '⚡ 驱动实例',
            children: (
                <div style={{ padding: '8px 0' }}>
                    {wheel.components?.map((c, i) => (
                        <ComponentEditor key={i} comp={c} idx={i} wheelId={wheel.id} canBuses={canBuses} />
                    ))}
                </div>
            )
        },
        {
            key: 'calibration',
            label: '🎯 转向标定',
            disabled: !isSteerCapable,
            children: (
                <div style={{ padding: '8px 4px' }}>
                    <Row gutter={16}>
                        <Col span={8}><Form.Item label="零位角度 (°)"><InputNumber value={wheel.zeroPos} onChange={v => upd({ zeroPos: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="正限位角度 (°)"><InputNumber value={wheel.rightLimit} onChange={v => upd({ rightLimit: v ?? 90 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="负限位角度 (°)"><InputNumber value={wheel.leftLimit} onChange={v => upd({ leftLimit: v ?? -90 })} style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    <Divider orientation="left" style={{ borderColor: '#333' }}>
                        <Space>
                            <Text type="secondary" style={{ fontSize: 12 }}>传感器关联</Text>
                            <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => setQuickAddOpen(true)}>快捷添加 DI</Button>
                        </Space>
                    </Divider>
                    <Row gutter={16}>
                        <Col span={8}><Form.Item label="零位"><Select placeholder="绑定" value={wheel.relateZeroIo} onChange={v => upd({ relateZeroIo: v })} options={availableSensors.map(s => ({ value: s.id, label: s.label }))} allowClear style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="正限位"><Select placeholder="绑定" value={wheel.relatePosIo} onChange={v => upd({ relatePosIo: v })} options={availableSensors.map(s => ({ value: s.id, label: s.label }))} allowClear style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="负限位"><Select placeholder="绑定" value={wheel.relateNegIo} onChange={v => upd({ relateNegIo: v })} options={availableSensors.map(s => ({ value: s.id, label: s.label }))} allowClear style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    <QuickSensorModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} referencePose={{ x: wheel.mountX, y: wheel.mountY, z: wheel.mountZ, yaw: wheel.mountYaw }} onAdded={() => {}} />
                </div>
            )
        }
    ];

    return (
        <Card 
            size="small"
            style={{ marginBottom: 20, background: '#141414', borderColor: '#333', borderRadius: 12 }}
            title={
                <Space>
                    <Input value={wheel.label} onChange={e => upd({ label: e.target.value })} style={{ width: 180, fontWeight: 800, color: '#1677ff', background: 'transparent', border: 'none' }} />
                    <Tag color="geekblue">{wheel.type}</Tag>
                    {isSteerCapable && !wheel.relateZeroIo && <Tag color="error">未绑定零位</Tag>}
                </Space>
            }
        >
            <Form layout="vertical" size="small">
                <Tabs defaultActiveKey="1" items={items} />
            </Form>
        </Card>
    );
};

export const DriveForm: React.FC = () => {
    const { message } = AntdApp.useApp();
    const { config, meta, setIdentity } = useProjectStore();
    const [saving, setSaving] = useState(false);
    const [saveModalOpen, setSaveProjectModalOpen] = useState(false);
    const [projectName, setProjectName] = useState(meta.projectName || '');

    const handleActualSave = async () => {
        setSaving(true);
        try {
            setIdentity({ robotName: projectName });
            const cleanConfig = JSON.parse(JSON.stringify(config));
            const backendHost = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
            const payload = {
                meta: { ...meta, projectName, modifiedAt: new Date().toISOString() },
                config: cleanConfig,
                formatVersion: '1.0'
            };
            const response = await fetch(`http://${backendHost}:8002/api/v1/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                message.success(`项目「${projectName}」已保存至后端`);
                setSaveProjectModalOpen(false);
            } else {
                message.error('保存失败');
            }
        } catch (e) {
            message.error('网络错误');
        } finally {
            setSaving(false);
        }
    };
    
    const availableSensors = (config.sensors || []).map(s => ({ id: s.id, label: s.label }));

    return (
        <div style={{ padding: '24px 40px', background: '#000', minHeight: '100vh' }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <Title level={2} style={{ color: '#fff', marginBottom: 8 }}>⚙️ 驱动与轮组实例配置</Title>
                    <Text type="secondary">当前项目: <Tag color="blue">{meta.projectName}</Tag></Text>
                </div>
                <Button type="primary" size="large" icon={<SaveOutlined />} onClick={() => {
                    setProjectName(meta.projectName);
                    setSaveProjectModalOpen(true);
                }} style={{ borderRadius: 8 }}>
                    保存项目到后端
                </Button>
            </div>
            <div style={{ maxWidth: 1000 }}>
                {config.wheels.map(w => (
                    <WheelCard key={w.id} wheel={w} canBuses={config.mcu?.canBuses || []} availableSensors={availableSensors} />
                ))}
            </div>
            <Modal 
                title={<span><ProjectOutlined /> 保存工程</span>} 
                open={saveModalOpen} 
                onOk={handleActualSave} 
                confirmLoading={saving}
                onCancel={() => setSaveProjectModalOpen(false)}
                okText="确认保存"
            >
                <div style={{ marginBottom: 16 }}>请输入该 AMR 设计工程的名称，保存后可在“项目列表”中重新加载。</div>
                <Form layout="vertical">
                    <Form.Item label="项目名称" required>
                        <Input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="如: AMR_Q3_V4_Standard" autoFocus />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
