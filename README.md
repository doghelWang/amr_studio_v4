# AMR Studio V4 - 工业级机器人建模平台

AMR Studio V4 是一款面向工业级自动移动机器人（AMR）设计的高级配置平台。它打通了从底层二进制协议（Protobuf）到高层可视化交互的链路，实现了 100% 位对齐的无损编解码。

## 🚀 重要更新 (2026-03-22)
- **100% 无损闭环**：通过 `always_print_fields_with_no_presence` 与 `Last-Mile Normalization` 策略，彻底解决了导出文件缩水问题。
- **结构保真构建**：实现“原树注入”引擎，确保生成的 `.cmodel` 与原始模型拥有完全一致的拓扑结构。
- **UI 深度优化**：
  - **视觉分层**：重构了底盘参数、组件库、属性面板，彻底解决了背景网格干扰。
  - **递归编辑**：支持 `DATA_COMBOX` 下拉框的深度关联属性实时编辑与同步。
- **AI 核心框架**：在 `.gemini/` 目录下建立了专属于本项目的 `Soul`（行为准则）与 `Skills`（专业能力库）。

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

## 📜 维护约束 (Development Rules)
- **协议唯一性**：前后端数据交换必须对齐官方 CamelCase 规范。
- **文档同步**：每次更新后必须同步维护 README 文件。
- **隐私保护**：严禁在文档中包含个人敏感信息（如姓名）。

---
**AMR 设计工程师团队 & Gemini AI 联合出品**
