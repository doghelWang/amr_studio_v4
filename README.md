# AMR Studio V4 - 工业级机器人建模平台

AMR Studio V4 是一款专为自动移动机器人（AMR）设计的高级配置与建模平台。它实现了从底层工业级二进制固件（.cmodel）到高层可视化配置界面的双向无损转换，支持复杂的传感器拓扑、执行器参数及能力集映射。

## 🚀 项目核心愿景
- **100% 结构保真**：确保模型在“导入-编辑-导出”循环中保持原始物理拓扑结构不变。
- **协议驱动开发**：深度对齐 Protobuf 3 协议，支持 12 种原生数据类型及深层嵌套属性。
- **原子化碎片存储**：采用 Blueprint + Module 碎片化管理，支持多并发局部 Patch 更新。

## 📊 当前研发进展 (截止 2026-03-22)
- [x] **无损编解码引擎**：成功解决 `including_default_value_fields` 导致的字节流失问题。
- [x] **结构保真构建 (Fidelity Build)**：实现“原树注入”策略，解决导出后层级脱臼问题。
- [x] **全深度属性编辑**：支持电机减速比、驱动类型（COMBOX）等三层嵌套属性的实时同步。
- [x] **全链路审计系统**：内置控制台字节级日志，支持导入导出环节的物理数据量对账。
- [ ] **遗留挑战**：特定下拉框（COMBOX）在标准检查工具中的语义兼容性最后验证。

## 🛠 部署指南

### 环境要求
- **Backend**: Python 3.9+ (推荐 3.14), Google Protobuf 库
- **Frontend**: Node.js 18+, Vite, React 18, Ant Design 5.x

### 后端启动 (FastAPI)
1. 进入 backend 目录。
2. 激活虚拟环境：`source venv/bin/activate` (MacOS/Linux) 或 `venv\Scripts\activate` (Windows)。
3. 安装依赖：`pip install -r requirements.txt`。
4. 运行服务：`python main.py`。
   - 默认端口：**8002** (可在 main.py 修改)。

### 前端启动 (React)
1. 进入 frontend 目录。
2. 安装依赖：`npm install`。
3. 启动开发服务器：`npm run dev -- --port 3001`。
4. 浏览器访问：`http://localhost:3001`。

### 建模工作流
1. **导入**：点击左下角“导入 .cmodel”，选择原始模型。
2. **编辑**：在 7 步向导中修改参数（数值、下拉框、坐标）。
3. **审计**：查看开发者控制台 (F12) 的 `📊 Audit Log`。
4. **导出**：点击“导出配置”，下载生成的 `.cmodel`。

## 📜 规则与约束
所有开发必须遵循 `docs/ENGINEERING_CONSTRAINTS.md` 中的协议对齐与并发安全规范。
