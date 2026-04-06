import * as fs from 'fs';
import { ImportService } from './ImportService.js';
import { ExportService } from './ExportService.js';

console.log('═══════════════════════════════════════════════════════════════════');
console.log('Ability 数据流深度诊断');
console.log('═══════════════════════════════════════════════════════════════════\n');

// 加载测试数据
const data = JSON.parse(fs.readFileSync('../CompDesc.json', 'utf-8'));

console.log('【STEP 1】原始文件中的 Ability 结构');
console.log('───────────────────────────────────────────────────────────────────');

const funcAbilities = data.functionAbility || data.function_ability || [];
console.log(`Function abilities: ${funcAbilities.length}`);

if (funcAbilities.length > 0) {
  const firstFunc = funcAbilities[0];
  console.log(`\nFirst ability: ${firstFunc.type} - ${firstFunc.desc}`);
  console.log(`Child functions: ${firstFunc.childFunction?.length || 0}`);
}

console.log('\n【STEP 2】Import 后检查');
console.log('───────────────────────────────────────────────────────────────────');

const imported = ImportService.parseCompDesc(data);
const abilities = imported.abilities;

console.log('Imported abilities:');
console.log(`  version: ${abilities?.version}`);
console.log(`  functionAbility count: ${abilities?.functionAbility?.length || 0}`);

if (abilities?.functionAbility?.[0]) {
  const func = abilities.functionAbility[0];
  console.log(`\nFirst imported ability: ${func.type}`);
  console.log(`  Has childFunction: ${!!func.childFunction}`);
  console.log(`  childFunction length: ${func.childFunction?.length || 0}`);
}

console.log('\n【STEP 3】Export 后检查');
console.log('───────────────────────────────────────────────────────────────────');

// 构建完整配置
const fullConfig = {
  ...imported,
  id: 'test',
  name: 'Test',
  description: '',
  identity: imported.identity || {},
  components: imported.components || [],
  abilities: imported.abilities || { version: 'V1.0', functionAbility: [] },
  selectedComponentId: null,
  validationErrors: []
};

const exported = ExportService.exportToCModel(fullConfig);

console.log('Has functionAbility:', 'functionAbility' in exported);
console.log('functionAbility type:', typeof exported.functionAbility);
console.log('functionAbility:', exported.functionAbility);

if (exported.functionAbility?.[0]) {
  const func = exported.functionAbility[0];
  console.log(`\nFirst ability keys: ${Object.keys(func).join(', ')}`);
  console.log(`Has desc: ${'desc' in func}`);
  console.log(`desc value: ${func.desc}`);

  if (func.childFunction?.[0]) {
    const child = func.childFunction[0];
    console.log(`\nFirst child keys: ${Object.keys(child).join(', ')}`);
    console.log(`  key: ${child.key}`);
    console.log(`  desc: ${child.desc}`);
    console.log(`  Has tips: ${'tips' in child}`);
    console.log(`  Has attr: ${'attr' in child}`);

    if (child.attr?.[0]) {
      const attr = child.attr[0];
      console.log(`\n  First attr:`);
      console.log(`    key: ${attr.key}`);
      console.log(`    type: ${attr.type}`);
      console.log(`    Has desc: ${'desc' in attr}`);
    }
  }
}

console.log('\n【STEP 4】数据丢失检测');
console.log('───────────────────────────────────────────────────────────────────');

const issues = [];

// 比较原始和导出
if (funcAbilities.length > 0) {
  const original = funcAbilities[0];
  const exportedFirst = exported.functionAbility?.[0];

  if (!exportedFirst) {
    issues.push('Missing first functionAbility');
  } else {
    if (exportedFirst.desc !== original.desc) {
      issues.push(`desc mismatch: "${original.desc}" vs "${exportedFirst.desc}"`);
    }

    const origChildCount = original.childFunction?.length || 0;
    const exportedChildCount = exportedFirst.childFunction?.length || 0;
    if (origChildCount !== exportedChildCount) {
      issues.push(`Child count mismatch: ${origChildCount} vs ${exportedChildCount}`);
    }
  }
}

if (issues.length > 0) {
  console.log('❌ ISSUES:');
  issues.forEach(i => console.log(`  - ${i}`));
} else {
  console.log('✅ No obvious issues');
}

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('诊断完成');
console.log('═══════════════════════════════════════════════════════════════════');
