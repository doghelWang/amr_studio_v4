import React from 'react';
import { Form, InputNumber, Select, Row, Col, Divider, Card, Typography } from 'antd';
import { BuildOutlined, ColumnWidthOutlined, HolderOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';

const { Option } = Select;
const { Title, Text } = Typography;

export const ChassisStep: React.FC = () => {
    const { config, setIdentity } = useProjectStore();
    const { identity } = config;

    const handleUpdate = (fields: any) => {
        setIdentity({ ...identity, ...fields });
    };

    return (
        <div className="content-grid">
            <div className="section-title">
                <BuildOutlined /> 2. 底盘规格与动力学包络
            </div>

            <Row gutter={24}>
                {/* ━━━ Physical Dimensions ━━━ */}
                <Col span={12}>
                    <Card className="smart-card" bordered={false}>
                        <Title level={5} style={{ color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ColumnWidthOutlined /> 物理包络 (Bounding Box)
                        </Title>
                        
                        <Form layout="vertical">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label="车长 (L)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={identity.chassisLength} 
                                            addonAfter="mm"
                                            onChange={v => handleUpdate({ chassisLength: v })} 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="车宽 (W)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={identity.chassisWidth} 
                                            addonAfter="mm"
                                            onChange={v => handleUpdate({ chassisWidth: v })} 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="车高 (H)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={identity.chassisHeight} 
                                            addonAfter="mm"
                                            onChange={v => handleUpdate({ chassisHeight: v })} 
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="外形轮廓 (chassisShape)">
                                <Select value={identity.chassisShape} onChange={v => handleUpdate({ chassisShape: v })}>
                                    <Option value="BOX">● 矩形 (BOX)</Option>
                                    <Option value="CYLINDER">● 圆形 (CYLINDER)</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* ━━━ Dynamic Center ━━━ */}
                <Col span={12}>
                    <Card className="smart-card" bordered={false} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Title level={5} style={{ color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <HolderOutlined /> 运动中心偏移 (Dynamic Core)
                        </Title>
                        
                        <div style={{ flex: 1, background: '#0d1117', borderRadius: 8, border: '1px solid var(--border-default)', padding: 20, position: 'relative', overflow: 'hidden' }}>
                            {/* SVG Preview Logic Placeholder */}
                            <div style={{ 
                                width: '100%', height: '150px', 
                                border: '2px dashed var(--border-strong)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center' 
                            }}>
                                <BuildOutlined style={{ fontSize: 40, color: 'var(--border-strong)' }} />
                            </div>
                            
                            <div style={{ marginTop: 20 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    提示：運動中心是機器人旋轉的物理原點。通常位於驅動軸線的中点。
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
