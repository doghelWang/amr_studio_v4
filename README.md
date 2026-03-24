# AMR Studio V4 - 工业级机器人建模平台

AMR Studio V4 是一款面向工业级自动移动机器人（AMR）设计的高级配置平台。它打通了从底层二进制协议（Protobuf）到高层可视化交互的链路，实现了 100% 位对齐的无损编解码。

## 🚀 重要更新 (2026-03-25) - V4.2 Professional Implementation
- **全新引导式欢迎页 (Onboarding)**：
  - 增加了直观的 `WelcomeScreen`，支持"新建模型"与"导入已有机型"的双向流转。
  - 侧边栏支持随时"新建项目"完全重置状态。
- **回归 7 步标准向导 (Step-7 Wizard)**：
  - 整合动力系统入底盘参数 Tab 页，恢复工业标准的 7 步法。
  - **组件库精细过滤 (4d/4e)**：实现了基于关键词 (`encode`/`encoder`) 的多维度系统间组件共享与排除逻辑。
- **IO 扩展板全量映射**：解决了后端 JSON 笔误导致的分类丢失，通过 `CATEGORY_MAP` 增强实现了 100% 硬件可见性。
- **动力拓扑结构可视化**：在底盘参数页集成了 Wheel-Centric 拓扑树，支持差速、单/双舵、全向轮组的直观配置。

## 🚀 历史更新 (2026-03-24) - V4.1 Professional Implementation
- **9步法初步尝试**：验证了分步装配可行性。
- **属性面板 Store-First**：由后端拉取改为 Zustand Store 优先，解决离线模式下属性空白。
- **100% 无损闭环 (V4.0)**：通过 `always_print_fields_with_no_presence` 解决了导出收缩问题。

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
