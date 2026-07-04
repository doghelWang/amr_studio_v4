/**
 * core/schemaManager.ts
 * ====================
 * AMR Studio V4 - 组件元数据核心管理器
 * 动态加载 resources/definitions/*.xml 实时解析组件库的属性和接口配置。
 */

import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';
import { MODULE_RESOURCES_DIR } from './paths';

export class SchemaManager {
  private definitionsPath: string;
  private schemas: Record<string, any> = {};

  constructor(definitionsPath: string) {
    this.definitionsPath = definitionsPath;
  }

  async loadAll(): Promise<void> {
    if (!existsSync(this.definitionsPath)) {
      console.warn(`WARNING: Definitions path ${this.definitionsPath} does not exist.`);
      return;
    }

    const files = await fs.readdir(this.definitionsPath);
    const newSchemas: Record<string, any> = {};

    for (const file of files) {
      if (file.endsWith('.xml')) {
        try {
          const filePath = path.join(this.definitionsPath, file);
          const schema = await this.parseXml(filePath);
          if (schema && schema.key) {
            newSchemas[schema.key] = schema;
          }
        } catch (err) {
          console.error(`ERROR: Failed to parse ${file}:`, err);
        }
      }
    }
    this.schemas = newSchemas;
  }

  private async parseXml(filePath: string): Promise<any | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = await parseStringPromise(content);
      
      if (!parsed || !parsed.moduleType) return null;
      
      const root = parsed.moduleType;
      const rootAttr = root.$ || {};
      
      const schema: any = {
        key: rootAttr.key,
        category: rootAttr.category,
        label: rootAttr.label || rootAttr.key,
        aliases: [],
        subTypes: [],
        defaultSubType: "",
        privateAttributes: [],
        interfaces: []
      };

      // 0. 解析别名 (用于兼容旧版 cmodel)
      if (root.aliases && root.aliases[0] && root.aliases[0].alias) {
        for (const alias of root.aliases[0].alias) {
          const key = alias.$?.key;
          if (key) schema.aliases.push(key);
        }
      }

      // 1. 解析子类型 (SubTypes)
      if (root.subTypes && root.subTypes[0]) {
        const subtypesNode = root.subTypes[0];
        schema.defaultSubType = subtypesNode.$?.default || "";
        if (subtypesNode.subType) {
          for (const st of subtypesNode.subType) {
            const key = st.$?.key;
            if (key) {
              schema.subTypes.push({
                key,
                label: st.$?.label || key
              });
            }
          }
        }
      }

      // 2. 解析私有属性 (Private Attributes)
      if (root.privateAttributes && root.privateAttributes[0]) {
        const privateAttributesNode = root.privateAttributes[0];
        if (privateAttributesNode.group) {
          for (const grp of privateAttributesNode.group) {
            const groupKey = grp.$?.key;
            const groupData: any = {
              key: groupKey,
              label: grp.$?.label || groupKey,
              elements: []
            };
            if (grp.attribute) {
              for (const attr of grp.attribute) {
                const attrAttr = attr.$ || {};
                const attrType = attrAttr.type || "DATA_DOUBLE";
                groupData.elements.push({
                  key: attrAttr.key,
                  label: attrAttr.label || attrAttr.key,
                  type: attrType,
                  unit: attrAttr.unit || "",
                  value: this.castValue(attrAttr.value || "", attrType)
                });
              }
            }
            schema.privateAttributes.push(groupData);
          }
        }
      }

      // 3. 解析接口 (Interfaces)
      if (root.interfaces && root.interfaces[0] && root.interfaces[0].interface) {
        for (const iface of root.interfaces[0].interface) {
          const attr = iface.$ || {};
          if (attr.key) {
            schema.interfaces.push({
              key: attr.key,
              type: attr.type,
              label: attr.label || attr.key
            });
          }
        }
      }

      return schema;
    } catch (e) {
      console.error(`XML Parse Error in ${filePath}:`, e);
      return null;
    }
  }

  private castValue(valStr: string, valType: string): any {
    if (!valStr) {
      if (valType.includes("INT") || valType.includes("DOUBLE") || valType.includes("FLOAT")) {
        return 0.0;
      }
      if (valType.includes("BOOL")) {
        return false;
      }
      return "";
    }

    try {
      if (["DATA_DOUBLE", "DATA_FLOAT"].includes(valType)) {
        return parseFloat(valStr);
      }
      if (["DATA_INT32", "DATA_UINT32", "DATA_INT64", "DATA_UINT64"].includes(valType)) {
        return parseInt(valStr, 10);
      }
      if (valType === "DATA_BOOL") {
        return ["true", "1", "yes"].includes(valStr.toLowerCase());
      }
      return valStr;
    } catch {
      return valStr;
    }
  }

  getRegistry(): Record<string, any> {
    return this.schemas;
  }
}

// 全局单例初始化
export const schemaManager = new SchemaManager(path.join(MODULE_RESOURCES_DIR, '..', 'definitions'));
