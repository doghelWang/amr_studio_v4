import { RobotConfig, ComponentConfig, SmartAttribute, AttributeGroup, InterfaceConfig } from '../store/types';

export class ExportService {
    /**
     * Top-level export function.
     * Aligns memory Store state back to the fragmented CModel structure.
     * 100% COMPLIANT WITH GEMINI_RULES (CamelCase Standard).
     */
    static exportToCModel(config: RobotConfig): any {
        return {
            robotName: config.identity.robotName,
            version: config.identity.version || '1.0.0',
            navigationMethod: config.identity.navigationMethod,
            driveType: config.identity.driveType,
            chassisShape: config.identity.chassisShape,
            chassisLength: config.identity.chassisLength,
            chassisWidth: config.identity.chassisWidth,
            chassisHeight: config.identity.chassisHeight,
            headOffset: config.identity.headOffset,
            tailOffset: config.identity.tailOffset,
            leftOffset: config.identity.leftOffset,
            rightOffset: config.identity.rightOffset,
            moreModuleInfo: config.components
                .filter(c => !c.parentNodeUuid) // Root components
                .map(c => this.mapModuleGroup(c, config.components)),
            functionAbility: this.exportAbilities(config.abilities)
        };
    }

    private static mapModuleGroup(comp: ComponentConfig, all: ComponentConfig[]): any {
        const children = all.filter(c => c.parentNodeUuid === comp.id);
        return {
            moduleGroupName: comp.moduleGroupName || "LibraryGroup",
            moduleGroupUuid: comp.moduleGroupUuid,
            moduleComponets: [this.mapComponentToCModel(comp)],
            moreModuleInfo: children.map(c => this.mapModuleGroup(c, all))
        };
    }

    static exportAbilities(abilities: any): any {
        if (!abilities || !abilities.functionAbility) return undefined;
        return (abilities.functionAbility || []).map((f: any) => ({
            type: f.type,
            desc: f.desc,
            childFunction: (f.childFunction || []).map((cf: any) => ({
                key: cf.key,
                desc: cf.desc,
                tips: cf.tips,
                attr: (cf.attr || []).map((a: any) => this.mapAttributeToCModel(a, true)) // AbiSet context
            }))
        }));
    }

    private static mapComponentToCModel(c: ComponentConfig): any {
        return {
            generalAttr: {
                ...c.generalAttr,
                moduleName: { type: 'DATA_STRING', stringValue: c.name, boolParse: true },
                moduleUuid: { type: 'DATA_STRING', stringValue: c.id, boolParse: true },
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
                    arrayBaseEle: g.elements.map(e => this.mapAttributeToCModel(e, false)) // Component context
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
                    linkedInterfaceUuid: i.linkedInterfaceUuid || [],
                    interfaceAttrs: i.interfaceAttrs,
                    interfaceParams: i.interfaceParams
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
                    { key: 'parentNodeUuid', type: 'DATA_STRING', stringValue: c.parentNodeUuid || "" }
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

        // ALIGNED WITH PROTO TYPES
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
                    // ━━━ GEMINI_RULES: arrayAttr vs arrayCmobEle ━━━
                    [isAbility ? 'arrayAttr' : 'arrayCmobEle']: g.arrayCmobEle?.map(sub => this.mapAttributeToCModel(sub, isAbility))
                }))
            };
        }

        return base;
    }
}
