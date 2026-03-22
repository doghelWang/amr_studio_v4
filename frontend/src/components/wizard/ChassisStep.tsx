import React from 'react';
import { Form, InputNumber, Select, Row, Col, Divider } from 'antd';
import { BuildOutlined, ColumnWidthOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';

const { Option } = Select;

export const ChassisStep: React.FC = () => {
    const { config, setIdentity } = useProjectStore();
    const { identity } = config;

    return (
        <>
            <div className="section-header">
                <div className="section-icon"><BuildOutlined /></div>
                <div>
                    <h2 className="section-title">底盘物理参数</h2>
                    <div className="section-subtitle">定义车体外形和尺寸，单位为毫米 (mm)</div>
                </div>
            </div>

            <div className="glass-card">
                <Form layout="vertical" className="glass-form" colon={false}>
                    <Form.Item label="底盘形状">
                        <Select
                            value={identity.chassisShape}
                            onChange={v => setIdentity({ chassisShape: v as 'BOX' | 'CYLINDER' })}
                            size="large"
                        >
                            <Option value="BOX">▬ 矩形 (BOX)</Option>
                            <Option value="CYLINDER">● 圆形 (CYLINDER)</Option>
                        </Select>
                    </Form.Item>

                    <Divider style={{ borderColor: 'var(--border-subtle)', margin: '16px 0' }} />

                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item label="长度 L (mm)">
                                <InputNumber
                                    prefix={<ColumnWidthOutlined style={{ color: 'var(--text-muted)' }} />}
                                    value={identity.chassisLength}
                                    onChange={v => setIdentity({ chassisLength: v ?? 0 })}
                                    min={0} max={10000}
                                    style={{ width: '100%' }}
                                    size="large"
                                    addonAfter="mm"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="宽度 W (mm)">
                                <InputNumber
                                    value={identity.chassisWidth}
                                    onChange={v => setIdentity({ chassisWidth: v ?? 0 })}
                                    min={0} max={10000}
                                    style={{ width: '100%' }}
                                    size="large"
                                    addonAfter="mm"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="高度 H (mm)">
                                <InputNumber
                                    value={identity.chassisHeight}
                                    onChange={v => setIdentity({ chassisHeight: v ?? 0 })}
                                    min={0} max={5000}
                                    style={{ width: '100%' }}
                                    size="large"
                                    addonAfter="mm"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>

            {/* Visual Dimension Preview */}
            <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                <div style={{
                    display: 'inline-block',
                    border: '2px solid var(--accent)',
                    borderRadius: identity.chassisShape === 'CYLINDER' ? '50%' : 'var(--radius-md)',
                    width: Math.min(300, Math.max(80, identity.chassisLength / 5)),
                    height: Math.min(200, Math.max(60, identity.chassisWidth / 5)),
                    position: 'relative',
                    boxShadow: 'var(--shadow-glow)',
                    transition: 'all var(--duration-normal) var(--ease-out)',
                }}>
                    <span style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'var(--accent-text)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        whiteSpace: 'nowrap',
                    }}>
                        {identity.chassisLength} × {identity.chassisWidth} mm
                    </span>
                </div>
                <div style={{ marginTop: 'var(--space-md)', color: 'var(--text-muted)', fontSize: 11 }}>
                    底盘预览（比例缩放）
                </div>
            </div>
        </>
    );
};
