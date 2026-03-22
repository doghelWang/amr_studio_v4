import {
    ComponentConfig,
    SmartAttribute,
    AttributeGroup,
    MainModuleType,
    InterfaceConfig,
    RobotConfig
} from './types';
import abilityRegistry from './ability_registry.json';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service to handle importing .cmodel (CompDesc.json) files into the V4 store.
 * Precisely aligned with controller_model_comp_desc.proto (snake_case).
 */
export class ImportService {
    /** Maps raw snake_case category keys from proto to frontend MainModuleType enum */
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

    /**
     * Parses a CompDesc JSON and returns a partial RobotConfig.
     */
    static parseCompDesc(json: any): Partial<RobotConfig> {
        const components: ComponentConfig[] = [];

        // Aligned with snake_case proto: more_module_info
        if (json.more_module_info && Array.isArray(json.more_module_info)) {
            json.more_module_info.forEach((group: any) => {
                this.processModuleGroup(group, components, null);
            });
        }

        const identity = {
            robotName: json.robot_name || 'Imported_AMR',
            version: json.version || '1.0.0',
            materialCode: '',
            alias: '',
            venderName: '',
            navigationMethod: 'LASER_SLAM' as const,
            driveType: 'STANDARD_DIFF' as const,
            chassisShape: 'BOX' as const,
            chassisLength: 1200,
            chassisWidth: 800,
            chassisHeight: 400,
        };

        return { components, identity, abilities: json.abilities || abilityRegistry as any };
    }

    private static processModuleGroup(group: any, list: ComponentConfig[], parentUuid: string | null) {
        const groupName = group.module_group_name || '';
        const groupUuid = group.module_group_uuid || uuidv4();

        // Aligned with snake_case proto: module_componets
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

        // ── Private Attributes ──────────────────────────────────────────────────────
        const rawPrivateAttr = comp.private_attr;
        const privateAttrList: any[] = rawPrivateAttr?.private_attrs ?? [];

        const privateAttrs: AttributeGroup[] = privateAttrList.map((grp: any) => ({
            key: grp.key || '',
            desc: grp.desc || '',
            boolDeprecated: grp.bool_deprecated,
            elements: (grp.array_base_ele || []).map((attr: any) => this.mapAttribute(attr)),
        }));

        // ── Interfaces ──────────────────────────────────────────────────────────────
        const rawIface = comp.interface_params;
        const ifaceList: any[] = rawIface?.interface_group ?? [];

        const interfaces: InterfaceConfig[] = ifaceList.map((inf: any) => ({
            key: inf.key,
            type: inf.type,
            path: inf.path,
            desc: inf.desc,
            interfaceUuid: inf.interface_uuid || uuidv4(),
            linkedInterfaceUuid: inf.linked_interface_uuid,
            linkAttrs: inf.link_attrs,
            interfaceAttrs: inf.interface_attrs,
            interfaceParams: inf.interface_params,
        }));

        // ── Shape ────────────────────────────────────────────────────────────────────
        let shape: ComponentConfig['shape'];
        if (gen.module_shape && !Array.isArray(gen.module_shape)) {
            const s = gen.module_shape;
            if (s.box) shape = { type: 'BOX', length: s.box.size_len, width: s.box.size_width, height: s.box.size_height };
            else if (s.cylinder) shape = { type: 'CYLINDER', diameter: s.cylinder.diameter, height: s.cylinder.height };
            else if (s.sphere) shape = { type: 'SPHERE', diameter: s.sphere.diameter };
        }

        // ── struct param: parent_node_uuid & mount coords ──────────────────────────────
        const structExtend = struct.extend_params ?? [];

        return {
            id: uuid,
            name: gen.module_name?.string_value || type,
            alias: gen.extend_params?.find((p: any) => p.key === 'module_alias')?.string_value || type,
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
            interfaceAbility: comp.interface_ability,
            interfaces,
            shape,
            generalAttr: gen,
            rawStructParam: struct.segmented_limits_params,
            disabled: comp.bool_disable,
            deprecated: comp.bool_deprecated,
        };
    }

    /** Maps a single Message_Base_Element to SmartAttribute */
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
            boolBasic: attr.bool_basic,
            fixedSource: attr.fixed_source,
            comboType: attr.combo_type,
            arrayCmobEle: attr.array_cmob_ele?.map((sub: any) => this.mapAttribute(sub)),
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
        return params?.find((p: any) => p.key === key)?.double_value || 0;
    }
}
