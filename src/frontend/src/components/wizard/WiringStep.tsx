import React, { useState, useMemo, useCallback } from 'react';
import { Tag, Button, Select, Space, Tooltip, Empty, Typography, Badge, Card, Tabs, Row, Col, Alert, Table, Statistic, message } from 'antd';
import { 
    ApiOutlined, SwapOutlined, 
    LinkOutlined, DisconnectOutlined,
    DeploymentUnitOutlined, ShareAltOutlined,
    CrownOutlined, NodeIndexOutlined,
    BranchesOutlined, ControlOutlined,
    ThunderboltOutlined,
    BulbOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { InterfaceConfig, ComponentConfig } from '../../store/types';
import { buildElectricalConnections, getCompatibleInterfaceTargets, getConnectionMultiplicity, summarizeElectricalConnections } from '../../store/domain/electrical';

const { Text, Title } = Typography;

const COMMUNICATION_TYPES = ['CAN', 'ETH', 'ETHERNET', 'RS485', 'RS232', 'NETWORK'];
const IO_TYPES = ['DI', 'DO', 'AI', 'AO'];

/**
 * 🎨 接线界面辅助组件：总线/IO 类型主题定义
 */
const getBusTheme = (type: string) => {
    const t = type?.toUpperCase() || '';
    if (t.includes('CAN')) return { color: 'var(--warning)', label: 'CAN总线', icon: <ShareAltOutlined /> };
    if (t.includes('ETH') || t.includes('NETWORK')) return { color: '#1890ff', label: '以太网', icon: <DeploymentUnitOutlined /> };
    if (t.includes('485') || t.includes('232') || t.includes('UART')) return { color: '#52c41a', label: '串口线路', icon: <SwapOutlined /> };
    if (t === 'DI') return { color: '#1677ff', label: '数字输入', icon: <ControlOutlined /> };
    if (t === 'DO') return { color: '#52c41a', label: '数字输出', icon: <BulbOutlined /> };
    return { color: 'var(--text-muted)', label: type, icon: <ApiOutlined /> };
};

const kindLabels: Record<string, string> = {
    communication_bus: '通信总线',
    io_signal: 'IO 信号',
    power: '电源/BAT',
    onboard: '板载连接',
    audio_video: '音视频',
    unknown: '未知'
};

// ──────────────────────────────────────────────────────────
// 子组件 A: 高保真总线拓扑面板 (解决 ISS-008 & 级联展示)
// ──────────────────────────────────────────────────────────
const BusTopologyPanel: React.FC<{
    components: ComponentConfig[];
    linkInterface: (sourceUuid: string, sourceIfaceUuid: string, targetIfaceUuid: string | null) => void;
}> = ({ components, linkInterface }) => {
    const masters = components.filter(c => ['MAINCPU', 'INTERGRATEDCONTROLLER', 'CONTROL'].includes(c.category));
    const slaves = components.filter(c => !masters.find(m => m.id === c.id));

    return (
        <div className="bus-schematic-container">
            {masters.length === 0 ? (
                <Empty description="未检测到主控设备，请先在步骤3中添加主控制器" />
            ) : (
                masters.map(master => (
                    <Card 
                        key={master.id} 
                        className="master-board-card"
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Space><CrownOutlined style={{ color: 'gold' }} /> <Text strong>{master.alias}</Text> <Tag color="gold" style={{ fontSize: 9 }}>MASTER</Tag></Space>
                                <Text type="secondary" style={{ fontSize: 10 }}>{master.name}</Text>
                            </div>
                        }
                        variant="borderless"
                        style={{ marginBottom: 32, background: 'var(--bg-hover)', border: '1px solid var(--border-strong)' }}
                    >
                        <div className="ports-grid" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {master.interfaces
                                .filter(iface => COMMUNICATION_TYPES.includes(iface.type?.toUpperCase()))
                                .map(masterPort => {
                                    const theme = getBusTheme(masterPort.type);
                                    const linkedSlaves = components.flatMap(c => 
                                        c.interfaces.filter(i => (i.linkedInterfaceUuid || []).includes(masterPort.interfaceUuid))
                                        .map(i => ({ comp: c, iface: i }))
                                    );

                                    return (
                                        <div key={masterPort.interfaceUuid} className="bus-branch" style={{ position: 'relative', paddingLeft: 20, borderLeft: `2px solid ${theme.color}44` }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                                <div style={{ 
                                                    padding: '4px 12px', background: theme.color, borderRadius: 4, 
                                                    color: 'var(--text-primary)', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 
                                                }}>
                                                    {theme.icon} {masterPort.key} ({masterPort.type})
                                                </div>
                                                <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${theme.color}, transparent)` }} />
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
                                                {linkedSlaves.map(item => {
                                                    // 【ISS-007 增强】级联感知：查找该从站自身下挂的 IO 设备
                                                    const subDevices = components.flatMap(c => 
                                                        c.interfaces.filter(i => (i.linkedInterfaceUuid || []).some(targetUuid => 
                                                            item.comp.interfaces.some(bi => bi.interfaceUuid === targetUuid)
                                                        )).map(i => ({ comp: c, iface: i, boardIface: item.comp.interfaces.find(bi => bi.linkedInterfaceUuid?.includes(i.interfaceUuid)) }))
                                                    );

                                                    return (
                                                        <div key={item.iface.interfaceUuid} style={{ position: 'relative' }}>
                                                            <Card 
                                                                size="small" 
                                                                className="slave-node-card"
                                                                style={{ width: 'auto', minWidth: 180, flex: 1, background: 'var(--bg-card)', border: `1px solid ${theme.color}33`, zIndex: 2 }}
                                                            >
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                                    <Text strong style={{ fontSize: 10 }}>{item.comp.alias}</Text>
                                                                    <Button 
                                                                        type="text" size="small" danger 
                                                                        icon={<DisconnectOutlined style={{ fontSize: 9 }} />} 
                                                                        onClick={() => linkInterface(item.comp.id, item.iface.interfaceUuid, null)}
                                                                    />
                                                                </div>
                                                                <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>端口: {item.iface.key}</div>
                                                                
                                                                {/* 级联 IO 摘要 */}
                                                                {subDevices.length > 0 && (
                                                                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-default)' }}>
                                                                        <div style={{ fontSize: 8, color: 'var(--accent)', marginBottom: 4, fontWeight: 700 }}>
                                                                            <NodeIndexOutlined /> 已下挂 IO ({subDevices.length}):
                                                                        </div>
                                                                        {subDevices.map(sub => (
                                                                            <div key={sub.iface.interfaceUuid} style={{ fontSize: 8, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                                                                <span>• {sub.comp.alias}</span>
                                                                                <span style={{ opacity: 0.6 }}>→ {sub.boardIface?.key}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </Card>
                                                            {/* 级联引导线装饰 */}
                                                            {subDevices.length > 0 && <div style={{ position: 'absolute', bottom: -10, left: '50%', width: 2, height: 8, background: 'var(--accent)', opacity: 0.3 }} />}
                                                        </div>
                                                    );
                                                })}

                                                <Select
                                                    size="small"
                                                    placeholder="+ 接入设备"
                                                    style={{ width: '100%', maxWidth: 160 }}
                                                    onChange={(val) => {
                                                        const [compId, ifaceUuid] = val.split(':');
                                                        linkInterface(compId, ifaceUuid, masterPort.interfaceUuid);
                                                    }}
                                                    value={null}
                                                >
                                                    {slaves.flatMap(s => s.interfaces
                                                        .filter(i => i.type === masterPort.type && (i.linkedInterfaceUuid || []).length === 0)
                                                        .map(i => (
                                                            <Select.Option key={`${s.id}:${i.interfaceUuid}`} value={`${s.id}:${i.interfaceUuid}`}>
                                                                {s.alias} ({i.key})
                                                            </Select.Option>
                                                        ))
                                                    )}
                                                </Select>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </Card>
                ))
            )}
        </div>
    );
};

// ──────────────────────────────────────────────────────────
// 子组件 B: IO 排针阵列面板 (解决 ISS-007 & 反向匹配逻辑)
// ──────────────────────────────────────────────────────────
const IOSchematicPanel: React.FC<{
    components: ComponentConfig[];
    linkInterface: (sourceUuid: string, sourceIfaceUuid: string, targetIfaceUuid: string | null) => void;
}> = ({ components, linkInterface }) => {
    // 1. 查找提供 IO 引脚的“Host” (通常是 IO 扩展板或主控)
    const ioHosts = components.filter(c => 
        c.interfaces.some(i => IO_TYPES.includes(i.type?.toUpperCase() || ''))
    );

    // 2. 查找需要连接的终端设备 (按钮、灯、交互模块)
    const ioDevices = components.filter(c => 
        ['BUTTON', 'LIGHT', 'LED', 'DISPLAY', 'AUDIO', 'ACTOR', 'SENSOR'].includes(c.category)
    );

    /**
     * 【核心优化逻辑：反向匹配规则】
     * 主板 DI -> 设备 DO
     * 主板 DO -> 设备 DI
     */
    const getTargetType = (sourceType: string) => {
        const t = sourceType?.toUpperCase();
        if (t === 'DI') return 'DO';
        if (t === 'DO') return 'DI';
        return t; // AI/AO 保持一致
    };

    return (
        <div className="io-schematic-container">
            <Alert 
                message="IO 信号反向接线约束" 
                description={
                    <div style={{ fontSize: 11 }}>
                        物理接线必须遵循“输出连输入”原则：<br/>
                        1. 交互设备的 <b>信号输出 (DO)</b> 必须接入主板的 <b>数字输入 (DI)</b> 引脚。<br/>
                        2. 交互设备的 <b>受控输入 (DI)</b> 必须接入主板的 <b>数字输出 (DO)</b> 引脚。
                    </div>
                }
                type="warning" showIcon style={{ marginBottom: 20 }}
            />
            
            <Row gutter={24}>
                <Col span={16}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {ioHosts.map(host => (
                            <Card 
                                key={host.id} 
                                size="small" 
                                title={<Space><NodeIndexOutlined /> <Text strong>{host.alias}</Text></Space>}
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 12 }}
                            >
                                <div className="pin-array" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: 8 }}>
                                    {host.interfaces
                                        .filter(i => IO_TYPES.includes(i.type?.toUpperCase() || ''))
                                        .map(pin => {
                                            const theme = getBusTheme(pin.type || '');
                                            const isLinked = (pin.linkedInterfaceUuid || []).length > 0;
                                            const linkedComp = isLinked ? components.find(c => c.interfaces.some(i => i.interfaceUuid === pin.linkedInterfaceUuid[0])) : null;
                                            const linkedIface = isLinked ? linkedComp?.interfaces.find(i => i.interfaceUuid === pin.linkedInterfaceUuid[0]) : null;

                                            return (
                                                <Tooltip key={pin.interfaceUuid} title={isLinked ? `连接至: ${linkedComp?.alias} (${linkedIface?.key})` : '空闲引脚'}>
                                                    <div className={`io-pin ${isLinked ? 'active' : ''}`} style={{
                                                        padding: '8px', borderRadius: 6, border: `1px solid ${isLinked ? theme.color : 'var(--bg-hover)'}`,
                                                        background: isLinked ? `${theme.color}11` : 'var(--bg-card)',
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.2s'
                                                    }}>
                                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: isLinked ? theme.color : '#444' }} />
                                                        <Text style={{ fontSize: 9, color: isLinked ? '#fff' : 'var(--text-muted)' }}>{pin.key}</Text>
                                                        {isLinked && <Text type="secondary" style={{ fontSize: 8, whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%' }}>{linkedComp?.alias}</Text>}
                                                    </div>
                                                </Tooltip>
                                            );
                                        })
                                    }
                                </div>
                            </Card>
                        ))}
                    </div>
                </Col>

                <Col span={8}>
                    <div style={{ position: 'sticky', top: 0 }}>
                        <Title level={5} style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>终端设备线缆</Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {ioDevices.length === 0 ? <Empty description="暂无交互设备" /> : ioDevices.map(dev => (
                                <Card key={dev.id} size="small" style={{ background: 'var(--bg-hover)', borderRadius: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                        <div style={{ width: 32, height: 32, background: 'var(--accent-soft)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {dev.category === 'BUTTON' ? <ThunderboltOutlined style={{ color: 'var(--accent)' }} /> : <BulbOutlined style={{ color: 'var(--accent)' }} />}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 11, fontWeight: 600 }}>{dev.alias}</div>
                                            <div style={{ fontSize: 9, opacity: 0.5 }}>{dev.type}</div>
                                        </div>
                                    </div>
                                    
                                    {dev.interfaces.map(iface => {
                                        const targetType = getTargetType(iface.type || '');
                                        return (
                                            <div key={iface.interfaceUuid} style={{ marginTop: 8 }}>
                                                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4 }}>
                                                    端子: {iface.key} <Tag style={{ fontSize: 8, scale: 0.8 }}>{iface.type}</Tag> 
                                                    <ArrowRightOutlined style={{ margin: '0 4px', fontSize: 8 }} />
                                                    需接入: <Tag color="orange" style={{ fontSize: 8, scale: 0.8 }}>{targetType}</Tag>
                                                </div>
                                                <Select 
                                                    size="small" style={{ width: '100%' }}
                                                    placeholder={`选择 ${targetType} 引脚...`}
                                                    allowClear
                                                    value={iface.linkedInterfaceUuid?.[0] || undefined}
                                                    onChange={val => linkInterface(dev.id, iface.interfaceUuid, val)}
                                                >
                                                    {ioHosts.flatMap(h => h.interfaces
                                                        .filter(i => i.type === targetType && (i.linkedInterfaceUuid || []).length === 0)
                                                        .map(i => (
                                                            <Select.Option key={i.interfaceUuid} value={i.interfaceUuid}>
                                                                {h.alias} : {i.key}
                                                            </Select.Option>
                                                        ))
                                                    )}
                                                </Select>
                                            </div>
                                        );
                                    })}
                                </Card>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

// ──────────────────────────────────────────────────────────
// 子组件 C: 电气连接实体清单
// ──────────────────────────────────────────────────────────
const ConnectionInventoryPanel: React.FC<{
    components: ComponentConfig[];
    createConnection: (sourceComponentId: string, sourceIfaceUuid: string, targetComponentId: string, targetIfaceUuid: string) => { ok: boolean; message?: string };
    removeConnection: (sourceIfaceUuid: string, targetIfaceUuid: string) => void;
}> = ({ components, createConnection, removeConnection }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [sourceValue, setSourceValue] = useState<string>();
    const [targetValue, setTargetValue] = useState<string>();
    const connections = useMemo(() => buildElectricalConnections(components), [components]);
    const summary = useMemo(() => summarizeElectricalConnections(connections), [connections]);
    const sourceOptions = useMemo(() => components.flatMap(component =>
        (component.interfaces || []).map(iface => ({
            value: `${component.id}:${iface.interfaceUuid}`,
            label: `${component.alias || component.name} / ${iface.key} (${iface.type})`,
            componentId: component.id,
            interfaceUuid: iface.interfaceUuid,
        }))
    ), [components]);

    const targetOptions = useMemo(() => {
        if (!sourceValue) return [];
        const [sourceComponentId, sourceIfaceUuid] = sourceValue.split(':');
        const pointToPointOccupied = new Set(
            connections
                .filter(connection => connection.multiplicity === 'point_to_point')
                .flatMap(connection => [connection.sourceInterfaceUuid, connection.targetInterfaceUuid])
        );
        const sourceComponent = components.find(component => component.id === sourceComponentId);
        const sourceIface = sourceComponent?.interfaces.find(iface => iface.interfaceUuid === sourceIfaceUuid);
        if (sourceIface && getConnectionMultiplicity(sourceIface.type) === 'point_to_point' && pointToPointOccupied.has(sourceIface.interfaceUuid)) {
            return [];
        }

        return getCompatibleInterfaceTargets(components, sourceComponentId, sourceIfaceUuid)
            .filter(item => getConnectionMultiplicity(item.iface.type) !== 'point_to_point' || !pointToPointOccupied.has(item.iface.interfaceUuid))
            .map(item => ({
                value: `${item.component.id}:${item.iface.interfaceUuid}`,
                label: `${item.component.alias || item.component.name} / ${item.iface.key} (${item.iface.type})`,
            }));
    }, [components, connections, sourceValue]);

    const handleCreateConnection = () => {
        if (!sourceValue || !targetValue) {
            messageApi.warning('请选择源接口和目标接口。');
            return;
        }
        const [sourceComponentId, sourceIfaceUuid] = sourceValue.split(':');
        const [targetComponentId, targetIfaceUuid] = targetValue.split(':');
        const result = createConnection(sourceComponentId, sourceIfaceUuid, targetComponentId, targetIfaceUuid);
        if (!result.ok) {
            messageApi.error(result.message || '连接创建失败。');
            return;
        }
        setTargetValue(undefined);
        messageApi.success('连接已创建。');
    };

    const columns = [
        {
            title: '类型',
            dataIndex: 'kind',
            width: 120,
            render: (kind: string, row: any) => (
                <Space direction="vertical" size={2}>
                    <Tag color={row.diagnostics?.some((d: any) => d.severity === 'error') ? 'error' : 'blue'}>
                        {kindLabels[kind] || kind}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 11 }}>{row.interfaceType}</Text>
                </Space>
            )
        },
        {
            title: '源接口',
            dataIndex: 'sourceComponentName',
            render: (_: string, row: any) => (
                <Space direction="vertical" size={2}>
                    <Text strong>{row.sourceComponentName}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{row.sourceInterfaceKey} / {row.sourceInterfaceUuid}</Text>
                </Space>
            )
        },
        {
            title: '目标接口',
            dataIndex: 'targetComponentName',
            render: (_: string, row: any) => (
                <Space direction="vertical" size={2}>
                    <Text strong>{row.targetComponentName}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{row.targetInterfaceKey} / {row.targetInterfaceUuid}</Text>
                </Space>
            )
        },
        {
            title: '方向/形态',
            width: 140,
            render: (_: any, row: any) => (
                <Space direction="vertical" size={2}>
                    <Tag>{row.direction}</Tag>
                    <Text type="secondary" style={{ fontSize: 11 }}>{row.multiplicity}</Text>
                </Space>
            )
        },
        {
            title: '诊断',
            width: 220,
            render: (_: any, row: any) => {
                const visible = (row.diagnostics || []).filter((item: any) => item.severity !== 'trace');
                if (!visible.length) return <Tag color="success">连接有效</Tag>;
                return (
                    <Space direction="vertical" size={4}>
                        {visible.map((item: any) => (
                            <Tag key={`${row.id}-${item.code}`} color={item.severity === 'error' ? 'error' : 'warning'}>
                                {item.code}
                            </Tag>
                        ))}
                    </Space>
                );
            }
        },
        {
            title: '操作',
            width: 100,
            render: (_: any, row: any) => (
                <Button
                    size="small"
                    danger
                    icon={<DisconnectOutlined />}
                    onClick={() => removeConnection(row.sourceInterfaceUuid, row.targetInterfaceUuid)}
                >
                    删除
                </Button>
            )
        }
    ];

    return (
        <div className="connection-inventory-container">
            {contextHolder}
            <Alert
                message="电气连接实体视图"
                description="连接清单现在是编辑入口：创建连接会通过兼容性校验后写入 linkedInterfaceUuid；删除连接会清理相关接口引用。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />
            <Card size="small" style={{ marginBottom: 16, background: 'var(--bg-hover)', borderRadius: 12 }}>
                <Row gutter={12} align="middle">
                    <Col span={10}>
                        <Select
                            showSearch
                            allowClear
                            placeholder="选择源接口"
                            value={sourceValue}
                            onChange={(value) => {
                                setSourceValue(value);
                                setTargetValue(undefined);
                            }}
                            options={sourceOptions}
                            optionFilterProp="label"
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={10}>
                        <Select
                            showSearch
                            allowClear
                            disabled={!sourceValue}
                            placeholder={sourceValue ? '选择兼容目标接口' : '请先选择源接口'}
                            value={targetValue}
                            onChange={setTargetValue}
                            options={targetOptions}
                            optionFilterProp="label"
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={4}>
                        <Button type="primary" icon={<LinkOutlined />} block onClick={handleCreateConnection}>
                            创建连接
                        </Button>
                    </Col>
                </Row>
            </Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}><Card size="small"><Statistic title="连接实体" value={summary.total} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="错误" value={summary.errorCount} valueStyle={{ color: summary.errorCount ? '#ff4d4f' : '#52c41a' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="警告" value={summary.warningCount} valueStyle={{ color: summary.warningCount ? '#faad14' : '#52c41a' }} /></Card></Col>
                <Col span={6}><Card size="small"><Statistic title="接口类型" value={Object.keys(summary.byType).length} /></Card></Col>
            </Row>
            {connections.length === 0 ? (
                <Empty description="当前没有从 linkedInterfaceUuid 反建出的电气连接" />
            ) : (
                <Table
                    size="small"
                    rowKey="id"
                    columns={columns}
                    dataSource={connections}
                    pagination={{ pageSize: 8 }}
                    expandable={{
                        expandedRowRender: row => (
                            <div style={{ fontSize: 12 }}>
                                <Text type="secondary">来源引用：</Text>
                                <Space wrap style={{ marginLeft: 8 }}>
                                    {row.sourceRefs.map(ref => <Tag key={ref}>{ref}</Tag>)}
                                </Space>
                            </div>
                        )
                    }}
                />
            )}
        </div>
    );
};

// ──────────────────────────────────────────────────────────
// Main: WiringStep 主组件
// ──────────────────────────────────────────────────────────
export const WiringStep: React.FC<{ onExport?: () => void }> = () => {
    const { config, linkInterface, createConnection, removeConnection } = useProjectStore();
    const components = config.components as ComponentConfig[];

    const counts = useMemo(() => {
        let bus = 0, io = 0;
        components.forEach(c => {
            c.interfaces.forEach(i => {
                const t = i.type?.toUpperCase() || '';
                if (COMMUNICATION_TYPES.includes(t)) bus++;
                if (IO_TYPES.includes(t)) io++;
            });
        });
        return { bus, io };
    }, [components]);

    const tabItems = [
        {
            key: 'inventory',
            label: <Space><LinkOutlined /> 连接清单 <Badge count={buildElectricalConnections(components).length} size="small" style={{ backgroundColor: 'var(--accent)' }} /></Space>,
            children: <ConnectionInventoryPanel components={components} createConnection={createConnection} removeConnection={removeConnection} />,
        },
        {
            key: 'bus',
            label: <Space><BranchesOutlined /> 通信总线拓扑 <Badge count={counts.bus} size="small" style={{ backgroundColor: 'var(--warning)' }} /></Space>,
            children: <BusTopologyPanel components={components} linkInterface={linkInterface} />,
        },
        {
            key: 'io',
            label: <Space><ControlOutlined /> IO 物理接线 <Badge count={counts.io} size="small" style={{ backgroundColor: '#1677ff' }} /></Space>,
            children: <IOSchematicPanel components={components} linkInterface={linkInterface} />,
        },
    ];

    return (
        <div className="wiring-step-container" style={{ padding: '0 8px' }}>
            <div className="section-header" style={{ marginBottom: 20 }}>
                <NodeIndexOutlined style={{ fontSize: 24, color: 'var(--accent)', marginRight: 12 }} />
                <div>
                    <h2 className="section-title" style={{ margin: 0, fontSize: 18 }}>5. 接口连线 &amp; 物理拓扑</h2>
                    <div className="section-subtitle" style={{ opacity: 0.6 }}>定义主从通信关系，完成电气引脚的闭环接线</div>
                </div>
            </div>

            <Tabs
                defaultActiveKey="inventory"
                items={tabItems}
                className="custom-wiring-tabs"
            />

            <style>{`
                .master-board-card { transition: all 0.3s ease; }
                .master-board-card:hover { border-color: gold !important; box-shadow: 0 8px 24px rgba(255,215,0,0.1); }
                .slave-node-card { transition: transform 0.2s; min-height: 80px; }
                .slave-node-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
                .io-pin:hover { border-color: var(--accent) !important; cursor: pointer; transform: scale(1.05); }
                .io-pin.active { background: var(--accent-soft) !important; border-color: var(--accent) !important; }
                .custom-wiring-tabs .ant-tabs-nav { margin-bottom: 24px !important; }
            `}</style>
        </div>
    );
};
