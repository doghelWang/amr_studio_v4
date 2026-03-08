import React, { useState } from 'react';
import { Typography, Tag, Drawer } from 'antd';
import { useProjectStore } from '../store/useProjectStore';
import type { SensorConfig, WheelConfig } from '../store/types';

const { Title } = Typography;

// Scale: 1mm → Npx
const SCALE = 0.18;
const CANVAS_W = 900;
const CANVAS_H = 600;
const CX = CANVAS_W / 2;
const CY = CANVAS_H / 2;

interface HoverInfo {
    type: 'wheel' | 'sensor';
    item: WheelConfig | SensorConfig;
    x: number;
    y: number;
}

// Convert mm-offset coords to canvas px
const toPx = (mmX: number, mmY: number) => ({
    px: CX + mmY * SCALE,      // Y+ is to the right on canvas (robot's left)
    py: CY - mmX * SCALE       // X+ is up (robot's front)
});

const SENSOR_ICONS: Record<string, string> = {
    LASER_2D: '📡',
    LASER_3D: '🔵',
    BARCODE: '📷',
    CAMERA_BINOCULAR: '👁️',
    IMU: '🌀'
};

export const RobotCanvas: React.FC = () => {
    const { config } = useProjectStore();
    const { identity, wheels, sensors } = config;
    const { chassisLength, chassisWidth, robotName } = identity;
    const [drawerItem, setDrawerItem] = useState<HoverInfo | null>(null);

    const bodyW = chassisWidth * SCALE;
    const bodyH = chassisLength * SCALE;

    return (
        <div style={{ padding: '24px 32px 0 32px' }}>
            <Title level={2}>🗺️ 安装位置蓝图 (俯视图)</Title>
            <p style={{ color: '#888', margin: '0 0 16px 0' }}>按真实毫米坐标展示各模块安装位置，点击元件查看配置详情。前方 (↑ Head) 为 +X 轴方向。</p>

            <div style={{ display: 'flex', gap: 24 }}>
                <svg width={CANVAS_W} height={CANVAS_H}
                    style={{ background: '#0a0d14', border: '1px solid #222', borderRadius: 12 }}>

                    {/* Grid */}
                    {Array.from({ length: 21 }, (_, i) => i - 10).map(i => (
                        <g key={`grid-${i}`}>
                            <line x1={CX + i * 50} y1={0} x2={CX + i * 50} y2={CANVAS_H} stroke="#1a1f2e" strokeWidth={1} />
                            <line x1={0} y1={CY + i * 50} x2={CANVAS_W} y2={CY + i * 50} stroke="#1a1f2e" strokeWidth={1} />
                        </g>
                    ))}

                    {/* Axes */}
                    <line x1={CX} y1={20} x2={CX} y2={CANVAS_H - 20} stroke="#333" strokeWidth={1} strokeDasharray="4 4" />
                    <line x1={20} y1={CY} x2={CANVAS_W - 20} y2={CY} stroke="#333" strokeWidth={1} strokeDasharray="4 4" />
                    <text x={CX + 4} y={32} fill="#555" fontSize={11}>+X (前/Head)</text>
                    <text x={CANVAS_W - 80} y={CY - 6} fill="#555" fontSize={11}>-Y (右/Right)</text>

                    {/* Robot Chassis Body */}
                    <rect
                        x={CX - bodyW / 2} y={CY - bodyH / 2}
                        width={bodyW} height={bodyH}
                        rx={8}
                        fill="rgba(0, 210, 255, 0.05)"
                        stroke="#00d2ff"
                        strokeWidth={1.5}
                        strokeDasharray="6 4"
                    />
                    {/* Front indicator */}
                    <polygon
                        points={`${CX},${CY - bodyH / 2 - 14} ${CX - 10},${CY - bodyH / 2 + 2} ${CX + 10},${CY - bodyH / 2 + 2}`}
                        fill="#00d2ff"
                    />
                    <text x={CX - 30} y={CY - bodyH / 2 - 20} fill="#00d2ff" fontSize={10}>▲ 前 (Head)</text>
                    <text x={CX - 30} y={CY + 16} fill="#888" fontSize={10} textAnchor="middle">{robotName}</text>

                    {/* Chassis dims */}
                    <text x={10} y={CY + bodyH / 2 + 18} fill="#555" fontSize={10}>
                        {chassisLength}mm × {chassisWidth}mm
                    </text>

                    {/* Wheel Icons */}
                    {wheels.map(w => {
                        const { px, py } = toPx(w.mountX ?? 0, w.mountY ?? 0);
                        if (!isFinite(px) || !isFinite(py)) return null;
                        return (
                            <g key={w.id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setDrawerItem({ type: 'wheel', item: w, x: px, y: py })}
                            >
                                <circle cx={px} cy={py} r={16} fill="#ff8c00" fillOpacity={0.15} stroke="#ff8c00" strokeWidth={2} />
                                <text x={px} y={py + 5} fill="#ff8c00" fontSize={14} textAnchor="middle">⚙️</text>
                                <text x={px} y={py + 28} fill="#ff8c00" fontSize={9} textAnchor="middle"
                                    style={{ fontFamily: 'monospace' }}>
                                    {w.label.length > 10 ? w.label.substring(0, 9) + '…' : w.label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Sensor Icons */}
                    {sensors.map(s => {
                        const { px, py } = toPx(s.mountX ?? 0, s.mountY ?? 0);
                        if (!isFinite(px) || !isFinite(py)) return null;
                        const icon = SENSOR_ICONS[s.type] ?? '📡';
                        return (
                            <g key={s.id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setDrawerItem({ type: 'sensor', item: s, x: px, y: py })}
                            >
                                <circle cx={px} cy={py} r={14} fill="#1890ff" fillOpacity={0.15} stroke="#1890ff" strokeWidth={2} />
                                <text x={px} y={py + 5} fill="#1890ff" fontSize={13} textAnchor="middle">{icon}</text>
                                <text x={px} y={py + 26} fill="#1890ff" fontSize={9} textAnchor="middle"
                                    style={{ fontFamily: 'monospace' }}>
                                    {s.model.length > 12 ? s.model.substring(0, 11) + '…' : s.model}
                                </text>
                                {/* Yaw direction indicator */}
                                <line
                                    x1={px} y1={py}
                                    x2={px + Math.sin(s.mountYaw * Math.PI / 180) * 22}
                                    y2={py - Math.cos(s.mountYaw * Math.PI / 180) * 22}
                                    stroke="#1890ff" strokeWidth={2}
                                    markerEnd="url(#arrow)"
                                />
                            </g>
                        );
                    })}

                    {/* Arrow marker */}
                    <defs>
                        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="#1890ff" />
                        </marker>
                    </defs>
                </svg>

                {/* Legend */}
                <div style={{ width: 180 }}>
                    <div style={{ background: '#141414', border: '1px solid #333', borderRadius: 8, padding: 16 }}>
                        <div style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>图例</div>
                        <div style={{ marginBottom: 8 }}><span style={{ color: '#00d2ff' }}>──</span> 机器人轮廓</div>
                        <div style={{ marginBottom: 8 }}><span style={{ color: '#ff8c00' }}>⚙️</span> 驱动轮组</div>
                        <div style={{ marginBottom: 16 }}><span style={{ color: '#1890ff' }}>📡</span> 传感器 (箭头=朝向)</div>
                        <div style={{ color: '#888', fontSize: 11 }}>点击图标查看详细配置</div>
                    </div>
                    <div style={{ background: '#141414', border: '1px solid #333', borderRadius: 8, padding: 16, marginTop: 12 }}>
                        <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>已配置模块</div>
                        <div>轮组: <Tag color="orange">{wheels.length}</Tag></div>
                        <div>传感器: <Tag color="blue">{sensors.length}</Tag></div>
                    </div>
                </div>
            </div>

            {/* Detail Drawer */}
            <Drawer
                title={!drawerItem ? '' : drawerItem.type === 'wheel'
                    ? `🔩 ${(drawerItem.item as WheelConfig).label}`
                    : `📡 ${(drawerItem.item as SensorConfig).model}`}
                open={!!drawerItem}
                onClose={() => setDrawerItem(null)}
                placement="right"
                width={400}
            >
                {drawerItem && drawerItem.type === 'wheel' && (() => {
                    const w = drawerItem.item as WheelConfig;
                    return (
                        <div style={{ fontFamily: 'monospace', lineHeight: 2.2, fontSize: 13 }}>
                            <div><b>安装位置:</b> [{w.mountX}, {w.mountY}] mm · Yaw {w.mountYaw}°</div>
                            <div><b>驱动型号:</b> {w.driverModel}</div>
                            <div><b>CAN 接口:</b> <Tag color="orange">{w.canBus}</Tag> Node ID: {w.canNodeId}</div>
                            <div><b>电机方向:</b> {w.motorPolarity}</div>
                            <div><b>最大速度:</b> {w.maxVelocityIdle} mm/s (空载) / {w.maxVelocityFull} mm/s (满载)</div>
                            <div><b>加/减速度:</b> {w.maxAccIdle} / {w.maxDecIdle} mm/s² (空载)</div>
                            <div><b>舵轮零位:</b> {w.zeroPos}</div>
                            <div><b>左/右限位:</b> {w.leftLimit}° / {w.rightLimit}°</div>
                        </div>
                    );
                })()}
                {drawerItem && drawerItem.type === 'sensor' && (() => {
                    const s = drawerItem.item as SensorConfig;
                    return (
                        <div style={{ fontFamily: 'monospace', lineHeight: 2.2, fontSize: 13 }}>
                            <div><b>型号:</b> {s.model}</div>
                            <div><b>安装位置:</b> [{s.mountX}, {s.mountY}, {s.mountZ}] mm</div>
                            <div><b>安装姿态:</b> Yaw {s.mountYaw}° / Pitch {s.mountPitch}° / Roll {s.mountRoll}°</div>
                            <div><b>接入方式:</b> <Tag color="blue">{s.connType}</Tag></div>
                            {s.connType === 'ETHERNET' && <>
                                <div><b>IP 地址:</b> <code style={{ color: '#00d2ff' }}>{s.ipAddress}</code></div>
                                <div><b>端口号:</b> {s.port}</div>
                                <div><b>MCU 网口:</b> {s.ethPort}</div>
                            </>}
                            <div><b>用途:</b> {s.usageNavi && <Tag color="cyan">导航</Tag>} {s.usageObs && <Tag color="orange">避障</Tag>}</div>
                        </div>
                    );
                })()}
            </Drawer>
        </div>
    );
};
