import React from 'react';
import { Form, Input, Select, Row, Col, Divider, Card, Space, Typography, Alert, Tag } from 'antd';
import { 
    RobotOutlined, TagOutlined, DeploymentUnitOutlined, 
    RocketOutlined, ShoppingOutlined, AuditOutlined,
    RadarChartOutlined, ThunderboltOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';

const { Option } = Select;
const { Text, Title } = Typography;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Linkage maps: navigation method → required sensors
// driveType → recommended wheel group
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const NAV_SENSOR_MAP: Record<string, { label: string; color: string; sensorHint: string }> = {
    LASER_SLAM: {
        label: '激光 SLAM',
        color: 'blue',
        sensorHint: '必须在【感知避障】中添加导航激光雷达（2D或3D），并关联至导航功能。',
    },
    VISUAL_SLAM: {
        label: '视觉 SLAM',
        color: 'purple',
        sensorHint: '必须在【感知避障】中添加立体相机（深度相机），用于视觉里程计。',
    },
    QR_CODE: {
        label: '二维码导航',
        color: 'green',
        sensorHint: '必须在【感知避障】中添加向下二维码相机，以保证地标识别准确率。',
    },
};

const DRIVE_WHEEL_MAP: Record<string, { label: string; color: string; wheelHint: string; wheelTemplate: string }> = {
    STANDARD_DIFF: {
        label: '标准差速',
        color: 'cyan',
        wheelHint: '推荐轮组：DIFF_WHEELS（差速轮组），含左右驱动轮各1个。',
        wheelTemplate: 'DIFF_WHEELS(差速轮组)',
    },
    SINGLE_STEER: {
        label: '单舵轮',
        color: 'gold',
        wheelHint: '推荐轮组：DIFF_STEER_WHEEL（单差速舵轮），含1个主动舵轮。',
        wheelTemplate: 'DIFF_STEER_WHEEL(单差速舵轮)',
    },
    DUAL_STEER: {
        label: '双舵轮',
        color: 'orange',
        wheelHint: '推荐轮组：DIFF_STEER_WHEELS_DOUBL（双差速舵轮），含2个主动舵轮。',
        wheelTemplate: 'DIFF_STEER_WHEELS_DOUBL(双差速舵轮)',
    },
    OMNI_WHEEL: {
        label: '全向轮',
        color: 'magenta',
        wheelHint: '推荐轮组：全向底盘轮组（3~4轮麦克纳姆轮或万向轮）。',
        wheelTemplate: 'VER_STEER_WHEELS_DOUBL(双立式舵轮)',
    },
};

export const IdentityStep: React.FC = () => {
    const { config, setIdentity } = useProjectStore();
    const { identity } = config;

    const handleUpdate = (fields: any) => {
        setIdentity({ ...identity, ...fields });
    };

    const navInfo = NAV_SENSOR_MAP[identity.navigationMethod] || NAV_SENSOR_MAP['LASER_SLAM'];
    const driveInfo = DRIVE_WHEEL_MAP[identity.driveType] || DRIVE_WHEEL_MAP['STANDARD_DIFF'];

    return (
        <div className="content-grid">
            <div className="section-title">
                <RobotOutlined /> 1. 工程身份与机型初选
            </div>

            <Row gutter={[24, 24]}>
                {/* ━━━ Basic Identity ━━━ */}
                <Col span={14}>
                    <Card className="smart-card" variant="borderless">
                        <Title level={5} style={{ marginBottom: 20, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <TagOutlined style={{ fontSize: 16 }} /> 身份标识 (Metadata)
                        </Title>
                        
                        <Form layout="vertical">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="机器人名称 (robotName)">
                                        <Input 
                                            prefix={<RobotOutlined style={{ color: 'var(--text-muted)' }} />}
                                            placeholder="例如: amr_your_define" 
                                            value={identity.robotName}
                                            onChange={e => handleUpdate({ robotName: e.target.value })}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="物料代码 (materialCode)">
                                        <Input 
                                            prefix={<ShoppingOutlined style={{ color: 'var(--text-muted)' }} />}
                                            placeholder="M-2024-XXX" 
                                            value={identity.materialCode}
                                            onChange={e => handleUpdate({ materialCode: e.target.value })}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="供应商 (venderName)">
                                        <Input 
                                            placeholder="hikrobot / SEER / AgileX / ..." 
                                            value={identity.venderName}
                                            onChange={e => handleUpdate({ venderName: e.target.value })}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="模型版本 (version)">
                                        <Input 
                                            prefix={<AuditOutlined style={{ color: 'var(--text-muted)' }} />}
                                            value={identity.version}
                                            onChange={e => handleUpdate({ version: e.target.value })}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                {/* ━━━ Configuration Strategy ━━━ */}
                <Col span={10}>
                    <Card className="smart-card" variant="borderless" style={{ height: '100%' }}>
                        <Title level={5} style={{ marginBottom: 20, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <RocketOutlined style={{ fontSize: 16 }} /> 核心配置策略 (Core Strategy)
                        </Title>

                        <Form layout="vertical">
                            <Form.Item label="导航方式 (navigationMethod)">
                                <Select 
                                    value={identity.navigationMethod}
                                    onChange={v => handleUpdate({ navigationMethod: v })}
                                    styles={{ popup: { root: { backgroundColor: 'var(--bg-sidebar)' } } }}
                                >
                                    <Option value="LASER_SLAM">激光 SLAM (Laser)</Option>
                                    <Option value="VISUAL_SLAM">视觉 SLAM (Visual)</Option>
                                    <Option value="QR_CODE">二维码导航 (QR Code)</Option>
                                </Select>
                            </Form.Item>

                            {/* ━━━ Navigation Linkage Hint ━━━ */}
                            <Alert
                                message={<span><RadarChartOutlined style={{ marginRight: 6 }} />传感器关联要求</span>}
                                description={navInfo.sensorHint}
                                type="info"
                                showIcon={false}
                                style={{ marginBottom: 16, fontSize: 11, borderRadius: 8 }}
                            />

                            <Form.Item label="驱动类型 (driveType)">
                                <Select 
                                    value={identity.driveType}
                                    onChange={v => handleUpdate({ driveType: v })}
                                >
                                    <Option value="STANDARD_DIFF">标准差速 (Standard Diff)</Option>
                                    <Option value="SINGLE_STEER">单舵轮 (Single Steer)</Option>
                                    <Option value="DUAL_STEER">双舵轮 (Dual Steer)</Option>
                                    <Option value="OMNI_WHEEL">全向轮 (Omni Wheel)</Option>
                                </Select>
                            </Form.Item>

                            {/* ━━━ Drive Type Linkage Hint ━━━ */}
                            <Alert
                                message={<span><ThunderboltOutlined style={{ marginRight: 6 }} />推荐轮组模板</span>}
                                description={
                                    <Space direction="vertical" size={4}>
                                        <span>{driveInfo.wheelHint}</span>
                                        <Tag color={driveInfo.color} icon={<CheckCircleOutlined />}>
                                            {driveInfo.wheelTemplate}
                                        </Tag>
                                    </Space>
                                }
                                type="success"
                                showIcon={false}
                                style={{ fontSize: 11, borderRadius: 8 }}
                            />
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
