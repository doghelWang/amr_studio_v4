import React, { useState, useMemo } from 'react';
import { useAutoTreeHeight } from '../../hooks/useAutoTreeHeight';
import { Typography, Card, Row, Col, Tag, Divider, Space, Button, Tree, Empty, message, Select } from 'antd';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import { projectDriveRatio } from '../../store/domain/driveRatio';
import { getValidSubType } from '../../store/SchemaEngine';
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
    // [FIX REQ-NF-04] see useAutoTreeHeight.ts — same virtual-scroll height fix as the
    // hardware tree in ComponentLibraryStep.
    const { containerRef: powerTreeContainerRef, height: powerTreeHeight } = useAutoTreeHeight(400);
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

    // §AUDIT-FIX(2026-09) / NO_HARDCODE: these subType strings used to be passed straight to
    // addComponent(), bypassing schema validation (CLAUDE.md §2.0 names 'PMSMMotor' literals as
    // the canonical forbidden pattern). ComponentLibraryStep.tsx/ComponentPropertyPanel.tsx
    // already do this correctly via getValidSubType(); this brings PowerSystemStep in line.
    // (wheelChainType itself needs no equivalent helper: it's already constrained to a valid
    // DRIVEWHEEL subtype by the Select options below, not a free-form hardcoded literal.)
    const DRIVER_SUBTYPE = () => getValidSubType('DRIVER', 'subDriver', []);
    const MOTOR_SUBTYPE = () => getValidSubType('MOTOR', 'PMSMMotor', ['BLDCMotor', 'BDCMotor']);

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
            const driverId = addComponent('DRIVER', DRIVER_SUBTYPE());
            const motorId = addComponent('MOTOR', MOTOR_SUBTYPE());

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
            const leftDriverId = addComponent('DRIVER', DRIVER_SUBTYPE());
            const rightDriverId = addComponent('DRIVER', DRIVER_SUBTYPE());
            const leftMotorId = addComponent('MOTOR', MOTOR_SUBTYPE());
            const rightMotorId = addComponent('MOTOR', MOTOR_SUBTYPE());

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
            const steerDriverId = addComponent('DRIVER', DRIVER_SUBTYPE());
            const walkDriverId = addComponent('DRIVER', DRIVER_SUBTYPE());
            const steerMotorId = addComponent('MOTOR', MOTOR_SUBTYPE());
            const walkMotorId = addComponent('MOTOR', MOTOR_SUBTYPE());

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

    /**
     * [FIX ISS-004] Cross-component attribute sync, scoped by functional role.
     *
     * History: a fuller version of this existed pre-restructuring (commit 386a9e60,
     * "ISS-004 scope synced attributes by module functional role instead of generic
     * type") at the old `frontend/src/components/wizard/PowerSystemStep.tsx` path, but
     * was dropped somewhere during the frontend/ -> src/frontend/ reorganization and
     * replaced with this function's narrower ancestor, which only handled
     * DRIVEWHEEL.wheelRadius and ignored every other attribute/category — editing a
     * driver or motor attribute (e.g. a gear ratio) on one wheel group silently never
     * reached the equivalent driver/motor on any other wheel group.
     *
     * Restored behavior: ANY attribute edit on the active component now syncs to every
     * sibling that shares the same category + type AND the same `functionalRole`
     * ('walk'/'steer'/'walk_left'/'walk_right', set at creation time in addPowerChain()
     * above) — so editing a steer-motor attribute can never leak onto a walk-motor
     * sibling, nor a left-side motor onto a right-side one, and vice versa. Components
     * with no functionalRole (e.g. encoders) fall back to the old unscoped behavior so
     * they keep syncing as before.
     *
     * Note on the other half of the historical commit (ISS-005, symmetric coordinate
     * mirroring via a `frontendGroupKey`-based left/right/front/rear projection): the
     * `locCoordNX`/`locCoordNY` attributes that logic mirrored no longer exist on any
     * wheel schema (checked every DRIVEWHEEL subtype's PrivateAttribute.json) — wheel
     * position is now computed centrally at the chassis level (`diffChassis`/
     * `steerChassis` templates' hidden `locCoordN*` fields, driven by
     * `syncChassisAttributes()`), not stored per-wheel. So there is no live bug left to
     * restore there: re-adding coordinate mirroring for attribute keys the current
     * wheel schema doesn't have would be dead code, not a fix.
     */
    const syncAttributeToSiblings = (sourceId: string, groupKey: string, attrKey: string, value: any, subKey?: string) => {
        const source = config.components.find(c => c.id === sourceId);
        if (!source) return;

        const siblings = config.components.filter(c =>
            c.id !== sourceId &&
            c.category === source.category &&
            c.type === source.type &&
            (!source.functionalRole || c.functionalRole === source.functionalRole)
        );

        siblings.forEach(sib => {
            const target = getWheelGroupAndKey(sib.id, attrKey);
            if (target) {
                updateAttribute(sib.id, target.groupKey, target.attrKey, value, subKey);
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
                        <div ref={powerTreeContainerRef} style={{ minHeight: 400, height: 400, overflow: 'hidden' }}>
                            <Tree
                                showIcon
                                defaultExpandAll
                                className="dark-tree"
                                treeData={treeData}
                                onSelect={(keys) => setSelectedUuid(keys[0] as string)}
                                selectedKeys={selectedUuid ? [selectedUuid] : []}
                                virtual
                                height={powerTreeHeight}
                            />
                        </div>
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
                            onAttributeChangeSync={syncAttributeToSiblings}
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
