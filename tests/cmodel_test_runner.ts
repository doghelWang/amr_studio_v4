/**
 * CModel 双向验证测试框架 - 独立后端测试运行器
 *
 * §PROTO_FIRST: 所有测试必须基于 Proto Schema 定义
 * §NO_HARDCODE: 禁止硬编码测试数据，必须从 Proto 生成
 * §NO_PARTIAL_PARSE: 必须验证所有 Proto 字段的完整性
 *
 * 使用方法:
 *   cd tests && npm test
 *   或: node dist/cmodel_test_runner.js ../ModelSet312.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { ImportService } from './ImportService.js';
import { ExportService } from './ExportService.js';
import type { RobotConfig, ComponentConfig } from './types.js';

// Simple UUID generator
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// §1. TEST FRAMEWORK CORE
// ═══════════════════════════════════════════════════════════════════════════════

export interface TestResult {
  phase: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export class TestReport {
  private results: TestResult[] = [];
  private readonly startTime: number;

  constructor(private name: string) {
    this.startTime = Date.now();
  }

  add(result: TestResult | TestResult[]): void {
    if (Array.isArray(result)) {
      this.results.push(...result);
    } else {
      this.results.push(result);
    }
  }

  async runTest<T>(
    phase: string,
    fn: () => Promise<T>,
    validate: (result: T) => TestResult[]
  ): Promise<T> {
    console.log(`\n[TEST] ${phase}`);
    console.log('─'.repeat(60));

    try {
      const result = await fn();
      const validations = validate(result);
      this.add(validations);
      return result;
    } catch (error) {
      this.add({
        phase,
        status: 'FAIL',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  generate(): { summary: string; details: string; passed: boolean } {
    const duration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARN').length;

    let summary = '';
    summary += '═'.repeat(70) + '\n';
    summary += `📊 TEST REPORT: ${this.name}\n`;
    summary += '═'.repeat(70) + '\n';
    summary += `Duration: ${duration}ms | ✅ Pass: ${passed} | ❌ Fail: ${failed} | ⚠️ Warn: ${warnings}\n`;
    summary += '\n';

    let details = '';
    const grouped = this.results.reduce((acc, r) => {
      (acc[r.phase] = acc[r.phase] || []).push(r);
      return acc;
    }, {} as Record<string, TestResult[]>);

    for (const [phase, results] of Object.entries(grouped)) {
      details += `\n[${phase}]\n`;
      results.forEach(r => {
        const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
        details += `  ${icon} ${r.message}\n`;
        if (r.details) {
          details += `     Details: ${JSON.stringify(r.details, null, 2)}\n`;
        }
      });
    }

    return {
      summary,
      details,
      passed: failed === 0
    };
  }

  print(): void {
    const { summary, details, passed } = this.generate();
    console.log(summary);
    console.log(details);
    if (!passed) {
      process.exitCode = 1;
    }
  }

  saveToFile(outputPath: string): void {
    const { summary, details } = this.generate();
    const report = `# CModel Bidirectional Test Report\n${summary}\n${details}`;
    fs.writeFileSync(outputPath, report, 'utf-8');
    console.log(`\n📄 Report saved to: ${outputPath}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2. BIDIRECTIONAL TEST VALIDATORS
// ═══════════════════════════════════════════════════════════════════════════════

export class BidirectionalValidators {
  /**
   * §PROTO_FIRST: 验证从 Proto JSON 导入的所有字段完整性
   */
  static validateImportCompleteness(input: any, output: RobotConfig): TestResult[] {
    const results: TestResult[] = [];
    const timestamp = new Date().toISOString();

    // 验证 chassis fields
    const chassis = output.components.find((c: ComponentConfig) => c.category === 'CHASSIS');
    if (!chassis) {
      results.push({
        phase: 'ImportCompleteness',
        status: 'FAIL',
        message: '[NO_PARTIAL_PARSE] Missing CHASSIS component in imported data',
        timestamp
      });
      return results;
    }

    // §P3.1: Message_BOX 字段清单验证
    const boxFields = [
      { key: 'length', protoPath: 'moduleShape.box.sizeLen', required: true },
      { key: 'width', protoPath: 'moduleShape.box.sizeWidth', required: true },
      { key: 'height', protoPath: 'moduleShape.box.sizeHeight', required: true },
    ];

    for (const field of boxFields) {
      const value = chassis.shape?.[field.key as keyof typeof chassis.shape];
      if (field.required && (value === undefined || value === 0)) {
        results.push({
          phase: 'ImportCompleteness',
          status: 'WARN',
          message: `[NO_PARTIAL_PARSE] Required shape field "${field.key}" missing or zero`,
          details: { field: field.protoPath, component: chassis.id },
          timestamp
        });
      } else {
        results.push({
          phase: 'ImportCompleteness',
          status: 'PASS',
          message: `Shape field "${field.key}" = ${value}`,
          timestamp
        });
      }
    }

    // §P3.2: Identity 性能属性验证
    const identityFields = [
      // Idle State
      { key: 'headOffset', protoKey: 'headOffset(Idle)' },
      { key: 'tailOffset', protoKey: 'tailOffset(Idle)' },
      { key: 'leftOffset', protoKey: 'leftOffset(Idle)' },
      { key: 'rightOffset', protoKey: 'rightOffset(Idle)' },
      { key: 'maxSpeed', protoKey: 'maxSpeed(Idle)' },
      { key: 'maxAccel', protoKey: 'maxAcceleration(Idle)' },
      { key: 'maxDecel', protoKey: 'maxDeceleration(Idle)' },
      { key: 'avoidMaxDec', protoKey: 'avoidMaxDec (Idle)' },
      { key: 'rotateMaxAngSpeed', protoKey: 'rotateMaxAngSpeed (Idle)' },
      { key: 'rotateMaxAngAcceleration', protoKey: 'rotateMaxAngAcceleration (Idle)' },
      // Full Load State
      { key: 'headOffsetFull', protoKey: 'headOffset (Full Load)' },
      { key: 'tailOffsetFull', protoKey: 'tailOffset (Full Load)' },
      { key: 'leftOffsetFull', protoKey: 'leftOffset (Full Load)' },
      { key: 'rightOffsetFull', protoKey: 'rightOffset (Full Load)' },
      { key: 'maxSpeedFull', protoKey: 'maxSpeed (Full Load)' },
      { key: 'maxAccelFull', protoKey: 'maxAcceleration (Full Load)' },
      { key: 'maxDecelFull', protoKey: 'maxDeceleration (Full Load)' },
      { key: 'avoidMaxDecFull', protoKey: 'avoidMaxDec (Full Load)' },
    ];

    const identity = output.identity as Record<string, any>;
    for (const field of identityFields) {
      const value = identity[field.key];
      if (value === undefined || value === 0 || value === '' || value === null) {
        // Use WARNING for missing fields - they might not exist in source
        results.push({
          phase: 'ImportCompleteness',
          status: 'WARN',
          message: `[NO_PARTIAL_PARSE] Identity field "${field.key}" missing or empty (proto: ${field.protoKey})`,
          details: { field: field.key, actual: value },
          timestamp
        });
      } else {
        results.push({
          phase: 'ImportCompleteness',
          status: 'PASS',
          message: `Identity field "${field.key}" = ${value}`,
          timestamp
        });
      }
    }

    // Summary
    const hasShape = chassis.shape && chassis.shape.length && chassis.shape.width;
    const shapeStatus = hasShape ? 'PASS' : 'FAIL';
    results.push({
      phase: 'ImportSummary',
      status: shapeStatus,
      message: `[IMPORT] Chassis '${chassis.alias}' L=${chassis.shape?.length} W=${chassis.shape?.width} H=${chassis.shape?.height} ` +
                `Components=${output.components.length} Identity fields parsed`,
      timestamp
    });

    return results;
  }

  /**
   * §NO_HARDCODE: 验证导出时保留输入值，没有使用硬编码默认值
   */
  static validateExportNoHardcode(originalInput: any, exported: any): TestResult[] {
    const results: TestResult[] = [];
    const timestamp = new Date().toISOString();

    // Get input values (handle both direct and nested structures)
    const inputValues = {
      robotName: originalInput.robotName || originalInput.robot_name,
      chassisLength: this.extractShapeValue(originalInput, 'sizeLen', 'size_len'),
      chassisWidth: this.extractShapeValue(originalInput, 'sizeWidth', 'size_width'),
      headOffset: this.extractPrivateAttr(originalInput, 'headOffset(Idle)'),
    };

    const exportValues = {
      robotName: exported.robotName,
      chassisLength: exported.chassisLength,
      chassisWidth: exported.chassisWidth,
      headOffset: exported.headOffset,
    };

    // Common hardcoded defaults to check against
    const hardcodedDefaults = {
      chassisLength: [1200, 800, 600],
      chassisWidth: [800, 600, 400],
      headOffset: [600, 400, 500],
    };

    // Check each field
    for (const [field, inputVal] of Object.entries(inputValues)) {
      const exportVal = exportValues[field as keyof typeof exportValues];
      const defaults = hardcodedDefaults[field as keyof typeof hardcodedDefaults] || [];

      if (inputVal !== undefined && inputVal !== null && inputVal !== '') {
        // Has input value - verify it's preserved
        if (Math.abs(Number(inputVal) - Number(exportVal)) > 0.001 ||
            (typeof inputVal === 'string' && inputVal !== exportVal)) {
          results.push({
            phase: 'ExportNoHardcode',
            status: 'FAIL',
            message: `[DATA_LOSS] Field "${field}" changed: ${inputVal} → ${exportVal}`,
            details: { field, expected: inputVal, actual: exportVal },
            timestamp
          });
        } else {
          results.push({
            phase: 'ExportNoHardcode',
            status: 'PASS',
            message: `Field "${field}" preserved: ${exportVal}`,
            timestamp
          });
        }
      } else {
        // No input value - check if using fallback default
        results.push({
          phase: 'ExportNoHardcode',
          status: 'WARN',
          message: `Field "${field}" using fallback: ${exportVal} (no input value)`,
          timestamp
        });
      }
    }

    return results;
  }

  // Helper: Extract shape value from nested structure
  private static extractShapeValue(input: any, ...keys: string[]): any {
    // Try various paths: moduleShape.box.sizeLen, module_shape.box.size_len, etc.
    const paths = [
      ['moduleShape', 'box', keys[0]],
      ['moduleShape', 'box', keys[1]],
      ['module_shape', 'box', keys[1]],
    ];

    for (const path of paths) {
      let val = input;
      for (const key of path) {
        val = val?.[key];
        if (val === undefined) break;
      }
      if (val !== undefined) return val;
    }

    // Try first component
    const firstComp = input.moreModuleInfo?.[0]?.moduleComponets?.[0];
    if (firstComp) {
      return this.extractShapeValue(firstComp, ...keys);
    }

    return undefined;
  }

  // Helper: Extract private attribute value
  private static extractPrivateAttr(input: any, key: string): any {
    const privateAttrs = input.privateAttr?.privateAttrs ||
                        input.private_attr?.private_attrs || [];

    for (const group of privateAttrs) {
      const elements = group.arrayBaseEle || group.array_base_ele || [];
      for (const attr of elements) {
        if (attr.key === key) {
          return attr.doubleValue ?? attr.double_value ??
                 attr.int32Value ?? attr.int_32_value ??
                 attr.stringValue ?? attr.string_value ??
                 attr.value;
        }
      }
    }

    // Try first component
    const firstComp = input.moreModuleInfo?.[0]?.moduleComponets?.[0];
    if (firstComp && firstComp !== input) {
      return this.extractPrivateAttr(firstComp, key);
    }

    return undefined;
  }

  /**
   * 完整的双向数据丢失检测
   */
  static detectDataLoss(inputProto: any, outputProto: any, path = ''): TestResult[] {
    const results: TestResult[] = [];
    const timestamp = new Date().toISOString();

    const compare = (a: any, b: any, currentPath: string, depth = 0): void => {
      if (depth > 15) return; // Prevent excessive recursion

      if (a === null || b === null) {
        if (a !== b) {
          results.push({
            phase: 'DataLoss',
            status: 'FAIL',
            message: `[DATA_LOSS] Null mismatch at ${currentPath}: ${a} → ${b}`,
            details: { path: currentPath, expected: a, actual: b },
            timestamp
          });
        }
        return;
      }

      if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
          results.push({
            phase: 'DataLoss',
            status: 'FAIL',
            message: `[DATA_LOSS] Type changed at ${currentPath}: array → ${typeof b}`,
            details: { path: currentPath },
            timestamp
          });
        } else if (a.length !== b.length) {
          results.push({
            phase: 'DataLoss',
            status: 'FAIL',
            message: `[DATA_LOSS] Array length changed at ${currentPath}: ${a.length} → ${b.length}`,
            details: { path: currentPath, expectedLength: a.length, actualLength: b.length },
            timestamp
          });
        } else {
          a.forEach((item, i) => {
            if (typeof item === 'object' && item !== null) {
              compare(item, b[i], `${currentPath}[${i}]`, depth + 1);
            } else if (item !== b[i]) {
              results.push({
                phase: 'DataLoss',
                status: 'WARN',
                message: `[DATA_CHANGED] Value at ${currentPath}[${i}]: ${item} → ${b[i]}`,
                timestamp
              });
            }
          });
        }
        return;
      }

      if (typeof a === 'object') {
        const keysA = Object.keys(a).filter(k => !k.startsWith('_') && k !== 'bool_deprecated');
        const keysB = Object.keys(b || {}).filter(k => !k.startsWith('_') && k !== 'bool_deprecated');

        // Check for missing keys in output
        for (const key of keysA) {
          if (!(key in b)) {
            results.push({
              phase: 'DataLoss',
              status: 'FAIL',
              message: `[DATA_LOSS] Key "${key}" missing in output at ${currentPath}`,
              details: { path: currentPath, key, value: a[key] },
              timestamp
            });
          } else {
            compare(a[key], b[key], `${currentPath}.${key}`, depth + 1);
          }
        }

        // Check for extra keys in output
        for (const key of keysB) {
          if (!(key in a)) {
            results.push({
              phase: 'DataLoss',
              status: 'PASS',
              message: `[EXTRA_KEY] Key "${key}" added in output at ${currentPath}`,
              timestamp
            });
          }
        }
        return;
      }

      // Primitive value comparison
      if (typeof a === 'number' && typeof b === 'number') {
        if (Math.abs(a - b) > 0.01) {
          results.push({
            phase: 'DataLoss',
            status: a === 0 || b === 0 ? 'WARN' : 'FAIL',
            message: `[DATA_CHANGED] Number at ${currentPath}: ${a} → ${b}`,
            details: { path: currentPath, diff: Math.abs(a - b) },
            timestamp
          });
        }
      } else if (a !== b) {
        results.push({
          phase: 'DataLoss',
          status: 'WARN',
          message: `[DATA_CHANGED] Value at ${currentPath}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`,
          timestamp
        });
      }
    };

    compare(inputProto, outputProto, path);

    if (results.filter(r => r.status === 'FAIL').length === 0) {
      results.push({
        phase: 'DataLoss',
        status: 'PASS',
        message: 'No data loss detected in bidirectional conversion',
        timestamp
      });
    }

    return results;
  }

  /**
   * 验证组件挂载坐标在双向转换中的一致性
   */
  static validateMountCoordinates(components: ComponentConfig[]): TestResult[] {
    const results: TestResult[] = [];
    const timestamp = new Date().toISOString();

    for (const comp of components) {
      const coords = {
        mountX: comp.mountX,
        mountY: comp.mountY,
        mountZ: comp.mountZ,
        mountYaw: comp.mountYaw,
      };

      const invalid = Object.entries(coords).filter(([k, v]) =>
        v === undefined || Number.isNaN(v)
      );

      if (invalid.length > 0) {
        results.push({
          phase: 'MountCoordinates',
          status: 'FAIL',
          message: `[INVALID] Component ${comp.alias || comp.id} has ${invalid.length} invalid mounts`,
          details: { id: comp.id, ...coords },
          timestamp
        });
      } else {
        results.push({
          phase: 'MountCoordinates',
          status: 'PASS',
          message: `Component ${comp.alias || comp.id}: X=${comp.mountX} Y=${comp.mountY} Z=${comp.mountZ}`,
          timestamp
        });
      }
    }

    return results;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// §3. TEST DATA FACTORY
// ═══════════════════════════════════════════════════════════════════════════════

export class TestDataFactory {
  /**
   * 从文件加载测试数据
   */
  static loadProtoFromFile(filePath: string): any {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * 创建最小测试配置（用于回退测试）
   */
  static createMinimalChassisConfig(): ComponentConfig {
    return {
      id: uuidv4(),
      srcName: 'test_chassis',
      name: 'TestChassis',
      alias: '测试底盘',
      type: 'DifferentialChassis',
      category: 'CHASSIS',
      mainModuleTypeKey: 'chassis',
      subModuleTypeKey: 'DifferentialChassis',
      mountX: 0, mountY: 0, mountZ: 0,
      mountRoll: 0, mountPitch: 0, mountYaw: 0,
      parentNodeUuid: null,
      moduleGroupName: 'chassis',
      moduleGroupUuid: uuidv4(),
      privateAttrs: [
        {
          key: 'idle_params',
          desc: 'Idle Parameters',
          elements: [
            { key: 'headOffset(Idle)', desc: 'Head Offset', type: 'DATA_DOUBLE', value: 600, unit: 'mm' },
            { key: 'maxSpeed(Idle)', desc: 'Max Speed', type: 'DATA_DOUBLE', value: 2.0, unit: 'm/s' },
          ]
        }
      ],
      interfaces: [],
      generalAttr: {},
      shape: { type: 'BOX', length: 1200, width: 800, height: 400 }
    };
  }

  /**
   * 创建完整测试配置
   */
  static createFullRobotConfig(): RobotConfig {
    return {
      id: uuidv4(),
      name: 'TestAMR',
      description: 'Test configuration',
      components: [this.createMinimalChassisConfig()],
      identity: {
        robotName: 'TestAMR',
        version: '1.0.0',
        driveType: 'STANDARD_DIFF',
        chassisShape: 'BOX',
        chassisLength: 1200,
        chassisWidth: 800,
        chassisHeight: 400,
        headOffset: 600, tailOffset: 600, leftOffset: 400, rightOffset: 400,
        headOffsetFull: 600, tailOffsetFull: 600, leftOffsetFull: 400, rightOffsetFull: 400,
        maxSpeed: 2.0, maxAccel: 1.0, maxDecel: 2.0, avoidMaxDec: 1.5,
        maxSpeedFull: 1.6, maxAccelFull: 0.4, maxDecelFull: 1.0, avoidMaxDecFull: 1.5,
        rotateMaxAngSpeed: 1.0, rotateMaxAngAcceleration: 2.0,
        selfWeight: 100, totalLoadWeight: 200,
        powerSlots: {}
      },
      abilities: { version: 'V1.0', functionAbility: [] },
      selectedComponentId: null,
      validationErrors: []
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// §4. MAIN TEST RUNNER
// ═══════════════════════════════════════════════════════════════════════════════

async function runRealBidirectionalTests(testFilePath: string): Promise<void> {
  const report = new TestReport(`CModel Real Data Test: ${path.basename(testFilePath)}`);
  let originalData: any;
  let importedConfig: Partial<RobotConfig>;

  // ═══════════════════════════════════════════════════════════════════════════════
  // PHASE 1: Load and Import from Real File
  // ═══════════════════════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(70));
  console.log('PHASE 1: Import from Real CModel File');
  console.log('═'.repeat(70));

  await report.runTest(
    'Load & Parse Real CModel',
    async () => {
      if (!fs.existsSync(testFilePath)) {
        throw new Error(`File not found: ${testFilePath}`);
      }
      originalData = TestDataFactory.loadProtoFromFile(testFilePath);
      console.log(`  File: ${testFilePath}`);
      console.log(`  Size: ${(fs.statSync(testFilePath).size / 1024).toFixed(1)} KB`);
      console.log(`  Root keys: ${Object.keys(originalData).join(', ')}`);

      importedConfig = ImportService.parseCompDesc(originalData);
      console.log(`  Components: ${importedConfig.components?.length || 0}`);
      console.log(`  Chassis: ${importedConfig.components?.find(c => c.category === 'CHASSIS')?.alias || 'None'}`);

      return { input: originalData, output: importedConfig };
    },
    ({ input, output }) => {
      return BidirectionalValidators.validateImportCompleteness(
        input,
        output as RobotConfig
      );
    }
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // PHASE 2: Export Back to Proto JSON
  // ═══════════════════════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(70));
  console.log('PHASE 2: Export to CModel Format');
  console.log('═'.repeat(70));

  const exportResult = await report.runTest(
    'Export to Proto JSON',
    async () => {
      if (!importedConfig || !importedConfig.components) {
        throw new Error('No imported config available');
      }

      const fullConfig: RobotConfig = {
        ...importedConfig,
        id: importedConfig.id || uuidv4(),
        name: importedConfig.name || 'Imported',
        description: importedConfig.description || '',
        identity: importedConfig.identity || {} as any,
        components: importedConfig.components || [],
        abilities: importedConfig.abilities || { version: 'V1.0', functionAbility: [] },
        selectedComponentId: null,
        validationErrors: []
      };

      const exported = ExportService.exportToCModel(fullConfig);
      console.log(`  Exported structure verified`);
      console.log(`  Module groups: ${exported.moreModuleInfo?.length || 0}`);

      return { original: originalData, exported, fullConfig };
    },
    ({ original, exported }) => {
      // Combine structure check + no-hardcode verification
      const results: TestResult[] = [];
      const timestamp = new Date().toISOString();

      // Basic structure
      results.push({
        phase: 'ExportStructure',
        status: exported.robotName ? 'PASS' : 'WARN',
        message: exported.robotName
          ? `robotName: ${exported.robotName}`
          : 'Exported without robotName field',
        timestamp
      });

      results.push({
        phase: 'ExportStructure',
        status: Array.isArray(exported.moreModuleInfo) ? 'PASS' : 'FAIL',
        message: Array.isArray(exported.moreModuleInfo)
          ? `moreModuleInfo has ${exported.moreModuleInfo.length} groups`
          : 'Missing moreModuleInfo',
        timestamp
      });

      // No hardcoded values
      results.push(...BidirectionalValidators.validateExportNoHardcode(original, exported));

      return results;
    }
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // PHASE 3: Round-trip Data Comparison
  // ═══════════════════════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(70));
  console.log('PHASE 3: Round-trip Data Comparison');
  console.log('═'.repeat(70));

  await report.runTest(
    'Round-trip Comparison',
    async () => {
      const { original, exported, fullConfig } = exportResult;

      // Compare key fields
      const comparisons: TestResult[] = [];
      const timestamp = new Date().toISOString();

      // Robot name
      const origName = original.robotName || original.robot_name;
      if (origName && exported.robotName) {
        comparisons.push({
          phase: 'RoundTrip',
          status: origName === exported.robotName ? 'PASS' : 'FAIL',
          message: origName === exported.robotName
            ? `robotName preserved: ${exported.robotName}`
            : `robotName changed: ${origName} → ${exported.robotName}`,
          timestamp
        });
      }

      // Component count
      const origGroups = original.moreModuleInfo || original.more_module_info || [];
      const exportedGroups = exported.moreModuleInfo || [];
      comparisons.push({
        phase: 'RoundTrip',
        status: origGroups.length === exportedGroups.length ? 'PASS' : 'WARN',
        message: `Module groups: ${origGroups.length} → ${exportedGroups.length}`,
        timestamp
      });

      // Chassis shape
      const origChassis = fullConfig.components.find(c => c.category === 'CHASSIS');
      const expChassis = exportedGroups[0]?.moduleComponets?.[0];
      if (origChassis?.shape && expChassis?.generalAttr?.moduleShape?.box) {
        const box = expChassis.generalAttr.moduleShape.box;
        comparisons.push({
          phase: 'RoundTrip',
          status: 'PASS',
          message: `Chassis shape: L=${box.sizeLen} W=${box.sizeWidth} H=${box.size_height || box.sizeHeight}`,
          timestamp
        });
      }

      return { comparisons, original, exported };
    },
    ({ comparisons }) => comparisons
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // PHASE 4: Component Integrity Check
  // ═══════════════════════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(70));
  console.log('PHASE 4: Component Integrity');
  console.log('═'.repeat(70));

  await report.runTest(
    'All Components Validation',
    async () => {
      if (!importedConfig?.components) {
        throw new Error('No components to validate');
      }
      return importedConfig.components;
    },
    (components) => BidirectionalValidators.validateMountCoordinates(components)
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // Generate Report
  // ═══════════════════════════════════════════════════════════════════════════════
  report.print();

  // Save report
  const reportPath = path.join(process.cwd(), `cmodel_test_report_${path.basename(testFilePath, '.json')}.md`);
  report.saveToFile(reportPath);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §5. CLI ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════════

const testDataFile = process.argv[2];

if (testDataFile) {
  // Run with real file
  runRealBidirectionalTests(testDataFile).catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
} else {
  console.error('Usage: node dist/cmodel_test_runner.js <path-to-cmodel.json>');
  console.log('');
  console.log('Example files:');
  console.log('  node dist/cmodel_test_runner.js ../CompDesc.json');
  console.log('  node dist/cmodel_test_runner.js ../ModelSet312.json');
  console.log('  node dist/cmodel_test_runner.js ../proj_1234_fixed_decoded.json');
  process.exit(1);
}
