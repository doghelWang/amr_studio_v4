import React, { useState, useMemo } from 'react';
import { Typography, Card, Row, Col, Tag, Divider, Space, Button, Tree, Empty, message, Select } from 'antd';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import { projectDriveRatio } from '../../store/domain/driveRatio';
import { 
    ThunderboltOutlined, SettingOutlined, 
    BuildOutlined, DeploymentUnitOutlined,
    ClusterOutlined, PartitionOutlined,
    DeleteOutlined
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
    const {
        config,
        addComponent,
        removeComponent,
        setActiveComponent,
        updateComponent,
        updateAttribute,
        updateStructuralParam
    } = useProjectStore();
    const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
    const [wheelChainType, setWheelChainType] = useState<'diffWheel' | 'horizontalSteerWheel' | 'verticalSteerWheel' | 'diffSteerWheel'>(
        config.identity.driveType?.includes('STEER') ? 'horizontalSteerWheel' : 'diffWheel'
    );

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
                        <span style={{ fontSize: 12, fontWeight: selectedUuid === c.id ? 700 : 400 }}>{c.alias || c.name}</span>
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

    const steeringRatio = useMemo(() => {
        if (!activeComp || activeComp.category !== 'DRIVEWHEEL' || !['horizontalSteerWheel', 'verticalSteerWheel'].includes(activeComp.type)) {
            return null;
        }
        return projectDriveRatio(config, activeComp);
    }, [activeComp, config.components]);

    const getWheelGroupAndKey = (componentId: string, attrKey: string) => {
        const component = useProjectStore.getState().config.components.find(c => c.id === componentId);
        if (!component) return null;
        const hasAttr = (elements: any[] = []): boolean =>
            elements.some((element: any) =>
                element.key === attrKey ||
                (element.comboType?.typeGroups || []).some((typeGroup: any) =>
                    hasAttr(typeGroup.arrayCmobEle || [])
                )
            );
        for (const group of component.privateAttrs || []) {
            if (hasAttr(group.elements || [])) {
                return { groupKey: group.key, attrKey };
            }
        }
        return null;
    };

    const bindWheelAttr = (wheelId: string, attrKey: string, value: string) => {
        const target = getWheelGroupAndKey(wheelId, attrKey);
        if (target) {
            updateAttribute(wheelId, target.groupKey, target.attrKey, value);
        }
    };

    const addPowerChain = () => {
        const isDiffSteer = wheelChainType === 'diffSteerWheel';
        const isSteerWheel = wheelChainType === 'horizontalSteerWheel' || wheelChainType === 'verticalSteerWheel';
        const chainIndex = config.components.filter(c => c.category === 'DRIVEWHEEL').length + 1;
        const chainLabel = isDiffSteer
            ? `差速舵轮组 ${chainIndex}`
            : isSteerWheel
                ? `${wheelChainType === 'verticalSteerWheel' ? '立式' : '卧式'}舵轮组 ${chainIndex}`
                : `差速驱动轮组 ${chainIndex}`;
        const wheelId = addComponent('DRIVEWHEEL', wheelChainType as any);
        if (!wheelId) return;

        updateComponent(wheelId, {
            alias: chainLabel,
            functionalRole: isSteerWheel ? 'steer' : 'walk'
        });

        if (!isSteerWheel && !isDiffSteer) {
            const driverId = addComponent('DRIVER', 'subDriver');
            const motorId = addComponent('MOTOR', 'PMSMMotor');

            if (driverId) {
                updateComponent(driverId, { alias: `${chainLabel} - 驱动器`, functionalRole: 'walk' });
                updateStructuralParam(driverId, { parentNodeUuid: wheelId });
            }
            if (motorId && driverId) {
                updateComponent(motorId, { alias: `${chainLabel} - 电机`, functionalRole: 'walk' });
                updateStructuralParam(motorId, { parentNodeUuid: driverId });
                bindWheelAttr(wheelId, 'relateMotor', motorId);
            }
        } else if (isDiffSteer) {
            const leftDriverId = addComponent('DRIVER', 'subDriver');
            const rightDriverId = addComponent('DRIVER', 'subDriver');
            const leftMotorId = addComponent('MOTOR', 'PMSMMotor');
            const rightMotorId = addComponent('MOTOR', 'PMSMMotor');

            if (leftDriverId) {
                updateComponent(leftDriverId, { alias: `${chainLabel} - 左驱动器`, functionalRole: 'walk_left' });
                updateStructuralParam(leftDriverId, { parentNodeUuid: wheelId });
            }
            if (rightDriverId) {
                updateComponent(rightDriverId, { alias: `${chainLabel} - 右驱动器`, functionalRole: 'walk_right' });
                updateStructuralParam(rightDriverId, { parentNodeUuid: wheelId });
            }
            if (leftMotorId && leftDriverId) {
                updateComponent(leftMotorId, { alias: `${chainLabel} - 左电机`, functionalRole: 'walk_left' });
                updateStructuralParam(leftMotorId, { parentNodeUuid: leftDriverId });
                bindWheelAttr(wheelId, 'relateLeftMotor', leftMotorId);
            }
            if (rightMotorId && rightDriverId) {
                updateComponent(rightMotorId, { alias: `${chainLabel} - 右电机`, functionalRole: 'walk_right' });
                updateStructuralParam(rightMotorId, { parentNodeUuid: rightDriverId });
                bindWheelAttr(wheelId, 'relateRightMotor', rightMotorId);
            }

            // diffSteerWheel's reference schema requires an external encoder.
            const encoderId = addComponent('SENSOR', 'absoluteValueEncode');
            if (encoderId) {
                updateComponent(encoderId, { alias: `${chainLabel} - 外置绝对值编码器` });
                updateStructuralParam(encoderId, { parentNodeUuid: wheelId });
                bindWheelAttr(wheelId, 'relatedEncode', encoderId);
            }
        } else {
            const steerDriverId = addComponent('DRIVER', 'subDriver');
            const walkDriverId = addComponent('DRIVER', 'subDriver');
            const steerMotorId = addComponent('MOTOR', 'PMSMMotor');
            const walkMotorId = addComponent('MOTOR', 'PMSMMotor');

            if (steerDriverId) {
                updateComponent(steerDriverId, { alias: `${chainLabel} - 转向驱动器`, functionalRole: 'steer' });
                updateStructuralParam(steerDriverId, { parentNodeUuid: wheelId });
            }
            if (walkDriverId) {
                updateComponent(walkDriverId, { alias: `${chainLabel} - 行走驱动器`, functionalRole: 'walk' });
                updateStructuralParam(walkDriverId, { parentNodeUuid: wheelId });
            }
            if (steerMotorId && steerDriverId) {
                updateComponent(steerMotorId, { alias: `${chainLabel} - 转向电机`, functionalRole: 'steer' });
                updateStructuralParam(steerMotorId, { parentNodeUuid: steerDriverId });
                bindWheelAttr(wheelId, 'relateRotMotor', steerMotorId);
            }
            if (walkMotorId && walkDriverId) {
                updateComponent(walkMotorId, { alias: `${chainLabel} - 行走电机`, functionalRole: 'walk' });
                updateStructuralParam(walkMotorId, { parentNodeUuid: walkDriverId });
                bindWheelAttr(wheelId, 'relateWalkMotor', walkMotorId);
            }
        }

        setSelectedUuid(wheelId);
        setActiveComponent(wheelId);
        void message.success('已新增一套轮组动力链');
    };

    const addEncoderToSelectedWheel = () => {
        const selectedWheel = config.components.find(c => c.id === selectedUuid && c.category === 'DRIVEWHEEL')
            || powerComponents.find(c => c.category === 'DRIVEWHEEL');

        if (!selectedWheel) {
            void message.warning('请先新增或选中一个驱动轮');
            return;
        }

        const encoderId = addComponent('SENSOR', 'absoluteValueEncode' as any);
        if (!encoderId) return;
        updateComponent(encoderId, { alias: `${selectedWheel.alias || selectedWheel.name} - 外置绝对值编码器` });
        updateStructuralParam(encoderId, { parentNodeUuid: selectedWheel.id });
        if (selectedWheel.type === 'diffSteerWheel') {
            bindWheelAttr(selectedWheel.id, 'relatedEncode', encoderId);
        }
        setSelectedUuid(encoderId);
        setActiveComponent(encoderId);
        void message.success('已新增编码器并挂载到当前轮组');
    };

    const removeSelectedPowerNode = () => {
        if (!selectedUuid) {
            void message.warning('请先选中要移除的动力节点');
            return;
        }
        removeComponent(selectedUuid);
        setSelectedUuid(null);
        setActiveComponent(null);
        void message.success('已移除选中的动力节点');
    };

    const syncWheelAttributes = (sourceId: string, _groupKey: string, attrKey: string, value: any) => {
        if (attrKey !== 'wheelRadius') return;
        config.components
            .filter(c => c.category === 'DRIVEWHEEL' && c.id !== sourceId)
            .forEach(wheel => {
                const target = getWheelGroupAndKey(wheel.id, attrKey);
                if (target) {
                    updateAttribute(wheel.id, target.groupKey, target.attrKey, value);
                }
            });
    };

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
                    <Space style={{ marginBottom: 12 }} wrap>
                        <Select
                            size="small"
                            value={wheelChainType}
                            style={{ minWidth: 190 }}
                            onChange={value => setWheelChainType(value)}
                            options={[
                                { label: '卧式舵轮', value: 'horizontalSteerWheel' },
                                { label: '立式舵轮', value: 'verticalSteerWheel' },
                                { label: '差速舵轮（必须外置编码器）', value: 'diffSteerWheel' },
                                { label: '差速驱动轮', value: 'diffWheel' }
                            ]}
                        />
                        <Button
                            type="primary"
                            size="small"
                            icon={<BuildOutlined />}
                            onClick={addPowerChain}
                        >
                            新增轮组链
                        </Button>
                        <Button
                            size="small"
                            icon={<SettingOutlined />}
                            onClick={addEncoderToSelectedWheel}
                        >
                            新增编码器
                        </Button>
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={removeSelectedPowerNode}
                        >
                            移除选中
                        </Button>
                    </Space>
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
                        <Empty
                            description="未探测到动力组件"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                            <Button type="primary" icon={<BuildOutlined />} onClick={addPowerChain}>
                                先添加一套轮组链
                            </Button>
                        </Empty>
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
                    <>
                        {steeringRatio && (
                            <Card size="small" title="转向速比（齿轮比 × 减速比）" style={{ marginBottom: 12 }}>
                                <Space size={18} wrap>
                                    <Text>转向齿轮比：{steeringRatio.steeringGearRatio ?? '未配置'}</Text>
                                    <Text>转向电机减速比：{steeringRatio.motorReductionRatio ?? '未配置'}</Text>
                                    <Text strong>转向总速比：{steeringRatio.totalSteeringRatio ?? '未配置'}</Text>
                                </Space>
                            </Card>
                        )}
                        <ComponentPropertyPanel
                            component={activeComp}
                            onAttributeChange={(groupId, attrKey, val, subKey) => {
                                updateAttribute(activeComp.id, groupId, attrKey, val, subKey);
                            }}
                            onAttributeChangeSync={syncWheelAttributes}
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
                    </>
                ) : (
                    <Card className="smart-card" variant="borderless" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Empty description="请在左侧选择动力节点进行配置" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Card>
                )}
            </Col>
        </Row>
    );
};
