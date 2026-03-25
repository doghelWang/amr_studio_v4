import { create } from 'zustand';
import { temporal } from 'zundo';
import { persist } from 'zustand/middleware';
import { v4 as uuidGen } from 'uuid';
import type {
    RobotConfig, RobotIdentity, ComponentConfig,
    SmartAttribute, AttributeGroup, MainModuleType, InterfaceConfig
} from './types';
import masterRegistry from './master_registry.json';
import abilityRegistry from './ability_registry.json';

interface ProjectState {
    projectId: string | null;
    setProjectId: (id: string | null) => void;
    config: RobotConfig;
    activeComponentId: string | null;
    isDirty: boolean;

    // Identity
    setIdentity: (data: Partial<RobotIdentity>) => void;

    // Components
    addComponent: (category: MainModuleType, type: string) => string;
    addComponentFromConfig: (config: ComponentConfig) => void;
    updateComponent: (id: string, data: Partial<ComponentConfig>) => void;
    removeComponent: (id: string) => void;
    setActiveComponent: (id: string | null) => void;

    // Attributes (searches inside groups)
    updateAttribute: (componentId: string, groupKey: string, attrKey: string, value: any, subKey?: string) => void;

    // Interfaces
    updateInterface: (componentId: string, interfaceUuid: string, data: Partial<InterfaceConfig>) => void;

    // Structural & Shape
    updateStructuralParam: (componentId: string, data: Partial<{
        parentNodeUuid: string | null;
        mountX: number; mountY: number; mountZ: number;
        mountRoll: number; mountPitch: number; mountYaw: number;
    }>) => void;
    updateShape: (componentId: string, shape: ComponentConfig['shape']) => void;

    // Global
    resetProject: () => void;
    loadProject: (config: RobotConfig) => void;

    // Abilities
    updateAbilityAttribute: (funcType: string, childKey: string, commonAttrKey: string, attrKey: string, value: any, subAttrKey?: string) => void;
}

const DEFAULT_IDENTITY: RobotIdentity = {
    robotName: 'amr_your_define',
    version: '1.0.0',
    materialCode: '',
    alias: '',
    venderName: 'hikrobot',
    navigationMethod: 'LASER_SLAM',
    driveType: 'STANDARD_DIFF',
    chassisShape: 'BOX',
    chassisLength: 1200,
    chassisWidth: 800,
    chassisHeight: 400,
    headOffset: 600,
    tailOffset: 600,
    leftOffset: 400,
    rightOffset: 400
};

const createInitialConfig = (): RobotConfig => {
    const identity = { ...DEFAULT_IDENTITY };
    const chassisId = 'chassis-root';
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
            privateAttrs: [],
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
                    const newIdentity = { ...state.config.identity, ...data };
                    
                    // ━━━ Bi-directional Calculation Logic ━━━
                    if ('chassisLength' in data) {
                        newIdentity.headOffset = Number(data.chassisLength) / 2;
                        newIdentity.tailOffset = Number(data.chassisLength) / 2;
                    } else if ('headOffset' in data) {
                        newIdentity.tailOffset = Number(state.config.identity.chassisLength) - Number(data.headOffset);
                    } else if ('tailOffset' in data) {
                        newIdentity.headOffset = Number(state.config.identity.chassisLength) - Number(data.tailOffset);
                    }

                    if ('chassisWidth' in data) {
                        newIdentity.leftOffset = Number(data.chassisWidth) / 2;
                        newIdentity.rightOffset = Number(data.chassisWidth) / 2;
                    } else if ('leftOffset' in data) {
                        newIdentity.rightOffset = Number(state.config.identity.chassisWidth) - Number(data.leftOffset);
                    } else if ('rightOffset' in data) {
                        newIdentity.leftOffset = Number(state.config.identity.chassisWidth) - Number(data.rightOffset);
                    }

                    // ━━━ Sync Chassis Component ━━━
                    const components = state.config.components.map(c => {
                        if (c.category === 'CHASSIS') {
                            return {
                                ...c,
                                alias: `底盘 (${newIdentity.robotName})`,
                                // Update chassis type based on driveType if needed (e.g. diffChassis, omniChassis)
                                type: newIdentity.driveType === 'OMNI_WHEEL' ? 'omniChassis' : 'diffChassis'
                            };
                        }
                        return c;
                    });

                    return {
                        config: {
                            ...state.config,
                            identity: newIdentity,
                            components
                        },
                        isDirty: true
                    };
                }),

                addComponent: (category, type) => {
                    // Prevent duplicate Chassis
                    if (category === 'CHASSIS') return '';

                    const id = uuidGen();
                    const registryInfo = (masterRegistry as any)[category]?.[type];

                    // Map flat privateAttrs from registry to a default AttributeGroup
                    const privateAttrs: AttributeGroup[] = [{
                        key: 'private_group',
                        desc: '私有属性',
                        elements: (registryInfo?.privateAttrs || []).map((attr: any) => ({
                            ...attr,
                            value: attr.type === 'DATA_BOOL' ? false
                                 : (attr.type === 'DATA_STRING' ? '' : 0),
                            boolBasic: true // Default to basic for visibility
                        }))
                    }];

                    const newComponent: ComponentConfig = {
                        id,
                        name: `${type}_${get().config.components.length + 1}`,
                        alias: registryInfo?.desc || type,
                        type,
                        category,
                        parentNodeUuid: null,
                        mountX: 0, mountY: 0, mountZ: 0,
                        mountRoll: 0, mountPitch: 0, mountYaw: 0,
                        privateAttrs,
                        interfaces: (registryInfo?.interfaces || []).map((inf: any) => ({
                            key: inf.key || inf.name,
                            type: inf.type,
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

                setActiveComponent: (id) => set({ activeComponentId: id }),

                // Update an attribute inside a specific group
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
                                            
                                            // Handle nested attribute updates for COMBOX options
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

                resetProject: () => set({
                    config: createInitialConfig(),
                    activeComponentId: null,
                    isDirty: false
                }),

                loadProject: (config) => {
                    console.log('STORE: loading new config into state...', config);
                    set({
                        config,
                        activeComponentId: config.components.length > 0 ? config.components[0].id : null,
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
                                                
                                                // 1. If it's an ARRAY type
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
                                                
                                                // 2. If it's a COMBOX type (directly under CommonAttr)
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
                }))
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
