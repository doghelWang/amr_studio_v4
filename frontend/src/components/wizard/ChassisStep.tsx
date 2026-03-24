import React, { useEffect } from 'react';
import { Form, InputNumber, Select, Row, Col, Divider, Card, Typography, Tabs, Tooltip } from 'antd';
import { BuildOutlined, ColumnWidthOutlined, HolderOutlined, ThunderboltOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { PowerSystemStep } from './PowerSystemStep';

const { Option } = Select;
const { Title, Text } = Typography;

export const ChassisStep: React.FC = () => {
    const { config, setIdentity, updateAttribute } = useProjectStore();
    const { identity } = config;

    const handleUpdate = (fields: any) => {
        setIdentity(fields);
    };

    const chassisComponent = config.components.find(c => c.category === 'CHASSIS');
    const privateAttrs = chassisComponent ? chassisComponent.privateAttrs : [];
    
    // Find motionCenterAttr group
    const motionCenterGroup = privateAttrs.find(g => g.key === 'motionCenterAttr');

    // ━━━ CRITICAL FIX: Auto-initialize motionCenterAttr when missing ━━━
    useEffect(() => {
        if (!chassisComponent) return;
        const hasGroup = chassisComponent.privateAttrs?.find(g => g.key === 'motionCenterAttr');
        if (!hasGroup) {
            // Initialize with identity defaults
            const idleHead = identity.headOffset ?? identity.chassisLength / 2;
            const idleTail = identity.tailOffset ?? identity.chassisLength / 2;
            const idleLeft = identity.leftOffset ?? identity.chassisWidth / 2;
            const idleRight = identity.rightOffset ?? identity.chassisWidth / 2;

            const initAttrs = [
                { key: 'headOffset(Idle)', desc: '前向距(空载)', type: 'DATA_DOUBLE' as const, value: idleHead, unit: 'mm', boolParse: true, boolMustfill: true },
                { key: 'tailOffset(Idle)', desc: '后向距(空载)', type: 'DATA_DOUBLE' as const, value: idleTail, unit: 'mm', boolParse: true, boolMustfill: true },
                { key: 'leftOffset(Idle)', desc: '左向距(空载)', type: 'DATA_DOUBLE' as const, value: idleLeft, unit: 'mm', boolParse: true, boolMustfill: true },
                { key: 'rightOffset(Idle)', desc: '右向距(空载)', type: 'DATA_DOUBLE' as const, value: idleRight, unit: 'mm', boolParse: true, boolMustfill: true },
                { key: 'headOffset (Full Load)', desc: '前向距(满载)', type: 'DATA_DOUBLE' as const, value: idleHead, unit: 'mm', boolParse: true },
                { key: 'tailOffset (Full Load)', desc: '后向距(满载)', type: 'DATA_DOUBLE' as const, value: idleTail, unit: 'mm', boolParse: true },
                { key: 'leftOffset (Full Load)', desc: '左向距(满载)', type: 'DATA_DOUBLE' as const, value: idleLeft, unit: 'mm', boolParse: true },
                { key: 'rightOffset (Full Load)', desc: '右向距(满载)', type: 'DATA_DOUBLE' as const, value: idleRight, unit: 'mm', boolParse: true },
            ];

            useProjectStore.getState().updateComponent(chassisComponent.id, {
                privateAttrs: [
                    ...(chassisComponent.privateAttrs || []),
                    { key: 'motionCenterAttr', desc: '运动中心偏移', elements: initAttrs }
                ]
            });
        }
    }, [chassisComponent?.id]);

    const motionCenterEles = motionCenterGroup ? motionCenterGroup.elements : [];

    const getMotionCenterVal = (key: string) => {
        const ele = motionCenterEles.find(e => e.key === key) as any;
        return ele ? (ele.value ?? ele.doubleValue ?? ele.double_value ?? 0) : 0;
    };

    const setMotionCenterVal = (key: string, v: number | null) => {
        if (chassisComponent) {
            updateAttribute(chassisComponent.id, 'motionCenterAttr', key, v ?? 0);
        }
    };

    // Calculate normalized preview dimensions
    const previewScale = 0.12; 
    const rectWidth = identity.chassisWidth * previewScale;
    const rectHeight = identity.chassisLength * previewScale;
    
    const headIdle = getMotionCenterVal('headOffset(Idle)') || identity.headOffset;
    const leftIdle = getMotionCenterVal('leftOffset(Idle)') || identity.leftOffset;
    
    const centerX = leftIdle * previewScale;
    const centerY = headIdle * previewScale;


    return (
        <div className="content-grid" style={{ padding: 0 }}>
            <Tabs defaultActiveKey="chassis" tabPosition="top" style={{ padding: '0 24px' }}>
                <Tabs.TabPane tab={<span><BuildOutlined /> 底盘参数</span>} key="chassis">
                    <div className="section-title" style={{ marginTop: 16 }}>
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

                            <Divider orientation="left" plain>
                                <small>运动中心偏移 - 空载 (Idle)  
                                    <Tooltip title="以底盘运动中心为原点，到四周边界的距离。空载与满载可独立设置，默认值相同。">
                                        <InfoCircleOutlined style={{ marginLeft: 6, color: 'var(--text-muted)' }} />
                                    </Tooltip>
                                </small>
                            </Divider>
                            
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="前向距 (Head Offset)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={getMotionCenterVal('headOffset(Idle)')} 
                                            suffix="mm"
                                            onChange={v => setMotionCenterVal('headOffset(Idle)', v)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="后向距 (Tail Offset)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={getMotionCenterVal('tailOffset(Idle)')} 
                                            suffix="mm"
                                            onChange={v => setMotionCenterVal('tailOffset(Idle)', v)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="左向距 (Left Offset)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={getMotionCenterVal('leftOffset(Idle)')} 
                                            suffix="mm"
                                            onChange={v => setMotionCenterVal('leftOffset(Idle)', v)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="右向距 (Right Offset)">
                                        <InputNumber 
                                            style={{ width: '100%' }}
                                            value={getMotionCenterVal('rightOffset(Idle)')} 
                                            suffix="mm"
                                            onChange={v => setMotionCenterVal('rightOffset(Idle)', v)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left" plain><small>运动中心偏移 - 满载 (Full Load)</small></Divider>
                            
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="前向距 (Head Offset)">
                                        <InputNumber style={{ width: '100%' }} value={getMotionCenterVal('headOffset (Full Load)')} suffix="mm" onChange={v => setMotionCenterVal('headOffset (Full Load)', v)} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="后向距 (Tail Offset)">
                                        <InputNumber style={{ width: '100%' }} value={getMotionCenterVal('tailOffset (Full Load)')} suffix="mm" onChange={v => setMotionCenterVal('tailOffset (Full Load)', v)} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="左向距 (Left Offset)">
                                        <InputNumber style={{ width: '100%' }} value={getMotionCenterVal('leftOffset (Full Load)')} suffix="mm" onChange={v => setMotionCenterVal('leftOffset (Full Load)', v)} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="右向距 (Right Offset)">
                                        <InputNumber style={{ width: '100%' }} value={getMotionCenterVal('rightOffset (Full Load)')} suffix="mm" onChange={v => setMotionCenterVal('rightOffset (Full Load)', v)} />
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
                </Tabs.TabPane>
                
                <Tabs.TabPane tab={<span><ThunderboltOutlined /> 动力配置聚合</span>} key="power">
                    <div style={{ marginTop: 16, height: 'calc(100vh - 200px)' }}>
                        <PowerSystemStep />
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};
