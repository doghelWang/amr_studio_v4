# AMR Studio V4 后端废弃代码归档删除验证报告

## 1. 验证目标

确认后端活动功能已完全不依赖历史兼容目录；在可追溯归档后删除源文件，并通过编译、测试、前端构建、真实模型往返和独立 Skill 验证确认功能未受影响。

本报告只记录可复现结果，不根据目录名称推断代码是否无用。

## 2. 删除范围

- `src/backend/core`
- `src/backend/skills_v2`
- `src/backend/app/services`
- `src/backend/app/legacy`
- `src/backend/skills`
- `src/backend/schemas`
- `src/backend/templates`
- `src/backend/package_templates.py`
- `src/backend/factory_template.zip`

保留的 `src/backend/app/schemas` 是当前 HTTP DTO，不属于删除范围。

## 3. 删除依据

- 活动代码、测试、系统审计脚本和项目级 cmodel Skill 已迁移到 `app.application`、`app.domain`、`app.infrastructure`。
- 排除归档和 Markdown 后，全仓搜索未发现 `core`、`skills_v2`、`app.services`、`app.legacy` 的活动导入。
- canonical 后端模块编译通过，13 个主要模块导入通过。
- 删除前后均执行了完整后端回归、前端生产构建和真实模型 protobuf 语义验证。

## 4. 删除前验证

- 后端：`62 tests / 62 passed`。
- 前端：TypeScript 与 Vite 生产构建通过。
- 真实模型：`/Users/wangfeifei/Downloads/0323.cmodel`。
- 流程：protobuf 解码 -> `CompDesc` 拆分 -> protobuf 编码 -> 再解码。
- `CompDesc.json`、`AbiSet.json`、`FuncDesc.json` 均语义相等。

## 5. 归档验证

- 归档文件：`artifacts/archives/backend_deprecated_code_before_removal_20260802.zip`
- 清单：`artifacts/archives/backend_deprecated_code_before_removal_20260802.manifest.txt`
- SHA-256 文件：`artifacts/archives/backend_deprecated_code_before_removal_20260802.sha256`
- 条目数：102
- 文件大小：92080 bytes
- SHA-256：`e7c66a0d802ef5177d29028440475c21b5d2d8426c5501f0831b01d90a8a610f`
- `unzip -t`：通过，无压缩数据错误。

## 6. 删除后验证

### 编译和依赖边界

- canonical 后端 `compileall`：通过。
- 13 个 canonical 主模块导入：通过。
- 废弃目录不存在性测试：通过。
- 活动旧路径导入扫描：0 条。

### 后端回归

```bash
PYTHONPATH=src/backend src/backend/.venv310/bin/python \
  -m unittest discover -s tests/unit -p 'test_*.py'
```

结果：`63 tests / 63 passed`。

### 前端构建

```bash
cd src/frontend && npm run build
```

结果：TypeScript 和 Vite 构建通过，3188 个模块完成转换。现有单 chunk 超过 500 kB 警告仍存在，但不影响本次构建成功结论。

### 真实模型语义往返

- 源文件：19196 bytes。
- 输出文件：19194 bytes。
- `CompDesc.json`：语义相等。
- `AbiSet.json`：语义相等。
- `FuncDesc.json`：语义相等。

两字节大小差异来自 ZIP 容器压缩或元数据编排，不代表 protobuf 字段差异。

### 独立解析 Skill

`amr-cmodel-reader` 使用 canonical protobuf 路径解析 `0323.cmodel` 成功，输出 `summary.json`、8 类 CSV 和 Excel 工作簿。解析事实包括：20 个组件、23 条连接、0 个连接目标缺失、2 个组件能力、5 个功能能力、13 个功能节点。

Reader 和 Pipeline 的 `.skill` 包已按迁移后的代码及文档重新打包，并通过 `unzip -t`。

## 7. 结论与剩余边界

已验证的后端、前端构建、真实模型无编辑往返和独立解析 Skill 均不依赖已删除目录。废弃源码已完成可校验归档，活动源码树不再保留兼容双轨。

本次结论不扩展为“所有人工编辑场景均已证明无损”。安装坐标、连线编辑和复杂属性增量修改仍应继续依赖相应专项回归，不得仅由无编辑 round-trip 推断。
