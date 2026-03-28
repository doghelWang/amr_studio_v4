/// <reference types="vite/client" />
import { SmartAttribute, AttributeGroup, AttributeDataType } from './types';

// Eager load all PrivateAttribute JSON definitions synchronously.
const moduleSchemasGlob = import.meta.glob('../assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/**/PrivateAttribute.json', { eager: true });

// Map from subTypeKey (e.g., "horizontalSteerWheel") -> JSON Object
const schemaRegistry: Record<string, any> = {};

Object.entries(moduleSchemasGlob).forEach(([path, module]: [string, any]) => {
    const parts = path.split('/');
    if (parts.length >= 3) {
        const subTypeDir = parts[parts.length - 2];
        schemaRegistry[subTypeDir] = module.default || module;
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Engineering Constraints — Domain expert corrections
// that override raw JSON schema behavior for UI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface EngineeringConstraint {
    /** Combo options to hide from UI for specific attributes */
    hiddenComboOptions?: Record<string, string[]>;
    /** Default combo selections to override schema defaults */
    defaultOverrides?: Record<string, string>;
    /** Fields whose visibility depends on another field's value */
    conditionalVisibility?: Record<string, {
        dependsOn: string;
        showWhen: string | string[];
        defaultWhenHidden: any;
    }>;
    /** Force-override boolHide for specific attributes (true = force visible, false = force hidden) */
    visibilityOverrides?: Record<string, boolean>;
}

const ENGINEERING_CONSTRAINTS: Record<string, EngineeringConstraint> = {
    diffSteerWheel: {
        hiddenComboOptions: {
            angleSensorType: ['GROUP_CALI_INC_EXTERNAL']
        },
        defaultOverrides: {
            angleSensorType: 'GROUP_CALI_ABS_EXTERNAL'
        },
        // Motor references are auto-bound at creation — hide from user
        visibilityOverrides: {
            relateLeftMotor: false,
            relateRightMotor: false
        }
    },
    horizontalSteerWheel: {
        defaultOverrides: {
            angleSensorType: 'GROUP_CALI_ABS_INTERNAL'
        }
    },
    verticalSteerWheel: {
        defaultOverrides: {
            angleSensorType: 'GROUP_CALI_ABS_INTERNAL'
        }
    },
    subDriver: {
        conditionalVisibility: {
            softwareSpec: {
                dependsOn: 'type',
                showWhen: 'MOTOR_SERVO_TYPE_HIK',
                defaultWhenHidden: 'NONE'
            }
        }
    },
    PMSMMotor: {
        // PMSM servo motors MUST have an encoder — hide "无" option
        hiddenComboOptions: {
            ENCType: ['ENCODER_NULL']
        },
        // Default to incremental encoder
        defaultOverrides: {
            ENCType: 'ENCODER_INC'
        },
        // bReverse must be user-configurable (override schema's boolHide: true)
        visibilityOverrides: {
            bReverse: true
        }
    }
};

/**
 * Retrieves engineering constraints for a specific subType.
 * Engineering constraints override the raw JSON schema behavior to enforce domain-specific rules
 * (e.g., forcing a field to be visible, overriding default enum values, or conditionally hiding options).
 * @param subType The module's schema key (e.g., "PMSMMotor")
 * @returns The engineering constraint configuration, or null if no overrides apply.
 */
export function getEngineeringConstraints(subType: string): EngineeringConstraint | null {
    return ENGINEERING_CONSTRAINTS[subType] || null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Preset Options — Common engineering values for quick select
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PRESET_OPTIONS: Record<string, number[]> = {
    encoderLine: [2500, 3000, 4000],
    lineCount: [2500, 3000, 4000],
};

export function getPresetOptions(attrKey: string): number[] | null {
    return PRESET_OPTIONS[attrKey] || null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Physical Meaning Tooltips
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TOOLTIPS: Record<string, string> = {
    isInvert: '设为"是"时，编码器数值增加方向对应物理运动反方向（例如数值增加 = 实际右转/减少方向）。用于修正编码器安装方向与系统预期方向不一致的情况。',
    bReverse: '设为"是"时，电机正转方向与系统预期方向相反。用于修正电机安装方向问题。',
    gearRatio: '减速机齿轮比。减速后的传动比 = 电机转速 / 输出轴转速。',
    angleLmtPos: '舵轮顺时针方向可旋转的最大角度。0° = 正前方。',
    angleLmtNeg: '舵轮逆时针方向可旋转的最大角度（负值）。',
    rotOmgLmt: '舵轮转向系统支持的最大角速度。',
    overCurrCoef: '电机过流保护系数，当实际电流超过额定电流×此系数时触发保护。',
};

export function getTooltip(attrKey: string): string | null {
    return TOOLTIPS[attrKey] || null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// fixedSource path → component filter rule mapping
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface FixedSourceFilter {
    category: string;    // e.g. 'MOTOR', 'SENSOR'
    subType?: string;    // e.g. 'PMSMMotor', 'incrementalEncode'
}

/**
 * Parses a `fixedSource` path (e.g., "driver/PMSMMotor") from the CModel JSON into a component filter rule.
 * The path format is strictly: "<moduleGroup>/<subTypeKey>".
 * This function maps the underlying `moduleGroup` into the frontend's standardized `category`
 * (e.g., 'DRIVER' -> 'MOTOR', 'SENSOR' -> 'SENSOR') so the UI can mount a correct dropdown list of referenceable components.
 * 
 * @param source The raw `fixedSource` path from schema (e.g., "driver/PMSMMotor")
 * @returns A FixedSourceFilter containing the standardized category and optional subType mapping.
 */
const MODULE_GROUP_TO_CATEGORY: Record<string, string> = {
    driver: 'MOTOR',       // PMSMMotor/BDCMotor/BLDCMotor are MOTOR category
    sensor: 'SENSOR',      // encoders, proximity sensors etc.
};
export function parseFixedSource(source: string): FixedSourceFilter {
    const parts = source.split('/');
    if (parts.length === 2) {
        const [moduleGroup, subType] = parts;
        return {
            category: MODULE_GROUP_TO_CATEGORY[moduleGroup] || moduleGroup.toUpperCase(),
            subType
        };
    }
    return { category: source.toUpperCase() };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core: Build attributes from schema
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * Core Engine Function: Parses a CModel raw JSON schema (PrivateAttribute.json) for the given subType,
 * applies engineering constraints, resolves references, and flattens it into the UI-ready `AttributeGroup[]` format.
 * 
 * This guarantees the Single Source of Truth rule - all frontend forms must be dynamically generated via this function.
 * 
 * @param subType The module's subType definition (e.g., "diffWheel")
 * @returns An array of attribute groups, fully processed and ready for SmartForm rendering.
 */
export function buildAttributesFromSchema(subType: string): AttributeGroup[] {
    const rawSchema = schemaRegistry[subType];
    
    if (!rawSchema || !rawSchema.privateAttrs) {
        console.warn(`[SchemaEngine] No schema found in ModuleAttrTem for subType: ${subType}`);
        return [];
    }

    const constraints = getEngineeringConstraints(subType);
    const runtimePrivateAttrs: AttributeGroup[] = [];

    rawSchema.privateAttrs.forEach((rawGroup: any) => {
        const group: AttributeGroup = {
            key: rawGroup.key,
            desc: rawGroup.desc,
            elements: []
        };

        if (Array.isArray(rawGroup.arrayBaseEle)) {
            rawGroup.arrayBaseEle.forEach((rawEle: any) => {
                group.elements.push(transformElement(rawEle, constraints));
            });
        }
        
        runtimePrivateAttrs.push(group);
    });

    return runtimePrivateAttrs;
}

/**
 * Normalizes CModel strict protocol fields into a unified UI `SmartAttribute` format.
 * It recursively processes arrayCmobEle sub-attributes (e.g., nested dropdown configurations),
 * and dynamically injects values based on standard logic and Engineering Constraints.
 * 
 * @param rawEle A raw structural element directly from the CModel JSON.
 * @param constraints Engineering constraints applicable to this module type.
 * @returns A sanitized, UI-compatible SmartAttribute object.
 */
function transformElement(rawEle: any, constraints?: EngineeringConstraint | null): SmartAttribute {
    const base: SmartAttribute = {
        key: rawEle.key,
        desc: rawEle.desc,
        type: rawEle.type as AttributeDataType,
        value: null,
        boolHide: rawEle.boolHide ?? false,
        boolMustfill: rawEle.boolMustfill ?? false,
        boolBasic: rawEle.boolBasic !== undefined ? rawEle.boolBasic : true, 
        boolNoeditable: rawEle.boolNoeditable ?? false
    };

    // Apply visibility overrides from engineering constraints
    if (constraints?.visibilityOverrides?.[base.key] !== undefined) {
        const forceVisible = constraints.visibilityOverrides[base.key];
        base.boolHide = !forceVisible; // true = force visible → boolHide = false
    }

    if (rawEle.unit) {
        base.unit = rawEle.unit;
    }

    // Range constraints
    if (rawEle.doubleMaxvalue !== undefined) base.maxValue = rawEle.doubleMaxvalue;
    if (rawEle.doubleMinvalue !== undefined) base.minValue = rawEle.doubleMinvalue;
    if (rawEle.int32Maxvalue !== undefined) base.maxValue = rawEle.int32Maxvalue;
    if (rawEle.int32Minvalue !== undefined) base.minValue = rawEle.int32Minvalue;

    // Default Value mapping
    switch (base.type) {
        case 'DATA_DOUBLE':
        case 'DATA_FLOAT':
            base.value = rawEle.doubleValue !== undefined ? rawEle.doubleValue : 0;
            break;
        case 'DATA_INT32':
        case 'DATA_INT64':
        case 'DATA_UINT32':
            base.value = rawEle.int32Value !== undefined ? rawEle.int32Value : 0;
            break;
        case 'DATA_STRING':
            base.value = rawEle.stringValue !== undefined ? rawEle.stringValue : '';
            break;
        case 'DATA_BOOL':
            base.value = rawEle.boolValue !== undefined ? rawEle.boolValue : false;
            break;
        case 'DATA_COMBOX':
            if (rawEle.comboType) {
                // Apply engineering constraint: override default selection
                let defaultKey = rawEle.comboType.typeKey || null;
                if (constraints?.defaultOverrides?.[base.key]) {
                    defaultKey = constraints.defaultOverrides[base.key];
                }

                // Filter hidden options from typeGroups
                const hiddenOptions = constraints?.hiddenComboOptions?.[base.key] || [];
                const filteredGroups = (rawEle.comboType.typeGroups || [])
                    .filter((g: any) => !hiddenOptions.includes(g.key))
                    .map((g: any) => {
                        // RECURSIVELY transform arrayCmobEle sub-attributes
                        const transformedGroup: any = { key: g.key, desc: g.desc };
                        if (g.arrayCmobEle && Array.isArray(g.arrayCmobEle)) {
                            transformedGroup.arrayCmobEle = g.arrayCmobEle.map(
                                (sub: any) => transformElement(sub, constraints)
                            );
                        }
                        return transformedGroup;
                    });

                base.comboType = {
                    typeKey: defaultKey,
                    typeDesc: rawEle.comboType.typeDesc,
                    typeGroups: filteredGroups
                };
                base.value = defaultKey;
            }
            break;
        case 'DATA_FIXED_E':
            if (rawEle.fixedSource) {
                base.fixedSource = rawEle.fixedSource;
            } else if (rawEle.stringFix !== undefined) {
                // stringFix holds the bound UUID; fixedSource holds the type filter
                base.fixedSource = [];
            }
            base.value = rawEle.stringFix || null;
            break;
        default:
            base.value = null;
    }

    return base;
}
