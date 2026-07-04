/**
 * skills/modelSplitter.ts
 * =======================
 * AMR Studio V4 Model Splitter (TypeScript 版)
 * 将 CompDesc.json 树文件拆分为 blueprint (蓝图) 和一系列独立的 modules 组件配置 JSON。
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export async function splitCompDesc(jsonPath: string, outputDir: string): Promise<void> {
  console.log(`Reading ${jsonPath}...`);
  const raw = await fs.readFile(jsonPath, 'utf-8');
  const data = JSON.parse(raw);

  await fs.mkdir(outputDir, { recursive: true });
  const modulesDir = path.join(outputDir, "modules");
  await fs.mkdir(modulesDir, { recursive: true });

  let moduleCount = 0;

  async function recurse(node: any): Promise<void> {
    if (typeof node === 'object' && node !== null) {
      // 兼容 Snake/Camel 命名法
      const compKey = "moduleComponets" in node ? "moduleComponets" : ("module_componets" in node ? "module_componets" : null);
      const infoKey = "moreModuleInfo" in node ? "moreModuleInfo" : ("more_module_info" in node ? "more_module_info" : null);

      if (compKey && Array.isArray(node[compKey])) {
        for (let i = 0; i < node[compKey].length; i++) {
          const comp = node[compKey][i];
          const gen = comp.generalAttr || comp.general_attr || {};
          const muuidObj = gen.moduleUuid || gen.module_uuid || {};
          const mnameObj = gen.moduleName || gen.module_name || {};

          const muuid = String(muuidObj.stringValue || muuidObj.string_value || `unknown_${moduleCount}`).trim();
          const mname = String(mnameObj.stringValue || mnameObj.string_value || "unknown").trim();

          const filename = `module_${mname}_${muuid}.json`;
          const filepath = path.join(modulesDir, filename);

          // 写入独立组件文件
          await fs.writeFile(filepath, JSON.stringify(comp, null, 2), 'utf-8');

          // 在蓝图中保留引用指针以实现 Lazy Loading
          node[compKey][i] = { "$ref": `modules/${filename}` };
          moduleCount++;
        }
      }

      if (infoKey && Array.isArray(node[infoKey])) {
        for (const subGroup of node[infoKey]) {
          await recurse(subGroup);
        }
      }
    }
  }

  await recurse(data);

  // 保存蓝图骨架
  const blueprintPath = path.join(outputDir, "blueprint_CompDesc.json");
  await fs.writeFile(blueprintPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Split complete. Extracted ${moduleCount} modules.`);
}
