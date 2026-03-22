import React from 'react';
import { Tag } from 'antd';
import { ApiOutlined, SwapOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';

export const WiringStep: React.FC = () => {
    const { config } = useProjectStore();
    const components = config.components;

    const allInterfaces = components.flatMap(comp =>
        comp.interfaces.map(iface => ({
            compId: comp.id,
            compLabel: comp.alias || comp.name,
            ...iface,
        }))
    );

    return (
        <>
            <div className="section-header">
                <div className="section-icon"><ApiOutlined /></div>
                <div>
                    <h2 className="section-title">接口连线一览</h2>
                    <div className="section-subtitle">展示所有组件的通信接口定义与连接关系</div>
                </div>
            </div>

            {allInterfaces.length === 0 ? (
                <div className="glass-card empty-state">
                    <div className="empty-icon">🔌</div>
                    <div className="empty-text">暂无接口定义，请先添加带接口的组件</div>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: 'var(--space-md)' }}>
                    <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                        {allInterfaces.map((iface, idx) => (
                            <div
                                key={iface.interfaceUuid || idx}
                                className="comp-list-item"
                                style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
                            >
                                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <SwapOutlined style={{ color: 'var(--accent-text)' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                                            {iface.key}
                                        </span>
                                        <Tag className="tag-blue">{iface.type}</Tag>
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                        {iface.compLabel}
                                        {iface.desc ? ` — ${iface.desc}` : ''}
                                    </div>
                                </div>
                                {iface.path && (
                                    <Tag className="tag-green" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{iface.path}</Tag>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
