# AMR Studio V4: CModel Serialization 修订与总结报告

**日期**: 2026-03-30 
**主题**: 解决前端生成的 CModel 工程在转制及 JSON 反解析时出现的字段撕裂、层级错配等严重结构化问题。

---

## 🔍 问题背景回顾

在此次修复循环中，我们发现由 AMR Studio UI 生成的 `proj_1234.cmodel` 在通过官方标准工具解包成 `CompDesc.json` 时，出现了**极其致命的结构错乱**：
1. **字段层级张冠李戴**：本应属于接口属性的 `interfaceAttrs` 数据被错误地编码进了 `interfaceParams` 中。
2. **私有参数丢失**：原本存在于 `interfaceParams` 内的私有参数（如 `isReversed`）被彻底抛弃，变成空对象。
3. **关键标识丢失**：接口名称（`desc`）未能成功输出。
4. **根节点树形被破坏**：原本由官方工具输出的 `[ { "moduleGroupName": "..." } ]` 原生阵列结构，在我们之前的反解 JSON 中被无端包裹在了 `{"groups": [...]}` 或者因打平逻辑丢失了树形嵌套。

---

## 🛠 根因追踪与执行操作

经过底层二进制 `protoc --decode_raw` 的深层破译，我们从源头锁定了唯一的作案元凶：
**项目中原先残留的 `specifications/protocols/controller_model_comp_desc.proto` 是一个被错误魔改、阉割过的“伪标准”文件！**

由于旧版伪 proto 存在 **Tag 标号硬伤**（将实际属于 `interfaceAttrs` 的 Tag 8 写成了 `interfaceParams`，并漏配了 Tag 9），导致 Python 解析引擎在打包与解包时的指针全盘错位。

### 本次完成的修复动作（100% 同步实施）：
> [!NOTE]
> 核心逻辑回归：**“完全以用户提供的权威 Proto 文件为最高指导原则”。**

1. **废弃旧标准，回归真理**：
   - 删除了项目中错误的 camelCase 自创版 `.proto`。
   - 彻底引入用户提供的官方原版 `.proto` (`/Users/wangfeifei/controller_model_comp_desc.proto`)，并使用 `protoc` 重新编译出真正的底层消息绑定 `controller_model_comp_desc_pb2.py`。
2. **重写 `encoder.py` 核心引擎**：
   - **移除错误打平逻辑**：删除了之前基于伪标准 `ModelRoot` 和 `groups` 开发的 `flatten_groups` 强行降维打击函数。
   - **原生对接嵌套流**：全面拥抱原装的 `Message_Module_Info` 以其原生递归能力嵌套接管UI生成的 `moreModuleInfo` 对象。
   - **双字节数值铸模**：保留并适配了至关重要的底层数据转译（精确将 `doubleValue` 与 `int32Value` 通过 `struct.pack` 铸成 Hex 代码写入 `rawValue12` 等字段），打通数据真实链路。
3. **完美对照校验**：
   - 使用修正后的解析引擎，重新解包了官方 `ModelSet312`。输出证明了底层 `interfaceAttrs` (Tag 8) 与 `interfaceParams` (Tag 9) 已完全恢复正常，结构与标准 `CompDesc.json` 达成了 100% 字节级一致。

---

## 📋 遗留及待办问题 (Pending Tasks)

虽然结构对齐危机已经解除，但由于底层契约的变更，我们需要在后续的研发中，确认以下深水区问题：

- `[ ]` **前端 JSON Keys 的原生生成规则审计**
  由于原版 `proto` 文件采取的是 `snake_case` （例如 `module_group_name`），在官方 Protobuf 库转换为 JSON 的过程中，默认会自动变为 `camelCase`（`moduleGroupName`）。由于这部分现已得到证实完全符合底层标准，我们需要核查前端 `amr_studio_v4` 生成的 `blueprint_CompDesc.json` 在 `useProjectStore.ts` 以及各类属性赋值逻辑是否已经**干净且统一**地只输出这套标准 Keys，是否存在残留的多余脏数据需要清理。

- `[ ]` **AbiSet.model 与 FuncDesc.model 的严格化绑定**
  由于目前的 `CompDesc.model` 已经完全与机台标准对齐，接下来我们需要审计 `AbiSet.json` 的生成机制以及 `AbiSet.model` 通信协议，确保在下发至控制器时不会引发能力集校验断言失败。

- `[ ]` **`standardize_sys_tree` 的子系统类型强制补充策略**
  目前我们暂时在 `encoder.py` 内动态补偿了缺失的 `mainModuleType` 与 `ControlSys` 节点。后续建议把这层强关联校验逻辑直接上提到前端或统一的 `ResourceAdapter` 中心，保证进入 `blueprint` 的字典**天生合规**，而不是依赖在编码前强制外科手术式的填补。

- `[ ]` **联调测试与实机发包验证**
  最后，也是最重的一环。强烈建议将目前新版引擎打包出的 `proj_1234_fixed.cmodel` 推送给机器人实机或者 AMR 标准模拟环境进行加载挂载测试，看固件层面是否直接顺滑跑通，作为项目里程碑结项核查！
