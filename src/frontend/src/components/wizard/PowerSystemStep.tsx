import React, { useState, useMemo, useCallback } from 'react';
import { Typography, Card, Row, Col, Tag, Divider, Space, Button, Tree, Empty, message, Switch, Tooltip } from 'antd';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import { 
    ThunderboltOutlined, SettingOutlined, 
    BuildOutlined, DeploymentUnitOutlined,
    ClusterOutlined, PartitionOutlined
} from '@ant-design/icons';
import type { ComponentConfig } from '../../store/types';

const { Title, Text } = Typography;

const ROLE_COLOR: Record<string, string> = {
    'DRIVEWHEEL': 'blue',
    'DRIVER': 'cyan',
    'MOTOR': 'green',
    'SENSOR': 'gold',
};

export const PowerSystemStep: React.FC = () => {
    const { config, updateComponent, updateAttribute, updateStructuralParam } = useProjectStore();
    const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

    // ━━━ 1. Pure Power Filter ━━━
    const powerComponents = useMemo(() => config.components.filter(c => {
        const cat = c.category;
        const alias = (c.alias || '').toLowerCase();
        const subType = (c.subModuleTypeKey || '').toLowerCase();
        
        // Only include core power chain categories
        if (['DRIVEWHEEL', 'DRIVER', 'MOTOR'].includes(cat)) return true;
        
        // Include encoders from SENSOR category
        if (cat === 'SENSOR' && (alias.includes('编码') || subType.includes('encode'))) return true;
        
        return false;
    }), [config.components]);

    // ━━━ 2. Build Hierarchy: Wheel(1) -> [Driver(2) -> Motor(3), Encoder(2)] ━━━
    const buildTree = (parentId: string | null): any[] => {
        const children = powerComponents.filter(c => {
            if (parentId === null) {
                // Root Level: Pick all wheels regardless of their actual parent (chassis)
                return c.category === 'DRIVEWHEEL';
            }
            return c.parentNodeUuid === parentId;
        });

        return children.map(c => ({
            title: (
                <Space size={4}>
                    <span style={{ fontSize: 12, fontWeight: selectedUuid === c.id ? 700 : 400 }}>{c.name}</span>
                    <Tag color={ROLE_COLOR[c.category] || 'default'} bordered={false} style={{ fontSize: 8, margin: 0, padding: '0 4px' }}>
                        {c.category === 'SENSOR' ? 'ENCODER' : c.category}
                    </Tag>
                </Space>
            ),
            key: c.id,
            icon: c.category === 'DRIVEWHEEL' ? <BuildOutlined /> : (c.category === 'DRIVER' ? <DeploymentUnitOutlined /> : <SettingOutlined />),
            children: buildTree(c.id)
        }));
    };

    const treeData = useMemo(() => buildTree(null), [powerComponents, selectedUuid]);

    const activeComp = useMemo(() => 
        config.components.find(c => c.id === selectedUuid), 
    [config.components, selectedUuid]);

    return (
        <Row gutter={24} style={{ height: '100%' }}>
            {/* Left: Topology Tree (Hierarchy View) */}
            <Col span={8}>
                <Card 
                    className="smart-card" 
                    variant="borderless" 
                    style={{ height: '100%', background: 'rgba(255,255,255,0.02)' }}
                    title={<span style={{ color: 'var(--accent)' }}><ClusterOutlined /> 动力拓扑架构 (轮-驱-电)</span>}
                >
                    {treeData.length > 0 ? (
                        <Tree
                            showIcon
                            defaultExpandAll
                            className="dark-tree"
                            treeData={treeData}
                            onSelect={(keys) => setSelectedUuid(keys[0] as string)}
                            selectedKeys={selectedUuid ? [selectedUuid] : []}
                        />
                    ) : (
                        <Empty description="未探测到动力组件" />
                    )}
                    
                    <Divider />
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <PartitionOutlined /> 提示：系统已根据父节点引用自动组装级联树。差速舵轮组将显示为 1个轮组挂载 2个驱动及 2个电机。
                    </div>
                </Card>
            </Col>

            {/* Right: Full Property Editor (Attributes, Interfaces, Coords) */}
            <Col span={16}>
                {activeComp ? (
                    <ComponentPropertyPanel 
                        component={activeComp}
                        onAttributeChange={(groupId, attrKey, val, subKey) => {
                            updateAttribute(activeComp.id, groupId, attrKey, val, subKey);
                        }}
                        onInterfaceChange={(ifaceUuid, data) => {
                            const updated = activeComp.interfaces.map(i => i.interfaceUuid === ifaceUuid ? { ...i, ...data } : i);
                            updateComponent(activeComp.id, { interfaces: updated });
                        }}
                        onInterfaceParamChange={(ifaceUuid, params) => {
                            const updated = activeComp.interfaces.map(i => i.interfaceUuid === ifaceUuid ? { ...i, interfaceParams: params } : i);
                            updateComponent(activeComp.id, { interfaces: updated });
                        }}
                        onStructuralChange={(data) => {
                            updateComponent(activeComp.id, data);
                        }}
                    />
                ) : (
                    <Card className="smart-card" variant="borderless" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Empty description="请在左侧选择动力节点进行配置" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Card>
                )}
            </Col>
        </Row>
    );
};
