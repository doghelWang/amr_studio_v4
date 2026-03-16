# 312 系列机器模型深度对齐审计报告 (v4.6)

## 1. 审计背景与目标
针对 312 系列机器人（如 MQ-Q3-600LE-D(T)）开展全量数据比对，确保生成的 `.cmodel` 成果物在工业现场能够 100% 还原。

## 2. 核心分析结论 (Analysis Conclusions)

### 2.1 数据序列化对齐
- **Fan 序列化一致性**: 确定了 312 系统采用定制化的 "Fan Serialized" 二进制协议。当前引擎已通过 `CustomCompDescBuilder` 实现了对该协议的完整解包与封包。
- **数值精度保真**: 针对 `locCoordX/Y/Z` 等位姿参数，应用了 `fixed64` (IEEE-754 双精度) 强制编码，消除了浮点数转换导致的位误差。

### 2.2 结构覆盖率差距
通过对 `CompDesc.json` 的深度审计，发现以下主要差距：
- **模块组密度**: 真实模型包含 **20 个模块组**，包括详细的 MCU 板卡和 IO 子系统，而目前生成的模型主要聚焦于“骨架”驱动模块。
- **硬件引脚映射**: 真实 MCU 节点含有 **29+ 个接口定义**。当前引擎生成的模型仅包含逻辑层面的总线接口，物理引脚（DI/DO/AI）的自动填充尚处于待实施阶段。

## 3. 深度注入与修补方案 (Optimization Strategy)

### 3.1 基于模板的深度注入 (Template-Based Injection)
- **方案**: 不再从无到有生成 Protobuf，而是通过加载 Registry 中的 **Factory Template** 指纹，将用户动态参数（如电机型号、安装位姿）注入到预定义的“基因底座”中。
- **收益**: 确保了未识别的工业字段和保留位在生成的模型中原样保留，不丢失。

### 3.2 动态 Schema 修补 (Recursive Patching)
- **方案**: 实现对 Unknown Fields (10-56) 的自动识别与 Pydantic 模型动态扩展。
- **关键字段对齐**: 已打通对字段 `52` (Visibility) 和 `55` (ModuleStatus) 的强制注入逻辑。

## 4. 后续执行计划 (Next Steps)
1. **硬件资源自动映射器 (Phase 5)**: 根据指定的控制器型号（如 R131/R318），自动关联并填充 MCU 板卡的所有物理 pinout。
2. **多层级模板融合算法**: 实现对辅助设备（辅助相机、避障激光）的自动补全渲染。

---
*关联成果物:*
- [审计对比底稿 (docs/312_output/CompDesc_v4.5_Aligned.json)](docs/312_output/CompDesc_v4.5_Aligned.json)
- [反序列化树报告 (docs/312_output/REF_MQ-Q3_Analysis.md)](docs/312_output/REF_MQ-Q3_Analysis.md)
