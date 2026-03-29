# CModel 深度审计与批判性对比报告 (V2 - 物理层与协议层)

## 一、 数据对比报告 (Data Comparison)

### 1. ZIP 头元数据比对
| 属性 | 标准样本 (ModelSet312) | 当前生成物 | 差异分析 |
| :--- | :--- | :--- | :--- |
| OS 系统头 | **FAT (MS-DOS)** | Unix (MacOS) | ❌ **严重不匹配**。导致标准工具识别权限异常。 |
| 文件顺序 | Abi -> Comp -> Func -> Json | Comp -> Abi -> Json | ⚠️ 顺序不一致，虽然理论 ZIP 无关，但严格解析器可能有序。 |
| 文件总数 | 4 | 3 | ❌ **物理缺失**。缺失 `FuncDesc.model`。 |

### 2. JSON 字段内容比对 (ModelFileDesc.json)
```json
// [Standard Data Fragment]
{
    "md5": "3065834785b80522e8540e712b640eb0",
    "name": "AbiSet.model",
    "type": "CAPABILITY",
    "version": ""
}

// [Generated Data Fragment]
{
    "md5": "d33d70c31607fe4c5522acb030e40a9f",
    "name": "AbiSet.model",
    "type": "CAPABILITY",
    "version": ""
}
```
*注：MD5 不同是正常的，因为数据内容变了。但 `type` 和 `version` 的格式必须完全一致。*

---

## 二、 问题深度分析与源码溯源 (Problem Analysis)

### 记录 1：解压失败 (OS 头与权限位冲突)
- **分析结论**：由于 Python 的 `zipfile` 默认在 Unix (MacOS) 系统上会保留文件系统权限（600/644）。在生成的 ZIP 内部，文件被标记为 Unix 属性。标准工具（通常是基于 Windows 协议开发的）无法正确处理这种带有 Unix 权限位的 ZIP Entry，导致报错。
- **模块/文件**：`backend/skills_v2/cmodel_encoder/encoder.py`
- **故障代码**：
  ```python
  with zipfile.ZipFile(output_cmodel_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
      zipf.writestr("CompDesc.model", comp_model_data) # <-- 此处隐式携带了 MacOS 的文件属性
  ```

### 记录 2：`FuncDesc.model` 物理缺失
- **分析结论**：虽然在清单中声明了，但 `encoder.py` 在查找 `FuncDesc_base.model` 时由于路径处理不当（使用了 `__file__` 的相对路径但在不同环境下未命中），导致打包环节静默跳过了该文件。
- **模块/文件**：`backend/skills_v2/cmodel_encoder/encoder.py`
- **故障代码**：
  ```python
  baseline_func_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "resources", "FuncDesc_base.model")
  if os.path.exists(baseline_func_path): # <-- 【故障】此处判断为 False，导致后续无打包动作
  ```

---

## 三、 优化方案设计 (Optimization Design)

### 方案 1：强制执行 FAT32 兼容打包 (解决解压失败)
- **优化说明**：手动清除 ZIP 内部文件的 OS 属性，强制伪装成 Windows 生成的包。
- **函数改造**：在 `encoder.py` 的打包逻辑中，显式创建一个 `zipfile.ZipInfo` 对象，并将 `external_attr` 强制设为 `0` (FAT32 标准)，并设置 `create_system` 为 `0` (Windows)。
- **代码预览**：
  ```python
  info = zipfile.ZipInfo("CompDesc.model")
  info.create_system = 0 # 强制设为 Windows
  info.external_attr = 0 # 清除 Unix 权限位
  zipf.writestr(info, comp_model_data)
  ```

### 方案 2：资源路径鲁棒性优化
- **优化说明**：放弃复杂的相对路径计算，改用 `BASE_DIR` 统一索引。
- **函数改造**：在项目启动时由 `main.py` 将 `resources` 的绝对路径注入编译引擎。

### 方案 3：文件有序封包
- **优化说明**：严格按照 `AbiSet` -> `CompDesc` -> `FuncDesc` -> `Json` 的顺序写入 ZIP。
