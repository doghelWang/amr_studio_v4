import React, { useMemo } from 'react';
import { Typography, Tag } from 'antd';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    Handle,
    Position,
    NodeProps,
    ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useProjectStore } from '../store/useProjectStore';

const { Title, Text } = Typography;

// ━━━ Custom Node Styles ━━━
const MCU_STYLE: React.CSSProperties = {
    background: 'linear-gradient(135deg, #1a3a4a, #0d2233)',
    border: '2px solid #00d2ff', borderRadius: 12,
    padding: '12px 20px', color: '#fff', minWidth: 220, textAlign: 'center'
};
const WHEEL_STYLE: React.CSSProperties = {
    background: '#1a1e27', border: '1px solid #ff8c00', borderRadius: 8,
    padding: '8px 14px', color: '#fff', minWidth: 170, fontSize: 12
};
const SENSOR_STYLE: React.CSSProperties = {
    background: '#1a2733', border: '1px solid #1890ff', borderRadius: 8,
    padding: '8px 14px', color: '#fff', minWidth: 190, fontSize: 12
};
const IO_STYLE: React.CSSProperties = {
    background: '#1d1a33', border: '1px solid #9254de', borderRadius: 8,
    padding: '8px 14px', color: '#fff', minWidth: 170, fontSize: 12
};

// ━━━ Custom Nodes ━━━
const McuNode = ({ data }: NodeProps) => (
    <div style={MCU_STYLE}>
        <Handle type="source" position={Position.Right} style={{ borderColor: '#ff8c00', top: '35%' }} />
        <Handle type="source" position={Position.Right} id="eth" style={{ borderColor: '#1890ff', top: '65%' }} />
        <Handle type="target" position={Position.Left} id="io-in" style={{ borderColor: '#9254de' }} />
        <div style={{ fontSize: 11, color: '#00d2ff', marginBottom: 4 }}>MCU 主控制器</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{String(data.label ?? '')}</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(data.canBuses as string[] ?? []).map((c: string) => <Tag key={c} color="orange" style={{ margin: 0 }}>{c}</Tag>)}
            {(data.ethPorts as string[] ?? []).map((e: string) => <Tag key={e} color="blue" style={{ margin: 0 }}>{e}</Tag>)}
        </div>
    </div>
);

const WheelNode = ({ data }: NodeProps) => (
    <div style={WHEEL_STYLE}>
        <Handle type="target" position={Position.Left} style={{ borderColor: '#ff8c00' }} />
        <div style={{ fontSize: 10, color: '#ff8c00' }}>⚙️ 驱动单元</div>
        <div style={{ fontWeight: 600, margin: '2px 0' }}>{String(data.label ?? '')}</div>
        <Tag color="orange" style={{ margin: '2px 0' }}>{String(data.canBus ?? '')} · ID{String(data.canNodeId ?? '')}</Tag>
        <div style={{ color: '#888', fontSize: 10 }}>{String(data.driverModel ?? '')}</div>
    </div>
);

const SensorNode = ({ data }: NodeProps) => (
    <div style={SENSOR_STYLE}>
        <Handle type="target" position={Position.Left} style={{ borderColor: '#1890ff' }} />
        <div style={{ fontSize: 10, color: '#1890ff' }}>📡 传感器</div>
        <div style={{ fontWeight: 600, margin: '2px 0' }}>{String(data.label ?? '')}</div>
        <div style={{ color: '#aaa', fontSize: 10 }}>{String(data.model ?? '')}</div>
        {String(data.connType ?? '') === 'ETHERNET' && (
            <div style={{ color: '#00d2ff', fontSize: 10 }}>{String(data.ipAddress ?? '')}:{String(data.port ?? '')} · {String(data.ethPort ?? '')}</div>
        )}
        {String(data.connType ?? '') !== 'ETHERNET' && (
            <Tag color="green" style={{ margin: '2px 0' }}>{String(data.connType ?? '')}</Tag>
        )}
    </div>
);

const IoBoardNode = ({ data }: NodeProps) => (
    <div style={IO_STYLE}>
        <Handle type="source" position={Position.Right} style={{ borderColor: '#9254de' }} />
        <div style={{ fontSize: 10, color: '#9254de' }}>🔌 IO扩展板</div>
        <div style={{ fontWeight: 600, margin: '2px 0' }}>{String(data.label ?? '')}</div>
        <Tag color="orange" style={{ margin: '2px 0' }}>{String(data.canBus ?? '')} · ID{String(data.canNodeId ?? '')}</Tag>
    </div>
);

const nodeTypes = { mcu: McuNode, wheel: WheelNode, sensor: SensorNode, ioBoard: IoBoardNode };

// ━━━ Main Component ━━━
const WiringCanvasInner: React.FC = () => {
    const { config } = useProjectStore();
    const { mcu, wheels, sensors, ioBoards } = config;

    const { nodes, edges } = useMemo(() => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        nodes.push({
            id: 'mcu', type: 'mcu',
            position: { x: 380, y: 260 },
            data: { label: mcu.model, canBuses: mcu.canBuses, ethPorts: mcu.ethPorts }
        });

        wheels.forEach((w, i) => {
            (w.components || []).forEach((comp, j) => {
                const nid = `wheel-${w.id}-${j}`;
                nodes.push({ 
                    id: nid, 
                    type: 'wheel', 
                    position: { x: 680, y: 40 + i * 200 + j * 90 }, 
                    data: { 
                        label: `${w.label} (${comp.role === 'DRIVE_DRIVER' ? '驱动' : comp.role === 'STEER_DRIVER' ? '转向' : '编码'})`, 
                        canBus: comp.canBus, 
                        canNodeId: comp.canNodeId, 
                        driverModel: comp.driverModel 
                    } 
                });
                edges.push({ 
                    id: `e-${nid}`, 
                    source: 'mcu', 
                    target: nid, 
                    label: `${comp.canBus}·ID${comp.canNodeId}`, 
                    style: { stroke: '#ff8c00', strokeWidth: 2 }, 
                    labelStyle: { fill: '#ff8c00', fontSize: 10 }, 
                    animated: true 
                });
            });
        });

        sensors.forEach((s, i) => {
            const nid = `sensor-${s.id}`;
            const isEth = s.connType === 'ETHERNET';
            nodes.push({ id: nid, type: 'sensor', position: { x: 180 + i * 210, y: 520 }, data: { label: s.label, model: s.model, connType: s.connType, ipAddress: s.ipAddress, port: s.port, ethPort: s.ethPort } });
            edges.push({ id: `e-${nid}`, source: 'mcu', sourceHandle: isEth ? 'eth' : undefined, target: nid, label: isEth ? `ETH·${s.ipAddress}` : s.connType, style: { stroke: isEth ? '#1890ff' : '#52c41a', strokeWidth: 2 }, labelStyle: { fill: isEth ? '#1890ff' : '#52c41a', fontSize: 10 }, animated: true });
        });

        ioBoards.forEach((b, i) => {
            const nid = `io-${b.id}`;
            nodes.push({ id: nid, type: 'ioBoard', position: { x: 40, y: 180 + i * 140 }, data: { label: b.label, model: b.model, canBus: b.canBus, canNodeId: b.canNodeId } });
            edges.push({ id: `e-${nid}`, source: nid, target: 'mcu', targetHandle: 'io-in', label: `${b.canBus}·ID${b.canNodeId}`, style: { stroke: '#9254de', strokeWidth: 2 }, labelStyle: { fill: '#9254de', fontSize: 10 }, animated: true });
        });

        return { nodes, edges };
    }, [mcu, wheels, sensors, ioBoards]);

    return (
        <div style={{ width: '100%', height: 600, borderRadius: 12, overflow: 'hidden', border: '1px solid #333' }}>
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView colorMode="dark">
                <Background color="#1a1f2e" gap={24} />
                <Controls />
                <MiniMap nodeColor={(n: Node) => n.type === 'mcu' ? '#00d2ff' : n.type === 'wheel' ? '#ff8c00' : n.type === 'sensor' ? '#1890ff' : '#9254de'} style={{ background: '#0d0f14' }} />
            </ReactFlow>
        </div>
    );
};

export const WiringCanvas: React.FC = () => {
    return (
        <div style={{ padding: '24px 32px 0 32px' }}>
            <Title level={2}>⚡ 电气连接拓扑图</Title>
            <Text type="secondary">主控制器与各驱动、传感器之间的总线/网络连接关系图。</Text>
            <div style={{ marginTop: 16 }}>
                <ReactFlowProvider>
                    <WiringCanvasInner />
                </ReactFlowProvider>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 12, color: '#888', fontSize: 13 }}>
                <span><span style={{ color: '#00d2ff' }}>■</span> MCU</span>
                <span><span style={{ color: '#ff8c00' }}>■</span> CAN 总线 (驱动/IO)</span>
                <span><span style={{ color: '#1890ff' }}>■</span> Ethernet (传感器)</span>
                <span><span style={{ color: '#52c41a' }}>■</span> USB/串口</span>
                <span><span style={{ color: '#9254de' }}>■</span> IO 扩展板</span>
            </div>
        </div>
    );
};
