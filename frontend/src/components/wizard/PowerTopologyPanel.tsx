import React, { useMemo } from 'react';
import { Card, Tag, Tooltip, Typography, Empty, Row, Col, Badge, Button } from 'antd';
import {
    ThunderboltOutlined, RetweetOutlined, PlusCircleOutlined,
    LinkOutlined, DisconnectOutlined,
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { DRIVE_TYPE_LABELS } from '../../store/types';
import type { ComponentConfig } from '../../store/types';

const { Text } = Typography;

// ━━━ Drive type → expected wheel count ━━━
const DRIVE_WHEEL_COUNTS: Record<string, number> = {
    STANDARD_DIFF: 2,
    SINGLE_STEER: 1,
    DUAL_STEER: 2,
    QUAD_STEER: 4,
};

// ━━━ Category key helpers ━━━
const isWheel = (c: ComponentConfig) => c.category === 'DRIVEWHEEL';
const isDriver = (c: ComponentConfig) => c.category === 'DRIVER' || c.category === 'DRIVE';
const isMotor = (c: ComponentConfig) => c.category === 'ACTOR'; // ACTOR maps to motor/actuator in proto
const isEncoder = (c: ComponentConfig) =>
    c.category === 'SENSOR' && (
        (c.subModuleTypeKey || '').toLowerCase().includes('encode') ||
        (c.mainModuleTypeKey || '').toLowerCase().includes('encoder')
    );

// ━━━ Slot card for a component that may or may not be filled ━━━
const SlotCard: React.FC<{
    label: string;
    comp?: ComponentConfig;
    color?: string;
    onAdd?: () => void;
}> = ({ label, comp, color = '#388bfd', onAdd }) => {
    if (comp) {
        return (
            <div style={{
                background: 'rgba(56,139,253,0.06)',
                border: `1px solid ${color}44`,
                borderRadius: 8,
                padding: '8px 12px',
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
            }}>
                <Badge color={color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f6fc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comp.alias}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comp.name}</div>
                </div>
                <Tag color="geekblue" style={{ fontSize: 9, margin: 0, borderRadius: 4 }}>{label}</Tag>
            </div>
        );
    }
    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: 8,
            padding: '8px 12px',
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: onAdd ? 'pointer' : 'default',
            opacity: 0.6,
        }} onClick={onAdd}>
            {onAdd ? <PlusCircleOutlined style={{ color: 'var(--text-muted)' }} /> : <DisconnectOutlined style={{ color: 'var(--text-muted)' }} />}
            <Text type="secondary" style={{ fontSize: 11 }}>未配置 {label}</Text>
        </div>
    );
};

// ━━━ WheelTopologyGroup: one wheel with its driver/motor/encoder slots ━━━
const WheelTopologyGroup: React.FC<{
    index: number;
    wheel: ComponentConfig | undefined;
    driver: ComponentConfig | undefined;
    motor: ComponentConfig | undefined;
    encoder: ComponentConfig | undefined;
    posLabel: string;
}> = ({ index, wheel, driver, motor, encoder, posLabel }) => {
    const hasAll = wheel && driver;
    return (
        <Card
            size="small"
            variant="borderless"
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: hasAll ? '1px solid rgba(56,139,253,0.3)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
            }}
        >
            {/* Wheel Group Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <ThunderboltOutlined style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f6fc' }}>
                    轮组 #{index + 1}
                    <Tag style={{ marginLeft: 8, fontSize: 9, borderRadius: 4 }} color="default">{posLabel}</Tag>
                </span>
                {hasAll && <Badge status="success" text={<Text style={{ fontSize: 10, color: '#3fb950' }}>完整</Text>} />}
            </div>

            {/* Chain: Wheel → Driver → Motor → Encoder */}
            <SlotCard label="驱动轮" comp={wheel} color="#58a6ff" />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2, opacity: 0.5 }}>
                <LinkOutlined style={{ transform: 'rotate(90deg)', fontSize: 12, color: 'var(--text-muted)' }} />
            </div>
            <SlotCard label="驱动器" comp={driver} color="#d2a8ff" />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2, opacity: 0.5 }}>
                <LinkOutlined style={{ transform: 'rotate(90deg)', fontSize: 12, color: 'var(--text-muted)' }} />
            </div>
            <SlotCard label="电机" comp={motor} color="#ffa657" />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2, opacity: 0.5 }}>
                <LinkOutlined style={{ transform: 'rotate(90deg)', fontSize: 12, color: 'var(--text-muted)' }} />
            </div>
            <SlotCard label="编码器" comp={encoder} color="#3fb950" />
        </Card>
    );
};

// ━━━ Position labels by drive type and index ━━━
const POSITION_LABELS: Record<string, string[]> = {
    STANDARD_DIFF: ['左驱动轮', '右驱动轮'],
    SINGLE_STEER: ['舵轮'],
    DUAL_STEER: ['前舵轮', '后舵轮'],
    QUAD_STEER: ['左前舵轮', '右前舵轮', '左后舵轮', '右后舵轮'],
};

// ━━━ Main PowerTopologyPanel ━━━
export const PowerTopologyPanel: React.FC<{ onAddComponent?: () => void }> = ({ onAddComponent }) => {
    const { config } = useProjectStore();
    const { components, identity } = config;
    const driveType = identity.driveType;
    const expectedCount = DRIVE_WHEEL_COUNTS[driveType] || 2;
    const posLabels = POSITION_LABELS[driveType] || [];

    const wheels = useMemo(() => components.filter(isWheel), [components]);
    const drivers = useMemo(() => components.filter(isDriver), [components]);
    const motors = useMemo(() => components.filter(isMotor), [components]);
    const encoders = useMemo(() => components.filter(isEncoder), [components]);

    const groups = useMemo(() => {
        return Array.from({ length: Math.max(expectedCount, wheels.length) }, (_, i) => ({
            wheel: wheels[i],
            driver: drivers[i],
            motor: motors[i],
            encoder: encoders[i],
            posLabel: posLabels[i] || `轮组 ${i + 1}`,
        }));
    }, [wheels, drivers, motors, encoders, expectedCount, posLabels]);

    const isComplete = wheels.length >= expectedCount && drivers.length >= expectedCount;

    return (
        <div style={{ padding: '16px 0' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>
                        <RetweetOutlined style={{ marginRight: 8 }} />
                        动力拓扑 · {DRIVE_TYPE_LABELS[driveType as keyof typeof DRIVE_TYPE_LABELS]}
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        需要配置 {expectedCount} 套轮组·驱动·电机·编码器，当前已配置 {wheels.length} 套轮组
                    </Text>
                </div>
                {!isComplete && (
                    <Button
                        size="small"
                        type="dashed"
                        icon={<PlusCircleOutlined />}
                        onClick={onAddComponent}
                        style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                    >
                        添加组件
                    </Button>
                )}
            </div>

            {/* Wheel Groups */}
            {groups.length === 0 ? (
                <Empty
                    description={<Text type="secondary" style={{ fontSize: 12 }}>尚未添加任何轮组，请点击"新增"按钮</Text>}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <Row gutter={[12, 12]}>
                    {groups.map((g, i) => (
                        <Col span={expectedCount <= 2 ? 12 : 6} key={i}>
                            <WheelTopologyGroup
                                index={i}
                                wheel={g.wheel}
                                driver={g.driver}
                                motor={g.motor}
                                encoder={g.encoder}
                                posLabel={g.posLabel}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            {/* Completion tip */}
            {isComplete && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(63,185,80,0.08)', borderRadius: 8, border: '1px solid rgba(63,185,80,0.2)', fontSize: 11, color: '#3fb950' }}>
                    ✓ 动力系统配置完整，{expectedCount} 套轮组已全部关联驱动器
                </div>
            )}
        </div>
    );
};

export default PowerTopologyPanel;
