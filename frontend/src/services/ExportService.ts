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

        // Group components by moduleGroupUuid
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

        // Reconstruct moreModuleInfo (Message_Module_Info[])
        const moreModuleInfo = Array.from(groupsMap.values()).map(group => ({
            moduleGroupName: group.name,
            moduleGroupUuid: group.uuid,
            moduleSys: group.sys,
            moduleComponets: group.components.map(c => this.mapComponentToCModel(c))
        }));

        return {
            robotName: identity.robotName,
            version: identity.version,
            moreModuleInfo,
            abilities: config.abilities
        };
    }

    /** Reconstructs Message_Module_Componets */
    private static mapComponentToCModel(c: ComponentConfig): any {
        return {
            generalAttr: {
                ...c.generalAttr,
                moduleName: { type: 'DATA_STRING', stringValue: c.name },
                moduleUuid: { type: 'DATA_STRING', stringValue: c.id },
                mainModuleType: { type: 'DATA_COMBOX', comboType: { typeKey: c.category } },
                subModuleType: { type: 'DATA_COMBOX', comboType: { typeKey: c.type } },
                extendParams: [
                    ...(c.generalAttr?.extendParams || []).filter((p: any) => p.key !== 'module_alias'),
                    { key: 'module_alias', type: 'DATA_STRING', stringValue: c.alias }
                ]
            },
            // Message_Module_Private_Attribute: privateAttrs → Message_Base_Group_Element[]
            privateAttr: {
                privateAttrs: c.privateAttrs.map(group => this.mapGroupToCModel(group))
            },
            // Preserve interfaceAbility losslessly
            interfaceAbility: c.interfaceAbility || {},
            // Message_Interface_Param
            interfaceParams: {
                interfaceGroup: c.interfaces.map(inf => ({
                    key: inf.key,
                    type: inf.type,
                    path: inf.path,
                    desc: inf.desc,
                    interfaceUuid: inf.interfaceUuid,
                    linkedInterfaceUuid: inf.linkedInterfaceUuid || [],
                    linkAttrs: inf.linkAttrs,
                    interfaceAttrs: inf.interfaceAttrs,
                    interfaceParams: inf.interfaceParams,
                }))
            },
            // Message_Struct_Param
            structParam: {
                extendParams: [
                    { key: 'locCoordX', type: 'DATA_DOUBLE', doubleValue: c.mountX },
                    { key: 'locCoordY', type: 'DATA_DOUBLE', doubleValue: c.mountY },
                    { key: 'locCoordZ', type: 'DATA_DOUBLE', doubleValue: c.mountZ },
                    { key: 'locCoordROLL', type: 'DATA_DOUBLE', doubleValue: c.mountRoll },
                    { key: 'locCoordPITCH', type: 'DATA_DOUBLE', doubleValue: c.mountPitch },
                    { key: 'locCoordYAW', type: 'DATA_DOUBLE', doubleValue: c.mountYaw },
                    ...(c.parentNodeUuid ? [{ key: 'parentNodeUuid', type: 'DATA_COMBOX', comboType: { typeKey: c.parentNodeUuid } }] : [])
                ],
                segmentedLimitsParams: c.rawStructParam || []
            },
            boolDisable: c.disabled,
            boolDeprecated: c.deprecated,
        };
    }

    /** Reconstructs Message_Base_Group_Element */
    private static mapGroupToCModel(group: AttributeGroup): any {
        return {
            key: group.key,
            desc: group.desc,
            boolDeprecated: group.boolDeprecated,
            arrayBaseEle: group.elements.map(attr => this.mapAttributeToCModel(attr))
        };
    }

    /** Reconstructs Message_Base_Element with proper oneof value fields */
    private static mapAttributeToCModel(attr: SmartAttribute): any {
        const base: any = {
            key: attr.key,
            desc: attr.desc,
            type: attr.type,
            unit: attr.unit,
            boolParse: attr.boolParse,
            boolHide: attr.boolHide,
            boolNoeditable: attr.boolNoeditable,
            boolMustfill: attr.boolMustfill,
            boolBasic: attr.boolBasic,
            fixedSource: attr.fixedSource,
        };

        // Map value back to the correct oneof field
        switch (attr.type) {
            case 'DATA_STRING': base.stringValue = attr.value; break;
            case 'DATA_IP': base.ipValue = attr.value; break;
            case 'DATA_DOUBLE': base.doubleValue = Number(attr.value); break;
            case 'DATA_FLOAT': base.floatValue = Number(attr.value); break;
            case 'DATA_INT32': base.int32Value = Number(attr.value); break;
            case 'DATA_UINT32': base.uint32Value = Number(attr.value); break;
            case 'DATA_INT64': base.int64Value = String(attr.value); break;
            case 'DATA_UINT64': base.uint64Value = String(attr.value); break;
            case 'DATA_BOOL': base.boolValue = Boolean(attr.value); break;
            case 'DATA_COMBOX': base.comboType = attr.comboType || { typeKey: attr.value }; break;
            case 'DATA_FIXED_E': base.stringFix = attr.value; break;
        }

        // Map constraints back
        if (attr.maxValue !== undefined) {
            if (attr.type === 'DATA_DOUBLE') base.doubleMaxvalue = attr.maxValue;
            else if (attr.type === 'DATA_FLOAT') base.floatMaxvalue = attr.maxValue;
            else if (attr.type === 'DATA_INT32') base.int32Maxvalue = attr.maxValue;
        }
        if (attr.minValue !== undefined) {
            if (attr.type === 'DATA_DOUBLE') base.doubleMinvalue = attr.minValue;
            else if (attr.type === 'DATA_FLOAT') base.floatMinvalue = attr.minValue;
            else if (attr.type === 'DATA_INT32') base.int32Minvalue = attr.minValue;
        }

        // Nested combo elements
        if (attr.arrayCmobEle) {
            base.arrayCmobEle = attr.arrayCmobEle.map(sub => this.mapAttributeToCModel(sub));
        }

        return base;
    }
}
