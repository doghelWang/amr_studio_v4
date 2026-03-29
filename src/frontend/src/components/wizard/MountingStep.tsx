import React, { useState } from 'react';
import { Form, InputNumber, Row, Col, Typography, Empty } from 'antd';
import { AimOutlined, CompassOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { CoordinateVisualizer } from '../visualizer/CoordinateVisualizer';

const { Text } = Typography;

export const MountingStep: React.FC<{ onExport?: () => void }> = () => {
    const { config, updateComponent } = useProjectStore();
    const components = config.components;
    const [activeId, setActiveId] = useState<string | undefined>(components[0]?.id);

    if (components.length === 0) {
        return (
            <div style={{ height: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={<Text type="secondary">请先在 Step 3 "组件库" 中添加硬件模块</Text>} 
                />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 180px)' }}>
            {/* ━━━ Left: Graphical Visualizer (70%) ━━━ */}
            <div style={{ flex: '0 0 700px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f6fc' }}>
                            <AimOutlined style={{ marginRight: 8, color: 'var(--accent)' }} /> 
                            物理位置预览
                        </div>
                        <Text type="secondary" style={{ fontSize: 11 }}>2.5D 轴侧图与 2D 正交视图同步联动</Text>
                    </div>
                </div>
                
                <div style={{ 
                    flex: 1, 
                    background: 'rgba(0,0,0,0.3)', 
                    borderRadius: 12, 
                    border: '1px solid var(--border-default)',
                    padding: 20,
                    overflow: 'hidden'
                }}>
                    <CoordinateVisualizer activeId={activeId} onSelect={setActiveId} />
                </div>
            </div>

            {/* ━━━ Right: Coordinate Editor (30%) ━━━ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>安装位姿配置</div>
                    <Text type="secondary" style={{ fontSize: 11 }}>设置 6-DOF 坐标 (mm / °)</Text>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }} className="custom-scrollbar">
                    {components.filter(c => c.category !== 'CHASSIS' || c.id !== 'chassis-root').map(comp => (
                        <div 
                            key={comp.id}
                            onClick={() => setActiveId(comp.id)}
                            style={{ 
                                background: activeId === comp.id ? 'var(--accent-soft)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${activeId === comp.id ? 'var(--accent)' : 'var(--border-default)'}`,
                                borderRadius: 10,
                                padding: '16px 20px',
                                marginBottom: 12,
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {activeId === comp.id && (
                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--accent)' }} />
                            )}
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ 
                                    width: 32, height: 32, borderRadius: 8, 
                                    background: 'rgba(88,166,255,0.1)', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                }}>
                                    <CompassOutlined style={{ color: 'var(--accent)' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: activeId === comp.id ? '#fff' : '#f0f6fc' }}>
                                        {comp.alias || comp.name}
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 10, opacity: 0.6 }}>{comp.type}</Text>
                                </div>
                            </div>

                            <Form layout="vertical" size="small" colon={false}>
                                <Row gutter={[12, 12]}>
                                    {[
                                        { key: 'mountX', label: 'X', color: 'var(--red)' },
                                        { key: 'mountY', label: 'Y', color: 'var(--green)' },
                                        { key: 'mountZ', label: 'Z', color: 'var(--accent)' }
                                    ].map(axis => (
                                        <Col span={8} key={axis.key}>
                                            <Form.Item label={<Text style={{ fontSize: 10, color: 'var(--text-muted)' }}>{axis.label}</Text>} style={{ marginBottom: 0 }}>
                                                <InputNumber
                                                    value={(comp as any)[axis.key] ?? 0}
                                                    onChange={v => updateComponent(comp.id, { [axis.key]: v ?? 0 })}
                                                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)' }}
                                                    bordered={false}
                                                    controls={false}
                                                />
                                            </Form.Item>
                                        </Col>
                                    ))}
                                </Row>
                                <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                                    {[
                                        { key: 'mountRoll', label: 'Roll', color: 'var(--orange)' },
                                        { key: 'mountPitch', label: 'Pitch', color: 'var(--purple)' },
                                        { key: 'mountYaw', label: 'Yaw', color: 'var(--accent-text)' }
                                    ].map(axis => (
                                        <Col span={8} key={axis.key}>
                                            <Form.Item label={<Text style={{ fontSize: 10, color: 'var(--text-muted)' }}>{axis.label}</Text>} style={{ marginBottom: 0 }}>
                                                <InputNumber
                                                    value={(comp as any)[axis.key] ?? 0}
                                                    onChange={v => updateComponent(comp.id, { [axis.key]: v ?? 0 })}
                                                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)' }}
                                                    bordered={false}
                                                    controls={false}
                                                />
                                            </Form.Item>
                                        </Col>
                                    ))}
                                </Row>
                            </Form>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
