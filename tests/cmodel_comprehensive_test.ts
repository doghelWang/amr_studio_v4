/**
 * 增强版 CModel 双向验证测试框架
 * 支持多格式数据、详细测试报告、预期vs实际对比
 */

import * as fs from 'fs';
import * as path from 'path';
import { ImportService } from './ImportService.js';
import { ExportService } from './ExportService.js';
import type { RobotConfig, ComponentConfig, MainModuleType } from './types.js';

// ═══════════════════════════════════════════════════════════════════════════════
// §1. TEST FRAMEWORK CORE
// ═══════════════════════════════════════════════════════════════════════════════

export interface TestAssertion {
  phase: string;
  module?: string;
  field?: string;
  status: 'PASS' | 'FAIL' | 'WARN' | 'INFO';
  expected: any;
  actual: any;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export class DetailedTestReport {
  private assertions: TestAssertion[] = [];
  private readonly startTime: number;
  private testData: {
    fileName: string;
    fileSize: number;
    format: string;
    componentCount: number;
    chassisFound: boolean;
  } | null = null;

  constructor(private name: string) {
    this.startTime = Date.now();
  }

  setTestData(data: typeof this.testData): void {
    this.testData = data;
  }

  add(assertion: TestAssertion | TestAssertion[]): void {
    if (Array.isArray(assertion)) {
      this.assertions.push(...assertion);
    } else {
      this.assertions.push(assertion);
    }
  }

  async runTest<T>(
    phase: string,
    fn: () => Promise<T>,
    validate: (result: T) => TestAssertion[]
  ): Promise<T> {
    console.log(`\n[TEST PHASE] ${phase}`);
    console.log('─'.repeat(70));

    try {
      const result = await fn();
      const validations = validate(result);
      this.add(validations);
      return result;
    } catch (error) {
      this.add({
        phase,
        status: 'FAIL',
        expected: 'No error',
        actual: error instanceof Error ? error.message : String(error),
        message: `Test threw error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  // Get summary statistics
  private getStats() {
    const byStatus = {
      PASS: this.assertions.filter(a => a.status === 'PASS').length,
      FAIL: this.assertions.filter(a => a.status === 'FAIL').length,
      WARN: this.assertions.filter(a => a.status === 'WARN').length,
      INFO: this.assertions.filter(a => a.status === 'INFO').length,
    };
    return { total: this.assertions.length, ...byStatus };
  }

  // Group assertions by module
  private getModuleResults(): Map<string, TestAssertion[]> {
    const grouped = new Map<string, TestAssertion[]>();
    for (const assertion of this.assertions) {
      const module = assertion.module || 'Global';
      if (!grouped.has(module)) {
        grouped.set(module, []);
      }
      grouped.get(module)!.push(assertion);
    }
    return grouped;
  }

  print(): void {
    const { summary, details } = this.generate();
    console.log(summary);
    console.log(details);
  }

  saveToFile(outputPath: string): void {
    const report = this.generateMarkdown();
    fs.writeFileSync(outputPath, report, 'utf-8');
    console.log(`\n📄 Detailed report saved to: ${outputPath}`);
  }

  generate(): { summary: string; details: string; passed: boolean } {
    const duration = Date.now() - this.startTime;
    const stats = this.getStats();

    let summary = '';
    summary += '═'.repeat(70) + '\n';
    summary += `📊 TEST REPORT: ${this.name}\n`;
    summary += '═'.repeat(70) + '\n';
    summary += `Duration: ${duration}ms | Total: ${stats.total}\n`;
    summary += `  ✅ PASS: ${stats.PASS} | ❌ FAIL: ${stats.FAIL} | ⚠️ WARN: ${stats.WARN} | ℹ️ INFO: ${stats.INFO}\n\n`;

    if (this.testData) {
      summary += `Test Data: ${this.testData.fileName}\n`;
      summary += `  Size: ${(this.testData.fileSize / 1024).toFixed(1)} KB\n`;
      summary += `  Format: ${this.testData.format}\n`;
      summary += `  Components: ${this.testData.componentCount}\n`;
      summary += `  Chassis: ${this.testData.chassisFound ? '✅ Found' : '❌ Missing'}\n\n`;
    }

    // Module summary
    summary += '━'.repeat(70) + '\n';
    summary += 'MODULE SUMMARY\n';
    summary += '━'.repeat(70) + '\n';

    const moduleResults = this.getModuleResults();
    for (const [module, assertions] of moduleResults) {
      const modStats = {
        PASS: assertions.filter(a => a.status === 'PASS').length,
        FAIL: assertions.filter(a => a.status === 'FAIL').length,
        WARN: assertions.filter(a => a.status === 'WARN').length,
        INFO: assertions.filter(a => a.status === 'INFO').length,
      };
      const modStatus = modStats.FAIL > 0 ? '❌' : modStats.WARN > 0 ? '⚠️' : '✅';
      summary += `${modStatus} ${module}: ${assertions.length} assertions (P:${modStats.PASS} F:${modStats.FAIL} W:${modStats.WARN} I:${modStats.INFO})\n`;
    }

    // Detailed failures
    let details = '\n';
    const failures = this.assertions.filter(a => a.status === 'FAIL');
    if (failures.length > 0) {
      details += '\n' + '━'.repeat(70) + '\n';
      details += '❌ FAILURES\n';
      details += '━'.repeat(70) + '\n';
      failures.forEach(f => {
        details += `\n[${f.phase}] ${f.module || 'Global'}${f.field ? '.' + f.field : ''}\n`;
        details += `  Expected: ${JSON.stringify(f.expected)}\n`;
        details += `  Actual:   ${JSON.stringify(f.actual)}\n`;
        details += `  Message:  ${f.message}\n`;
      });
    }

    // All assertions by module
    details += '\n' + '━'.repeat(70) + '\n';
    details += 'ALL ASSERTIONS\n';
    details += '━'.repeat(70) + '\n';

    for (const [module, assertions] of moduleResults) {
      details += `\n## ${module}\n\n`;
      details += '| Phase | Field | Status | Expected | Actual | Message |\n';
      details += '|-------|-------|--------|----------|--------|----------|\n';

      for (const a of assertions) {
        const icon = a.status === 'PASS' ? '✅' : a.status === 'FAIL' ? '❌' : a.status === 'WARN' ? '⚠️' : 'ℹ️';
        const expected = this.truncate(JSON.stringify(a.expected), 20);
        const actual = this.truncate(JSON.stringify(a.actual), 20);
        const msg = this.truncate(a.message, 30);
        const field = a.field || '-';
        details += `| ${a.phase} | ${field} | ${icon} ${a.status} | ${expected} | ${actual} | ${msg} |\n`;
      }
    }

    return {
      summary,
      details,
      passed: stats.FAIL === 0
    };
  }

  generateMarkdown(): string {
    const { summary, details } = this.generate();
    const timestamp = new Date().toISOString();

    return `# CModel Detailed Test Report

**Generated:** ${timestamp}
**Suite:** ${this.name}

---

${summary}

${details}

---

## Raw Assertion Data

\`\`\`json
${JSON.stringify(this.assertions, null, 2)}
\`\`\`
`;
  }

  private truncate(str: string, maxLen: number): string {
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen - 3) + '...';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// §2. DETAILED ASSERTION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

class SuiteAssertionBuilder {
  private assertions: TestAssertion[] = [];
  private timestamp: string = new Date().toISOString();

  assert(
    phase: string,
    module: string,
    field: string,
    status: 'PASS' | 'FAIL' | 'WARN' | 'INFO',
    expected: any,
    actual: any,
    message: string,
    details?: Record<string, any>
  ): void {
    this.assertions.push({
      phase,
      module,
      field,
      status,
      expected,
      actual,
      message,
      details,
      timestamp: this.timestamp
    });
  }

  equals<T>(
    phase: string,
    module: string,
    field: string,
    expected: T,
    actual: T,
    tolerance?: number
  ): void {
    if (typeof expected === 'number' && typeof actual === 'number' && tolerance !== undefined) {
      const match = Math.abs(expected - actual) <= tolerance;
      this.assert(
        phase,
        module,
        field,
        match ? 'PASS' : 'FAIL',
        expected,
        actual,
        match ? `${field} matches within tolerance` : `${field} differs beyond tolerance ${tolerance}`,
        tolerance ? { tolerance } : undefined
      );
    } else {
      const match = JSON.stringify(expected) === JSON.stringify(actual);
      this.assert(
        phase,
        module,
        field,
        match ? 'PASS' : 'FAIL',
        expected,
        actual,
        match ? `${field} matches` : `${field} differs`,
      );
    }
  }

  exists(phase: string, module: string, field: string, value: any): void {
    const hasValue = value !== undefined && value !== null;
    this.assert(
      phase,
      module,
      field,
      hasValue ? 'PASS' : 'FAIL',
      'exists',
      value,
      hasValue ? `${field} exists` : `${field} is ${value}`,
    );
  }

  inRange(
    phase: string,
    module: string,
    field: string,
    value: number,
    min: number,
    max: number
  ): void {
    const inRange = value >= min && value <= max;
    this.assert(
      phase,
      module,
      field,
      inRange ? 'PASS' : 'WARN',
      `${min}-${max}`,
      value,
      inRange ? `${field} in range` : `${field}=${value} out of range [${min},${max}]`,
      { min, max }
    );
  }

  warn(phase: string, module: string, field: string, expected: any, actual: any, message: string): void {
    this.assert(phase, module, field, 'WARN', expected, actual, message);
  }

  info(phase: string, module: string, field: string, value: any, message: string): void {
    this.assert(phase, module, field, 'INFO', '-', value, message);
  }

  getAssertions(): TestAssertion[] {
    return this.assertions;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// §3. COMPREHENSIVE TEST RUNNER
// ═══════════════════════════════════════════════════════════════════════════════

async function runComprehensiveBidirectionalTests(testFilePath: string): Promise<void> {
  const fileName = path.basename(testFilePath);
  const report = new DetailedTestReport(`CModel Comprehensive Test: ${fileName}`);

  console.log('\n' + '═'.repeat(70));
  console.log('CModel 双向验证测试 - 详细模式');
  console.log('Test File:', testFilePath);
  console.log('═'.repeat(70));

  // ═══════════════════════════════════════════════════════════════════════════════
  // PHASE 1: Data Loading & Format Detection
  // ═══════════════════════════════════════════════════════════════════════════════
  const loadResult = await report.runTest(
    'Data Loading',
    async () => {
      if (!fs.existsSync(testFilePath)) {
        throw new Error(`File not found: ${testFilePath}`);
      }

      const rawData = fs.readFileSync(testFilePath, 'utf-8');
      const data = JSON.parse(rawData);
      const fileSize = fs.statSync(testFilePath).size;

      // Detect format
      let format = 'unknown';
      if (data.moreModuleInfo || data.more_module_info) format = 'comp_desc';
      else if (data.groups) format = 'model_set';
      else if (Array.isArray(data)) format = 'array';

      return { data, fileSize, format, rawData };
    },
    ({ data, fileSize, format }) => {
      const builder = new SuiteAssertionBuilder();

      builder.exists('Load', 'FileSystem', 'data', data);
      builder.info('Load', 'FileSystem', 'size', fileSize, `${(fileSize/1024).toFixed(1)} KB`);

      // Format detection
      const supportedFormats = ['comp_desc', 'model_set'];
      builder.assert(
        'Load', 'Format', 'type',
        supportedFormats.includes(format) ? 'PASS' : 'WARN',
        supportedFormats,
        format,
        supportedFormats.includes(format) ? `Format: ${format}` : `Unexpected format: ${format}`
      );

      // Root structure validation
      const rootKeys = Object.keys(data);
      builder.info('Load', 'Structure', 'rootKeys', rootKeys, rootKeys.join(', '));

      // Component count detection
      let compCount = 0;
      if (data.moreModuleInfo) {
        compCount = data.moreModuleInfo.reduce((sum: number, g: any) =>
          sum + (g.moduleComponets?.length || 0), 0);
      } else if (data.groups) {
        compCount = data.groups.reduce((sum: number, g: any) =>
          sum + (g.moduleComponets?.length || g.module_componets?.length || 0), 0);
      }
      builder.info('Load', 'Structure', 'estimatedComponents', compCount, `${compCount} components estimated`);

      return builder.getAssertions();
    }
  );

  // Set test data for report
  report.setTestData({
    fileName,
    fileSize: loadResult.fileSize,
    format: loadResult.format,
    componentCount: 0,
    chassisFound: false
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // PHASE 2: Import Phase - Each Module Tested
  // ═══════════════════════════════════════════════════════════════════════════════
  const importResult = await report.runTest(
    'Import Phase',
    async () => {
      const { data } = loadResult;
      const imported = ImportService.parseCompDesc(data);
      return { data, imported };
    },
    ({ data, imported }) => {
      const builder = new SuiteAssertionBuilder();
      const timestamp = new Date().toISOString();

      // Global structure
      builder.exists('Import', 'Global', 'components', imported.components);
      builder.exists('Import', 'Global', 'identity', imported.identity);

      const compCount = imported.components?.length || 0;
      builder.info('Import', 'Global', 'componentCount', compCount, `${compCount} components imported`);

      // Update report data
      if (report['testData']) {
        report['testData'].componentCount = compCount;
      }

      // Find chassis
      const chassis = imported.components?.find(c => c.category === 'CHASSIS');
      if (report['testData']) {
        report['testData'].chassisFound = !!chassis;
      }

      // CHASSIS Module Tests
      if (chassis) {
        const chassisModule = chassis.alias || chassis.srcName || 'Chassis';

        // Shape dimensions
        const expectedShape = {
          length: data.moreModuleInfo?.[0]?.moduleComponets?.[0]?.generalAttr?.moduleShape?.box?.sizeLen,
          width: data.moreModuleInfo?.[0]?.moduleComponets?.[0]?.generalAttr?.moduleShape?.box?.sizeWidth,
          height: data.moreModuleInfo?.[0]?.moduleComponets?.[0]?.generalAttr?.moduleShape?.box?.sizeHeight,
        };

        builder.exists('Import', chassisModule, 'shape', chassis.shape);
        builder.equals('Import', chassisModule, 'shape.length', expectedShape.length || 'any', chassis.shape?.length);
        builder.equals('Import', chassisModule, 'shape.width', expectedShape.width || 'any', chassis.shape?.width);
        builder.equals('Import', chassisModule, 'shape.height', expectedShape.height || 'any', chassis.shape?.height);

        // Mount coordinates
        builder.equals('Import', chassisModule, 'mountX', 0, chassis.mountX);
        builder.equals('Import', chassisModule, 'mountY', 0, chassis.mountY);
        builder.equals('Import', chassisModule, 'mountZ', 0, chassis.mountZ);
        builder.equals('Import', chassisModule, 'mountYaw', 0, chassis.mountYaw);

        // Identity fields
        const identity = imported.identity as Record<string, any>;
        const expectedIdentity = {
          headOffset: 738,
          tailOffset: 738,
          leftOffset: 531.5,
          rightOffset: 531.5,
          maxSpeed: 800,
          maxAccel: 500,
          maxDecel: 400,
        };

        // Check each identity field with source data
        const findSourceValue = (key: string): any => {
          const privateAttrs = data.moreModuleInfo?.[0]?.moduleComponets?.[0]?.privateAttr?.privateAttrs || [];
          for (const group of privateAttrs) {
            const elements = group.arrayBaseEle || [];
            for (const attr of elements) {
              if (attr.key === key) {
                return attr.doubleValue ?? attr.double_value ?? attr.value;
              }
            }
          }
          return undefined;
        };

        for (const [field, expectedDefault] of Object.entries(expectedIdentity)) {
          const actualValue = identity[field];
          const protoKey = field.replace('maxAccel', 'maxAcceleration').replace('maxDecel', 'maxDeceleration') + '(Idle)';
          const sourceValue = findSourceValue(protoKey);

          if (sourceValue !== undefined) {
            builder.equals('Import', 'Identity', field, sourceValue, actualValue);
          } else if (actualValue !== undefined && actualValue !== 0) {
            builder.warn('Import', 'Identity', field, 'from source', actualValue, 'Using computed fallback');
          } else {
            builder.assert('Import', 'Identity', field, 'WARN', 'from source', actualValue, 'Source value not found');
          }
        }

        // Full Load variants
        const fullLoadFields = ['maxSpeedFull', 'maxAccelFull', 'maxDecelFull'];
        for (const field of fullLoadFields) {
          const actualValue = identity[field];
          const idleField = field.replace('Full', '');
          const idleValue = identity[idleField];
          const ratioField = field.replace('Full', '').replace('maxSpeed', 'maxSpeed').replace('maxAccel', 'maxAcceleration').replace('maxDecel', 'maxDeceleration');

          if (actualValue !== undefined && actualValue !== 0) {
            if (idleValue > 0) {
              const expectedRatio = actualValue / idleValue;
              builder.inRange('Import', 'Identity', field + 'Ratio', expectedRatio, 0.3, 1.0);
            }
            builder.info('Import', 'Identity', field, actualValue, 'Full load value computed');
          }
        }
      } else {
        builder.assert('Import', 'Global', 'chassis', 'FAIL', 'exists', null, 'No CHASSIS component found');
      }

      // Test all components
      for (const comp of (imported.components || [])) {
        const modName = comp.alias || comp.srcName || comp.type;

        // Basic fields
        builder.exists('Import', modName, 'id', comp.id);
        builder.exists('Import', modName, 'category', comp.category);
        builder.exists('Import', modName, 'type', comp.type);

        // Mount coordinates validity
        const validCoords = !Number.isNaN(comp.mountX) && !Number.isNaN(comp.mountY) &&
                           !Number.isNaN(comp.mountZ) && !Number.isNaN(comp.mountYaw);
        builder.assert(
          'Import', modName, 'mountCoordinates',
          validCoords ? 'PASS' : 'FAIL',
          'valid numbers',
          { x: comp.mountX, y: comp.mountY, z: comp.mountZ, yaw: comp.mountYaw },
          validCoords ? 'Mount coordinates valid' : 'Invalid mount coordinates'
        );

        // Component type specific tests
        switch (comp.category) {
          case 'DRIVEWHEEL':
            builder.inRange('Import', modName, 'mountY', comp.mountY, -1000, 1000);
            break;
          case 'SENSOR':
            builder.info('Import', modName, 'category', 'SENSOR', 'Sensor component imported');
            break;
        }
      }

      return builder.getAssertions();
    }
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // PHASE 3: Export Phase
  // ═══════════════════════════════════════════════════════════════════════════════
  const exportResult = await report.runTest(
    'Export Phase',
    async () => {
      const { imported } = importResult;

      const fullConfig: RobotConfig = {
        ...imported,
        id: imported.id || 'test-id',
        name: imported.name || 'Test',
        description: imported.description || '',
        identity: imported.identity || {} as any,
        components: imported.components || [],
        abilities: imported.abilities || { version: 'V1.0', functionAbility: [] },
        selectedComponentId: null,
        validationErrors: []
      } as RobotConfig;

      const exported = ExportService.exportToCModel(fullConfig);
      return { imported: fullConfig, exported };
    },
    ({ imported, exported }) => {
      const builder = new SuiteAssertionBuilder();

      // Structure validation
      builder.exists('Export', 'Global', 'robotName', exported.robotName);
      builder.exists('Export', 'Global', 'moreModuleInfo', exported.moreModuleInfo);

      const exportedGroups = exported.moreModuleInfo?.length || 0;
      const importedGroups = imported.components?.filter(c => !c.parentNodeUuid).length || 0;

      builder.equals('Export', 'Global', 'moduleGroupCount', importedGroups, exportedGroups);

      // Component count
      const exportedComps = exported.moreModuleInfo?.reduce(
        (sum: number, g: any) => sum + (g.moduleComponets?.length || 0), 0
      ) || 0;
      const importedComps = imported.components?.length || 0;

      builder.equals('Export', 'Global', 'componentCount', importedComps, exportedComps);

      // Ch preservation
      const importedChassis = imported.components?.find(c => c.category === 'CHASSIS');
      if (importedChassis && exported.moreModuleInfo?.[0]?.moduleComponets?.[0]) {
        const expChassis = exported.moreModuleInfo[0].moduleComponets[0];

        // Shape preservation
        const expShape = expChassis.generalAttr?.moduleShape?.box;
        if (expShape) {
          builder.equals('Export', 'Chassis', 'shape.length', importedChassis.shape?.length, expShape.sizeLen || expShape.size_len);
          builder.equals('Export', 'Chassis', 'shape.width', importedChassis.shape?.width, expShape.sizeWidth || expShape.size_width);
        }
      }

      return builder.getAssertions();
    }
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // PHASE 4: Round-trip Comparison
  // ═══════════════════════════════════════════════════════════════════════════════
  await report.runTest(
    'Round-trip',
    async () => {
      // Re-import the exported data
      const { exported, imported: originalImported } = exportResult;
      const reimported = ImportService.parseCompDesc(exported);
      return { original: originalImported, exported, reimported };
    },
    ({ original, reimported }) => {
      const builder = new SuiteAssertionBuilder();

      // Component count
      const origCount = original.components?.length || 0;
      const reimportCount = reimported.components?.length || 0;
      builder.equals('RoundTrip', 'Global', 'componentCount', origCount, reimportCount);

      // Chassis comparison
      const origCh = original.components?.find(c => c.category === 'CHASSIS');
      const reimportCh = reimported.components?.find(c => c.category === 'CHASSIS');

      if (origCh && reimportCh) {
        builder.equals('RoundTrip', 'Chassis', 'shape.length', origCh.shape?.length, reimportCh.shape?.length);
        builder.equals('RoundTrip', 'Chassis', 'shape.width', origCh.shape?.width, reimportCh.shape?.width);
        builder.equals('RoundTrip', 'Chassis', 'mountX', origCh.mountX, reimportCh.mountX);
        builder.equals('RoundTrip', 'Chassis', 'mountY', origCh.mountY, reimportCh.mountY);
      }

      // Identity comparison
      const origId = original.identity as Record<string, any>;
      const reimportId = reimported.identity as Record<string, any>;

      const keyFields = ['headOffset', 'tailOffset', 'leftOffset', 'rightOffset', 'maxSpeed'];
      for (const field of keyFields) {
        if (origId[field] !== undefined) {
          builder.equals('RoundTrip', 'Identity', field, origId[field], reimportId[field]);
        }
      }

      return builder.getAssertions();
    }
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // Generate Final Report
  // ═══════════════════════════════════════════════════════════════════════════════
  report.print();

  // Save detailed reports
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(process.cwd(), `cmodel_detailed_report_${path.basename(fileName, '.json')}_${timestamp}.md`);
  report.saveToFile(reportPath);
}

// ═══════════════════════════════════════════════════════════════════════════════
// §4. CLI ENTRY
// ═══════════════════════════════════════════════════════════════════════════════

const testFile = process.argv[2];

if (!testFile) {
  console.error('Usage: node dist/cmodel_comprehensive_test.js <path-to-cmodel.json>');
  console.log('\nExample files:');
  console.log('  node dist/cmodel_comprehensive_test.js ../CompDesc.json');
  console.log('  node dist/cmodel_comprehensive_test.js ../ModelSet312.json');
  process.exit(1);
}

runComprehensiveBidirectionalTests(testFile).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
