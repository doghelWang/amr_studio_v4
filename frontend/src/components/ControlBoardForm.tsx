import React, { useState } from 'react';
import {
    Card, Form, Select, Tag, Button, Table, Modal,
    InputNumber, Typography, Divider
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import { MCU_MODELS, IO_BOARD_MODELS } from '../store/types';
import type { IoBoardConfig } from '../store/types';

const { Title } = Typography;

export const ControlBoardForm: React.FC = () => {
    const { config, setMcu, addIoBoard, removeIoBoard } = useProjectStore();
    const { mcu, ioBoards } = config;
    const [modalOpen, setModalOpen] = useState(false);
    const [draft, setDraft] = useState({ model: 'STANDARD_IO_16CH', canBus: mcu.canBuses[0] ?? 'CAN0', canNodeId: 10 });

    const upd = (k: string, v: any) => setDraft(p => ({ ...p, [k]: v }));

    const handleAdd = () => {
        addIoBoard({ ...draft, channelCount: IO_BOARD_MODELS[draft.model] ?? 16 });
        setModalOpen(false);
    };

    const columns = [
        { title: '标签', dataIndex: 'label', key: 'label', render: (v: string) => <Tag color="purple">{v}</Tag> },
        { title: '型号', dataIndex: 'model', key: 'model' },
        { title: 'CAN 总线', dataIndex: 'canBus', key: 'canBus', render: (v: string) => <Tag color="orange">{v}</Tag> },
        { title: '节点 ID', dataIndex: 'canNodeId', key: 'canNodeId' },
        { title: '通道数', dataIndex: 'channelCount', key: 'ch' },
        {
            title: '操作', key: 'action',
            render: (_: unknown, r: IoBoardConfig) => (
                <Button danger size="small" icon={<DeleteOutlined />} onClick={() => removeIoBoard(r.id)} />
            )
        }
    ];

    return (
        <div style={{ padding: 32, maxWidth: 900 }}>
            <Title level={2}>⬡ 控制板配置</Title>
            <Divider />

            <Card title="主控制单元 (MCU)" bordered={false} style={{ background: '#141414', borderColor: '#333', marginBottom: 24 }}>
                <Form layout="inline">
                    <Form.Item label="MCU 型号">
                        <Select value={mcu.model} onChange={v => setMcu({ model: v })}
                            options={MCU_MODELS.map(m => ({ value: m, label: m }))} style={{ width: 220 }} />
                    </Form.Item>
                    <Form.Item label="可用 CAN 总线">
                        <Select mode="multiple" value={mcu.canBuses}
                            onChange={v => setMcu({ canBuses: v })}
                            options={['CAN0', 'CAN1', 'CAN2', 'CAN3'].map(b => ({ value: b, label: b }))}
                            style={{ minWidth: 220 }} />
                    </Form.Item>
                    <Form.Item label="可用以太网口">
                        <Select mode="multiple" value={mcu.ethPorts}
                            onChange={v => setMcu({ ethPorts: v })}
                            options={['ETH0', 'ETH1', 'ETH2'].map(p => ({ value: p, label: p }))}
                            style={{ minWidth: 160 }} />
                    </Form.Item>
                </Form>
                <div style={{ marginTop: 12 }}>
                    总线资源: {mcu.canBuses.map(b => <Tag key={b} color="orange">{b}</Tag>)}
                    {mcu.ethPorts.map(p => <Tag key={p} color="blue">{p}</Tag>)}
                </div>
            </Card>

            <Card
                title="IO 扩展板"
                extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>+ 添加 IO 板</Button>}
                bordered={false} style={{ background: '#141414', borderColor: '#333' }}
            >
                <Table dataSource={ioBoards} columns={columns} rowKey="id" pagination={false} size="small" />
            </Card>

            <Modal title="添加 IO 扩展板" open={modalOpen} onOk={handleAdd} onCancel={() => setModalOpen(false)} okText="确定">
                <Form layout="vertical">
                    <Form.Item label="IO 板型号">
                        <Select value={draft.model} onChange={v => upd('model', v)}
                            options={Object.keys(IO_BOARD_MODELS).map(m => ({ value: m, label: `${m} (${IO_BOARD_MODELS[m]} CH)` }))} />
                    </Form.Item>
                    <Form.Item label="接入 CAN 总线">
                        <Select value={draft.canBus} onChange={v => upd('canBus', v)}
                            options={mcu.canBuses.map(b => ({ value: b, label: b }))} />
                    </Form.Item>
                    <Form.Item label="CAN 节点 ID">
                        <InputNumber value={draft.canNodeId} onChange={v => upd('canNodeId', v)} min={1} max={126} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
