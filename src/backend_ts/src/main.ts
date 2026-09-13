/**
 * main.ts
 * =======
 * AMR Studio V4 Backend - TypeScript 主入口
 * 服务启动在端口 8002，提供全套 CModel 编解码、拆分、沙箱同步及导出下载接口。
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as os from 'os';
import * as crypto from 'crypto';

import { schemaManager } from './core/schemaManager';
import { frontendToCompDesc, exportAbilities, CATEGORY_TO_TYPE_KEY, xmlToComponentJson } from './core/resourceAdapter';
import { MODULE_RESOURCES_DIR, BOARD_DESC_DIR, USER_SAVES_DIR } from './core/paths';
import { splitCompDesc } from './skills/modelSplitter';
import { decodeCmodel } from './skills/cmodelDecoder';
import { encodeCmodel, resolveWithFidelity } from './skills/cmodelEncoder';
import * as dataManager from './core/dataManager';

const app = express();
function getArgValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const PORT = Number(getArgValue('--port') || process.env.PORT || 8002);
const HOST = getArgValue('--host') || process.env.HOST || '0.0.0.0';


// 服务版本与编译启动元数据
const SERVICE_START_TIME = new Date().toISOString();
const BACKEND_VERSION = "1.0.1";
const BUILD_DATE = "2026-07-03";
const COMMIT_HASH = "ts_rewrite_f664";

// 配置上传临时目录
const upload = multer({ dest: os.tmpdir() });

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 挂载静态资源下载端点
app.use('/downloads', express.static(dataManager.DB_DIR));

// 1. 系统版本接口
app.get('/api/v1/system/version', (req, res) => {
  res.json({
    backendVersion: BACKEND_VERSION,
    buildDate: BUILD_DATE,
    commitHash: COMMIT_HASH,
    serviceStartTime: SERVICE_START_TIME
  });
});

app.get('/api/v1/resources/boards', async (req, res, next) => {
  try {
    const boards: any[] = [];
    const hostDir = path.join(BOARD_DESC_DIR, 'host');
    if (existsSync(hostDir)) {
      const files = await fs.readdir(hostDir);
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        try {
          const raw = await fs.readFile(path.join(hostDir, file), 'utf-8');
          const data = JSON.parse(raw);
          const boardId = Object.keys(data)[0];
          const info = data[boardId]?.["基本信息"] || {};
          boards.push({
            id: boardId,
            name: info.name || boardId,
            desc: info.desc || '',
            board_type: info.board_type || []
          });
        } catch {
          // Keep parity with the Python endpoint: skip malformed board files.
        }
      }
    }
    res.json(boards);
  } catch (err) {
    next(err);
  }
});

/**
 * 局部辅助函数：剔除 UI 属性包装层 LibraryGroup
 */
function stripUiWrappers(node: any): any {
  if (typeof node === 'object' && node !== null) {
    if (Array.isArray(node)) {
      return node.map(stripUiWrappers);
    } else {
      if ("moreModuleInfo" in node && Array.isArray(node.moreModuleInfo)) {
        const newSubs: any[] = [];
        for (const sub of node.moreModuleInfo) {
          if (sub?.moduleGroupName === "LibraryGroup") {
            const promoted = stripUiWrappers(sub);
            if (promoted.moreModuleInfo) {
              newSubs.push(...promoted.moreModuleInfo);
            }
          } else {
            newSubs.push(stripUiWrappers(sub));
          }
        }
        node.moreModuleInfo = newSubs;
      }
      const out: any = {};
      for (const [k, v] of Object.entries(node)) {
        out[k] = stripUiWrappers(v);
      }
      return out;
    }
  }
  return node;
}

const MODULE_LIST_HEADERS = [
  "模块名",
  "所属子系统",
  "子系统Key",
  "模块主类别",
  "主类别Key",
  "子类别",
  "子类别Key",
  "安装位置(X/Y/Z)",
  "旋转姿态(R/P/Y)"
];

function attrValue(obj: any, camelKey: string, snakeKey: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  return obj[camelKey] ?? obj[snakeKey];
}

function comboField(obj: any, camelKey: string, snakeKey: string): any {
  const combo = attrValue(obj, 'comboType', 'combo_type') || {};
  return attrValue(combo, camelKey, snakeKey);
}

function csvEscape(value: any): string {
  const text = value === undefined || value === null ? '' : String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function collectModuleListRows(node: any, rows: Record<string, any>[]): void {
  if (!node || typeof node !== 'object') return;

  const comps = attrValue(node, 'moduleComponets', 'module_componets') || [];
  for (const comp of comps) {
    const gen = attrValue(comp, 'generalAttr', 'general_attr') || {};
    const struct = attrValue(comp, 'structParam', 'struct_param') || {};
    const ext = attrValue(struct, 'extendParams', 'extend_params') || [];
    const coords: Record<string, any> = {};
    for (const item of ext) {
      if (!item?.key) continue;
      coords[item.key] = attrValue(item, 'doubleValue', 'double_value') ?? 0;
    }

    const moduleName =
      attrValue(attrValue(gen, 'moduleName', 'module_name'), 'stringValue', 'string_value') ||
      "Unknown";

    const mainModuleType = attrValue(gen, 'mainModuleType', 'main_module_type') || {};
    let mainCategoryDesc = comboField(mainModuleType, 'typeDesc', 'type_desc');
    let mainCategoryKey = comboField(mainModuleType, 'typeKey', 'type_key');

    if (!mainCategoryDesc) {
      let rawCategory = String(
        comp.category ||
        attrValue(attrValue(gen, 'moduleType', 'module_type'), 'stringValue', 'string_value') ||
        ''
      ).toUpperCase();
      if (["INTERFACE", "IOMODULE", "IO_BOARD"].some(key => rawCategory.includes(key))) {
        rawCategory = "IO";
      }
      const config = CATEGORY_TO_TYPE_KEY[rawCategory] || { desc: "未知", key: "unknown" };
      mainCategoryDesc = config.desc;
      mainCategoryKey = config.key;
    }

    const subModuleType = attrValue(gen, 'subModuleType', 'sub_module_type') || {};
    const subTypeDesc =
      comboField(subModuleType, 'typeDesc', 'type_desc') ||
      attrValue(attrValue(gen, 'moduleType', 'module_type'), 'stringValue', 'string_value') ||
      comp.type ||
      "Unknown";
    const subTypeKey =
      comboField(subModuleType, 'typeKey', 'type_key') ||
      subTypeDesc;

    const subSys = attrValue(gen, 'subSysType', 'sub_sys_type') || {};
    const subSysDesc = comboField(subSys, 'typeDesc', 'type_desc') || "未分类系统";
    const subSysKey = comboField(subSys, 'typeKey', 'type_key') || "UnclassifiedSys";

    rows.push({
      "模块名": moduleName,
      "所属子系统": subSysDesc,
      "子系统Key": subSysKey,
      "模块主类别": mainCategoryDesc,
      "主类别Key": mainCategoryKey,
      "子类别": subTypeDesc,
      "子类别Key": subTypeKey,
      "安装位置(X/Y/Z)": `${coords.locCoordX ?? 0}/${coords.locCoordY ?? 0}/${coords.locCoordZ ?? 0}`,
      "旋转姿态(R/P/Y)": `${coords.locCoordROLL ?? 0}/${coords.locCoordPITCH ?? 0}/${coords.locCoordYAW ?? 0}`
    });
  }

  const children = attrValue(node, 'moreModuleInfo', 'more_module_info') || [];
  for (const child of children) {
    collectModuleListRows(child, rows);
  }
}

async function writeModuleListCsv(projectId: string, projectDir: string): Promise<string> {
  const blueprintPath = path.join(projectDir, "blueprint_CompDesc.json");
  const blueprint = JSON.parse(await fs.readFile(blueprintPath, 'utf-8'));
  const fullData = await resolveWithFidelity(blueprint, projectDir);
  const rows: Record<string, any>[] = [];
  collectModuleListRows(fullData, rows);

  const csvName = `${projectId}_module_list.csv`;
  const csvPath = path.join(projectDir, csvName);
  const lines = [
    MODULE_LIST_HEADERS.map(csvEscape).join(','),
    ...rows.map(row => MODULE_LIST_HEADERS.map(header => csvEscape(row[header])).join(','))
  ];
  await fs.writeFile(csvPath, `\ufeff${lines.join('\n')}`, 'utf-8');
  return csvName;
}

// 2. 初始化沙箱环境接口 (从零配置启动)
app.post('/api/v1/models/init-sandbox', async (req, res, next) => {
  try {
    const { projectId, config } = req.body;
    if (!projectId || !config) {
      res.status(400).json({ error: "Missing projectId or config" });
      return;
    }

    const fullJson = frontendToCompDesc(config);
    const sanitizedJson = stripUiWrappers(fullJson);

    // 建立临时目录用于分割模型文件
    const tmpDir = path.join(os.tmpdir(), `amr_split_${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });

    try {
      const fullJsonPath = path.join(tmpDir, "CompDesc.json");
      await fs.writeFile(fullJsonPath, JSON.stringify(sanitizedJson, null, 2), 'utf-8');

      const splitOut = path.join(tmpDir, "split");
      await splitCompDesc(fullJsonPath, splitOut);

      const blueprintPath = path.join(splitOut, "blueprint_CompDesc.json");
      const blueprintRaw = await fs.readFile(blueprintPath, 'utf-8');
      const blueprint = JSON.parse(blueprintRaw);

      await dataManager.initProject(projectId, blueprint, path.join(splitOut, "modules"), sanitizedJson);

      const abiPath = path.join(dataManager.getProjectDir(projectId), "AbiSet.json");
      if (config.abilities) {
        const abiData = exportAbilities(config.abilities);
        await fs.writeFile(abiPath, JSON.stringify(abiData, null, 2), 'utf-8');
      }
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    }

    res.json({ status: "success", project_id: projectId });
  } catch (err) {
    next(err);
  }
});

// 3. 上传 CModel 并解析初始化接口
app.post('/api/v1/models/upload', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const projectId = `proj_${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;
    const tempDir = path.join(os.tmpdir(), `amr_upload_${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    try {
      const cmodelPath = path.join(tempDir, file.originalname);
      await fs.rename(file.path, cmodelPath);

      const decodeOut = path.join(tempDir, "decoded");
      const auditLog = await decodeCmodel(cmodelPath, decodeOut);

      const splitOut = path.join(tempDir, "split");
      const compDescJson = path.join(decodeOut, "CompDesc.json");
      await splitCompDesc(compDescJson, splitOut);

      const blueprintRaw = await fs.readFile(path.join(splitOut, "blueprint_CompDesc.json"), 'utf-8');
      const blueprint = JSON.parse(blueprintRaw);

      const fullJsonRaw = await fs.readFile(compDescJson, 'utf-8');
      const fullJson = JSON.parse(fullJsonRaw);

      await dataManager.initProject(projectId, blueprint, path.join(splitOut, "modules"), fullJson);

      // 级联拷贝可选数据文件 (AbiSet.json / FuncDesc.json / FuncDesc.model)
      const projectDir = dataManager.getProjectDir(projectId);
      const abiSrc = path.join(decodeOut, "AbiSet.json");
      if (existsSync(abiSrc)) {
        await fs.copyFile(abiSrc, path.join(projectDir, "AbiSet.json"));
      }
      const funcJsonSrc = path.join(decodeOut, "FuncDesc.json");
      if (existsSync(funcJsonSrc)) {
        await fs.copyFile(funcJsonSrc, path.join(projectDir, "FuncDesc.json"));
      }
      const funcModelSrc = path.join(decodeOut, "FuncDesc.model");
      if (existsSync(funcModelSrc)) {
        await fs.copyFile(funcModelSrc, path.join(projectDir, "FuncDesc.model"));
      }

      res.json({
        status: "success",
        project_id: projectId,
        blueprint,
        full_json: fullJson,
        audit: auditLog
      });
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  } catch (err) {
    next(err);
  }
});

// 4. 获取指定组件配置接口
app.get('/api/v1/models/:project_id/components/:module_uuid', async (req, res, next) => {
  try {
    const comp = await dataManager.getComponent(req.params.project_id, req.params.module_uuid);
    if (!comp) {
      res.status(404).end();
      return;
    }
    res.json(comp);
  } catch (err) {
    next(err);
  }
});

// 5. 更新指定组件配置接口
app.patch('/api/v1/models/:project_id/components/:module_uuid', async (req, res, next) => {
  try {
    const { file_name, ...delta } = req.body;
    if (file_name) {
      const globalSource = path.join(MODULE_RESOURCES_DIR, file_name);
      await dataManager.ensureModuleInProject(req.params.project_id, file_name, globalSource);
    }
    const success = await dataManager.updateComponent(req.params.project_id, req.params.module_uuid, req.body);
    res.json({ status: success ? "success" : "error" });
  } catch (err) {
    next(err);
  }
});

// 6. 获取项目能力配置接口
app.get('/api/v1/models/:project_id/abilities', async (req, res, next) => {
  try {
    const abi = await dataManager.getAbility(req.params.project_id);
    res.json(abi || {});
  } catch (err) {
    next(err);
  }
});

// 7. 获取动作指令描述接口
app.get('/api/v1/models/:project_id/functions', async (req, res, next) => {
  try {
    const func = await dataManager.getFunction(req.params.project_id);
    res.json(func || {});
  } catch (err) {
    next(err);
  }
});

// 8. 更新项目能力接口
app.patch('/api/v1/models/:project_id/abilities', async (req, res, next) => {
  try {
    let payload = req.body;
    if (Array.isArray(payload)) {
      payload = { functionAbility: payload, version: "1.0" };
    }
    const success = await dataManager.updateAbility(req.params.project_id, payload);
    res.json({ status: success ? "success" : "error" });
  } catch (err) {
    next(err);
  }
});

// 9. 一键编译并打包二进制模型接口
app.post('/api/v1/models/:project_id/compile', async (req, res, next) => {
  try {
    const projectId = req.params.project_id;
    const projectDir = dataManager.getProjectDir(projectId);
    if (!existsSync(projectDir)) {
      res.status(404).json({ error: `Project not found: ${projectId}` });
      return;
    }

    const outputCmodelName = `${projectId}_packed.cmodel`;
    const sandboxZipPath = path.join(projectDir, outputCmodelName);
    const blueprintPath = path.join(projectDir, "blueprint_CompDesc.json");
    if (!existsSync(blueprintPath)) {
      res.status(400).json({ error: `Project sandbox is missing blueprint_CompDesc.json: ${projectId}` });
      return;
    }

    const moduleListName = await writeModuleListCsv(projectId, projectDir);
    const auditLog = await encodeCmodel(projectDir, sandboxZipPath);
    res.json({
      status: "success",
      download_url: `/downloads/${projectId}/${outputCmodelName}`,
      module_list_url: `/downloads/${projectId}/${moduleListName}`,
      audit: auditLog
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/projects/saved-list', async (req, res, next) => {
  try {
    await fs.mkdir(USER_SAVES_DIR, { recursive: true });
    const files = await fs.readdir(USER_SAVES_DIR);
    const projects = await Promise.all(files
      .filter(file => file.endsWith('.json'))
      .map(async file => {
        const fpath = path.join(USER_SAVES_DIR, file);
        const stat = await fs.stat(fpath);
        return { name: path.basename(file, '.json'), mtime: stat.mtimeMs / 1000 };
      }));
    projects.sort((a, b) => b.mtime - a.mtime);
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

app.post('/api/v1/projects/save', async (req, res, next) => {
  try {
    const { name, config } = req.body;
    if (!name || !config) {
      res.status(400).json({ error: "Missing name or config" });
      return;
    }
    await fs.mkdir(USER_SAVES_DIR, { recursive: true });
    await fs.writeFile(path.join(USER_SAVES_DIR, `${name}.json`), JSON.stringify(config, null, 2), 'utf-8');
    res.json({ status: "success" });
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/projects/load/:name', async (req, res, next) => {
  try {
    const fpath = path.join(USER_SAVES_DIR, `${req.params.name}.json`);
    if (!existsSync(fpath)) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    const raw = await fs.readFile(fpath, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/schemas', async (req, res, next) => {
  try {
    const entities: Record<string, any[]> = {};
    if (!existsSync(MODULE_RESOURCES_DIR)) {
      res.json(entities);
      return;
    }

    const files = await fs.readdir(MODULE_RESOURCES_DIR);
    const baseMap = new Map<string, { json?: string; xml?: string }>();
    for (const file of files) {
      const ext = path.extname(file);
      if (ext !== '.json' && ext !== '.xml') continue;
      const stem = path.basename(file, ext);
      const entry = baseMap.get(stem) || {};
      if (ext === '.json') entry.json = path.join(MODULE_RESOURCES_DIR, file);
      if (ext === '.xml') entry.xml = path.join(MODULE_RESOURCES_DIR, file);
      baseMap.set(stem, entry);
    }

    for (const [stem, formats] of baseMap.entries()) {
      try {
        let dataJson: any = null;
        let dataXml: any = null;
        if (formats.json) {
          const rawJson = JSON.parse(await fs.readFile(formats.json, 'utf-8'));
          dataJson = rawJson && rawJson.full_data ? rawJson.full_data : rawJson;
        }
        if (formats.xml) {
          dataXml = await xmlToComponentJson(formats.xml);
        }
        const primary = dataXml || dataJson || {};
        const comp = (primary.module_componets || primary.moduleComponets || [])[0] || {};
        const sysName =
          comp.generalAttr?.subSysType?.comboType?.typeKey ||
          comp.general_attr?.sub_sys_type?.combo_type?.type_key ||
          "Other";
        if (!entities[sysName]) entities[sysName] = [];
        entities[sysName].push({
          module_id: stem,
          moduleGroupName: primary.moduleGroupName || primary.module_group_name || stem,
          system: sysName,
          data_json: dataJson,
          data_xml: dataXml,
          file_name: formats.xml ? path.basename(formats.xml) : path.basename(formats.json || stem)
        });
      } catch {
        // Skip malformed module resources to match the permissive Python endpoint.
      }
    }
    res.json(entities);
  } catch (err) {
    next(err);
  }
});

// 10. 全局异常拦截处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("GLOBAL_ERROR_HANDLER:", err);
  res.status(500).json({
    error: "InternalServerError",
    detail: err instanceof Error ? err.message : String(err)
  });
});

// 11. 动态加载组件定义并引导启动服务器
async function bootstrap() {
  console.log("Loading module schemas...");
  await schemaManager.loadAll();
  console.log(`Loaded ${Object.keys(schemaManager.getRegistry()).length} schemas.`);

  app.listen(PORT, HOST, () => {
    console.log(`=========================================`);
    console.log(`AMR Studio V4 TypeScript Backend running`);
    console.log(`Listening on: ${HOST}:${PORT}`);
    console.log(`=========================================`);
  });
}

bootstrap().catch(err => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});
