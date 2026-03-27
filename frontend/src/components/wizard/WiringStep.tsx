import React, { useState, useMemo } from 'react';
import { Tag, Button, Select, Space, Tooltip, Empty, Divider, Typography, Badge, Card, Tabs, Row, Col } from 'antd';
import { 
    ApiOutlined, SwapOutlined, 
    LinkOutlined, DisconnectOutlined,
    DeploymentUnitOutlined, ShareAltOutlined,
    CrownOutlined, NodeIndexOutlined,
    BranchesOutlined, ControlOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { InterfaceConfig } from '../../store/types';

const { Text, Title } = Typography;

const COMMUNICATION_TYPES = ['CAN', 'ETHERNET', 'RS485', 'RS232', 'LIN', 'NETWORK'];
const IO_TYPES = ['DI', 'DO', 'AI', 'AO'];

// DI/DO function tags per Refined Requirements §3 Step 6
const IO_FUNCTION_TAGS: Record<string, { label: string; color: string }[]> = {
    DI: [
        { label: '急停信号', color: 'red' },
        { label: '复位信号', color: 'orange' },
        { label: '限位开关', color: 'volcano' },
        { label: '光电感应', color: 'gold' },
        { label: '充电检测', color: 'lime' },
        { label: '门开检测', color: 'cyan' },
        { label: '自定义', color: 'default' },
    ],
    DO: [
        { label: '状态指示', color: 'blue' },
        { label: '报警输出', color: 'red' },
        { label: '充电控制', color: 'green' },
        { label: '气缸控制', color: 'cyan' },
        { label: '电磁锁控制', color: 'purple' },
        { label: '自定义', color: 'default' },
    ],
    AI: [
        { label: '当前电量', color: 'gold' },
        { label: '温度监测', color: 'orange' },
        { label: '距离检测', color: 'blue' },
        { label: '自定义', color: 'default' },
    ],
    AO: [
        { label: '速度给定', color: 'green' },
        { label: '力矩控制', color: 'cyan' },
        { label: '自定义', color: 'default' },
    ],
};

// ──────────────────────────────────────────────────────────
// Sub-component: IO Signal Mapping Panel
// ──────────────────────────────────────────────────────────
const IOSignalMappingPanel: React.FC<{
    components: any[];
    updateInterface: (compId: string, ifaceUuid: string, delta: Partial<InterfaceConfig>) => void;
}> = ({ components, updateInterface }) => {
    const allIOInterfaces = useMemo(() =>
        components.flatMap(comp =>
            comp.interfaces
                .filter((iface: InterfaceConfig) => IO_TYPES.includes(iface.type?.toUpperCase()))
                .map((iface: InterfaceConfig) => ({
                    compId: comp.id,
                    compLabel: comp.alias || comp.name,
                    compCategory: comp.category,
                    ...iface,
                }))
        ), [components]);

    if (allIOInterfaces.length === 0) {
        return (
            <Empty
                description={
                    <span>暂无 DI/DO 数字接口<br /><Text type="secondary" style={{ fontSize: 12 }}>请在"组件库"步骤添加控制板组件后，其接口将自动解析到此处</Text></span>
                }
                style={{ padding: '60px 0' }}
            />
        );
    }

    // Group by IO type
    const grouped: Record<string, typeof allIOInterfaces> = {};
    allIOInterfaces.forEach(iface => {
        const t = iface.type?.toUpperCase() || 'UNKNOWN';
        if (!grouped[t]) grouped[t] = [];
        grouped[t].push(iface);
    });

    return (
        <div className="io-mapping-container">
            <div style={{ marginBottom: 16, opacity: 0.7 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    将 DI/DO/AI/AO 物理引脚关联到逻辑功能（如：DI1→急停信号），以便系统自动完成协议配置。
                </Text>
            </div>
            {Object.entries(grouped).map(([ioType, ifaces]) => {
                const tags = IO_FUNCTION_TAGS[ioType] || IO_FUNCTION_TAGS['DI'];
                const typeColor = ioType.startsWith('D') ? (ioType === 'DI' ? '#1677ff' : '#52c41a') : '#fa8c16';
                return (
                    <div key={ioType} style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 3, height: 18, background: typeColor, borderRadius: 2 }} />
                            <Text strong style={{ fontSize: 14, color: typeColor }}>{ioType} 引脚组</Text>
                            <Tag color={typeColor} style={{ fontSize: 10 }}>{ifaces.length} 路</Tag>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
                            {ifaces.map(iface => {
                                const currentTag = iface.functionTag as string | undefined;
                                return (
                                    <Card
                                        key={iface.interfaceUuid}
                                        size="small"
                                        variant="borderless"
                                        style={{
                                            background: 'var(--bg-elevated)',
                                            border: `1px solid ${currentTag ? typeColor + '55' : 'var(--border-subtle)'}`,
                                            borderRadius: 8,
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <Row align="middle" gutter={8}>
                                            <Col flex="none">
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: 6,
                                                    background: `${typeColor}22`, border: `1px solid ${typeColor}55`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 800, fontSize: 11, color: typeColor,
                                                }}>
                                                    {iface.key?.slice(-2) || ioType}
                                                </div>
                                            </Col>
                                            <Col flex="auto" style={{ minWidth: 0 }}>
                                                <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {iface.compLabel}
                                                </div>
                                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{iface.key}</div>
                                            </Col>
                                            <Col flex="none">
                                                {currentTag && (
                                                    <Tag color={tags.find(t => t.label === currentTag)?.color || 'default'} style={{ fontSize: 10 }}>
                                                        {currentTag}
                                                    </Tag>
                                                )}
                                            </Col>
                                        </Row>
                                        <div style={{ marginTop: 8 }}>
                                            <Select
                                                size="small"
                                                style={{ width: '100%' }}
                                                placeholder="关联功能标签..."
                                                value={currentTag || undefined}
                                                allowClear
                                                onChange={(val: string | undefined) =>
                                                    updateInterface(iface.compId, iface.interfaceUuid, { functionTag: val } as any)
                                                }
                                            >
                                                {tags.map(tag => (
                                                    <Select.Option key={tag.label} value={tag.label}>
                                                        <Tag color={tag.color} style={{ fontSize: 10 }}>{tag.label}</Tag>
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ──────────────────────────────────────────────────────────
// Sub-component: Bus Topology Panel (original content)
// ──────────────────────────────────────────────────────────
const BusTopologyPanel: React.FC<{
    components: any[];
    updateInterface: (compId: string, ifaceUuid: string, delta: Partial<InterfaceConfig>) => void;
}> = ({ components, updateInterface }) => {
    const [linkingUuid, setLinkingUuid] = useState<string | null>(null);

    const allInterfaces = useMemo(() => components.flatMap(comp =>
        comp.interfaces
            .filter((iface: InterfaceConfig) => COMMUNICATION_TYPES.includes(iface.type?.toUpperCase()))
            .map((iface: InterfaceConfig) => ({
                compId: comp.id,
                compLabel: comp.alias || comp.name,
                compCategory: comp.category,
                ...iface,
            }))
    ), [components]);

    const masters = useMemo(() => components.filter(c =>
        ['MAINCPU', 'INTEGRATED_CONTROLLER', 'INTERGRATEDCONTROLLER'].includes(c.category || '')
    ), [components]);

    const busStructures = useMemo(() => {
        const masterInterfaces = allInterfaces.filter(i =>
            masters.some(m => m.id === i.compId)
        );
        return masterInterfaces.map(masterIface => {
            const slaves = allInterfaces.filter(i =>
                !masters.some(m => m.id === i.compId) &&
                (i.linkedInterfaceUuid || []).includes(masterIface.interfaceUuid)
            );
            return { root: masterIface, slaves, type: masterIface.type?.toUpperCase() };
        });
    }, [allInterfaces, masters]);

    const unassignedSlaves = useMemo(() => {
        const masterUuids = allInterfaces
            .filter(i => masters.some(m => m.id === i.compId))
            .map(i => i.interfaceUuid);
        return allInterfaces.filter(i =>
            !masters.some(m => m.id === i.compId) &&
            !(i.linkedInterfaceUuid || []).some((uuid: string) => masterUuids.includes(uuid))
        );
    }, [allInterfaces, masters]);

    const handleLink = (slaveCompId: string, slaveIfaceUuid: string, masterIfaceUuid: string) => {
        const slaveIface = allInterfaces.find(i => i.interfaceUuid === slaveIfaceUuid);
        const masterIface = allInterfaces.find(i => i.interfaceUuid === masterIfaceUuid);
        if (slaveIface && masterIface) {
            const newSlaveLinks = Array.from(new Set([...(slaveIface.linkedInterfaceUuid || []), masterIfaceUuid]));
            const newMasterLinks = Array.from(new Set([...(masterIface.linkedInterfaceUuid || []), slaveIfaceUuid]));
            updateInterface(slaveCompId, slaveIfaceUuid, { linkedInterfaceUuid: newSlaveLinks });
            const masterComp = masters.find(m => m.id === masterIface.compId);
            if (masterComp) updateInterface(masterComp.id, masterIfaceUuid, { linkedInterfaceUuid: newMasterLinks });
        }
        setLinkingUuid(null);
    };

    const handleUnlink = (compId: string, ifaceUuid: string, peerUuid: string) => {
        const iface = allInterfaces.find(i => i.interfaceUuid === ifaceUuid);
        const peer = allInterfaces.find(i => i.interfaceUuid === peerUuid);
        if (iface && peer) {
            updateInterface(compId, ifaceUuid, { linkedInterfaceUuid: (iface.linkedInterfaceUuid || []).filter((u: string) => u !== peerUuid) });
            updateInterface(peer.compId, peerUuid, { linkedInterfaceUuid: (peer.linkedInterfaceUuid || []).filter((u: string) => u !== ifaceUuid) });
        }
    };

    const getBusTheme = (type: string) => {
        switch (type) {
            case 'CAN': return { color: '#fa8c16', label: 'CAN总线', icon: <ShareAltOutlined /> };
            case 'ETHERNET': case 'NETWORK': return { color: '#1890ff', label: '网络总线', icon: <DeploymentUnitOutlined /> };
            case 'RS485': case 'RS232': case 'LIN': return { color: '#52c41a', label: '串口线路', icon: <SwapOutlined /> };
            default: return { color: 'var(--accent-color)', label: type, icon: <ApiOutlined /> };
        }
    };

    return (
        <div className="bus-schematic-flow" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {busStructures.length === 0 && unassignedSlaves.length === 0 && (
                <Empty description={<span>暂无通信接口<br /><Text type="secondary" style={{ fontSize: 12 }}>添加主控或传感器组件后，其 CAN/以太网/串口接口将出现在此处</Text></span>} style={{ padding: '60px 0' }} />
            )}
            {busStructures.map((bus, idx) => {
                const theme = getBusTheme(bus.type);
                return (
                    <div key={`${bus.root.interfaceUuid}-${idx}`} className="bus-section" style={{ position: 'relative' }}>
                        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                padding: '6px 16px', background: theme.color, borderRadius: '6px 6px 0 0',
                                color: '#fff', fontSize: 13, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8,
                                boxShadow: `0 4px 15px ${theme.color}44`
                            }}>
                                {theme.icon} {theme.label} #{idx}
                            </div>
                            <Divider style={{ flex: 1, margin: 0, borderTop: `2px solid ${theme.color}`, opacity: 0.6 }} />
                        </div>
                        <div style={{
                            display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: 24, padding: '16px 20px',
                            borderLeft: `4px solid ${theme.color}66`, background: 'rgba(255,255,255,0.01)',
                            borderRadius: '0 8px 8px 0', position: 'relative'
                        }}>
                            <div style={{ width: 240, flexShrink: 0 }}>
                                <Card
                                    variant="borderless" size="small" className="schematic-card master"
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Space><CrownOutlined style={{ color: '#ffd700', fontSize: 10 }} /><Text strong style={{ fontSize: 10 }}>{bus.root.compLabel?.split(',')[0]}</Text></Space>
                                            <Tag color="gold" style={{ fontSize: 8, margin: 0, border: 'none', lineHeight: '14px' }}>MASTER</Tag>
                                        </div>
                                    }
                                    style={{ border: `1px solid gold`, borderRadius: 4, background: 'rgba(255,215,0,0.03)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                                >
                                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>端口 &amp; 类型</div>
                                        <div style={{ fontWeight: 800, color: theme.color, fontSize: 12 }}>{bus.root.key}</div>
                                        <div style={{ fontSize: 9, opacity: 0.7 }}>[{bus.type}]</div>
                                    </div>
                                </Card>
                            </div>
                            {bus.slaves.map((slave: any) => (
                                <div key={slave.interfaceUuid} style={{ width: 220, flexShrink: 0, position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: -24, top: 35, width: 24, height: 1, background: theme.color, opacity: 0.3 }} />
                                    <Card
                                        variant="borderless" size="small" className="schematic-card"
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text strong style={{ fontSize: 10 }}>{slave.compLabel?.split(',')[0]}</Text>
                                                <Text type="secondary" style={{ fontSize: 9 }}>{slave.key}</Text>
                                            </div>
                                        }
                                        style={{ border: `1px solid ${theme.color}22`, borderRadius: 4, background: 'var(--bg-elevated)', padding: 0 }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '2px 4px' }}>
                                            <Button
                                                type="text" size="small" danger icon={<DisconnectOutlined style={{ fontSize: 9 }} />}
                                                onClick={() => handleUnlink(slave.compId, slave.interfaceUuid, bus.root.interfaceUuid)}
                                            />
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            <div className="unassigned-pool">
                <Divider orientation="left"><Title level={5} style={{ margin: 0, color: 'var(--text-muted)' }}>待连线从站设备 (Unassigned Slaves)</Title></Divider>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
                    {unassignedSlaves.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, opacity: 0.5 }}>
                            <Text italic>所有设备均已接入总线</Text>
                        </div>
                    ) : (
                        unassignedSlaves.map((slave: any) => {
                            const theme = getBusTheme(slave.type?.toUpperCase());
                            const availableMasters = allInterfaces.filter(i =>
                                masters.some(m => m.id === i.compId) && i.type === slave.type
                            );
                            return (
                                <Card
                                    variant="borderless" key={slave.interfaceUuid} size="small"
                                    title={<Text style={{ fontSize: 12 }}>{slave.compLabel} ({slave.key})</Text>}
                                    extra={<Tag color={theme.color} style={{ fontSize: 9 }}>{slave.type}</Tag>}
                                    style={{ background: 'var(--bg-elevated)', borderRadius: 10, border: '1px dashed var(--border-subtle)' }}
                                >
                                    <div style={{ marginBottom: 12, fontSize: 11, color: 'var(--text-muted)' }}>该设备物理线缆尚未接入主控总线</div>
                                    {linkingUuid === slave.interfaceUuid ? (
                                        <Select
                                            autoFocus open style={{ width: '100%' }} size="small"
                                            placeholder="选择目标总线端口..."
                                            onBlur={() => setLinkingUuid(null)}
                                            onSelect={(val: string) => handleLink(slave.compId, slave.interfaceUuid, val)}
                                        >
                                            {availableMasters.map((m: any) => (
                                                <Select.Option key={m.interfaceUuid} value={m.interfaceUuid}>
                                                    {m.compLabel}: {m.key}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    ) : (
                                        <Button
                                            block size="small" icon={<LinkOutlined />}
                                            disabled={availableMasters.length === 0}
                                            onClick={() => setLinkingUuid(slave.interfaceUuid)}
                                        >
                                            {availableMasters.length > 0 ? '接入总线' : '无匹配主站端口'}
                                        </Button>
                                    )}
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

// ──────────────────────────────────────────────────────────
// Main: WiringStep with Tabs (Bus Topology | IO Signal Mapping)
// ──────────────────────────────────────────────────────────
export const WiringStep: React.FC<{ onExport?: () => void }> = () => {
    const { config, updateInterface } = useProjectStore();
    const components = config.components;

    const ioCount = useMemo(() =>
        components.reduce((acc, comp) =>
            acc + comp.interfaces.filter((i: InterfaceConfig) => IO_TYPES.includes(i.type?.toUpperCase())).length, 0
        ), [components]);

    const busCount = useMemo(() =>
        components.reduce((acc, comp) =>
            acc + comp.interfaces.filter((i: InterfaceConfig) => COMMUNICATION_TYPES.includes(i.type?.toUpperCase())).length, 0
        ), [components]);

    const tabItems = [
        {
            key: 'bus',
            label: (
                <Space>
                    <BranchesOutlined />
                    总线拓扑
                    {busCount > 0 && <Tag style={{ fontSize: 10, margin: 0 }}>{busCount}</Tag>}
                </Space>
            ),
            children: (
                <BusTopologyPanel components={components} updateInterface={updateInterface} />
            ),
        },
        {
            key: 'io',
            label: (
                <Space>
                    <ControlOutlined />
                    IO 信号映射
                    {ioCount > 0 && <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>{ioCount}</Tag>}
                </Space>
            ),
            children: (
                <IOSignalMappingPanel components={components} updateInterface={updateInterface} />
            ),
        },
    ];

    return (
        <div className="wiring-step-container" style={{ padding: '0 8px' }}>
            <div className="section-header">
                <div className="section-icon"><NodeIndexOutlined /></div>
                <div>
                    <h2 className="section-title">接口连线 &amp; IO 映射</h2>
                    <div className="section-subtitle">配置总线拓扑连接，并将 DI/DO 引脚关联到逻辑功能</div>
                </div>
            </div>

            <Tabs
                defaultActiveKey="bus"
                items={tabItems}
                style={{ marginTop: 8 }}
            />

            <style>{`
                .schematic-card { transition: all 0.2s ease; }
                .schematic-card:hover { transform: scale(1.02); box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important; }
                .bus-section:not(:last-child) { margin-bottom: 24px; }
                .io-mapping-container { padding: 8px 0; }
            `}</style>
        </div>
    );
};
