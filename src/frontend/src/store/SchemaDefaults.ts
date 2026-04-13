/**
 * §SCHEMA-DEFAULTS-FIX: Schema-driven default values loader
 *
 * Replaces hardcoded SCHEMA_DEFAULTS in ImportService.ts and PerformanceConfig.ts
 * Dynamically loads defaults from JSON Schema files under ModuleAttrTem/Pri_Attr/.../PrivateAttribute.json
 *
 * Usage:
 *   const defaults = await loadSchemaDefaults('diffChassis');
 *   const length = defaults.chassisAttr?.length?.value ?? 1200;
 */

import diffChassisSchema from '../assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/diffChassis/PrivateAttribute.json';
import steerChassisSchema from '../assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/steerChassis/PrivateAttribute.json';

/**
 * Schema default value cache - lazy loaded
 */
const schemaDefaultsCache: Map<string, Record<string, any>> = new Map();

/**
 * Preloaded schemas for chassis types (eager load for critical paths)
 */
const PRELOADED_SCHEMAS: Record<string, any> = {
  diffChassis: diffChassisSchema,
  steerChassis: steerChassisSchema
};

/**
 * Extracts default values from Schema JSON structure
 *
 * Schema structure:
 * {
 *   "privateAttrs": [
 *     {
 *       "key": "chassisAttr",
 *       "arrayBaseEle": [
 *         { "key": "length", "type": "DATA_DOUBLE", "doubleValue": 100, ... }
 *       ]
 *     }
 *   ]
 * }
 *
 * Returns flattened structure: { "chassisAttr.length": { type, value, unit, ... } }
 */
function extractDefaultsFromSchema(schemaJson: any): Record<string, any> {
  const defaults: Record<string, any> = {};

  if (!schemaJson?.privateAttrs) {
    console.warn('[SchemaDefaults] No privateAttrs found in schema');
    return defaults;
  }

  for (const group of schemaJson.privateAttrs) {
    const groupKey = group.key;
    defaults[groupKey] = defaults[groupKey] || {};

    if (Array.isArray(group.arrayBaseEle)) {
      for (const attr of group.arrayBaseEle) {
        const attrKey = attr.key;
        // Extract value based on type
        let value: any = null;
        let type = attr.type;

        switch (type) {
          case 'DATA_DOUBLE':
            value = attr.doubleValue ?? 0;
            break;
          case 'DATA_INT32':
          case 'DATA_UINT32':
            value = attr.int32Value ?? 0;
            break;
          case 'DATA_BOOL':
            value = attr.boolValue ?? false;
            break;
          case 'DATA_STRING':
            value = attr.stringValue ?? '';
            break;
          case 'DATA_COMBOX':
            value = attr.comboType?.typeKey ?? null;
            break;
          case 'DATA_FIXED_E':
            value = attr.stringFix ?? '';
            break;
          default:
            value = attr.value ?? null;
        }

        defaults[groupKey][attrKey] = {
          type,
          value,
          unit: attr.unit,
          desc: attr.desc,
          boolMustfill: attr.boolMustfill,
          boolHide: attr.boolHide,
          doubleMaxvalue: attr.doubleMaxvalue,
          doubleMinvalue: attr.doubleMinvalue,
          int32Maxvalue: attr.int32Maxvalue,
          int32Minvalue: attr.int32Minvalue,
          comboType: attr.comboType, // For DATA_COMBOX nested structures
          fixedSource: attr.fixedSource // For DATA_FIXED_E source filtering
        };
      }
    }
  }

  // Add helper accessor for dot notation (e.g., chassisAttr.length)
  defaults._get = (path: string) => {
    const parts = path.split('.');
    let current: any = defaults;
    for (const part of parts) {
      current = current?.[part];
      if (current === undefined) return undefined;
    }
    return current;
  };

  return defaults;
}

/**
 * Load schema defaults for a given subType
 *
 * @param subType - The schema subType key (e.g., 'diffChassis', 'PMSMMotor')
 * @returns Flattened default values object
 */
export function loadSchemaDefaults(subType: string): Record<string, any> {
  // Return from cache if available
  if (schemaDefaultsCache.has(subType)) {
    return schemaDefaultsCache.get(subType)!;
  }

  // Use preloaded schemas for chassis types
  const schemaJson = PRELOADED_SCHEMAS[subType];
  if (!schemaJson) {
    console.warn(`[SchemaDefaults] Schema not found for ${subType}, using empty defaults`);
    return {};
  }

  const defaults = extractDefaultsFromSchema(schemaJson);
  schemaDefaultsCache.set(subType, defaults);
  return defaults;
}

/**
 * Get chassis-specific schema defaults (diffChassis or steerChassis)
 *
 * @param driveType - The drive type from RobotIdentity
 * @returns Schema defaults for the appropriate chassis type
 */
export function getChassisSchemaDefaults(driveType: string): {
  shape: { length: number; width: number; height: number };
  motionCenter: { headOffset: number; tailOffset: number; leftOffset: number; rightOffset: number };
  performance: { maxSpeed: number; maxAccel: number; maxDecel: number; avoidMaxDec: number };
  rotate: { rotateMaxAngSpeed: number; rotateMaxAngAcceleration: number };
} {
  // Determine chassis type from driveType
  const chassisType = driveType?.includes('STEER') ? 'steerChassis' : 'diffChassis';
  const defaults = loadSchemaDefaults(chassisType);

  // Extract values with fallbacks (using XML Schema defaults)
  const chassisAttr = defaults.chassisAttr || {};
  const motionCenterAttr = defaults.motionCenterAttr || {};

  return {
    shape: {
      length: chassisAttr.length?.value ?? 100,  // XML default: 100
      width: chassisAttr.width?.value ?? 100,     // XML default: 100
      height: chassisAttr.height?.value ?? 100    // XML default: 100
    },
    motionCenter: {
      headOffset: motionCenterAttr['headOffset(Idle)']?.value ?? 0,
      tailOffset: motionCenterAttr['tailOffset(Idle)']?.value ?? 0,
      leftOffset: motionCenterAttr['leftOffset(Idle)']?.value ?? 0,
      rightOffset: motionCenterAttr['rightOffset(Idle)']?.value ?? 0
    },
    performance: {
      maxSpeed: chassisAttr['maxSpeed(Idle)']?.value ?? 1,
      maxAccel: chassisAttr['maxAcceleration(Idle)']?.value ?? 1,
      maxDecel: chassisAttr['maxDeceleration(Idle)']?.value ?? 1,
      avoidMaxDec: chassisAttr['avoidMaxDec (Idle)']?.value ?? 500
    },
    rotate: {
      rotateMaxAngSpeed: chassisAttr['rotateMaxAngSpeed (Idle)']?.value ?? 6,
      rotateMaxAngAcceleration: chassisAttr['rotateMaxAngAcceleration (Idle)']?.value ?? 1
    }
  };
}

/**
 * §RATIONAL: Why this replaces hardcoded SCHEMA_DEFAULTS
 *
 * OLD (HARDCODE):
 *   private static readonly SCHEMA_DEFAULTS = {
 *     chassis: { length: 1200, width: 800, height: 0 },  // ← Magic numbers
 *     offsets: { idle: { head: 600, tail: 600, left: 400, right: 400 } }
 *   };
 *
 * NEW (Schema-driven):
 *   const defaults = getChassisSchemaDefaults('STANDARD_DIFF');
 *   // Returns: { length: 100, width: 100, height: 100 } from XML
 *
 * The XML Schema (PrivateAttributes.xml) defines these defaults:
 *   - diffChassis/chassisAttr/length: 100
 *   - diffChassis/chassisAttr/width: 100
 *   - diffChassis/chassisAttr/height: 100
 *
 * NOTE: The old hardcoded values (1200/800/0) were UX defaults, not schema defaults.
 *       If 1200x800 is required for UX, it should be set in the UI layer, not import layer.
 */

/**
 * Get the default offset value for a specific motion center field (Idle state)
 *
 * @param field - The field name (headOffset, tailOffset, leftOffset, rightOffset)
 * @returns Default Idle value from schema
 */
export function getDefaultOffset(field: 'headOffset' | 'tailOffset' | 'leftOffset' | 'rightOffset'): number {
  const keyMap: Record<string, string> = {
    headOffset: 'headOffset(Idle)',
    tailOffset: 'tailOffset(Idle)',
    leftOffset: 'leftOffset(Idle)',
    rightOffset: 'rightOffset(Idle)'
  };

  // XML defines these as doubleValue="0" (not 600/400)
  // The 600/400 was a UX convenience, not a schema default
  const defaults = loadSchemaDefaults('diffChassis');
  return defaults.motionCenterAttr?.[keyMap[field]]?.value ?? 0;
}

/**
 * Preload common schemas for performance
 * Call this at app initialization
 */
export function preloadSchemaDefaults(): void {
  const commonTypes = ['diffChassis', 'steerChassis', 'PMSMMotor', 'horizontalSteerWheel'];
  for (const type of commonTypes) {
    if (!schemaDefaultsCache.has(type)) {
      loadSchemaDefaults(type);
    }
  }
}

// Auto-preload on module import
preloadSchemaDefaults();
