# Next Refactor Task Breakdown 2026-04-23

## 1. 背景与目标

基于 `2026-04-22` 的后端重构总结，当前后端已经完成了第一轮结构拆分：

- `main.py` 已初步瘦身为 API 装配层
- `app/services` 已承接主要业务动作
- `project_repository` 已承接项目 JSON 仓储职责
- `resource_adapter` 已拆分出多个专门 builder/helper
- 回归验证流程已经建立

下一阶段不建议继续盲目拆文件，而应进入“收口与语义正确性重构”阶段。

本阶段目标：

- 明确 proto / cmodel 构建链路中的字段事实源
- 收敛兼容 façade 的对外边界
- 为已拆出的 builder 建立单元测试
- 减少隐式 fallback 和不可追溯默认值
- 让导出链路从“结构可维护”进一步走向“语义可验证”

---

## 2. 阶段一：建立重构安全基线

### 任务 1.1 固化最小回归命令

目标：

- 让后续每次继续重构都有统一验证入口。

当前命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment
```

执行内容：

- 将上述命令沉淀为脚本或 Makefile 任务。
- 明确回归失败时禁止继续重构。
- 每次修改后仍输出 `docs/verification` 验证报告。

验收标准：

- 一条命令可以执行当前后端最小回归集。
- 文档中明确记录运行方式、预期结果、失败处理策略。

风险：

- 当前测试仍偏集成，定位失败原因可能不够快。

### 任务 1.2 清理工作区噪音变更

目标：

- 避免后续提交时混入非目标文件。

当前已观察到的噪音：

- `src/frontend/node_modules/.vite/deps/*`
- `src/backend/.venv310/`

执行内容：

- 确认这些文件是否应加入 `.gitignore`。
- 不在后端重构提交中包含 Vite 缓存或本地虚拟环境。
- 对测试产生的项目样本改动单独判断是否需要保留。

验收标准：

- `git status --short` 中只保留有意纳入本轮重构的文件。

风险：

- 若误删用户本地缓存之外的有效文件，会影响运行环境。执行前必须逐项确认，不做破坏性清理。

---

## 3. 阶段二：收敛 resource_adapter 兼容边界

### 任务 2.1 梳理外部引用

目标：

- 明确哪些模块仍直接依赖 `core.resource_adapter`。

执行内容：

```bash
rg "resource_adapter|CATEGORY_TO_TYPE_KEY|CATEGORY_TO_SUBSYS|CHASSIS_GENERAL_ATTR_TEMPLATE" src/backend tests
```

重点检查：

- `compile_service.py` 是否仍从 `resource_adapter` 导入映射常量
- 测试是否直接引用旧入口
- encoder / splitter 是否依赖旧符号

验收标准：

- 形成一份外部引用清单。
- 每个引用点标明保留、迁移或暂缓。

风险：

- 直接迁移导入路径可能再次引发兼容性回归。

### 任务 2.2 将稳定依赖迁移到新模块

目标：

- 减少 `resource_adapter` 作为“万物出口”的角色。

建议迁移：

- 映射常量迁移到 `module_mappings`
- 模板加载迁移到 `module_templates`
- ability 构建迁移到 `ability_export_builder`
- 模块树构建迁移到 `module_group_builder`

暂缓迁移：

- 已对外暴露且测试覆盖不足的入口函数
- 历史调用路径不清晰的函数

验收标准：

- 新代码不再新增对 `resource_adapter` 内部常量的依赖。
- 旧导入路径继续可用，作为兼容层保留。

风险：

- 迁移过程中可能出现循环导入，需要保持 builder 层只依赖必要 mapper/helper。

### 任务 2.3 定义 resource_adapter 的公开 API

目标：

- 明确 `resource_adapter` 最终保留哪些兼容函数。

建议保留：

- `map_attribute_to_cmodel`
- `map_component_to_cmodel`
- `map_module_group`
- `frontend_to_comp_desc`
- `export_abilities`
- `xml_to_component_json`

建议标记为兼容导出：

- `CATEGORY_TO_TYPE_KEY`
- `CATEGORY_TO_SUBSYS`
- `CHASSIS_GENERAL_ATTR_TEMPLATE`

验收标准：

- 文档说明哪些是正式入口，哪些是临时兼容入口。
- 后续新代码优先使用新模块，不再扩大兼容层职责。

风险：

- 兼容层保留过久会使新旧边界继续模糊，需要后续设定迁移截止点。

---

## 4. 阶段三：建立 proto / cmodel 字段事实源规范

### 任务 3.1 梳理字段来源矩阵

目标：

- 明确关键导出字段来自哪里，是否允许 fallback。

建议字段矩阵：

| 字段 | 主要来源 | 允许 fallback | 当前 fallback | 风险 |
| --- | --- | --- | --- | --- |
| `moduleName` | 前端组件名称 / 模板 | 是 | 组件 name | 名称缺失会出现空字符串 |
| `moduleUuid` | 前端组件 id | 否 | 部分场景默认 chassis-root | 可能掩盖 id 缺失 |
| `subSysType` | 映射表 / 模板 | 是 | `UnclassifiedSys` | 可能导出语义不准 |
| `mainModuleType` | 模板 / 映射表 | 是 | `unknown` | 可能导出可运行但不可解释 |
| `subModuleType` | 模板 / 映射表 | 是 | 分类推断 | IO / DRIVEWHEEL 规则较隐式 |
| `moduleShape` | 模板 / 底盘 identity | 是 | `ENUM_BOX` | 尺寸默认值可能不可靠 |
| `interfaceParams` | 前端 interfaces | 暂不明确 | 空列表 | 需要 schema 校验 |
| `extendParams` | 前端 mount 字段 | 是 | 0 / 默认姿态 | 可能掩盖安装数据缺失 |
| `functionAbility` | abilities 输入 | 是 | 空数组 | 可能掩盖能力配置缺失 |

验收标准：

- 生成字段事实源文档。
- 每个 fallback 都有明确理由。
- 禁止新增无法追溯的默认值。

风险：

- 现有历史项目可能依赖默认值，严格化会暴露大量旧数据问题。

### 任务 3.2 区分“合理补齐”和“错误掩盖”

目标：

- 将 fallback 分级，避免所有缺失都被静默补齐。

建议分类：

- `required`: 缺失必须报错
- `template_default`: 可由模板补齐
- `schema_default`: proto/schema 明确允许默认
- `compat_default`: 为历史兼容保留，但必须记录告警
- `invalid_guess`: 不允许通过猜测生成

验收标准：

- `component_general_attrs` 中每个默认值都能归类。
- 对 `unknown`、`未分类系统`、默认尺寸等高风险 fallback 建立待处理清单。

风险：

- 如果一次性把 fallback 改为报错，可能破坏现有导出流程。应先观测和记录，再逐步收紧。

### 任务 3.3 编写 no-guess 规则落地检查

目标：

- 将工程约束转化为代码评审和测试关注点。

执行内容：

- 检查所有新增默认值是否来自模板、schema、proto、配置或已有映射。
- 对无法证明来源的字段，不新增默认描述或默认内容。
- 对必须保留的兼容默认值，记录为 `compat_default`。

验收标准：

- 新增测试覆盖至少一个“缺失关键字段不得静默猜测”的场景。

风险：

- 当前代码中已有历史默认值，不能简单等同于新规则违规，需要分阶段治理。

---

## 5. 阶段四：为 builder 层补单元测试

### 任务 4.1 component_general_attrs 单测

目标：

- 独立验证 `generalAttr` 构造逻辑。

测试场景：

- 底盘组件使用 chassis 默认模板
- identity 中的底盘尺寸正确写入 `moduleShape`
- IO 类组件归一化
- 模板存在时优先使用模板字段
- 缺失 `subSysType` 时按映射补齐
- 缺失 `moduleType` 时按 category 补齐

验收标准：

- 不依赖完整导出流程即可验证 `generalAttr`。

### 任务 4.2 component_payload_builders 单测

目标：

- 独立验证组件 payload 组装。

测试场景：

- mount 字段生成完整 `extendParams`
- privateAttrs 通过 attribute mapper 转换
- interfaces 生成 `interfaceGroup`
- 缺失 interfaces 时返回空列表

验收标准：

- payload builder 的输出 shape 与当前回归 fixture 一致。

### 任务 4.3 module_group_builder 单测

目标：

- 独立验证模块树递归。

测试场景：

- 根组件识别
- `chassis-root` group 名称固定为 `chassis_diff`
- 子节点按 `parentNodeUuid` 递归进入 `moreModuleInfo`
- 组件 mapper 被正确调用

验收标准：

- 不依赖真实 cmodel 编码器即可验证树结构。

### 任务 4.4 ability_export_builder 单测

目标：

- 独立验证 ability 导出结构。

测试场景：

- abilities 为空时返回默认空结构
- `functionAbility` 保留 type / desc / tips
- `childFunction` 的 type 使用 `type`，缺失时 fallback 到 `key`
- attr 通过 ability 模式 mapper 转换
- `cloneEnable` 默认值为 False

验收标准：

- ability 构建器行为被直接覆盖。

风险：

- 当前端到端测试可能已经覆盖一部分能力导出，但不能替代 builder 层单测。

---

## 6. 阶段五：重构 compile_service 与导出链路

### 任务 5.1 解耦 compile_service 对 resource_adapter 的常量依赖

目标：

- 避免 service 层依赖兼容 façade 内部符号。

当前问题：

- `compile_service.py` 从 `core.resource_adapter` 导入 `CATEGORY_TO_TYPE_KEY`

建议调整：

- 改为从 `core.module_mappings` 导入
- 或新增明确 helper，例如 `get_category_type_config(category)`

验收标准：

- service 层不再依赖 `resource_adapter` 的静态常量。
- 全量回归通过。

风险：

- 若未来映射表需要更复杂规则，直接导入常量可能仍然不够抽象。

### 任务 5.2 梳理 module list CSV 的事实源

目标：

- 明确导出 CSV 的字段来自 resolved blueprint 还是 fallback 推断。

重点字段：

- 模块名
- 所属子系统
- 主类别
- 子类别
- 安装位置
- 旋转姿态

验收标准：

- CSV 生成逻辑可解释。
- fallback 字段可追踪。

风险：

- CSV 可能被用户当成导出成果的一部分，不能随意改变字段含义。

### 任务 5.3 明确 resolve_with_fidelity 的边界

目标：

- 明确 `resolve_with_fidelity` 在导出链路中的职责。

待分析问题：

- 它是否只是补全 blueprint
- 是否会改变字段优先级
- 是否应当属于 compile service，还是 encoder adapter

验收标准：

- 形成导出链路时序说明。
- 明确 compile service 只负责编排，不承载字段语义推断。

风险：

- 未理解 encoder 行为前，不应重写导出链路。

---

## 7. 阶段六：项目数据层继续收口

### 任务 6.1 为 ProjectRepository 增加单测

目标：

- 确认项目初始化、组件更新、能力更新、函数更新行为稳定。

测试场景：

- 初始化项目目录
- 更新组件字段
- 更新 ability 字段
- 更新 function 字段
- atomic write 成功
- 深层更新不破坏其他字段

验收标准：

- `data_manager` 兼容 façade 和 `ProjectRepository` 行为一致。

### 任务 6.2 逐步迁移 service 到 ProjectRepository

目标：

- service 层直接依赖仓储对象，而不是旧 `data_manager` 全局函数。

执行顺序：

1. `model_service`
2. `project_service`
3. `compile_service`

验收标准：

- 新代码不再新增 `data_manager` 调用。
- 旧接口仍通过兼容 façade 可用。

风险：

- 测试中可能 monkeypatch `data_manager.DB_DIR`，迁移时需要保持测试兼容或同步修改测试。

---

## 8. 阶段七：运行验证与数据验证强化

### 任务 7.1 固化前后端运行验证脚本

目标：

- 将手动运行验证变成可重复流程。

验证内容：

- 后端启动
- 前端启动
- 前端代理访问后端
- `/api/v1/system/version`
- `/api/v1/projects/saved-list`
- `/api/v1/schemas`

验收标准：

- 有明确命令、端口、预期响应。
- 验证报告可复用。

### 任务 7.2 增加 cmodel 数据验证矩阵

目标：

- 对不同模块类型进行导出数据验证。

建议覆盖：

- CHASSIS
- DRIVEWHEEL
- MOTOR
- MAINCPU
- SENSOR
- BATTERY
- IO / IO_BOARD

验收标准：

- 每类模块至少验证 `generalAttr`、`subSysType`、`mainModuleType`、`subModuleType`。

风险：

- 如果缺少真实样本，不允许凭空创造参数。必须来自已有 fixture、模板、proto/schema 或用户提供数据。

---

## 9. 推荐执行顺序

### 第一优先级

1. 固化最小回归命令
2. 清理工作区噪音变更
3. 梳理 `resource_adapter` 外部引用
4. 解耦 `compile_service` 对 `resource_adapter` 常量依赖

### 第二优先级

1. 补 `component_general_attrs` 单测
2. 补 `component_payload_builders` 单测
3. 补 `module_group_builder` 单测
4. 补 `ability_export_builder` 单测

### 第三优先级

1. 建立 proto / cmodel 字段事实源矩阵
2. 区分 fallback 等级
3. 梳理 `resolve_with_fidelity` 边界
4. 增强 cmodel 数据验证矩阵

### 第四优先级

1. service 层逐步迁移到 repository
2. 收缩 `data_manager` 兼容 façade
3. 固化前后端运行验证脚本

---

## 10. 下一次可直接执行的任务建议

下一次建议从最小风险、最高收益的任务开始：

1. 先运行回归基线
2. 梳理 `resource_adapter` 引用清单
3. 将 `compile_service.py` 的 `CATEGORY_TO_TYPE_KEY` 导入从 `resource_adapter` 迁移到 `module_mappings`
4. 运行回归
5. 输出验证报告
6. 开始补 `component_general_attrs` 单元测试

这条路径的好处是：

- 改动小
- 风险低
- 能继续收敛兼容层
- 能为后续更严格的语义重构铺路
