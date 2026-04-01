/**
 * AMR Studio V4 - 导出适配器 (Export Service)
 * 该服务负责将前端 Store 中的扁平化、易编辑的 RobotConfig 
 * 还原并适配为后端 (Python) 期待的结构化、遵循 Protobuf 规范的 JSON 格式。
 * 核心功能：
 * 1. 结构化重组：将扁平的组件列表重新构建为带有父子关系的树形结构。
 * 2. 字段映射：确保 Key 名与数据类型与二进制 Schema (Protobuf) 严格对齐。
 * 3. 联动同步：将 Identity (身份信息) 同步注入到底盘组件的属性中。
 */

import { RobotConfig, ComponentConfig, SmartAttribute, AttributeGroup, InterfaceConfig } from '../store/types';

export class ExportService {
    /**
     * 主导出入口
     * 将整个 RobotConfig 转换为符合后端 CompDesc.json + AbilitySet 格式的大对象。
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
            // 递归转换根节点组件
            moreModuleInfo: config.components
                .filter(c => !c.parentNodeUuid) 
                .map(c => this.mapModuleGroup(c, config.components)),
            functionAbility: this.exportAbilities(config.abilities)
        };
    }

    /** 递归映射模块组 (Module Groups) */
    private static mapModuleGroup(comp: ComponentConfig, all: ComponentConfig[]): any {
        const children = all.filter(c => c.parentNodeUuid === comp.id);
        return {
            moduleGroupName: comp.moduleGroupName || comp.name || "UnnamedModule",
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

    /** 映射单个组件详情到二进制兼容 JSON */
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
                    arrayBaseEle: g.elements.map(e => this.mapAttributeToCModel(e, false)) 
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
                /** 安装位参数强制转换为 DATA_DOUBLE 类型以符合二进制定义 */
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

    /** 映射属性项 (SmartAttribute) 到 Protobuf 联合体格式 (oneof) */
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

        // 强校验并填入对应的字段 (Protobuf Message 模拟)
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

        /** 处理 COMBOX 联动：注意 Ability 和 Component 这里的子属性 Key 并不一致 */
        if (a.type === 'DATA_COMBOX' && a.comboType) {
            base.comboType = {
                typeKey: a.comboType.typeKey,
                typeDesc: a.comboType.typeDesc,
                typeGroups: a.comboType.typeGroups?.map(g => ({
                    key: g.key,
                    desc: g.desc,
                    // 差异点：能力集使用 arrayAttr，组件使用 arrayCmobEle
                    [isAbility ? 'arrayAttr' : 'arrayCmobEle']: g.arrayCmobEle?.map(sub => this.mapAttributeToCModel(sub, isAbility))
                }))
            };
        }

        return base;
    }
}
