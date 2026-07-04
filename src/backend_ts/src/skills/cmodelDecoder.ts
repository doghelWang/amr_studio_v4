/**
 * skills/cmodelDecoder.ts
 * =======================
 * AMR Studio V4 CModel Decoder (TypeScript 版)
 * 负责解压 .cmodel ZIP 容器包并动态加载 .proto 文件反序列化二进制 model 到 JSON。
 */

import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import * as protobuf from 'protobufjs';
import { PROTOCOLS_DIR } from '../core/paths';

const PROTO_DIR = PROTOCOLS_DIR;

async function loadProto(protoPath: string): Promise<protobuf.Root> {
  const root = new protobuf.Root();
  await root.load(protoPath, { keepCase: true });
  root.resolveAll();
  return root;
}

export async function decodeCmodel(cmodelPath: string, outputDir: string): Promise<string[]> {
  const audit: string[] = [];
  const stat = await fs.stat(cmodelPath);
  audit.push(`IMPORT_START: ${path.basename(cmodelPath)} (${stat.size} bytes)`);

  await fs.mkdir(outputDir, { recursive: true });

  // 1. 解压 .cmodel ZIP 包
  try {
    const zip = new AdmZip(cmodelPath);
    zip.extractAllTo(outputDir, true);
  } catch (err) {
    audit.push(`ERROR: Invalid .cmodel format (Failed to unzip: ${err})`);
    return audit;
  }

  // 2. 映射表：二进制文件名 -> .proto 协议文件名 -> 编译的目标类型名 -> 生成的明文 json 文件名
  const modelMapping = [
    {
      modelName: "CompDesc.model",
      protoName: "controller_model_comp_desc.proto",
      typeName: "Message_Module_Info",
      jsonName: "CompDesc.json"
    },
    {
      modelName: "AbiSet.model",
      protoName: "controller_model_abi_set.proto",
      typeName: "Controller_Ability",
      jsonName: "AbiSet.json"
    },
    {
      modelName: "FuncDesc.model",
      protoName: "controller_model_abi_desc.proto",
      typeName: "Robot_Description",
      jsonName: "FuncDesc.json"
    }
  ];

  // 3. 循环反序列化每个二进制文件
  for (const item of modelMapping) {
    const modelPath = path.join(outputDir, item.modelName);
    if (existsSync(modelPath)) {
      try {
        const protoPath = path.join(PROTO_DIR, item.protoName);
        const binaryData = await fs.readFile(modelPath);

        // 动态加载 .proto 文件
        const root = await loadProto(protoPath);
        const pbClass = root.lookupType(item.typeName);

        // 字节解码
        const decoded = pbClass.decode(binaryData);
        
        // 核心转换：转换为 JS Object
        // defaults: true 导出时补齐所有零值/空值字段保证数据闭环
        const jsonObject = pbClass.toObject(decoded, {
          longs: String,
          enums: String,
          bytes: String,
          defaults: true,
          oneofs: true
        });


        // 补充对 interfaceParams 数组的特殊格式校准，防止 toObject 空字段丢失
        const jsonStr = JSON.stringify(jsonObject, null, 2);
        await fs.writeFile(path.join(outputDir, item.jsonName), jsonStr, 'utf-8');
        audit.push(`  - Generated ${item.jsonName}: ${jsonStr.length} chars`);
      } catch (err) {
        audit.push(`ERROR: Failed to decode ${item.modelName}: ${err}`);
      }
    }
  }

  return audit;
}
