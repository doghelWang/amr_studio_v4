/**
 * AMR Studio V4 - 导出适配器 (Export Service)
 *
 * 该服务将前端 Store 中的数据转换为 CModel Proto JSON 格式。
 *
 * §CRITICAL_SECTIONS:
 * - Identity/性能字段导出 (lines 15-52): 必须完整
 * - Ability 结构导出 (lines 132-210): 必须使用专用映射器
 */

import { RobotConfig, ComponentConfig, SmartAttribute, AttributeGroup, InterfaceConfig, ControllerAbility } from '../store/types';

// §ENV: Environment detection for development warnings
const IS_DEV = typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'development';

// §IDENTITY_FIELDS: 完整字段清单 - 修改时必须同步更新
const IDENTITY_SHAPE_FIELDS = ['chassisLength', 'chassisWidth', 'chassisHeight'];
const IDENTITY_OFFSET_FIELDS = ['headOffset', 'tailOffset', 'leftOffset', 'rightOffset', 'headOffsetFull', 'tailOffsetFull', 'leftOffsetFull', 'rightOffsetFull'];
const IDENTITY_PERF_FIELDS = ['maxSpeed', 'maxAccel', 'maxDecel', 'maxRotSpeed', 'maxRotAccel', 'avoidMaxDec', 'maxSpeedFull', 'maxAccelFull', 'maxDecelFull', 'maxRotSpeedFull', 'maxRotAccelFull', 'avoidMaxDecFull', 'rotateMaxAngSpeed', 'rotateMaxAngSpeedFull', 'rotateMaxAngAcceleration', 'rotateMaxAngAccelerationFull'];
const IDENTITY_GENERAL_FIELDS = ['robotName', 'version', 'navigationMethod', 'driveType', 'chassisShape', 'selfWeight', 'totalLoadWeight'];

// §FIELD_REGISTRY: 统一字段注册表 (§NO_HARDCODE compliance)
export const ROBOT_IDENTITY_FIELD_REGISTRY = [
  // Shape fields
  ...IDENTITY_SHAPE_FIELDS.map(k => ({ key: k, category: 'shape', required: true })),
  // Offset fields
  ...IDENTITY_OFFSET_FIELDS.map(k => ({ key: k, category: 'offset', required: true })),
  // Performance fields
  ...IDENTITY_PERF_FIELDS.map(k => ({ key: k, category: 'performance', required: false })),
  // General fields
  ...IDENTITY_GENERAL_FIELDS.map(k => ({ key: k, category: 'general', required: true }))
];

// §VALIDATION_CONFIG: 字段验证规则
interface ValidationRule {
  key: string;
  category: string;
  required: boolean;
  validator?: (value: any) => boolean;
}

/**
 * §VALIDATE_EXPORT: 运行时字段完整性验证
 * §NO_PARTIAL_EXPORT enforcement
 */
function validateExport(identity: any, warnings: string[] = []): boolean {
  let isValid = true;

  // Check all registered fields
  for (const field of ROBOT_IDENTITY_FIELD_REGISTRY) {
    const value = identity[field.key];

    // Required field check
    if (field.required && (value === undefined || value === null)) {
      warnings.push(`[EXPORT_MISSING] Required field "${field.key}" (${field.category}) is missing`);
      isValid = false;
    }

    // Type validation for specific fields
    if (field.category === 'performance' && value !== undefined) {
      if (typeof value !== 'number' || isNaN(value)) {
        warnings.push(`[EXPORT_INVALID] Performance field "${field.key}" should be number, got ${typeof value}`);
        isValid = false;
      }
    }
  }

  // Check for extra fields not in registry (potential schema drift)
  const registeredKeys = new Set(ROBOT_IDENTITY_FIELD_REGISTRY.map(f => f.key));
  const identityKeys = Object.keys(identity);
  for (const key of identityKeys) {
    if (!registeredKeys.has(key)) {
      warnings.push(`[EXPORT_EXTRA] Field "${key}" not in registry (potential new field)`);
    }
  }

  return isValid;
}

export class ExportService {
  private static clone<T>(value: T): T {
    if (value === undefined || value === null) return value;
    return JSON.parse(JSON.stringify(value));
  }

  /** Merge modeled values into an imported proto-json object without dropping unknown fields. */
  private static mergeDefined(raw: any, modeled: any): any {
    if (modeled === undefined) return this.clone(raw);
    if (modeled === null || typeof modeled !== 'object' || Array.isArray(modeled)) {
      return modeled;
    }

    const result: any = raw && typeof raw === 'object' && !Array.isArray(raw)
      ? this.clone(raw)
      : {};
    Object.entries(modeled).forEach(([key, value]) => {
      if (value !== undefined) result[key] = this.mergeDefined(result[key], value);
    });
    return result;
  }

  private static rawField(raw: any, camelKey: string, snakeKey: string): any {
    return raw?.[camelKey] ?? raw?.[snakeKey];
  }

  /**
   * §NO_PARTIAL_EXPORT: 主导出入口，导出完整 RobotConfig
   */
  static exportToCModel(config: RobotConfig): any {
    const identity = config.identity;
    const validationWarnings: string[] = [];

    // §VALIDATION: Run before export
    const isValid = validateExport(identity, validationWarnings);

    if (!isValid) {
      console.warn('[EXPORT_VALIDATION_FAILED] Identity export has missing required fields:', validationWarnings);
      // In development, throw to catch issues early
      if (IS_DEV) {
        throw new Error(`Export validation failed:\n${validationWarnings.join('\n')}`);
      }
    }

    if (validationWarnings.length > 0) {
      console.log('[EXPORT_VALIDATION] Warnings:', validationWarnings);
    }

    // Build identity section from field registries
    const identityExport: any = {};

    // Shape
    IDENTITY_SHAPE_FIELDS.forEach(f => identityExport[f] = (identity as any)[f]);

    // Performance
    IDENTITY_PERF_FIELDS.forEach(f => identityExport[f] = (identity as any)[f]);

    // Offsets
    IDENTITY_OFFSET_FIELDS.forEach(f => identityExport[f] = (identity as any)[f]);

    // General
    IDENTITY_GENERAL_FIELDS.forEach(f => identityExport[f] = (identity as any)[f]);

    return {
      ...identityExport,
      moreModuleInfo: config.components
        .filter(c => !c.parentNodeUuid)
        .map(c => this.mapModuleGroup(c, config.components)),
      functionAbility: this.exportAbilities(config.abilities)
    };
  }

  /**
   * §ABILITY_EXPORT: 导出 ControllerAbility 到 Proto JSON 格式
   * 使用专用映射器，与 component 属性映射分离
   */
  static exportAbilities(abilities: ControllerAbility | undefined): any {
    if (!abilities?.functionAbility?.length && !abilities?.componentAbility?.length) return undefined;

    return {
      version: abilities.version || 'V1.0',
      componentAbility: abilities.componentAbility || [],
      functionAbility: (abilities.functionAbility || []).map(func => ({
        type: func.type,
        desc: func.desc,
        childFunction: (func.childFunction || []).map(cf => ({
          key: cf.key,
          desc: cf.desc,
          tips: cf.tips || '',
          attr: (cf.attr || []).map(a => this.mapAbilityAttr(a))
        }))
      }))
    };
  }

  /**
   * §ABILITY_ATTR: 专用 AbilityAttribute 映射器
   * 处理特殊结构：ARRAY, COMBOX, COMBOX 嵌套
   */
  private static mapAbilityAttr(a: any): any {
    // ARRAY type: e.g., { key: 'naviUniqueKey', type: 'ARRAY', arrayParam: {...} }
    if (a.type === 'ARRAY') {
      return {
        key: a.key,
        desc: a.desc,
        type: a.type,
        arrayParam: a.arrayParam ? {
          groupKey: a.arrayParam.groupKey,
          groupName: a.arrayParam.groupName,
          attrParams: (a.arrayParam.attrParams || []).map((ap: any) =>
            this.mapAbilityAttr(ap)
          )
        } : undefined
      };
    }

    // COMBOX type: e.g., { key: 'naviType', type: 'COMBOX', comboxParam: {...} }
    if (a.type === 'COMBOX') {
      return {
        key: a.key,
        desc: a.desc,
        type: a.type,
        comboxParam: a.comboxParam ? {
          key: a.comboxParam.key,
          desc: a.comboxParam.desc,
          tips: a.comboxParam.tips,
          comboxSource: a.comboxParam.comboxSource,
          value: a.comboxParam.value,
          options: (a.comboxParam.options || []).map((opt: any) => ({
            key: opt.key,
            desc: opt.desc,
            arrayCmobEle: opt.arrayCmobEle?.map((sub: any) =>
              this.mapAbilityAttr(sub)
            ) || []
          }))
        } : undefined
      };
    }

    // Standard attributes (values)
    return this.mapAttributeToCModelSimple(a);
  }

  /**
   * §COMPONENT_ATTR: 组件属性简化映射（不带 isAbility flag）
   */
  private static mapAttributeToCModelSimple(a: SmartAttribute): any {
    const base: any = {
      key: a.key,
      type: a.type,
      desc: a.desc,
      unit: a.unit,
      boolParse: a.boolParse,
      boolHide: a.boolHide,
      boolBasic: a.boolBasic,
      boolMustfill: a.boolMustfill,
      boolNoeditable: a.boolNoeditable
    };

    if (a.fixedSource !== undefined) base.fixedSource = a.fixedSource;

    if (a.value !== undefined && a.value !== null) {
      switch (a.type) {
        case 'DATA_DOUBLE': base.doubleValue = Number(a.value); break;
        case 'DATA_FLOAT': base.floatValue = Number(a.value); break;
        case 'DATA_INT32': base.int32Value = Math.floor(Number(a.value)); break;
        case 'DATA_UINT32': base.uint32Value = Math.floor(Number(a.value)); break;
        case 'DATA_INT64': base.int64Value = String(a.value); break;
        case 'DATA_UINT64': base.uint64Value = String(a.value); break;
        case 'DATA_BOOL': base.boolValue = Boolean(a.value); break;
        case 'DATA_STRING': base.stringValue = String(a.value); break;
        case 'DATA_IP': base.ipValue = String(a.value); break;
        case 'DATA_BYTES': base.bytesValue = a.value; break;
        case 'DATA_FIXED_E': base.stringFix = String(a.value); break;
      }
    }

    if (a.maxValue !== undefined) base.doubleMaxvalue = a.maxValue;
    if (a.minValue !== undefined) base.doubleMinvalue = a.minValue;

    if (a.type === 'DATA_COMBOX' && a.comboType) {
      base.comboType = {
        typeKey: a.comboType.typeKey,
        typeDesc: a.comboType.typeDesc,
        typeGroups: a.comboType.typeGroups?.map(g => ({
          key: g.key,
          desc: g.desc,
          arrayCmobEle: g.arrayCmobEle?.map(sub => this.mapAttributeToCModelSimple(sub))
        }))
      };
    }

    return base;
  }

  // Component mapping
  private static mapModuleGroup(comp: ComponentConfig, all: ComponentConfig[]): any {
    const children = all.filter(c => c.parentNodeUuid === comp.id);
    return {
      moduleGroupName: comp.moduleGroupName || comp.name || 'UnnamedModule',
      moduleGroupUuid: comp.moduleGroupUuid,
      moduleComponets: [this.mapComponentToCModel(comp)],
      moreModuleInfo: children.map(c => this.mapModuleGroup(c, all))
    };
  }

  private static mapComponentToCModel(c: ComponentConfig): any {
    const raw = this.clone(c.rawCmodelComponent || {});
    const rawGeneralAttr = this.rawField(raw, 'generalAttr', 'general_attr') || {};
    const rawPrivateAttr = this.rawField(raw, 'privateAttr', 'private_attr') || {};
    const rawInterfaceParams = this.rawField(raw, 'interfaceParams', 'interface_params') || {};
    const rawStructParam = this.rawField(raw, 'structParam', 'struct_param') || {};
    const rawExtendParams = this.rawField(rawStructParam, 'extendParams', 'extend_params') || [];

    const modeledGeneralAttr = {
      moduleName: { type: 'DATA_STRING', stringValue: c.name, boolParse: true },
      moduleUuid: { type: 'DATA_STRING', stringValue: c.id, boolParse: true },
      moduleShape: c.shape ? {
        shapeType: c.shape.type === 'BOX' ? 'ENUM_BOX' : c.shape.type === 'SPHERE' ? 'ENUM_SPHERE' : 'ENUM_CYLINDER',
        box: c.shape.type === 'BOX' ? { sizeLen: c.shape.length, sizeWidth: c.shape.width, sizeHeight: c.shape.height } : undefined,
        cylinder: c.shape.type === 'CYLINDER' ? { diameter: c.shape.diameter, height: c.shape.height } : undefined,
        sphere: c.shape.type === 'SPHERE' ? { diameter: c.shape.diameter } : undefined
      } : undefined
    };

    const rawGroups = this.rawField(rawPrivateAttr, 'privateAttrs', 'private_attrs') || [];
    const modeledGroups = c.privateAttrs.map(g => {
      const rawGroup = rawGroups.find((item: any) => item.key === g.key) || {};
      const rawElements = this.rawField(rawGroup, 'arrayBaseEle', 'array_base_ele') || [];
      const modeledElements = g.elements.map(e => {
        const rawElement = rawElements.find((item: any) => item.key === e.key) || {};
        return this.mergeDefined(rawElement, this.mapAttributeToCModelSimple(e));
      });
      return this.mergeDefined(rawGroup, {
        key: g.key,
        desc: g.desc,
        arrayBaseEle: modeledElements
      });
    });

    const rawInterfaces = this.rawField(rawInterfaceParams, 'interfaceGroup', 'interface_Group') || [];
    const modeledInterfaces = c.interfaces.map(i => {
      const rawInterface = rawInterfaces.find((item: any) =>
        (item.interfaceUuid || item.interface_uuid) === i.interfaceUuid
      ) || {};
      const modeledInterface = {
        key: i.key,
        type: i.type,
        path: i.path,
        desc: i.desc,
        interfaceUuid: i.interfaceUuid,
        linkedInterfaceUuid: i.linkedInterfaceUuid || []
      } as any;
      for (const key of ['linkAttrs', 'interfaceAttrs', 'interfaceParams']) {
        if ((i as any)[key] !== undefined) modeledInterface[key] = (i as any)[key];
      }
      return this.mergeDefined(rawInterface, modeledInterface);
    });

    const modeledExtendParams = [
      { key: 'locCoordX', type: 'DATA_DOUBLE', doubleValue: c.mountX },
      { key: 'locCoordY', type: 'DATA_DOUBLE', doubleValue: c.mountY },
      { key: 'locCoordZ', type: 'DATA_DOUBLE', doubleValue: c.mountZ },
      { key: 'locCoordROLL', type: 'DATA_DOUBLE', doubleValue: c.mountRoll },
      { key: 'locCoordPITCH', type: 'DATA_DOUBLE', doubleValue: c.mountPitch },
      { key: 'locCoordYAW', type: 'DATA_DOUBLE', doubleValue: c.mountYaw },
      { key: 'parentNodeUuid', type: 'DATA_COMBOX', comboType: { typeKey: c.parentNodeUuid || '' } }
    ].map(param => {
      const rawParam = rawExtendParams.find((item: any) => item.key === param.key) || {};
      return this.mergeDefined(rawParam, param);
    });

    const interfaceKey = Array.isArray((rawInterfaceParams as any).interface_Group) ? 'interface_Group' : 'interfaceGroup';
    return this.mergeDefined(raw, {
      generalAttr: {
        ...this.mergeDefined(rawGeneralAttr, modeledGeneralAttr)
      },
      privateAttr: {
        ...this.mergeDefined(rawPrivateAttr, { privateAttrs: modeledGroups })
      },
      interfaceAbility: c.interfaceAbility,
      interfaceParams: {
        ...this.mergeDefined(rawInterfaceParams, { [interfaceKey]: modeledInterfaces })
      },
      structParam: {
        ...this.mergeDefined(rawStructParam, { extendParams: modeledExtendParams }),
        segmentedLimitsParams: c.rawStructParam
      },
      boolDisable: c.disabled,
      boolDeprecated: c.deprecated
    });
  }
}
