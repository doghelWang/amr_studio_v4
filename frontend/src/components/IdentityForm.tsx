import React from 'react';
import { 
    Card, Form, Input, InputNumber, Typography, Divider, 
    Row, Col, Select, Tabs, Space, Tag, Empty 
} from 'antd';
import { useProjectStore } from '../store/useProjectStore';
import { NAV_METHOD_LABELS, DRIVE_TYPE_LABELS } from '../store/types';
import { useUIStore } from '../store/useUIStore';

const { Title, Text } = Typography;

export const IdentityForm: React.FC = () => {
    const { config, setIdentity, updateChassis } = useProjectStore();
    const { identity } = config;
    const { chassis } = identity;
    const { openDriveConfirm } = useUIStore();

    const items = [
        {
            key: 'basic',
            label: '🤖 基础识别 (Identity)',
            children: (
                <Form layout="vertical">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="机器人项目名称" required>
                                <Input value={identity.robotName} onChange={e => setIdentity({ robotName: e.target.value })} size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="ModelSet 软件版本" required>
                                <Input value={identity.version} onChange={e => setIdentity({ version: e.target.value })} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="导航定位系统">
                                <Select
                                    value={identity.navigationMethod}
                                    onChange={v => setIdentity({ navigationMethod: v })}
                                    options={Object.entries(NAV_METHOD_LABELS).map(([k, v]) => ({ value: k, label: v }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="运动学驱动拓扑">
                                <Select
                                    value={identity.driveType}
                                    onChange={v => openDriveConfirm(identity.driveType, v)}
                                    options={Object.entries(DRIVE_TYPE_LABELS).map(([k, l]) => ({ value: k, label: l }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )
        },
        {
            key: 'chassis-meta',
            label: '📦 底盘元数据 (Module Info)',
            children: (
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="模块名称 (Module Name)">
                                <Input value={chassis.name} onChange={v => updateChassis({ name: v.target.value })} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="模块别名 (Alias)">
                                <Input value={chassis.alias} onChange={v => updateChassis({ alias: v.target.value })} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="供应商 (Vendor)">
                                <Input value={chassis.vendor} onChange={v => updateChassis({ vendor: v.target.value })} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="子系统 (Subsystem)">
                                <Input value={chassis.subsystem} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="主类型 (MainType)">
                                <Input value={chassis.mainType} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="子类型 (SubType)">
                                <Input value={chassis.subType} onChange={v => updateChassis({ subType: v.target.value })} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="模块描述 (Description)">
                        <Input.TextArea value={chassis.description} onChange={v => updateChassis({ description: v.target.value })} rows={2} />
                    </Form.Item>
                </Form>
            )
        },
        {
            key: 'chassis-physics',
            label: '📐 物理与运动中心 (Motion Center)',
            children: (
                <Form layout="vertical">
                    <Divider orientation="left">外形尺寸 (Configurable Dimensions)</Divider>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="长 Length (mm)">
                                <InputNumber value={chassis.length} onChange={v => updateChassis({ length: v ?? 1200 })} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="宽 Width (mm)">
                                <InputNumber value={chassis.width} onChange={v => updateChassis({ width: v ?? 800 })} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="高 Height (mm)">
                                <InputNumber value={chassis.height} onChange={v => updateChassis({ height: v ?? 400 })} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="设备形状">
                                <Select value={chassis.shape} onChange={v => updateChassis({ shape: v })} options={[{value: 'BOX', label: '长方体 (Box)'}, {value: 'CYLINDER', label: '圆柱体 (Cylinder)'}]} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">运动中心偏移 (Controlled by Geometry or Manual)</Divider>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="前偏移 Head (Idle)">
                                <InputNumber value={chassis.headOffsetIdle} onChange={v => updateChassis({ headOffsetIdle: v ?? 0 })} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="后偏移 Tail (Idle)">
                                <InputNumber value={chassis.tailOffsetIdle} onChange={v => updateChassis({ tailOffsetIdle: v ?? 0 })} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="左偏移 Left (Idle)">
                                <InputNumber value={chassis.leftOffsetIdle} onChange={v => updateChassis({ leftOffsetIdle: v ?? 0 })} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="右偏移 Right (Idle)">
                                <InputNumber value={chassis.rightOffsetIdle} onChange={v => updateChassis({ rightOffsetIdle: v ?? 0 })} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Text type="secondary" style={{ fontSize: '12px' }}>💡 修改长宽会自动更新中心偏移，您也可以手动微调。</Text>
                </Form>
            )
        },
        {
            key: 'chassis-perf',
            label: '⚡ 性能限制 (Performance)',
            children: (
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Divider orientation="left">线运动 (Linear Motion)</Divider>
                            <Row gutter={8}>
                                <Col span={8}><Form.Item label="空载速度 (mm/s)"><InputNumber value={chassis.maxSpeedIdle} onChange={v => updateChassis({ maxSpeedIdle: v ?? 0 })} /></Form.Item></Col>
                                <Col span={8}><Form.Item label="空载加速度"><InputNumber value={chassis.maxAccIdle} onChange={v => updateChassis({ maxAccIdle: v ?? 0 })} /></Form.Item></Col>
                                <Col span={8}><Form.Item label="空载减速度"><InputNumber value={chassis.maxDecIdle} onChange={v => updateChassis({ maxDecIdle: v ?? 0 })} /></Form.Item></Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={8}><Form.Item label="满载速度 (mm/s)"><InputNumber value={chassis.maxSpeedFull} onChange={v => updateChassis({ maxSpeedFull: v ?? 0 })} /></Form.Item></Col>
                                <Col span={8}><Form.Item label="满载加速度"><InputNumber value={chassis.maxAccFull} onChange={v => updateChassis({ maxAccFull: v ?? 0 })} /></Form.Item></Col>
                                <Col span={8}><Form.Item label="满载减速度"><InputNumber value={chassis.maxDecFull} onChange={v => updateChassis({ maxDecFull: v ?? 0 })} /></Form.Item></Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Divider orientation="left">旋转运动 (Angular Motion)</Divider>
                            <Row gutter={8}>
                                <Col span={8}><Form.Item label="空载角速 (°/s)"><InputNumber value={chassis.maxAngSpeedIdle} onChange={v => updateChassis({ maxAngSpeedIdle: v ?? 0 })} /></Form.Item></Col>
                                <Col span={8}><Form.Item label="空载角加"><InputNumber value={chassis.maxAngAccIdle} onChange={v => updateChassis({ maxAngAccIdle: v ?? 0 })} /></Form.Item></Col>
                                <Col span={8}><Form.Item label="空载角减"><InputNumber value={chassis.maxAngDecIdle} onChange={v => updateChassis({ maxAngDecIdle: v ?? 0 })} /></Form.Item></Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={8}><Form.Item label="满载角速 (°/s)"><InputNumber value={chassis.maxAngSpeedFull} onChange={v => updateChassis({ maxAngSpeedFull: v ?? 0 })} /></Form.Item></Col>
                                <Col span={8}><Form.Item label="满载角加"><InputNumber value={chassis.maxAngAccFull} onChange={v => updateChassis({ maxAngAccFull: v ?? 0 })} /></Form.Item></Col>
                                <Col span={8}><Form.Item label="满载角减"><InputNumber value={chassis.maxAngDecFull} onChange={v => updateChassis({ maxAngDecFull: v ?? 0 })} /></Form.Item></Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            )
        }
    ];

    return (
        <div style={{ padding: 32, maxWidth: 1000 }}>
            <Title level={2}>⚙️ 底盘与机器人配置</Title>
            <Divider />
            <Tabs defaultActiveKey="basic" items={items} />
        </div>
    );
};
