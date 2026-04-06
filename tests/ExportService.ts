/**
 * ExportService 适配器 - 用于测试运行器
 * 从 RobotConfig 导出到 Proto JSON 格式
 *
 * §NO_PARTIAL_EXPORT: 所有 identity 字段必须导出，禁止遗漏
 */

import type { RobotConfig, ComponentConfig, SmartAttribute, AttributeGroup } from './types.js';

// §NO_PARTIAL_EXPORT: Complete field registry - MUST match RobotIdentity type in types.ts
const ROBOT_IDENTITY_FIELDS = [
  // General identity
  'robotName', 'version', 'materialCode', 'alias', 'venderName',
  'selfWeight', 'totalLoadWeight', 'navigationMethod', 'driveType', 'chassisShape',
  // Shape Dimensions
  'chassisLength', 'chassisWidth', 'chassisHeight',
  // Motion Center Offsets - Idle
  'headOffset', 'tailOffset', 'leftOffset', 'rightOffset',
  // Motion Center Offsets - Full Load
  'headOffsetFull', 'tailOffsetFull', 'leftOffsetFull', 'rightOffsetFull',
  // Performance - Idle
  'maxSpeed', 'maxAccel', 'maxDecel', 'maxRotSpeed', 'maxRotAccel',
  'avoidMaxDec', 'rotateMaxAngSpeed', 'rotateMaxAngAcceleration',
  // Performance - Full Load
  'maxSpeedFull', 'maxAccelFull', 'maxDecelFull', 'avoidMaxDecFull',
] as const;

export class ExportService {
  /**
   * §NO_PARTIAL_EXPORT: Exports COMPLETE RobotConfig to CModel Proto JSON
   *
   * Uses ROBOT_IDENTITY_FIELDS registry to ensure NO fields are omitted.
   * This prevents data loss in round-trip operations.
   */
  static exportToCModel(config: RobotConfig): any {
    // §P1: Build identity export using field registry
    const identityExport: any = {};
    const missingFields: string[] = [];

    for (const field of ROBOT_IDENTITY_FIELDS) {
      const value = (config.identity as any)[field];
      if (value !== undefined) {
        identityExport[field] = value;
      } else {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      console.warn(`[ExportService] Missing identity values for: ${missingFields.join(', ')}`);
    }

    // §P2: Return complete structure
    return {
      robotName: config.identity.robotName,
      robot_name: config.identity.robotName, // Legacy compatibility
      ...identityExport,
      moreModuleInfo: config.components
        .filter(c => !c.parentNodeUuid)
        .map(c => this.mapModuleGroup(c, config.components)),
      functionAbility: this.exportAbilities(config.abilities)
    };
  }

  /**
   * §NO_PARTIAL_EXPORT_VALIDATION: Returns list of missing identity fields
   * Use this before export to validate data completeness
   */
  static validateExport(config: RobotConfig): { valid: boolean; missing: string[]; exported: number; total: number } {
    const missing: string[] = [];
    for (const field of ROBOT_IDENTITY_FIELDS) {
      const value = (config.identity as any)[field];
      if (value === undefined || value === null || value === '') {
        missing.push(field);
      }
    }
    return {
      valid: missing.length === 0,
      missing,
      exported: ROBOT_IDENTITY_FIELDS.length - missing.length,
      total: ROBOT_IDENTITY_FIELDS.length
    };
  }

  // Recursive module group mapper
  private static mapModuleGroup(comp: ComponentConfig, all: ComponentConfig[]): any {
    const children = all.filter(c => c.parentNodeUuid === comp.id);
    return {
      moduleGroupName: comp.moduleGroupName || comp.name || 'UnnamedModule',
      moduleGroupUuid: comp.moduleGroupUuid,
      moduleComponets: [this.mapComponentToCModel(comp)],
      module_componets: [this.mapComponentToCModel(comp)], // Legacy compatibility
      moreModuleInfo: children.map(c => this.mapModuleGroup(c, all))
    };
  }

  // Ability export
  static exportAbilities(abilities: any): any {
    if (!abilities || !abilities.functionAbility) return undefined;

    return (abilities.functionAbility || []).map((f: any) => ({
      type: f.type,
      desc: f.desc,
      childFunction: (f.childFunction || []).map((cf: any) => ({
        key: cf.key,
        desc: cf.desc,
        tips: cf.tips,
        attr: (cf.attr || []).map((a: any) => this.mapAttributeToCModel(a, true))
      }))
    }));
  }

  // Component mapper
  private static mapComponentToCModel(c: ComponentConfig): any {
    return {
      generalAttr: {
        moduleName: { type: 'DATA_STRING', stringValue: c.name, boolParse: true },
        moduleDesc: { type: 'DATA_STRING', stringValue: c.alias, boolParse: true },
        moduleUuid: { type: 'DATA_STRING', stringValue: c.id, boolParse: true },
        mainModuleType: { comboType: { typeKey: c.mainModuleTypeKey } },
        subModuleType: { comboType: { typeKey: c.subModuleTypeKey } },
        moduleShape: c.shape ? {
          shapeType: c.shape.type === 'BOX' ? 'ENUM_BOX' : 'ENUM_CYLINDER',
          box: c.shape.type === 'BOX' ? {
            sizeLen: c.shape.length,
            sizeWidth: c.shape.width,
            sizeHeight: c.shape.height
          } : undefined,
          cylinder: c.shape.type === 'CYLINDER' ? {
            diameter: c.shape.diameter,
            sizeHeight: c.shape.height
          } : undefined
        } : undefined
      },
      privateAttr: {
        privateAttrs: c.privateAttrs.map(g => ({
          key: g.key,
          desc: g.desc,
          arrayBaseEle: g.elements.map(e => this.mapAttributeToCModel(e, false))
        }))
      },
      interfaceAbility: c.interfaceAbility,
      interfaceParams: {
        interfaceGroup: c.interfaces.map(i => ({
          key: i.key,
          type: i.type,
          path: i.path,
          desc: i.desc,
          interfaceUuid: i.interfaceUuid,
          linkedInterfaceUuid: i.linkedInterfaceUuid || []
        }))
      },
      structParam: {
        extendParams: [
          { key: 'locCoordX', type: 'DATA_DOUBLE', doubleValue: c.mountX, desc: 'X坐标' },
          { key: 'locCoordY', type: 'DATA_DOUBLE', doubleValue: c.mountY, desc: 'Y坐标' },
          { key: 'locCoordZ', type: 'DATA_DOUBLE', doubleValue: c.mountZ, desc: 'Z坐标' },
          { key: 'locCoordROLL', type: 'DATA_DOUBLE', doubleValue: c.mountRoll, desc: 'Roll旋转' },
          { key: 'locCoordPITCH', type: 'DATA_DOUBLE', doubleValue: c.mountPitch, desc: 'Pitch旋转' },
          { key: 'locCoordYAW', type: 'DATA_DOUBLE', doubleValue: c.mountYaw, desc: 'Yaw旋转' },
          { key: 'parentNodeUuid', type: 'DATA_COMBOX', comboType: { typeKey: c.parentNodeUuid || '' }, desc: '父节点UUID' }
        ],
        segmentedLimitsParams: c.rawStructParam
      },
      boolDisable: c.disabled,
      boolDeprecated: c.deprecated
    };
  }

  private static mapAttributeToCModel(a: SmartAttribute, isAbility: boolean): any {
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

    if (a.value !== undefined && a.value !== null) {
      switch (a.type) {
        case 'DATA_DOUBLE': base.doubleValue = Number(a.value); break;
        case 'DATA_INT32': base.int32Value = Math.floor(Number(a.value)); break;
        case 'DATA_BOOL': base.boolValue = Boolean(a.value); break;
        case 'DATA_STRING': base.stringValue = String(a.value); break;
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
          [isAbility ? 'arrayAttr' : 'arrayCmobEle']: g.arrayCmobEle?.map(sub =>
            this.mapAttributeToCModel(sub, isAbility)
          )
        }))
      };
    }

    return base;
  }
}
