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
 * Precisely aligned with controller_model_comp_desc.proto.
 */
export class ImportService {
    /** Maps raw camelCase category keys from proto to frontend MainModuleType enum */
    private static readonly CATEGORY_MAP: Record<string, MainModuleType> = {
        'chassis':               'CHASSIS',
        'driveWheel':            'DRIVEWHEEL',
        'driver':                'DRIVER',
        'sensor':                'SENSOR',
        'sensorprocessor':       'SENSORPROCESSOR',
        'mainCPU':               'MAINCPU',
        'maincpu':               'MAINCPU',
        'intergratedcontroller': 'INTERGRATEDCONTROLLER',
        'communication':         'COMMUNICATION',
        'extendedlnterface':     'EXTENDEDLNTERFACE',
        'battery':               'BATTERY',
        'energycontroller':      'ENERGYCONTROLLER',
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

        if (json.moreModuleInfo && Array.isArray(json.moreModuleInfo)) {
            json.moreModuleInfo.forEach((group: any) => {
                this.processModuleGroup(group, components, null);
            });
        }

        const identity = {
            robotName: json.robotName || 'Imported_AMR',
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
        const groupName = group.moduleGroupName || '';
        const groupUuid = group.moduleGroupUuid || uuidv4();

        if (group.moduleComponets) {
            group.moduleComponets.forEach((comp: any) => {
                const config = this.mapToComponent(comp, groupName, groupUuid, parentUuid);
                list.push(config);
            });
        }

        if (group.moreModuleInfo) {
            group.moreModuleInfo.forEach((sub: any) => this.processModuleGroup(sub, list, parentUuid));
        }
    }

    private static mapToComponent(
        comp: any, groupName: string, groupUuid: string, parentUuid: string | null
    ): ComponentConfig {
        const gen = comp.generalAttr || {};
        const struct = comp.structParam || {};

        // raw typeKey is camelCase (e.g. 'driveWheel', 'mainCPU') — use CATEGORY_MAP
        const rawCat = gen.mainModuleType?.comboType?.typeKey || 'chassis';
        const category = (ImportService.CATEGORY_MAP[rawCat] || rawCat.toUpperCase()) as MainModuleType;
        const type = gen.subModuleType?.comboType?.typeKey || 'diffChassis';

        // UUID: generalAttr tag '4' is an array of objects; also can be gen.moduleUuid
        const uuidItems = gen['4'];
        const uuid =
            (Array.isArray(uuidItems) ? uuidItems[0]?.stringValue : uuidItems?.stringValue)
            || gen.moduleUuid?.stringValue
            || uuidv4();

        // ── Private Attributes ──────────────────────────────────────────────────────
        // privateAttr is an OBJECT: { privateAttrs: [{ key, desc, arrayBaseEle: [...] }] }
        const rawPrivateAttr = comp.privateAttr;
        const privateAttrList: any[] = Array.isArray(rawPrivateAttr)
            ? rawPrivateAttr                                          // legacy list format
            : (rawPrivateAttr?.privateAttrs ?? []);                   // standard dict format

        const privateAttrs: AttributeGroup[] = privateAttrList.map((grp: any) => ({
            key: grp.key || '',
            desc: grp.desc || '',
            boolDeprecated: grp.boolDeprecated,
            elements: (grp.arrayBaseEle || grp.attributes || []).map((attr: any) => this.mapAttribute(attr)),
        }));

        // ── Interfaces ──────────────────────────────────────────────────────────────
        // interfaceParams is an OBJECT: { interfaceGroup: [{ key, type, desc, interfaceUuid, interfaceAttrs:{interfaceParamsArray:[...]} }] }
        const rawIface = comp.interfaceParams;
        const ifaceList: any[] = Array.isArray(rawIface)
            ? rawIface                                                // legacy list format
            : (rawIface?.interfaceGroup ?? []);                       // standard dict format

        const interfaces: InterfaceConfig[] = ifaceList.map((inf: any) => ({
            key: inf.key,
            type: inf.type,
            path: inf.path,
            desc: inf.desc,
            interfaceUuid: inf.interfaceUuid || uuidv4(),
            linkedInterfaceUuid: inf.linkedInterfaceUuid,
            linkAttrs: inf.linkAttrs,
            interfaceAttrs: inf.interfaceAttrs,
            interfaceParams: inf.interfaceParams,
        }));

        // ── Shape ────────────────────────────────────────────────────────────────────
        let shape: ComponentConfig['shape'];
        if (gen.moduleShape && !Array.isArray(gen.moduleShape)) {
            const s = gen.moduleShape;
            if (s.box) shape = { type: 'BOX', length: s.box.sizeLen, width: s.box.sizeWidth, height: s.box.sizeHeight };
            else if (s.cylinder) shape = { type: 'CYLINDER', diameter: s.cylinder.diameter, height: s.cylinder.height };
            else if (s.sphere) shape = { type: 'SPHERE', diameter: s.sphere.diameter };
        }

        // ── struct param: parentNodeUuid & mount coords ──────────────────────────────
        const structExtend = Array.isArray(struct) ? struct : (struct.extendParams ?? []);

        return {
            id: uuid,
            name: this.getVal(gen, 'moduleName', '1') || type,
            alias: gen.extendParams?.find((p: any) => p.key === 'module_alias')?.stringValue || type,
            type,
            category,
            parentNodeUuid: parentUuid
                || structExtend.find((p: any) => p.key === 'parentNodeUuid')?.comboType?.typeKey
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
            interfaceAbility: comp.interfaceAbility,
            interfaces,
            shape,
            generalAttr: gen,
            rawStructParam: struct.segmentedLimitsParams,
            disabled: comp.boolDisable,
            deprecated: comp.boolDeprecated,
        };
    }

    /** Robust value extraction for mixed-format JSON (name or tag) */
    private static getVal(obj: any, name: string, tag: string): string {
        if (!obj) return '';
        const field = obj[name] || (obj[tag] && Array.isArray(obj[tag]) ? obj[tag][0] : obj[tag]);
        if (!field) return '';
        
        // Handle direct string mapping
        if (typeof field === 'string') return field;
        
        // Handle specialized stringValue (could be array or direct)
        const sv = field.stringValue;
        if (Array.isArray(sv)) {
            const first = sv[0];
            if (typeof first === 'string') return first;
            if (first && typeof first === 'object') {
                return first.int32Value || first.stringValue || JSON.stringify(first);
            }
        } else if (typeof sv === 'string') {
            return sv;
        }

        return field.key || '';
    }

    /** Maps a single Message_Base_Element to SmartAttribute */
    private static mapAttribute(attr: any): SmartAttribute {
        return {
            key: attr.key,
            desc: attr.desc || attr.key,
            type: attr.type || 'DATA_DOUBLE',
            value: this.extractValue(attr),
            maxValue: attr.doubleMaxvalue ?? attr.int32Maxvalue ?? attr.floatMaxvalue,
            minValue: attr.doubleMinvalue ?? attr.int32Minvalue ?? attr.floatMinvalue,
            unit: attr.unit,
            boolParse: attr.boolParse,
            boolHide: attr.boolHide,
            boolNoeditable: attr.boolNoeditable,
            boolMustfill: attr.boolMustfill,
            boolBasic: attr.boolBasic,
            fixedSource: attr.fixedSource,
            comboType: attr.comboType,
            arrayCmobEle: attr.arrayCmobEle?.map((sub: any) => this.mapAttribute(sub)),
        };
    }

    private static extractValue(attr: any) {
        switch (attr.type) {
            case 'DATA_STRING': return attr.stringValue;
            case 'DATA_DOUBLE': return attr.doubleValue;
            case 'DATA_FLOAT': return attr.floatValue;
            case 'DATA_INT32': return attr.int32Value;
            case 'DATA_UINT32': return attr.uint32Value;
            case 'DATA_INT64': return attr.int64Value;
            case 'DATA_UINT64': return attr.uint64Value;
            case 'DATA_BOOL': return attr.boolValue;
            case 'DATA_IP': return attr.ipValue;
            case 'DATA_COMBOX': return attr.comboType?.typeKey;
            case 'DATA_FIXED_E': return attr.stringFix;
            default: return attr.doubleValue ?? attr.stringValue;
        }
    }

    private static findExtend(params: any[], key: string): number {
        return params?.find((p: any) => p.key === key)?.doubleValue || 0;
    }
}
