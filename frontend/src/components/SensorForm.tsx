import React, { useState } from 'react';
import {
    Button, Table, Tag, Modal, Tabs, Form, Select,
    InputNumber, Input, Typography, Space
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import { SENSOR_MODELS } from '../store/types';
import type { SensorConfig, SensorType, ConnectionType } from '../store/types';

const { Title, Text } = Typography;

const SENSOR_TYPE_LABELS: Record<SensorType, string> = {
    LASER_2D: '2D LiDAR (激光)',
    LASER_3D: '3D LiDAR (激光)',
    BARCODE: '读码器',
    CAMERA_BINOCULAR: '双目相机',
    IMU: 'IMU',
};

const CONN_TYPE_COLORS: Record<ConnectionType, string> = {
    ETHERNET: 'blue', USB: 'green', RS232: 'purple', SPI: 'cyan', CAN: 'orange'
};

const BAUD_RATES = [9600, 19200, 57600, 115200, 230400, 460800];

const DEFAULT_SENSOR: Omit<SensorConfig, 'id' | 'label'> = {
    type: 'LASER_2D', model: 'SICK_TIM561',
    mountX: 500, mountY: 0, mountZ: 200,
    mountYaw: 0, mountPitch: 0, mountRoll: 0,
    usageNavi: true, usageObs: true,
    connType: 'ETHERNET', ipAddress: '', port: 2112, ethPort: 'ETH0',
    baudRate: 115200, serialPort: '',
};

export const SensorForm: React.FC = () => {
    const { config, addSensor, removeSensor, updateSensor } = useProjectStore();
    const { sensors, mcu } = config;

    const [modalOpen, setModalOpen] = useState(false);
    const [draft, setDraft] = useState<Omit<SensorConfig, 'id' | 'label'>>(DEFAULT_SENSOR);
    const [editId, setEditId] = useState<string | null>(null);

    const openAdd = () => {
        setDraft(DEFAULT_SENSOR);
        setEditId(null);
        setModalOpen(true);
    };

    const openEdit = (s: SensorConfig) => {
        const { id, label, ...rest } = s;
        setDraft(rest);
        setEditId(id);
        setModalOpen(true);
    };

    const handleOk = () => {
        if (editId) {
            updateSensor(editId, draft);
        } else {
            addSensor(draft);
        }
        setModalOpen(false);
    };

    const upd = (data: Partial<typeof draft>) => setDraft(prev => ({ ...prev, ...data }));

    const tabItems = [
        {
            key: 'type',
            label: '📦 型号选择',
            children: (
                <Form layout="vertical">
                    <Form.Item label="传感器类型">
                        <Select value={draft.type} onChange={v => upd({ type: v, model: SENSOR_MODELS[v][0] })}
                            options={Object.entries(SENSOR_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
                    </Form.Item>
                    <Form.Item label="硬件型号">
                        <Select value={draft.model} onChange={v => upd({ model: v })}
                            options={(SENSOR_MODELS[draft.type] ?? []).map(m => ({ value: m, label: m }))} />
                    </Form.Item>
                    <Form.Item label="用途声明">
                        <Space>
                            <Tag color={draft.usageNavi ? 'cyan' : 'default'} style={{ cursor: 'pointer' }}
                                onClick={() => upd({ usageNavi: !draft.usageNavi })}>
                                {draft.usageNavi ? '✅' : '○'} 导航
                            </Tag>
                            <Tag color={draft.usageObs ? 'orange' : 'default'} style={{ cursor: 'pointer' }}
                                onClick={() => upd({ usageObs: !draft.usageObs })}>
                                {draft.usageObs ? '✅' : '○'} 避障
                            </Tag>
                        </Space>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: 'pose',
            label: '📐 安装位姿',
            children: (
                <Form layout="vertical">
                    <Form.Item label="安装坐标 X / Y / Z (mm)">
                        <Space>
                            <InputNumber value={draft.mountX} onChange={v => upd({ mountX: v ?? 0 })} placeholder="X(前+)" />
                            <InputNumber value={draft.mountY} onChange={v => upd({ mountY: v ?? 0 })} placeholder="Y(左+)" />
                            <InputNumber value={draft.mountZ} onChange={v => upd({ mountZ: v ?? 0 })} placeholder="Z(上+)" />
                        </Space>
                    </Form.Item>
                    <Form.Item label="安装姿态 Yaw / Pitch / Roll (°)">
                        <Space>
                            <InputNumber value={draft.mountYaw} onChange={v => upd({ mountYaw: v ?? 0 })} placeholder="Yaw" />
                            <InputNumber value={draft.mountPitch} onChange={v => upd({ mountPitch: v ?? 0 })} placeholder="Pitch" />
                            <InputNumber value={draft.mountRoll} onChange={v => upd({ mountRoll: v ?? 0 })} placeholder="Roll" />
                        </Space>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: 'elec',
            label: '⚡ 电气接线',
            children: (
                <Form layout="vertical">
                    <Form.Item label="接入方式">
                        <Select value={draft.connType} onChange={v => upd({ connType: v })}
                            options={([
                                { value: 'ETHERNET', label: '🌐 Ethernet (TCP/IP)' },
                                { value: 'USB', label: '🔌 USB' },
                                { value: 'RS232', label: '📡 RS232 串口' },
                            ])} />
                    </Form.Item>
                    {draft.connType === 'ETHERNET' && <>
                        <Form.Item label="IP 地址" required>
                            <Input value={draft.ipAddress} onChange={e => upd({ ipAddress: e.target.value })}
                                status={draft.ipAddress && !/^(\d{1,3}\.){3}\d{1,3}$/.test(draft.ipAddress) ? 'error' : undefined}
                                placeholder="192.168.1.100" style={{ fontFamily: 'monospace' }} />
                        </Form.Item>
                        <Form.Item label="端口号">
                            <InputNumber value={draft.port} onChange={v => upd({ port: v ?? 2112 })} min={1} max={65535} />
                        </Form.Item>
                        <Form.Item label="MCU 网口">
                            <Select value={draft.ethPort} onChange={v => upd({ ethPort: v })}
                                options={['', ...mcu.ethPorts].map(p => ({ value: p, label: p || '未分配' }))} />
                        </Form.Item>
                    </>}
                    {(draft.connType === 'RS232' || draft.connType === 'USB') && <>
                        <Form.Item label="波特率">
                            <Select value={draft.baudRate} onChange={v => upd({ baudRate: v })}
                                options={BAUD_RATES.map(b => ({ value: b, label: String(b) }))} />
                        </Form.Item>
                        <Form.Item label="串口设备">
                            <Input value={draft.serialPort} onChange={e => upd({ serialPort: e.target.value })} placeholder="/dev/ttyUSB0" />
                        </Form.Item>
                    </>}
                </Form>
            )
        }
    ];

    const columns = [
        { title: '类型', dataIndex: 'type', key: 'type', render: (t: SensorType) => SENSOR_TYPE_LABELS[t] ?? t },
        { title: '型号', dataIndex: 'model', key: 'model' },
        {
            title: '接入', dataIndex: 'connType', key: 'conn',
            render: (t: ConnectionType, s: SensorConfig) => (
                <span>
                    <Tag color={CONN_TYPE_COLORS[t]} style={{ marginRight: 4 }}>{t}</Tag>
                    {t === 'ETHERNET' && <code style={{ fontSize: 11, color: '#00d2ff' }}>{s.ipAddress}:{s.port}</code>}
                </span>
            )
        },
        {
            title: '安装位姿 (X/Y/Yaw)', key: 'pose',
            render: (_: unknown, s: SensorConfig) => <span style={{ fontSize: 12 }}>[{s.mountX}, {s.mountY}] {s.mountYaw}°</span>
        },
        {
            title: '用途', key: 'usage',
            render: (_: unknown, s: SensorConfig) => (
                <>
                    {s.usageNavi && <Tag color="cyan">导航</Tag>}
                    {s.usageObs && <Tag color="orange">避障</Tag>}
                </>
            )
        },
        {
            title: '操作', key: 'action',
            render: (_: unknown, s: SensorConfig) => (
                <Space>
                    <Button size="small" onClick={() => openEdit(s)}>编辑</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeSensor(s.id)} />
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>⚙️ 传感导航避障模块</Title>
                    <Text type="secondary">添加激光雷达、读码器、双目相机、IMU，并配置安装位姿和电气连接。</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>+ 添加传感器节点</Button>
            </div>

            <Table dataSource={sensors} columns={columns} rowKey="id" pagination={false} size="small"
                style={{ background: '#141414' }} />

            <Modal title={editId ? '编辑传感器' : '添加传感器节点'} open={modalOpen}
                onOk={handleOk} onCancel={() => setModalOpen(false)} width={580} okText="确定">
                <Tabs items={tabItems} />
            </Modal>
        </div>
    );
};
