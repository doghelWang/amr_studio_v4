import { RobotConfig, ComponentConfig, SmartAttribute, AttributeGroup, ControllerAbility } from '../store/types';

/**
 * Service to export V4 store state back to .cmodel structure.
 * Rigorously aligned with Protobuf schemas (including specific CamelCase fields).
 */
export class ExportService {
    static exportToCompDesc(config: RobotConfig): any {
        const { identity, components } = config;
        const groupsMap = new Map<string, { name: string, uuid: string, sys?: string, components: ComponentConfig[] }>();
        
        components.forEach(c => {
            const gid = c.moduleGroupUuid || 'default_group';
            if (!groupsMap.has(gid)) {
                groupsMap.set(gid, { name: c.moduleGroupName || 'Default Group', uuid: gid, components: [] });
            }
            groupsMap.get(gid)?.components.push(c);
        });

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
            abilities: this.exportAbilities(config.abilities)
        };
    }

    public static exportAbilities(abilities: ControllerAbility): any {
        if (!abilities || !abilities.functionAbility) return abilities;
        return {
            version: abilities.version || 'V1.0',
            component_ability: abilities.componentAbility || [],
            function_ability: abilities.functionAbility.map(func => ({
                type: func.type,
                desc: func.desc,
                child_function: func.childFunction?.map(child => ({
                    key: child.key,
                    desc: child.desc,
                    tips: child.tips,
                    attr: child.attr?.map(a => ({
                        key: a.key,
                        type: a.type,
                        array_param: a.arrayParam ? {
                            group_key: a.arrayParam.groupKey,
                            group_name: a.arrayParam.groupName,
                            bool_mustfill: a.arrayParam.boolMustfill,
                            attr_params: a.arrayParam.attrParams?.map(p => this.mapAttributeToCModel(p))
                        } : undefined,
                        combox_param: a.comboxParam ? {
                            key: a.comboxParam.key || a.key,
                            desc: a.comboxParam.desc,
                            tips: a.comboxParam.tips,
                            value: a.comboxParam.value,
                            combox_source: a.comboxParam.comboxSource,
                            // ━━━ PROTO ALIGNMENT: normalCombox ━━━
                            normalCombox: a.comboxParam.options?.map(o => ({
                                key: o.key,
                                desc: o.desc,
                                // ━━━ PROTO ALIGNMENT: arrayCmobEle ━━━
                                arrayCmobEle: o.arrayAttr?.map((sub: any) => this.mapAttributeToCModel(sub))
                            }))
                        } : undefined
                    }))
                }))
            }))
        };
    }

    private static mapComponentToCModel(c: ComponentConfig): any {
        return {
            general_attr: {
                ...c.generalAttr,
                module_name: { type: 'DATA_STRING', string_value: c.name, bool_parse: true },
                module_uuid: { type: 'DATA_STRING', string_value: c.id, bool_parse: true, bool_hide: true },
                main_module_type: { type: 'DATA_COMBOX', combo_type: { typeKey: c.category }, bool_parse: true },
                sub_module_type: { type: 'DATA_COMBOX', combo_type: { typeKey: c.type }, bool_parse: true },
                extend_params: [
                    ...(c.generalAttr?.extend_params || []).filter((p: any) => p.key !== 'module_alias'),
                    { key: 'module_alias', type: 'DATA_STRING', string_value: c.alias, bool_parse: true }
                ]
            },
            private_attr: {
                private_attrs: c.privateAttrs.map(group => this.mapGroupToCModel(group))
            },
            interface_ability: c.interfaceAbility || {},
            interface_params: {
                // ━━━ PROTO ALIGNMENT: interfaceGroup ━━━
                interfaceGroup: c.interfaces.map(inf => ({
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
            struct_param: {
                extend_params: [
                    { key: 'locCoordX', type: 'DATA_DOUBLE', double_value: c.mountX, bool_parse: true, bool_hide: true, bool_mustfill: true },
                    { key: 'locCoordY', type: 'DATA_DOUBLE', double_value: c.mountY, bool_parse: true, bool_hide: true, bool_mustfill: true },
                    { key: 'locCoordZ', type: 'DATA_DOUBLE', double_value: c.mountZ, bool_parse: true, bool_hide: true, bool_mustfill: true },
                    { key: 'locCoordROLL', type: 'DATA_DOUBLE', double_value: c.mountRoll, bool_parse: true, bool_hide: true, bool_mustfill: true },
                    { key: 'locCoordPITCH', type: 'DATA_DOUBLE', double_value: c.mountPitch, bool_parse: true, bool_hide: true, bool_mustfill: true },
                    { key: 'locCoordYAW', type: 'DATA_DOUBLE', double_value: c.mountYaw, bool_parse: true, bool_hide: true, bool_mustfill: true },
                    ...(c.parentNodeUuid ? [{ key: 'parentNodeUuid', type: 'DATA_COMBOX', combo_type: { typeKey: c.parentNodeUuid }, bool_parse: true }] : [])
                ],
                segmented_limits_params: c.rawStructParam || []
            },
            bool_disable: c.disabled,
            bool_deprecated: c.deprecated,
        };
    }

    private static mapGroupToCModel(group: AttributeGroup): any {
        return {
            key: group.key,
            desc: group.desc,
            bool_deprecated: group.boolDeprecated,
            array_base_ele: group.elements.map(attr => this.mapAttributeToCModel(attr))
        };
    }

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
            case 'DATA_COMBOX': 
                // ━━━ CRITICAL PROTO ALIGNMENT: typeKey, typeDesc, typeGroups ━━━
                base.combo_type = attr.comboType ? {
                    typeKey: attr.comboType.typeKey,
                    typeDesc: attr.comboType.typeDesc,
                    typeGroups: attr.comboType.typeGroups?.map(g => ({
                        key: g.key,
                        desc: g.desc,
                        arrayCmobEle: g.arrayCmobEle?.map(sub => this.mapAttributeToCModel(sub))
                    }))
                } : { typeKey: attr.value }; 
                break;
            case 'DATA_FIXED_E': base.string_fix = attr.value; break;
        }

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

        return base;
    }
}
