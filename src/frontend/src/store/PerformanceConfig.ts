/**
 * §C002-FIX: Centralized Full Load Performance Ratios
 *
 * This module provides configuration for Full Load performance calculations
 * that was previously hardcoded across multiple files:
 * - ImportService.ts (import)
 * - useProjectStore.ts (sync)
 * - ChassisStep.tsx (UI display)
 *
 * Single Source of Truth for Full Load performance ratios.
 * Any changes to these business rules should be made here only.
 */

export interface FullLoadRatios {
  /**
   * Maximum speed ratio (Idle -> Full Load)
   * e.g., 0.8 means Full Load speed is 80% of Idle speed
   */
  maxSpeed: number;

  /**
   * Maximum acceleration ratio (Idle -> Full Load)
   * e.g., 0.4 means Full Load acceleration is 40% of Idle acceleration
   */
  maxAcceleration: number;

  /**
   * Maximum deceleration ratio (Idle -> Full Load)
   * e.g., 0.5 means Full Load deceleration is 50% of Idle deceleration
   */
  maxDeceleration: number;

  /**
   * Avoid max deceleration ratio
   * e.g., 1.0 means avoid deceleration stays the same
   */
  avoidMaxDec: number;
}

/**
 * Default Full Load ratios used throughout the application.
 * These values represent the engineering specification for performance degradation
 * under full load conditions.
 */
export const DEFAULT_FULL_LOAD_RATIOS: FullLoadRatios = {
  maxSpeed: 0.8,
  maxAcceleration: 0.4,
  maxDeceleration: 0.5,
  avoidMaxDec: 1.0
};

/**
 * §DEPRECATED: Use SchemaDefaults.ts instead
 *
 * This file previously contained hardcoded defaults like:
 *   length: 1200, width: 800, height: 0
 *   offsets: { head: 600, tail: 600, left: 400, right: 400 }
 *
 * These values have been migrated to:
 *   1. XML Schema: specifications/ModuleLibrary/Aggregated/PrivateAttributes.xml
 *   2. JSON Schema: src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/.../PrivateAttribute.json
 *   3. Loader: src/store/SchemaDefaults.ts
 *
 * RATIONALE:
 *   - XML Schema defines: length=100, width=100, height=100 (not 1200x800)
 *   - The 1200x800 values were UI convenience, not schema defaults
 *   - UI defaults should be set in the component layer, not the data layer
 *
 * For schema-driven defaults, use:
 *   import { getChassisSchemaDefaults } from './SchemaDefaults';
 *   const defaults = getChassisSchemaDefaults('STANDARD_DIFF');
 *   // Returns: { shape: { length: 100, width: 100, height: 100 }, ... }
 *
 * @deprecated This entire constant will be removed in a future version
 */
export const LEGACY_CHASSIS_DEFAULT_VALUES = {
  // Shape dimensions - NOTE: These are NOT schema defaults
  length: 1200,  // ← UI convenience, schema default is 100
  width: 800,    // ← UI convenience, schema default is 100
  height: 0,     // ← NOT in schema, should be 100

  // Motion center offsets - NOTE: Schema default is 0, not 600/400
  offsets: {
    head: 600,  // ← UI convenience, schema default is 0
    tail: 600,  // ← UI convenience, schema default is 0
    left: 400,  // ← UI convenience, schema default is 0
    right: 400  // ← UI convenience, schema default is 0
  },

  // Performance defaults - OK as they are UX defaults
  performance: {
    maxSpeed: 600,
    maxAcceleration: 200,
    maxDeceleration: 200
  }
} as const;

// Type guard for migration (helps identify usages during refactor)
export function isLegacyDefault(value: any): boolean {
  // If caller is using the old 1200x800 values, they need to migrate
  return value === LEGACY_CHASSIS_DEFAULT_VALUES ||
         value?.length === 1200 ||
         value?.width === 800 ||
         value?.offsets?.head === 600;
}

/**
 * Default fallback ratio for Full Load performance calculations
 * RULE: When Full Load value is MISSING in file, use ratio * Idle value
 * DEFAULT RATIO: 1.0 (keep unchanged) - files should explicitly define their values
 * §C003-FIX: Changed from 0.8 to 1.0 - data must come from file, not calculated
 */
export const FULL_LOAD_FALLBACK_RATIO = 1.0;

/**
 * Sync mode detection thresholds
 * When loaded value differs from calculated value by more than threshold,
 * use independent mode (syncFullLoad = false)
 */
export const SYNC_MODE_THRESHOLD = 0.05; // 5% tolerance

/**
 * Detect if chassis should use independent Full Load values
 * based on actual file data vs calculated defaults
 * @returns true = sync mode (use calculated), false = independent mode (use file value)
 */
export function detectSyncMode(
  idleValue: number,
  fullValue: number,
  expectedRatio: number = DEFAULT_FULL_LOAD_RATIOS.maxSpeed
): boolean {
  if (fullValue === undefined || fullValue === null || isNaN(fullValue)) {
    return true; // sync mode (use calculated)
  }
  const calculated = idleValue * expectedRatio;
  const diff = Math.abs(fullValue - calculated) / calculated;
  return diff < SYNC_MODE_THRESHOLD; // true = sync, false = independent
}

/**
 * Calculate Full Load value from Idle value using the appropriate ratio.
 * Centralized calculation to ensure consistency across the application.
 *
 * @param idleValue The performance value at Idle state
 * @param ratioType Which ratio to apply
 * @param ratios Optional custom ratios (defaults to DEFAULT_FULL_LOAD_RATIOS)
 * @returns Calculated Full Load value
 * @deprecated Use file values directly when available. This is only for sync mode.
 */
export function calculateFullLoadValue(
  idleValue: number,
  ratioType: keyof FullLoadRatios,
  ratios: FullLoadRatios = DEFAULT_FULL_LOAD_RATIOS
): number {
  if (idleValue === undefined || idleValue === null || isNaN(idleValue)) {
    return (LEGACY_CHASSIS_DEFAULT_VALUES.performance as Partial<Record<keyof FullLoadRatios, number>>)[ratioType] ?? 0;
  }
  return Math.round(idleValue * ratios[ratioType]);
}

/**
 * §C003-FIX: New function to get Full Load value
 * Priority:
 * 1. Use file value if available
 * 2. Use calculated value only if sync mode is enabled
 * 3. Fallback ratio 1.0 (unchanged) if no other data
 */
export function getFullLoadValue(
  idleValue: number,
  fullValue: number | undefined,
  syncMode: boolean,
  ratio: number = FULL_LOAD_FALLBACK_RATIO
): number {
  // Rule: Data from file takes priority
  if (fullValue !== undefined && fullValue !== null && !isNaN(fullValue)) {
    return fullValue;
  }

  // Rule: If sync mode and we have idle value, calculate
  if (syncMode && idleValue !== undefined && idleValue !== null && !isNaN(idleValue)) {
    return Math.round(idleValue * ratio);
  }

  // Fallback: return 0 or error
  return 0;
}
