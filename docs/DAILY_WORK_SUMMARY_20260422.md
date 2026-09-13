# Daily Work Summary 2026-04-22

## 1. 今日工作内容总结

今天的后端重构工作已经推进到一个相对清晰的阶段，核心目标是把原本集中在入口层和导出适配层的大块逻辑拆分为更明确的模块职责，并且在每次继续重构前后都通过回归测试控制风险。

本日工作的主线分为四部分：

1. 完成后端入口与服务层拆分  
   将原本堆积在 `main.py` 中的业务逻辑逐步下沉到 `app/services` 层，入口文件只保留路由编排、配置装载和异常注册等职责。

2. 完成项目数据访问层的初步模块化  
   将项目 JSON 的读写、初始化、深层更新等逻辑抽到 `project_repository`，`data_manager` 保留兼容 façade，降低一次性迁移风险。

3. 对 `resource_adapter` 进行持续拆解  
   围绕 proto / cmodel 导出链路，把静态映射、模板读取、generalAttr 构建、组件 payload 组装、模块树递归、能力导出分别抽到独立模块中。

4. 建立“先回归、再继续”的重构节奏  
   每次继续重构前先执行既定后端回归，再补充验证报告，确保每一步都可追踪、可回退、可解释。

---

## 2. 今日代码改动总结

### 2.1 入口层与应用层改动

- `src/backend/main.py`
- `src/backend/app/config.py`
- `src/backend/app/errors.py`
- `src/backend/app/schemas/request_models.py`
- `src/backend/app/services/compile_service.py`
- `src/backend/app/services/project_service.py`
- `src/backend/app/services/upload_service.py`
- `src/backend/app/services/model_service.py`
- `src/backend/app/services/resource_service.py`
- `src/backend/app/services/system_service.py`

改动原因：

- 原入口文件职责过多，同时处理路由、文件系统、数据更新、导出逻辑和异常处理。
- 这种结构会导致任何一个小改动都容易牵动整个入口层，测试和定位问题都很困难。

本次调整结果：

- `main.py` 变成更薄的 API 装配层。
- 配置、错误处理、请求模型、业务动作已经开始具备明确边界。
- 后续如果继续替换实现，优先变动的是 service，不需要频繁触碰 API 入口。

### 2.2 项目仓储层改动

- `src/backend/core/project_repository.py`
- `src/backend/core/data_manager.py`

改动原因：

- 旧版 `data_manager` 同时承担项目目录定位、初始化、JSON 读写、深度更新、组件更新、能力更新等职责，耦合过高。
- 对 JSON 文件的直接操作分散在多个函数里，不利于后续统一约束和校验。

本次调整结果：

- 新增 `ProjectRepository`，集中承接项目初始化和模型文件读写。
- `data_manager` 变为兼容适配层，避免外部调用在同一天内大面积断裂。

### 2.3 resource_adapter 拆分改动

#### 新增模块

- `src/backend/core/module_mappings.py`
- `src/backend/core/module_templates.py`
- `src/backend/core/component_general_attrs.py`
- `src/backend/core/component_payload_builders.py`
- `src/backend/core/module_group_builder.py`
- `src/backend/core/ability_export_builder.py`

#### 保留兼容入口并持续瘦身

- `src/backend/core/resource_adapter.py`

改动原因：

- `resource_adapter` 是今天最核心的重构对象。旧版本同时承担以下职责：
  - 静态类别映射定义
  - 模板文件读取
  - 模块 generalAttr 推断与默认补齐
  - 组件 payload 结构组装
  - 模块树递归组装
  - ability 导出结构组装
- 这些职责混在一个文件里，会掩盖真实的数据构造规则，也会让 proto / cmodel 的问题难以定位。

本次调整结果：

- 静态映射已经抽到 `module_mappings.py`
- 模板加载职责已经抽到 `module_templates.py`
- `generalAttr` 构建与默认补齐已经抽到 `component_general_attrs.py`
- `extendParams` / `privateAttr` / `interfaceParams` 组装已经抽到 `component_payload_builders.py`
- 模块树递归组装已经抽到 `module_group_builder.py`
- ability 导出结构组装已经抽到 `ability_export_builder.py`
- `resource_adapter.py` 正逐步收敛为兼容 façade

### 2.4 测试与约束相关改动

- `tests/unit/test_backend_api_e2e.py`
- `specifications/ENGINEERING_CONSTRAINTS.md`

改动原因：

- E2E 测试依赖的样本 `.cmodel` 在仓库里并不稳定存在，导致测试对外部状态敏感。
- 约束规范需要明确禁止通过猜测、创造、假想方式补参数、描述、内容。

本次调整结果：

- E2E 测试增加了缺失样本的按需生成能力。
- 工程约束补充了“禁止猜测/创造/假想补全信息”的规则。

---

## 3. 为什么要这样改

今天所有重构的核心动机可以归纳为三点：

### 3.1 降低单点复杂度

以前很多关键逻辑都堆在 `main.py` 或 `resource_adapter.py` 里。  
一旦需要修一个导出 bug、一个组件更新 bug，或者一个 API 问题，就会被迫进入一个职责混乱的大文件。

把逻辑拆开之后：

- 路由问题看入口层
- 业务问题看 service
- JSON 读写问题看 repository
- cmodel 结构构建问题看 builder / adapter

### 3.2 暴露隐性规则

今天对导出链路越拆越清楚后，可以看到系统并不是“把前端 JSON 原样转成 cmodel”，而是中间存在大量隐性构造规则：

- 类别归一化
- 底盘模板补齐
- 子系统与主子类型映射
- 形状字段补齐
- ability attribute 类型转换

旧代码的问题不是“规则太少”，而是“规则太多但藏在大函数里”。  
只有先拆开，后面才有可能把规则写成明确规范。

### 3.3 控制兼容性风险

这次重构过程中已经真实暴露过兼容性问题：

- `compile_service.py` 仍然从 `core.resource_adapter` 直接导入 `CATEGORY_TO_TYPE_KEY`
- 当映射被抽离后，第一次回归立刻出现 `ImportError`

这也证明保留兼容 façade 是必要的。  
当前策略不是一次性强推所有调用方迁移，而是先拆内部结构，再逐步迁移外部依赖。

---

## 4. 今日验证与结果

今天严格执行了“每次继续前先回归验证”的要求，并沉淀了验证报告。

主要回归命令包括：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment
```

今天新增/补充的验证报告包括但不限于：

- `docs/verification/VERIFICATION_REPORT_20260422_12.md`
- `docs/verification/VERIFICATION_REPORT_20260422_13.md`
- `docs/verification/VERIFICATION_REPORT_20260422_14.md`
- `docs/verification/VERIFICATION_REPORT_20260422_15.md`
- `docs/verification/VERIFICATION_REPORT_20260422_16.md`
- `docs/verification/VERIFICATION_REPORT_20260422_17.md`
- `docs/verification/VERIFICATION_REPORT_20260422_18.md`
- `docs/verification/VERIFICATION_REPORT_20260422_19.md`
- `docs/verification/VERIFICATION_REPORT_20260422_20.md`
- `docs/verification/VERIFICATION_REPORT_20260422_21.md`
- `docs/verification/VERIFICATION_REPORT_20260422_22.md`

验证结论：

- 本日各次小步拆分后，核心后端回归均保持通过。
- 出现过一次真实的兼容性回归，但已通过恢复兼容导出修复，并再次全量验证通过。
- 当前后端重构仍处于“结构持续改善，行为保持稳定”的状态。

---

## 5. 结合 proto / cmodel 的核心解析与构建分析

### 5.1 当前系统的本质不是“字段搬运”，而是“结构构建”

从今天的重构和验证可以更明确地看出：

- 前端配置并不是最终 cmodel
- 后端也不是简单做一层 JSON 转存
- 真正的关键过程是：
  - 从前端配置中提取组件、身份、接口、能力等信息
  - 经过一系列规则补齐、类型修正和结构组装
  - 生成接近 `CompDesc` 语义的中间描述
  - 再交给编码器导出 `.cmodel`

也就是说，proto / cmodel 链路最重要的不是“输入长什么样”，而是“后端如何构造合法、完整、稳定的中间模型”。

### 5.2 当前已经较清晰的中间结构

从现有导出链路可以整理出几个核心结构单元：

#### 1. `generalAttr`

负责模块级元信息，包括：

- `moduleName`
- `moduleDesc`
- `moduleUuid`
- `subSysType`
- `mainModuleType`
- `subModuleType`
- `moduleType`
- `versionInfo`
- `moduleShape`

这是 proto / cmodel 映射中最核心的一层，因为很多下游兼容性都依赖这些字段是否齐全、是否符合枚举语义。

#### 2. `privateAttr`

负责模块私有参数组，结构上是参数分组再嵌套基础元素：

- group
- `arrayBaseEle`
- attr element

这里的重点是属性元素并不是直接透传，而是要经过类型映射和字段补齐。

#### 3. `interfaceParams`

负责接口列表导出，保留：

- key
- type
- path
- desc
- `interfaceUuid`
- `linkedInterfaceUuid`

这一层目前更像直接结构组装，但未来仍应检查是否需要更严格的 schema 校验。

#### 4. `structParam.extendParams`

负责安装位置与姿态，包括：

- X / Y / Z
- ROLL / PITCH / YAW
- `parentNodeUuid`

这部分本质上是模块树挂载关系和空间定位信息，是几何结构导出的重要补充。

#### 5. `moreModuleInfo`

这是模块树递归结构，是整车/整系统层级导出的骨架。

没有这层递归，组件只是平铺列表；  
有了这层，才形成真正的模块层级描述。

#### 6. `componentAbility` / `functionAbility`

这是 ability 导出的核心结构。

- `componentAbility` 当前相对直接
- `functionAbility` 需要对子函数、子属性做进一步构造和类型转换

### 5.3 当前构建规则中最关键的几类“隐式解析”

今天的重构揭示出几类非常关键的隐式逻辑：

#### 1. 类别归一化

例如：

- `IO`
- `IO_BOARD`
- `INTERFACE`
- `IOMODULE`
- `EXTENDEDLNTERFACE`

这些并不总是一致输入，但最终 often 需要映射到统一导出类别。  
这说明当前系统对上游输入存在一定“语义纠偏”。

#### 2. 默认模板补齐

当组件有模板时，会优先使用模板里的 `generalAttr`。  
当模板不存在或组件是底盘时，又有另一套 fallback 逻辑。

这说明“模板优先 + 规则补齐”已经是导出链路的事实标准。

#### 3. 类型与子系统映射

`CATEGORY_TO_TYPE_KEY` 和 `CATEGORY_TO_SUBSYS` 本质上是语义映射表。  
这不是单纯的显示文案，而是导出结构合法性的关键来源。

#### 4. ability 内部类型转换

例如 attribute 在普通组件导出与 ability 导出时，类型表达并不完全一致。  
这意味着 ability 与组件属性虽然看起来相似，但其实属于两套不同上下文。

---

## 6. 旧代码中暴露出的 bug 与结构性问题

### 6.1 上帝函数问题

`resource_adapter` 和早期 `main.py` 都是典型的大函数/大文件结构：

- 一处改动可能牵动多个层面
- 很难知道某个 bug 究竟属于哪一层
- 无法为某一段规则单独写针对性测试

### 6.2 兼容性边界不清

今天已经实际验证出一个问题：

- 外部 service 直接依赖 `resource_adapter` 里的静态常量
- 当内部拆分时，调用方随之断裂

这说明旧代码并没有形成明确的“公共 API / 内部实现”边界。

### 6.3 输入事实源不统一

当前有些语义来自：

- 前端输入字段
- 模板文件
- 静态映射表
- fallback 默认值

如果这些来源没有统一优先级定义，就会出现：

- 某个字段看似有值，但来源并不可靠
- 导出可以成功，但语义可能偏差
- 某些 fallback 实际掩盖了上游数据缺失

### 6.4 历史 bug 迹象

从回归日志与现有修正逻辑看，至少已经确认或暴露过以下问题类型：

- `moduleShape.shapeType` 缺失，需要补齐为 `ENUM_BOX`
- IO 类别存在语义修正，而不是输入天然规范
- 某些类型 / 子系统信息需要通过 fallback 映射补齐
- 测试样本依赖仓库外状态，导致 E2E 可靠性不足

### 6.5 “禁止猜测”的必要性

今天补充的工程约束非常重要：

- 不允许通过猜测、创造、假想方式补参数、描述、内容

这是因为当前导出链路已经存在不少 fallback。  
如果没有这条约束，重构时很容易为了“让导出跑通”而继续在代码里埋入新的假设，最终让数据看似完整、实则不可追溯。

---

## 7. 为下一步重构做准备的建议

下一阶段不建议只是继续机械拆文件，更重要的是开始固化“构建优先级”和“单一事实源”。

### 7.1 明确字段来源优先级

建议把关键字段按来源优先级写成文档和代码约束，例如：

1. 明确来自 proto/schema/template 的字段优先
2. 明确来自用户配置的字段次之
3. 只有在允许 fallback 的场景下，才使用静态映射或默认值
4. fallback 必须可解释、可追踪

### 7.2 为 builder 层补针对性测试

当前回归主要是端到端与导出对齐测试。  
后续建议增加：

- `component_general_attrs` 单测
- `component_payload_builders` 单测
- `module_group_builder` 单测
- `ability_export_builder` 单测

这样可以在不跑整条导出链路的情况下快速定位规则错误。

### 7.3 梳理 `resource_adapter` 的兼容边界

当前它已经接近兼容 façade。  
下一步应明确：

- 哪些符号继续作为公共兼容导出
- 哪些调用方应迁移到新模块
- 何时可以正式收缩 `resource_adapter` 的职责

### 7.4 进一步梳理 proto / cmodel 单一事实源

后续最重要的技术工作之一，是建立更严格的事实源边界：

- 哪些字段必须来自模板
- 哪些字段必须来自前端输入
- 哪些字段不允许 fallback
- 哪些字段若缺失必须报错而不是自动补齐

这一步将直接决定下一阶段重构能否从“结构改善”走向“语义正确性提升”。

---

## 8. 当前待办事项

### 已完成阶段性事项

- 后端入口初步瘦身
- service 层初步建立
- project repository 初步建立
- `resource_adapter` 主体职责已分拆到多个 helper / builder
- 回归验证与验证报告流程已经稳定建立

### 后续待办事项

- 清理 `resource_adapter` 的兼容导出边界
- 检查 service 层对旧兼容入口的依赖，逐步迁移到新模块
- 为新 builder 增加更细粒度单测
- 统一 proto / cmodel 构建字段的事实源优先级
- 识别哪些 fallback 是合理补齐，哪些是在掩盖上游输入缺陷
- 准备下一轮以“语义正确性”和“单一事实源”为重点的重构

---

## 9. 总结结论

今天的重构不是单纯“把代码拆开”而已，真正的价值在于：

- 让后端结构开始分层
- 让 proto / cmodel 导出链路的隐式规则逐步显性化
- 通过持续回归把结构优化控制在可验证范围内
- 为下一阶段“语义正确性重构”打下基础

从当前状态看，后端已经从“局部可运行但理解成本高”逐步走向“职责边界开始清晰、可继续演进”的状态。  
下一步最值得做的，不是继续盲目拆文件，而是利用今天已经暴露出来的规则，建立更严格的构建规范、测试边界和事实源体系。
