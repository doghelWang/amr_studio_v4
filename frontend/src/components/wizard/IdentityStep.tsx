import React from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Divider } from 'antd';
import { RobotOutlined, TagOutlined, CarOutlined, CompassOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { DRIVE_TYPE_LABELS, NAV_METHOD_LABELS, DriveType, NavigationMethod } from '../../store/types';

const { Option } = Select;

export const IdentityStep: React.FC = () => {
    const { config, setIdentity } = useProjectStore();
    const { identity } = config;

    return (
        <>
            <div className="section-header">
                <div className="section-icon"><RobotOutlined /></div>
                <div>
                    <h2 className="section-title">机器人身份信息</h2>
                    <div className="section-subtitle">定义机器人名称、版本及基础配置参数</div>
                </div>
            </div>

            <div className="glass-card">
                <Form layout="vertical" className="glass-form" colon={false}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item label="机器人名称" required>
                                <Input
                                    prefix={<RobotOutlined style={{ color: 'var(--text-muted)' }} />}
                                    value={identity.robotName}
                                    onChange={e => setIdentity({ robotName: e.target.value })}
                                    placeholder="例如: AMR_200"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="版本号">
                                <Input
                                    prefix={<TagOutlined style={{ color: 'var(--text-muted)' }} />}
                                    value={identity.version}
                                    onChange={e => setIdentity({ version: e.target.value })}
                                    placeholder="1.0.0"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="别名">
                                <Input
                                    value={identity.alias}
                                    onChange={e => setIdentity({ alias: e.target.value })}
                                    placeholder="机器人别名"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider style={{ borderColor: 'var(--border-subtle)', margin: '16px 0' }} />

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="驱动类型">
                                <Select
                                    value={identity.driveType}
                                    onChange={v => setIdentity({ driveType: v as DriveType })}
                                    size="large"
                                >
                                    {Object.entries(DRIVE_TYPE_LABELS).map(([k, v]) => (
                                        <Option key={k} value={k}><CarOutlined /> {v}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="导航方式">
                                <Select
                                    value={identity.navigationMethod}
                                    onChange={v => setIdentity({ navigationMethod: v as NavigationMethod })}
                                    size="large"
                                >
                                    {Object.entries(NAV_METHOD_LABELS).map(([k, v]) => (
                                        <Option key={k} value={k}><CompassOutlined /> {v}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider style={{ borderColor: 'var(--border-subtle)', margin: '16px 0' }} />

                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item label="制造商">
                                <Input
                                    value={identity.venderName}
                                    onChange={e => setIdentity({ venderName: e.target.value })}
                                    placeholder="品牌名称"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="物料编码">
                                <Input
                                    value={identity.materialCode}
                                    onChange={e => setIdentity({ materialCode: e.target.value })}
                                    placeholder="物料编码"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="底盘形状">
                                <Select
                                    value={identity.chassisShape}
                                    onChange={v => setIdentity({ chassisShape: v as 'BOX' | 'CYLINDER' })}
                                >
                                    <Option value="BOX">▬ 矩形 (BOX)</Option>
                                    <Option value="CYLINDER">● 圆形 (CYLINDER)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};
