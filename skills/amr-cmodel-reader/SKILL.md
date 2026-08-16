---
name: amr-cmodel-reader
description: "Parse and understand AMR Studio V4 .cmodel files. Use when asked to decode .cmodel files with protobuf headers/generated pb2 schemas, classify AMR modules by organization structure, and export Excel-style reports covering device lists, mounting positions, private attributes, electrical connections, electrical attributes, abilities, FuncDesc function blocks, diagnostics, or compare parsed model facts without generating a new model."
---

# AMR CModel Reader

This skill is only for reading, decoding, understanding, auditing, and summarizing existing `.cmodel` files. Do not use it to generate new `.cmodel` files; use `amr-cmodel-builder` for generation.

## Required Rules

- Use protobuf-backed parsing from AMR Studio V4 when possible.
- Relevant schema/runtime paths:
  - `src/backend/app/infrastructure/protobuf/generated/controller_model_comp_desc_pb2.py`
  - `src/backend/app/infrastructure/protobuf/generated/controller_model_abi_set_pb2.py`
  - `src/backend/app/infrastructure/protobuf/generated/controller_model_abi_desc_pb2.py`
  - `src/backend/app/infrastructure/protobuf/cmodel_decoder.py`
- Do not fabricate missing device descriptions, parameters, interface types, connections, abilities, or function nodes.
- Preserve source values exactly, including empty strings, zero, false, UUIDs, interface UUIDs, and empty arrays.
- Treat `proj*` files as possible debug or invalid artifacts unless the user confirms they are reference models.
- Read `references/reader-rules.md` when modifying code or producing formal reports.

## Workflow

1. Locate `.cmodel` input files and classify them by source.
2. Parse with one of these methods:
   - Remote/local backend API: `POST /api/v1/models/upload`.
   - Local protobuf decoder: `src/backend/app/infrastructure/protobuf/cmodel_decoder.py`.
3. Extract facts from decoded JSON:
   - Devices from `CompDesc.moreModuleInfo[].moduleComponets[]`.
   - Mounting from `structParam.extendParams.locCoordX/Y/Z/ROLL/PITCH/YAW` and `parentNodeUuid`.
   - Connections from `interfaceParams.interfaceGroup[].linkedInterfaceUuid`.
   - Private attributes from `privateAttr.privateAttrs`.
   - Electrical attributes from interface facts and interface attrs/params.
   - Abilities from `AbiSet.componentAbility` and `AbiSet.functionAbility`.
   - Functions from `FuncDesc.function[]` and nested `childFunction`.
4. Resolve `linkedInterfaceUuid` by indexing all `interfaceUuid` values.
5. Classify modules into AMR organization buckets based on source `mainModuleType/subModuleType`, not name guessing:
   - 底盘
   - 驱动单元
   - 传感器
   - 电池
   - IO模块
   - 控制器
   - 显示屏
   - 扬声器
   - 灯带
   - 按钮
   - 执行器
   - 未分类
6. Produce a summary and Excel workbook with diagnostics, never inferred replacements.

## Script

Use the bundled script for repeatable parsing and summary generation:

```bash
python3 skills/amr-cmodel-reader/scripts/read_cmodel.py \
  --input /path/to/model-or-directory \
  --out analysis/cmodel_reader_out \
  --api http://116.62.39.177:8888/api/v1 \
  --xlsx
```

For local protobuf decoding, pass the project root:

```bash
python3 skills/amr-cmodel-reader/scripts/read_cmodel.py \
  --input /path/to/model.cmodel \
  --out /tmp/read_one \
  --project-root /path/to/amr_studio_v4
```

Outputs:

- `summary.json`
- `amr_cmodel_report.xlsx` when `--xlsx` is set and `openpyxl` is available
- `model_index.csv`
- `amr_structure.csv`
- `components.csv`
- `mounting.csv`
- `private_attributes.csv`
- `connections.csv`
- `electrical_attributes.csv`
- `functions.csv`

Workbook sheets:

- `模型总览`
- `AMR组织结构`
- `器件清单`
- `安装位置`
- `私有属性`
- `电气连接关系`
- `电气属性`
- `功能块描述`
- `诊断`
