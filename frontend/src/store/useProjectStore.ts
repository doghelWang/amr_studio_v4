import { create } from 'zustand';
import { temporal } from 'zundo';
import { persist } from 'zustand/middleware';
import { v4 as uuidGen } from 'uuid';
import {
    RobotConfig, RobotIdentity, ComponentConfig,
    SmartAttribute, AttributeGroup, MainModuleType, InterfaceConfig
} from './types';
import { buildAttributesFromSchema } from './SchemaEngine';
import masterRegistry from './master_registry.json';
import abilityRegistry from './ability_registry.json';
import { apiFetchSchemas } from '../services/api_v2';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper: Synchronize Identity fields to the root Chassis component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const syncChassisAttributes = (config: RobotConfig): RobotConfig => {
    const { identity, components: allComponents } = config;
    
    // AUDIT-0328-2-4: Calculate Read-Only fields from topology and basic geometry
    const wheelsCount = allComponents.filter(c => c.category === 'DRIVEWHEEL').length;
    const calculatedRotateDiameter = Math.round(Math.sqrt(Math.pow(identity.chassisLength, 2) + Math.pow(identity.chassisWidth, 2)));

    const components = allComponents.map(c => {
        if (c.category === 'CHASSIS') {
            const expectedType = identity.driveType?.includes('STEER') ? 'steerChassis' : 'diffChassis';
            let targetAttrs = c.privateAttrs;
            
            // If chassis type changed from diff to steer (or vice versa), rebuild the privateAttrs schema
            if (c.type !== expectedType) {
                targetAttrs = buildAttributesFromSchema(expectedType);
            }

            const updatedPrivateAttrs = targetAttrs.map(group => {
                return {
                    ...group,
                    elements: group.elements.map(ele => {
                        // 1. Motion Center (Idle/Full)
                        if (ele.key === 'headOffset(Idle)') return { ...ele, value: identity.headOffset };
                        if (ele.key === 'tailOffset(Idle)') return { ...ele, value: identity.tailOffset };
                        if (ele.key === 'leftOffset(Idle)') return { ...ele, value: identity.leftOffset };
                        if (ele.key === 'rightOffset(Idle)') return { ...ele, value: identity.rightOffset };
                        
                        if (ele.key === 'headOffset (Full Load)') return { ...ele, value: identity.headOffsetFull ?? identity.headOffset };
                        if (ele.key === 'tailOffset (Full Load)') return { ...ele, value: identity.tailOffsetFull ?? identity.tailOffset };
                        if (ele.key === 'leftOffset (Full Load)') return { ...ele, value: identity.leftOffsetFull ?? identity.leftOffset };
                        if (ele.key === 'rightOffset (Full Load)') return { ...ele, value: identity.rightOffsetFull ?? identity.rightOffset };

                        // 2. Physical Dimensions
                        if (ele.key === 'length') return { ...ele, value: identity.chassisLength };
                        if (ele.key === 'width') return { ...ele, value: identity.chassisWidth };
                        if (ele.key === 'height') return { ...ele, value: identity.chassisHeight };
                        
                        // 3. Performance (P3 Alignment: Angular Speed/Accel Sets)
                        if (ele.key === 'maxSpeed(Idle)') return { ...ele, value: identity.maxSpeed };
                        if (ele.key === 'maxAcceleration(Idle)') return { ...ele, value: identity.maxAccel };
                        if (ele.key === 'maxDeceleration(Idle)') return { ...ele, value: identity.maxDecel };
                        
                        if (ele.key === 'maxSpeed (Full Load)') return { ...ele, value: identity.maxSpeedFull ?? (identity.maxSpeed ? identity.maxSpeed * 0.8 : 600) };
                        if (ele.key === 'maxAcceleration (Full Load)') return { ...ele, value: identity.maxAccelFull ?? (identity.maxAccel ? identity.maxAccel * 0.4 : 200) };
                        if (ele.key === 'maxDeceleration (Full Load)') return { ...ele, value: identity.maxDecelFull ?? (identity.maxDecel ? identity.maxDecel * 0.5 : 200) };

                        if (ele.key === 'avoidMaxDec (Idle)') return { ...ele, value: identity.avoidMaxDec };
                        if (ele.key === 'avoidMaxDec (Full Load)') return { ...ele, value: identity.avoidMaxDecFull ?? identity.avoidMaxDec };

                        if (ele.key === 'rotateMaxAngSpeed (Idle)') return { ...ele, value: identity.rotateMaxAngSpeed };
                        if (ele.key === 'rotateMaxAngAcceleration (Idle)') return { ...ele, value: identity.rotateMaxAngAcceleration };
                        
                        // 4. System Calculated (Read Only)
                        if (ele.key === 'wheelsNum') return { ...ele, value: wheelsCount > 0 ? wheelsCount : 1 };
                        if (ele.key === 'rotateDiameter') return { ...ele, value: calculatedRotateDiameter };

                        // 5. Metadata
                        if (ele.key === 'venderName') return { ...ele, value: identity.venderName };
                        if (ele.key === 'materialCode') return { ...ele, value: identity.materialCode };
                        
                        return ele;
                    })
                };
            });

            return {
                ...c,
                name: identity.robotName || 'chassis',
                alias: `底盘 (${identity.robotName || 'Robot Chassis'})`,
                type: expectedType,
                privateAttrs: updatedPrivateAttrs
            };
        }
        return c;
    });

    return { ...config, components };
};

interface ProjectState {
    projectId: string | null;
    setProjectId: (id: string | null) => void;
    config: RobotConfig;
    activeComponentId: string | null;
    isDirty: boolean;

    // --- Identity & Global ---
    setIdentity: (data: Partial<RobotIdentity>) => void;

    // --- Components ---
    addComponent: (category: MainModuleType, type: string) => string;
    addComponentFromConfig: (config: ComponentConfig) => void;
    addComponents: (components: ComponentConfig[]) => void;
    updateComponent: (id: string, data: Partial<ComponentConfig>) => void;
    removeComponent: (id: string) => void;
    setActiveComponent: (id: string | null) => void;
    
    // --- Interfaces & Topology ---
    linkInterface: (sourceUuid: string, sourceIfaceUuid: string, targetIfaceUuid: string | null) => void;

    // --- Attributes ---
    updateAttribute: (componentId: string, groupKey: string, attrKey: string, value: any, subKey?: string) => void;

    // --- Physical Interfaces ---
    updateInterface: (componentId: string, interfaceUuid: string, data: Partial<InterfaceConfig>) => void;

    // --- Structural & Positional ---
    updateStructuralParam: (componentId: string, data: Partial<{
        parentNodeUuid: string | null;
        mountX: number; mountY: number; mountZ: number;
        mountRoll: number; mountPitch: number; mountYaw: number;
    }>) => void;
    updateShape: (componentId: string, shape: ComponentConfig['shape']) => void;

    // --- Global Actions ---
    resetProject: () => void;
    loadProject: (config: RobotConfig) => void;

    // --- Ability Config ---
    updateAbilityAttribute: (funcType: string, childKey: string, commonAttrKey: string, attrKey: string, value: any, subAttrKey?: string) => void;

    // --- Schema Registry (Dynamic XML Metadata) ---
    schemaRegistry: Record<string, any>;
    fetchSchemas: () => Promise<void>;
}

const DEFAULT_IDENTITY: RobotIdentity = {
    robotName: '',
    version: '1.0.0',
    materialCode: '',
    alias: '',
    venderName: '',
    navigationMethod: 'LASER_SLAM',
    driveType: 'STANDARD_DIFF',
    chassisShape: 'BOX',
    chassisLength: 1200,
    chassisWidth: 800,
    chassisHeight: 400,
    headOffset: 600,
    tailOffset: 600,
    leftOffset: 400,
    rightOffset: 400,
    maxSpeed: 1500,
    maxAccel: 1000,
    maxDecel: 1000,
    rotateMaxAngSpeed: 90,
    rotateMaxAngAcceleration: 180
};

const createInitialConfig = (): RobotConfig => {
    const identity = { ...DEFAULT_IDENTITY };
    const chassisId = 'chassis-root';

    // Initialize Chassis with full registry groups
    const groups: AttributeGroup[] = buildAttributesFromSchema('diffChassis');

    return {
        identity,
        components: [{
            id: chassisId,
            name: 'chassis',
            alias: '底盘 (Robot Chassis)',
            type: 'diffChassis',
            category: 'CHASSIS',
            parentNodeUuid: null,
            mountX: 0, mountY: 0, mountZ: 0,
            mountRoll: 0, mountPitch: 0, mountYaw: 0,
            privateAttrs: groups,
            interfaces: []
        }],
        abilities: abilityRegistry as any
    };
};


export const useProjectStore = create<ProjectState>()(
    persist(
        temporal(
            (set, get) => ({
                projectId: null,
                setProjectId: (id) => set({ projectId: id }),
                config: createInitialConfig(),
                activeComponentId: null,
                isDirty: false,

                setIdentity: (data) => set((state) => {
                    const oldDriveType = state.config.identity.driveType;
                    const newIdentity = { ...state.config.identity, ...data };

                    let components = state.config.components;
                    
                    // AUDIT-0328-2-3-1: Clear power components if drive type changes to avoid topology mismatch
                    if (data.driveType && data.driveType !== oldDriveType) {
                        components = components.filter(c => 
                            c.category === 'CHASSIS' || 
                            !['DRIVEWHEEL', 'DRIVER', 'MOTOR', 'ACTOR'].includes(c.category as any)
                        );
                    }

                    // Linkage: Head + Tail = Length
                    if ('chassisLength' in data) {
                        newIdentity.headOffset = Math.round(newIdentity.chassisLength / 2);
                        newIdentity.tailOffset = newIdentity.chassisLength - newIdentity.headOffset;
                    } 
                    
                    if ('headOffset' in data) {
                        newIdentity.tailOffset = Math.max(0, newIdentity.chassisLength - Number(data.headOffset));
                    } else if ('tailOffset' in data) {
                        newIdentity.headOffset = Math.max(0, newIdentity.chassisLength - Number(data.tailOffset));
                    }

                    // Linkage: Left + Right = Width
                    if ('chassisWidth' in data) {
                        newIdentity.leftOffset = Math.round(newIdentity.chassisWidth / 2);
                        newIdentity.rightOffset = newIdentity.chassisWidth - newIdentity.leftOffset;
                    } 
                    
                    if ('leftOffset' in data) {
                        newIdentity.rightOffset = Math.max(0, newIdentity.chassisWidth - Number(data.leftOffset));
                    } else if ('rightOffset' in data) {
                        newIdentity.leftOffset = Math.max(0, newIdentity.chassisWidth - Number(data.rightOffset));
                    }

                    // Sync Identity to Chassis attributes
                    const updatedConfig = syncChassisAttributes({
                        ...state.config,
                        identity: newIdentity,
                        components
                    });

                    return {
                        config: updatedConfig,
                        isDirty: true
                    };
                }),

                addComponent: (category, type) => {
                    if (category === 'CHASSIS') return ''; 

                    const id = uuidGen();
                    const state = get();
                    
                    // Priority: Dynamic XML Schema Registry
                    let schemaInfo = Object.values(state.schemaRegistry).find(
                        (s: any) => s.key === type || s.category === category || s.aliases?.includes(type)
                    );

                    const registryInfo = schemaInfo || (masterRegistry as any)[category]?.[type];

                    let privateAttrs: AttributeGroup[] = (registryInfo?.privateAttributes || registryInfo?.privateAttrs || []).map((group: any) => ({
                        key: group.key || 'private_group',
                        desc: group.label || group.desc || '私有属性',
                        elements: (group.elements || []).map((attr: any) => ({
                            ...attr,
                            value: attr.value !== undefined ? attr.value : (attr.type === 'DATA_BOOL' ? false : (attr.type === 'DATA_STRING' ? '' : 0)),
                            boolBasic: true 
                        }))
                    }));

                    // Map based on categories natively mapped from SchemaEngine
                    if (['CHASSIS', 'DRIVEWHEEL', 'DRIVER', 'MOTOR'].includes(category as string)) {
                        let subType = type; // Use the provided type directly (e.g., 'subDriver', 'PMSMMotor')
                        if ((category as string) === 'CHASSIS') subType = type || 'diffChassis';
                        
                        // We set standard grouped schemas entirely without loop restructuring
                        privateAttrs = buildAttributesFromSchema(subType);
                    }

                    const newComponent: ComponentConfig = {
                        id,
                        name: `${type}_${get().config.components.length + 1}`,
                        alias: registryInfo?.label || registryInfo?.desc || type,
                        type,
                        category,
                        parentNodeUuid: null,
                        mountX: 0, mountY: 0, mountZ: 0,
                        mountRoll: 0, mountPitch: 0, mountYaw: 0,
                        privateAttrs,
                        interfaces: (registryInfo?.interfaces || []).map((inf: any) => ({
                            key: inf.key || inf.name,
                            type: inf.type,
                            label: inf.label || inf.name,
                            interfaceUuid: uuidGen(),
                        }))
                    };

                    set((state) => ({
                        config: {
                            ...state.config,
                            components: [...state.config.components, newComponent]
                        },
                        activeComponentId: id,
                        isDirty: true
                    }));
                    return id;
                },

                updateComponent: (id, data) => set((state) => ({
                    config: {
                        ...state.config,
                        components: state.config.components.map((c) =>
                            c.id === id ? { ...c, ...data } : c
                        )
                    },
                    isDirty: true
                })),

                addComponentFromConfig: (component) => set((state) => ({
                    config: {
                        ...state.config,
                        components: [...state.config.components, component]
                    },
                    activeComponentId: component.id,
                    isDirty: true
                })),

                addComponents: (newComponents) => set((state) => ({
                    config: {
                        ...state.config,
                        components: [...state.config.components, ...newComponents]
                    },
                    activeComponentId: newComponents.length > 0 ? newComponents[newComponents.length - 1].id : state.activeComponentId,
                    isDirty: true
                })),

                removeComponent: (id) => set((state) => {
                    const compToRemove = state.config.components.find(c => c.id === id);
                    if (compToRemove?.category === 'CHASSIS') {
                        console.warn("SYSTEM: Cannot remove root Chassis component.");
                        return state;
                    }

                    return {
                        config: {
                            ...state.config,
                            components: state.config.components.filter((c) => c.id !== id)
                        },
                        activeComponentId: state.activeComponentId === id ? null : state.activeComponentId,
                        isDirty: true
                    };
                }),

                linkInterface: (sourceUuid, sourceIfaceUuid, targetIfaceUuid) => set((state) => {
                    const components = state.config.components.map(c => {
                        if (c.id === sourceUuid) {
                            return {
                                ...c,
                                interfaces: c.interfaces.map(iface => {
                                    if (iface.interfaceUuid === sourceIfaceUuid) {
                                        return { 
                                            ...iface, 
                                            linkedInterfaceUuid: targetIfaceUuid ? [targetIfaceUuid] : [] 
                                        };
                                    }
                                    return iface;
                                })
                            };
                        }
                        return c;
                    });
                    return { config: { ...state.config, components }, isDirty: true };
                }),

                setActiveComponent: (id) => set({ activeComponentId: id }),

                /**
                 * 核心方法：更新指定组件的私有属性值 (privateAttrs)
                 * 这个方法直接操作 Zustand 的 Immutable State 树，确保 UI 层能监听到变化并触发 React 重新渲染。
                 * 
                 * @param componentId 组件的 UUID
                 * @param groupKey JSON 配置中的属性组 key
                 * @param attrKey 同组内的具体属性 key
                 * @param value 用户输入、选择或联动同步的新值
                 * @param subKey (可选) 用于更新 COMBO_TYPE (下拉框) 内嵌的子属性值
                 */
                updateAttribute: (componentId, groupKey, attrKey, value, subKey) => set((state) => ({
                    config: {
                        ...state.config,
                        components: state.config.components.map((c) => {
                            if (c.id !== componentId) return c;
                            return {
                                ...c,
                                privateAttrs: c.privateAttrs.map((group) => {
                                    if (group.key !== groupKey) return group;
                                    return {
                                        ...group,
                                        elements: group.elements.map((attr) => {
                                            if (attr.key !== attrKey) return attr;
                                            
                                            if (subKey && attr.type === 'DATA_COMBOX') {
                                                const currentGroup = attr.comboType?.typeGroups?.find((g: any) => g.key === attr.value);
                                                if (currentGroup?.arrayCmobEle) {
                                                    return {
                                                        ...attr,
                                                        comboType: {
                                                            ...attr.comboType,
                                                            typeGroups: attr.comboType.typeGroups.map((g: any) => {
                                                                if (g.key !== attr.value) return g;
                                                                return {
                                                                    ...g,
                                                                    arrayCmobEle: g.arrayCmobEle.map((s: any) =>
                                                                        s.key === subKey ? { ...s, value } : s
                                                                    )
                                                                };
                                                            })
                                                        }
                                                    };
                                                }
                                            }
                                            
                                            return { ...attr, value };
                                        })
                                    };
                                })
                            };
                        })
                    },
                    isDirty: true
                })),

                updateInterface: (componentId, interfaceUuid, data) => set((state) => ({
                    config: {
                        ...state.config,
                        components: state.config.components.map((c) => {
                            if (c.id !== componentId) return c;
                            return {
                                ...c,
                                interfaces: c.interfaces.map((i) =>
                                    i.interfaceUuid === interfaceUuid ? { ...i, ...data } : i
                                )
                            };
                        })
                    },
                    isDirty: true
                })),

                updateStructuralParam: (componentId, data) => set((state) => ({
                    config: {
                        ...state.config,
                        components: state.config.components.map((c) =>
                            c.id === componentId ? { ...c, ...data } : c
                        )
                    },
                    isDirty: true
                })),

                updateShape: (componentId, shape) => set((state) => ({
                    config: {
                        ...state.config,
                        components: state.config.components.map((c) =>
                            c.id === componentId ? { ...c, shape } : c
                        )
                    },
                    isDirty: true
                })),

                resetProject: () => {
                    const initialConfig = createInitialConfig();
                    const schemas = get().schemaRegistry;
                    
                    if (Object.keys(schemas).length > 0) {
                        initialConfig.components = initialConfig.components.map(comp => {
                            const schema = schemas[comp.category.toLowerCase()] || 
                                          Object.values(schemas).find((s: any) => s.key === comp.type || s.aliases?.includes(comp.type));
                            
                            if (!schema) return comp;

                            const newGroups: AttributeGroup[] = (schema.privateAttributes || []).map((group: any) => ({
                                key: group.key,
                                desc: group.label || group.desc,
                                elements: (group.elements || []).map((attr: any) => ({
                                    ...attr,
                                    value: attr.value ?? (attr.type === 'DATA_BOOL' ? false : (attr.type === 'DATA_STRING' ? '' : 0))
                                }))
                            }));

                            return { ...comp, privateAttrs: newGroups };
                        });
                    }

                    set({
                        config: initialConfig,
                        activeComponentId: null,
                        isDirty: false
                    });
                },

                loadProject: (config) => {
                    // Ensure linkage is calculated after import
                    const identity = { ...config.identity };
                    
                    // If offsets are missing or default, force re-calc from L/W
                    if (identity.chassisLength > 0 && (identity.headOffset + identity.tailOffset !== identity.chassisLength)) {
                        identity.headOffset = Math.round(identity.chassisLength / 2);
                        identity.tailOffset = identity.chassisLength - identity.headOffset;
                    }
                    if (identity.chassisWidth > 0 && (identity.leftOffset + identity.rightOffset !== identity.chassisWidth)) {
                        identity.leftOffset = Math.round(identity.chassisWidth / 2);
                        identity.rightOffset = identity.chassisWidth - identity.leftOffset;
                    }

                    const hydratedConfig = syncChassisAttributes({
                        ...config,
                        identity
                    });

                    set({
                        config: hydratedConfig,
                        activeComponentId: hydratedConfig.components.length > 0 ? hydratedConfig.components[0].id : null,
                        isDirty: false
                    });
                },

                updateAbilityAttribute: (funcType, childKey, commonAttrKey, attrKey, value, subAttrKey) => set((state) => ({
                    config: {
                        ...state.config,
                        abilities: {
                            ...state.config.abilities,
                            functionAbility: state.config.abilities.functionAbility.map((f) => {
                                if (f.type !== funcType) return f;
                                return {
                                    ...f,
                                    childFunction: f.childFunction.map((c) => {
                                        if (c.key !== childKey) return c;
                                        return {
                                            ...c,
                                            attr: c.attr.map((a) => {
                                                if (a.key !== commonAttrKey) return a;
                                                
                                                if (a.type === 'ARRAY' && a.arrayParam) {
                                                    return {
                                                        ...a,
                                                        arrayParam: {
                                                            ...a.arrayParam,
                                                            attrParams: a.arrayParam.attrParams.map((ap) => {
                                                                if (ap.key === attrKey) {
                                                                    if (subAttrKey && ap.arrayCmobEle) {
                                                                        return {
                                                                            ...ap,
                                                                            arrayCmobEle: ap.arrayCmobEle.map(s => s.key === subAttrKey ? { ...s, value } : s)
                                                                        };
                                                                    }
                                                                    return { ...ap, value };
                                                                }
                                                                return ap;
                                                            })
                                                        }
                                                    };
                                                }
                                                
                                                if (a.type === 'COMBOX' && a.comboxParam) {
                                                    if (attrKey === commonAttrKey) {
                                                        return { ...a, comboxParam: { ...a.comboxParam, value } };
                                                    }
                                                }
                                                return a;
                                            })
                                        };
                                    })
                                };
                            })
                        }
                    },
                    isDirty: true
                })),

                schemaRegistry: {},
                fetchSchemas: async () => {
                    try {
                        const schemas = await apiFetchSchemas();
                        set({ schemaRegistry: schemas });

                        // Schema Hydration
                        set((state) => {
                            const updatedComponents = state.config.components.map(comp => {
                                const schema = schemas[comp.category.toLowerCase()] || 
                                              Object.values(schemas).find((s: any) => s.key === comp.type || s.aliases?.includes(comp.type));
                                
                                if (!schema) return comp;

                                const newGroups: AttributeGroup[] = (schema.privateAttributes || []).map((group: any) => {
                                    const existingGroup = comp.privateAttrs.find(g => g.key === group.key);
                                    return {
                                        key: group.key,
                                        desc: group.label || group.desc,
                                        elements: (group.elements || []).map((attr: any) => {
                                            const existingEle = existingGroup?.elements.find(e => e.key === attr.key);
                                            return {
                                                ...attr,
                                                value: existingEle ? existingEle.value : (attr.value ?? (attr.type === 'DATA_BOOL' ? false : (attr.type === 'DATA_STRING' ? '' : 0)))
                                            };
                                        })
                                    };
                                });

                                const newInterfaces = (schema.interfaces || []).map((inf: any) => {
                                    const existing = comp.interfaces.find(i => i.key === inf.key);
                                    return {
                                        key: inf.key,
                                        type: inf.type,
                                        label: inf.label,
                                        interfaceUuid: existing ? existing.interfaceUuid : uuidGen(),
                                        linkedInterfaceUuid: existing ? existing.linkedInterfaceUuid : []
                                    };
                                });

                                return {
                                    ...comp,
                                    privateAttrs: newGroups,
                                    interfaces: newInterfaces
                                };
                            });

                            return {
                                config: {
                                    ...state.config,
                                    components: updatedComponents
                                }
                            };
                        });
                    } catch (error) {
                        console.error('STORE: Failed to fetch schemas', error);
                    }
                }
            })
        ),
        {
            name: 'amr-configurator-v4',
            partialize: (state) => ({ 
                config: state.config,
                projectId: state.projectId 
            })
        }
    )
);

export function useUndoRedo() {
    const temporalStore = useProjectStore.temporal.getState();
    return {
        undo: temporalStore.undo,
        redo: temporalStore.redo,
        canUndo: temporalStore.pastStates.length > 0,
        canRedo: temporalStore.futureStates.length > 0
    };
}
