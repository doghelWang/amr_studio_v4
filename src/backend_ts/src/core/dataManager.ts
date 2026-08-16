/**
 * core/dataManager.ts
 * ====================
 * AMR Studio V4 - 项目沙箱与数据管理器
 * 该模块负责管理用户在前端操作时产生的局部沙箱项目（Saved Projects）。
 */

import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { RESOURCE_DIR, SAVED_PROJECTS_DIR } from './paths';

// 简单的高并发异步锁，用于确保 Node.js 单进程环境下的文件写入顺序安全性
class FileLock {
  private static locks = new Map<string, Promise<void>>();

  static async acquire(filePath: string): Promise<() => void> {
    const previous = this.locks.get(filePath) || Promise.resolve();
    let resolveLock!: () => void;
    const next = new Promise<void>((resolve) => {
      resolveLock = resolve;
    });
    this.locks.set(filePath, next);
    await previous;
    return () => {
      resolveLock();
      if (this.locks.get(filePath) === next) {
        this.locks.delete(filePath);
      }
    };
  }
}

/**
 * 原子级 JSON 文件写入器：
 * 首先写入临时文件中，并在成功写入后通过系统重命名操作原子替换原文件。
 */
export async function atomicWriteJson(data: any, targetFile: string): Promise<void> {
  const fileDir = path.dirname(targetFile);
  const tempFile = path.join(fileDir, `._tmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.json`);
  
  try {
    await fs.mkdir(fileDir, { recursive: true });
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempFile, targetFile);
  } catch (err) {
    if (existsSync(tempFile)) {
      await fs.unlink(tempFile).catch(() => {});
    }
    throw err;
  }
}

export const DB_DIR = SAVED_PROJECTS_DIR;

export function getProjectDir(projectId: string): string {
  return path.join(DB_DIR, projectId);
}

/**
 * 项目初始化主逻辑
 */
export async function initProject(projectId: string, blueprintData: any, modulesDirPath: string, fullCompDesc: any): Promise<void> {
  const pDir = getProjectDir(projectId);
  const mDir = path.join(pDir, 'modules');
  
  await fs.mkdir(pDir, { recursive: true });
  await fs.mkdir(mDir, { recursive: true });

  // 1. 保存骨架蓝图文件
  await fs.writeFile(path.join(pDir, 'blueprint_CompDesc.json'), JSON.stringify(blueprintData, null, 2), 'utf-8');

  // 2. 保存合并的完整数据，作为基准参照
  await fs.writeFile(path.join(pDir, 'CompDesc.json'), JSON.stringify(fullCompDesc, null, 2), 'utf-8');

  // 3. 将各拆分出来的组件 JSON 配置文件拷贝到该项目沙箱的 modules 物理目录中
  if (existsSync(modulesDirPath)) {
    const items = await fs.readdir(modulesDirPath);
    for (const item of items) {
      const srcFile = path.join(modulesDirPath, item);
      const stat = await fs.stat(srcFile);
      if (stat.isFile() && item.endsWith('.json')) {
        await fs.copyFile(srcFile, path.join(mDir, item));
      }
    }
  }
}

/**
 * 高精度深度合并算法
 */
export function deepUpdate(d: any, u: any, pathStr: string = 'root'): any {
  if (typeof u !== 'object' || u === null) return d;

  for (const [k, v] of Object.entries(u)) {
    const currPath = `${pathStr}.${k}`;

    // 1. 列表合并处理（例如属性组列表 AttributeGroups、子组件属性列表、接口组 interfaceGroup 等）
    if (k in d && Array.isArray(d[k]) && Array.isArray(v)) {
      const dList = d[k];
      for (const uItem of v) {
        if (typeof uItem === 'object' && uItem !== null) {
          const ukey = uItem.key || uItem.type || uItem.interfaceUuid || uItem.interface_uuid;
          if (ukey) {
            const matchIndex = dList.findIndex((item: any) => {
              return typeof item === 'object' && item !== null &&
                (item.key === ukey || item.type === ukey || item.interfaceUuid === ukey || item.interface_uuid === ukey);
            });
            if (matchIndex !== -1) {
              deepUpdate(dList[matchIndex], uItem, `${currPath}[key:${ukey}]`);
            } else {
              dList.push(uItem);
            }
          } else {
            dList.push(uItem);
          }
        } else {
          dList.push(uItem);
        }
      }
    }
    // 2. 字典分支合并处理
    else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      // ━━━ 特殊安全防护：COMBOX 双键选择项修改防护 ━━━
      const isCombox = k === 'comboType' || k === 'combo_type';
      if (isCombox) {
        const tKey = (v as any).typeKey || (v as any).type_key;
        if (tKey && !('typeGroups' in v) && !('type_groups' in v)) {
          if (k in d && typeof d[k] === 'object' && d[k] !== null) {
            const targetKey = 'typeKey' in d[k] ? 'typeKey' : 'type_key';
            if (d[k][targetKey] !== tKey) {
              console.log(`DISK_AUDIT: [COMBOX_CHANGE] ${currPath}.${targetKey}: [${d[k][targetKey]}] -> [${tKey}]`);
              d[k][targetKey] = tKey;
            }
            continue;
          }
        }
      }

      // 正常分支递归深度合并
      let existing = d[k];
      if (typeof existing !== 'object' || existing === null || Array.isArray(existing)) {
        existing = {};
        d[k] = existing;
      }
      deepUpdate(existing, v, currPath);
    }
    // 3. 叶子单元值更新处理
    else {
      if (d[k] !== v) {
        console.log(`DISK_AUDIT: [VALUE_CHANGE] ${currPath}: [${d[k]}] -> [${v}]`);
        d[k] = v;
      }
    }
  }
  return d;
}

/**
 * 确保沙箱内的组件就绪
 */
export async function ensureModuleInProject(projectId: string, moduleFilename: string, fallbackSourcePath: string): Promise<boolean> {
  const pDir = getProjectDir(projectId);
  const mDir = path.join(pDir, 'modules');
  await fs.mkdir(mDir, { recursive: true });
  
  const target = path.join(mDir, moduleFilename);
  if (!existsSync(target)) {
    if (existsSync(fallbackSourcePath)) {
      await fs.copyFile(fallbackSourcePath, target);
      console.log(`DISK_AUDIT: [SANDBOX_IMPORT] Copied ${moduleFilename} to project ${projectId}`);
      return true;
    }
  }
  return existsSync(target);
}

/**
 * 线程（并发）安全地更新沙箱中的组件
 */
export async function updateComponent(projectId: string, moduleUuid: string, payloadDelta: any): Promise<boolean> {
  const mDir = path.join(getProjectDir(projectId), 'modules');
  if (!existsSync(mDir)) return false;

  const files = await fs.readdir(mDir);
  const targetFile = files.find(f => f.includes(moduleUuid) && f.endsWith('.json'));
  if (!targetFile) return false;

  const targetPath = path.join(mDir, targetFile);
  const release = await FileLock.acquire(targetPath);
  try {
    const raw = await fs.readFile(targetPath, 'utf-8');
    const data = JSON.parse(raw);
    console.log(`DISK_AUDIT: >>> Updating component ${moduleUuid} <<<`);
    deepUpdate(data, payloadDelta);
    await atomicWriteJson(data, targetPath);
    return true;
  } finally {
    release();
  }
}

/**
 * 并发安全地更新沙箱的能力配置
 */
export async function updateAbility(projectId: string, payloadDelta: any): Promise<boolean> {
  const fpath = path.join(getProjectDir(projectId), 'AbiSet.json');
  
  if (!existsSync(fpath)) {
    const baseline = path.join(RESOURCE_DIR, 'AbiSet_base.json');
    if (existsSync(baseline)) {
      await fs.copyFile(baseline, fpath);
    } else {
      await fs.writeFile(fpath, JSON.stringify({ version: 'V1.0' }, null, 2));
    }
  }

  const release = await FileLock.acquire(fpath);
  try {
    const raw = await fs.readFile(fpath, 'utf-8');
    const data = JSON.parse(raw);
    console.log(`DISK_AUDIT: >>> Updating AbilitySet <<<`);
    deepUpdate(data, payloadDelta);
    await atomicWriteJson(data, fpath);
    return true;
  } finally {
    release();
  }
}

/**
 * 并发安全地更新沙箱的动作逻辑描述
 */
export async function updateFunction(projectId: string, payloadDelta: any): Promise<boolean> {
  const fpath = path.join(getProjectDir(projectId), 'FuncDesc.json');

  if (!existsSync(fpath)) {
    await fs.writeFile(fpath, JSON.stringify({ version: 'V1.0', function: [] }, null, 2));
  }

  const release = await FileLock.acquire(fpath);
  try {
    const raw = await fs.readFile(fpath, 'utf-8');
    const data = JSON.parse(raw);
    console.log(`DISK_AUDIT: >>> Updating FuncDesc <<<`);
    deepUpdate(data, payloadDelta);
    await atomicWriteJson(data, fpath);
    return true;
  } finally {
    release();
  }
}

/**
 * 获取组件 JSON
 */
export async function getComponent(projectId: string, moduleUuid: string): Promise<any | null> {
  const mDir = path.join(getProjectDir(projectId), 'modules');
  if (!existsSync(mDir)) return null;

  const files = await fs.readdir(mDir);
  const targetFile = files.find(f => f.includes(moduleUuid) && f.endsWith('.json'));
  if (!targetFile) return null;

  const raw = await fs.readFile(path.join(mDir, targetFile), 'utf-8');
  return JSON.parse(raw);
}

/**
 * 获取能力配置 JSON
 */
export async function getAbility(projectId: string): Promise<any | null> {
  const fpath = path.join(getProjectDir(projectId), 'AbiSet.json');
  if (existsSync(fpath)) {
    const raw = await fs.readFile(fpath, 'utf-8');
    return JSON.parse(raw);
  }
  return null;
}

/**
 * 获取动作功能配置 JSON
 */
export async function getFunction(projectId: string): Promise<any | null> {
  const fpath = path.join(getProjectDir(projectId), 'FuncDesc.json');
  if (existsSync(fpath)) {
    const raw = await fs.readFile(fpath, 'utf-8');
    return JSON.parse(raw);
  }
  return null;
}
