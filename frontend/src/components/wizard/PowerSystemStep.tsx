import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Typography, Card, Row, Col, Tag, Alert, Divider, Space, Button, Tree, Empty, message, Switch, Tooltip, Modal, Select } from 'antd';
import { useProjectStore } from '../../store/useProjectStore';
import { ComponentPropertyPanel } from './ComponentPropertyPanel';
import { 
    ThunderboltOutlined, SettingOutlined, 
    PlusCircleOutlined, PlusOutlined, 
    PartitionOutlined, BuildOutlined, DeploymentUnitOutlined,
    ClusterOutlined, HolderOutlined, SyncOutlined, LinkOutlined
} from '@ant-design/icons';
import { ChassisVisualizer } from '../visualizer/ChassisVisualizer';
import { v4 as uuidv4 } from 'uuid';
import { buildAttributesFromSchema } from '../../store/SchemaEngine';
import type { ComponentConfig } from '../../store/types';

const { Title, Text } = Typography;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Drive type → wheel topology definition
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const DRIVE_TOPOLOGY: Record<string, { label: string; groups: Array<{ label: string; key: string; roles: string[] }> }> = {
    STANDARD_DIFF: {
        label: '标准差速底盘',
        groups: [
            { label: '左驱动轮组', key: 'left_group', roles: ['驱动轮 (driveWheel)', '行走电机 (motor)', '驱动器 (driver)'] },
            { label: '右驱动轮组', key: 'right_group', roles: ['驱动轮 (driveWheel)', '行走电机 (motor)', '驱动器 (driver)'] },
        ],
    },
    SINGLE_STEER: {
        label: '单舵轮底盘',
        groups: [
            { label: '主舵轮组', key: 'steer_group', roles: ['舵轮 (steerWheel)', '行走电机 (walkMotor)', '转向电机 (steerMotor)', '驱动器 (driver)'] },
        ],
    },
    DUAL_STEER: {
        label: '双舵轮底盘',
        groups: [
            { label: '前舵轮组', key: 'front_steer', roles: ['舵轮 (steerWheel)', '行走电机 (walkMotor)', '转向电机 (steerMotor)', '驱动器 (driver)'] },
            { label: '后舵轮组', key: 'rear_steer', roles: ['舵轮 (steerWheel)', '行走电机 (walkMotor)', '转向电机 (steerMotor)', '驱动器 (driver)'] },
        ],
    },
    QUAD_STEER: {
        label: '四舵轮底盘',
        groups: [
            { label: '左前轮', key: 'fl_steer', roles: ['舵轮 (steerWheel)', '行走电机 (walkMotor)', '转向电机 (steerMotor)', '驱动器 (driver)'] },
            { label: '右前轮', key: 'fr_steer', roles: ['舵轮 (steerWheel)', '行走电机 (walkMotor)', '转向电机 (steerMotor)', '驱动器 (driver)'] },
            { label: '左后轮', key: 'rl_steer', roles: ['舵轮 (steerWheel)', '行走电机 (walkMotor)', '转向电机 (steerMotor)', '驱动器 (driver)'] },
            { label: '右后轮', key: 'rr_steer', roles: ['舵轮 (steerWheel)', '行走电机 (walkMotor)', '转向电机 (steerMotor)', '驱动器 (driver)'] },
        ],
    },
};

const ROLE_COLOR: Record<string, string> = {
    'DRIVEWHEEL': 'blue',
    'DRIVER': 'cyan',
    'MOTOR': 'green',
    'ACTOR': 'purple',
    'SENSOR': 'gold',
};

export const PowerSystemStep: React.FC = () => {
    const { config, addComponent, updateComponent, addComponents, updateAttribute, projectId } = useProjectStore();
    const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
    const [wheelSync, setWheelSync] = useState(true); // Default: sync ON

    const driveType = config.identity.driveType || 'STANDARD_DIFF';
    const topology = DRIVE_TOPOLOGY[driveType] || DRIVE_TOPOLOGY['STANDARD_DIFF'];

    // Filter power components (includes SENSOR for steering encoders)
    const powerComponents = config.components.filter(c => {
        const cat = c.category;
        const alias = (c.alias || '').toLowerCase();
        const name = (c.name || '').toLowerCase();
        return cat === 'DRIVEWHEEL' || cat === 'DRIVER' || cat === 'ACTOR' || (cat as string) === 'MOTOR'
            || cat === 'SENSOR'
            || name.includes('motor') || alias.includes('电机') 
            || alias.includes('轮') || alias.includes('减速')
            || alias.includes('编码器') || alias.includes('编码') || name.includes('encoder') || name.includes('encode');
    });

    // Recursive tree building helper
    const buildTree = (parentId: string | null): any[] => {
        return powerComponents
            .filter(c => parentId === null ? !c.parentNodeUuid : c.parentNodeUuid === parentId)
            .map(c => ({
                title: (
                    <Space size={4}>
                        <span style={{ fontSize: 12 }}>{c.alias}</span>
                        <Tag color={ROLE_COLOR[c.category] || 'default'} bordered={false} style={{ fontSize: 8, margin: 0 }}>{c.category}</Tag>
                    </Space>
                ),
                key: c.id,
                icon: parentId === null ? <BuildOutlined style={{ color: 'var(--accent)' }} /> : (c.category === 'DRIVER' ? <DeploymentUnitOutlined /> : <SettingOutlined />),
                children: buildTree(c.id)
            }));
    };

    const treeData = useMemo(() => buildTree(null), [powerComponents]);

    /**
     * 【轮组参数联动同步核心逻辑】
     * 作用：当用户在 UI 上修改任意一个轮组（或其电机、驱动器、编码器）的参数时，如果启用了联动同步（wheelSync 为 true），
     *      会自动将该被修改的参数同步覆盖到当前底盘内所有同 `category` 和同 `type` 的兄弟组件。
     * 
     * 设计逻辑：
     * 1. 拦截 `ComponentPropertyPanel` 抛出的 `onAttributeChange` 事件。
     * 2. 找到当前被修改的 source 组件。
     * 3. 在所有组件中查找：不仅 category 相同（如大家都是 DRIVEWHEEL 或 MOTOR），而且 type 相同（如大家都是 PMSMMotor）。
     * 4. 遍历兄弟组件，静默地更新它们的相同底层属性。
     * 
     * 这个功能对差速舵轮等复杂模型尤其重要，比如用户改了一个电机减速比，4个轮子的8个电机都会自动同步。
     */
    const syncAttributeToSiblings = useCallback((sourceId: string, groupKey: string, attrKey: string, value: any, subKey?: string) => {
        if (!wheelSync) return;

        // 【ISS-012】电机/编码器 反向参数 (bReverse/isInvert) 是设备个体物理属性，严禁同步。
        if (attrKey === 'bReverse' || attrKey === 'isInvert') {
            console.log(`[SYNC-GUARD] Skipping per-device attribute: ${attrKey}`);
            return;
        }

        const source = config.components.find(c => c.id === sourceId);
        if (!source) return;

        // 【ISS-004】安全守卫... (rest of getFunctionalRole remains same)
        const getFunctionalRole = (comp: ComponentConfig): string => {
            if (comp.functionalRole) return comp.functionalRole;
            
            // 兜底逻辑：处理旧数据或手动添加的组件
            const { category, alias, id } = comp;
            if (category !== 'MOTOR' && category !== 'DRIVER') return alias ? alias.split('_')[0] : '';
            if (alias && (alias.includes('行走') || alias.includes('转向'))) {
                return alias.includes('行走') ? 'walk' : 'steer';
            }
            
            // 物理层级倒推：通过其父节点或引用它的 DRIVEWHEEL 来判定
            const parentWheel = config.components.find(c => c.category === 'DRIVEWHEEL' && 
                (c.id === comp.parentNodeUuid || config.components.find(d => d.id === comp.parentNodeUuid)?.parentNodeUuid === c.id)
            );
            if (parentWheel && parentWheel.privateAttrs) {
                for (const g of parentWheel.privateAttrs) {
                    for (const e of (g as any).elements || []) {
                        if ((e.key === 'relateWalkMotor' || e.key === 'relateMotor') && e.value === id) return 'walk';
                        if ((e.key === 'relateLeftMotor') && e.value === id) return 'walk_left';
                        if ((e.key === 'relateRightMotor') && e.value === id) return 'walk_right';
                        if (e.key === 'relateRotMotor' && e.value === id) return 'steer';
                    }
                }
            }
            return '';
        };

        const sourceRole = getFunctionalRole(source);

        // 寻找同类节点，加入严格的角色守卫防止错跨同步
        const siblings = config.components.filter(c => {
            if (c.id === sourceId || c.category !== source.category || c.type !== source.type) return false;
            
            // 轮组之间可以同步（如果都是 DRIVEWHEEL 且 type 相同）
            if (c.category === 'DRIVEWHEEL') return true; 

            // 电机和驱动器必须 Role 完全对齐 (walk vs steer)
            const targetRole = getFunctionalRole(c);
            
            // [ISS-004 FIX] 特殊规则：walk_left 和 walk_right 属于 walk 大类，可以互相同步行走参数
            const isWalk = (role: string) => role === 'walk' || role === 'walk_left' || role === 'walk_right';
            if (isWalk(sourceRole) && isWalk(targetRole)) return true;
            
            return sourceRole === targetRole; 
        });

        siblings.forEach(sib => {
            let finalValue = value;

            // 【ISS-005 / ISS-013】拓扑对称坐标投影映射
            if (source.category === 'DRIVEWHEEL' && typeof value === 'number') {
                const srcTopology = source.frontendGroupKey?.toLowerCase() || '';
                const tgtTopology = sib.frontendGroupKey?.toLowerCase() || '';
                
                if (srcTopology && tgtTopology) {
                    // Y坐标对消：左 / 右 互变
                    if (attrKey === 'locCoordNY') {
                        const isSrcLeft = srcTopology.includes('left') || srcTopology.includes('fl') || srcTopology.includes('rl');
                        const isSrcRight = srcTopology.includes('right') || srcTopology.includes('fr') || srcTopology.includes('rr');
                        const isTgtLeft = tgtTopology.includes('left') || tgtTopology.includes('fl') || tgtTopology.includes('rl');
                        const isTgtRight = tgtTopology.includes('right') || tgtTopology.includes('fr') || tgtTopology.includes('rr');
                        
                        // 对消规则：如果源和目标分别处于左右两侧，则 Y 取反
                        if ((isSrcLeft && isTgtRight) || (isSrcRight && isTgtLeft)) {
                            finalValue = -value;
                        }
                    }
                    
                    // X坐标对消：前 / 后 互变
                    if (attrKey === 'locCoordNX') {
                        const isSrcFront = srcTopology.includes('front') || srcTopology.includes('fl') || srcTopology.includes('fr');
                        const isSrcRear = srcTopology.includes('rear') || srcTopology.includes('rl') || srcTopology.includes('rr');
                        const isTgtFront = tgtTopology.includes('front') || tgtTopology.includes('fl') || tgtTopology.includes('fr');
                        const isTgtRear = tgtTopology.includes('rear') || tgtTopology.includes('rl') || tgtTopology.includes('rr');
                        
                        // 对消规则：如果源和目标分别处于前后两侧，则 X 取反
                        if ((isSrcFront && isTgtRear) || (isSrcRear && isTgtFront)) {
                            finalValue = -value;
                        }
                    }
                }
            }

            updateAttribute(sib.id, groupKey, attrKey, finalValue, subKey);
        });

        if (siblings.length > 0) {
            message.info({ content: `联动生效: 同步至 ${siblings.length} 个同类组件`, duration: 1.5, key: 'wheel-sync' });
        }
    }, [wheelSync, config.components, updateAttribute]);

    // ━━━ Steer Wheel Type Selection ━━━
    const STEER_WHEEL_OPTIONS = [
        { value: 'horizontalSteerWheel', label: '卧式舵轮', desc: '行走电机 + 转向电机，水平安装' },
        { value: 'verticalSteerWheel', label: '立式舵轮', desc: '行走电机 + 转向电机，垂直安装' },
        { value: 'diffSteerWheel', label: '差速舵轮', desc: '左右行走电机差速驱动转向 + 外置转向编码器' },
    ];
    const [steerTypePickerOpen, setSteerTypePickerOpen] = useState(false);
    const pendingSteerTypeRef = useRef<string>('horizontalSteerWheel');

    /**
     * 【动力架构整链创建函数】
     * 作用：处理轮组被"添加"时的业务逻辑。它不仅创建一个轮组节点，还会根据轮组的 subType，
     *      生成对应的一整条或多条动力链路（即挂载驱动器、电机、编码器等子节点）。
     * 
     * 设计逻辑：
     * - 从统一的 `buildAttributesFromSchema` 中获得初始化默认属性。
     * - 基于工程规律，如果系统识别轮子类型为差速 (diffWheel)：直连 1 个驱动器 1 个电机。
     * - 如果是双驱差速舵轮 (diffSteerWheel)：生成两个轮毂电机节点（左右行走），并挂载转向反馈编码器。
     * - 如果是立式/卧式独立舵轮：生成一个行走系统（电机+驱动）和一个转向系统（电机+驱动）。
     * - 生成后，通过 `bindWheelReference` 把生成的子模块 UUID 写进轮组 `DATA_FIXED_E` 的联动引用字段里。
     * 
     * @param wheelSubType 轮子具体型号类型（来自 ModuleLibrary）
     */
    const doCreateWheel = (wheelSubType: string) => {
        const currentWheels = powerComponents.filter(c => c.category === 'DRIVEWHEEL');
        const groupDef = topology.groups[currentWheels.length];
        const currentWheelsCount = currentWheels.length + 1;

        /**
         * 基础工厂函数：生成一个通用组件模型节点对象
         */
        const createNode = (cat: string, typeKey: string, alias: string, name: string, parentId: string | null, functionalRole?: string) => {
            const privateAttrsOriginal = buildAttributesFromSchema(typeKey);
            return {
                id: uuidv4(), name, alias, category: cat as any, type: typeKey,
                mainModuleTypeKey: cat.toLowerCase(), subModuleTypeKey: typeKey,
                mainModuleType: { typeKey: cat.toLowerCase() },
                generalAttr: { name: alias, alias: name },
                // ISS-005: 注入用于位置联动计算的拓扑逻辑 Key。仅挂在根轮节点上即可判定方位。
                frontendGroupKey: cat === 'DRIVEWHEEL' ? groupDef.key : undefined,
                // ISS-004: 注入功能角色，用于精确联动同步
                functionalRole,
                privateAttrs: privateAttrsOriginal,
                interfaces: [],
                parentNodeUuid: parentId,
                mountX: 0, mountY: 0, mountZ: 0, mountRoll: 0, mountPitch: 0, mountYaw: 0
            } as ComponentConfig;
        };

        const wheel = createNode('DRIVEWHEEL', wheelSubType, groupDef.label, `driveWheel_${currentWheelsCount}`, null);
        const newComps: ComponentConfig[] = [wheel];

        /**
         * 【UUID引用注入基操】
         * 功能：将刚生成的子组件（如电机）的 UUID，自动填充到父组件（轮子）负责引用它的私有属性中。
         * 场景：譬如生成了 `PMSMMotor` 后，将其 ID 通过此函数填入 `DRIVEWHEEL` JSON 模板中名为 `relateMotor` 的字段。
         */
        const bindWheelReference = (key: string, targetUuid: string) => {
            if (!wheel.privateAttrs) return;
            for (const group of wheel.privateAttrs) {
                const elems = (group as any).elements || [];
                const attr = elems.find((e: any) => e.key === key);
                if (attr) { attr.value = targetUuid; return; }
            }
        };

        /**
         * 【深度UUID引用注入基操（针对 COMBO）】
         * 功能：有些配置里（例如把编码器插到基于 Select 选项里的一个字段），`target` 字段藏在了选项数组里。
         *      此函数会递归查找所有的 ComboType 下面的 arrayCmobEle 并在匹配对的位置上注入 UUID 引用。
         */
        const bindWheelNestedReference = (groupKey: string, attrKey: string, targetUuid: string) => {
            if (!wheel.privateAttrs) return;
            const searchInElements = (elements: any[]): boolean => {
                for (const ele of elements) {
                    if (ele.key === attrKey && (ele.type === 'DATA_FIXED_E' || ele.fixedSource)) {
                        ele.value = targetUuid;
                        ele.stringFix = targetUuid;
                        return true;
                    }
                    // Recurse into comboType options
                    if (ele.options && Array.isArray(ele.options)) {
                        for (const opt of ele.options) {
                            if (opt.children && searchInElements(opt.children)) return true;
                        }
                    }
                }
                return false;
            };
            for (const group of wheel.privateAttrs) {
                if (groupKey && (group as any).key !== groupKey) continue;
                const elems = (group as any).elements || [];
                if (searchInElements(elems)) return;
            }
        };

        if (wheelSubType === 'diffWheel') {
            // Standard diff: 1 driver → 1 motor
            const driver = createNode('DRIVER', 'subDriver', `驱动器_${currentWheelsCount}`, `driver_${currentWheelsCount}`, wheel.id, 'walk');
            const motor = createNode('MOTOR', 'PMSMMotor', `行走电机_${currentWheelsCount}`, `walkMotor_${currentWheelsCount}`, driver.id, 'walk');
            newComps.push(driver, motor);
            bindWheelReference('relateMotor', motor.id);
        } else if (wheelSubType === 'diffSteerWheel') {
            // Differential steer: 2 walk motors (left + right) + 1 external steering encoder
            const leftDriver = createNode('DRIVER', 'subDriver', `左驱动器_${currentWheelsCount}`, `leftDriver_${currentWheelsCount}`, wheel.id, 'walk_left');
            const leftMotor = createNode('MOTOR', 'PMSMMotor', `左行走电机_${currentWheelsCount}`, `leftWalkMotor_${currentWheelsCount}`, leftDriver.id, 'walk_left');
            const rightDriver = createNode('DRIVER', 'subDriver', `右驱动器_${currentWheelsCount}`, `rightDriver_${currentWheelsCount}`, wheel.id, 'walk_right');
            const rightMotor = createNode('MOTOR', 'PMSMMotor', `右行走电机_${currentWheelsCount}`, `rightWalkMotor_${currentWheelsCount}`, rightDriver.id, 'walk_right');
            // Create steering feedback encoder (default: absoluteValueEncode per engineering constraint)
            const steerEncoder = createNode('SENSOR', 'absoluteValueEncode', `转向编码器_${currentWheelsCount}`, `steerEncoder_${currentWheelsCount}`, wheel.id, 'steer');
            newComps.push(leftDriver, leftMotor, rightDriver, rightMotor, steerEncoder);
            bindWheelReference('relateLeftMotor', leftMotor.id);
            bindWheelReference('relateRightMotor', rightMotor.id);
            // Bind relatedEncode inside angleSensorType combo sub-attributes
            bindWheelNestedReference('angleSensor', 'relatedEncode', steerEncoder.id);
        } else {
            // horizontalSteerWheel / verticalSteerWheel: 1 steer motor + 1 walk motor
            const steerDriver = createNode('DRIVER', 'subDriver', `转向驱动器_${currentWheelsCount}`, `steerDriver_${currentWheelsCount}`, wheel.id, 'steer');
            const steerMotor = createNode('MOTOR', 'PMSMMotor', `转向电机_${currentWheelsCount}`, `steerMotor_${currentWheelsCount}`, steerDriver.id, 'steer');
            const walkDriver = createNode('DRIVER', 'subDriver', `行走驱动器_${currentWheelsCount}`, `walkDriver_${currentWheelsCount}`, wheel.id, 'walk');
            const walkMotor = createNode('MOTOR', 'PMSMMotor', `行走电机_${currentWheelsCount}`, `walkMotor_${currentWheelsCount}`, walkDriver.id, 'walk');
            newComps.push(steerDriver, steerMotor, walkDriver, walkMotor);
            bindWheelReference('relateRotMotor', steerMotor.id);
            bindWheelReference('relateWalkMotor', walkMotor.id);
        }

        addComponents(newComps);
        setSelectedUuid(wheel.id);
        message.success(`已创建 ${groupDef.label}（${STEER_WHEEL_OPTIONS.find(o => o.value === wheelSubType)?.label || wheelSubType}）及配套动力链`);
    };

    const handleAddWheel = () => {
        const currentWheels = powerComponents.filter(c => c.category === 'DRIVEWHEEL');
        if (currentWheels.length >= topology.groups.length) {
            message.warning(`当前驱动类型 (${topology.label}) 最多支持 ${topology.groups.length} 个轮组`);
            return;
        }

        if (driveType === 'STANDARD_DIFF') {
            // Standard diff — directly create diffWheel, no selection needed
            doCreateWheel('diffWheel');
        } else {
            // STEER types — show picker modal
            pendingSteerTypeRef.current = 'horizontalSteerWheel';
            setSteerTypePickerOpen(true);
        }
    };

    return (
        <Row gutter={24} style={{ height: '100%', margin: 0 }}>
            {/* ━━━ Left: Consistent 2D Visualizer + Hierarchy Tree ━━━ */}
            <Col span={8} style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Card className="smart-card" variant="borderless" style={{ flexShrink: 0, padding: '12px 0' }}>
                    <ChassisVisualizer 
                        width={config.identity.chassisWidth}
                        length={config.identity.chassisLength}
                        shape={config.identity.chassisShape as any}
                        headOffset={config.identity.headOffset}
                        leftOffset={config.identity.leftOffset}
                        components={config.components}
                        selectedId={selectedUuid}
                        onSelect={setSelectedUuid}
                        svgSize={180}
                    />
                </Card>

                <Card className="smart-card" variant="borderless" style={{ flex: 1, overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Title level={5} style={{ color: 'var(--accent)', margin: 0, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ClusterOutlined /> 动力架构树
                        </Title>
                        <Button 
                            type="primary" 
                            ghost 
                            size="small" 
                            icon={<PlusOutlined />}
                            onClick={handleAddWheel}
                            style={{ fontSize: 11 }}
                        >
                            新增轮组
                        </Button>
                    </div>

                    {/* ━━━ Wheel Sync Toggle ━━━ */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '6px 12px', background: wheelSync ? 'rgba(56, 139, 253, 0.06)' : 'transparent', borderRadius: 6, border: '1px solid ' + (wheelSync ? 'rgba(56, 139, 253, 0.2)' : 'transparent'), transition: 'all 0.3s' }}>
                        <Space size={6}>
                            <SyncOutlined spin={wheelSync} style={{ fontSize: 12, color: wheelSync ? 'var(--accent)' : '#484f58' }} />
                            <Text style={{ fontSize: 11, color: wheelSync ? 'var(--accent)' : '#8b949e' }}>轮组参数联动</Text>
                        </Space>
                        <Tooltip title={wheelSync ? '修改任意轮组/电机/驱动器参数时，自动同步到所有同类型组件' : '各轮组独立配置'}>
                            <Switch size="small" checkedChildren="同步" unCheckedChildren="独立" checked={wheelSync} onChange={setWheelSync} />
                        </Tooltip>
                    </div>

                    {powerComponents.length === 0 ? (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无动力节点" />
                    ) : (
                        <Tree
                            showIcon
                            blockNode
                            className="power-tree"
                            selectedKeys={selectedUuid ? [selectedUuid] : []}
                            onSelect={(keys) => keys[0] && setSelectedUuid(keys[0] as string)}
                            treeData={treeData}
                        />
                    )}

                    <Divider plain><Text type="secondary" style={{ fontSize: 10 }}>配置建议</Text></Divider>
                    <Alert 
                        type="info" 
                        showIcon 
                        message={<span style={{ fontSize: 11 }}>拓扑规则</span>}
                        description={
                            <div style={{ fontSize: 10 }}>
                                {topology.groups.map((g, i) => (
                                    <div key={i} style={{ marginBottom: 4 }}>
                                        • <strong>{g.label}</strong>: {g.roles.join(' → ')}
                                    </div>
                                ))}
                            </div>
                        } 
                    />
                </Card>
            </Col>

            {/* ━━━ Right: Full-Height Dedicated Properties ━━━ */}
            <Col span={16} style={{ height: '100%' }}>
                <Card className="smart-card" variant="borderless" style={{ height: '100%', overflowY: 'auto' }}>
                    {selectedUuid ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <Space direction="vertical" size={0}>
                                    <Title level={5} style={{ margin: 0, color: '#f0f6fc', fontSize: 14 }}>
                                        {config.components.find(c => c.id === selectedUuid)?.alias}
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: 11 }}>详细参数配置</Text>
                                </Space>
                            </div>
                            <Divider style={{ margin: '0 0 20px 0', borderColor: 'var(--border-default)', opacity: 0.5 }} />
                            <ComponentPropertyPanel 
                                projectId={projectId} 
                                selectedUuid={selectedUuid}
                                onAttributeChange={wheelSync ? syncAttributeToSiblings : undefined}
                            />
                        </>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                            <Empty description="请在左侧预览图或架构树中选择一个组件进行配置" />
                        </div>
                    )}
                </Card>
            </Col>


            <style>{`
                .power-tree { background: transparent !important; color: #8b949e !important; }
                .power-tree .ant-tree-node-content-wrapper { padding: 4px 8px !important; border-radius: 6px !important; transition: all 0.2s; }
                .power-tree .ant-tree-node-content-wrapper:hover { background: rgba(255,255,255,0.05) !important; }
                .power-tree .ant-tree-node-selected { background: var(--accent-soft) !important; color: var(--accent) !important; }
                .power-tree .ant-tree-switcher { color: #484f58 !important; }
            `}</style>

            {/* ━━━ Steer Wheel Type Picker Modal ━━━ */}
            <Modal
                title="选择舵轮类型"
                open={steerTypePickerOpen}
                onOk={() => {
                    setSteerTypePickerOpen(false);
                    doCreateWheel(pendingSteerTypeRef.current);
                }}
                onCancel={() => setSteerTypePickerOpen(false)}
                okText="创建"
                cancelText="取消"
                width={480}
            >
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">请选择要创建的舵轮类型，不同类型的动力链结构不同：</Text>
                </div>
                <Select 
                    style={{ width: '100%' }} 
                    defaultValue="horizontalSteerWheel"
                    onChange={(v) => { pendingSteerTypeRef.current = v; }}
                    optionLabelProp="label"
                >
                    {STEER_WHEEL_OPTIONS.map(opt => (
                        <Select.Option key={opt.value} value={opt.value} label={opt.label}>
                            <div>
                                <Text strong>{opt.label}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 11 }}>{opt.desc}</Text>
                            </div>
                        </Select.Option>
                    ))}
                </Select>
            </Modal>
        </Row>
    );
};
