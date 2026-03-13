# AMR Studio Pro V4

工业级自主移动机器人（AMR）配置与模型生成平台。支持全维度硬件建模、实时协议校验及标准 `.cmodel` 成果物无损导出。

## 🚀 快速启动 (Quick Start)

我们提供了跨平台的自动化部署方案，请根据您的操作系统选择：

### 🍎 macOS / Linux
```bash
# 赋予执行权限
chmod +x *.sh

# 一键启动全栈服务（前端+后端+哨兵）
./start_all.sh

# 检查服务健康度
./check_health.sh
```

### 🪟 Windows
```batch
:: 双击运行以下脚本即可
start_all.bat

:: 检查运行状态
check_health.bat
```

*   **前端入口**: [http://localhost:3001](http://localhost:3001)
*   **后端 API**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ✨ 核心特性

1.  **工业标准 `.cmodel` 对齐**: 生成的文件完全符合最新的二进制规范，支持直接在生产环境部署。
2.  **无损导入与基因底座**: 支持拖拽导入 `.cmodel` 文件，通过“外科手术式”打补丁技术，100% 保留所有厂设/非标自定义模块（如定制电机、按钮等）。
3.  **高性能深度解析**: 升级版 `ModelParser` 采用 BFS 算法，支持秒级解析大型工业模型，彻底解决 UI 卡死问题。
4.  **Raw Inspector (原始报文树)**: 提供透明化的二进制协议查看器，让每一条 Tag 数据都清晰可见。
5.  **24H 自动化哨兵**: 内置 Sentinel V7 Pro，每分钟监听需求变更，每半小时执行全量回归测试并同步 GitHub。

## 📦 预置模型成果物
位于 `gemini_audits/` 目录下，支持差速、单舵、双舵、四舵四种标准底盘构型。

---

## 🌤 环境信息
> **今天的天气信息**: 晴朗 (System Mode) - 全系统已适配 Windows/macOS 双端部署。

---
*Last Updated: 2026-03-12*


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 07:34:54


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 08:04:59
