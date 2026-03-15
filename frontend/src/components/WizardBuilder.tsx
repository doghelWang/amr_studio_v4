/**
 * WizardBuilder.tsx
 * AMR Studio Pro V4 — 分步向导式 AMR 构建器
 * 
 * 步骤：
 *   Step 1: 基础配置（底盘/驱动类型/导航）
 *   Step 2: 驱动轮（自动布置）
 *   Step 3: 传感器（添加/配置激光雷达等）
 *   Step 4: 确认并生成
 */
import { useState, useCallback } from 'react';
import {
    Modal, Steps, Button, Input, InputNumber, Select, Switch,
    Space, Tag, Divider, Row, Col, Card, message, Tooltip
} from 'antd';
import {
    RobotOutlined, RadarChartOutlined, CheckCircleOutlined,
    PlusOutlined, DeleteOutlined, InfoCircleOutlined,
    DashboardOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import type { DriveType, NavigationMethod, SensorType, WheelConfig, SensorConfig } from '../store/types';
import {
    DRIVE_TYPE_LABELS, NAV_METHOD_LABELS, SENSOR_MODELS, MCU_MODELS, DRIVER_MODELS, defaultMcu
} from '../store/types';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

// ─── Wheel presets by drive type ──────────────────────────────────

const WHEEL_PRESETS: Record<DriveType, Array<Partial<WheelConfig>>> = {
    DIFFERENTIAL: [
        { label: 'LEFT_WHEEL',  type: 'STANDARD_DIFF', orientation: 'FRONT_LEFT',  mountX: 0, mountY: 250, mountZ: 0, mountYaw: 0, diameter: 200, track: 500 },
        { label: 'RIGHT_WHEEL', type: 'STANDARD_DIFF', orientation: 'FRONT_RIGHT', mountX: 0, mountY: -250, mountZ: 0, mountYaw: 0, diameter: 200, track: 500 },
    ],
    SINGLE_STEER: [
        { label: 'STEER_WHEEL',  type: 'VERTICAL_STEER', orientation: 'CENTER', mountX: 300, mountY: 0, mountZ: 0, mountYaw: 0, diameter: 250, track: 600 },
        { label: 'FRONT_CASTOR', type: 'STANDARD_DIFF', orientation: 'FRONT_CENTER', mountX: 600, mountY: 0, mountZ: 0, mountYaw: 0, diameter: 100, track: 600 },
        { label: 'REAR_CASTOR',  type: 'STANDARD_DIFF', orientation: 'REAR_CENTER', mountX: -600, mountY: 0, mountZ: 0, mountYaw: 0, diameter: 100, track: 600 },
    ],
    DUAL_STEER: [
        { label: 'FRONT_STEER', type: 'VERTICAL_STEER', orientation: 'FRONT_CENTER', mountX: 300, mountY: 0, mountZ: 0, mountYaw: 0, diameter: 250, track: 600 },
        { label: 'REAR_STEER',  type: 'VERTICAL_STEER', orientation: 'REAR_CENTER',  mountX: -300, mountY: 0, mountZ: 0, mountYaw: 0, diameter: 250, track: 600 },
    ],
    QUAD_STEER: [
        { label: 'FL_STEER', type: 'VERTICAL_STEER', orientation: 'FRONT_LEFT',  mountX:  300, mountY:  250, mountZ: 0, mountYaw: 0, diameter: 200, track: 500 },
        { label: 'FR_STEER', type: 'VERTICAL_STEER', orientation: 'FRONT_RIGHT', mountX:  300, mountY: -250, mountZ: 0, mountYaw: 0, diameter: 200, track: 500 },
        { label: 'RL_STEER', type: 'VERTICAL_STEER', orientation: 'REAR_LEFT',   mountX: -300, mountY:  250, mountZ: 0, mountYaw: 0, diameter: 200, track: 500 },
        { label: 'RR_STEER', type: 'VERTICAL_STEER', orientation: 'REAR_RIGHT',  mountX: -300, mountY: -250, mountZ: 0, mountYaw: 0, diameter: 200, track: 500 },
    ],
    MECANUM_4: [
        { label: 'FL_MECANUM', type: 'STANDARD_DIFF', orientation: 'FRONT_LEFT',  mountX:  400, mountY:  300, mountZ: 0, mountYaw: 0, diameter: 200, track: 600 },
        { label: 'FR_MECANUM', type: 'STANDARD_DIFF', orientation: 'FRONT_RIGHT', mountX:  400, mountY: -300, mountZ: 0, mountYaw: 0, diameter: 200, track: 600 },
        { label: 'RL_MECANUM', type: 'STANDARD_DIFF', orientation: 'REAR_LEFT',   mountX: -400, mountY:  300, mountZ: 0, mountYaw: 0, diameter: 200, track: 600 },
        { label: 'RR_MECANUM', type: 'STANDARD_DIFF', orientation: 'REAR_RIGHT',  mountX: -400, mountY: -300, mountZ: 0, mountYaw: 0, diameter: 200, track: 600 },
    ],
    OMNI_3: [
        { label: 'OMNI_FRONT',      type: 'STANDARD_DIFF', orientation: 'FRONT_CENTER', mountX:  300, mountY:    0, mountZ: 0, mountYaw:    0, diameter: 150, track: 500 },
        { label: 'OMNI_REAR_LEFT',  type: 'STANDARD_DIFF', orientation: 'REAR_LEFT',    mountX: -150, mountY:  260, mountZ: 0, mountYaw:  120, diameter: 150, track: 500 },
        { label: 'OMNI_REAR_RIGHT', type: 'STANDARD_DIFF', orientation: 'REAR_RIGHT',   mountX: -150, mountY: -260, mountZ: 0, mountYaw:  240, diameter: 150, track: 500 },
    ],
};

const defaultWheel = (preset: Partial<WheelConfig>): WheelConfig => {
    const type = preset.type || 'STANDARD_DIFF';
    let components: WheelConfig['components'] = [];

    if (type === 'VERTICAL_STEER' || type === 'HORIZONTAL_STEER') {
        components = [
            { 
                role: 'DRIVE_DRIVER', driverModel: 'RA-DR/D-48/80S2B-411BH3', canBus: 'CAN0', canNodeId: 1, motorPolarity: 'FORWARD',
                ratedVoltage: 48, ratedCurrent: 80, ratedSpeed: 3000, gearRatio: 25, encoderType: 'ABSOLUTE', encoderResolution: 17
            },
            { 
                role: 'STEER_DRIVER', driverModel: 'RA-DR/D-48/25DB-311BH3', canBus: 'CAN0', canNodeId: 2, motorPolarity: 'FORWARD',
                ratedVoltage: 48, ratedCurrent: 25, ratedSpeed: 3000, gearRatio: 30, encoderType: 'ABSOLUTE', encoderResolution: 17
            },
        ];
    } else if (type === 'DIFF_STEER') {
        components = [
            { 
                role: 'DRIVE_DRIVER',  driverModel: 'RA-DR/D-48/25DB-311BH3', canBus: 'CAN0', canNodeId: 1, motorPolarity: 'FORWARD',
                ratedVoltage: 48, ratedCurrent: 25, ratedSpeed: 3000, gearRatio: 20, encoderType: 'ABSOLUTE', encoderResolution: 17
            },
            { 
                role: 'DRIVE_DRIVER', driverModel: 'RA-DR/D-48/25DB-311BH3', canBus: 'CAN0', canNodeId: 2, motorPolarity: 'FORWARD',
                ratedVoltage: 48, ratedCurrent: 25, ratedSpeed: 3000, gearRatio: 20, encoderType: 'ABSOLUTE', encoderResolution: 17
            },
            { 
                role: 'STEER_ENCODER', driverModel: 'HIK_ENCODER_H8', canBus: 'CAN0', canNodeId: 3, motorPolarity: 'FORWARD',
                encoderType: 'ABSOLUTE', encoderResolution: 17
            },
        ];
    } else {
        components = [
            { 
                role: 'DRIVE_DRIVER', driverModel: 'RA-DR/D-48/25DB-311BH3', canBus: 'CAN0', canNodeId: 1, motorPolarity: 'FORWARD',
                ratedVoltage: 48, ratedCurrent: 25, ratedSpeed: 3000, gearRatio: 15, encoderType: 'ABSOLUTE', encoderResolution: 17
            },
        ];
    }

    return {
        id: uuidv4(),
        label: preset.label || 'WHEEL',
        type,
        mountX: preset.mountX ?? 0,
        mountY: preset.mountY ?? 0,
        mountZ: preset.mountZ ?? 0,
        mountYaw: preset.mountYaw ?? 0,
        diameter: preset.diameter ?? 200,
        track: preset.track ?? 650,
        orientation: preset.orientation ?? 'CENTER',
        components,
        headOffsetIdle: 30, tailOffsetIdle: 30, leftOffsetIdle: 30, rightOffsetIdle: 30,
        maxVelocityIdle: 1500, maxAccIdle: 800, maxDecIdle: 800,
        headOffsetFull: 40, tailOffsetFull: 40, leftOffsetFull: 40, rightOffsetFull: 40,
        maxVelocityFull: 1200, maxAccFull: 500, maxDecFull: 500,
        zeroPos: 0, leftLimit: -180, rightLimit: 180,
    };
};

const defaultSensor = (): SensorConfig => ({
    id: uuidv4(),
    label: 'laser-front',
    type: 'LASER_2D',
    model: 'SICK_TIM561-2050101',
    mountX: 500, mountY: 0, mountZ: 100,
    mountYaw: 0, mountPitch: 0, mountRoll: 0,
    usageNavi: true, usageObs: true,
    connType: 'ETHERNET',
    ipAddress: '192.168.1.171', port: 2111,
    ethPort: 'ETH0', baudRate: 115200, serialPort: '/dev/ttyS0',
});

// ─── Style tokens ─────────────────────────────────────────────────

const S = {
    card: {
        background: '#0f1117',
        border: '1px solid #1a1d28',
        borderRadius: 10,
        marginBottom: 12,
    },
    label: { color: '#aaa', fontSize: 12, marginBottom: 4 },
    sectionTitle: {
        color: '#00d2ff', fontSize: 13, fontWeight: 700,
        letterSpacing: 0.5, marginBottom: 12,
    },
    deleteBtn: { color: '#ff4d4f', cursor: 'pointer', fontSize: 16 },
    tag: { fontSize: 11, fontWeight: 600, borderRadius: 4 },
};

// ─── Sub-components ───────────────────────────────────────────────

function WheelRow({
    wheel, onChange, onDelete
}: {
    wheel: WheelConfig;
    onChange: (id: string, field: string, val: any) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <Card size="small" style={S.card} styles={{ body: { padding: '10px 14px' } }}>
            <Row align="middle" gutter={8}>
                <Col flex="auto">
                    <Row gutter={8} style={{ marginBottom: 8 }}>
                        <Col span={6}>
                            <div style={S.label}>标签</div>
                            <Input size="small" value={wheel.label}
                                onChange={e => onChange(wheel.id, 'label', e.target.value)} />
                        </Col>
                        <Col span={6}>
                            <div style={S.label}>拓扑类型</div>
                            <Select size="small" style={{ width: '100%' }} value={wheel.type}
                                onChange={v => onChange(wheel.id, 'type', v)}>
                                <Option value="STANDARD_DIFF">标准差速轮 (Drive Only)</Option>
                                <Option value="VERTICAL_STEER">立式舵轮 (Drive + Steer)</Option>
                                <Option value="HORIZONTAL_STEER">卧式舵轮 (Drive + Steer)</Option>
                                <Option value="DIFF_STEER">差速式舵轮 (D-Drive + E-Encoder)</Option>
                            </Select>
                        </Col>
                        <Col span={3}>
                            <div style={S.label}>X (mm)</div>
                            <InputNumber size="small" style={{ width: '100%' }} value={wheel.mountX}
                                onChange={v => onChange(wheel.id, 'mountX', v ?? 0)} />
                        </Col>
                        <Col span={3}>
                            <div style={S.label}>Y (mm)</div>
                            <InputNumber size="small" style={{ width: '100%' }} value={wheel.mountY}
                                onChange={v => onChange(wheel.id, 'mountY', v ?? 0)} />
                        </Col>
                        <Col span={3}>
                            <div style={S.label}>Z (mm)</div>
                            <InputNumber size="small" style={{ width: '100%' }} value={wheel.mountZ}
                                onChange={v => onChange(wheel.id, 'mountZ', v ?? 0)} />
                        </Col>
                        <Col span={3}>
                            <div style={S.label}>角度 (°)</div>
                            <InputNumber size="small" style={{ width: '100%' }} value={wheel.mountYaw}
                                onChange={v => onChange(wheel.id, 'mountYaw', v ?? 0)} />
                        </Col>
                    </Row>

                    {/* Component-level Wiring */}
                    <div style={{ background: '#090b10', padding: 8, borderRadius: 6 }}>
                        <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>🔌 CAN 节点配置 (驱动器/编码器)</div>
                        {wheel.components.map((comp, idx) => (
                            <Row key={idx} gutter={8} align="middle" style={{ marginBottom: 4 }}>
                                <Col span={6}>
                                    <Tag color={comp.role.includes('ENCODER') ? 'orange' : 'blue'} style={S.tag}>
                                        {comp.role === 'DRIVE_DRIVER' ? '行走驱动' : comp.role === 'STEER_DRIVER' ? '转向驱动' : '转向编码器'}
                                    </Tag>
                                </Col>
                                <Col span={7}>
                                    <Select size="small" style={{ width: '100%' }} value={comp.driverModel}
                                        onChange={v => {
                                            const newComps = [...wheel.components];
                                            newComps[idx] = { ...comp, driverModel: v };
                                            onChange(wheel.id, 'components', newComps);
                                        }}>
                                        {DRIVER_MODELS.map(m => <Option key={m} value={m}>{m}</Option>)}
                                    </Select>
                                </Col>
                                <Col span={6}>
                                    <Select size="small" style={{ width: '100%' }} value={comp.canBus}
                                        onChange={v => {
                                            const newComps = [...wheel.components];
                                            newComps[idx] = { ...comp, canBus: v };
                                            onChange(wheel.id, 'components', newComps);
                                        }}>
                                        {['CAN0','CAN1','CAN2','CAN3'].map(c => <Option key={c} value={c}>{c}</Option>)}
                                    </Select>
                                </Col>
                                <Col span={4}>
                                    <InputNumber size="small" style={{ width: '100%' }} min={1} max={127}
                                        value={comp.canNodeId}
                                        onChange={v => {
                                            const newComps = [...wheel.components];
                                            newComps[idx] = { ...comp, canNodeId: v ?? 1 };
                                            onChange(wheel.id, 'components', newComps);
                                        }} />
                                </Col>
                            </Row>
                        ))}
                    </div>
                </Col>
                <Col>
                    <Tooltip title="删除该轮组">
                        <DeleteOutlined style={S.deleteBtn} onClick={() => onDelete(wheel.id)} />
                    </Tooltip>
                </Col>
            </Row>
        </Card>
    );
}

function SensorRow({
    sensor, onChange, onDelete
}: {
    sensor: SensorConfig;
    onChange: (id: string, field: string, val: any) => void;
    onDelete: (id: string) => void;
}) {
    const models = SENSOR_MODELS[sensor.type] || [];
    return (
        <Card size="small" style={S.card} styles={{ body: { padding: '10px 14px' } }}>
            <Row gutter={8} align="middle">
                <Col flex="auto">
                    <Row gutter={8}>
                        <Col span={5}>
                            <div style={S.label}>标签</div>
                            <Input size="small" value={sensor.label}
                                onChange={e => onChange(sensor.id, 'label', e.target.value)} />
                        </Col>
                        <Col span={5}>
                            <div style={S.label}>类型</div>
                            <Select size="small" style={{ width: '100%' }} value={sensor.type}
                                onChange={v => onChange(sensor.id, 'type', v)}>
                                {(Object.keys(SENSOR_MODELS) as SensorType[]).map(t => (
                                    <Option key={t} value={t}>{t.replace(/_/g, ' ')}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={5}>
                            <div style={S.label}>型号</div>
                            <Select size="small" style={{ width: '100%' }} value={sensor.model}
                                onChange={v => onChange(sensor.id, 'model', v)}>
                                {models.map(m => <Option key={m} value={m}>{m}</Option>)}
                            </Select>
                        </Col>
                        <Col span={3}>
                            <div style={S.label}>X (mm)</div>
                            <InputNumber size="small" style={{ width: '100%' }} value={sensor.mountX}
                                onChange={v => onChange(sensor.id, 'mountX', v ?? 0)} />
                        </Col>
                        <Col span={3}>
                            <div style={S.label}>Y (mm)</div>
                            <InputNumber size="small" style={{ width: '100%' }} value={sensor.mountY}
                                onChange={v => onChange(sensor.id, 'mountY', v ?? 0)} />
                        </Col>
                        <Col span={3}>
                            <div style={S.label}>用于导航</div>
                            <Switch size="small" checked={sensor.usageNavi}
                                onChange={v => onChange(sensor.id, 'usageNavi', v)} />
                            <span style={{ marginLeft: 6, color: '#aaa', fontSize: 11 }}>导航</span>
                        </Col>
                    </Row>
                    {sensor.type === 'LASER_2D' && (
                        <Row gutter={8} style={{ marginTop: 8 }}>
                            <Col span={7}>
                                <div style={S.label}>IP 地址</div>
                                <Input size="small" value={sensor.ipAddress}
                                    onChange={e => onChange(sensor.id, 'ipAddress', e.target.value)}
                                    placeholder="192.168.1.171" />
                            </Col>
                            <Col span={4}>
                                <div style={S.label}>端口</div>
                                <InputNumber size="small" style={{ width: '100%' }} value={sensor.port}
                                    onChange={v => onChange(sensor.id, 'port', v ?? 2111)} />
                            </Col>
                        </Row>
                    )}
                </Col>
                <Col>
                    <Tooltip title="删除该传感器">
                        <DeleteOutlined style={S.deleteBtn} onClick={() => onDelete(sensor.id)} />
                    </Tooltip>
                </Col>
            </Row>
        </Card>
    );
}

// ─── Main Wizard ────────────────────────────────────────────────

interface WizardBuilderProps {
    open: boolean;
    onClose: () => void;
}

export function WizardBuilder({ open, onClose }: WizardBuilderProps) {
    const { loadProject } = useProjectStore();
    const [currentStep, setCurrentStep] = useState(0);

    // Step 1 state
    const [robotName, setRobotName] = useState('My_AMR');
    const [version, setVersion] = useState('1.0');
    const [chassisLength, setChassisLength] = useState(1200);
    const [chassisWidth, setChassisWidth] = useState(800);
    const [driveType, setDriveType] = useState<DriveType>('DIFFERENTIAL');
    const [navMethod, setNavMethod] = useState<NavigationMethod>('LIDAR_SLAM');
    const [mcuModel, setMcuModel] = useState(MCU_MODELS[0]);

    // Step 2: wheels (auto-populated from driveType, editable)
    const [wheels, setWheels] = useState<WheelConfig[]>(() =>
        WHEEL_PRESETS.DIFFERENTIAL.map(defaultWheel)
    );

    // Step 3: sensors
    const [sensors, setSensors] = useState<SensorConfig[]>([defaultSensor()]);

    // When driveType changes → reset wheels to preset
    const handleDriveTypeChange = (dt: DriveType) => {
        setDriveType(dt);
        setWheels(WHEEL_PRESETS[dt].map(defaultWheel));
    };

    const updateWheel = useCallback((id: string, field: string, val: any) => {
        setWheels(ws => ws.map(w => w.id === id ? { ...w, [field]: val } : w));
    }, []);

    const deleteWheel = useCallback((id: string) => {
        setWheels(ws => ws.filter(w => w.id !== id));
    }, []);

    const addWheel = () => {
        setWheels(ws => [...ws, defaultWheel({ label: `WHEEL_${ws.length + 1}` })]);
    };

    const updateSensor = useCallback((id: string, field: string, val: any) => {
        setSensors(ss => ss.map(s => {
            if (s.id !== id) return s;
            const updated = { ...s, [field]: val };
            // Reset model when type changes
            if (field === 'type') {
                updated.model = SENSOR_MODELS[val as SensorType]?.[0] || '';
            }
            return updated;
        }));
    }, []);

    const deleteSensor = useCallback((id: string) => {
        setSensors(ss => ss.filter(s => s.id !== id));
    }, []);

    const addSensor = () => {
        setSensors(ss => [...ss, { ...defaultSensor(), id: uuidv4(), label: `sensor-${ss.length + 1}` }]);
    };

    const handleFinish = () => {
        const projectId = uuidv4();
        const now = new Date().toISOString();
        const project = {
            formatVersion: '1.0' as const,
            meta: {
                projectId,
                projectName: robotName,
                createdAt: now,
                modifiedAt: now,
                author: 'Wizard',
                templateOrigin: 'wizard',
                formatVersion: '1.0' as const,
            },
            config: {
                identity: {
                    robotName, version,
                    chassis: {
                        ...useProjectStore.getState().config.identity.chassis, // Get defaults
                        length: chassisLength,
                        width: chassisWidth,
                        name: robotName,
                        alias: robotName,
                    },
                    driveType, navigationMethod: navMethod,
                },
                mcu: { ...defaultMcu(), model: mcuModel },
                wheels,
                sensors,
                ioBoards: [],
                ioPorts: [],
                actuators: [],
                auxiliary: [],
                others: [],
            },
            snapshots: [],
        };
        loadProject(project);
        message.success(`✅ 项目 "${robotName}" 已创建! 可在各面板继续精细配置。`);
        onClose();
        // Reset wizard
        setCurrentStep(0);
    };

    const steps = [
        { title: '基础配置', icon: <RobotOutlined /> },
        { title: '驱动轮',   icon: <DashboardOutlined /> },
        { title: '传感器',   icon: <RadarChartOutlined /> },
        { title: '确认生成', icon: <CheckCircleOutlined /> },
    ];

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ThunderboltOutlined style={{ color: '#00d2ff', fontSize: 18 }} />
                    <span style={{ color: '#fff', fontWeight: 700 }}>AMR 向导式搭建</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={820}
            styles={{
                content: { background: '#090b10', border: '1px solid #1a1d28', borderRadius: 12 },
                header: { background: '#090b10', borderBottom: '1px solid #1a1d28' },
                mask: { backdropFilter: 'blur(4px)' },
            }}
        >
            {/* Step Indicator */}
            <Steps
                current={currentStep}
                items={steps}
                size="small"
                style={{ marginBottom: 24, padding: '4px 0' }}
            />

            {/* ── Step 0: Base Config ── */}
            {currentStep === 0 && (
                <div>
                    <div style={S.sectionTitle}>🤖 底盘与驱动基础配置</div>
                    <Row gutter={16}>
                        <Col span={10}>
                            <div style={S.label}>机器人名称（英文，无空格）</div>
                            <Input
                                value={robotName}
                                onChange={e => setRobotName(e.target.value.replace(/\s/g, '_'))}
                                placeholder="My_AMR"
                                size="middle"
                                style={{ marginBottom: 12 }}
                            />
                        </Col>
                        <Col span={6}>
                            <div style={S.label}>版本号</div>
                            <Input value={version} onChange={e => setVersion(e.target.value)}
                                size="middle" style={{ marginBottom: 12 }} />
                        </Col>
                        <Col span={8}>
                            <div style={S.label}>控制器型号</div>
                            <Select style={{ width: '100%' }} value={mcuModel} onChange={setMcuModel}>
                                {MCU_MODELS.map(m => <Option key={m} value={m}>{m}</Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={S.label}>车体长度 (mm)</div>
                            <InputNumber style={{ width: '100%', marginBottom: 12 }}
                                min={200} max={5000} value={chassisLength}
                                onChange={v => setChassisLength(v ?? 1200)} />
                        </Col>
                        <Col span={12}>
                            <div style={S.label}>车体宽度 (mm)</div>
                            <InputNumber style={{ width: '100%', marginBottom: 12 }}
                                min={200} max={3000} value={chassisWidth}
                                onChange={v => setChassisWidth(v ?? 800)} />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={S.label}>驱动类型</div>
                            <Select style={{ width: '100%', marginBottom: 12 }}
                                value={driveType} onChange={handleDriveTypeChange}>
                                {(Object.entries(DRIVE_TYPE_LABELS) as [DriveType, string][]).map(([k, v]) => (
                                    <Option key={k} value={k}>{v}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={12}>
                            <div style={S.label}>导航方式</div>
                            <Select style={{ width: '100%', marginBottom: 12 }}
                                value={navMethod} onChange={v => setNavMethod(v as NavigationMethod)}>
                                {(Object.entries(NAV_METHOD_LABELS) as [NavigationMethod, string][]).map(([k, v]) => (
                                    <Option key={k} value={k}>{v}</Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666', fontSize: 12, marginTop: 8 }}>
                        <InfoCircleOutlined />
                        选择驱动类型后，下一步将自动布置对应轮组，你可以手动调整位置和参数。
                    </div>
                </div>
            )}

            {/* ── Step 1: Wheels ── */}
            {currentStep === 1 && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={S.sectionTitle}>
                            🛞 驱动轮配置
                            <Tag color="blue" style={{ ...S.tag, marginLeft: 8 }}>{DRIVE_TYPE_LABELS[driveType]}</Tag>
                        </div>
                        <Button size="small" icon={<PlusOutlined />} onClick={addWheel}>添加轮组</Button>
                    </div>
                    <div style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
                        {wheels.length === 0 && (
                            <div style={{ color: '#555', textAlign: 'center', padding: 32 }}>
                                暂无轮组，点击「添加轮组」创建
                            </div>
                        )}
                        {wheels.map(w => (
                            <WheelRow key={w.id} wheel={w}
                                onChange={updateWheel} onDelete={deleteWheel} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Step 2: Sensors ── */}
            {currentStep === 2 && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={S.sectionTitle}>📡 传感器配置</div>
                        <Button size="small" icon={<PlusOutlined />} onClick={addSensor}>添加传感器</Button>
                    </div>
                    <div style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
                        {sensors.length === 0 && (
                            <div style={{ color: '#555', textAlign: 'center', padding: 32 }}>
                                暂无传感器，点击「添加传感器」创建
                            </div>
                        )}
                        {sensors.map(s => (
                            <SensorRow key={s.id} sensor={s}
                                onChange={updateSensor} onDelete={deleteSensor} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Step 3: Confirm ── */}
            {currentStep === 3 && (
                <div>
                    <div style={S.sectionTitle}>✅ 配置确认</div>
                    <Card size="small" style={{ ...S.card, borderColor: '#1a3a4a' }}
                        styles={{ body: { padding: '14px 18px' } }}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <div style={{ marginBottom: 10 }}>
                                    <span style={{ color: '#666', fontSize: 11 }}>机器人名称</span>
                                    <div style={{ color: '#00d2ff', fontWeight: 700, fontSize: 16 }}>{robotName}</div>
                                </div>
                                <div style={{ marginBottom: 10 }}>
                                    <span style={{ color: '#666', fontSize: 11 }}>底盘尺寸</span>
                                    <div style={{ color: '#fff' }}>{chassisLength} × {chassisWidth} mm</div>
                                </div>
                                <div>
                                    <span style={{ color: '#666', fontSize: 11 }}>驱动类型</span>
                                    <div><Tag color="blue" style={S.tag}>{DRIVE_TYPE_LABELS[driveType]}</Tag></div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 10 }}>
                                    <span style={{ color: '#666', fontSize: 11 }}>导航方式</span>
                                    <div style={{ color: '#fff' }}>{NAV_METHOD_LABELS[navMethod]}</div>
                                </div>
                                <div style={{ marginBottom: 10 }}>
                                    <span style={{ color: '#666', fontSize: 11 }}>驱动轮数量</span>
                                    <div style={{ color: '#fff' }}>{wheels.length} 个</div>
                                </div>
                                <div>
                                    <span style={{ color: '#666', fontSize: 11 }}>传感器数量</span>
                                    <div style={{ color: '#fff' }}>{sensors.length} 个</div>
                                </div>
                            </Col>
                        </Row>
                        <Divider style={{ borderColor: '#1a1d28', margin: '12px 0' }} />
                        <div style={{ color: '#666', fontSize: 11 }}>传感器列表</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                            {sensors.map(s => (
                                <Tag key={s.id} color="cyan" style={S.tag}>{s.label} ({s.type.replace(/_/g, ' ')})</Tag>
                            ))}
                            {sensors.length === 0 && <span style={{ color: '#555', fontSize: 12 }}>无传感器</span>}
                        </div>
                    </Card>
                    <div style={{
                        background: '#0a1a10', border: '1px solid #1a3a20',
                        borderRadius: 8, padding: '10px 14px', marginTop: 12,
                        color: '#52c41a', fontSize: 12,
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        <CheckCircleOutlined />
                        点击「完成创建」后，项目将加载到编辑器，你可以在各面板继续精细配置，并通过工具栏「编译」按钮生成 .cmodel 文件。
                    </div>
                </div>
            )}

            {/* Footer Navigation */}
            <Divider style={{ borderColor: '#1a1d28', margin: '20px 0 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(s => s - 1)}
                >
                    上一步
                </Button>
                <Space>
                    <Button onClick={onClose}>取消</Button>
                    {currentStep < steps.length - 1 ? (
                        <Button
                            type="primary"
                            onClick={() => setCurrentStep(s => s + 1)}
                            disabled={!robotName.trim() || wheels.length === 0 && currentStep === 1}
                        >
                            下一步 →
                        </Button>
                    ) : (
                        <Button type="primary" icon={<ThunderboltOutlined />} onClick={handleFinish}>
                            完成创建
                        </Button>
                    )}
                </Space>
            </div>
        </Modal>
    );
}
