import React from 'react';
import { Card, Form, Input, InputNumber, Typography, Divider, Row, Col, Select } from 'antd';
import { useProjectStore } from '../store/useProjectStore';
import { NAV_METHOD_LABELS, DRIVE_TYPE_LABELS } from '../store/types';
import { useUIStore } from '../store/useUIStore';

const { Title } = Typography;

export const IdentityForm: React.FC = () => {
    const { config, setIdentity } = useProjectStore();
    const { identity } = config;
    const { openDriveConfirm } = useUIStore();

    return (
        <div style={{ padding: 32, maxWidth: 800 }}>
            <Title level={2}>🤖 机器人基础信息</Title>
            <Divider />
            <Card bordered={false} style={{ background: '#141414', borderColor: '#333' }}>
                <Form layout="vertical">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="AMR 型号名称" required>
                                <Input value={identity.robotName} onChange={e => setIdentity({ robotName: e.target.value })} size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="ModelSet 版本 (X.Y)" required>
                                <Input value={identity.version} onChange={e => setIdentity({ version: e.target.value })} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="导航方式">
                                <Select
                                    value={identity.navigationMethod}
                                    onChange={v => setIdentity({ navigationMethod: v })}
                                    options={Object.entries(NAV_METHOD_LABELS).map(([k, v]) => ({ value: k, label: v }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="驱动拓扑">
                                <Select
                                    value={identity.driveType}
                                    onChange={v => openDriveConfirm(identity.driveType, v)}
                                    options={Object.entries(DRIVE_TYPE_LABELS).map(([k, l]) => ({ value: k, label: l }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left" style={{ borderColor: '#444' }}>底盘尺寸 (影响蓝图渲染)</Divider>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="底盘长度 (mm)" tooltip="+X轴方向">
                                <InputNumber value={identity.chassisLength} onChange={v => setIdentity({ chassisLength: v ?? 1200 })} style={{ width: '100%' }} size="large" min={100} max={5000} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="底盘宽度 (mm)" tooltip="Y轴方向">
                                <InputNumber value={identity.chassisWidth} onChange={v => setIdentity({ chassisWidth: v ?? 800 })} style={{ width: '100%' }} size="large" min={100} max={3000} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
};
