import React from 'react';
import { Table, Select, Button, Tag, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import type { IOConfig, LogicBind } from '../store/types';

const { Title, Text } = Typography;

const LOGIC_BINDS: LogicBind[] = [
    'SAFETY_IO_EMC_STOP', 'BUMPER_FRONT', 'BUMPER_REAR',
    'MANUAL_OVERRIDE', 'LED_STATUS_RED', 'LED_STATUS_GREEN',
    'BUZZER', 'CHARGE_DETECT', 'DOOR_SENSOR',
];

const IO_PORTS = [
    'DI_01', 'DI_02', 'DI_03', 'DI_04', 'DI_05', 'DI_06', 'DI_07', 'DI_08',
    'DO_01', 'DO_02', 'DO_03', 'DO_04', 'DO_05', 'DO_06', 'DO_07', 'DO_08',
];

export const IOForm: React.FC = () => {
    const { config, addIO, removeIO } = useProjectStore();
    const { ioPorts, ioBoards } = config;

    const boardOptions = [
        { value: 'direct', label: 'MCU 直连' },
        ...ioBoards.map(b => ({ value: b.id, label: b.label })),
    ];

    const columns = [
        { title: '物理端口', dataIndex: 'port', key: 'port', render: (v: string) => <Tag>{v}</Tag> },
        {
            title: '逻辑绑定', dataIndex: 'logicBind', key: 'logicBind',
            render: (_: unknown, r: IOConfig) => (
                <Select value={r.logicBind} size="small" style={{ width: 220 }}
                    onChange={(_v) => { }}
                    options={LOGIC_BINDS.map(b => ({ value: b, label: b }))} />
            )
        },
        {
            title: 'IO 板归属', dataIndex: 'ioBoardId', key: 'board',
            render: (_: unknown, r: IOConfig) => (
                <Select value={r.ioBoardId} size="small" style={{ width: 160 }}
                    onChange={(_v) => { }}
                    options={boardOptions} />
            )
        },
        {
            title: '操作', key: 'action',
            render: (_: unknown, r: IOConfig) => (
                <Button danger size="small" icon={<DeleteOutlined />} onClick={() => removeIO(r.id)} />
            )
        }
    ];

    const handleAdd = () => {
        addIO({
            port: IO_PORTS.find(p => !ioPorts.some(io => io.port === p)) ?? 'DI_01',
            logicBind: 'BUMPER_FRONT',
            ioBoardId: 'direct',
        });
    };

    return (
        <div style={{ padding: 32, maxWidth: 900 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>🔌 IO 映射配置</Title>
                    <Text type="secondary">将物理 IO 端口绑定到逻辑功能，并指定所属 IO 扩展板。</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>+ 添加 IO 映射</Button>
            </div>
            <Table dataSource={ioPorts} columns={columns} rowKey="id" pagination={false} size="small"
                style={{ background: '#141414' }}
            />
        </div>
    );
};
