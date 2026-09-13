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
  parseBoardInterfacesXml,
  apiSaveProject,
  apiListSavedProjects,
  apiLoadProject
} from '../services/api_v2';

import { DEFAULT_FULL_LOAD_RATIOS } from './PerformanceConfig';

/**
 * [FIX ISS-006 / REQ-CL-05 root cause] Fetches and parses the real per-board interface
 * catalog (BoardDescriptions.xml). Shared by fetchSchemas()'s primary API path and its
 * static-snapshot fallback below — both used to leave `boardInterfaces` permanently `{}`
 * because neither `/api/v1/schemas` nor `/worker-data/schemas.json` has ever actually
 * returned a `boardInterfaces` field.
 */
async function fetchRealBoardInterfaces(): Promise<Record<string, any[]>> {
  try {
    const xmlText = await apiFetchBoardXml();
    return parseBoardInterfacesXml(xmlText);
  } catch (boardErr) {
    console.error('Failed to fetch/parse BoardDescriptions.xml:', boardErr);
    return {};
  }
}
import { getConnectionMultiplicity, findInterfaceRef, validateInterfaceConnection } from './domain/electrical';
import { updateInterfaceParams as updateInterfaceParamsValue } from './domain/interfaceParams';
import { getChassisSchemaDefaults } from './SchemaDefaults';

// §AUDIT-FIX(2026-09) / NO_HARDCODE: previously this hardcoded 1200/800/600/400/600/200/200/200 —
// the exact "forbidden pattern" values CLAUDE.md's own examples call out, and which
// PerformanceConfig.ts's LEGACY_CHASSIS_DEFAULT_VALUES documents as wrong (schema default is
// 100/100/100 and 0 offsets). SchemaDefaults.ts/getChassisSchemaDefaults() was already built to
// replace these but was never wired in (see audits/claude_review/frontend_audit.md A3) — this
// wires it in.
// Exported (was private) so audit-fix regression tests can exercise the real logic directly
// instead of standing up the full persisted zustand store (which needs a browser/localStorage).
export const createDefaultIdentity = (): RobotIdentity => {
  const schemaDefaults = getChassisSchemaDefaults('STANDARD_DIFF');
  return {
    robotName: '',
    version: '1.0.0',
    alias: '',
    materialCode: '',
    venderName: '',
    navigationMethod: 'LASER_SLAM',
    driveType: 'STANDARD_DIFF',
    chassisShape: 'BOX',
    chassisLength: schemaDefaults.shape.length,
    chassisWidth: schemaDefaults.shape.width,
    chassisHeight: schemaDefaults.shape.height,
    headOffset: schemaDefaults.motionCenter.headOffset,
    tailOffset: schemaDefaults.motionCenter.tailOffset,
    leftOffset: schemaDefaults.motionCenter.leftOffset,
    rightOffset: schemaDefaults.motionCenter.rightOffset,
    maxSpeed: schemaDefaults.performance.maxSpeed,
    maxAccel: schemaDefaults.performance.maxAccel,
    maxDecel: schemaDefaults.performance.maxDecel,
    avoidMaxDec: schemaDefaults.performance.avoidMaxDec,
    selfWeight: 0,
    totalLoadWeight: 0
  };
};

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

const isUsableRobotConfig = (value: unknown): value is RobotConfig => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<RobotConfig>;
  return Boolean(candidate.identity && typeof candidate.identity === 'object' && Array.isArray(candidate.components));
};

/**
 * Create an instance boundary for catalog/imported component data.
 * A catalog entry may carry a source module UUID and interface UUIDs. Those
 * identifiers are not safe to reuse when the same module is installed twice.
 * Preserve the first ID when it is unused; otherwise create a new instance ID
 * and remap interface references that belong to this component instance.
 */
const materializeComponentInstance = (input: ComponentConfig, usedIds: Set<string>): ComponentConfig => {
  const componentId = input.id && !usedIds.has(input.id) ? input.id : uuidGen();
  const interfaceUuidMap = new Map<string, string>();
  (input.interfaces || []).forEach(iface => {
    if (iface.interfaceUuid) interfaceUuidMap.set(iface.interfaceUuid, uuidGen());
  });

  const interfaces = (input.interfaces || []).map(iface => ({
    ...iface,
    interfaceUuid: interfaceUuidMap.get(iface.interfaceUuid) || uuidGen(),
    linkedInterfaceUuid: (iface.linkedInterfaceUuid || []).map(uuid => interfaceUuidMap.get(uuid) || uuid),
  }));

  const generalAttr = input.generalAttr
    ? {
      ...input.generalAttr,
      moduleUuid: {
        ...(input.generalAttr.moduleUuid || {}),
        type: input.generalAttr.moduleUuid?.type || 'DATA_STRING',
        stringValue: componentId,
      },
    }
    : input.generalAttr;

  return {
    ...input,
    id: componentId,
    generalAttr,
    interfaces,
  };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper: Synchronize Identity fields to the root Chassis component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Exported (was private) — see createDefaultIdentity note above.
export const syncChassisAttributes = (config: RobotConfig): RobotConfig => {
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

            // §AUDIT-FIX(2026-09-12) / ground-truth cross-check against the real
            // controller_model_comp_desc.proto (staged from the user's own machine — see
            // audits/claude_review/AUDIT_AND_REFACTOR_PLAN.md addendum): RobotIdentity already
            // tracks rotateMaxAngSpeedFull/rotateMaxAngAccelerationFull (types.ts) and a real
            // saved project's chassisAttr group already contains "rotateMaxAngSpeed (Full Load)"
            // / "rotateMaxAngAcceleration (Full Load)" elements, but this sync function never
            // wrote them — a silent partial-sync gap (NO_PARTIAL_PARSE-adjacent) that meant
            // editing the Full-Load angular speed/accel fields in the wizard never reached the
            // component's exportable privateAttrs at all.
            if (ele.key === 'rotateMaxAngSpeed (Full Load)') return { ...ele, value: identity.rotateMaxAngSpeedFull ?? identity.rotateMaxAngSpeed };
            if (ele.key === 'rotateMaxAngAcceleration (Full Load)') return { ...ele, value: identity.rotateMaxAngAccelerationFull ?? identity.rotateMaxAngAcceleration };

            // §AUDIT-FIX(2026-09-12): selfWeight/totalLoadWeight are parsed FROM privateAttrs on
            // import (ImportService.ts: findVal('selfWeight')/findVal('totalLoadWeight')) and are
            // real fields on RobotIdentity, but this sync function had no branch to write them
            // back — the only reason this wasn't caught earlier is that App.tsx's handleExport
            // never sent chassis.privateAttrs to the backend at all (see the addendum's
            // "handleExport silently drops identity fields" finding), so the gap was invisible
            // until that export path was fixed to actually use this data.
            if (ele.key === 'selfWeight') return { ...ele, value: identity.selfWeight ?? 0 };
            if (ele.key === 'totalLoadWeight') return { ...ele, value: identity.totalLoadWeight ?? 0 };

            // 4. System Calculated (Read Only)
            if (ele.key === 'wheelsNum') return { ...ele, value: wheelsCount > 0 ? wheelsCount : 1 };
            if (ele.key === 'rotateDiameter') return { ...ele, value: calculatedRotateDiameter };

            // 5. Metadata
            // §AUDIT-FIX(2026-09): identity.venderName/materialCode default to '' and are not
            // always populated by ImportService (see audit). Previously this unconditionally
            // overwrote privateAttrs with '', so importing a file then editing ANY identity
            // field (e.g. robotName) silently erased a correctly-imported vendor/material code.
            // Only overwrite when the identity actually carries a non-empty value; otherwise
            // preserve whatever is already in privateAttrs.
            if (ele.key === 'venderName') return identity.venderName ? { ...ele, value: identity.venderName } : ele;
            if (ele.key === 'materialCode') return identity.materialCode ? { ...ele, value: identity.materialCode } : ele;

            return ele;
          })
        };
      });

      // §AUDIT-FIX(2026-09-12): identity.venderName/materialCode/version have NO home in the
      // diffChassis/steerChassis PrivateAttribute.json schema at all (confirmed by grepping the
      // real schema files for "venderName"/"materialCode" — zero matches), so the two branches
      // above (`ele.key === 'venderName' | 'materialCode'`) never actually match anything and
      // are dead code. Cross-checked against the real controller_model_comp_desc.proto (staged
      // from the user's machine): these three fields live on generalAttr instead —
      // Message_Module_General_Attribute.vender_name (field 10), .version_info (field 5), and a
      // keyed entry in .extend_params (field 20) for material_code — exactly where
      // ImportService.ts already reads them back from on import. This was a real, silent,
      // one-way gap: import correctly populated identity.venderName/materialCode/version (see
      // ImportService.ts §AUDIT-FIX(2026-09)), the wizard let the user edit them, but nothing
      // ever wrote the edit back into the chassis component — so every export silently kept
      // whatever value was present at import time (or nothing, for a newly-created robot).
      const existingGeneralAttr = c.generalAttr || {};
      const existingExtendParams: any[] = existingGeneralAttr.extendParams || existingGeneralAttr.extend_params || [];
      const updatedGeneralAttr = {
        ...existingGeneralAttr,
        ...(identity.venderName ? {
          venderName: { type: 'DATA_COMBOX', comboType: { typeKey: identity.venderName } }
        } : {}),
        ...(identity.version ? {
          versionInfo: { type: 'DATA_STRING', stringValue: identity.version }
        } : {}),
        ...(identity.materialCode ? {
          extendParams: [
            ...existingExtendParams.filter((p: any) => p.key !== 'material_code'),
            { key: 'material_code', type: 'DATA_STRING', stringValue: identity.materialCode }
          ]
        } : {})
      };

      return {
        ...c,
        name: identity.robotName || 'chassis',
        alias: `底盘 (${identity.robotName || 'Robot Chassis'})`,
        type: expectedType,
        privateAttrs: updatedPrivateAttrs,
        generalAttr: updatedGeneralAttr
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
  schemaRegistrySource: 'api' | 'static-snapshot' | 'unknown';
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
        schemaRegistrySource: 'unknown',

        fetchSchemas: async () => {
          try {
            const data = await apiFetchSchemas();
            // The Python API currently returns the system-grouped registry at
            // the response root, while some deployments wrap it in `registry`.
            // Accept both envelopes without inventing or rewriting schema data.
            const { registry, ...rootRegistry } = data || {};
            // [FIX ISS-006 / REQ-CL-05 root cause] Neither this response shape nor the
            // static-snapshot fallback below has ever actually had a `boardInterfaces`
            // field — so `boardInterfaces || {}` was silently ALWAYS `{}` for the whole
            // app lifetime, meaning addComponent()'s tryInjectInterfaces() could never
            // find a match for ANY board-based component (mainCPU, driver, ...),
            // regardless of which board model was selected. The real per-board interface
            // catalog lives in the separate BoardDescriptions.xml static asset (fetched
            // by apiFetchBoardXml(), which was defined and imported but never actually
            // called). Fetch + parse it here so boardInterfaces is populated for real.
            const boardInterfaces = await fetchRealBoardInterfaces();
            set({ 
              schemaRegistry: registry || rootRegistry || {}, 
              boardInterfaces,
              schemaRegistrySource: 'api',
            });
          } catch (e) {
            // The production domain may temporarily route /api to another
            // Worker. Use the repository's generated, authoritative asset
            // snapshot for validation, while preserving the API as primary.
            try {
              const response = await fetch('/worker-data/schemas.json');
              if (!response.ok) throw new Error(`static snapshot HTTP ${response.status}`);
              const data = await response.json();
              const { registry, ...rootRegistry } = data || {};
              set({
                schemaRegistry: registry || rootRegistry || {},
                boardInterfaces: await fetchRealBoardInterfaces(),
                schemaRegistrySource: 'static-snapshot',
              });
              console.warn('Schema API unavailable; using generated static snapshot for validation.', e);
            } catch (fallbackError) {
              set({ schemaRegistrySource: 'unknown' });
              console.error('Failed to fetch schemas and static snapshot:', { apiError: e, fallbackError });
            }
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

          // 2. Scan attributes for a board model selection (DATA_COMBOX).
          // [FIX ISS-006] Previously only checked the FIRST typeGroup of the FIRST
          // boardModel-keyed DATA_COMBOX attribute, so a component whose actual model
          // key lived in a later typeGroup (or a later attribute) silently got zero
          // interfaces even when boardInterfaces did have a matching entry. Now every
          // typeGroup of every boardModel DATA_COMBOX attribute is tried until one hits.
          if (!injected) {
            outer:
            for (const group of privateAttrs) {
              for (const attr of group.elements) {
                if (attr.type === 'DATA_COMBOX' && attr.key === 'boardModel' && attr.comboType?.typeGroups?.length) {
                  for (const typeGroup of attr.comboType.typeGroups) {
                    if (typeGroup?.key && tryInjectInterfaces(typeGroup.key)) {
                      injected = true;
                      break outer;
                    }
                  }
                }
              }
            }
          }

          // 3. Last-resort fallback: for MAINCPU-family boards with no exact model
          // match above (e.g. a generic/default board model not yet reflected in the
          // component's boardModel attribute), fall back to any board in
          // BoardDescriptions.xml whose typeKey follows the mainCPU naming convention
          // ("RA-MC-...", e.g. RA-MC-R318AT/AD/BN/CT) rather than silently leaving the
          // component with zero interfaces. Scoped to that prefix (not "any board") so
          // a mainCPU component never accidentally inherits an unrelated board's
          // interface set (e.g. a driver or IO-module board).
          if (!injected && (category as string) === 'MAINCPU') {
            const mcBoardKey = Object.keys(state.boardInterfaces).find(k => k.startsWith('RA-MC-'));
            if (mcBoardKey) {
              injected = tryInjectInterfaces(mcBoardKey);
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

        addComponentFromConfig: (config) => set((state) => {
          const usedIds = new Set(state.config.components.map(component => component.id));
          const instance = materializeComponentInstance(config, usedIds);
          return {
            config: { ...state.config, components: [...state.config.components, instance] },
            isDirty: true
          };
        }),

        addComponents: (components) => set((state) => {
          const usedIds = new Set(state.config.components.map(component => component.id));
          const instances = components.map(component => {
            const instance = materializeComponentInstance(component, usedIds);
            usedIds.add(instance.id);
            return instance;
          });
          return {
            config: { ...state.config, components: [...state.config.components, ...instances] },
            isDirty: true
          };
        }),

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

          const removedInterfaceUuids = new Set(
            state.config.components
              .filter(component => toRemove.has(component.id))
              .flatMap(component => (component.interfaces || []).map(iface => iface.interfaceUuid))
          );

          return {
            config: {
              ...state.config,
              components: state.config.components
                .filter(component => !toRemove.has(component.id))
                .map(component => ({
                  ...component,
                  interfaces: (component.interfaces || []).map(iface => ({
                    ...iface,
                    linkedInterfaceUuid: (iface.linkedInterfaceUuid || [])
                      .filter(uuid => !removedInterfaceUuids.has(uuid))
                  }))
                }))
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
                  ? { ...i, interfaceParams: updateInterfaceParamsValue(i.interfaceParams || {}, params) }
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
          config: isUsableRobotConfig(config) ? config : createDefaultProjectConfig(),
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
            // Keep the welcome page useful when the production API route is
            // unavailable. These are read-only repository-generated samples,
            // not a claim that the remote KV project list is reachable.
            try {
              const response = await fetch('/worker-data/user-saves-index.json');
              if (!response.ok) throw new Error(`static project index HTTP ${response.status}`);
              const projects = await response.json();
              console.warn('Project API unavailable; showing static project snapshots for validation.', e);
              return Array.isArray(projects)
                ? projects.map(project => ({ ...project, source: 'static-snapshot' }))
                : [];
            } catch (fallbackError) {
              console.error('List projects and static project snapshot failed:', { apiError: e, fallbackError });
              return [];
            }
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
            try {
              const response = await fetch(`/worker-data/user-saves/${encodeURIComponent(name)}.json`);
              if (!response.ok) throw new Error(`static project HTTP ${response.status}`);
              const config = await response.json();
              get().loadProject(config);
              console.warn(`Project API unavailable; loaded static snapshot: ${name}`, e);
              return true;
            } catch (fallbackError) {
              console.error('Load project and static snapshot failed:', { apiError: e, fallbackError });
              return false;
            }
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
        }),
        // Older browser storage entries can contain a partial/undefined config.
        // Never let persisted state replace the valid in-memory defaults.
        merge: (persistedState, currentState) => {
          const persisted = (persistedState || {}) as Partial<ProjectState>;
          return {
            ...currentState,
            ...persisted,
            config: isUsableRobotConfig(persisted.config) ? persisted.config : currentState.config,
          };
        }
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
