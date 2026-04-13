/**
 * Task #40: Round-Trip 数据对比测试套件
 *
 * 该测试验证 Import → Modify → Export → Compare 的数据完整性
 * 使用 AOBO.cmodel555.cmodel 作为验证基准
 */

import { expect, describe, it, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Import services (would be from actual source in real test)
import { ImportService } from '../src/frontend/src/store/ImportService';
import { ExportService } from '../src/frontend/src/services/ExportService';
import type { RobotConfig } from '../src/frontend/src/store/types';

const AOBO_PATH = '~/Downloads/AOBO.cmodel555.cmodel';

describe('§TASK40: Round-Trip Data Integrity', () => {
  let originalConfig: RobotConfig;
  let exportedData: any;
  let reimportedConfig: RobotConfig;

  beforeAll(async () => {
    // Phase 1: Import original AOBO file
    const cmodelData = await loadCModel(AOBO_PATH);
    originalConfig = ImportService.parseCompDesc(cmodelData);

    // Phase 2: Export
    exportedData = ExportService.exportToCModel(originalConfig);

    // Phase 3: Re-import
    reimportedConfig = ImportService.parseCompDesc(exportedData);
  });

  describe('Identity Fields Preservation', () => {
    it('should preserve maxSpeed(Idle) = 1200', () => {
      expect(originalConfig.identity.maxSpeed).toEqual(1200);
      expect(reimportedConfig.identity.maxSpeed).toEqual(1200);
    });

    it('should preserve maxSpeed (Full Load) = 1000 (not 960)', () => {
      // Critical: The file has 1000, not calculated 960
      expect(originalConfig.identity.maxSpeedFull).toEqual(1000);
      expect(exportedData.maxSpeedFull).toEqual(1000);

      // Verify it's NOT the calculated value
      expect(exportedData.maxSpeedFull).not.toEqual(960);
      expect(exportedData.maxSpeedFull).not.toEqual(Math.round(1200 * 0.8));
    });

    it('should preserve maxAccel with correct ratio (Idle=500, Full=500)', () => {
      expect(originalConfig.identity.maxAccel).toEqual(500);
      expect(originalConfig.identity.maxAccelFull).toEqual(500);
      expect(reimportedConfig.identity.maxAccelFull).toEqual(500);
    });
  });

  describe('Offset Fields Preservation', () => {
    it('should preserve Idle offsets', () => {
      const offsets = ['headOffset', 'tailOffset', 'leftOffset', 'rightOffset'];
      offsets.forEach(field => {
        expect(originalConfig.identity[field as keyof typeof originalConfig.identity])
          .toEqual(reimportedConfig.identity[field as keyof typeof reimportedConfig.identity]);
      });
    });

    it('should preserve Full Load offsets', () => {
      const fullOffsets = ['headOffsetFull', 'tailOffsetFull', 'leftOffsetFull', 'rightOffsetFull'];
      fullOffsets.forEach(field => {
        expect(originalConfig.identity[field as keyof typeof originalConfig.identity])
          .toEqual(reimportedConfig.identity[field as keyof typeof reimportedConfig.identity]);
      });
    });
  });

  describe('§CRITICAL: No Partial Export/Import', () => {
    it('should export all RobotIdentity fields', () => {
      const exportedKeys = Object.keys(exportedData);
      const requiredFields = [
        'chassisLength', 'chassisWidth', 'chassisHeight',
        'headOffset', 'tailOffset', 'leftOffset', 'rightOffset',
        'headOffsetFull', 'tailOffsetFull', 'leftOffsetFull', 'rightOffsetFull',
        'maxSpeed', 'maxSpeedFull', 'maxAccel', 'maxAccelFull',
        'maxDecel', 'maxDecelFull', 'avoidMaxDec', 'avoidMaxDecFull',
        'rotateMaxAngSpeed', 'rotateMaxAngAcceleration'
      ];

      requiredFields.forEach(field => {
        expect(exportedKeys).toContain(field);
      });
    });

    it('should validate export integrity', () => {
      const warnings: string[] = [];
      // @ts-ignore - internal method
      const isValid = ExportService['validateExport'](originalConfig.identity, warnings);

      expect(isValid).toBe(true);
      expect(warnings.filter(w => w.includes('MISSING'))).toHaveLength(0);
    });
  });

  describe('§COMPLIANCE: Apply §NO_HARDCODE', () => {
    it('should use file value not calculated value when available', () => {
      // This tests Task #37 fix
      const idle = originalConfig.identity.maxSpeed;
      const full = originalConfig.identity.maxSpeedFull;

      // AOBO has defined 1000 explicitly
      expect(full).toEqual(1000);

      // If it were calculated (idle * 0.8), it would be 960
      const calculated = Math.round(idle * 0.8);
      expect(full).not.toEqual(calculated);
    });

    it('should export the actual file-defined ratio', () => {
      const idle = exportedData.maxSpeed;
      const full = exportedData.maxSpeedFull;
      const actualRatio = full / idle;

      // AOBO uses ~0.83 (1000/1200), not exactly 0.8
      expect(actualRatio).toBeCloseTo(0.8333, 2);
    });
  });
});

async function loadCModel(filePath: string): Promise<any> {
  // Simplified: In real test, would use proper CModel deserializer
  const expandedPath = filePath.replace('~', process.env.HOME || '');
  const data = fs.readFileSync(expandedPath, 'utf-8');
  return JSON.parse(data);
}
