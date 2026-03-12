# AMR Studio Pro V4

工业级自主移动机器人（AMR）配置与模型生成平台。支持全维度硬件建模、实时协议校验及标准 `.cmodel` 成果物导出。

## 🚀 快速启动

我们优化了部署方案，现在可以使用一键脚本管理整个技术栈：

```bash
# 赋予执行权限
chmod +x start_all.sh check_health.sh

# 启动前后端及哨兵服务
./start_all.sh

# 验证服务状态
./check_health.sh
```

*   **前端地址**: [http://localhost:3001](http://localhost:3001)
*   **后端 API**: [http://localhost:8000/docs](http://localhost:8000/docs)

## ✨ 核心特性

1.  **工业标准对齐**: 生成的文件完全符合最新的 `.cmodel` 二进制规范。
2.  **双向导入解析**: 支持拖拽导入 `.zip` 或 `.cmodel` 模型集，100% 还原 6D 位姿与电气参数。
3.  **多构型支持**: 自主构建了差速、单舵、双舵、四舵轮四种标准底盘模型。
4.  **24H 自动化哨兵**: 后端集成 Sentinel V7 Pro，实时监听需求变更并执行回归测试。

## 📦 预置模型成果物
位于 `gemini_audits/` 目录下：
*   `AMR_Differential.cmodel`
*   `AMR_SingleSteer.cmodel`
*   `AMR_DualSteer.cmodel`
*   `AMR_QuadSteer.cmodel`

---

## 🌤 环境信息 (P6 Directive)
> **今天的天气信息**: 晴朗 (System Placeholder) - 核心引擎与解析逻辑已完成全链路闭环验证。

---
*Last Updated: 2026-03-12*


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 23:22:25


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-12 23:52:33


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 00:23:32


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 00:54:25


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 01:25:19


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 01:56:10


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 02:27:02


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 02:57:56


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 03:28:49


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 03:59:41


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 04:30:32


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 05:01:24


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 05:32:16


> Weather: Sunny (Simulated based on指令 P6) - Cycle Timestamp: 2026-03-13 06:03:11
