# CModel 成果物封包架构优化与修复方案设计 (2026-03-28)

## 一、 优化目标
彻底解决 `cmodel` 压缩包不符合官方协议、缺失防篡改机制以及底层文件缺失的问题，确保 100% 还原官方工业级打包逻辑。

---

## 二、 核心重构方向与函数级优化设计

### 方案 1：推翻并重写封包流水线 (解决生命周期设计缺陷)
**背景**: 不能在编译前生成静态清单，因为 MD5 哈希必须依赖生成的二进制字节流。

**优化设计**:
- **目标模块**: `backend/skills_v2/cmodel_encoder/encoder.py`
- **目标函数**: `encode_cmodel`
- **重构逻辑**:
  1. 取消在 `main.py` 和 `data_manager.py` 中写死 JSON 清单的代码。
  2. 在 `encoder.py` 中，执行完所有 `SerializeToString()` 后，将生成的 `bytes`（如 `comp_model_data`, `abi_model_data`）作为参数传递给一个新引入的局部函数。
  3. **动态哈希生成**: 使用 `hashlib.md5(byte_data).hexdigest()` 即时计算每个二进制流的 MD5 值。
  4. **内存中组装 JSON**: 严格遵循标准 Schema，在内存中动态构建 `{"ModelFileDesc": [...]}` 字典。
  5. **一并打包**: 将组装好的 JSON 转换为字符串，直接通过 `zipf.writestr("ModelFileDesc.json", ...)` 写入压缩包。

### 方案 2：校准核心枚举值与版本属性
**背景**: 消除 `"MODEL_ABI"` 等捏造字段。

**优化设计**:
- 在方案 1 动态构建清单的代码中，实施强制硬编码替换：
  - AbiSet: `"name": "AbiSet.model", "type": "CAPABILITY", "version": ""`
  - FuncDesc: `"name": "FuncDesc.model", "type": "MODEL_FUNC", "version": ""`
  - CompDesc: `"name": "CompDesc.model", "type": "MODEL_COMP", "version": ""`

### 方案 3：分离 Proto 对象以修复 FuncDesc 序列化崩溃
**背景**: 不能用 `Message_Module_Info` 去序列化无关结构的 FuncDesc。

**优化设计**:
- **目标模块**: `backend/skills_v2/cmodel_encoder/encoder.py`
- **目标函数**: `encode_cmodel`
- **前置动作**: 如果项目中尚未实现专属的 `FuncDesc` proto 协议文件（或难以立刻映射），则应在后端退而求其次：
- **重构逻辑**:
  1. 对于 `FuncDesc.model`，不再调用 `ParseDict` 强行转换。
  2. 方案 A：如果在原有的标准 ZIP 包中有一个现成的、合法的 `FuncDesc.model`（空载体），直接从 `resources` 或 `project_bases` 中执行 **二进制直接复制打包**（File Copy）。
  3. 方案 B：如果必须生成，则应该创建一个极其简单的二进制默认流（如空字节或只包含版本号的序列化值），以确保该文件物理存在并参与哈希计算，满足外层壳的需求。
  *(推荐实施方案 A，在系统初始化项目时拷贝基准文件)*

---

## 三、 执行步骤建议 (Roadmap)
1. **清理废代码**: 删除 `main.py` 和 `data_manager.py` 中的 `manifest` 生成逻辑。
2. **重写 Encoder**: 升级 `encoder.py`，引入 `hashlib` 计算，实现 MD5 的即时写入。
3. **修复缺失项**: 将基准的 `FuncDesc.model` 放入资源库，在打包时作为固定资产混入压缩包。