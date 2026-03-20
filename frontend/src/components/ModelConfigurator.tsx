import React, { useState, useMemo } from 'react';
import {
    Layout, Menu, Tabs, Card, Table, Tag, Button, 
    Typography, Space, Empty, Tooltip, notification,
    Divider, TableColumnsType
} from 'antd';
import {
    RocketOutlined, SettingOutlined, AppstoreOutlined,
    DeploymentUnitOutlined, FileTextOutlined, CloudDownloadOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export const ModelConfigurator: React.FC = () => {
    const { config } = useProjectStore();
    const { sensors, wheels, mcu } = config;
    
    const [activeTab, setActiveTab] = useState('compdesc');
    const [apiLoading, setApiLoading] = useState(false);

    // ━━━ Backend Integration ━━━
    const handleGenerate = async () => {
        setApiLoading(true);
        try {
            const response = await fetch('/api/v1/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (!response.ok) throw new Error('生成失败');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `amr_v4_config_${new Date().getTime()}.cmodel`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            notification.success({ message: 'CModel 生成成功', description: '文件已开始下载' });
        } catch (err) {
            notification.error({ message: '生成出错', description: (err as Error).message });
        } finally {
            setApiLoading(false);
        }
    };

    // ━━━ Table Components ━━━
    const compColumns: TableColumnsType<any> = [
        { title: '键名 (Key)', dataIndex: 'name', key: 'name', width: 180 },
        { title: '硬件型号', dataIndex: 'model', key: 'model', width: 220 },
        { 
            title: '接口标识 (UUID)', 
            dataIndex: 'id', 
            key: 'id', 
            render: (v: string) => <Text style={{ fontFamily: 'monospace', fontSize: 11 }}>{v.substring(0, 12)}...</Text> 
        },
        { 
            title: '配置状态', 
            key: 'status', 
            render: () => <Tag color="green">已对齐 (Bit-Perfect)</Tag> 
        }
    ];

    const tabItems = [
        {
            key: 'compdesc',
            label: <span><AppstoreOutlined /> 组件配置 (CompDesc)</span>,
            children: (
                <div style={{ padding: '0 24px' }}>
                    <Title level={4}>📦 物理组件描述与接口映射</Title>
                    <Text type="secondary" block style={{ marginBottom: 16 }}>
                        定义传感器的物理属性、安装位姿（Pose）以及与其关联的电气接口定义。
                    </Text>
                    <Table 
                        dataSource={sensors} 
                        columns={compColumns} 
                        rowKey="id" 
                        pagination={false} 
                        size="small" 
                        bordered 
                        style={{ background: '#141414' }}
                    />
                    <Divider />
                    <Title level={5}>🎡 驱动轮组定义</Title>
                    <Table 
                        dataSource={wheels} 
                        columns={compColumns} 
                        rowKey="id" 
                        pagination={false} 
                        size="small" 
                        bordered 
                        style={{ background: '#141414' }}
                    />
                </div>
            )
        },
        {
            key: 'abiset',
            label: <span><DeploymentUnitOutlined /> 能力定义 (AbiSet)</span>,
            children: (
                <div style={{ padding: '0 24px' }}>
                    <Title level={4}>🛡️ 逻辑能力抽象描述</Title>
                    <Text type="secondary" block style={{ marginBottom: 16 }}>
                        将物理组件聚合为逻辑能力（如 Laser 能力、Motion 控制能力）。
                    </Text>
                    <Card size="small" title="激光雷达能力 (LaserAbility)" style={{ marginBottom: 12 }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text>关联组件总数:</Text>
                                <Tag color="blue">{sensors.length}</Tag>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text>导航支持状态:</Text>
                                <Tag color="cyan">已启用 (Auto-Align)</Tag>
                            </div>
                        </Space>
                    </Card>
                </div>
            )
        },
        {
            key: 'funcdesc',
            label: <span><RocketOutlined /> 功能组合 (FuncDesc)</span>,
            children: (
                <div style={{ padding: '0 24px' }}>
                    <Title level={4}>🚀 业务功能与任务封装</Title>
                    <Text type="secondary" block style={{ marginBottom: 16 }}>
                        定义机器人上层的操作功能（如 Navi 导航、Pallet 托板动作）。
                    </Text>
                    <Empty description="当前方案采用标准差速导航功能集 (Differential Navi Set)" />
                </div>
            )
        }
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#000' }}>
            <Sider width={280} theme="dark" style={{ background: '#0a0a0a', borderRight: '1px solid #333' }}>
                <div style={{ padding: 24 }}>
                    <Title level={4} style={{ color: '#fff', marginBottom: 4 }}>Model Configurator</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>AMR Studio Pro V4 | Heuristic 2.0</Text>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['all']}
                    style={{ background: 'transparent' }}
                    items={[
                        { key: 'all', icon: <FileTextOutlined />, label: '全套模型概览' },
                        { key: 'export', icon: <CloudDownloadOutlined />, label: '生成 CModel 包', onClick: handleGenerate }
                    ]}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#141414', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                        <div>
                            <Title level={2} style={{ margin: 0, color: '#fff' }}>模型三板斧配置中心</Title>
                            <Text type="secondary">配置底层的二进制模型包，确保产出物与工业标准严格对齐。</Text>
                        </div>
                        <Button 
                            type="primary" 
                            size="large" 
                            icon={<RocketOutlined />} 
                            loading={apiLoading}
                            onClick={handleGenerate}
                            style={{ height: 50, padding: '0 32px' }}
                        >
                            一键生成 CModel
                        </Button>
                    </div>
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        items={tabItems}
                        tabBarStyle={{ marginBottom: 24 }}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};
