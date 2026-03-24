import React from 'react';
import { Form, InputNumber, Row, Col } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';

export const MountingStep: React.FC = () => {
    const { config, updateComponent } = useProjectStore();
    const components = config.components;

    return (
        <>
            <div className="section-header">
                <div className="section-icon"><AimOutlined /></div>
                <div>
                    <h2 className="section-title">安装位姿配置</h2>
                    <div className="section-subtitle">为每个组件设置 6-DOF 安装坐标 (X/Y/Z + Roll/Pitch/Yaw)</div>
                </div>
            </div>

            {components.length === 0 ? (
                <div className="glass-card empty-state">
                    <div className="empty-icon">📍</div>
                    <div className="empty-text">请先在"组件库"中添加组件</div>
                </div>
            ) : (
                components.map(comp => (
                    <div className="glass-card-compact" key={comp.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                            <span style={{ fontSize: 18 }}>📍</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                                    {comp.alias || comp.name}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    {comp.type}
                                </div>
                            </div>
                        </div>
                        <Form layout="vertical" className="glass-form" colon={false} size="small">
                            <Row gutter={12}>
                                {[
                                    { key: 'mountX', label: 'X', color: 'var(--red)', unit: 'mm' },
                                    { key: 'mountY', label: 'Y', color: 'var(--green)', unit: 'mm' },
                                    { key: 'mountZ', label: 'Z', color: 'var(--accent)', unit: 'mm' },
                                    { key: 'mountRoll', label: 'Roll', color: 'var(--orange)', unit: '°' },
                                    { key: 'mountPitch', label: 'Pitch', color: 'var(--purple)', unit: '°' },
                                    { key: 'mountYaw', label: 'Yaw', color: 'var(--accent-text)', unit: '°' },
                                ].map(axis => (
                                    <Col span={4} key={axis.key}>
                                        <Form.Item
                                            label={<span style={{ color: axis.color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{axis.label}</span>}
                                        >
                                            <InputNumber
                                                value={(comp as any)[axis.key] ?? 0}
                                                onChange={v => updateComponent(comp.id, { [axis.key]: v ?? 0 })}
                                                style={{ width: '100%' }}
                                                suffix={axis.unit}
                                            />
                                        </Form.Item>
                                    </Col>
                                ))}
                            </Row>
                        </Form>
                    </div>
                ))
            )}
        </>
    );
};
