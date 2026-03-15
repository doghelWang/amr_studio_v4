import React from 'react';
import { Tag, Tooltip } from 'antd';
import { CloseCircleFilled, WarningFilled, CheckCircleFilled } from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import { useUIStore } from '../store/useUIStore';

export const StatusBar: React.FC = () => {
    const { config, validation } = useProjectStore();
    const { toggleHealthDashboard } = useUIStore();

    const { errors, warnings, isCompilable } = validation;
    const { mcu, wheels, sensors, ioBoards } = config;

    // Bus occupancy
    const busMap: Record<string, number> = {};
    wheels.forEach(w => {
        (w.components || []).forEach(c => {
            if (c.canBus) busMap[c.canBus] = (busMap[c.canBus] ?? 0) + 1;
        });
    });
    ioBoards.forEach(d => {
        if (d.canBus) busMap[d.canBus] = (busMap[d.canBus] ?? 0) + 1;
    });

    return (
        <div style={{
            height: 26, background: '#0a0c12',
            borderTop: '1px solid #1a1d28',
            display: 'flex', alignItems: 'center',
            padding: '0 16px', gap: 16,
            fontSize: 11, color: '#666',
            userSelect: 'none',
        }}>
            {/* Validation summary */}
            <Tooltip title="点击查看健康度详情">
                <span
                    onClick={toggleHealthDashboard}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    {!isCompilable
                        ? <><CloseCircleFilled style={{ color: '#ff4d4f' }} /> <span style={{ color: '#ff4d4f' }}>{errors.length} 错误</span></>
                        : <><CheckCircleFilled style={{ color: '#52c41a' }} /> <span style={{ color: '#52c41a' }}>配置正常</span></>}
                    {warnings.length > 0 && (
                        <><WarningFilled style={{ color: '#faad14' }} /> <span style={{ color: '#faad14' }}>{warnings.length} 警告</span></>
                    )}
                </span>
            </Tooltip>

            <span style={{ color: '#333' }}>│</span>

            {/* CAN bus occupancy */}
            {mcu.canBuses.map(bus => {
                const count = busMap[bus] ?? 0;
                const color = count > 8 ? 'error' : count > 5 ? 'warning' : 'default';
                return (
                    <Tooltip title={`${bus}: ${count} 个设备 (推荐≤8)`} key={bus}>
                        <Tag color={color} style={{ margin: 0, fontSize: 10, lineHeight: '16px', cursor: 'default' }}>
                            {bus} {count}节点
                        </Tag>
                    </Tooltip>
                );
            })}

            {/* ETH port summary */}
            {mcu.ethPorts.map(port => {
                const count = sensors.filter(s => s.connType === 'ETHERNET' && s.ethPort === port).length;
                const color = count > 1 ? 'error' : 'default';
                return (
                    <Tooltip title={`${port}: ${count} 个传感器`} key={port}>
                        <Tag color={color} style={{ margin: 0, fontSize: 10, lineHeight: '16px', cursor: 'default' }}>
                            {port} {count}设备
                        </Tag>
                    </Tooltip>
                );
            })}

            {/* Spacer */}
            <span style={{ flex: 1 }} />
            <span>AMR Studio Pro v4.0</span>
        </div>
    );
};
