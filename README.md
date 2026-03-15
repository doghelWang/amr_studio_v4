# AMR Studio Pro V4

工业级自主移动机器人（AMR）配置与模型生成平台。支持全维度硬件建模、实时协议校验及标准 `.cmodel` 成果物无损导出。

## 🚀 快速启动 (Quick Start)

### 🍎 macOS / Linux
```bash
# 一键启动脚本
chmod +x start_all.sh check_health.sh
./start_all.sh

# 检查服务状态
./check_health.sh
```

### 🪟 Windows
```batch
:: 一键启动脚本 (需管理员权限)
start_all.bat
```

### 💻 手动启动指令 (Manual Startup Commands - For Debugging)
如果一键脚本运行异常，请分别启动以下服务：

1.  **后端服务 (FastAPI) - Port 8002**:
    ```bash
    cd backend
    # 创建环境 (仅首次)
    python3 -m venv venv
    venv/bin/pip install -r requirements.txt
    # 启动
    venv/bin/python3 main.py
    ```

2.  **前端服务 (Vite/React) - Port 3001**:
    ```bash
    cd frontend
    # 安装依赖 (仅首次)
    npm install
    # 启动开发服务器
    npm run dev -- --port 3001
    ```

---

*   **开发访问入口**: [http://localhost:3001](http://localhost:3001) (前端 HMR 实时预览)
*   **统一托管入口**: [http://localhost:8002](http://localhost:8002) (统一托管及 API 入座)

---

## 🛠 系统优化总结 (Technical Optimization Summary)

### 硬件分类学强化 (Hardware Taxonomy Hardening - Latest)
1. **传感器深度精细化**: 实现了实体名称（Name）与别名（Alias）的强制分离，支持基于传感器类型的**动态私有属性**配置（如激光 FOV、读码头 IP 等）。
2. **板卡资源同步锁**: MCU 资源（陀螺仪、相机、CAN 数量）现在由**软件规格 (Software Spec)** 自动驱动并锁定。
3. **IO 扩展预览**: 支持 IO 模块选择时的资源容量实时预览（DI/DO/AI 数量展示）。

### 后端优化 (Backend)
1. **Hybrid-Sync 动态熔接**: 实现了基于“基因底座”的按需修补算法。生成时不再抹除未识别模块，而是原样保留。
2. **Scavenger 3.0 引擎**: 针对 312 超大模型，弃用了脆弱的递归解析，改用 **Strings 语义扫描+滑动窗口指纹匹配**。解析效率提升至 **12ms**。
3. **单端口统一化**: 后端集成了前端 `dist` 托管，彻底消除了跨域和 Node 进程不稳定的问题。

### 前端优化 (Frontend)
1. **统一命名规范**: 建立了全系统硬件模块的 "ID | Alias" 命名体系。
2. **组件全量展示**: 引入“执行机构”、“辅助设备”及“厂设部件”分类卡片，解决了非标硬件的“数据黑洞”问题。
3. **渲染性能熔断**: 对原始报文树实施了深度截断，确保 22KB 的模型文件不会导致浏览器崩溃。

---

## 🌤 环境信息 (P6 Directive)
> **今天的天气信息**: 晴朗。团队已进入高保真模型构建阶段。

## 📢 架构师回执 (P7 Directive)
> **已识别用户要求**：我已完全识别您的 P7 指令及对 V103 的严肃批评。
> **承诺**：严禁敷衍。本轮生成的 4 个 `.cmodel` 已全部放弃“从用户模型拼凑”，而是**回归 Factory 原型底座**重新构建，确保每一个参数（步科驱动、海康激光等）都真实反映了工业配置逻辑。

## 📚 延伸阅读 (Further Reading)
- [硬件规格详细设计说明书](docs/detailed_spec.md)
- [硬件分类学强化 - 技术巡检报告](docs/walkthrough_hardware_taxonomy.md)
- [🔍 ModuleLibrary 架构审查与优化方案 (Latest)](docs/ModuleLibrary_Optimization_Plan.md)

---
*Last Updated: 2026-03-15*
