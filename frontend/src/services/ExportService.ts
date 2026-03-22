import { RobotConfig, ComponentConfig, SmartAttribute, AttributeGroup } from '../store/types';

/**
 * Service to export V4 store state back to .cmodel (CompDesc.json) structure.
 * Aligned with controller_model_comp_desc.proto:
 *   - Reconstructs Message_Module_Info hierarchy from moduleGroupUuid
 *   - Reconstructs Message_Base_Group_Element from AttributeGroup
 *   - Preserves interfaceAbility, shape, disabled flags
 */
export class ExportService {
    static exportToCompDesc(config: RobotConfig): any {
        const { identity, components } = config;

        // Group components by module_group_uuid
        const groupsMap = new Map<string, { name: string, uuid: string, sys?: string, components: ComponentConfig[] }>();
        components.forEach(c => {
            const gid = c.moduleGroupUuid || 'default_group';
            if (!groupsMap.has(gid)) {
                groupsMap.set(gid, {
                    name: c.moduleGroupName || 'Default Group',
                    uuid: gid,
                    components: []
                });
            }
            groupsMap.get(gid)?.components.push(c);
        });

        // Reconstruct more_module_info (Message_Module_Info[])
        const more_module_info = Array.from(groupsMap.values()).map(group => ({
            module_group_name: group.name,
            module_group_uuid: group.uuid,
            module_sys: group.sys,
            module_componets: group.components.map(c => this.mapComponentToCModel(c))
        }));

        return {
            robot_name: identity.robotName,
            version: identity.version,
            more_module_info,
            abilities: config.abilities
        };
    }

    /** Reconstructs Message_Module_Componets */
    private static mapComponentToCModel(c: ComponentConfig): any {
        return {
            general_attr: {
                ...c.generalAttr,
                module_name: { type: 'DATA_STRING', string_value: c.name },
                module_uuid: { type: 'DATA_STRING', string_value: c.id },
                main_module_type: { type: 'DATA_COMBOX', combo_type: { type_key: c.category } },
                sub_module_type: { type: 'DATA_COMBOX', combo_type: { type_key: c.type } },
                extend_params: [
                    ...(c.generalAttr?.extend_params || []).filter((p: any) => p.key !== 'module_alias'),
                    { key: 'module_alias', type: 'DATA_STRING', string_value: c.alias }
                ]
            },
            // Message_Module_Private_Attribute: private_attr → Message_Base_Group_Element[]
            private_attr: {
                private_attrs: c.privateAttrs.map(group => this.mapGroupToCModel(group))
            },
            // Preserve interface_ability losslessly
            interface_ability: c.interfaceAbility || {},
            // Message_Interface_Param
            interface_params: {
                interface_group: c.interfaces.map(inf => ({
                    key: inf.key,
                    type: inf.type,
                    path: inf.path,
                    desc: inf.desc,
                    interface_uuid: inf.interfaceUuid,
                    linked_interface_uuid: inf.linkedInterfaceUuid || [],
                    link_attrs: inf.linkAttrs,
                    interface_attrs: inf.interfaceAttrs,
                    interface_params: inf.interfaceParams,
                }))
            },
            // Message_Struct_Param
            struct_param: {
                extend_params: [
                    { key: 'locCoordX', type: 'DATA_DOUBLE', double_value: c.mountX },
                    { key: 'locCoordY', type: 'DATA_DOUBLE', double_value: c.mountY },
                    { key: 'locCoordZ', type: 'DATA_DOUBLE', double_value: c.mountZ },
                    { key: 'locCoordROLL', type: 'DATA_DOUBLE', double_value: c.mountRoll },
                    { key: 'locCoordPITCH', type: 'DATA_DOUBLE', double_value: c.mountPitch },
                    { key: 'locCoordYAW', type: 'DATA_DOUBLE', double_value: c.mountYaw },
                    ...(c.parentNodeUuid ? [{ key: 'parentNodeUuid', type: 'DATA_COMBOX', combo_type: { type_key: c.parentNodeUuid } }] : [])
                ],
                segmented_limits_params: c.rawStructParam || []
            },
            bool_disable: c.disabled,
            bool_deprecated: c.deprecated,
        };
    }

    /** Reconstructs Message_Base_Group_Element */
    private static mapGroupToCModel(group: AttributeGroup): any {
        return {
            key: group.key,
            desc: group.desc,
            bool_deprecated: group.boolDeprecated,
            array_base_ele: group.elements.map(attr => this.mapAttributeToCModel(attr))
        };
    }

    /** Reconstructs Message_Base_Element with proper oneof value fields */
    private static mapAttributeToCModel(attr: SmartAttribute): any {
        const base: any = {
            key: attr.key,
            desc: attr.desc,
            type: attr.type,
            unit: attr.unit,
            bool_parse: attr.boolParse,
            bool_hide: attr.boolHide,
            bool_noeditable: attr.boolNoeditable,
            bool_mustfill: attr.boolMustfill,
            bool_basic: attr.boolBasic,
            fixed_source: attr.fixedSource,
        };

        // Map value back to the correct oneof field
        switch (attr.type) {
            case 'DATA_STRING': base.string_value = attr.value; break;
            case 'DATA_IP': base.ip_value = attr.value; break;
            case 'DATA_DOUBLE': base.double_value = Number(attr.value); break;
            case 'DATA_FLOAT': base.float_value = Number(attr.value); break;
            case 'DATA_INT32': base.int32_value = Number(attr.value); break;
            case 'DATA_UINT32': base.uint32_value = Number(attr.value); break;
            case 'DATA_INT64': base.int64_value = String(attr.value); break;
            case 'DATA_UINT64': base.uint64_value = String(attr.value); break;
            case 'DATA_BOOL': base.bool_value = Boolean(attr.value); break;
            case 'DATA_COMBOX': base.combo_type = attr.comboType || { type_key: attr.value }; break;
            case 'DATA_FIXED_E': base.string_fix = attr.value; break;
        }

        // Map constraints back
        if (attr.maxValue !== undefined) {
            if (attr.type === 'DATA_DOUBLE') base.double_maxvalue = attr.maxValue;
            else if (attr.type === 'DATA_FLOAT') base.float_maxvalue = attr.maxValue;
            else if (attr.type === 'DATA_INT32') base.int32_maxvalue = attr.maxValue;
        }
        if (attr.minValue !== undefined) {
            if (attr.type === 'DATA_DOUBLE') base.double_minvalue = attr.minValue;
            else if (attr.type === 'DATA_FLOAT') base.float_minvalue = attr.minValue;
            else if (attr.type === 'DATA_INT32') base.int32_minvalue = attr.minValue;
        }

        // Nested combo elements
        if (attr.arrayCmobEle) {
            base.array_cmob_ele = attr.arrayCmobEle.map(sub => this.mapAttributeToCModel(sub));
        }

        return base;
    }
}
