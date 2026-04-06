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
 * Default fallback values when Idle values are not available.
 * These are used when initializing a new chassis without existing data.
 * ⚠️ These are temporary defaults and should ideally come from Schema.
 */
export const CHASSIS_DEFAULT_VALUES = {
  // Shape dimensions
  length: 1200,
  width: 800,
  height: 0,

  // Motion center offsets (Idle state)
  offsets: {
    head: 600,
    tail: 600,
    left: 400,
    right: 400
  },

  // Performance (used when Full Load calculation has no base value)
  performance: {
    maxSpeed: 600,
    maxAcceleration: 200,
    maxDeceleration: 200
  }
};

/**
 * Calculate Full Load value from Idle value using the appropriate ratio.
 * Centralized calculation to ensure consistency across the application.
 *
 * @param idleValue The performance value at Idle state
 * @param ratioType Which ratio to apply
 * @param ratios Optional custom ratios (defaults to DEFAULT_FULL_LOAD_RATIOS)
 * @returns Calculated Full Load value
 */
export function calculateFullLoadValue(
  idleValue: number,
  ratioType: keyof FullLoadRatios,
  ratios: FullLoadRatios = DEFAULT_FULL_LOAD_RATIOS
): number {
  if (idleValue === undefined || idleValue === null || isNaN(idleValue)) {
    return CHASSIS_DEFAULT_VALUES.performance[ratioType] ?? 0;
  }
  return Math.round(idleValue * ratios[ratioType]);
}
