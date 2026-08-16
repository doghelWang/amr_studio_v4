/**
 * skills/cmodelEncoder.ts
 * =======================
 * AMR Studio V4 CModel Encoder (TypeScript 版)
 * 负责将项目沙箱内的模块还原合并，并序列化打包为二进制的 .cmodel 包。
 */

import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import AdmZip from 'adm-zip';
import * as protobuf from 'protobufjs';
import { PROTOCOLS_DIR, RESOURCE_DIR } from '../core/paths';

const PROTO_DIR = PROTOCOLS_DIR;

async function loadProto(protoPath: string): Promise<protobuf.Root> {
  const root = new protobuf.Root();
  await root.load(protoPath, { keepCase: true });
  root.resolveAll();
  return root;
}

export const COMP_DESC_TYPE_STRING_TO_INT: Record<string, number> = {
  "DATA_BYTES": 0, "DATA_STRING": 1, "DATA_IP": 3, "DATA_BOOL": 4,
  "DATA_INT32": 5, "DATA_UINT32": 6, "DATA_INT64": 7, "DATA_UINT64": 8,
  "DATA_FLOAT": 9, "DATA_DOUBLE": 10, "DATA_COMBOX": 11, "DATA_FIXED_E": 12,
};

export const ABI_TYPE_STRING_TO_INT: Record<string, number> = {
  "BYTES_E": 0, "STRING_E": 1, "IP_E": 3, "BOOL_E": 4,
  "INT32_E": 5, "UINT32_E": 6, "INT64_E": 7, "UINT64_E": 8,
  "FLOAT_E": 9, "DOUBLE_E": 10, "FIXED_E": 11, "DATA_COMBOX_E": 12,
  "COMBOX_E": 12, "DATA_FIXED_E": 11, "DATA_COMBOX": 12,
};

export const ABI_DESC_TYPE_STRING_TO_INT: Record<string, number> = {
  "BYTES_E": 0, "STRING_E": 1, "IP_E": 3, "BOOL_E": 4,
  "INT32_E": 5, "UINT32_E": 6, "INT64_E": 7, "UINT64_E": 8,
  "FLOAT_E": 9, "DOUBLE_E": 10, "FIXED_E": 11, "DATA_COMBOX_E": 12,
  "COMBOX_E": 12, "DATA_FIXED_E": 11, "DATA_COMBOX": 12,
};

export const SHAPE_TYPE_STRING_TO_INT: Record<string, number> = {
  "ENUM_SPHERE": 0,
  "ENUM_BOX": 1,
  "ENUM_CYLINDER": 2,
};

const COMBOX_SOURCE_STRING_TO_INT: Record<string, number> = {
  "NORMAL_E": 0,
  "CUSTOM_E": 1,
};

const ATTRIBUTE_OPTION_STRING_TO_INT: Record<string, number> = {
  "REQUIRED_E": 0,
  "OPTIONAL_E": 1,
};

async function getMd5(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  return crypto.createHash('md5').update(data).digest('hex');
}

export function sanitizeValues(data: any, key?: string): any {
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeValues(item, key));
    } else {
      const out: any = {};
      for (const [k, v] of Object.entries(data)) {
        out[k] = sanitizeValues(v, k);
      }
      return out;
    }
  } else if (typeof data === 'string') {
    const stripKeys = [
      "stringValue", "string_value", "desc", "key", "path", "moduleGroupName", 
      "module_group_name", "moduleGroupUuid", "unit", "typeKey", "type_key", 
      "typeDesc", "type_desc", "interfaceUuid", "interface_uuid", 
      "linkedInterfaceUuid", "linked_interface_uuid"
    ];
    if (key && stripKeys.includes(key)) {
      return data.trim();
    }
    if (data.toLowerCase() === "true") return true;
    if (data.toLowerCase() === "false") return false;

    const numericValueKeys = new Set([
      "int32Value", "int32_value", "uint32Value", "uint32_value",
      "int64Value", "int64_value", "uint64Value", "uint64_value",
      "floatValue", "float_value", "doubleValue", "double_value",
      "int32Maxvalue", "int32_maxvalue", "uint32Maxvalue", "uint32_maxvalue",
      "int32Minvalue", "int32_minvalue", "uint32Minvalue", "uint32_minvalue",
      "floatMaxvalue", "float_maxvalue", "doubleMaxvalue", "double_maxvalue",
      "floatMinvalue", "float_minvalue", "doubleMinvalue", "double_minvalue",
      "sizeLen", "size_len", "sizeWidth", "size_width", "sizeHeight", "size_height",
      "diameter", "height", "nodePosX", "node_pos_x", "nodePosY", "node_pos_y"
    ]);
    if (key && numericValueKeys.has(key)) {
      const num = Number(data);
      if (!Number.isNaN(num) && data !== "") {
        return num;
      }
    }
    return data;
  }
  return data;
}

export function protoFinalSync(data: any, typeMapping: Record<string, number> = COMP_DESC_TYPE_STRING_TO_INT): any {
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => protoFinalSync(item, typeMapping));
    } else {
      const out: any = {};
      const mapping: Record<string, string> = {
        "moduleComponets": "module_componets",
        "generalAttr": "general_attr",
        "privateAttr": "private_attr",
        "privateAttrs": "private_attrs",
        "interfaceAbility": "interface_ability",
        "interfaceParams": "interface_params",
        "structParam": "struct_param",
        "moreModuleInfo": "more_module_info",
        "moduleGroupName": "module_group_name",
        "moduleGroupUuid": "module_group_uuid",
        "moduleSys": "module_sys",
        "modelVersion": "model_version",
        "extendParams": "extend_params",
        "moduleShape": "module_shape",
        "shapeType": "shape_type",
        "sizeLen": "size_len",
        "sizeWidth": "size_width",
        "sizeHeight": "size_height",
        "interfaceGroup": "interface_Group",
        "interfaceUuid": "interface_uuid",
        "linkedInterfaceUuid": "linked_interface_uuid",
        "arrayBaseEle": "array_base_ele",
        "comboType": "combo_type",
        "typeKey": "type_key",
        "typeDesc": "type_desc",
        "typeGroups": "type_groups",
        "arrayCmobEle": "array_cmob_ele",
        "boolParse": "bool_parse",
        "boolHide": "bool_hide",
        "boolBasic": "bool_basic",
        "boolMustfill": "bool_mustfill",
        "boolNoeditable": "bool_noeditable",
        "fixedSource": "fixed_source",
        "boolDisable": "bool_disable",
        "boolDeprecated": "bool_deprecated",
        "componentAbility": "component_ability",
        "functionAbility": "function_ability",
        "childFunction": "child_function",
        "moduleName": "module_name",
        "moduleDesc": "module_desc",
        "moduleUuid": "module_uuid",
        "versionInfo": "version_info",
        "module3dIcon": "module_3d_icon",
        "subSysType": "sub_sys_type",
        "mainModuleType": "main_module_type",
        "subModuleType": "sub_module_type",
        "venderName": "vender_name",
        "moduleDscType": "module_dsc_type",
        "moduleIcon": "module_icon",
        "stringValue": "string_value",
        "boolValue": "bool_value",
        "int32Value": "int_32_value",
        "uint32Value": "uint_32_value",
        "floatValue": "float_value",
        "doubleValue": "double_value",
        "int32Maxvalue": "int_32_maxvalue",
        "doubleMaxvalue": "double_maxvalue",
        "int32Minvalue": "int_32_minvalue",
        "doubleMinvalue": "double_minvalue"
      };

      for (const [k, v] of Object.entries(data)) {
        const isCommonAttr =
          "comboxParam" in data || "combox_param" in data ||
          "arrayParam" in data || "array_param" in data ||
          "oneof_componentValue" in data;
        if (k === "type" && typeof v === "string" && (isCommonAttr || v === "COMBOX_E" || v === "COMBOX" || v === "ARRAY_E" || v === "ARRAY")) {
          if (v === "COMBOX_E" || v === "COMBOX") {
            out[k] = 0;
          } else if (v === "ARRAY_E" || v === "ARRAY") {
            out[k] = 1;
          }
        } else if (k === "type" && typeof v === "string" && typeMapping[v] !== undefined) {
          out[k] = typeMapping[v];
        } else if ((k === "shapeType" || k === "shape_type") && typeof v === "string") {
          out[mapping[k] || k] = SHAPE_TYPE_STRING_TO_INT[v] !== undefined ? SHAPE_TYPE_STRING_TO_INT[v] : v;
        } else if ((k === "comboxSource" || k === "combox_source") && typeof v === "string") {
          out[mapping[k] || k] = COMBOX_SOURCE_STRING_TO_INT[v] !== undefined ? COMBOX_SOURCE_STRING_TO_INT[v] : v;
        } else if (k === "option" && typeof v === "string") {
          out[k] = ATTRIBUTE_OPTION_STRING_TO_INT[v] !== undefined ? ATTRIBUTE_OPTION_STRING_TO_INT[v] : v;
        } else {
          let newKey = mapping[k] || k;
          if (newKey === "int_32_value") newKey = "int32_value";
          else if (newKey === "uint_32_value") newKey = "uint32_value";
          else if (newKey === "int_32_maxvalue") newKey = "int32_maxvalue";
          else if (newKey === "uint_32_maxvalue") newKey = "uint32_maxvalue";
          else if (newKey === "int_32_minvalue") newKey = "int32_minvalue";
          else if (newKey === "uint_32_minvalue") newKey = "uint32_minvalue";
          
          out[newKey] = protoFinalSync(v, typeMapping);
        }
      }
      return out;
    }
  }
  return data;
}

export async function resolveWithFidelity(blueprint: any, projectDir: string): Promise<any> {
  if (typeof blueprint === 'object' && blueprint !== null) {
    if (Array.isArray(blueprint)) {
      const resolved = [];
      for (const item of blueprint) {
        resolved.push(await resolveWithFidelity(item, projectDir));
      }
      return resolved;
    } else {
      if ("$ref" in blueprint) {
        const refPath = path.join(projectDir, blueprint["$ref"]);
        if (existsSync(refPath)) {
          const raw = await fs.readFile(refPath, 'utf-8');
          return resolveWithFidelity(JSON.parse(raw), projectDir);
        }
      }
      const out: any = {};
      for (const [k, v] of Object.entries(blueprint)) {
        out[k] = await resolveWithFidelity(v, projectDir);
      }
      return out;
    }
  }
  return blueprint;
}

export function protoSyncAbiDesc(data: any, typeMapping: Record<string, number> = ABI_DESC_TYPE_STRING_TO_INT): any {
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => protoSyncAbiDesc(item, typeMapping));
    } else {
      const mapping: Record<string, string> = {
        "childFunction": "child_function",
        "comboType": "combo_type",
        "typeGroups": "type_groups",
        "arrayCmobEle": "array_cmob_ele",
        "arrayAttr": "array_attr",
        "comboxAttr": "combox_attr",
        "comboxParam": "combox_param",
        "arrayParam": "array_param",
        "cloneEnable": "clone_enable",
        "stringValue": "string_value",
        "boolValue": "bool_value",
        "int32Value": "int32_value",
        "uint32Value": "uint32_value",
        "int64Value": "int64_value",
        "uint64Value": "uint64_value",
        "floatValue": "float_value",
        "doubleValue": "double_value",
      };
      const out: any = {};
      for (const [k, v] of Object.entries(data)) {
        const isCommonAttr =
          "comboxParam" in data || "combox_param" in data ||
          "arrayParam" in data || "array_param" in data ||
          "oneof_componentValue" in data;
        if (k === "type" && typeof v === "string" && isCommonAttr && (v === "COMBOX_E" || v === "ARRAY_E")) {
          out[k] = v === "COMBOX_E" ? 0 : 1;
        } else if (k === "type" && typeof v === "string") {
          out[k] = typeMapping[v] !== undefined ? typeMapping[v] : v;
        } else if (k === "option" && typeof v === "string") {
          out[k] = ATTRIBUTE_OPTION_STRING_TO_INT[v] !== undefined ? ATTRIBUTE_OPTION_STRING_TO_INT[v] : v;
        } else {
          out[mapping[k] || k] = protoSyncAbiDesc(v, typeMapping);
        }
      }
      return out;
    }
  }
  return data;
}

export function standardizeSysTree(blueprintRoot: any): any {
  const originalInfo = blueprintRoot.more_module_info || [];
  if (!Array.isArray(originalInfo)) return blueprintRoot;

  function collectAllGroups(groups: any[]): any[] {
    const result: any[] = [];
    for (const g of groups) {
      const children = g.more_module_info || [];
      const flatGroup = { ...g, more_module_info: [] };
      result.push(flatGroup);
      if (children.length > 0) {
        result.push(...collectAllGroups(children));
      }
    }
    return result;
  }

  const realGroups = collectAllGroups(originalInfo);
  blueprintRoot.more_module_info = realGroups;
  blueprintRoot.module_group_name = "";
  blueprintRoot.module_group_uuid = "";
  blueprintRoot.module_sys = "";
  return blueprintRoot;
}

export async function encodeCmodel(projectDir: string, outputCmodelPath: string): Promise<string[]> {
  const audit: string[] = [];
  const pPath = projectDir;

  // 1. 编译核心组件数据 CompDesc.model
  const blueprintFile = path.join(pPath, "blueprint_CompDesc.json");
  const compJsonRaw = await fs.readFile(blueprintFile, 'utf-8');
  let compJson = JSON.parse(compJsonRaw);

  compJson = await resolveWithFidelity(compJson, pPath);
  compJson = sanitizeValues(compJson);
  compJson = protoFinalSync(compJson, COMP_DESC_TYPE_STRING_TO_INT);
  compJson = standardizeSysTree(compJson);

  // 动态编译
  const rootCompDesc = await loadProto(path.join(PROTO_DIR, "controller_model_comp_desc.proto"));
  const Message_Module_Info = rootCompDesc.lookupType("Message_Module_Info");
  
  const errComp = Message_Module_Info.verify(compJson);
  if (errComp) {
    throw new Error(`Protobuf verification failed for CompDesc: ${errComp}`);
  }
  const msgComp = Message_Module_Info.create(compJson);
  const binaryComp = Message_Module_Info.encode(msgComp).finish();

  const compModelPath = path.join(pPath, "CompDesc.model");
  await fs.writeFile(compModelPath, binaryComp);
  audit.push(`CompDesc.model built: ${binaryComp.length} bytes`);

  // 2. 编译能力集配置 AbiSet.model
  const abiJsonPath = path.join(pPath, "AbiSet.json");
  const abiModelPath = path.join(pPath, "AbiSet.model");
  if (existsSync(abiJsonPath)) {
    const abiJsonRaw = await fs.readFile(abiJsonPath, 'utf-8');
    let abiData = JSON.parse(abiJsonRaw);
    abiData = protoFinalSync(abiData, ABI_TYPE_STRING_TO_INT);

    const rootAbiSet = await loadProto(path.join(PROTO_DIR, "controller_model_abi_set.proto"));
    const Controller_Ability = rootAbiSet.lookupType("Controller_Ability");
    
    const errAbi = Controller_Ability.verify(abiData);
    if (errAbi) {
      throw new Error(`Protobuf verification failed for AbiSet: ${errAbi}`);
    }
    const msgAbi = Controller_Ability.create(abiData);
    const binaryAbi = Controller_Ability.encode(msgAbi).finish();

    await fs.writeFile(abiModelPath, binaryAbi);
    audit.push(`AbiSet.model built: ${binaryAbi.length} bytes`);
  } else {
    await fs.writeFile(abiModelPath, Buffer.alloc(0));
  }

  // 3. 编译动作指令描述 FuncDesc.model
  const funcModelPath = path.join(pPath, "FuncDesc.model");
  const projectFuncJson = path.join(pPath, "FuncDesc.json");
  const resFunc = path.join(RESOURCE_DIR, "FuncDesc.model");

  if (existsSync(projectFuncJson)) {
    const funcJsonRaw = await fs.readFile(projectFuncJson, 'utf-8');
    let funcData = JSON.parse(funcJsonRaw);
    funcData = protoSyncAbiDesc(funcData);

    const rootAbiDesc = await loadProto(path.join(PROTO_DIR, "controller_model_abi_desc.proto"));
    const Robot_Description = rootAbiDesc.lookupType("Robot_Description");

    const errFunc = Robot_Description.verify(funcData);
    if (errFunc) {
      throw new Error(`Protobuf verification failed for FuncDesc: ${errFunc}`);
    }
    const msgFunc = Robot_Description.create(funcData);
    const binaryFunc = Robot_Description.encode(msgFunc).finish();

    await fs.writeFile(funcModelPath, binaryFunc);
    audit.push(`FuncDesc.model built: ${binaryFunc.length} bytes`);
  } else if (existsSync(funcModelPath)) {
    audit.push("FuncDesc.model preserved from project");
  } else if (existsSync(resFunc)) {
    await fs.copyFile(resFunc, funcModelPath);
    audit.push("FuncDesc.model included");
  } else {
    await fs.writeFile(funcModelPath, Buffer.alloc(0));
    audit.push("FuncDesc.model missing; wrote empty placeholder");
  }

  // 4. 生成 ModelFileDesc.json 清单文件并写入归档
  const fileDesc = {
    "ModelFileDesc": [
      { "md5": await getMd5(abiModelPath), "name": "AbiSet.model", "type": "CAPABILITY", "version": "" },
      { "md5": await getMd5(funcModelPath), "name": "FuncDesc.model", "type": "MODEL_FUNC", "version": "" },
      { "md5": await getMd5(compModelPath), "name": "CompDesc.model", "type": "MODEL_COMP", "version": "" }
    ]
  };
  await fs.writeFile(path.join(pPath, "ModelFileDesc.json"), JSON.stringify(fileDesc, null, 4), 'utf-8');
  audit.push("ModelFileDesc.json generated");

  // 5. 执行 ZIP 打包压缩生成最终的 .cmodel 模型包
  const zip = new AdmZip();
  zip.addLocalFile(path.join(pPath, "AbiSet.model"));
  zip.addLocalFile(path.join(pPath, "CompDesc.model"));
  zip.addLocalFile(path.join(pPath, "FuncDesc.model"));
  zip.addLocalFile(path.join(pPath, "ModelFileDesc.json"));
  zip.writeZip(outputCmodelPath);

  return audit;
}
