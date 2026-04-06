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
  // §C001-FIX: Schema-driven default values (replaces hardcoded magic numbers)
  // These defaults should ideally come from Schema XML, using constants as interim step
  private static readonly SCHEMA_DEFAULTS = {
    chassis: {
      length: 1200,
      width: 800,
      height: 0
    },
    offsets: {
      idle: {
        head: 600,
        tail: 600,
        left: 400,
        right: 400
      }
    },
    performance: {
      // Full Load ratios - centralized here instead of scattered across codebase
      fullLoadRatios: {
        maxSpeed: 0.8,
        maxAcceleration: 0.4,
        maxDeceleration: 0.5,
        avoidMaxDec: 1.0
      }
    }
  };

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
      // §C001-FIX: Parse chassis shape dimensions using schema-driven defaults
      identity.chassisLength = chassis.shape?.length ?? this.SCHEMA_DEFAULTS.chassis.length;
      identity.chassisWidth = chassis.shape?.width ?? this.SCHEMA_DEFAULTS.chassis.width;
      identity.chassisHeight = chassis.shape?.height ?? this.SCHEMA_DEFAULTS.chassis.height;

      // §24: chassisShape must be explicitly set from moduleShape.shapeType
      const shapeType = chassis.generalAttr?.moduleShape?.shapeType || chassis.generalAttr?.module_shape?.shape_type;
      identity.chassisShape = (shapeType === 'ENUM_CYLINDER' ? 'CYLINDER' : 'BOX');

      // Recursive value finder for chassis physics
      const findVal = (key: string) => this.deepFindAttributeValue(chassis.privateAttrs, key);

      // §C001-FIX: Parse motion center offsets with schema-driven defaults
      const defaults = this.SCHEMA_DEFAULTS.offsets.idle;
      identity.headOffset = Number(findVal('headOffset(Idle)')) || defaults.head;
      identity.tailOffset = Number(findVal('tailOffset(Idle)')) || defaults.tail;
      identity.leftOffset = Number(findVal('leftOffset(Idle)')) || defaults.left;
      identity.rightOffset = Number(findVal('rightOffset(Idle)')) || defaults.right;

      // §FIX: Parse full load offsets (fallback to idle values if not present)
      identity.headOffsetFull = Number(findVal('headOffset (Full Load)')) || identity.headOffset;
      identity.tailOffsetFull = Number(findVal('tailOffset (Full Load)')) || identity.tailOffset;
      identity.leftOffsetFull = Number(findVal('leftOffset (Full Load)')) || identity.leftOffset;
      identity.rightOffsetFull = Number(findVal('rightOffset (Full Load)')) || identity.rightOffset;

      // §C001/C002-FIX: Parse performance attributes using centralized ratio config
      const ratios = this.SCHEMA_DEFAULTS.performance.fullLoadRatios;

      identity.maxSpeed = Number(findVal('maxSpeed(Idle)')) || 0;
      identity.maxSpeedFull = Number(findVal('maxSpeed (Full Load)')) || (identity.maxSpeed * ratios.maxSpeed);

      identity.maxAccel = Number(findVal('maxAcceleration(Idle)')) || 0;
      identity.maxAccelFull = Number(findVal('maxAcceleration (Full Load)')) || (identity.maxAccel * ratios.maxAcceleration);

      identity.maxDecel = Number(findVal('maxDeceleration(Idle)')) || 0;
      identity.maxDecelFull = Number(findVal('maxDeceleration (Full Load)')) || (identity.maxDecel * ratios.maxDeceleration);

      identity.avoidMaxDec = Number(findVal('avoidMaxDec (Idle)')) || 0;
      identity.avoidMaxDecFull = Number(findVal('avoidMaxDec (Full Load)')) || identity.avoidMaxDec;

      identity.rotateMaxAngSpeed = Number(findVal('rotateMaxAngSpeed (Idle)')) || 0;
      identity.rotateMaxAngAcceleration = Number(findVal('rotateMaxAngAcceleration (Idle)')) || 0;

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
          attr: (child.attr || []).map((a: any) => this.mapAttribute(a))
        }))
      }))
    };
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
