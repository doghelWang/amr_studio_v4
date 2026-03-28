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
 * IMPLEMENTS DUAL-KEY STRATEGY (Camel/Snake).
 * SUPPORT DYNAMIC SCHEMA REGISTRY.
 */
export class ImportService {
    private static readonly CATEGORY_MAP: Record<string, MainModuleType> = {
        'chassis':               'CHASSIS',
        'driveWheel':            'DRIVEWHEEL',
        'driver':                'DRIVER',
        'sensor':                'SENSOR',
        'sensorProcessor':       'SENSORPROCESSOR',
        'mainCPU':               'MAINCPU',
        'mainCpu':               'MAINCPU',
        'intergratedController': 'INTERGRATEDCONTROLLER',
        'communication':         'COMMUNICATION',
        'extendedInterface':     'IO_BOARD',   // canonical
        'extendedlnterface':     'IO_BOARD',   // typo in source JSONs (lowercase l)
        'ioModule':              'IO_BOARD',   // submodule type variant
        'IOModule':              'IO_BOARD',   // uppercase variant
        'safetyIOModule':        'IO_BOARD',   // safety IO board
        'safetyController':      'CONTROL',
        'weakSteerWheel':        'DRIVEWHEEL',
        'steerWheel':            'DRIVEWHEEL',
        'diffSteerWheel':        'DRIVEWHEEL',
        'battery':               'BATTERY',
        'energyController':      'ENERGYCONTROLLER',
        'button':                'BUTTON',
        'screen':                'SCREEN',
        'light':                 'LIGHT',
        'audio':                 'AUDIO',
        'actor':                 'ACTOR',
        'autobody':              'AUTOBODY',
    };

    static parseCompDesc(json: any, schemaRegistry?: Record<string, any>): Partial<RobotConfig> {
        console.log('DEBUG [ImportService]: parseCompDesc keys:', Object.keys(json));
        const components: ComponentConfig[] = [];
        
        // Protocol check (Dual-Key)
        const infoKey = json.moreModuleInfo ? "moreModuleInfo" : "more_module_info";

        if (json[infoKey] && Array.isArray(json[infoKey])) {
            json[infoKey].forEach((group: any) => {
                this.processModuleGroup(group, components, null, schemaRegistry);
            });
        }

        const identity = {
            robotName: json.robotName || json.robot_name || 'Imported_AMR',
            version: json.version || '1.0.0',
            materialCode: json.materialCode || json.material_code || '',
            alias: json.alias || '',
            venderName: json.venderName || json.vender_name || '',
            navigationMethod: (json.navigationMethod || json.navigation_method || 'LASER_SLAM') as any,
            driveType: (json.driveType || json.drive_type || 'STANDARD_DIFF') as any,
            chassisShape: (json.chassisShape || json.chassis_shape || 'BOX') as any,
            chassisLength: json.chassisLength || json.chassis_length || 1200,
            chassisWidth: json.chassisWidth || json.chassis_width || 800,
            chassisHeight: json.chassisHeight || json.chassis_height || 400,
            // ━━━ NEW OFFSET FIELDS (PROTO COMPLIANT) ━━━
            headOffset: json.headOffset || json.head_offset || 600,
            tailOffset: json.tailOffset || json.tail_offset || 600,
            leftOffset: json.leftOffset || json.left_offset || 400,
            rightOffset: json.rightOffset || json.right_offset || 400,
        };

        const chassis = components.find(c => c.category === 'CHASSIS');
        if (chassis && chassis.shape && chassis.shape.type === 'BOX') {
            identity.chassisLength = chassis.shape.length || identity.chassisLength;
            identity.chassisWidth = chassis.shape.width || identity.chassisWidth;
            identity.chassisHeight = chassis.shape.height || identity.chassisHeight;
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
                    // ━━━ ALIGNED WITH GEMINI_RULES: arrayAttr in AbiSet ━━━
                    arrayCmobEle: (o.arrayAttr || o.array_cmob_ele || []).map((e: any) => this.mapAttribute(e))
                }))
            } : undefined
        };
    }

    /**
     * P4e: Parse board_desc JSON to extract public electrical interfaces.
     * Filters out internal interfaces (PI/PO/LVDS/UART/SPI/I2C) per spec.
     * Returns an array of InterfaceConfig ready to merge into a component.
     */
    static parseBoardInterfaces(boardDescJson: any): InterfaceConfig[] {
        const interfaces: InterfaceConfig[] = [];
        const boardKey = Object.keys(boardDescJson)[0];
        if (!boardKey) return interfaces;
        const board = boardDescJson[boardKey];

        // ━━━ Public interface types to INCLUDE (from spec) ━━━
        const INCLUDE_TYPES = ['can', 'rs485', 'rs232', 'di', 'do', 'ai', 'ao'];

        // Helper: extract name array from an interface section
        const extractSection = (section: Record<string, any[]>, type: string): InterfaceConfig[] => {
            const entries = section[type];
            if (!entries || !Array.isArray(entries)) return [];
            return entries.map((entry: any) => ({
                key: entry.name || `${type.toUpperCase()}_${uuidv4().slice(0, 4)}`,
                type: type.toUpperCase(),
                desc: entry.desc || entry.name || '',
                interfaceUuid: uuidv4(),
                path: entry.hard_define || entry.peripheral || '',
            } as InterfaceConfig));
        };

        // Scan all sections
        for (const sectionName of Object.keys(board)) {
            if (['基本信息', 'mcu'].includes(sectionName)) continue;
            const section = board[sectionName];
            if (typeof section !== 'object') continue;

            for (const ifaceType of INCLUDE_TYPES) {
                const extracted = extractSection(section, ifaceType);
                interfaces.push(...extracted);
            }
        }

        return interfaces;
    }

    /**
     * P4e: Enrich a control board component with interfaces parsed from board_desc file.
     * Merges new interfaces without duplicating existing ones (by key).
     */
    static enrichComponentFromBoardDesc(comp: ComponentConfig, boardDescJson: any): ComponentConfig {
        const newIfaces = this.parseBoardInterfaces(boardDescJson);
        if (newIfaces.length === 0) return comp;

        const existingKeys = new Set(comp.interfaces.map(i => i.key));
        const merged = [
            ...comp.interfaces,
            ...newIfaces.filter(i => !existingKeys.has(i.key)),
        ];
        return { ...comp, interfaces: merged };
    }

    private static processModuleGroup(group: any, list: ComponentConfig[], parentUuid: string | null, schemaRegistry?: Record<string, any>) {
        const groupName = group.moduleGroupName || group.module_group_name || '';
        const groupUuid = group.moduleGroupUuid || group.module_group_uuid || uuidv4();
        
        const componentsArr = group.moduleComponets || group.module_componets;

        if (componentsArr && Array.isArray(componentsArr)) {
            componentsArr.forEach((comp: any) => {
                const config = this.mapToComponent(comp, groupName, groupUuid, parentUuid, schemaRegistry, componentsArr);
                list.push(config);
            });
        }

        const infoKey = group.moreModuleInfo ? "moreModuleInfo" : "more_module_info";
        if (group[infoKey]) {
            // ━━━ 0327-1: Recursive Hierarchy Fix ━━━
            // Pass the ID of the LAST added component in the current group as the parent for the sub-groups
            const lastCompId = list.length > 0 ? list[list.length - 1].id : parentUuid;
            group[infoKey].forEach((sub: any) => this.processModuleGroup(sub, list, lastCompId, schemaRegistry));
        }
    }

    private static mapToComponent(
        comp: any, groupName: string, groupUuid: string, parentUuid: string | null, schemaRegistry?: Record<string, any>, allComponents?: any[]
    ): ComponentConfig {
        const gen = comp.generalAttr || comp.general_attr || {};
        const struct = comp.structParam || comp.struct_param || {};

        // ━━━ 0325: Metadata-Driven Type Resolution ━━━
        let rawMainType = gen.mainModuleType?.comboType?.typeKey || gen.main_module_type?.combo_type?.type_key || 'chassis';
        let subTypeKey = gen.subModuleType?.comboType?.typeKey || gen.sub_module_type?.combo_type?.type_key || 'diffChassis';

        // ━━━ 0325: Multi-Component Analysis ━━━
        if (allComponents && allComponents.length > 1) {
            const priorities = [
                'driveWheel', 'diffSteerWheel', 'steerWheel', 'weakSteerWheel',
                'horizontalSteerWheel', 'verticalSteerWheel',
                'chassis',
                'mainCPU', 'mainCpu', 'intergratedController',
                'driver', 'battery', 'button', 'screen', 'light',
                'sensor',
            ];
            let highestPriority = -1;

            allComponents.forEach(c => {
                const cGen = c.generalAttr || c.general_attr || {};
                const cMain = cGen.mainModuleType?.comboType?.typeKey || cGen.main_module_type?.combo_type?.type_key || '';
                const pIdx = priorities.indexOf(cMain);
                if (pIdx !== -1 && (highestPriority === -1 || pIdx < highestPriority)) {
                    highestPriority = pIdx;
                    rawMainType = cMain;
                    subTypeKey = cGen.subModuleType?.comboType?.typeKey || cGen.sub_module_type?.combo_type?.type_key || subTypeKey;
                }
            });
        }

        // ━━━ DYNAMIC SCHEMA LOOKUP ━━━
        let category: MainModuleType = (ImportService.CATEGORY_MAP[rawMainType] || rawMainType.toUpperCase()) as MainModuleType;
        if (schemaRegistry) {
            const matchedSchema = Object.values(schemaRegistry).find(
                (s: any) => s.key === rawMainType || s.aliases?.includes(rawMainType)
            );
            if (matchedSchema) {
                category = matchedSchema.category as MainModuleType;
            }
        }

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
            if (s.box) {
                shape = { 
                    type: 'BOX', 
                    length: s.box.sizeLen || s.box.size_len || 0, 
                    width: s.box.sizeWidth || s.box.size_width || 0, 
                    height: s.box.sizeHeight || s.box.size_height || 0 
                };
            } else if (s.cylinder) {
                shape = { 
                    type: 'CYLINDER', 
                    diameter: s.cylinder.diameter || s.cylinder.diameter || 0, 
                    height: s.cylinder.height || s.cylinder.height || 0 
                };
            }
        }

        const rawPrivateAttr = comp.privateAttr || comp.private_attr || {};
        const privateAttrs: AttributeGroup[] = (rawPrivateAttr.privateAttrs || rawPrivateAttr.private_attrs || []).map((grp: any) => ({
            key: grp.key || '',
            desc: grp.desc || '',
            elements: (grp.arrayBaseEle || grp.array_base_ele || []).map((attr: any) => this.mapAttribute(attr)),
        }));

        const structExtend = struct.extendParams || struct.extend_params || [];

        const result: ComponentConfig = {
            id: uuid,
            name: gen.moduleName?.stringValue || gen.module_name?.string_value || subTypeKey,
            alias: gen.extendParams?.find((p: any) => p.key === 'module_alias')?.stringValue 
                   || gen.extend_params?.find((p: any) => p.key === 'module_alias')?.string_value
                   || gen.moduleDesc?.stringValue || gen.module_desc?.string_value
                   || subTypeKey,
            type: subTypeKey,
            category,
            mainModuleTypeKey: rawMainType,
            subModuleTypeKey: subTypeKey,
            parentNodeUuid: parentUuid
                || structExtend.find((p: any) => p.key === 'parentNodeUuid')?.stringValue
                || structExtend.find((p: any) => p.key === 'parentNodeUuid')?.string_value
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

        // Ensure alias is meaningful
        if ((!result.alias || result.alias === result.type) && groupName && groupName !== 'LibraryGroup') {
            result.alias = groupName;
        }

        return result;
    }

    private static findExtend(extend: any[], key: string): number {
        const item = extend?.find((p: any) => p.key === key);
        return item?.doubleValue ?? item?.double_value ?? 0;
    }

    private static mapAttribute(attr: any): SmartAttribute {
        return {
            key: attr.key,
            desc: attr.desc || attr.key,
            type: attr.type || 'DATA_DOUBLE',
            value: this.extractValue(attr),
            maxValue: attr.doubleMaxvalue ?? attr.int32Maxvalue ?? attr.floatMaxvalue ?? attr.double_minvalue ?? attr.int32_minvalue,
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

    static mapEntityToComponent(entityJson: any, schemaRegistry?: Record<string, any>): ComponentConfig {
        const componentsArr = entityJson.moduleComponets || entityJson.module_componets || [];
        const comp = componentsArr[0];
        if (!comp) throw new Error("Invalid entity JSON: no components found");

        const groupName = entityJson.moduleGroupName || "LibraryGroup";
        const groupUuid = uuidv4();
        const newId = uuidv4();
        
        const mapped = this.mapToComponent(comp, groupName, groupUuid, null, schemaRegistry, componentsArr);
        return { ...mapped, id: newId };
    }
}
