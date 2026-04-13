import {
  ComponentConfig,
  SmartAttribute,
  AttributeGroup,
  MainModuleType,
  InterfaceConfig,
  RobotConfig,
  ControllerAbility
} from './types';
import abilityRegistry from './ability_registry.json';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_FULL_LOAD_RATIOS } from './PerformanceConfig';

export class ImportService {
  // §SCHEMA-DRIVEN: All defaults now come from actual data or constants
  // See PerformanceConfig.ts for Full Load ratios (business logic constants)

  private static readonly CATEGORY_MAP: Record<string, MainModuleType> = {
    'chassis': 'CHASSIS',
    'driveWheel': 'DRIVEWHEEL',
    'driver': 'DRIVER',
    'sensor': 'SENSOR',
    'mainCPU': 'MAINCPU',
    'extendedlnterface': 'IO_BOARD',
    'extendedInterface': 'IO_BOARD',
    'ioModule': 'IO_BOARD',
    'diffSteerWheel': 'DRIVEWHEEL',
    'steerWheel': 'DRIVEWHEEL',
    'battery': 'BATTERY',
    'button': 'BUTTON',
    'light': 'LIGHT',
    'actor': 'ACTOR',
    'motor': 'MOTOR',
  };

  static parseCompDesc(json: any, schemaRegistry?: Record<string, any>): Partial<RobotConfig> {
    console.group('%c ⚡ [ImportService] Professional AOBO Deep Discovery', 'color: #722ed1; font-weight: bold;');

    const components: ComponentConfig[] = [];
    const infoKey = json.moreModuleInfo ? "moreModuleInfo" : "more_module_info";

    if (json[infoKey] && Array.isArray(json[infoKey])) {
      json[infoKey].forEach((group: any) => this.processModuleGroup(group, components, null, schemaRegistry));
    }

    // ━━━ 1. Build Absolute ID Index (English SrcName is Truth) ━━━
    const moduleNameToId = new Map<string, string>();
    const ifaceToComp = new Map<string, string>();

    components.forEach(c => {
      const moduleName = c.generalAttr?.moduleName?.stringValue || c.generalAttr?.module_name?.string_value;
      if (moduleName) moduleNameToId.set(moduleName, c.id);
      c.interfaces.forEach(i => ifaceToComp.set(i.interfaceUuid, c.id));
    });

    const chassis = components.find(c => c.category === 'CHASSIS');
    const identity: any = {
      robotName: json.robotName || json.robot_name || 'Imported_AMR',
      driveType: 'STANDARD_DIFF',
      powerSlots: {}
    };

    if (chassis) {
      // §SCHEMA-DRIVEN-FIX: Parse from actual data, no hardcoded fallbacks
      identity.chassisLength = chassis.shape?.length ?? 0;
      identity.chassisWidth = chassis.shape?.width ?? 0;
      identity.chassisHeight = chassis.shape?.height ?? 0;

      // §24: chassisShape must be explicitly set from moduleShape.shapeType
      const shapeType = chassis.generalAttr?.moduleShape?.shapeType || chassis.generalAttr?.module_shape?.shape_type;
      identity.chassisShape = (shapeType === 'ENUM_CYLINDER' ? 'CYLINDER' : 'BOX');

      // Recursive value finder for chassis physics
      const findVal = (key: string) => this.deepFindAttributeValue(chassis.privateAttrs, key);

      // §SCHEMA-DRIVEN-FIX: Parse motion center offsets (fallback to 0 per XML Schema default)
      identity.headOffset = Number(findVal('headOffset(Idle)')) || 0;
      identity.tailOffset = Number(findVal('tailOffset(Idle)')) || 0;
      identity.leftOffset = Number(findVal('leftOffset(Idle)')) || 0;
      identity.rightOffset = Number(findVal('rightOffset(Idle)')) || 0;

      // §FIX: Parse full load offsets (fallback to idle values if not present)
      identity.headOffsetFull = Number(findVal('headOffset (Full Load)')) || identity.headOffset;
      identity.tailOffsetFull = Number(findVal('tailOffset (Full Load)')) || identity.tailOffset;
      identity.leftOffsetFull = Number(findVal('leftOffset (Full Load)')) || identity.leftOffset;
      identity.rightOffsetFull = Number(findVal('rightOffset (Full Load)')) || identity.rightOffset;

      // §C002-FIX: Parse performance attributes using centralized ratio config (business constants)
      const ratios = DEFAULT_FULL_LOAD_RATIOS;

      identity.maxSpeed = Number(findVal('maxSpeed(Idle)')) || 0;
      const maxSpeedFullFile = findVal('maxSpeed (Full Load)');
      identity.maxSpeedFull = maxSpeedFullFile !== undefined ? Number(maxSpeedFullFile) : Math.round(identity.maxSpeed * ratios.maxSpeed);

      identity.maxAccel = Number(findVal('maxAcceleration(Idle)')) || 0;
      const maxAccelFullFile = findVal('maxAcceleration (Full Load)');
      identity.maxAccelFull = maxAccelFullFile !== undefined ? Number(maxAccelFullFile) : Math.round(identity.maxAccel * ratios.maxAcceleration);

      identity.maxDecel = Number(findVal('maxDeceleration(Idle)')) || 0;
      const maxDecelFullFile = findVal('maxDeceleration (Full Load)');
      identity.maxDecelFull = maxDecelFullFile !== undefined ? Number(maxDecelFullFile) : Math.round(identity.maxDecel * ratios.maxDeceleration);

      identity.avoidMaxDec = Number(findVal('avoidMaxDec (Idle)')) || 0;
      const avoidMaxDecFullFile = findVal('avoidMaxDec (Full Load)');
      identity.avoidMaxDecFull = avoidMaxDecFullFile !== undefined ? Number(avoidMaxDecFullFile) : Math.round(identity.avoidMaxDec * ratios.avoidMaxDec);

      identity.rotateMaxAngSpeed = Number(findVal('rotateMaxAngSpeed (Idle)')) || 0;
      identity.rotateMaxAngAcceleration = Number(findVal('rotateMaxAngAcceleration (Idle)')) || 0;

      const rotateMaxAngSpeedFullFile = findVal('rotateMaxAngSpeed (Full Load)');
      identity.rotateMaxAngSpeedFull = rotateMaxAngSpeedFullFile !== undefined ? Number(rotateMaxAngSpeedFullFile) : Math.round(identity.rotateMaxAngSpeed * ratios.maxSpeed);

      const rotateMaxAngAccelerationFullFile = findVal('rotateMaxAngAcceleration (Full Load)');
      identity.rotateMaxAngAccelerationFull = rotateMaxAngAccelerationFullFile !== undefined ? Number(rotateMaxAngAccelerationFullFile) : Math.round(identity.rotateMaxAngAcceleration * ratios.maxAcceleration);

      identity.selfWeight = Number(findVal('selfWeight')) || 0;
      identity.totalLoadWeight = Number(findVal('totalLoadWeight')) || 0;
    }

    // ━━━ 2. Precise Topology Engine ━━━
    const wheels = components.filter(c => c.category === 'DRIVEWHEEL');
    const steerWheels = wheels.filter(w => w.type.toLowerCase().includes('steer'));
    if (steerWheels.length === 1) identity.driveType = 'SINGLE_STEER';
    else if (steerWheels.length === 2) identity.driveType = 'DUAL_STEER';
    else if (steerWheels.length >= 4) identity.driveType = 'QUAD_STEER';
    else if (wheels.length >= 2) identity.driveType = 'STANDARD_DIFF';

    const slots: Record<string, string> = {};

    wheels.forEach((w) => {
      let posKey = '';
      if (identity.driveType === 'STANDARD_DIFF') posKey = w.mountY > 0 ? 'left_group' : 'right_group';
      else if (identity.driveType === 'DUAL_STEER') posKey = w.mountX > 0 ? 'front_steer' : 'rear_steer';
      else {
        const isL = w.mountY > 0; const isF = w.mountX >= 0;
        if (isL && isF) posKey = 'fl_steer'; else if (!isL && isF) posKey = 'fr_steer';
        else if (isL && !isF) posKey = 'rl_steer'; else posKey = 'rr_steer';
      }

      console.group(`[Trace] Wheel: ${w.alias} (${posKey})`);
      slots[`wheel_${posKey}`] = w.id;

      const pairs = [
        { key: 'relateLeftMotor', role: 'walk_left' },
        { key: 'relateRightMotor', role: 'walk_right' },
        { key: 'relateWalkMotor', role: 'walk' },
        { key: 'relateRotMotor', role: 'steer' },
        { key: 'relatedEncode', role: 'encoder' }
      ];

      pairs.forEach(p => {
        const targetSrcName = this.deepFindAttributeValue(w.privateAttrs, p.key);
        if (!targetSrcName) return;

        const targetId = moduleNameToId.get(targetSrcName);
        const targetComp = components.find(c => c.id === targetId);

        if (targetComp) {
          console.log(`- SUCCESS: Semantic Match [${p.key}] -> EN: ${targetSrcName} | CN: ${targetComp.alias}`);

          if (p.role === 'encoder') {
            targetComp.parentNodeUuid = w.id;
            slots[`encoder_${posKey}`] = targetComp.id;
          } else {
            // Tracing Driver via Wiring (Bit-Perfect Line logic)
            let driver: ComponentConfig | undefined;
            for (const iface of targetComp.interfaces) {
              for (const lUuid of (iface.linkedInterfaceUuid || [])) {
                const dId = ifaceToComp.get(lUuid);
                const dComp = components.find(c => c.id === dId);
                if (dComp && dComp.category === 'DRIVER') { driver = dComp; break; }
              }
              if (driver) break;
            }

            if (driver) {
              console.log(` - SUCCESS: Wiring Match -> Driver EN: ${driver.srcName}`);
              const dSlot = p.role.includes('steer') ? `steerDriver_${posKey}` : `driver_${posKey}`;
              const mSlot = p.role.includes('steer') ? `steerMotor_${posKey}` : `motor_${posKey}`;
              slots[dSlot] = driver.id;
              slots[mSlot] = targetComp.id;
              driver.parentNodeUuid = w.id;
              targetComp.parentNodeUuid = driver.id;
            } else {
              targetComp.parentNodeUuid = w.id;
            }
          }
        }
      });
      console.groupEnd();
    });

    identity.powerSlots = slots;
    console.groupEnd();

    return { components, identity };
  }

  /**
   * §24.2/24.5: Recursively search for a key in privateAttrs.
   * For DATA_COMBOX fields, only searches the SELECTED typeGroup
   * (matched by comboType.typeKey), not all groups.
   */
  private static deepFindAttributeValue(attrs: AttributeGroup[], key: string): any {
    const search = (eles: SmartAttribute[]): any => {
      for (const e of eles) {
        if (e.key === key) return e.value;
        if (e.comboType?.typeGroups) {
          // §24.2: Only recurse into the selected group
          const selectedKey = e.comboType.typeKey;
          const selectedGroup = e.comboType.typeGroups.find(
            (g: any) => g.key === selectedKey
          );
          if (selectedGroup) {
            const res = search(selectedGroup.arrayCmobEle || []);
            if (res !== undefined) return res;
          }
        }
      }
    };
    for (const g of attrs) {
      const res = search(g.elements);
      if (res !== undefined) return res;
    }
  }

  static parseAbilities(json: any): ControllerAbility {
    const funcKey = json.functionAbility ? "functionAbility" : "function_ability";
    if (!json || !json[funcKey]) return abilityRegistry as any;
    return {
      version: json.version || 'V1.0',
      componentAbility: json.componentAbility || json.component_ability || [],
      functionAbility: json[funcKey].map((func: any) => ({
        type: func.type, desc: func.desc,
        childFunction: (func.childFunction || func.child_function || []).map((child: any) => ({
          key: child.key, desc: child.desc, tips: child.tips,
          attr: (child.attr || []).map((a: any) => {
            const importedAttr = this.transformAbiSetAttr(a);
            const templateAttr = this.findAbilityTemplateAttr(func.type, child.key, importedAttr.key);
            return this.hydrateAbilityAttr(importedAttr, templateAttr);
          })
        }))
      }))
    };
  }

  private static findAbilityTemplateAttr(funcType: string, childKey: string, attrKey: string): any {
    const functions = (abilityRegistry as any).functionAbility || [];
    const funcTemplate = functions.find((func: any) => func.type === funcType);
    const childTemplate = funcTemplate?.childFunction?.find((child: any) => child.key === childKey);
    return childTemplate?.attr?.find((attr: any) => attr.key === attrKey);
  }

  private static cloneAbilityTemplate(template: any): any {
    return template ? JSON.parse(JSON.stringify(template)) : undefined;
  }

  private static mergeAbilitySubAttrs(templateAttrs: any[] = [], importedAttrs: any[] = []): any[] {
    return templateAttrs.map((templateAttr: any) => {
      const importedAttr = importedAttrs.find((attr: any) => attr.key === templateAttr.key);
      return this.hydrateAbilityAttr(importedAttr || templateAttr, templateAttr);
    });
  }

  private static hydrateAbilityAttr(importedAttr: any, templateAttr: any): any {
    if (!templateAttr) {
      return importedAttr;
    }

    const template = this.cloneAbilityTemplate(templateAttr);
    if (!importedAttr) {
      return template;
    }

    const hasStructuredConfig = Boolean(
      importedAttr.arrayParam ||
      importedAttr.comboxParam ||
      importedAttr.fixedSource?.length ||
      importedAttr.boolParse
    );

    if (!hasStructuredConfig) {
      return template;
    }

    const merged: any = {
      ...template,
      ...importedAttr
    };

    if (template.arrayParam || importedAttr.arrayParam) {
      merged.arrayParam = {
        ...(template.arrayParam || {}),
        ...(importedAttr.arrayParam || {})
      };
      merged.arrayParam.attrParams = this.mergeAbilitySubAttrs(
        template.arrayParam?.attrParams || [],
        importedAttr.arrayParam?.attrParams || []
      );
    }

    if (template.comboxParam || importedAttr.comboxParam) {
      merged.comboxParam = {
        ...(template.comboxParam || {}),
        ...(importedAttr.comboxParam || {})
      };

      const templateOptions = template.comboxParam?.options || [];
      const importedOptions = importedAttr.comboxParam?.options || [];
      merged.comboxParam.options = templateOptions.map((templateOption: any) => {
        const importedOption = importedOptions.find((option: any) => option.key === templateOption.key);
        return {
          ...templateOption,
          ...importedOption,
          arrayAttr: this.mergeAbilitySubAttrs(
            templateOption.arrayAttr || [],
            importedOption?.arrayAttr || []
          )
        };
      });
    }

    return merged;
  }

  private static transformAbiSetAttr(attr: any): any {
    const type = attr.type || attr.type_key || 'DATA_STRING';
    const baseAttr: any = {
      key: attr.key,
      desc: attr.desc || attr.key,
      tips: attr.tips,
      type: this.normalizeAbilityType(type),
      maxCount: attr.maxCount ?? attr.max_count ?? 0,
      copyEnable: attr.copyEnable ?? attr.copy_enable ?? false
    };

    // FIXED_E - hardware mapping
    if (type === 'FIXED_E' || type === 'DATA_FIXED_E') {
      return {
        ...baseAttr,
        fixedSource: attr.fixedSource || [],
        boolParse: true
      };
    }

    // COMBOX_E - convert to comboxParam.options
    if (type === 'COMBOX_E' || type === 'COMBOX') {
      const comboxP = attr.comboxParam || attr.combox_param;
      if (comboxP) {
        const elements = comboxP.customCombox?.element || [];
        baseAttr.comboxParam = {
          key: comboxP.key,
          desc: comboxP.desc,
          value: comboxP.defaultSelect || '',
          options: elements.map((el: any) => ({
            key: el.key,
            desc: el.desc,
            arrayAttr: (el.arrayAttr || []).flatMap((aa: any) =>
              (aa.attrParams || []).map((ap: any) => this.transformAbiSetAttr(ap))
            )
          }))
        };
      }
      return baseAttr;
    }

    // ARRAY_E
    if (type === 'ARRAY_E' || type === 'ARRAY') {
      const arrayP = attr.arrayParam || attr.array_param;
      if (arrayP) {
        baseAttr.arrayParam = {
          groupKey: arrayP.groupKey || attr.key,
          groupName: arrayP.groupName || '',
          attrParams: (arrayP.attrParams || []).map((ap: any) => this.transformAbiSetAttr(ap))
        };
      }
      return baseAttr;
    }

    return baseAttr;
  }

  private static normalizeAbilityType(type: string): string {
    const mapping: Record<string, string> = {
      'COMBOX_E': 'COMBOX', 'ARRAY_E': 'ARRAY', 'FIXED_E': 'DATA_FIXED_E'
    };
    return mapping[type] || type;
  }

  private static processModuleGroup(group: any, list: ComponentConfig[], parentUuid: string | null, schemaRegistry?: Record<string, any>) {
    const groupName = group.moduleGroupName || group.module_group_name || '';
    const groupUuid = group.moduleGroupUuid || group.module_group_uuid || uuidv4();
    const comps = group.moduleComponets || group.module_componets || [];
    if (Array.isArray(comps)) {
      comps.forEach((comp: any) => list.push(this.mapToComponent(comp, groupName, groupUuid, parentUuid, schemaRegistry)));
    }
    const infoKey = group.moreModuleInfo ? "moreModuleInfo" : "more_module_info";
    if (group[infoKey] && Array.isArray(group[infoKey])) {
      group[infoKey].forEach((sub: any) => this.processModuleGroup(sub, list, null, schemaRegistry));
    }
  }

  private static mapToComponent(comp: any, groupName: string, groupUuid: string, parentUuid: string | null, schemaRegistry?: Record<string, any>): ComponentConfig {
    const gen = comp.generalAttr || comp.general_attr || {};
    const struct = comp.structParam || comp.struct_param || {};
    const structExtend = struct.extendParams || struct.extend_params || [];

    const rawMainType = gen.mainModuleType?.comboType?.typeKey || gen.main_module_type?.combo_type?.type_key || 'unknown';
    const subTypeKey = gen.subModuleType?.comboType?.typeKey || gen.sub_module_type?.combo_type?.type_key || 'unknown';
    const category: MainModuleType = (ImportService.CATEGORY_MAP[rawMainType] || rawMainType.toUpperCase()) as MainModuleType;

    // ━━━ FIX: interfaceParams is at ROOT level, not inside generalAttr ━━━
    const ifaceRoot = comp.interfaceParams || comp.interface_params || {};
    const interfaces: InterfaceConfig[] = (ifaceRoot.interfaceGroup || ifaceRoot.interface_Group || []).map((inf: any) => ({
      key: inf.key, type: inf.type, path: inf.path, desc: inf.desc || inf.key,
      interfaceUuid: inf.interfaceUuid || inf.interface_uuid || uuidv4(),
      linkedInterfaceUuid: inf.linkedInterfaceUuid || inf.linked_interface_uuid || [],
    }));

    const privateAttrs: AttributeGroup[] = (comp.privateAttr?.privateAttrs || comp.private_attr?.private_attrs || []).map((grp: any) => ({
      key: grp.key || '', desc: grp.desc || '',
      elements: (grp.arrayBaseEle || grp.array_base_ele || []).map((attr: any) => this.mapAttribute(attr)),
    }));

    const srcName = gen.moduleName?.stringValue || gen.module_name?.string_value ||
    structExtend.find((p:any) => p.key === 'module_srcname')?.stringValue;

    const uuid = gen.moduleUuid?.stringValue || gen.module_uuid?.string_value || uuidv4();
    const physicalName = gen.moduleName?.stringValue || gen.module_name?.string_value || subTypeKey;

    return {
      id: uuid,
      srcName: physicalName,
      name: physicalName,
      alias: gen.moduleDesc?.stringValue || gen.module_desc?.string_value || physicalName,
      type: subTypeKey, category, mainModuleTypeKey: rawMainType, subModuleTypeKey: subTypeKey,
      parentNodeUuid: parentUuid, moduleGroupName: groupName, moduleGroupUuid: groupUuid,
      mountX: this.findExtend(structExtend, 'locCoordX'),
      mountY: this.findExtend(structExtend, 'locCoordY'),
      mountZ: this.findExtend(structExtend, 'locCoordZ'),
      mountRoll: this.findExtend(structExtend, 'locCoordROLL'),
      mountPitch: this.findExtend(structExtend, 'locCoordPITCH'),
      mountYaw: this.findExtend(structExtend, 'locCoordYAW'),
      privateAttrs, interfaces,
      shape: gen.moduleShape?.box ? {
        type: 'BOX', length: gen.moduleShape.box.sizeLen || gen.moduleShape.box.size_len || 0,
        width: gen.moduleShape.box.sizeWidth || gen.moduleShape.box.size_width || 0,
        height: gen.moduleShape.box.sizeHeight || gen.moduleShape.box.size_height || 0
      } : undefined,
      generalAttr: gen,
    };
  }

  private static findExtend(extend: any[], key: string): number {
    const item = extend?.find((p: any) => p.key === key);
    return item?.doubleValue ?? item?.double_value ?? 0;
  }

  private static mapAttribute(attr: any): SmartAttribute {
    const combo = attr.comboType || attr.combo_type;
    return {
      key: attr.key, desc: attr.desc || attr.key, type: attr.type || 'DATA_DOUBLE',
      value: attr.stringValue ?? attr.string_value ?? attr.stringFix ?? attr.string_fix ?? attr.doubleValue ?? attr.double_value ?? attr.boolValue ?? attr.bool_value ?? attr.int32Value ?? attr.int_32_value ?? combo?.typeKey,
      maxValue: attr.doubleMaxvalue ?? attr.int32Maxvalue,
      minValue: attr.doubleMinvalue ?? attr.int32Minvalue,
      unit: attr.unit,
      boolParse: attr.boolParse ?? attr.bool_parse,
      boolHide: attr.boolHide ?? attr.bool_hide,
      boolNoeditable: attr.boolNoeditable ?? attr.bool_noeditable,
      boolMustfill: attr.boolMustfill ?? attr.bool_mustfill,
      boolBasic: true,
      comboType: combo ? {
        typeKey: combo.typeKey || combo.type_key,
        typeDesc: combo.typeDesc || combo.type_desc,
        typeGroups: (combo.typeGroups || combo.type_groups || []).map((g: any) => ({
          key: g.key || g.desc, desc: g.desc,
          arrayCmobEle: (g.arrayCmobEle || g.array_cmob_ele || []).map((sub: any) => this.mapAttribute(sub))
        }))
      } : undefined
    };
  }

  static mapEntityToComponent(entityJson: any, schemaRegistry?: Record<string, any>): ComponentConfig {
    const comps = entityJson.moduleComponets || entityJson.module_componets || [];
    if (!comps[0]) throw new Error("Invalid entity");
    return this.mapToComponent(comps[0], "LibraryGroup", uuidv4(), null, schemaRegistry);
  }
}
