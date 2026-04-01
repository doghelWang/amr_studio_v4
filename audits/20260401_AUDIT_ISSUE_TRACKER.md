# CModel 编码链路审计问题跟踪表

**创建日期**: 2026-04-01  
**最后更新**: 2026-04-01  
**审计版本**: CR-20260401 (基于 ModelSet312 标准基线对照)

---

## 状态说明

| 标记 | 含义 |
|:-----|:-----|
| 🔴 OPEN | 未修复，阻断性 |
| 🟠 OPEN | 未修复，高优先级 |
| 🟡 PENDING | 待确认/待客户端反馈 |
| ✅ FIXED | 已修复 |
| ⏸️ DEFERRED | 已知但暂缓 |

---

## P0 致命问题

| ID | 问题描述 | 违反条款 | 位置 | 状态 | 备注 |
|:---|:---------|:---------|:-----|:-----|:-----|
| CR-01 | `interfaceAttrs` 输出格式为 key-dict，标准要求 `{interfaceParamsArray: [...]}` | Proto P-1, §19 | encoder.py L78-101, L314-319 | 🔴 OPEN | ParseDict 可能静默丢弃数据 |
| CR-02 | 标准文件包含 `rawValue12/17` 等字段，我方不输出 | 标准基线差异 | encoder.py 全链路 | 🟡 PENDING | 需确认 Proto 版本差异，ParseDict 是否双向兼容 |

## P1 高优先级问题

| ID | 问题描述 | 违反条款 | 位置 | 状态 | 备注 |
|:---|:---------|:---------|:-----|:-----|:-----|
| CR-03 | 我方输出嵌套结构，标准文件为扁平 | §20 | encoder.py L374-410 | 🟡 PENDING | 待客户端确认是否同时支持两种结构 |
| CR-04 | `InteractiveSys` 子系统被我方错用为 `SafetySys` | §17 (已修订) | resource_adapter.py L124, encoder.py | 🟠 OPEN | CATEGORY_TO_SUBSYS 中 BUTTON/LIGHT 需改为 InteractiveSys |
| CR-06 | `PROTO_TO_SPEC_MAP` 硬编码 (chassis→diffChassis) | §13 | encoder.py L24-35 | 🟠 OPEN | 应优先用 subModuleType 查 XML，映射表为最终 fallback |
| CR-07 | `SERIAL→RS232` 映射可能错误 | 逻辑缺陷 | encoder.py L39 | 🟠 OPEN | SERIAL 可能是 RS485，不应统一映射 |
| CR-09 | `moduleSys` 被过度填充（标准文件仅1个节点有值） | §21 | encoder.py L332-338, L396-402 | 🟠 OPEN | 扁平结构下孤立节点应保持空 |
| CR-10 | `CHASSIS_GENERAL_ATTR_TEMPLATE` 硬编码 5 字段 | §13, §15 | resource_adapter.py L50-64 | 🟠 OPEN | 标准文件 generalAttr 有 13 字段 |
| CR-11 | `CATEGORY_TO_SUBSYS` 中 BUTTON=SafetySys 与标准冲突 | §17 | resource_adapter.py L116-127 | 🟠 OPEN | 需同步修改为 InteractiveSys |

## P2 中低优先级问题

| ID | 问题描述 | 违反条款 | 位置 | 状态 | 备注 |
|:---|:---------|:---------|:-----|:-----|:-----|
| CR-05 | `PowerSys` 在标准基线中无证据 | 待确认 | §17 | 🟡 PENDING | ModelSet312 不含 battery，PowerSys 可能在其他基线中出现 |
| CR-08 | `SYS_NAMES` 硬编码列表 | §13 | encoder.py L386 | ⏸️ DEFERRED | 短期维护风险低 |
| CR-12 | XML 解析单/多元素类型不一致 | 维护风险 | encoder.py L145-150 | ⏸️ DEFERRED | 已有 isinstance 防护 |
| CR-13 | `modelVersion` (Tag 6) 完全缺失 | 客户端反馈一-3 | 全链路 | 🟡 PENDING | 标准文件也为空 |
| CR-14 | `ExportService` 默认值 "LibraryGroup" 无依据 | §22 | ExportService.ts L44 | ⏸️ DEFERRED | 前端 UI 问题 |

---

## 已关闭问题 (历史)

| ID | 问题描述 | 修复日期 | 修复方式 |
|:---|:---------|:---------|:---------|
| D-1 | generalAttr 缺失 11 个字段 | 2026-03-31 | `enrich_from_templates()` 模板填充 |
| D-2 | interfaceAttrs 缺失 | 2026-03-31 | 模板同步注入 |
| D-4 | 文件名含换行符 | 2026-03-31 | `splitter.py` `.strip()` |
| O-PATH | XML Registry 路径错误 (_AGG_DIR 差一级) | 2026-04-01 | `.parent.parent` 修复 |
| O-PARSE | XML 解析器无法处理重复标签和 groupKey 映射 | 2026-04-01 | `_xml_node_to_dict` 完整重写 |
| O-CAN | 主控板 CAN/SERIAL/ETH 接口属性为空 | 2026-04-01 | XML Registry 路径修复后自动解决 |
| O-CHASSIS | 底盘 chassisAttr 私有属性组为空 | 2026-04-01 | XML 解析器修复后自动解决 |

---

## 变更记录

| 日期 | 操作 | 详情 |
|:-----|:-----|:-----|
| 2026-04-01 | 创建 | 基于 ModelSet312 标准基线批判式审计，发现 14 项问题 |
