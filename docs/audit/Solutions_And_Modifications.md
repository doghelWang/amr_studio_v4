# 方案清单与修改记录

## 1. 核心技术方案 (Solution List)
| 方案名称 | 核心逻辑 | 目的 |
|:---|:---|:---|
| **碎片化增量同步** | 前端 Patch 全量分支，后端 Key 匹配合并 | 极速同步且保持无损 |
| **结构保真构建 (Fidelity Build)** | 基于原始 Blueprint 注入 Patched JSON | 100% 还原物理拓扑结构 |
| **贪婪解析映射** | ImportService 同时尝试 SnakeCase 和 CamelCase | 最大化协议兼容性 |
| **全链路穿透审计** | 每一环节输出字节数与内容 Snipe 日志 | 极速定位数据流失节点 |

## 2. 方案修改记录 (Revision History)
- **2026-03-22 15:00**: 初始方案使用 SnakeCase 标准。
- **2026-03-22 17:30**: 发现 Protobuf 解析工具（实践侧）只认 CamelCase，**全链路切换至 CamelCase**。
- **2026-03-22 18:45**: 发现扁平化导出破坏了标准工具的解析，推出 **“结构保真注入 (Fix-24)”** 方案。
- **2026-03-22 19:15**: 固化 `docs/ENGINEERING_CONSTRAINTS.md` 开发约束。
