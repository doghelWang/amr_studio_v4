import React, { useState } from 'react';
import { Layout, Menu, Empty, Typography, Card, Row, Col, Tag, Alert, Divider, Space, Button } from 'antd';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import { 
    ThunderboltOutlined, SettingOutlined, RobotOutlined,
    ArrowRightOutlined, PlusCircleOutlined, InfoCircleOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Drive type → wheel topology definition
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DRIVE_TOPOLOGY: Record<string, { label: string; groups: Array<{ label: string; roles: string[] }> }> = {
    STANDARD_DIFF: {
        label: '标准差速底盘',
        groups: [
            { label: '左驱动轮组', roles: ['驱动轮 (driveWheel)', '行走电机 (motor)', '驱动器 (driver)'] },
            { label: '右驱动轮组', roles: ['驱动轮 (driveWheel)', '行走电机 (motor)', '驱动器 (driver)'] },
        ],
    },
    SINGLE_STEER: {
        label: '单舵轮底盘',
        groups: [
            { label: '主舵轮组', roles: ['舵轮 (steerWheel)', '行走电机 (walkMotor)', '转向电机 (steerMotor)', '驱动器 (driver)'] },
        ],
    },
    DUAL_STEER: {
        label: '双舵轮底盘',
        groups: [
            { label: '前舵轮组', roles: ['舵轮 (steerWheel)', '行走电机 (walkMotor)', '转向电机 (steerMotor)', '驱动器 (driver)'] },
            { label: '后舵轮组', roles: ['舵轮 (steerWheel)', '行走电机 (walkMotor)', '转向电机 (steerMotor)', '驱动器 (driver)'] },
        ],
    },
    OMNI_WHEEL: {
        label: '全向轮底盘',
        groups: [
            { label: '轮组1', roles: ['麦轮 (omniWheel)', '驱动电机 (motor)', '驱动器 (driver)'] },
            { label: '轮组2', roles: ['麦轮 (omniWheel)', '驱动电机 (motor)', '驱动器 (driver)'] },
            { label: '轮组3', roles: ['麦轮 (omniWheel)', '驱动电机 (motor)', '驱动器 (driver)'] },
            { label: '轮组4', roles: ['麦轮 (omniWheel)', '驱动电机 (motor)', '驱动器 (driver)'] },
        ],
    },
};

// ━━━ Map component to topology role based on name/category ━━━
const getRoleTag = (c: any): string => {
    const cat = c.category || '';
    const name = (c.name || '').toLowerCase();
    const alias = (c.alias || '').toLowerCase();
    if (cat === 'DRIVEWHEEL') return '驱动轮';
    if (name.includes('steer') || alias.includes('舵轮')) return '舵轮';
    if (cat === 'DRIVER') return '驱动器';
    if (cat === 'ACTOR') return '执行器';
    if (name.includes('motor') || alias.includes('电机')) return '电机';
    if (alias.includes('编码') || name.includes('encoder') || name.includes('encode')) return '编码器';
    return cat;
};

const ROLE_COLOR: Record<string, string> = {
    '驱动轮': 'blue',
    '舵轮': 'geekblue',
    '驱动器': 'cyan',
    '电机': 'green',
    '执行器': 'purple',
    '编码器': 'gold',
};

export const PowerSystemStep: React.FC = () => {
    const { config, projectId } = useProjectStore();
    
    const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);

    // Power-related components
    const powerComponents = config.components.filter(c => {
        const cat = c.category;
        const alias = (c.alias || '').toLowerCase();
        const name = (c.name || '').toLowerCase();
        return cat === 'DRIVEWHEEL' || cat === 'DRIVER' || cat === 'ACTOR' || (cat as string) === 'MOTOR'
            || name.includes('motor') || alias.includes('电机') 
            || alias.includes('轮') || alias.includes('减速')
            || alias.includes('编码器') || alias.includes('编码') || name.includes('encoder') || name.includes('encode');
    });

    const driveType = config.identity.driveType || 'STANDARD_DIFF';
    const topology = DRIVE_TOPOLOGY[driveType] || DRIVE_TOPOLOGY['STANDARD_DIFF'];

    const selectedComp = powerComponents.find(c => c.id === localSelectedId);

    if (powerComponents.length === 0) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <Alert
                    icon={<ThunderboltOutlined />}
                    message={`当前底盘类型：${topology.label}`}
                    description={
                        <div>
                            <Text style={{ fontSize: 12 }}>根据底盘类型，需要在【组件库 → 动力系统】中添加以下模块：</Text>
                            <ul style={{ margin: '8px 0', paddingLeft: 20, fontSize: 12 }}>
                                {topology.groups.map((g, i) => (
                                    <li key={i}><strong>{g.label}</strong>：{g.roles.join(' → ')}</li>
                                ))}
                            </ul>
                        </div>
                    }
                    type="info"
                    showIcon
                    style={{ maxWidth: 560, textAlign: 'left' }}
                />
            </div>
        );
    }

    return (
        <Layout style={{ height: '100%', background: 'transparent' }}>
            {/* ━━━ Left: Topology View ━━━ */}
            <Sider width={280} theme="light" style={{ borderRight: '1px solid var(--border-color)', background: 'transparent', overflowY: 'auto' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                    <Title level={5} style={{ margin: 0, fontSize: 13 }}>
                        <ThunderboltOutlined /> 动力拓扑结构
                    </Title>
                    <Text type="secondary" style={{ fontSize: 11 }}>{topology.label}</Text>
                </div>

                {/* ━━━ Topology Groups (wheel-centric) ━━━ */}
                <div style={{ padding: '8px 12px' }}>
                    {topology.groups.map((group, gi) => (
                        <Card
                            key={gi}
                            size="small"
                            title={<span style={{ fontSize: 12 }}><RobotOutlined /> {group.label}</span>}
                            style={{ marginBottom: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
                            styles={{ body: { padding: '8px 12px' } }}
                        >
                            {group.roles.map((role, ri) => (
                                <div key={ri} style={{ marginBottom: 4 }}>
                                    <ArrowRightOutlined style={{ fontSize: 9, marginRight: 6, color: 'var(--text-muted)' }} />
                                    <Text style={{ fontSize: 11, color: 'var(--text-muted)' }}>{role}</Text>
                                </div>
                            ))}
                        </Card>
                    ))}

                    <Divider style={{ margin: '8px 0', borderColor: 'var(--border-subtle)' }}>
                        <Text style={{ fontSize: 10, color: 'var(--text-muted)' }}>已添加动力模块</Text>
                    </Divider>

                    {/* ━━━ Actual components list ━━━ */}
                    <Menu
                        mode="inline"
                        selectedKeys={localSelectedId ? [localSelectedId] : []}
                        style={{ borderRight: 0, background: 'transparent' }}
                        items={powerComponents.map(c => {
                            const role = getRoleTag(c);
                            return {
                                key: c.id,
                                icon: <SettingOutlined />,
                                label: (
                                    <Space size={4}>
                                        <span style={{ fontSize: 12 }}>{c.alias || c.name}</span>
                                        <Tag color={ROLE_COLOR[role] || 'default'} style={{ fontSize: 9, margin: 0, padding: '0 4px' }}>{role}</Tag>
                                    </Space>
                                ),
                                onClick: () => setLocalSelectedId(c.id),
                            };
                        })}
                    />
                </div>
            </Sider>

            {/* ━━━ Right: Property Panel ━━━ */}
            <Content style={{ padding: '0 16px', overflowY: 'auto' }}>
                {localSelectedId ? (
                    <>
                        <div style={{ padding: '12px 0 8px' }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                <InfoCircleOutlined style={{ marginRight: 6 }} />
                                注意：修改此处属性不影响该模块在组件库中的原始定义，仅修改当前工程配置。
                            </Text>
                        </div>
                        <ComponentPropertyPanel 
                            projectId={projectId} 
                            selectedUuid={localSelectedId} 
                        />
                    </>
                ) : (
                    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        <ThunderboltOutlined style={{ fontSize: 32, color: 'var(--text-muted)' }} />
                        <Text type="secondary">请从左侧列表中选择动力节点进行配置</Text>
                        <Text type="secondary" style={{ fontSize: 11, textAlign: 'center', maxWidth: 280 }}>
                            动力系统各组件（轮组、电机、驱动器、编码器）可在此集中查看和编辑各自属性，无需进入组件库逐一查找。
                        </Text>
                    </div>
                )}
            </Content>
        </Layout>
    );
};
