import React, { useState } from 'react';
import {
    Card, Form, Select, Tag, Button, Table, Modal,
    InputNumber, Typography, Divider, Tabs, Row, Col, Space, Empty
} from 'antd';
import { 
    PlusOutlined, DeleteOutlined, InfoCircleOutlined, 
    ControlOutlined, ColumnHeightOutlined, ApartmentOutlined, 
    ThunderboltOutlined, CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import { MCU_MODELS, IO_BOARD_MODELS } from '../store/types';
import type { IoBoardConfig } from '../store/types';

const { Title, Text } = Typography;

export const ControlBoardForm: React.FC = () => {
    const { config, setMcu, addIoBoard, removeIoBoard } = useProjectStore();
    const { mcu, ioBoards } = config;
    const [modalOpen, setModalOpen] = useState(false);
    const [draft, setDraft] = useState({ model: Object.keys(IO_BOARD_MODELS)[0], canBus: mcu.canBuses[0] ?? 'CAN0', canNodeId: 10 });

    const updDraft = (k: string, v: any) => setDraft(p => ({ ...p, [k]: v }));

    const handleAddIo = () => {
        addIoBoard(draft);
        setModalOpen(false);
    };

    const ioColumns = [
        { title: '标签', dataIndex: 'label', key: 'label', render: (v: string) => <Tag color="blue">{v}</Tag> },
        { title: '型号', dataIndex: 'model', key: 'model', render: (v: string) => <Text code>{v}</Text> },
        { title: '接入主控 CAN', dataIndex: 'canBus', key: 'canBus', render: (v: string) => <Tag color="orange">{v}</Tag> },
        { title: '节点 ID', dataIndex: 'canNodeId', key: 'canNodeId' },
        { 
            title: '固定资源', 
            key: 'res',
            render: (_: unknown, r: any) => (
                <Space size={2} wrap>
                    {r.diPorts?.length > 0 && <Tag>DI:{r.diPorts.length}</Tag>}
                    {r.doPorts?.length > 0 && <Tag>DO:{r.doPorts.length}</Tag>}
                    {r.aiPorts?.length > 0 && <Tag>AI:{r.aiPorts.length}</Tag>}
                    {r.canBuses?.length > 1 ? <Tag color="orange">CAN:{r.canBuses.length}</Tag> : (r.canBuses?.length > 0 && <Tag color="orange">CAN</Tag>)}
                </Space>
            )
        },
        {
            title: '操作', key: 'action',
            render: (_: unknown, r: IoBoardConfig) => (
                <Button danger size="small" type="text" icon={<DeleteOutlined />} onClick={() => removeIoBoard(r.id)} />
            )
        }
    ];

    const OnboardDeviceTag = ({ present, label }: { present: boolean, label: string }) => (
        <Tag color={present ? 'success' : 'default'} style={{ opacity: present ? 1 : 0.5 }}>
            {present ? <CheckCircleOutlined /> : <CloseCircleOutlined />} {label}
        </Tag>
    );

    const mcuTabs = [
        {
            key: 'id',
            label: <span><ControlOutlined /> 基础识别</span>,
            children: (
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="软件规格 (Software Spec)" required>
                                <Select 
                                    value={mcu.model} 
                                    onChange={v => setMcu({ model: v })}
                                    options={MCU_MODELS.map(m => ({ value: m, label: m }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="设备别名">
                                <InputNumber style={{ width: '100%' }} value={undefined} disabled placeholder={mcu.alias} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="子系统">
                                <Select value={mcu.subsystem} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="供应商">
                                <Select value={mcu.vendor} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="版本号">
                                <Select value={mcu.version} disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )
        },
        {
            key: 'pose',
            label: <span><ColumnHeightOutlined /> 物理与安装</span>,
            children: (
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={8}><Form.Item label="X坐标 (mm)"><InputNumber value={mcu.mountX} onChange={v => setMcu({ mountX: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Y坐标 (mm)"><InputNumber value={mcu.mountY} onChange={v => setMcu({ mountY: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Z坐标 (mm)"><InputNumber value={mcu.mountZ} onChange={v => setMcu({ mountZ: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    <Divider orientation="left" plain><Text style={{ fontSize: 12, color: '#666' }}>安装位姿与角度</Text></Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="安装方式">
                                <Select 
                                    value={mcu.installType} 
                                    onChange={v => setMcu({ installType: v })}
                                    options={[
                                        { value: 'HORIZONTAL', label: '水平安装 (Horizontal)' },
                                        { value: 'VERTICAL', label: '垂直安装 (Vertical)' }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="主控上表面朝向">
                                <Select 
                                    value={mcu.surfaceOrientation} 
                                    onChange={v => setMcu({ surfaceOrientation: v })}
                                    options={['UP', 'DOWN', 'FRONT', 'BACK', 'LEFT', 'RIGHT'].map(o => ({ value: o, label: o }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="出线方向">
                                <Select 
                                    value={mcu.cableDirection} 
                                    onChange={v => setMcu({ cableDirection: v })}
                                    options={['FRONT', 'BACK', 'LEFT', 'RIGHT'].map(d => ({ value: d, label: d }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}><Form.Item label="翻滚角 (°)"><InputNumber value={mcu.roll} onChange={v => setMcu({ roll: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={4}><Form.Item label="俯仰角 (°)"><InputNumber value={mcu.pitch} onChange={v => setMcu({ pitch: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={4}><Form.Item label="偏航角 (°)"><InputNumber value={mcu.yaw} onChange={v => setMcu({ yaw: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    <Divider orientation="left" plain><Text style={{ fontSize: 12, color: '#666' }}>物理尺寸 (Shape)</Text></Divider>
                    <Row gutter={16}>
                        <Col span={6}><Form.Item label="形状"><Select value={mcu.shape} disabled /></Form.Item></Col>
                        <Col span={6}><Form.Item label="长 (mm)"><InputNumber value={mcu.length} onChange={v => setMcu({ length: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="宽 (mm)"><InputNumber value={mcu.width} onChange={v => setMcu({ width: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={6}><Form.Item label="高 (mm)"><InputNumber value={mcu.height} onChange={v => setMcu({ height: v ?? 0 })} style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                </Form>
            )
        },
        {
            key: 'onboard',
            label: <span><ThunderboltOutlined /> 板载设备状态</span>,
            children: (
                <div style={{ padding: '20px 0' }}>
                    <Card size="small" title="板载模块概览" style={{ background: '#1a1d28', borderColor: '#333' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text>板载陀螺仪 (GYRO-VIR)</Text>
                                <OnboardDeviceTag present={mcu.hasGyro} label="内置" />
                            </div>
                            <Divider style={{ margin: '8px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text>板载上读码相机 (CR-VIR-T)</Text>
                                <OnboardDeviceTag present={mcu.hasTopCamera} label="内置" />
                            </div>
                            <Divider style={{ margin: '8px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text>板载下读码相机 (CR-VIR-D)</Text>
                                <OnboardDeviceTag present={mcu.hasDownCamera} label="内置" />
                            </div>
                        </Space>
                    </Card>
                    <div style={{ marginTop: 16 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            <InfoCircleOutlined /> 板载设备的状态由主控型号及软件规格自动确定。
                        </Text>
                    </div>
                </div>
            )
        },
        {
            key: 'res',
            label: <span><ApartmentOutlined /> 内部资源</span>,
            children: (
                <Form layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card size="small" title="CAN 总线资源" bordered={false} style={{ background: '#1c1f2b' }}>
                                <Space wrap>
                                    {mcu.canBuses.map(p => <Tag key={p} color="orange">{p}</Tag>)}
                                </Space>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card size="small" title="以太网口资源" bordered={false} style={{ background: '#1c1f2b' }}>
                                <Space wrap>
                                    {mcu.ethPorts.map(p => <Tag key={p} color="blue">{p}</Tag>)}
                                </Space>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card size="small" title="串口 (RS232/UART)" bordered={false} style={{ background: '#1c1f2b' }}>
                                <Space wrap>
                                    {mcu.rs232Ports.map(p => <Tag key={p} color="cyan">{p}</Tag>)}
                                </Space>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card size="small" title="RS485 接口" bordered={false} style={{ background: '#1c1f2b' }}>
                                <Space wrap>
                                    {mcu.rs485Ports.map(p => <Tag key={p} color="purple">{p}</Tag>)}
                                </Space>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card size="small" title="扬声器 (Speaker)" bordered={false} style={{ background: '#1c1f2b' }}>
                                <Space wrap>
                                    {mcu.speakerPorts.map(p => <Tag key={p} color="magenta">{p}</Tag>)}
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                    <div style={{ marginTop: 12 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            <InfoCircleOutlined /> 硬件资源由主控型号及软件规格固定，不可增删。
                        </Text>
                    </div>
                </Form>
            )
        }
    ];

    return (
        <div style={{ padding: '24px 32px', maxWidth: 1000 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>核心控制与逻辑单元</Title>
                    <Text type="secondary">配置 AMR 的主控制器及其扩展 IO 拓扑</Text>
                </div>
                <Tag color="cyan" style={{ fontSize: 12, padding: '4px 12px' }}>V4.0 Core</Tag>
            </div>

            <Row gutter={16}>
                <Col span={24}>
                    <Card 
                        title={<span><ControlOutlined /> 主控制单元 (MCU)</span>} 
                        bordered={false} 
                        className="glass-card"
                        style={{ marginBottom: 24 }}
                    >
                        <Tabs 
                            defaultActiveKey="id" 
                            items={mcuTabs} 
                            tabBarStyle={{ marginBottom: 20 }}
                        />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card
                        title={<span><ApartmentOutlined /> IO 扩展板</span>}
                        extra={
                            <Button 
                                type="primary" 
                                size="small" 
                                icon={<PlusOutlined />} 
                                onClick={() => setModalOpen(true)}
                                ghost
                            >
                                添加 IO 扩展
                            </Button>
                        }
                        bordered={false}
                        className="glass-card"
                    >
                        {ioBoards.length > 0 ? (
                            <Table 
                                dataSource={ioBoards} 
                                columns={ioColumns} 
                                rowKey="id" 
                                pagination={false} 
                                size="small" 
                            />
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无扩展 IO 板" />
                        )}
                    </Card>
                </Col>
            </Row>

            <Modal 
                title="添加 IO 扩展板" 
                open={modalOpen} 
                onOk={handleAddIo} 
                onCancel={() => setModalOpen(false)} 
                okText="确认添加"
            >
                <Form layout="vertical">
                    <Form.Item label="扩展板型号" required>
                        <Select 
                            value={draft.model} 
                            onChange={v => updDraft('model', v)}
                            options={Object.keys(IO_BOARD_MODELS).map(m => ({ 
                                value: m, 
                                label: `${m}` 
                            }))} 
                        />
                    </Form.Item>
                    <div style={{ marginBottom: 16 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            <InfoCircleOutlined /> 选择型号后，该板卡的 DI/DO/AI 与 CAN 资源将自动分配。
                        </Text>
                    </div>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="接入主控 CAN 总线" required>
                                <Select 
                                    value={draft.canBus} 
                                    onChange={v => updDraft('canBus', v)}
                                    options={mcu.canBuses.map(b => ({ value: b, label: b }))} 
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="CAN 节点 ID" required>
                                <InputNumber 
                                    value={draft.canNodeId} 
                                    onChange={v => updDraft('canNodeId', v)} 
                                    min={1} max={126} 
                                    style={{ width: '100%' }} 
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};
