import { create } from 'zustand';
import { temporal } from 'zundo';
import { persist } from 'zustand/middleware';
import { v4 as uuidGen } from 'uuid';
import {
  RobotConfig, RobotIdentity, ComponentConfig,
  SmartAttribute, AttributeGroup, MainModuleType, InterfaceConfig
} from './types';
import { buildAttributesFromSchema, getValidSubType, isValidSubType } from './SchemaEngine';
import masterRegistry from './master_registry.json';
import abilityRegistry from './ability_registry.json';
import {
  apiFetchSchemas,
  apiFetchBoardXml,
  apiSaveProject,
  apiListSavedProjects,
  apiLoadProject
} from '../services/api_v2';

import { DEFAULT_FULL_LOAD_RATIOS } from './PerformanceConfig';

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

            if (ele.key === 'maxSpeed (Full Load)') return { ...ele, value: identity.maxSpeedFull ?? (identity.maxSpeed ? Math.round(identity.maxSpeed * DEFAULT_FULL_LOAD_RATIOS.maxSpeed) : identity.maxSpeed) };
            if (ele.key === 'maxAcceleration (Full Load)') return { ...ele, value: identity.maxAccelFull ?? (identity.maxAccel ? Math.round(identity.maxAccel * DEFAULT_FULL_LOAD_RATIOS.maxAcceleration) : identity.maxAccel) };
            if (ele.key === 'maxDeceleration (Full Load)') return { ...ele, value: identity.maxDecelFull ?? (identity.maxDecel ? Math.round(identity.maxDecel * DEFAULT_FULL_LOAD_RATIOS.maxDeceleration) : identity.maxDecel) };

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
  updateInterfaceParams: (componentId: string, interfaceUuid: string, params: Record<string, any>) => void;

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
  saveProject: () => Promise<boolean>;
  listSavedProjects: () => Promise<any[]>;
  loadProjectByName: (name: string) => Promise<boolean>;

  // --- Ability Config ---
  updateAbilityAttribute: (funcType: string, childKey: string, commonAttrKey: string, attrKey: string, value: any, subAttrKey?: string, subAttrValue?: any) => void;

  // --- Schema Registry (Dynamic XML Metadata) ---
  schemaRegistry: Record<string, any>;
  boardInterfaces: Record<string, InterfaceConfig[]>;
  fetchSchemas: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  temporal(
    persist(
      (set, get) => ({
        projectId: null,
        setProjectId: (id) => set({ projectId: id }),
        config: {
          identity: {
            robotName: '',
            version: '1.0.0',
            alias: '',
            navigationMethod: 'LASER_SLAM',
            driveType: 'STANDARD_DIFF',
            chassisShape: 'BOX',
            chassisLength: 0,
            chassisWidth: 0,
            chassisHeight: 0,
            headOffset: 0,
            tailOffset: 0,
            leftOffset: 0,
            rightOffset: 0,
            maxSpeed: 0,
            maxAccel: 0,
            maxDecel: 0,
            materialCode: '',
            venderName: 'HIKROBOT'
          },
          components: [],
          abilities: abilityRegistry as any
        },
        activeComponentId: null,
        isDirty: false,
        schemaRegistry: {},
        boardInterfaces: {},

        fetchSchemas: async () => {
          try {
            const data = await apiFetchSchemas();
            set({ 
              schemaRegistry: data.registry || {}, 
              boardInterfaces: data.boardInterfaces || {} 
            });
          } catch (e) {
            console.error('Failed to fetch schemas:', e);
          }
        },

        setIdentity: (data) => set((state) => {
          const components = state.config.components.map(c => c);
          const newIdentity = { ...state.config.identity, ...data };

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
          if ((category as any) === 'CHASSIS') return '';

          const id = uuidGen();
          const state = get();

          // Priority: Dynamic XML Schema Registry
          let schemaInfo = Object.values(state.schemaRegistry).find(
            (s: any) => s.key === type || s.category === category || s.aliases?.includes(type)
          );

          const registryInfo = schemaInfo || (masterRegistry as any)[category]?.[type];
          if (!schemaInfo && registryInfo) {
            console.warn(`[DEPRECATION] Using hardcoded masterRegistry for ${category}/${type}. Migrate to schemaRegistry.`);
          }

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
            let subType = type;
            // [FIX 2026-04-04] Proper subType selection based on category
            if ((category as string) === 'CHASSIS') {
              subType = type || 'diffChassis';
            } else if ((category as string) === 'DRIVEWHEEL') {
              // Drive wheel subType must match the schema directory name
              // Options: diffWheel, horizontalSteerWheel, verticalSteerWheel, diffSteerWheel, weakSteerWheel
              // [P0-FIX-2026-04-04] Smart subType selection based on drive type
              if (type) {
                subType = type;  // Use explicit type if provided
              } else {
                // Auto-detect: STEER drive types need horizontalSteerWheel (7 attributes)
                subType = state.config.identity.driveType?.includes('STEER')
                  ? 'horizontalSteerWheel'
                  : 'diffWheel';
              }
            } else if ((category as string) === 'DRIVER') {
              subType = type || 'subDriver';
        } else if ((category as string) === 'MOTOR') {
          // $C003-FIX: Schema-driven subType selection for MOTOR category
          // Replaces hardcoded 'PMSMMotor' fallback with registry lookup
          const validMotorTypes = ['PMSMMotor', 'BLDCMotor', 'BDCMotor'];

          if (type === 'driver' || type === 'subDriver') {
            console.warn(`[FIX] MOTOR category with wrong type "${type}", using schema-driven fallback`);
            subType = getValidSubType('MOTOR', undefined, validMotorTypes);
          } else {
            // If type is provided but not in registry (e.g., null/undefined/custom), use fallback
            subType = type && isValidSubType(type)
              ? type
              : getValidSubType('MOTOR', undefined, validMotorTypes);
          }
        }

            // We set standard grouped schemas entirely without loop restructuring
            privateAttrs = buildAttributesFromSchema(subType);
          }

          // Auto-fill defaults for mandatory chipPlatform and softwareSpec if missing
          for (const group of privateAttrs) {
            for (const attr of group.elements) {
              if (attr.key === 'chipPlatform' && !attr.value) {
                attr.value = 'N/A';
              }
              if (attr.key === 'softwareSpec' && !attr.value) {
                attr.value = 'NONE';
              }
            }
          }

          let initialInterfaces = (registryInfo?.interfaces || []).map((inf: any) => ({
            key: inf.key || inf.name,
            type: inf.type,
            label: inf.label || inf.name,
            interfaceUuid: uuidGen(),
            linkedInterfaceUuid: []
          }));

          // Attempt dynamic XML interface injection on creation
          const tryInjectInterfaces = (key: string) => {
            const cleanKey = key.includes('-') ? key.split('-').slice(1).join('-') : key;
            const targetKey = state.boardInterfaces[key] ? key : (state.boardInterfaces[cleanKey] ? cleanKey : null);

            if (targetKey) {
              initialInterfaces = state.boardInterfaces[targetKey].map(ifaceTemplate => ({
                ...ifaceTemplate,
                interfaceUuid: uuidGen(),
                linkedInterfaceUuid: []
              }));
              return true;
            }
            return false;
          };

          // 1. Try matching by the component type itself (often the board model in library)
          let injected = tryInjectInterfaces(type);

          // 2. Scan attributes for a board model selection (DATA_COMBOX)
          if (!injected) {
            for (const group of privateAttrs) {
              for (const attr of group.elements) {
                if (attr.type === 'DATA_COMBOX' && attr.key === 'boardModel' && attr.comboType?.typeGroups?.[0]?.key) {
                  injected = tryInjectInterfaces(attr.comboType.typeGroups[0].key);
                  if (injected) break;
                }
              }
              if (injected) break;
            }
          }

          const newComponent: ComponentConfig = {
            id,
            name: `${category}_${id.slice(0, 4)}`,
            category: category as any,
            type,
            subModuleTypeKey: type,
            alias: `${category} ${(state.config.components.filter(c => c.category === category).length + 1)}`,
            privateAttrs,
            interfaces: initialInterfaces,
            rawStructParam: {},
            generalAttr: {
              moduleName: { type: 'DATA_STRING', stringValue: `${category}_${id.slice(0, 4)}`, boolParse: true },
              moduleUuid: { type: 'DATA_STRING', stringValue: id, boolParse: true }
            },
            parentNodeUuid: state.config.components.find(c => c.category === 'CHASSIS')?.id,
            mountX: 0, mountY: 0, mountZ: 0,
            mountRoll: 0, mountPitch: 0, mountYaw: 0
          };

          set((state) => ({
            config: { ...state.config, components: [...state.config.components, newComponent] },
            isDirty: true
          }));

          return id;
        },

        addComponentFromConfig: (config) => set((state) => ({
          config: { ...state.config, components: [...state.config.components, config] },
          isDirty: true
        })),

        addComponents: (components) => set((state) => ({
          config: { ...state.config, components: [...state.config.components, ...components] },
          isDirty: true
        })),

        updateComponent: (id, data) => set((state) => ({
          config: {
            ...state.config,
            components: state.config.components.map(c => c.id === id ? { ...c, ...data } : c)
          },
          isDirty: true
        })),

        removeComponent: (id) => set((state) => ({
          config: {
            ...state.config,
            components: state.config.components.filter(c => c.id !== id && c.parentNodeUuid !== id)
          },
          isDirty: true
        })),

        setActiveComponent: (id) => set({ activeComponentId: id }),

        linkInterface: (sourceUuid, sourceIfaceUuid, targetIfaceUuid) => set((state) => ({
          config: {
            ...state.config,
            components: state.config.components.map(c => {
              if (c.id !== sourceUuid) return c;
              return {
                ...c,
                interfaces: c.interfaces.map(i => i.interfaceUuid === sourceIfaceUuid
                  ? { ...i, linkedInterfaceUuid: targetIfaceUuid ? [targetIfaceUuid] : [] }
                  : i
                )
              };
            })
          },
          isDirty: true
        })),

        updateInterfaceParams: (componentId, interfaceUuid, params) => set((state) => ({
          config: {
            ...state.config,
            components: state.config.components.map(c => {
              if (c.id !== componentId) return c;
              return {
                ...c,
                interfaces: c.interfaces.map(i => i.interfaceUuid === interfaceUuid
                  ? { ...i, ...params }
                  : i
                )
              };
            })
          },
          isDirty: true
        })),

        updateAttribute: (componentId, groupKey, attrKey, value, subKey) => set((state) => ({
          config: {
            ...state.config,
            components: state.config.components.map(c => {
              if (c.id !== componentId) return c;
              return {
                ...c,
                privateAttrs: c.privateAttrs.map(g => {
                  if (g.key !== groupKey) return g;
                  return {
                    ...g,
                    elements: g.elements.map(e => {
                      if (e.key !== attrKey) return e;
                      if (subKey && e.comboType?.typeGroups) {
                        return {
                          ...e,
                          comboType: {
                            ...e.comboType,
                            typeGroups: e.comboType.typeGroups.map((tg: any) =>
                              tg.key === subKey ? { ...tg, value } : tg
                            )
                          }
                        };
                      }
                      return { ...e, value };
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
            components: state.config.components.map(c => {
              if (c.id !== componentId) return c;
              return {
                ...c,
                interfaces: c.interfaces.map(i => i.interfaceUuid === interfaceUuid
                  ? { ...i, ...data }
                  : i
                )
              };
            })
          },
          isDirty: true
        })),

        updateStructuralParam: (componentId, data) => set((state) => ({
          config: {
            ...state.config,
            components: state.config.components.map(c =>
              c.id === componentId ? { ...c, ...data } : c
            )
          },
          isDirty: true
        })),

        updateShape: (componentId, shape) => set((state) => ({
          config: {
            ...state.config,
            components: state.config.components.map(c =>
              c.id === componentId ? { ...c, shape } : c
            )
          },
          isDirty: true
        })),

        resetProject: () => set({
          config: {
            identity: {
              robotName: '',
              version: '1.0.0',
              alias: '',
              materialCode: '',
              venderName: '',
              navigationMethod: 'LASER_SLAM',
              driveType: 'STANDARD_DIFF',
              chassisShape: 'BOX',
              chassisLength: 0,
              chassisWidth: 0,
              chassisHeight: 0,
              headOffset: 0,
              tailOffset: 0,
              leftOffset: 0,
              rightOffset: 0,
              maxSpeed: 0,
              maxAccel: 0,
              maxDecel: 0
            },
            components: [],
            abilities: abilityRegistry as any
          },
          isDirty: false,
          activeComponentId: null
        }),

        loadProject: (config) => set({
          config,
          isDirty: false,
          activeComponentId: null
        }),

        saveProject: async () => {
          const state = get();
          try {
            await apiSaveProject(state.config.identity.robotName || 'Untitled', state.config);
            set({ isDirty: false });
            return true;
          } catch (e) {
            console.error('Save failed:', e);
            return false;
          }
        },

        listSavedProjects: async () => {
          try {
            return await apiListSavedProjects();
          } catch (e) {
            console.error('List projects failed:', e);
            return [];
          }
        },

        loadProjectByName: async (name) => {
          try {
            const config = await apiLoadProject(name);
            if (config) {
              get().loadProject(config);
              return true;
            }
            return false;
          } catch (e) {
            console.error('Load project failed:', e);
            return false;
          }
        },

        updateAbilityAttribute: (funcType, childKey, commonAttrKey, attrKey, value, subAttrKey, subAttrValue) => set((state) => ({
          config: {
            ...state.config,
            abilities: {
              ...state.config.abilities,
              functionAbility: (state.config.abilities.functionAbility || []).map((f: any) => {
                if (f.type !== funcType) return f;
                return {
                  ...f,
                  childFunction: (f.childFunction || []).map((cf: any) => {
                    if (cf.key !== childKey) return cf;
                    return {
                      ...cf,
              attr: (cf.attr || []).map((a: any) => {
                if (a.key !== commonAttrKey) return a;

                // §CRITICAL: Handle comboxParam.options (Ability registry structure)
                if (a.comboxParam?.options) {
                  const selectedValue = subAttrValue !== undefined ? value : (a.value || a.comboxParam.value);
                  return {
                    ...a,
                    value: selectedValue,
                    comboxParam: {
                      ...a.comboxParam,
                      value: selectedValue,
                      options: a.comboxParam.options.map((opt: any) => {
                        if (opt.key !== selectedValue) return opt;
                        return {
                          ...opt,
                          arrayAttr: (opt.arrayAttr || []).map((sub: any) =>
                            sub.key === subAttrKey
                              ? { ...sub, value: subAttrValue }
                              : sub
                          )
                        };
                      })
                    }
                  };
                }

                // Handle comboType.typeGroups (Component structure)
                if (subAttrKey && a.comboType?.typeGroups) {
                  return {
                    ...a,
                    comboType: {
                      ...a.comboType,
                      typeGroups: a.comboType.typeGroups.map((tg: any) =>
                        tg.key === subAttrKey
                          ? { ...tg, ...(subAttrValue !== undefined ? { value: subAttrValue } : {}) }
                          : tg
                      )
                    }
                  };
                }
                return { ...a, value };
              })
                    };
                  })
                };
              })
            }
          },
          isDirty: true
        }))
      }),
      {
        name: 'amr-project-store',
        partialize: (state) => ({
          projectId: state.projectId,
          config: state.config
        })
      }
    )
  )
);

export const useUndoRedo = () => {
  const { undo, redo, pastStates, futureStates } = useProjectStore.temporal.getState();
  return {
    undo,
    redo,
    canUndo: pastStates.length > 0,
    canRedo: futureStates.length > 0,
  };
};
