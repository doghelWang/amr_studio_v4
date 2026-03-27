# AMR Studio V4 - 工业级机器人建模平台

AMR Studio V4 是一款专为自动移动机器人（AMR）设计的高级配置与建模平台。它实现了从语义化描述文件到底层工业协议（Protobuf）的双向无损转换。

## 🚀 核心特性 (Latest Updates)
- **双态资源引擎 (Hybrid Engine)**：
  - 支持 **XML (语义化描述)** 与 **JSON (协议原生)** 双格式资源载入。
- **动态动力拓扑 (Live Topology)**：
  - 新增 `PowerTopologyPanel`，实时可视化“轮组-驱动-电机-编码器”的电气与机械关联。
- **高鲁棒性向导 UI**：
  - 9 步法构车流程，支持“底盘-控制-动力-感知”的严谨装配逻辑。
  - 内置“手动创建”入口，支持快速添加已有类别的自定义组件。
- **模型导出与总线扩展**：
  - 支持导出标准的 `.cmodel` (CompDesc JSON) 文件。
  - 扩展了 `RS485` 与 `NETWORK` (Ethernet) 总线类型支持。
- **2.5D 可视化空间标定**：
  - 支持传感器 FOV、轮组运动方向的 CAD 级可视化反馈。

### 融合部署 (Unified Deployment - 推荐)
> 适用于 Linux/mac 环境，一键启动全栈服务。
1. **执行启动脚本**:
   ```bash
   python3 start.py --host 0.0.0.0 --port 8002
   ```
   *脚本将自动执行 npm build 并由 FastAPI 托管静态资源。*

### 分离开发部署 (Decoupled Dev)
> 适用于前端开发调试场景。
- **后端**: `cd backend && python3 main.py` (Port: 8002)
- **前端**: `cd frontend && npm run dev` (Port: 3000/3001)

## 📂 项目结构
- `backend/resources/modules/`：工业组件资源池 (XML/JSON)。
- `backend/core/resource_adapter.py`：双态转换核心适配器。
- `.gemini/`：AI 首席工程师的灵魂（Soul）与技能（Skills）定义。

## 📜 维护约束 (Mandatory Rules)
- **隐私保护**：严禁在 README 或公开文档中包含个人敏感信息（如姓名）。
- **无损性**：任何 UI 优化不得改变底层数据格式。
- **同步要求**：每次代码重大更新后必须同步更新本 README 文件的部署指南。

---
**AMR 设计工程师团队 & Gemini AI 联合出品**
