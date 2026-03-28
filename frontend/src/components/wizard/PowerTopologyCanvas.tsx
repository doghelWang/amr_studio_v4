import React from 'react';
import { Typography, Badge, Space } from 'antd';
import { ComponentConfig, RobotIdentity } from '../../store/types';

const { Text } = Typography;

interface PowerTopologyCanvasProps {
    identity: RobotIdentity;
    components: ComponentConfig[];
    selectedId?: string | null;
    onSelect?: (id: string) => void;
}

export const PowerTopologyCanvas: React.FC<PowerTopologyCanvasProps> = ({ 
    identity, 
    components, 
    selectedId,
    onSelect 
}) => {
    // Scaling and layout constants
    const scale = 0.12;
    const canvasSize = 300;
    const center = canvasSize / 2;

    const chassisW = (identity.chassisWidth || 800) * scale;
    const chassisL = (identity.chassisLength || 1200) * scale;
    const headOffset = (identity.headOffset || 600) * scale;
    const leftOffset = (identity.leftOffset || 400) * scale;

    const wheels = components.filter(c => c.category === 'DRIVEWHEEL' || (c.alias || '').includes('轮'));
    const drivers = components.filter(c => c.category === 'DRIVER');
    const motors = components.filter(c => c.category === 'ACTOR' || (c.category as string) === 'MOTOR');

    // Helper: Find connected components in the chain (Wheel -> Driver -> Motor)
    const getAssociated = (wheelId: string) => {
        const driver = drivers.find(d => d.parentNodeUuid === wheelId);
        const motor = motors.find(m => m.parentNodeUuid === wheelId || (driver && m.parentNodeUuid === driver.id));
        return { driver, motor };
    };

    return (
        <div style={{ 
            background: '#0d1117', borderRadius: 12, border: '1px solid var(--border-default)',
            padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }}>
            <Title level={5} style={{ margin: 0, fontSize: 13, color: '#f0f6fc', marginBottom: 20, letterSpacing: 1.2 }}>
                2-3. PHYSICAL POWER ARCHITECTURE
            </Title>
            
            <svg width="100%" height="320" viewBox={`0 0 ${canvasSize} 320`} style={{ overflow: 'visible' }}>
                <defs>
                    <filter id="glow-power">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <pattern id="grid-power" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#21262d" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                
                <rect width="100%" height="100%" fill="url(#grid-power)" opacity="0.5" />

                <g transform={`translate(${center}, ${center})`}>
                    {/* Ghost Chassis Outline */}
                    <rect 
                        x={-leftOffset} y={-headOffset} width={chassisW} height={chassisL} 
                        fill="rgba(56, 139, 253, 0.02)" stroke="#30363d" strokeWidth="1" strokeDasharray="3,3" rx="4"
                    />

                    {/* Motion Center (Red Cross) */}
                    <path d="M -8 0 L 8 0 M 0 -8 L 0 8" stroke="#f85149" strokeWidth="1" opacity="0.6" />
                    <circle r="2.5" fill="#f85149" />
                    
                    {/* Render Each Wheel Chain */}
                    {wheels.map((wheel) => {
                        const { driver, motor } = getAssociated(wheel.id);
                        const isSelected = selectedId === wheel.id || selectedId === driver?.id || selectedId === motor?.id;
                        
                        const wx = (wheel.mountY || 0) * scale;
                        const wy = -(wheel.mountX || 0) * scale;
                        
                        const wSize = 14;
                        const wLen = 36;

                        return (
                            <g key={wheel.id} transform={`translate(${wx}, ${wy}) rotate(${wheel.mountYaw || 0})`}>
                                {/* Connection lines mapping the topology */}
                                {driver && (
                                    <path 
                                        d={`M ${wSize/2} 0 C ${wSize/2 + 10} 0, ${wSize/2 + 10} 25, ${wSize/2 + 30} 25`} 
                                        stroke={isSelected ? 'var(--accent)' : '#30363d'} strokeWidth="1.5" fill="none" strokeDasharray="2,2" 
                                    />
                                )}
                                {motor && (
                                    <path 
                                        d={`M ${-wSize/2} 0 C ${-wSize/2 - 10} 0, ${-wSize/2 - 10} 25, ${-wSize/2 - 30} 25`} 
                                        stroke={isSelected ? 'var(--accent)' : '#30363d'} strokeWidth="1.5" fill="none" strokeDasharray="2,2" 
                                    />
                                )}

                                {/* Physical Wheel */}
                                <rect 
                                    x={-wSize/2} y={-wLen/2} width={wSize} height={wLen} 
                                    fill={isSelected ? 'var(--accent)' : 'rgba(88, 166, 255, 0.4)'} 
                                    stroke={isSelected ? '#fff' : 'rgba(88, 166, 255, 0.2)'}
                                    strokeWidth={isSelected ? 1.5 : 1} rx="2" cursor="pointer"
                                    onClick={() => onSelect?.(wheel.id)}
                                    filter={isSelected ? 'url(#glow-power)' : ''}
                                />

                                {/* Driver Box (DRV) */}
                                {driver && (
                                    <g transform="translate(45, 25)" cursor="pointer" onClick={() => onSelect?.(driver.id)}>
                                        <rect 
                                            x="-12" y="-10" width="24" height="20" 
                                            fill={selectedId === driver.id ? 'var(--accent)' : '#1c2128'} 
                                            stroke={isSelected ? 'var(--accent)' : '#30363d'} strokeWidth="1" rx="2" 
                                        />
                                        <text dy=".3em" fontSize="7" fill={selectedId === driver.id ? '#fff' : '#8b949e'} textAnchor="middle">DRV</text>
                                    </g>
                                )}

                                {/* Motor Circle (M) */}
                                {motor && (
                                    <g transform="translate(-45, 25)" cursor="pointer" onClick={() => onSelect?.(motor.id)}>
                                        <circle 
                                            r="10" fill={selectedId === motor.id ? 'var(--accent)' : '#23863633'} 
                                            stroke={selectedId === motor.id ? '#fff' : '#238636'} strokeWidth="1" 
                                        />
                                        <text dy=".3em" fontSize="7" fill={selectedId === motor.id ? '#fff' : '#238636'} textAnchor="middle">M</text>
                                    </g>
                                )}

                                <text y={-wLen/2 - 8} fontSize="9" fill={isSelected ? '#fff' : '#8b949e'} textAnchor="middle" fontWeight={isSelected ? 600 : 400}>
                                    {wheel.alias}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>

            <Space wrap style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: 20, border: '1px solid #30363d' }}>
                <span style={{ fontSize: 9, color: '#8b949e' }}><Badge status="processing" color="var(--accent)" /> SELECTED</span>
                <span style={{ fontSize: 9, color: '#8b949e' }}><Badge status="default" color="rgba(88,166,255,0.4)" /> WHEEL</span>
                <span style={{ fontSize: 9, color: '#8b949e' }}><Badge status="default" color="#238636" /> MOTOR</span>
                <span style={{ fontSize: 9, color: '#8b949e' }}><Badge status="default" color="#30363d" /> DRIVER</span>
            </Space>
        </div>
    );
};

const Title = Typography.Title;
