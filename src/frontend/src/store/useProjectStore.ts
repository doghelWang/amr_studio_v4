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
import { getConnectionMultiplicity, findInterfaceRef, validateInterfaceConnection } from './domain/electrical';

const createDefaultIdentity = (): RobotIdentity => ({
  robotName: '',
  version: '1.0.0',
  alias: '',
  materialCode: '',
  venderName: '',
  navigationMethod: 'LASER_SLAM',
  driveType: 'STANDARD_DIFF',
  chassisShape: 'BOX',
  chassisLength: 1200,
  chassisWidth: 800,
  chassisHeight: 100,
  headOffset: 600,
  tailOffset: 600,
  leftOffset: 400,
  rightOffset: 400,
  maxSpeed: 600,
  maxAccel: 200,
  maxDecel: 200,
  avoidMaxDec: 200,
  selfWeight: 0,
  totalLoadWeight: 0
});

const createDefaultChassis = (identity: RobotIdentity): ComponentConfig => ({
  id: 'chassis-root',
  name: identity.robotName || 'chassis',
  alias: `底盘 (${identity.robotName || 'Robot Chassis'})`,
  type: identity.driveType?.includes('STEER') ? 'steerChassis' : 'diffChassis',
  category: 'CHASSIS',
  subModuleTypeKey: identity.driveType?.includes('STEER') ? 'steerChassis' : 'diffChassis',
  parentNodeUuid: null,
  mountX: 0,
  mountY: 0,
  mountZ: 0,
  mountRoll: 0,
  mountPitch: 0,
  mountYaw: 0,
  privateAttrs: [],
  interfaces: [],
  rawStructParam: {},
  generalAttr: {
    moduleName: { type: 'DATA_STRING', stringValue: identity.robotName || 'chassis', boolParse: true },
    moduleUuid: { type: 'DATA_STRING', stringValue: 'chassis-root', boolParse: true }
  },
  shape: {
    type: 'BOX',
    length: identity.chassisLength,
    width: identity.chassisWidth,
    height: identity.chassisHeight
  }
});

const createDefaultProjectConfig = (): RobotConfig => {
  const identity = createDefaultIdentity();
  return syncChassisAttributes({
    identity,
    components: [createDefaultChassis(identity)],
    abilities: abilityRegistry as any
  });
};

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

const updateNestedAbilityOption = (
  option: any,
  subAttrKey: string,
  subAttrValue: any
) => {
  const subAttributes = option.arrayCmobEle || option.arrayAttr || [];
  const updatedSubAttributes = subAttributes.map((sub: any) =>
    sub.key === subAttrKey ? { ...sub, value: subAttrValue } : sub
  );

  return {
    ...option,
    ...(option.arrayCmobEle ? { arrayCmobEle: updatedSubAttributes } : {}),
    ...(option.arrayAttr ? { arrayAttr: updatedSubAttributes } : {})
  };
};

const updateAbilityLeafAttribute = (
  attribute: any,
  value: any,
  subAttrKey?: string,
  subAttrValue?: any
) => {
  const selectedValue = subAttrValue !== undefined ? value : value;

  if (attribute.comboxParam?.options) {
    return {
      ...attribute,
      value: selectedValue,
      comboxParam: {
        ...attribute.comboxParam,
        value: selectedValue,
        options: attribute.comboxParam.options.map((option: any) => {
          if (option.key !== selectedValue || subAttrKey === undefined) return option;
          return updateNestedAbilityOption(option, subAttrKey, subAttrValue);
        })
      }
    };
  }

  if (attribute.comboType?.typeGroups) {
    return {
      ...attribute,
      value: selectedValue,
      comboType: {
        ...attribute.comboType,
        typeGroups: attribute.comboType.typeGroups.map((group: any) => {
          if (group.key !== selectedValue || subAttrKey === undefined) return group;
          return updateNestedAbilityOption(group, subAttrKey, subAttrValue);
        })
      }
    };
  }

  return { ...attribute, value };
};

const updateAbilityCommonAttribute = (
  commonAttr: any,
  attrKey: string,
  value: any,
  subAttrKey?: string,
  subAttrValue?: any
) => {
  if (commonAttr.type === 'ARRAY' && commonAttr.arrayParam?.attrParams) {
    return {
      ...commonAttr,
      arrayParam: {
        ...commonAttr.arrayParam,
        attrParams: commonAttr.arrayParam.attrParams.map((attr: any) =>
          attr.key === attrKey
            ? updateAbilityLeafAttribute(attr, value, subAttrKey, subAttrValue)
            : attr
        )
      }
    };
  }

  if (commonAttr.key === attrKey) {
    return updateAbilityLeafAttribute(commonAttr, value, subAttrKey, subAttrValue);
  }

  return commonAttr;
};

const updateNestedAttributeValue = (
  attribute: any,
  attrKey: string,
  value: any,
  subKey?: string
): any => {
  if (attribute.key === attrKey) {
    if (!subKey && (attribute.comboType?.typeGroups || attribute.combo_type?.type_groups)) {
      return {
        ...attribute,
        value,
        ...(attribute.comboType ? {
          comboType: { ...attribute.comboType, typeKey: value }
        } : {}),
        ...(attribute.combo_type ? {
          combo_type: { ...attribute.combo_type, type_key: value }
        } : {})
      };
    }
    if (subKey && attribute.comboType?.typeGroups) {
      return {
        ...attribute,
        comboType: {
          ...attribute.comboType,
          typeGroups: attribute.comboType.typeGroups.map((group: any) =>
            group.key === subKey ? { ...group, value } : group
          )
        }
      };
    }
    return { ...attribute, value };
  }

  if (attribute.comboType?.typeGroups) {
    return {
      ...attribute,
      comboType: {
        ...attribute.comboType,
        typeGroups: attribute.comboType.typeGroups.map((group: any) => ({
          ...group,
          arrayCmobEle: (group.arrayCmobEle || []).map((subAttr: any) =>
            updateNestedAttributeValue(subAttr, attrKey, value, subKey)
          )
        }))
      }
    };
  }

  if (attribute.arrayCmobEle) {
    return {
      ...attribute,
      arrayCmobEle: attribute.arrayCmobEle.map((subAttr: any) =>
        updateNestedAttributeValue(subAttr, attrKey, value, subKey)
      )
    };
  }

  return attribute;
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
  createConnection: (sourceComponentId: string, sourceIfaceUuid: string, targetComponentId: string, targetIfaceUuid: string) => { ok: boolean; message?: string };
  removeConnection: (sourceIfaceUuid: string, targetIfaceUuid: string) => void;
  materializeConnectionsToInterfaces: () => ComponentConfig[];
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
        config: createDefaultProjectConfig(),
        activeComponentId: null,
        isDirty: false,
        schemaRegistry: {},
        boardInterfaces: {},

        fetchSchemas: async () => {
          try {
            const data = await apiFetchSchemas();
            // The Python API currently returns the system-grouped registry at
            // the response root, while some deployments wrap it in `registry`.
            // Accept both envelopes without inventing or rewriting schema data.
            const { registry, boardInterfaces, ...rootRegistry } = data || {};
            set({ 
              schemaRegistry: registry || rootRegistry || {}, 
              boardInterfaces: boardInterfaces || {}
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
          // Build every schema-backed module from the same source of truth.
          // SENSOR was previously omitted, leaving newly created encoders with
          // an empty privateAttrs array even though their schemas are present.
          if (['CHASSIS', 'DRIVEWHEEL', 'DRIVER', 'MOTOR', 'SENSOR'].includes(category as string)) {
            let subType = type;
            // [FIX 2026-04-04] Proper subType selection based on category
            if ((category as string) === 'CHASSIS') {
              subType = type || 'diffChassis';
            } else if ((category as string) === 'DRIVEWHEEL') {
              // Drive wheel subType must match the schema directory name
              // Options: diffWheel, horizontalSteerWheel, verticalSteerWheel, diffSteerWheel, weakSteerWheel
              if (type) {
                subType = type;
              } else {
                subType = state.config.identity.driveType?.includes('STEER')
                  ? 'horizontalSteerWheel'
                  : 'diffWheel';
              }
            } else if ((category as string) === 'DRIVER') {
              subType = type || 'subDriver';
            } else if ((category as string) === 'MOTOR') {
              subType = type || getValidSubType('MOTOR', 'PMSMMotor', ['PMSMMotor', 'BLDCMotor', 'BDCMotor']);
            }

            privateAttrs = buildAttributesFromSchema(subType);
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

        removeComponent: (id) => set((state) => {
          const toRemove = new Set<string>([id]);
          let changed = true;

          while (changed) {
            changed = false;
            state.config.components.forEach(component => {
              if (component.parentNodeUuid && toRemove.has(component.parentNodeUuid) && !toRemove.has(component.id)) {
                toRemove.add(component.id);
                changed = true;
              }
            });
          }

          return {
            config: {
              ...state.config,
              components: state.config.components.filter(component => !toRemove.has(component.id))
            },
            isDirty: true
          };
        }),

        setActiveComponent: (id) => set({ activeComponentId: id }),

        createConnection: (sourceComponentId, sourceIfaceUuid, targetComponentId, targetIfaceUuid) => {
          const state = get();
          const source = findInterfaceRef(state.config.components, sourceIfaceUuid);
          const target = findInterfaceRef(state.config.components, targetIfaceUuid);

          if (!source || source.component.id !== sourceComponentId) {
            return { ok: false, message: '源接口不存在或不属于所选组件。' };
          }
          if (!target || target.component.id !== targetComponentId) {
            return { ok: false, message: '目标接口不存在或不属于所选组件。' };
          }

          const diagnostics = validateInterfaceConnection(source, target);
          const blocking = diagnostics.find(diagnostic => diagnostic.severity === 'error');
          if (blocking) {
            return { ok: false, message: blocking.message };
          }

          const isInterfaceOccupied = (interfaceUuid: string) => state.config.components.some(component =>
            component.interfaces.some(iface =>
              (iface.interfaceUuid === interfaceUuid && (iface.linkedInterfaceUuid || []).length > 0) ||
              (iface.linkedInterfaceUuid || []).includes(interfaceUuid)
            )
          );
          if (getConnectionMultiplicity(source.iface.type) === 'point_to_point' && isInterfaceOccupied(sourceIfaceUuid)) {
            return { ok: false, message: '源接口是点对点接口，已存在连接。' };
          }
          if (getConnectionMultiplicity(target.iface.type) === 'point_to_point' && isInterfaceOccupied(targetIfaceUuid)) {
            return { ok: false, message: '目标接口是点对点接口，已存在连接。' };
          }

          set((current) => ({
            config: {
              ...current.config,
              components: current.config.components.map(component => {
                if (component.id !== sourceComponentId) return component;
                return {
                  ...component,
                  interfaces: component.interfaces.map(iface => {
                    if (iface.interfaceUuid !== sourceIfaceUuid) return iface;
                    const existing = iface.linkedInterfaceUuid || [];
                    return existing.includes(targetIfaceUuid)
                      ? iface
                      : { ...iface, linkedInterfaceUuid: [...existing, targetIfaceUuid] };
                  })
                };
              })
            },
            isDirty: true
          }));

          return { ok: true };
        },

        removeConnection: (sourceIfaceUuid, targetIfaceUuid) => set((state) => ({
          config: {
            ...state.config,
            components: state.config.components.map(component => ({
              ...component,
              interfaces: component.interfaces.map(iface => {
                const linked = iface.linkedInterfaceUuid || [];
                if (iface.interfaceUuid === sourceIfaceUuid || iface.interfaceUuid === targetIfaceUuid || linked.includes(sourceIfaceUuid) || linked.includes(targetIfaceUuid)) {
                  return {
                    ...iface,
                    linkedInterfaceUuid: linked.filter(uuid => uuid !== sourceIfaceUuid && uuid !== targetIfaceUuid)
                  };
                }
                return iface;
              })
            }))
          },
          isDirty: true
        })),

        materializeConnectionsToInterfaces: () => get().config.components,

        linkInterface: (sourceUuid, sourceIfaceUuid, targetIfaceUuid) => {
          if (!targetIfaceUuid) {
            get().removeConnection(sourceIfaceUuid, '');
            set((state) => ({
              config: {
                ...state.config,
                components: state.config.components.map(c => {
                  if (c.id !== sourceUuid) return c;
                  return {
                    ...c,
                    interfaces: c.interfaces.map(i => i.interfaceUuid === sourceIfaceUuid
                      ? { ...i, linkedInterfaceUuid: [] }
                      : i
                    )
                  };
                })
              },
              isDirty: true
            }));
            return;
          }

          const target = findInterfaceRef(get().config.components, targetIfaceUuid);
          if (!target) return;
          get().createConnection(sourceUuid, sourceIfaceUuid, target.component.id, targetIfaceUuid);
        },

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
              const hasElements = c.privateAttrs.some(group => group.elements.length > 0);
              const sourceAttrs = hasElements
                ? c.privateAttrs
                : buildAttributesFromSchema(c.type || c.subModuleTypeKey || '');
              return {
                ...c,
                privateAttrs: sourceAttrs.map(g => {
                  if (g.key !== groupKey) return g;
                  return {
                    ...g,
                    elements: g.elements.map(e => updateNestedAttributeValue(e, attrKey, value, subKey))
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
          config: createDefaultProjectConfig(),
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
                      attr: (cf.attr || []).map((a: any) =>
                        a.key === commonAttrKey
                          ? updateAbilityCommonAttribute(a, attrKey, value, subAttrKey, subAttrValue)
                          : a
                      )
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
