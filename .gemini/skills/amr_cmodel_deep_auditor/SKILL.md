# Skill: AMR-CModel-Deep-Auditor

## 1. 技能概述
本技能专用于针对生成的 `cmodel` 执行 100% 工业级合规审计与全链路溯源分析。其核心目标是确保导出的成果物在物理封包、协议结构及业务语义上与官方标准（如 `ModelSet312.cmodel`）实现比特级（Bit-Perfect）对齐。

## 2. 核心职责与操作流程 (Mandatory Workflow)

### 阶段 1：数据树解构与模块匹配 (Tree Mapping)
- **提取内容树**：使用解码器对标准与生成物进行高精度还原，获取 Tag 字典 JSON。
- **模块节点对齐**：匹配 `moduleGroupName` 与 `typeKey`，输出《模块节点清单》。
- **属性差异分析**：针对同类模块，逐行对比 Tag 缺失或层级错位，输出《属性字段差异表》。

### 阶段 2：后端溯源与数据流验证 (Backend Tracing)
- **数据源核查**：追踪 `user_saves` 原始数据，确认字段是否在录入环节已丢失。
- **映射路径分析**：评估 `resource_adapter.py` 是否发生静默丢弃，输出《前后端对应关系差异表》。

### 阶段 3：前端录入盲区审计 (Frontend Auditing)
- **逆向逻辑推演**：分析 `useProjectStore.ts` 和 `SchemaEngine.ts` 的组件构建过程。
- **盲点确认**：定位 UI 阶段的数据构造错误或冗余包装（如 `LibraryGroup` 问题）。

### 阶段 4：四维全链路穿透复盘 (Four-Dimensional Review)
- 从 **前端构造、后端存储、编码前归一化、压缩封包** 四个维度输出复盘结论。
- 输出交付物：模块演进表、属性生命周期表、维度综合差异结论。

### 阶段 5：根因定位与修复指导 (Root Cause & Guidance)
- **精确切片**：指出差异产生的具体函数块（文件 + 行号）。
- **优化设计**：给出基于工业标准的重构建议（如：Tag 偏移校准、MD5 动态计算等）。

## 3. 核心工具与物理路径
- **高精度解析器**: `scripts/true_parser_impl.py`
- **物理层检查工具**: `zipinfo`, `xxd`, `hashlib (Python)`
- **审计存档目录**: `docs/audit/YYYYMMDD_review/`

## 4. 操作约束
- **零猜想原则**：所有审计结论必须有物理 Hex 或解析 JSON 源码作为证据链路支撑。
- **动态性要求**：清单文件（ModelFileDesc.json）必须采用内存动态生成，禁止读取旧磁盘缓存。
- **物理头锁死**：在 MacOS 环境下必须强制生成 FAT32/MS-DOS 兼容的 ZIP 结构。

## 5. 调试指令
- 执行自证测试：`curl -s -X POST "http://127.0.0.1:8002/api/v1/models/{project_id}/compile"`
- 物理头核查：`zipinfo {file_path} | grep "fat"`
- 起始 Tag 核查：`unzip -p {file_path} CompDesc.model | head -c 8 | xxd -g 1`
