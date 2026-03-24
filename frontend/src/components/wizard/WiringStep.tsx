import React, { useState, useMemo } from 'react';
import { Tag, Button, Select, Space, Tooltip, Empty, Divider, Typography, Badge, Card } from 'antd';
import { 
    ApiOutlined, SwapOutlined, 
    LinkOutlined, DisconnectOutlined,
    SearchOutlined, SettingOutlined,
    DeploymentUnitOutlined, ShareAltOutlined,
    CrownOutlined, NodeIndexOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';

const { Text, Title } = Typography;

const COMMUNICATION_TYPES = ['CAN', 'ETHERNET', 'RS485', 'RS232', 'LIN'];

export const WiringStep: React.FC = () => {
    const { config, updateInterface } = useProjectStore();
    const components = config.components;
    const [linkingUuid, setLinkingUuid] = useState<string | null>(null);

    // 1. Identify all communication-capable interfaces
    const allInterfaces = useMemo(() => components.flatMap(comp =>
        comp.interfaces
            .filter(iface => COMMUNICATION_TYPES.includes(iface.type.toUpperCase()))
            .map(iface => ({
                compId: comp.id,
                compLabel: comp.alias || comp.name,
                compCategory: comp.category,
                ...iface,
            }))
    ), [components]);

    // 2. Identify "Master" components (Controllers)
    const masters = useMemo(() => components.filter(c => 
        ['MAINCPU', 'INTEGRATED_CONTROLLER'].includes(c.category || '')
    ), [components]);

    // 3. Defined Bus Architecture: Each Master Interface is a Bus Root
    const busStructures = useMemo(() => {
        const masterInterfaces = allInterfaces.filter(i => 
            masters.some(m => m.id === i.compId)
        );

        return masterInterfaces.map(masterIface => {
            const slaves = allInterfaces.filter(i => 
                !masters.some(m => m.id === i.compId) && // Is a slave
                (i.linkedInterfaceUuid || []).includes(masterIface.interfaceUuid) // Is linked to this master
            );
            
            return {
                root: masterIface,
                slaves,
                type: masterIface.type.toUpperCase()
            };
        });
    }, [allInterfaces, masters]);

    // 4. Slaves that are not yet assigned to any Master Bus
    const unassignedSlaves = useMemo(() => {
        const masterUuids = allInterfaces
            .filter(i => masters.some(m => m.id === i.compId))
            .map(i => i.interfaceUuid);

        return allInterfaces.filter(i => 
            !masters.some(m => m.id === i.compId) && // Is a slave
            !(i.linkedInterfaceUuid || []).some(uuid => masterUuids.includes(uuid)) // Not linked to any master
        );
    }, [allInterfaces, masters]);

    const handleLink = (slaveCompId: string, slaveIfaceUuid: string, masterIfaceUuid: string) => {
        const slaveIface = allInterfaces.find(i => i.interfaceUuid === slaveIfaceUuid);
        const masterIface = allInterfaces.find(i => i.interfaceUuid === masterIfaceUuid);

        if (slaveIface && masterIface) {
            const newSlaveLinks = Array.from(new Set([...(slaveIface.linkedInterfaceUuid || []), masterIfaceUuid]));
            const newMasterLinks = Array.from(new Set([...(masterIface.linkedInterfaceUuid || []), slaveIfaceUuid]));
            
            updateInterface(slaveCompId, slaveIfaceUuid, { linkedInterfaceUuid: newSlaveLinks });
            // Correct the compId for the master
            const masterComp = masters.find(m => m.id === masterIface.compId);
            if (masterComp) {
                updateInterface(masterComp.id, masterIfaceUuid, { linkedInterfaceUuid: newMasterLinks });
            }
        }
        setLinkingUuid(null);
    };

    const handleUnlink = (compId: string, ifaceUuid: string, peerUuid: string) => {
        const iface = allInterfaces.find(i => i.interfaceUuid === ifaceUuid);
        const peer = allInterfaces.find(i => i.interfaceUuid === peerUuid);

        if (iface && peer) {
            const filteredIface = (iface.linkedInterfaceUuid || []).filter(u => u !== peerUuid);
            const filteredPeer = (peer.linkedInterfaceUuid || []).filter(u => u !== ifaceUuid);
            
            updateInterface(compId, ifaceUuid, { linkedInterfaceUuid: filteredIface });
            updateInterface(peer.compId, peerUuid, { linkedInterfaceUuid: filteredPeer });
        }
    };

    const getBusTheme = (type: string) => {
        switch(type) {
            case 'CAN': return { color: '#fa8c16', label: 'CAN总线', icon: <ShareAltOutlined /> };
            case 'ETHERNET': return { color: '#1890ff', label: '网络总线', icon: <DeploymentUnitOutlined /> };
            case 'RS485': case 'RS232': case 'LIN': return { color: '#52c41a', label: '串口线路', icon: <SwapOutlined /> };
            default: return { color: 'var(--accent-color)', label: type, icon: <ApiOutlined /> };
        }
    };

    return (
        <div className="wiring-step-container" style={{ padding: '0 8px' }}>
            <div className="section-header">
                <div className="section-icon"><NodeIndexOutlined /></div>
                <div>
                    <h2 className="section-title">PLC 电气总线视图 (Bus-Slave Topology)</h2>
                    <div className="section-subtitle">主控端口即为独立总线，管理从站设备的电气连接关系</div>
                </div>
            </div>

            <div className="bus-schematic-flow" style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
                {/* 1. Active Buses (Master-Centric) */}
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
                                {/* THE MASTER NODE (The Hub) */}
                                <div style={{ width: 240, flexShrink: 0 }}>
                                    <Card 
                                        variant="borderless"
                                        size="small" className="schematic-card master"
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Space><CrownOutlined style={{ color: '#ffd700', fontSize: 10 }} /><Text strong style={{ fontSize: 10 }}>{bus.root.compLabel.split(',')[0]}</Text></Space>
                                                <Tag color="gold" style={{ fontSize: 8, margin: 0, border: 'none', lineHeight: '14px' }}>MASTER</Tag>
                                            </div>
                                        }
                                        style={{ border: `1px solid gold`, borderRadius: 4, background: 'rgba(255,215,0,0.03)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                                    >
                                        <div style={{ textAlign: 'center', padding: '8px 0' }}>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>端口 & 类型</div>
                                            <div style={{ fontWeight: 800, color: theme.color, fontSize: 12 }}>{bus.root.key}</div>
                                            <div style={{ fontSize: 9, opacity: 0.7 }}>[{bus.type}]</div>
                                        </div>
                                    </Card>
                                </div>

                                {/* SLAVE NODES */}
                                {bus.slaves.map(slave => (
                                    <div key={slave.interfaceUuid} style={{ width: 220, flexShrink: 0, position: 'relative' }}>
                                        <div style={{ 
                                            position: 'absolute', left: -24, top: 35, width: 24, height: 1, 
                                            background: theme.color, opacity: 0.3
                                        }} />
                                        <Card 
                                            variant="borderless"
                                            size="small" className="schematic-card"
                                            title={
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text strong style={{ fontSize: 10 }}>{slave.compLabel.split(',')[0]}</Text>
                                                    <Text type="secondary" style={{ fontSize: 9 }}>{slave.key}</Text>
                                                </div>
                                            }
                                            style={{ border: `1px solid ${theme.color}22`, borderRadius: 4, background: 'var(--bg-elevated)', padding: 0 }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '2px 4px' }}>
                                                <Button 
                                                    type="text" size="small" danger icon={<DisconnectOutlined style={{fontSize: 9}} />} 
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

                {/* 2. Unassigned Slaves Pool */}
                <div className="unassigned-pool">
                    <Divider orientation="left"><Title level={5} style={{ margin: 0, color: 'var(--text-muted)' }}>待连线从站设备 (Unassigned Slaves)</Title></Divider>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
                        {unassignedSlaves.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, opacity: 0.5 }}>
                                <Text italic>所有设备均已接入总线</Text>
                            </div>
                        ) : (
                            unassignedSlaves.map(slave => {
                                const theme = getBusTheme(slave.type.toUpperCase());
                                const availableMasters = allInterfaces.filter(i => 
                                    masters.some(m => m.id === i.compId) && i.type === slave.type
                                );

                                return (
                                    <Card 
                                        variant="borderless"
                                        key={slave.interfaceUuid} size="small"
                                        title={<Text style={{ fontSize: 12 }}>{slave.compLabel} ({slave.key})</Text>}
                                        extra={<Tag color={theme.color} style={{ fontSize: 9 }}>{slave.type}</Tag>}
                                        style={{ background: 'var(--bg-elevated)', borderRadius: 10, border: '1px dashed var(--border-subtle)' }}
                                    >
                                        <div style={{ marginBottom: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                                            该设备物理线缆尚未接入主控总线
                                        </div>
                                        {linkingUuid === slave.interfaceUuid ? (
                                            <Select
                                                autoFocus open style={{ width: '100%' }} size="small"
                                                placeholder="选择目标总线端口..."
                                                onBlur={() => setLinkingUuid(null)}
                                                onSelect={(val: string) => handleLink(slave.compId, slave.interfaceUuid, val)}
                                            >
                                                {availableMasters.map(m => (
                                                    <Select.Option key={m.interfaceUuid} value={m.interfaceUuid}>
                                                        {m.compLabel} : {m.key}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Button 
                                                block size="small" icon={<LinkOutlined />} 
                                                disabled={availableMasters.length === 0}
                                                onClick={() => setLinkingUuid(slave.interfaceUuid)}
                                            >
                                                {availableMasters.length > 0 ? "接入总线" : "无匹配主站端口"}
                                            </Button>
                                        )}
                                    </Card>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .schematic-card { transition: all 0.2s ease; }
                .schematic-card:hover { transform: scale(1.02); box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important; }
                .bus-section:not(:last-child) { margin-bottom: 24px; }
            `}</style>
        </div>
    );
};
