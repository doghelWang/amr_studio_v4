import React from 'react';
import { Typography } from 'antd';
import { useProjectStore } from '../../store/useProjectStore';

const { Text } = Typography;

interface ViewProps {
    type: 'iso' | 'top' | 'side';
    width: number;
    height: number;
    components: any[];
    identity: any;
    activeId?: string;
    onSelect?: (id: string) => void;
}

const ViewRenderer: React.FC<ViewProps> = ({ type, width, height, components, identity, activeId, onSelect }) => {
    const { chassisLength = 1200, chassisWidth = 800, chassisHeight = 400 } = identity;
    
    // Increased scale and improved padding
    const maxCoord = Math.max(chassisLength, chassisWidth, 1500);
    const scale = Math.min(width, height) / (maxCoord * 1.4); // Zoomed in more

    const project = (x: number, y: number, z: number) => {
        if (type === 'iso') {
            const isoX = (x - y) * Math.cos(Math.PI / 6);
            const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
            return { x: width / 2 + isoX * scale, y: height / 2 + isoY * scale };
        } else if (type === 'top') {
            return { x: width / 2 + x * scale, y: height / 2 + y * scale };
        } else { // side
            return { x: width / 2 + x * scale, y: height / 2 - z * scale };
        }
    };

    // Helper to draw a 3D Box with better shading
    const renderBox = (cx: number, cy: number, cz: number, l: number, w: number, h: number, color: string, opacity: number, strokeWidth: number = 1) => {
        if (type === 'iso') {
            const p = [
                project(cx - l/2, cy - w/2, cz),       // 0
                project(cx + l/2, cy - w/2, cz),       // 1
                project(cx + l/2, cy + w/2, cz),       // 2
                project(cx - l/2, cy + w/2, cz),       // 3
                project(cx - l/2, cy - w/2, cz + h),   // 4
                project(cx + l/2, cy - w/2, cz + h),   // 5
                project(cx + l/2, cy + w/2, cz + h),   // 6
                project(cx - l/2, cy + w/2, cz + h),   // 7
            ];

            return (
                <g opacity={opacity}>
                    <polygon points={`${p[0].x},${p[0].y} ${p[1].x},${p[1].y} ${p[2].x},${p[2].y} ${p[3].x},${p[3].y}`} fill={color} opacity={0.2} />
                    <polygon points={`${p[0].x},${p[0].y} ${p[1].x},${p[1].y} ${p[5].x},${p[5].y} ${p[4].x},${p[4].y}`} fill={color} opacity={0.4} stroke={color} strokeWidth={strokeWidth} />
                    <polygon points={`${p[1].x},${p[1].y} ${p[2].x},${p[2].y} ${p[6].x},${p[6].y} ${p[5].x},${p[5].y}`} fill={color} opacity={0.6} stroke={color} strokeWidth={strokeWidth} />
                    <polygon points={`${p[4].x},${p[4].y} ${p[5].x},${p[5].y} ${p[6].x},${p[6].y} ${p[7].x},${p[7].y}`} fill={color} opacity={0.3} stroke={color} strokeWidth={strokeWidth} />
                </g>
            );
        } else if (type === 'top') {
            const p1 = project(cx - l/2, cy - w/2, cz);
            const p2 = project(cx + l/2, cy + w/2, cz);
            return <rect x={p1.x} y={p1.y} width={p2.x - p1.x} height={p2.y - p1.y} fill={color} opacity={opacity} stroke={color} strokeWidth={strokeWidth} rx={2} />;
        } else { // side
            const p1 = project(cx - l/2, cy, cz);
            const p2 = project(cx + l/2, cy, cz + h);
            return <rect x={p1.x} y={p2.y} width={p2.x - p1.x} height={p1.y - p2.y} fill={color} opacity={opacity} stroke={color} strokeWidth={strokeWidth} rx={2} />;
        }
    };

    // Render FOV (Field of View) for sensors
    const renderFOV = (x: number, y: number, z: number, yaw: number, range: number, angle: number, color: string) => {
        if (type !== 'iso' && type !== 'top') return null; // Simplified FOV in 2D top or 3D iso
        
        const segments = 12;
        const startRad = (yaw - angle / 2) * Math.PI / 180;
        const pts = [];
        pts.push(project(x, y, z));
        for (let i = 0; i <= segments; i++) {
            const rad = startRad + (i / segments) * (angle * Math.PI / 180);
            pts.push(project(x + Math.cos(rad) * range, y + Math.sin(rad) * range, z));
        }

        const pointsStr = pts.map(p => `${p.x},${p.y}`).join(' ');
        return <polygon points={pointsStr} fill={color} opacity={0.15} stroke={color} strokeWidth={1} strokeDasharray="4 2" />;
    };

    return (
        <svg width={width} height={height} style={{ background: '#0d1117', borderRadius: 12, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)' }}>
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1f6feb" />
                    <stop offset="100%" stopColor="#58a6ff" />
                </linearGradient>
            </defs>

            {/* Brighter Grid */}
            <g opacity={0.15}>
                {[-2000, -1000, 0, 1000, 2000].map(v => (
                    <React.Fragment key={v}>
                        <line x1={project(v, -2000, 0).x} y1={project(v, -2000, 0).y} x2={project(v, 2000, 0).x} y2={project(v, 2000, 0).y} stroke="#30363d" strokeWidth={1} />
                        <line x1={project(-2000, v, 0).x} y1={project(-2000, v, 0).y} x2={project(2000, v, 0).x} y2={project(2000, v, 0).y} stroke="#30363d" strokeWidth={1} />
                    </React.Fragment>
                ))}
                <line x1={project(0, -2000, 0).x} y1={project(0, -2000, 0).y} x2={project(0, 2000, 0).x} y2={project(0, 2000, 0).y} stroke="var(--red)" strokeWidth={2} />
                <line x1={project(-2000, 0, 0).x} y1={project(-2000, 0, 0).y} x2={project(2000, 0, 0).x} y2={project(2000, 0, 0).y} stroke="var(--green)" strokeWidth={2} />
            </g>

            {/* Chassis Detailed Model */}
            {/* Main body */}
            {renderBox(0, 0, 50, chassisLength, chassisWidth, chassisHeight - 50, 'url(#chassisGrad)', 0.4, 2)}
            {/* Upper deck / Payload area */}
            {renderBox(0, 0, chassisHeight, chassisLength * 0.8, chassisWidth * 0.8, 20, '#58a6ff', 0.6, 1)}

            {/* Components & FOV */}
            {components.map(c => {
                const isActive = c.id === activeId;
                const { mountX: x = 0, mountY: y = 0, mountZ: z = 0, mountYaw: yaw = 0 } = c;
                const pos = project(x, y, z);
                
                const isWheel = c.type?.toLowerCase().includes('wheel') || (c.category === 'CHASSIS' && c.id !== 'chassis-root');
                const isLidar = c.type?.toLowerCase().includes('laser') || c.type?.toLowerCase().includes('lidar');
                const isCamera = c.type?.toLowerCase().includes('camera') || c.type?.toLowerCase().includes('tof');

                return (
                    <g key={c.id} onClick={() => onSelect?.(c.id)} style={{ cursor: 'pointer' }}>
                        {/* FOV Layer */}
                        {isLidar && renderFOV(x, y, z, yaw, 800, 270, '#ff7b72')}
                        {isCamera && renderFOV(x, y, z, yaw, 600, 90, '#ffa657')}

                        {/* Shape Layer */}
                        {isWheel ? (
                            <g>
                                {renderBox(x, y, z, 240, 60, 240, '#21262d', 1, 2)} {/* Tire */}
                                {renderBox(x, y, z, 120, 70, 120, '#8b949e', 1, 1)} {/* Hub */}
                            </g>
                        ) : isLidar ? (
                            <g>
                                {renderBox(x, y, z, 100, 100, 80, '#ff7b72', 1, 2)}
                                <circle cx={pos.x} cy={pos.y - 10} r={5} fill="#fff" opacity={0.8} />
                            </g>
                        ) : isCamera ? (
                            <g>
                                {renderBox(x, y, z, 80, 120, 60, '#ffa657', 1, 2)}
                            </g>
                        ) : (
                            <circle cx={pos.x} cy={pos.y} r={6} fill={isActive ? 'var(--accent)' : '#fff'} filter={isActive ? "url(#glow)" : ""} stroke="#000" strokeWidth={1} />
                        )}

                        {/* Label Layer */}
                        {(isActive || isLidar || isCamera) && (
                            <text 
                                x={pos.x + 20} 
                                y={pos.y - 20} 
                                fill={isActive ? "#fff" : "rgba(255,255,255,0.7)"} 
                                fontSize={isActive ? 13 : 11} 
                                fontWeight="bold" 
                                style={{ pointerEvents: 'none', paintOrder: 'stroke', stroke: '#000', strokeWidth: 2, strokeLinejoin: 'round' }}
                            >
                                {c.alias || c.name}
                            </text>
                        )}
                    </g>
                );
            })}

            {/* UI Overlays */}
            <g style={{ pointerEvents: 'none' }}>
                <rect x={15} y={height - 35} width={130} height={20} rx={4} fill="rgba(0,0,0,0.5)" />
                <text x={25} y={height - 20} fill="#f0f6fc" fontSize={11} fontWeight="700" style={{ letterSpacing: 0.5 }}>
                    {type.toUpperCase()} VIEW
                </text>
            </g>
        </svg>
    );
};

export const CoordinateVisualizer: React.FC<{ activeId?: string; onSelect?: (id: string) => void }> = ({ activeId, onSelect }) => {
    const { config } = useProjectStore();
    const { components, identity } = config;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, height: '100%', justifyContent: 'center' }}>
            <div style={{ flex: '1 1 700px' }}>
                <ViewRenderer type="iso" width={700} height={500} components={components} identity={identity} activeId={activeId} onSelect={onSelect} />
            </div>
            <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <ViewRenderer type="top" width={340} height={240} components={components} identity={identity} activeId={activeId} onSelect={onSelect} />
                <ViewRenderer type="side" width={340} height={240} components={components} identity={identity} activeId={activeId} onSelect={onSelect} />
            </div>
        </div>
    );
};
