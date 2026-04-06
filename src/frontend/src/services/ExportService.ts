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

// §IDENTITY_FIELDS: 完整字段清单 - 修改时必须同步更新
const IDENTITY_SHAPE_FIELDS = ['chassisLength', 'chassisWidth', 'chassisHeight'];
const IDENTITY_OFFSET_FIELDS = ['headOffset', 'tailOffset', 'leftOffset', 'rightOffset', 'headOffsetFull', 'tailOffsetFull', 'leftOffsetFull', 'rightOffsetFull'];
const IDENTITY_PERF_FIELDS = ['maxSpeed', 'maxAccel', 'maxDecel', 'avoidMaxDec', 'maxSpeedFull', 'maxAccelFull', 'maxDecelFull', 'avoidMaxDecFull', 'rotateMaxAngSpeed', 'rotateMaxAngAcceleration'];
const IDENTITY_GENERAL_FIELDS = ['robotName', 'version', 'navigationMethod', 'driveType', 'chassisShape', 'selfWeight', 'totalLoadWeight'];

export class ExportService {
  /**
   * §NO_PARTIAL_EXPORT: 主导出入口，导出完整 RobotConfig
   */
  static exportToCModel(config: RobotConfig): any {
    const identity = config.identity;

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
    if (!abilities?.functionAbility?.length) return undefined;

    return {
      version: abilities.version || 'V1.0',
      functionAbility: abilities.functionAbility.map(func => ({
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
    return {
      generalAttr: {
        moduleName: { type: 'DATA_STRING', stringValue: c.name, boolParse: true },
        moduleUuid: { type: 'DATA_STRING', stringValue: c.id, boolParse: true },
        moduleShape: c.shape ? {
          shapeType: c.shape.type === 'BOX' ? 'ENUM_BOX' : 'ENUM_CYLINDER',
          box: c.shape.type === 'BOX' ? { sizeLen: c.shape.length, sizeWidth: c.shape.width, sizeHeight: c.shape.height } : undefined,
          cylinder: c.shape.type === 'CYLINDER' ? { diameter: c.shape.diameter, sizeHeight: c.shape.height } : undefined
        } : undefined
      },
      privateAttr: {
        privateAttrs: c.privateAttrs.map(g => ({
          key: g.key,
          desc: g.desc,
          arrayBaseEle: g.elements.map(e => this.mapAttributeToCModelSimple(e))
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
          { key: 'locCoordX', type: 'DATA_DOUBLE', doubleValue: c.mountX },
          { key: 'locCoordY', type: 'DATA_DOUBLE', doubleValue: c.mountY },
          { key: 'locCoordZ', type: 'DATA_DOUBLE', doubleValue: c.mountZ },
          { key: 'locCoordROLL', type: 'DATA_DOUBLE', doubleValue: c.mountRoll },
          { key: 'locCoordPITCH', type: 'DATA_DOUBLE', doubleValue: c.mountPitch },
          { key: 'locCoordYAW', type: 'DATA_DOUBLE', doubleValue: c.mountYaw },
          { key: 'parentNodeUuid', type: 'DATA_COMBOX', comboType: { typeKey: c.parentNodeUuid || '' } }
        ],
        segmentedLimitsParams: c.rawStructParam
      },
      boolDisable: c.disabled,
      boolDeprecated: c.deprecated
    };
  }
}
