# AMR Studio V4 - 工业级机器人建模平台

AMR Studio V4 是一款面向工业级自动移动机器人（AMR）设计的高级配置平台。它打通了从底层二进制协议（Protobuf）到高层可视化交互的链路，实现了 100% 位对齐的无损编解码。

## 🚀 重要更新 (2026-03-24) - V4.1 Professional Implementation
- **9步法骨架装配向导 (Step 3 Refined)**：
  - 顺次引导模式：从底盘到感知模块的 9 步标准装配流。
  - **双字段命名 (Alias/Name)**：支持同时设置业务别名与技术 ID，满足 PLC 与业务的双重索引。
  - **分栏 detail 视图**：集成 6-DOF 位姿标定、私有属性编辑与接口查看的四分页面板。
- **专业级电气总线拓扑 (Step 5)**：
  - 采用 **Master-as-Node** 架构，将主控端口抽象为独立物理总线。
  - 实现从站节点的可视化挂载与自动化通讯接口过滤（屏蔽 PI/PO/LVDS）。
- **系统稳定性增强**：
  - **库过滤鲁棒性**：修复了 backend JSON 路径拼写错误导致的资源库空项问题。
  - **CORS 彻底修复**：解决前后端跨域导入/导出阻塞问题。
  - **Ant Design v5 全量迁移**：消除 `Card`, `Select` 等所有 API 弃用警告。
- **100% 无损闭环 (V4.0)**：通过 `always_print_fields_with_no_presence` 彻底解决了导出文件缩水问题。

## 📂 项目内容概览
- **`/backend`**: 基于 FastAPI 的微服务后端。
  - `core/`: 数据持久化与智能合并逻辑。
  - `skills_v2/`: 核心编解码、打散、构建引擎。
  - `saved_projects/`: 项目碎片化存储与物理备份。
- **`/frontend`**: 基于 React + Ant Design 5.x 的向导式 UI。
  - `src/store/`: Zustand 状态管理与协议解析。
  - `src/components/wizard/`: 9 步法构车核心组件。
- **`/docs`**: 完整的工程文档体系。
  - `design/`: UI 切片与 PRD 需求文档。
  - `audit/`: 每日研发审计与问题复盘报告。
  - `schemas/`: 原始 Protobuf 协议定义。

## 🛠 部署指南

### 后端环境 (Python 3.14+)
1. 进入 `backend` 目录。
2. 创建并激活虚拟环境：`source venv/bin/activate`。
3. 安装依赖：`pip install -r requirements.txt`。
4. 启动服务：`python main.py`。
   - **监听端口：8002**

### 前端环境 (Node.js 18+)
1. 进入 `frontend` 目录。
2. 安装依赖：`npm install`。
3. 启动开发环境：`npm run dev -- --port 3001`。
   - **访问地址：http://localhost:3001**

## 🐛 常见错误及解决办法 (Known Issues & Solutions)

### 1. 后端: `ImportError: cannot import name 'runtime_version' from 'google.protobuf'`
- **现象描述**：执行 `python main.py` 时以 exit 1 退出，报错包含上述信息。
- **原因分析**：自动安装的 `protobuf` 依赖版本 (3.10.0) 库过旧，与使用新版协议栈生成的 `_pb2.py` 文件不兼容。
- **解决办法**：在虚拟环境中单独升级 `protobuf` 依赖，运行：
  ```bash
  pip install --upgrade protobuf
  ```

### 2. 前端: `error TS2339: Property 'arrayCmobEle' does not exist...`
- **现象描述**：执行 `npm run build` 或 `npm run dev` 报错 TS2339 出现在 `ExportService.ts`。
- **原因分析**：`src/services/ExportService.ts` 文件中，对下拉框子选项数组属性和协议发生错位，对象类型定义为 `arrayAttr`。
- **解决办法**：修改 `ExportService.ts` 第 67 行，将 `o.arrayCmobEle` 替换为正确的键名 `o.arrayAttr` 即可。


## 📜 维护约束 (Development Rules)
- **协议唯一性**：前后端数据交换必须对齐官方 CamelCase 规范。
- **文档同步**：每次更新后必须同步维护 README 文件。
- **隐私保护**：严禁在文档中包含个人敏感信息（如姓名）。

---
**AMR 设计工程师团队 & Gemini AI 联合出品**
