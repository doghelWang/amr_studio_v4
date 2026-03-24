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
        setIdentity(fields);
    };

    // Calculate normalized preview dimensions
    const previewScale = 0.12; 
    const rectWidth = identity.chassisWidth * previewScale;
    const rectHeight = identity.chassisLength * previewScale;
    
    // Motion center relative to top-left of the bounding box
    // (headOffset is distance from front edge to center)
    const centerX = identity.leftOffset * previewScale;
    const centerY = identity.headOffset * previewScale;

    return (
        <div className="content-grid">
            <div className="section-title">
                <BuildOutlined /> 2. 底盘规格与动力学包络
            </div>

            <Row gutter={24}>
                {/* ━━━ Physical Dimensions ━━━ */}
                <Col span={12}>
                    <Card className="smart-card" variant="borderless">
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
                                            suffix="mm"
                                            onChange={v => handleUpdate({ chassisLength: v })} 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="车宽 (W)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={identity.chassisWidth} 
                                            suffix="mm"
                                            onChange={v => handleUpdate({ chassisWidth: v })} 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="车高 (H)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={identity.chassisHeight} 
                                            suffix="mm"
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

                            <Divider orientation="left" plain><small>运动中心偏移 (Offsets)</small></Divider>
                            
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="前向偏移 (Head Offset)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={identity.headOffset} 
                                            suffix="mm"
                                            onChange={v => handleUpdate({ headOffset: v })} 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="后向偏移 (Tail Offset)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={identity.tailOffset} 
                                            suffix="mm"
                                            onChange={v => handleUpdate({ tailOffset: v })} 
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="左侧偏移 (Left Offset)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={identity.leftOffset} 
                                            suffix="mm"
                                            onChange={v => handleUpdate({ leftOffset: v })} 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="右侧偏移 (Right Offset)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={identity.rightOffset} 
                                            suffix="mm"
                                            onChange={v => handleUpdate({ rightOffset: v })} 
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                {/* ━━━ Dynamic Center Preview ━━━ */}
                <Col span={12}>
                    <Card className="smart-card" variant="borderless" style={{ height: '100%' }}>
                        <Title level={5} style={{ color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <HolderOutlined /> 实时运动中心预览
                        </Title>
                        
                        <div style={{ 
                            flex: 1, height: '320px', background: '#0d1117', 
                            borderRadius: 8, border: '1px solid var(--border-default)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative'
                        }}>
                            <svg width="240" height="240" viewBox="0 0 240 240">
                                {/* Grid Lines */}
                                <defs>
                                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#21262d" strokeWidth="0.5"/>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                                
                                {/* Chassis Shape */}
                                <g transform={`translate(${120 - rectWidth/2}, ${120 - rectHeight/2})`}>
                                    {identity.chassisShape === 'BOX' ? (
                                        <rect 
                                            width={rectWidth} height={rectHeight} 
                                            fill="rgba(56, 139, 253, 0.1)" 
                                            stroke="var(--accent-color)" 
                                            strokeWidth="2"
                                            rx="4"
                                        />
                                    ) : (
                                        <ellipse 
                                            cx={rectWidth/2} cy={rectHeight/2} 
                                            rx={rectWidth/2} ry={rectHeight/2}
                                            fill="rgba(56, 139, 253, 0.1)" 
                                            stroke="var(--accent-color)" 
                                            strokeWidth="2"
                                        />
                                    )}

                                    {/* Motion Center Crosshair */}
                                    <g transform={`translate(${centerX}, ${centerY})`}>
                                        <line x1="-15" y1="0" x2="15" y2="0" stroke="#f85149" strokeWidth="2" />
                                        <line x1="0" y1="-15" x2="0" y2="15" stroke="#f85149" strokeWidth="2" />
                                        <circle r="4" fill="#f85149" />
                                        <text x="8" y="-8" fill="#f85149" fontSize="10">Motion Center</text>
                                    </g>
                                </g>
                                
                                {/* Front Indicator */}
                                <text x="120" y="15" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">FRONT (Head)</text>
                                <path d="M 115 25 L 120 20 L 125 25" fill="none" stroke="var(--text-secondary)" strokeWidth="1" />
                            </svg>
                        </div>
                        
                        <div style={{ marginTop: 20 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                提示：运动中心（Motion Center）通常位于驱动轴中心。修改偏移量将自动同步其相对位置。
                            </Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
