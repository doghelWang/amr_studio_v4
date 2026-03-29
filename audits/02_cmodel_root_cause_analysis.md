# CModel 成果物异常溯源与根因分析报告 (2026-03-28)

## 一、 分析概述
针对 `01_cmodel_deep_diff_report.md` 中揭示的物理结构缺失与 JSON 清单格式谬误，本报告通过追踪代码调用链路，精确定位到负责生成这些数据的模块与函数，并进行拆解分析。

---

## 二、 问题根因溯源拆解

### 问题 1：根节点键名错误 (`files` 代替了 `ModelFileDesc`)
- **出处文件**: `backend/main.py` 
- **出处函数**: `compile_cmodel_api(project_id: str)`
- **代码片段**:
  ```python
  if not manifest_path.exists():
      manifest = {
          "modelVersion": "1.0",
          "files": [ # <-- 【根因】在此处捏造了不符合官方协议的键名
              {"name": "CompDesc.model", "type": "MODEL_COMP", "version": "1.0"},
              # ...
          ]
      }
  ```
- **结论**: 开发人员在补全清单文件生成逻辑时，未能参考真实的基准样本（Ground Truth），而是凭借猜测“创造”了一个 JSON 结构。

### 问题 2：防篡改哈希字段 (MD5) 遗漏
- **出处文件**: `backend/main.py`
- **代码表现**: 上述代码片段中，`manifest` 字典在构造时，所有文件子项中均没有声明 `"md5"` 键。
- **更深层的架构限制 (Root Cause)**: 
  `ModelFileDesc.json` 目前是在 `backend/main.py` 调用编译流程之**前**提前生成的临时文件。
  但在此时刻，二进制文件（`.model`）尚未经过 `encoder.py` 序列化，因此系统在物理上 **不可能** 提前知道文件的大小和 MD5 哈希值。
- **结论**: 这是一个严重的**生命周期设计缺陷**。清单文件不能作为前置静态资源，它必须是整个序列化与打包流水线（Pipeline）的最后一步。

### 问题 3：类型枚举值错误 (`MODEL_ABI` vs `CAPABILITY`)
- **出处文件**: `backend/main.py` 和 `backend/core/data_manager.py` (两处均有硬编码)
- **出处函数**: `init_project` & `compile_cmodel_api`
- **代码片段**:
  ```python
  {"name": "AbiSet.model", "type": "MODEL_ABI", "version": "1.0"} # <-- 【根因】使用了错误的枚举命名
  ```
- **结论**: 属于常量定义不规范。未能与 C++ 固件端或标准工具的解析约定对齐。

### 问题 4：`FuncDesc.model` 物理文件缺失但虚假声明
- **出处文件**: `backend/skills_v2/cmodel_encoder/encoder.py`
- **出处函数**: `encode_cmodel(final_json, output_cmodel_path)`
- **代码片段**:
  ```python
  # [ISS-NEW] FuncDesc
  func_model_data = None; func_json_path = os.path.join(base_dir, "FuncDesc.json")
  if os.path.exists(func_json_path):
      try:
          with open(func_json_path, "r", encoding="utf-8") as f: func_json = json.load(f)
          func_obj = controller_model_comp_desc_pb2.Message_Module_Info()
          ParseDict(func_json, func_obj, ignore_unknown_fields=True)
          func_model_data = func_obj.SerializeToString()
      except Exception as e:
          audit.append(f"STEP4_WARNING: FuncDesc failed: {str(e)}") # <-- 【根因】静默吞掉了错误
  ```
- **深入追踪**: 为什么 `ParseDict` 会失败？
  因为 `backend/main.py` 中生成的占位符是 `{"version": "1.0", "function": []}`。但在 `comp_desc.proto` 中，`Message_Module_Info` 根本不包含 `"function"` 这个字段！它包含的是 `module_group_name` 等。
- **结论**: 企图用处理组件（CompDesc）的 Proto 对象去强行反序列化功能集（FuncDesc），导致序列化异常崩溃，最终 `func_model_data` 为 None，未被写入 ZIP。
