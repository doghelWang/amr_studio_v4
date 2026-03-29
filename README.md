# AMR Studio V4 - 工业级机器人建模平台

AMR Studio V4 是一款专为自动移动机器人（AMR）设计的高级配置与建模平台。它实现了从语义化描述文件到底层工业协议（Protobuf）的双向无损转换。

## 🚀 核心特性 (Latest Updates)
- **单一真理数据引擎 (Schema-Driven Engine)**:
  - 弃用大量前端属性硬编码，全面对接 `ModuleLibrary/PrivateAttribute.json`，实现 **JSON to UI** 的全自动渲染。
  - 引入了 `Engineering Constraints (工程约束)` 层，实现物理互斥显示、自动组合枚举值及深度属性联动同步。
- **先进底盘动力模型拓扑搭建 (Advanced Power Topology)**:
  - 完美支持 **差速底盘 (diffChassis)** 与 **舵轮底盘 (steerChassis)** 两种核心模型。
  - 完整适配 **轮组模式推导**:
    - `diffWheel` (单电机直连)
    - `horizontalSteerWheel` / `verticalSteerWheel` (行走+转向双电机)
    - `diffSteerWheel` (差速双驱+外置绝对值转向反馈编码器)
- **工业级 CModel 封包引擎 (Industrial CModel Packing)**:
  - **FAT32 兼容性锁死**：强制剥离 MacOS/Unix 系统属性，保障 ZIP 成果物能在任何标准工业终端上无缝解压。
  - **比特级序列化 (Bit-Perfect Naked Stream)**：跳过冗余顶层包装，实现以 Tag 5 (`more_module_info`) 起始的底层数据流对齐。
  - **全链路清单防篡改**：在封包写入磁盘瞬间实时生成 `ModelFileDesc.json` 并计算 MD5，包含完整的 CompDesc, AbiSet, FuncDesc。
- **动力系统聚合向导 (Unified Power Wizard)**：
  - 将“动力配置”由独立步骤外迁并融入 **Step 2 (底盘配置)**，实现“底盘-轮组-电气”的一站式定义。
  - 新增 **2D 布局实时预览 (SVG Visualizer)**，直观反馈轮组安装位姿与运动中心偏移。
- **智能互联体验 (Parametric Syncing)**：
  - 开启 "修改参数自动同步" 功能，调整单个轮组（或其电机/编码器）参数能顺滑下发至系统配置森林中其他同类装备。
  - 数据模型联动 `onAttributeChange` 与 UUID 引用 (`bindWheelReference`) 全量对接，保障最终构建可无缝导入协议。

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
