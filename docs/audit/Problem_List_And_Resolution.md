# 问题清单与解决情况表 (2026-03-22)

## 1. 核心技术故障 (Issues)
| 问题描述 | 影响 | 解决状态 | 解决方案 |
|:---|:---|:---:|:---|
| **数据体积大幅缩水** | 导出文件丢失 80% 信息 | ✅ 已解决 | 开启 `always_print_fields_with_no_presence` 包含默认值 |
| **深层嵌套属性修改无效** | 电机减速比等字段无法更新 | ✅ 已解决 | 升级后端 `deep_update` 算法支持按 Key 匹配列表项 |
| **构建过程 UI 卡死** | 请求 `compile` 时后端无响应 | ✅ 已解决 | 将阻塞的 `async def` 改为线程池运行的同步 `def` |
| **下拉框修改不生效** | 标准工具识别不到变更 | 🟡 修复中 | 采用“结构保真注入”策略并强制 CamelCase 对齐 |
| **导入后组件列表为空** | 系统协议冲突 (Snake vs Camel) | ✅ 已解决 | 重构 `splitter.py` 支持双协议自适应 |

## 2. 关键 Bug 修复记录
- **[Fixed]** 变量名拼写错误 (`eleKey2` 引用错误) 导致的 UI 崩溃。
- **[Fixed]** AbilitySet 导出时 `options` 字段名不符合 Proto 规范 (`normalCombox`)。
- **[Fixed]** 临时文件夹生命周期导致的 `FileNotFound` 异常。
