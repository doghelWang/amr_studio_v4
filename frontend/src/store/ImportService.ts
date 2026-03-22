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

export class ImportService {
    private static readonly CATEGORY_MAP: Record<string, MainModuleType> = {
        'chassis':               'CHASSIS',
        'drive_wheel':           'DRIVEWHEEL',
        'driver':                'DRIVER',
        'sensor':                'SENSOR',
        'sensor_processor':      'SENSORPROCESSOR',
        'main_cpu':              'MAINCPU',
        'maincpu':               'MAINCPU',
        'intergrated_controller': 'INTERGRATEDCONTROLLER',
        'communication':         'COMMUNICATION',
        'extended_interface':    'EXTENDEDLNTERFACE',
        'battery':               'BATTERY',
        'energy_controller':     'ENERGYCONTROLLER',
        'button':                'BUTTON',
        'screen':                'SCREEN',
        'light':                 'LIGHT',
        'audio':                 'AUDIO',
        'actor':                 'ACTOR',
        'autobody':              'AUTOBODY',
    };

    static parseCompDesc(json: any): Partial<RobotConfig> {
        console.log('DEBUG [ImportService]: Starting parseCompDesc with raw JSON:', json);
        const components: ComponentConfig[] = [];

        if (json.more_module_info && Array.isArray(json.more_module_info)) {
            json.more_module_info.forEach((group: any) => {
                this.processModuleGroup(group, components, null);
            });
        }

        // Initialize identity with robust defaults
        const identity = {
            robotName: json.robot_name || 'Imported_AMR',
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

        // ━━━ KEY FIX: Find CHASSIS component and SYNC identity ━━━
        const chassis = components.find(c => c.category === 'CHASSIS');
        if (chassis) {
            console.log('DEBUG [ImportService]: Found Chassis Component:', chassis);
            if (chassis.shape) {
                identity.chassisShape = chassis.shape.type as any;
                identity.chassisLength = chassis.shape.length || 1200;
                identity.chassisWidth = chassis.shape.width || 800;
                identity.chassisHeight = chassis.shape.height || 400;
            }
            identity.alias = chassis.alias;
        }

        console.log(`DEBUG [ImportService]: Extracted ${components.length} components.`);
        return { components, identity };
    }

    static parseAbilities(json: any): ControllerAbility {
        if (!json || !json.function_ability) return abilityRegistry as any;
        return {
            functionAbility: json.function_ability.map((func: any) => ({
                type: func.type,
                desc: func.desc,
                childFunction: (func.child_function || []).map((child: any) => ({
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
            arrayParam: common.array_param ? {
                groupName: common.array_param.group_name,
                attrParams: (common.array_param.attr_params || []).map((p: any) => this.mapAttribute(p))
            } : undefined,
            comboxParam: common.combox_param ? {
                desc: common.combox_param.desc,
                value: common.combox_param.value,
                options: (common.combox_param.options || []).map((o: any) => ({
                    key: o.key,
                    desc: o.desc,
                    arrayCmobEle: (o.array_cmob_ele || []).map((e: any) => this.mapAttribute(e))
                }))
            } : undefined
        };
    }

    private static processModuleGroup(group: any, list: ComponentConfig[], parentUuid: string | null) {
        const groupName = group.module_group_name || '';
        const groupUuid = group.module_group_uuid || uuidv4();

        if (group.module_componets) {
            group.module_componets.forEach((comp: any) => {
                const config = this.mapToComponent(comp, groupName, groupUuid, parentUuid);
                list.push(config);
            });
        }

        if (group.more_module_info) {
            group.more_module_info.forEach((sub: any) => this.processModuleGroup(sub, list, parentUuid));
        }
    }

    private static mapToComponent(
        comp: any, groupName: string, groupUuid: string, parentUuid: string | null
    ): ComponentConfig {
        const gen = comp.general_attr || {};
        const struct = comp.struct_param || {};

        const rawCat = gen.main_module_type?.combo_type?.type_key || 'chassis';
        const category = (ImportService.CATEGORY_MAP[rawCat] || rawCat.toUpperCase()) as MainModuleType;
        const type = gen.sub_module_type?.combo_type?.type_key || 'diffChassis';

        const uuid = gen.module_uuid?.string_value || uuidv4();

        // ── Interfaces ──
        // BACKEND PATH: comp.interface_params.interface_group
        const rawIface = comp.interface_params || {};
        const ifaceList: any[] = rawIface.interface_group || rawIface.interface_params_array || [];

        const interfaces: InterfaceConfig[] = ifaceList.map((inf: any) => ({
            key: inf.key,
            type: inf.type,
            path: inf.path,
            desc: inf.desc || inf.key,
            interfaceUuid: inf.interface_uuid || uuidv4(),
            linkedInterfaceUuid: inf.linked_interface_uuid || [],
            linkAttrs: inf.link_attrs,
            interfaceAttrs: inf.interface_attrs,
            interfaceParams: inf.interface_params,
        }));

        // ── Shape ──
        let shape: ComponentConfig['shape'];
        if (gen.module_shape) {
            const s = gen.module_shape;
            const shapeType = s.shape_type || 'ENUM_BOX';
            if (shapeType === 'ENUM_BOX' || s.box) {
                const box = s.box || {};
                shape = { type: 'BOX', length: box.size_len || 0, width: box.size_width || 0, height: box.size_height || 0 };
            } else if (shapeType === 'ENUM_CYLINDER' || s.cylinder) {
                const cyl = s.cylinder || {};
                shape = { type: 'CYLINDER', diameter: cyl.diameter || 0, height: cyl.height || 0 };
            } else if (s.sphere) {
                shape = { type: 'SPHERE', diameter: s.sphere.diameter || 0 };
            }
        }

        // ── Attributes ──
        const rawPrivateAttr = comp.private_attr || {};
        const privateAttrs: AttributeGroup[] = (rawPrivateAttr.private_attrs || []).map((grp: any) => ({
            key: grp.key || '',
            desc: grp.desc || '',
            elements: (grp.array_base_ele || grp.elements || []).map((attr: any) => this.mapAttribute(attr)),
        }));

        const structExtend = struct.extend_params ?? [];

        return {
            id: uuid,
            name: gen.module_name?.string_value || type,
            alias: gen.extend_params?.find((p: any) => p.key === 'module_alias')?.string_value 
                   || gen.module_desc?.string_value 
                   || type,
            type,
            category,
            parentNodeUuid: parentUuid
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
            interfaceAbility: comp.interface_ability || {},
            interfaces,
            shape,
            generalAttr: gen,
            rawStructParam: struct.segmented_limits_params,
            disabled: comp.bool_disable,
            deprecated: comp.bool_deprecated,
        };
    }

    private static mapAttribute(attr: any): SmartAttribute {
        return {
            key: attr.key,
            desc: attr.desc || attr.key,
            type: attr.type || 'DATA_DOUBLE',
            value: this.extractValue(attr),
            maxValue: attr.double_maxvalue ?? attr.int32_maxvalue ?? attr.float_maxvalue,
            minValue: attr.double_minvalue ?? attr.int32_minvalue ?? attr.float_minvalue,
            unit: attr.unit,
            boolParse: attr.bool_parse,
            boolHide: attr.bool_hide,
            boolNoeditable: attr.bool_noeditable,
            boolMustfill: attr.bool_mustfill,
            boolBasic: true, // IMPORTANT: Imported attributes must be visible
            fixedSource: attr.fixed_source,
            comboType: attr.combo_type ? {
                typeKey: attr.combo_type.type_key,
                typeDesc: attr.combo_type.type_desc,
                typeGroups: (attr.combo_type.type_groups || []).map((g: any) => ({
                    key: g.key,
                    desc: g.desc,
                    arrayCmobEle: (g.array_cmob_ele || []).map((sub: any) => this.mapAttribute(sub))
                }))
            } : undefined,
            arrayCmobEle: (attr.array_cmob_ele || []).map((sub: any) => this.mapAttribute(sub)),
        };
    }

    private static extractValue(attr: any) {
        switch (attr.type) {
            case 'DATA_STRING': return attr.string_value;
            case 'DATA_DOUBLE': return attr.double_value;
            case 'DATA_FLOAT': return attr.float_value;
            case 'DATA_INT32': return attr.int32_value;
            case 'DATA_UINT32': return attr.uint32_value;
            case 'DATA_INT64': return attr.int64_value;
            case 'DATA_UINT64': return attr.uint64_value;
            case 'DATA_BOOL': return attr.bool_value;
            case 'DATA_IP': return attr.ip_value;
            case 'DATA_COMBOX': return attr.combo_type?.type_key;
            case 'DATA_FIXED_E': return attr.string_fix;
            default: return attr.double_value ?? attr.string_value;
        }
    }

    private static findExtend(params: any[], key: string): number {
        const p = params?.find((p: any) => p.key === key);
        return p?.double_value || p?.float_value || 0;
    }
}
