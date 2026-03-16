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

### 🪟 Windows (Recommended)
1. **环境准备**: 确保已安装 Python 3.10+ 和 Node.js 18+。
2. **一键启动**: 双击 `start_all.bat` (建议以管理员权限运行)。
3. **验证**: 脚本会自动通过 `netstat` 检查 8002 (后端) 和 3001 (前端) 端口。

### 💻 手动启动指令 (Manual Startup Commands - For Debugging)
如果一键脚本运行异常，请分别启动以下服务：

1.  **后端服务 (FastAPI) - Port 8002**:
    ```bash
    cd backend
    # 创建环境 (仅首次)
    python -m venv venv
    venv\Scripts\activate  # Windows
    # source venv/bin/activate  # macOS/Linux
    pip install -r requirements.txt
    # 启动
    python main.py
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

*   **统一访问入口**: [http://localhost:8002](http://localhost:8002) (生产/托管模式)
*   **开发调试入口**: [http://localhost:3001](http://localhost:3001) (前端 HMR 实时预览)

---

## 🛠 系统优化总结 (Technical Optimization Summary)

### 💎 Deep Alignment (v4.5/4.6 - Latest)
1. **Protobuf 深度保真**: 实现了基于 **Template-Based Injection** 的属性注入，确保生成的 `.cmodel` 与 312 工业原型在字节级对齐。
2. **Schema 动态修补**: 后端引擎支持对未知工业字段（10-56）进行**递归 Patching**，解决了 `KeyError` 和 `ValueError` 导致的解析中断。
3. **IEEE-754 数值精度控制**: 通过 `fixed64` 强制编码，确保空间坐标（locCoordX/Y）及速度参数在反序列化后与原始数据完全一致。

### 🛠 自动化分析技能 (Analysis Skills)
1. **CModel 解压与反序列化**: 新增 `skills/cmodel_unzip` 和 `skills/model_deserializer`，支持一键还原二进制模型为可读 JSON。
2. **结构化树分析**: `skills/model_tree_analyzer` 可自动生成 Markdown 格式的硬件拓扑报告，清晰展现 `Identity`, `Attributes`, `Interfaces` 及层级关系。

### 后端优化 (Backend)
1. **Hybrid-Sync 2.0**: 实现了基于“基因底座”的按需修补算法。生成时不再抹除未识别模块，而是原样保留。
2. **Scavenger 3.0 语义解析**: 对 312 超大模型实施 **Strings 语义扫描+滑动窗口指纹匹配**，解析效率提升至 **12ms**。

### 前端优化 (Frontend)
1. **统一命名空间**: 建立了全系统硬件模块的 "ID | Alias" 命名体系。
2. **渲染性能截断**: 对原始报文树实施深度截断，确保超大模型报文不会导致浏览器主线程阻塞。

---

## 🌤 环境信息
> **状态更新**: 312 系列 Deep Alignment 审计已完成。团队目前已掌握 100% 数据對齐的技术路径。

## 📢 架构师回执
> **已完成目标**：完成 312 工业模型的数据对齐审计，建立了完整的反序列化分析工具链。
> **承诺**：后续重构将严格遵循“深度模板合并”逻辑，确保外设（MCU/IO）接口分布 100% 还原。

## 📚 延伸阅读 (Further Reading)
- [🔍 312 系列机器模型深度对齐审计报告 (v4.6)](docs/312_alignment_audit_summary.md)
- [🔍 312 真机解析报告 (全节点结构)](docs/312_output/REF_MQ-Q3_Analysis.md)
- [🔍 ModuleLibrary 架构审查与优化方案 (Approved)](docs/ModuleLibrary_Optimization_Plan.md)
- [硬件规格详细设计说明书](docs/detailed_spec.md)

---
*Last Updated: 2026-03-16*
