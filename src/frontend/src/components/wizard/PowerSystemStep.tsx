import React, { useState, useMemo } from 'react';
import { useAutoTreeHeight } from '../../hooks/useAutoTreeHeight';
import { Typography, Card, Row, Col, Tag, Divider, Space, Button, Tree, Empty, message } from 'antd';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import { 
    ThunderboltOutlined, SettingOutlined, 
    BuildOutlined, DeploymentUnitOutlined,
    ClusterOutlined, PartitionOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import type { ComponentConfig } from '../../store/types';
import { getValidSubType } from '../../store/SchemaEngine';

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

    const nextPowerIndex = (category: string) =>
        config.components.filter(c => c.category === category).length + 1;

    // §AUDIT-FIX(2026-09) / NO_HARDCODE: these subType strings used to be passed straight to
    // addComponent(), bypassing schema validation (CLAUDE.md §2.0 names 'PMSMMotor' literals as
    // the canonical forbidden pattern). ComponentLibraryStep.tsx/ComponentPropertyPanel.tsx
    // already do this correctly via getValidSubType(); this brings PowerSystemStep in line.
    const DRIVER_SUBTYPE = () => getValidSubType('DRIVER', 'subDriver', []);
    const MOTOR_SUBTYPE = () => getValidSubType('MOTOR', 'PMSMMotor', ['BLDCMotor', 'BDCMotor']);
    const WHEEL_SUBTYPE = (isSteerDrive: boolean | undefined) => getValidSubType(
        'DRIVEWHEEL',
        isSteerDrive ? 'horizontalSteerWheel' : 'diffWheel',
        isSteerDrive
            ? ['horizontalSteerWheel', 'verticalSteerWheel', 'diffSteerWheel', 'weakSteerWheel']
            : ['diffWheel']
    );

    const addPowerChain = () => {
        const isSteerDrive = config.identity.driveType?.includes('STEER');
        const wheelType = WHEEL_SUBTYPE(isSteerDrive);
        const wheelId = addComponent('DRIVEWHEEL', wheelType as any);
        if (!wheelId) return;

        updateComponent(wheelId, {
            alias: isSteerDrive ? `舵轮组 ${nextPowerIndex('DRIVEWHEEL')}` : `驱动轮 ${nextPowerIndex('DRIVEWHEEL')}`,
            functionalRole: isSteerDrive ? 'steer' : 'walk'
        });

        if (!isSteerDrive) {
            const driverId = addComponent('DRIVER', DRIVER_SUBTYPE());
            const motorId = addComponent('MOTOR', MOTOR_SUBTYPE());

            if (driverId) {
                updateComponent(driverId, { alias: `行走驱动器 ${nextPowerIndex('DRIVER')}`, functionalRole: 'walk' });
                updateStructuralParam(driverId, { parentNodeUuid: wheelId });
            }
            if (motorId && driverId) {
                updateComponent(motorId, { alias: `行走电机 ${nextPowerIndex('MOTOR')}`, functionalRole: 'walk' });
                updateStructuralParam(motorId, { parentNodeUuid: driverId });
                bindWheelAttr(wheelId, 'relateMotor', motorId);
            }
        } else {
            const steerDriverId = addComponent('DRIVER', DRIVER_SUBTYPE());
            const walkDriverId = addComponent('DRIVER', DRIVER_SUBTYPE());
            const steerMotorId = addComponent('MOTOR', MOTOR_SUBTYPE());
            const walkMotorId = addComponent('MOTOR', MOTOR_SUBTYPE());

            if (steerDriverId) {
                updateComponent(steerDriverId, { alias: `转向驱动器 ${nextPowerIndex('DRIVER')}`, functionalRole: 'steer' });
                updateStructuralParam(steerDriverId, { parentNodeUuid: wheelId });
            }
            if (walkDriverId) {
                updateComponent(walkDriverId, { alias: `行走驱动器 ${nextPowerIndex('DRIVER') + 1}`, functionalRole: 'walk' });
                updateStructuralParam(walkDriverId, { parentNodeUuid: wheelId });
            }
            if (steerMotorId && steerDriverId) {
                updateComponent(steerMotorId, { alias: `转向电机 ${nextPowerIndex('MOTOR')}`, functionalRole: 'steer' });
                updateStructuralParam(steerMotorId, { parentNodeUuid: steerDriverId });
                bindWheelAttr(wheelId, 'relateRotMotor', steerMotorId);
            }
            if (walkMotorId && walkDriverId) {
                updateComponent(walkMotorId, { alias: `行走电机 ${nextPowerIndex('MOTOR') + 1}`, functionalRole: 'walk' });
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

        const encoderId = addComponent('SENSOR', 'incrementalEncode' as any);
        if (!encoderId) return;
        updateStructuralParam(encoderId, { parentNodeUuid: selectedWheel.id });
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

    // [FIX REQ-NF-04] see useAutoTreeHeight.ts — same virtual-scroll height fix as the
    // hardware tree in ComponentLibraryStep.
    const { containerRef: powerTreeContainerRef, height: powerTreeHeight } = useAutoTreeHeight(400);

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
     * ('walk' vs 'steer', set at creation time in addPowerChain() below) — so editing a
     * steer-motor attribute can never leak onto a walk-motor sibling, and vice versa.
     * Components with no functionalRole (e.g. encoders) fall back to the old unscoped
     * behavior so they keep syncing as before.
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
                ) : (
                    <Card className="smart-card" variant="borderless" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Empty description="请在左侧选择动力节点进行配置" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Card>
                )}
            </Col>
        </Row>
    );
};
