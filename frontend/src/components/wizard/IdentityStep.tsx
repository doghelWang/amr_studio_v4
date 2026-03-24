import React from 'react';
import { Form, Input, Select, Row, Col, Divider, Card, Space, Typography } from 'antd';
import { 
    RobotOutlined, TagOutlined, DeploymentUnitOutlined, 
    RocketOutlined, ShoppingOutlined, AuditOutlined 
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';

const { Option } = Select;
const { Text, Title } = Typography;

export const IdentityStep: React.FC = () => {
    const { config, setIdentity } = useProjectStore();
    const { identity } = config;

    const handleUpdate = (fields: any) => {
        setIdentity({ ...identity, ...fields });
    };

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
                                            placeholder="例如: AgileX_Hunter_SE" 
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
                                            placeholder="SEER / AgileX / ..." 
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

                            <Form.Item label="驱动类型 (driveType)">
                                <Select 
                                    value={identity.driveType}
                                    onChange={v => handleUpdate({ driveType: v })}
                                >
                                    <Option value="STANDARD_DIFF">标准差速 (Standard Diff)</Option>
                                    <Option value="SINGLE_STEER">单舵轮 (Single Steer)</Option>
                                    <Option value="DOUBLE_STEER">双舵轮 (Double Steer)</Option>
                                    <Option value="OMNI_WHEEL">全向轮 (Omni Wheel)</Option>
                                </Select>
                            </Form.Item>

                            <Divider style={{ margin: '12px 0', borderColor: 'var(--border-subtle)' }} />
                            
                            <Space direction="vertical" size={4}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    <DeploymentUnitOutlined style={{ marginRight: 6 }} />
                                    提示：驱动类型决定了后期 Ability 步骤中可用的运动控制模型。
                                </Text>
                            </Space>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
