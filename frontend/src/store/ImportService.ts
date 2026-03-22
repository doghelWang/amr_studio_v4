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

/**
 * Service to handle importing .cmodel (CompDesc.json) files into the V4 store.
 * FULLY ALIGNED WITH CAMELCASE JSON (Default Protobuf Mapping).
 */
export class ImportService {
    private static readonly CATEGORY_MAP: Record<string, MainModuleType> = {
        'chassis':               'CHASSIS',
        'driveWheel':            'DRIVEWHEEL',
        'driver':                'DRIVER',
        'sensor':                'SENSOR',
        'sensorProcessor':       'SENSORPROCESSOR',
        'mainCPU':               'MAINCPU',
        'intergratedController': 'INTERGRATEDCONTROLLER',
        'communication':         'COMMUNICATION',
        'extendedInterface':     'EXTENDEDLNTERFACE',
        'battery':               'BATTERY',
        'energyController':      'ENERGYCONTROLLER',
        'button':                'BUTTON',
        'screen':                'SCREEN',
        'light':                 'LIGHT',
        'audio':                 'AUDIO',
        'actor':                 'ACTOR',
        'autobody':              'AUTOBODY',
    };

    static parseCompDesc(json: any): Partial<RobotConfig> {
        console.log('DEBUG [ImportService]: parseCompDesc keys:', Object.keys(json));
        const components: ComponentConfig[] = [];
        
        // Protocol check
        const infoKey = json.moreModuleInfo ? "moreModuleInfo" : "more_module_info";

        if (json[infoKey] && Array.isArray(json[infoKey])) {
            json[infoKey].forEach((group: any) => {
                this.processModuleGroup(group, components, null);
            });
        }

        const identity = {
            robotName: json.robotName || json.robot_name || 'Imported_AMR',
            version: json.version || '1.0.0',
            materialCode: '',
            alias: '',
            venderName: 'SEER',
            navigationMethod: 'LASER_SLAM' as const,
            driveType: 'STANDARD_DIFF' as const,
            chassisShape: 'BOX' as const,
            chassisLength: 1200,
            chassisWidth: 800,
            chassisHeight: 400,
        };

        const chassis = components.find(c => c.category === 'CHASSIS');
        if (chassis && chassis.shape) {
            identity.chassisLength = chassis.shape.length || 1200;
            identity.chassisWidth = chassis.shape.width || 800;
            identity.chassisHeight = chassis.shape.height || 400;
        }

        return { components, identity };
    }

    static parseAbilities(json: any): ControllerAbility {
        const funcKey = json.functionAbility ? "functionAbility" : "function_ability";
        if (!json || !json[funcKey]) return abilityRegistry as any;
        
        return {
            version: json.version || 'V1.0',
            componentAbility: json.componentAbility || json.component_ability || [],
            functionAbility: json[funcKey].map((func: any) => ({
                type: func.type,
                desc: func.desc,
                childFunction: (func.childFunction || func.child_function || []).map((child: any) => ({
                    key: child.key,
                    desc: child.desc,
                    tips: child.tips,
                    attr: (child.attr || []).map((a: any) => this.mapCommonAttr(a))
                }))
            }))
        };
    }

    private static mapCommonAttr(common: any): any {
        return {
            key: common.key,
            type: common.type,
            arrayParam: (common.arrayParam || common.array_param) ? {
                groupKey: (common.arrayParam || common.array_param).groupKey || (common.arrayParam || common.array_param).group_key,
                groupName: (common.arrayParam || common.array_param).groupName || (common.arrayParam || common.array_param).group_name,
                boolMustfill: (common.arrayParam || common.array_param).boolMustfill || (common.arrayParam || common.array_param).bool_mustfill,
                attrParams: ((common.arrayParam || common.array_param).attrParams || (common.arrayParam || common.array_param).attr_params || []).map((p: any) => this.mapAttribute(p))
            } : undefined,
            comboxParam: (common.comboxParam || common.combox_param) ? {
                key: (common.comboxParam || common.combox_param).key,
                desc: (common.comboxParam || common.combox_param).desc,
                tips: (common.comboxParam || common.combox_param).tips,
                comboxSource: (common.comboxParam || common.combox_param).comboxSource || (common.comboxParam || common.combox_param).combox_source || 'NORMAL',
                value: (common.comboxParam || common.combox_param).value,
                options: ((common.comboxParam || common.combox_param).normalCombox || (common.comboxParam || common.combox_param).normal_combox || []).map((o: any) => ({
                    key: o.key,
                    desc: o.desc,
                    arrayCmobEle: (o.arrayCmobEle || o.array_cmob_ele || []).map((e: any) => this.mapAttribute(e))
                }))
            } : undefined
        };
    }

    private static processModuleGroup(group: any, list: ComponentConfig[], parentUuid: string | null) {
        const groupName = group.moduleGroupName || group.module_group_name || '';
        const groupUuid = group.moduleGroupUuid || group.module_group_uuid || uuidv4();
        
        // Supports both moduleComponets and module_componets
        const componentsArr = group.moduleComponets || group.module_componets;

        if (componentsArr && Array.isArray(componentsArr)) {
            componentsArr.forEach((comp: any) => {
                const config = this.mapToComponent(comp, groupName, groupUuid, parentUuid);
                list.push(config);
            });
        }

        const infoKey = group.moreModuleInfo ? "moreModuleInfo" : "more_module_info";
        if (group[infoKey]) {
            group[infoKey].forEach((sub: any) => this.processModuleGroup(sub, list, parentUuid));
        }
    }

    private static mapToComponent(
        comp: any, groupName: string, groupUuid: string, parentUuid: string | null
    ): ComponentConfig {
        const gen = comp.generalAttr || comp.general_attr || {};
        const struct = comp.structParam || comp.struct_param || {};

        const rawCat = gen.mainModuleType?.comboType?.typeKey || gen.main_module_type?.combo_type?.type_key || 'chassis';
        const category = (ImportService.CATEGORY_MAP[rawCat] || rawCat.toUpperCase()) as MainModuleType;
        const type = gen.subModuleType?.comboType?.typeKey || gen.sub_module_type?.combo_type?.type_key || 'diffChassis';

        const uuid = gen.moduleUuid?.stringValue || gen.module_uuid?.string_value || uuidv4();

        const rawIface = comp.interfaceParams || comp.interface_params || comp.interface_param || {};
        const ifaceList: any[] = rawIface.interfaceGroup || rawIface.interface_group || [];

        const interfaces: InterfaceConfig[] = ifaceList.map((inf: any) => ({
            key: inf.key,
            type: inf.type,
            path: inf.path,
            desc: inf.desc || inf.key,
            interfaceUuid: inf.interfaceUuid || inf.interface_uuid || uuidv4(),
            linkedInterfaceUuid: inf.linkedInterfaceUuid || inf.linked_interface_uuid || [],
            linkAttrs: inf.linkAttrs || inf.link_attrs,
            interfaceAttrs: inf.interfaceAttrs || inf.interface_attrs,
            interfaceParams: inf.interfaceParams || inf.interface_params,
        }));

        let shape: ComponentConfig['shape'];
        const s = gen.moduleShape || gen.module_shape;
        if (s) {
            if (s.box) shape = { type: 'BOX', length: s.box.sizeLen || s.box.size_len || 0, width: s.box.sizeWidth || s.box.size_width || 0, height: s.box.sizeHeight || s.box.size_height || 0 };
            else if (s.cylinder) shape = { type: 'CYLINDER', diameter: s.cylinder.diameter || 0, height: s.cylinder.height || 0 };
        }

        const rawPrivateAttr = comp.privateAttr || comp.private_attr || {};
        const privateAttrs: AttributeGroup[] = (rawPrivateAttr.privateAttrs || rawPrivateAttr.private_attrs || []).map((grp: any) => ({
            key: grp.key || '',
            desc: grp.desc || '',
            elements: (grp.arrayBaseEle || grp.array_base_ele || []).map((attr: any) => this.mapAttribute(attr)),
        }));

        const structExtend = struct.extendParams || struct.extend_params || [];

        return {
            id: uuid,
            name: gen.moduleName?.stringValue || gen.module_name?.string_value || type,
            alias: gen.extendParams?.find((p: any) => p.key === 'module_alias')?.stringValue 
                   || gen.extend_params?.find((p: any) => p.key === 'module_alias')?.string_value
                   || gen.moduleDesc?.stringValue || gen.module_desc?.string_value
                   || type,
            type,
            category,
            parentNodeUuid: parentUuid
                || structExtend.find((p: any) => p.key === 'parentNodeUuid')?.comboType?.typeKey
                || structExtend.find((p: any) => p.key === 'parentNodeUuid')?.combo_type?.type_key
                || null,
            moduleGroupName: groupName,
            moduleGroupUuid: groupUuid,
            mountX: this.findExtend(structExtend, 'locCoordX'),
            mountY: this.findExtend(structExtend, 'locCoordY'),
            mountZ: this.findExtend(structExtend, 'locCoordZ'),
            mountRoll: this.findExtend(structExtend, 'locCoordROLL'),
            mountPitch: this.findExtend(structExtend, 'locCoordPITCH'),
            mountYaw: this.findExtend(structExtend, 'locCoordYAW'),
            privateAttrs,
            interfaceAbility: comp.interfaceAbility || comp.interface_ability || {},
            interfaces,
            shape,
            generalAttr: gen,
            rawStructParam: struct.segmentedLimitsParams || struct.segmented_limits_params,
            disabled: comp.boolDisable || comp.bool_disable,
            deprecated: comp.boolDeprecated || comp.bool_deprecated,
        };
    }

    private static mapAttribute(attr: any): SmartAttribute {
        return {
            key: attr.key,
            desc: attr.desc || attr.key,
            type: attr.type || 'DATA_DOUBLE',
            value: this.extractValue(attr),
            maxValue: attr.doubleMaxvalue ?? attr.int32Maxvalue ?? attr.floatMaxvalue ?? attr.double_maxvalue ?? attr.int32_maxvalue,
            minValue: attr.doubleMinvalue ?? attr.int32Minvalue ?? attr.floatMinvalue ?? attr.double_minvalue ?? attr.int32_minvalue,
            unit: attr.unit,
            boolParse: attr.boolParse ?? attr.bool_parse,
            boolHide: attr.boolHide ?? attr.bool_hide,
            boolNoeditable: attr.boolNoeditable ?? attr.bool_noeditable,
            boolMustfill: attr.boolMustfill ?? attr.bool_mustfill,
            boolBasic: true, 
            fixedSource: attr.fixedSource || attr.fixed_source,
            comboType: (attr.comboType || attr.combo_type) ? {
                typeKey: (attr.comboType || attr.combo_type).typeKey || (attr.comboType || attr.combo_type).type_key,
                typeDesc: (attr.comboType || attr.combo_type).typeDesc || (attr.comboType || attr.combo_type).type_desc,
                typeGroups: ((attr.comboType || attr.combo_type).typeGroups || (attr.comboType || attr.combo_type).type_groups || []).map((g: any) => ({
                    key: g.key,
                    desc: g.desc,
                    arrayCmobEle: (g.arrayCmobEle || g.array_cmob_ele || []).map((sub: any) => this.mapAttribute(sub))
                }))
            } : undefined,
            arrayCmobEle: (attr.arrayCmobEle || attr.array_cmob_ele || []).map((sub: any) => this.mapAttribute(sub)),
        };
    }

    private static extractValue(attr: any) {
        // Support both Camel and Snake value accessors
        return attr.stringValue ?? attr.string_value ??
               attr.doubleValue ?? attr.double_value ??
               attr.floatValue ?? attr.float_value ??
               attr.int32Value ?? attr.int32_value ??
               attr.uint32Value ?? attr.uint32_value ??
               attr.int64Value ?? attr.int64_value ??
               attr.uint64Value ?? attr.uint64_value ??
               attr.boolValue ?? attr.bool_value ??
               attr.ipValue ?? attr.ip_value ??
               (attr.comboType || attr.combo_type)?.typeKey ?? (attr.comboType || attr.combo_type)?.type_key ??
               attr.stringFix ?? attr.string_fix;
    }

    private static findExtend(params: any[], key: string): number {
        const p = params?.find((p: any) => p.key === key);
        return p?.doubleValue ?? p?.double_value ?? p?.floatValue ?? p?.float_value ?? 0;
    }
}
