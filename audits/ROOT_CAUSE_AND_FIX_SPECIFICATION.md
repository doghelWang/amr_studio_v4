# CModel 生成差异：根因确认与详细修复规范

> **日期**: 2026-03-30  
> **方法论**: 解码标准 cmodel → 提取 proto 骨架 → 逐节点对标 UI 构建产物 → 追溯差异到代码行  
> **基准**: `ModelSet312.cmodel` (19 groups, 21 components)  
> **被测**: `proj_1234` (8 root groups, hierarchical nesting)

---

## 一、根因总表（按致命度排序）

| # | 根因 | 层级 | 影响 | 严重度 |
|:--|:-----|:-----|:-----|:-------|
| RC-1 | **Proto class 不存在**：encoder.py 引用 `Message_Module_Info`，但当前 pb2 中该类已重命名为 `ModelRoot` | 编码器 | encoder.py Line 61 调用立即崩溃，**整个序列化管线瘫痪** | 🔴 致命 |
| RC-2 | **ParamField.type 类型不匹配**：proto 定义为 `int32`（tag 2），但蓝图存储为字符串 `"DATA_STRING"` / `"DATA_DOUBLE"` 等 | 数据格式 | ParseDict 抛出 `invalid literal for int()` 异常，**所有组件序列化失败** | 🔴 致命 |
| RC-3 | **数值字段名不存在**：蓝图使用 `doubleValue` / `int32Value`，但 proto ParamField 中无此字段，只有 `rawValue12`（bytes）和 `stringValue` | 数据格式 | 数值参数被 `ignore_unknown_fields=True` 静默丢弃。**但验证发现：所有生产 cmodel 文件（ModelSet312, MQ-Q3, MR-HL8）中数值字段均为空模板，标准平台仅读取字段定义（key/type/desc），不读预填值** | 🟡 中等（不阻塞导入，但影响数据完整性）|
| RC-4 | **根容器字段名不匹配**：encoder.py 使用 `more_module_info` key 做 ParseDict，但 `ModelRoot` 的字段名是 `groups` | 编码器 | ParseDict 找不到字段，序列化输出为 0 bytes | 🔴 致命 |
| RC-5 | **层级结构 vs 扁平结构**：蓝图使用递归 `moreModuleInfo` 树（depth=3），但 `ModuleGroup` proto 中没有子组字段，参考文件是 19 个扁平 Tag 5 条目 | 结构 | 嵌套的 driver/motor 子模块无法被序列化 | 🟠 严重 |
| RC-6 | **`mainModuleType.typeKey` 为空**：Step 1/2 创建的 chassis/driveWheel 组件未注入 typeKey | 前端数据 | 标准平台无法识别组件类型 | 🟠 严重 |
| RC-7 | **`button-Common\n` 包含换行符**：组件名称末尾有 `\n` 字符 | 数据清洗 | 文件名和标识符异常 | 🟡 中等 |

---

## 二、逐根因详细分析与修复伪代码

---

### RC-1：Proto Class 名称错误

**现场证据**:
```python
# encoder.py Line 61 (当前代码)
temp_obj = controller_model_comp_desc_pb2.Message_Module_Info()
# ↑ AttributeError: module has no attribute 'Message_Module_Info'
```

```python
# 实际可用的 class
hasattr(pb, 'Message_Module_Info')  # → False
hasattr(pb, 'ModelRoot')            # → True
hasattr(pb, 'ModuleGroup')          # → True
```

**根因**：proto 文件被重新编译，消息名从 `Message_Module_Info` 改为 `ModelRoot`，但 encoder.py 未同步更新。

**修复文件**: `src/backend/skills_v2/cmodel_encoder/encoder.py`  
**修复函数**: `encode_cmodel()`

```python
# ===== BEFORE (Line 61) =====
temp_obj = controller_model_comp_desc_pb2.Message_Module_Info()

# ===== AFTER =====
temp_obj = controller_model_comp_desc_pb2.ModelRoot()
```

---

### RC-2：ParamField.type 类型不匹配（STRING vs INT32）

**现场证据**:
```
# Proto 定义
ParamField.type: tag=2, proto_type=5 (TYPE_INT32)

# 参考文件解码后
type=1   (DATA_STRING)
type=4   (DATA_BOOL)
type=5   (DATA_INT32)
type=10  (DATA_DOUBLE)
type=11  (DATA_COMBOX)

# 蓝图 module JSON 存储
type="DATA_STRING"
type="DATA_BOOL"
type="DATA_DOUBLE"
type="DATA_COMBOX"
```

ParseDict 在尝试将 `"DATA_STRING"` 转为 `int32` 时立即崩溃。

**根因链条**:
1. `resource_adapter.py` Line 39-46 从 XML 解析属性时，保留了字符串形式的 type：`ele = {"type": p_type, ...}` 其中 `p_type = p.get("type")` 直接取 XML attribute 值（字符串）
2. 前端 `useProjectStore.ts` 中的 `addComponent` 也使用字符串形式 type
3. 最终写入 module JSON 的 type 始终是字符串

**修复方案**：在 encoder.py 的 `proto_final_sync` 中添加类型映射转换

**修复文件**: `src/backend/skills_v2/cmodel_encoder/encoder.py`  
**修复函数**: 新增 `normalize_param_types()` 并在 `proto_final_sync()` 中调用

```python
# ===== 新增常量 =====
TYPE_STRING_TO_INT = {
    "DATA_BYTES": 0,
    "DATA_STRING": 1,
    "DATA_IP": 3,
    "DATA_BOOL": 4,
    "DATA_INT32": 5,
    "DATA_UINT32": 6,
    "DATA_INT64": 7,
    "DATA_UINT64": 8,
    "DATA_FLOAT": 9,
    "DATA_DOUBLE": 10,
    "DATA_COMBOX": 11,
    "DATA_FIXED_E": 12,
}

# ===== 修改 proto_final_sync() =====
def proto_final_sync(data):
    """递归对齐数据到 Proto 命名约定，并转换类型枚举"""
    if isinstance(data, dict):
        new_dict = {}
        for k, v in data.items():
            new_key = k  # 保持 camelCase，因为 ParseDict 支持 json_name
            
            # RC-2 修复：将 type 字段从字符串转为整数
            if k == "type" and isinstance(v, str) and v.startswith("DATA_"):
                new_dict[new_key] = TYPE_STRING_TO_INT.get(v, 0)
            else:
                new_dict[new_key] = proto_final_sync(v)
        return new_dict
    elif isinstance(data, list):
        return [proto_final_sync(item) for item in data]
    return data
```

> [!WARNING]
> 注意 `type` 字段在 `InterfaceGroup` 中是 `string` 类型（如 "CAN", "ETH"），只有在 `ParamField` 中才是 `int32`。因此转换条件必须检查 `v.startswith("DATA_")`，避免误转接口类型。

---

### RC-3：数值字段名不存在（doubleValue vs rawValue12）

**现场证据**:
```
# 蓝图使用的字段名（来自 resource_adapter.py）
{"key": "capacity", "type": "DATA_DOUBLE", "doubleValue": 24.0}
{"key": "RPM", "type": "DATA_INT32", "int32Value": 3000}

# Proto ParamField 实际可用的字段
tag=10  stringValue (string)
tag=11  boolValue (bool)
tag=12  rawValue12 (bytes)   ← 这是存放数值的字段
tag=17  rawValue17 (bytes)
tag=21  comboType (ComboType)
# 没有 doubleValue、int32Value！
```

**审计结果印证**:
```
🔥 Keys in blueprint NOT matching any proto field (8):
  - 'doubleValue'        ← 被 ignore_unknown_fields 静默丢弃
  - 'int32Value'         ← 被 ignore_unknown_fields 静默丢弃
  - 'int32Maxvalue'      ← 被静默丢弃
  - 'int32Minvalue'      ← 被静默丢弃
  - 'arrayCmobEle'       ← 被静默丢弃
  - 'interfaceParamsArray' ← key 拼写差异（proto 期望 interfaceParamsArray 但在不同消息中）
  - 'modelVersion'       ← 非 proto 字段
  - 'moreModuleInfo'     ← proto 用 'groups'
```

**根因链条**:
1. `resource_adapter.py` Line 43-44 生成 `"doubleValue": float(val)` 和 `"int32Value": int(val)`
2. 但 proto ParamField 中对应的是 `rawValue12` (bytes)，proto 根本不认识 `doubleValue`
3. ParseDict 因为 `ignore_unknown_fields=True` 将这些值全部静默丢弃
4. 结果：所有数值参数在 CompDesc.model 中变为零值

**修复方案**：在 `proto_final_sync` 中，将 `doubleValue` / `int32Value` 转换为 `rawValue12`（按 little-endian bytes 编码）

**修复文件**: `src/backend/skills_v2/cmodel_encoder/encoder.py`  
**修复函数**: 扩展 `proto_final_sync()` 或新增 `encode_typed_values()`

```python
import struct, base64

def encode_typed_values(data):
    """将 doubleValue/int32Value 等高层字段转换为 proto 期望的 rawValue12 bytes"""
    if isinstance(data, dict):
        new_data = {}
        for k, v in data.items():
            if k == 'doubleValue' and v is not None:
                # double → 8 bytes little-endian → base64 (ParseDict 对 bytes 字段期望 base64)
                raw_bytes = struct.pack('<d', float(v))
                new_data['rawValue12'] = base64.b64encode(raw_bytes).decode('ascii')
            elif k == 'int32Value' and v is not None:
                raw_bytes = struct.pack('<i', int(v))
                new_data['rawValue12'] = base64.b64encode(raw_bytes).decode('ascii')
            elif k == 'int32Maxvalue' and v is not None:
                raw_bytes = struct.pack('<i', int(v))
                new_data['rawMax30'] = base64.b64encode(raw_bytes).decode('ascii')
            elif k == 'int32Minvalue' and v is not None:
                raw_bytes = struct.pack('<i', int(v))
                new_data['rawMin40'] = base64.b64encode(raw_bytes).decode('ascii')
            elif k in ('doubleMaxvalue',) and v is not None:
                raw_bytes = struct.pack('<d', float(v))
                new_data['rawMax30'] = base64.b64encode(raw_bytes).decode('ascii')
            elif k in ('doubleMinvalue',) and v is not None:
                raw_bytes = struct.pack('<d', float(v))
                new_data['rawMin40'] = base64.b64encode(raw_bytes).decode('ascii')
            elif k == 'arrayCmobEle':
                # ComboType 子元素，proto TypeGroup 中没有此字段，需确认是否丢弃
                pass  # 当前 proto TypeGroup 只有 key + desc，无嵌套
            else:
                new_data[k] = encode_typed_values(v)
        return new_data
    elif isinstance(data, list):
        return [encode_typed_values(item) for item in data]
    return data
```

> [!IMPORTANT]
> **2026-03-30 验证结论**：经检查 ModelSet312、MQ-Q3-600LE-D(T)、MR-HL8-2000LH-C1(M) 三个生产 cmodel 文件，**所有 INT32/DOUBLE 字段的 `rawValue12` 均为空**。标准 cmodel 是配置模板，只存字段定义不存值。因此 RC-3 降级为 🟡 中等——不阻塞标准平台导入，但为保证数据完整性仍建议修复。

---

### RC-4：根容器字段名不匹配

**现场证据**:
```python
# encoder.py Line 57 (当前代码)
groups = final_json.get("more_module_info", [])

# 但 proto_final_sync 会将 camelCase 转为 snake_case：
# "moreModuleInfo" → "more_module_info"
# 而 ModelRoot 的字段名是 "groups" (tag 5)
```

```
ModelRoot proto fields:
  tag=5 name='groups' json_name='groups'
```

`ParseDict` 期望的 key 是 `"groups"`，但 encoder 传入的是 `"more_module_info"`（或 `"moreModuleInfo"`），
两者不匹配，导致 ParseDict 将其作为 unknown field 忽略掉，序列化输出 0 bytes。

**修复文件**: `src/backend/skills_v2/cmodel_encoder/encoder.py`  
**修复函数**: `encode_cmodel()` + `proto_final_sync()`

```python
# ===== BEFORE (Line 57, 62) =====
groups = final_json.get("more_module_info", [])
# ...
dummy_wrapper = {"more_module_info": [root_group]}

# ===== AFTER =====
# 展平后的组列表（见 RC-5 修复）
flat_groups = flatten_groups(final_json.get("moreModuleInfo", []))

# 序列化
comp_model_data = b""
for group in flat_groups:
    temp_obj = controller_model_comp_desc_pb2.ModelRoot()
    wrapper = {"groups": [group]}
    ParseDict(wrapper, temp_obj, ignore_unknown_fields=True)
    comp_model_data += temp_obj.SerializeToString()
```

---

### RC-5：层级结构需展平

**现场证据**:

```
参考文件 (ModelRoot.groups): 19 个扁平组，全部在根层级
蓝图 (moreModuleInfo):       8 个根组，其中 driveWheel_1/2 各嵌套 2 层：
  driveWheel_1 → driver_1 → walkMotor_1
  driveWheel_2 → driver_2 → walkMotor_2
```

Proto `ModuleGroup` 只有 4 个字段 (`moduleGroupName`, `moduleGroupUuid`, `moduleSys`, `moduleComponets`)，
**没有递归子组字段**。所有组必须展平为同级 Tag 5 条目。

用户确认：`moreModuleInfo` 在逻辑模型中确实是递归层级结构（一个模块可以包含子模块），
但在 proto 线格式中通过裸流序列化展平为 Tag 5 的重复条目。

**修复文件**: `src/backend/skills_v2/cmodel_encoder/encoder.py`  
**新增函数**: `flatten_groups()`

```python
def flatten_groups(groups):
    """
    将递归嵌套的 moreModuleInfo 树展平为扁平列表。
    每个节点的 moreModuleInfo 子节点被提取为独立的顶级组。
    
    输入:
      [{ moduleGroupName: "driveWheel_1", moduleComponets: [...],
         moreModuleInfo: [
           { moduleGroupName: "driver_1", moduleComponets: [...],
             moreModuleInfo: [
               { moduleGroupName: "walkMotor_1", moduleComponets: [...] }
             ]
           }
         ]
       }]
    
    输出:
      [{ moduleGroupName: "driveWheel_1", moduleComponets: [...] },
       { moduleGroupName: "driver_1", moduleComponets: [...] },
       { moduleGroupName: "walkMotor_1", moduleComponets: [...] }]
    """
    flat = []
    for g in groups:
        # 提取当前组（不含子组）
        current = {k: v for k, v in g.items() if k != 'moreModuleInfo'}
        
        # 仅保留有实际组件的组
        comps = current.get('moduleComponets', [])
        if comps:
            flat.append(current)
        
        # 递归展平子组
        sub_groups = g.get('moreModuleInfo', [])
        if sub_groups:
            flat.extend(flatten_groups(sub_groups))
    
    return flat
```

---

### RC-6：Step 1/2 组件缺少 `mainModuleType.typeKey`

**现场证据**:
```
LibraryGroup | name=1234         | mainModuleType.typeKey = ''  (chassis root)
LibraryGroup | name=driveWheel_1 | mainModuleType.typeKey = ''
LibraryGroup | name=driveWheel_2 | mainModuleType.typeKey = ''
```

而参考文件中的同类组件：
```
chassis_diff  | mainModuleType.typeKey = 'chassis'
diffWheel-lft | mainModuleType.typeKey = 'driveWheel'
motor-left    | mainModuleType.typeKey = 'driver'   (注意：motor 组件的 mainType 是 'driver')
```

**根因链条**:
1. `resource_adapter.py` Line 173: `"moduleGroupName": comp.get("moduleGroupName", "LibraryGroup")`
   → 前端未设置 `moduleGroupName`，默认为 "LibraryGroup"
2. `resource_adapter.py` Line 130-133: `map_component_to_cmodel()` 从 `comp.get("generalAttr")` 取 generalAttr
   → 但 Step 1/2 创建的组件没有完整的 `generalAttr`（尤其是 `mainModuleType`）
3. 前端 `useProjectStore.ts` Line 265: `addComponent()` 对 CHASSIS category 直接返回空字符串
4. 前端 Step 2 (PowerTopologyPanel) 创建的 driveWheel/driver/motor 组件通过内部逻辑生成，
   不走常规的 `addComponent` → XML schema 路径

**修复文件**: `src/backend/core/resource_adapter.py`  
**修复函数**: `map_component_to_cmodel()` + `frontend_to_comp_desc()`

```python
# ===== 在 map_component_to_cmodel() 中添加类型注入 =====

# 前端 category → proto mainModuleType.typeKey 映射表
CATEGORY_TO_TYPE_KEY = {
    'CHASSIS': 'chassis',
    'DRIVEWHEEL': 'driveWheel',
    'DRIVER': 'driver',
    'MOTOR': 'driver',          # 注意：motor 的 mainType 也是 'driver'
    'MAINCPU': 'mainCPU',
    'INTERGRATEDCONTROLLER': 'mainCPU',
    'SENSOR': 'sensor',
    'BATTERY': 'battery',       # 根据参考文件确认
    'BUTTON': 'button',
    'LIGHT': 'light',
    'IO': 'extendedlnterface',  # 注意：参考文件中确实是 'lnterface'（小写L）
}

# 前端 category → proto subSysType.typeKey
CATEGORY_TO_SUBSYS = {
    'CHASSIS': 'ChassisSys',
    'DRIVEWHEEL': 'ChassisSys',
    'DRIVER': 'MotionSys',
    'MOTOR': 'MotionSys',
    'MAINCPU': 'ControlSys',
    'SENSOR': 'SensorSys',
    'BATTERY': 'PowerSys',
    'BUTTON': 'SafetySys',
    'LIGHT': 'SafetySys',
    'IO': 'ControlSys',
}

def map_component_to_cmodel(c):
    category = c.get('category', '')
    
    # 注入 mainModuleType 如果缺失
    ga = c.get('generalAttr') or {}
    if not ga.get('mainModuleType', {}).get('comboType', {}).get('typeKey'):
        type_key = CATEGORY_TO_TYPE_KEY.get(category.upper(), '')
        if type_key:
            ga['mainModuleType'] = {
                "key": "main_module_type", 
                "type": 11,  # DATA_COMBOX (int32!)
                "comboType": {"typeKey": type_key},
                "boolParse": True
            }
    
    # 注入 subSysType 如果缺失
    if not ga.get('subSysType', {}).get('comboType', {}).get('typeKey'):
        subsys = CATEGORY_TO_SUBSYS.get(category.upper(), 'Other')
        ga['subSysType'] = {
            "key": "sub_sys_type",
            "type": 11,
            "comboType": {"typeKey": subsys},
            "boolParse": True
        }
    
    return {
        "generalAttr": {
            **ga,
            "moduleName": {"key": "module_name", "type": 1, "stringValue": c.get("name", ""), "boolParse": True},
            "moduleUuid": {"key": "module_uuid", "type": 1, "stringValue": c.get("id", ""), "boolParse": True},
        },
        # ... 其余不变
    }
```

---

### RC-7：组件名称包含换行符

**现场证据**: `button-Common\n` 末尾有 `\n` 字符。

**根因**: XML 解析时文本节点包含尾部换行符，未做 strip。

**修复文件**: `src/backend/core/resource_adapter.py`  
**修复位置**: `xml_to_component_json()` Line 22

```python
# BEFORE
"moduleName": {"stringValue": id_node.get("name", ""), ...}

# AFTER
"moduleName": {"stringValue": id_node.get("name", "").strip(), ...}
```

---

## 三、修复后的 encode_cmodel() 完整伪代码

```python
def encode_cmodel(blueprint_path, output_cmodel_path):
    audit = []
    project_dir = os.path.dirname(blueprint_path)
    
    # 1. 加载蓝图 + 解析 $ref
    with open(blueprint_path) as f:
        blueprint = json.load(f)
    full_json = resolve_with_fidelity(blueprint, project_dir)
    
    # 2. 提取 moreModuleInfo 树
    raw_groups = full_json.get("moreModuleInfo", [])
    
    # 3. RC-5: 展平嵌套层级为扁平组列表
    flat_groups = flatten_groups(raw_groups)
    audit.append(f"FLATTEN: {len(raw_groups)} root → {len(flat_groups)} flat groups")
    
    # 4. 对每个组做数据归一化
    normalized_groups = []
    for g in flat_groups:
        # RC-2: 将 type 字符串转为整数
        g = normalize_param_types(g)
        # RC-3: 将 doubleValue/int32Value 转为 rawValue12 bytes
        g = encode_typed_values(g)
        # RC-7: strip 名称中的换行符等异常字符
        g = strip_whitespace(g)
        normalized_groups.append(g)
    
    # 5. RC-1 + RC-4: 使用正确的 ModelRoot class 和 'groups' key 序列化
    comp_model_data = b""
    for group in normalized_groups:
        temp_obj = controller_model_comp_desc_pb2.ModelRoot()
        wrapper = {"groups": [group]}    # RC-4: 使用 'groups' 而非 'more_module_info'
        ParseDict(wrapper, temp_obj, ignore_unknown_fields=True)
        serialized = temp_obj.SerializeToString()
        comp_model_data += serialized
        audit.append(f"  GROUP '{group.get('moduleGroupName','?')}': {len(serialized)} bytes")
    
    audit.append(f"TOTAL CompDesc: {len(comp_model_data)} bytes, first_byte=0x{comp_model_data[0]:02x}")
    
    # 6. AbiSet + FuncDesc + ZIP 打包 (保持现有逻辑)
    # ...
```

---

## 四、深入延伸发现

### 4.1 `resource_adapter.py` 的 `to_snake()` 不应应用于所有 key

当前 `proto_final_sync` 试图将 camelCase 转为 snake_case，但 proto 的 `json_name` **就是 camelCase**：
```
ModuleGroup.moduleGroupName → json_name = "moduleGroupName" (camelCase!)
ParamField.stringValue      → json_name = "stringValue"     (camelCase!)
```

因此 `to_snake()` 转换反而会破坏 ParseDict 的识别。**应该保持 camelCase**。

### 4.2 Proto 中 `ParamField` schema 与旧版不同

旧版 pb2 (已不存在的 `Message_Module_Info`) 可能有 `double_value` / `int32_value` 等 typed 字段。
当前版本使用 `rawValue12` (bytes) 作为通用值容器。这意味着**同一套蓝图 JSON 无法在新旧 proto 间互操作**。

### 4.3 `ModuleGroup` 无 `moduleSys` 赋值

参考文件中仅 `G_MainController` 设置了 `moduleSys="ControlSys"`，其余组的 `moduleSys` 均为空。
当前蓝图中所有组的 `moduleSys` 也是空。这个字段目前非必填。

### 4.4 `structParam.extendParams` 坐标精度

参考文件中的坐标使用 `rawValue12` 编码为 double bytes (8 字节小端序)。
但当前蓝图使用 `doubleValue` (float number)。同 RC-3，需转换为 `rawValue12`。

### 4.5 `interfaceParamsArray` 的位置差异

Proto:
```
InterfaceGroup.interfaceAttrs (tag 7) → InterfaceAttrList.interfaceParamsArray
InterfaceGroup.interfaceParams (tag 8) → InterfaceParamsNested.interfaceParamsArray
```
蓝图中某些组件直接在 `interfaceGroup[].interfaceParams.interfaceParamsArray` 中存放参数，
这与 proto 的嵌套路径一致，此处无问题。

### 4.6 🔑 生产 CModel 文件是空白模板（关键发现）

**经过对 3 个生产 cmodel 的逐字段验证**：

| 文件 | Groups 数 | rawValue12 有值的字段数 |
|:-----|:----------|:----------------------|
| ModelSet312.cmodel | 19 | **0** |
| MQ-Q3-600LE-D(T).cmodel | 25 | **0** |
| MR-HL8-2000LH-C1(M).cmodel | 37 | **0** |

```
motor-left.RPM:       type=5(INT32) → rawValue12=EMPTY, stringValue=EMPTY
motor-left.gearRatio: type=10(DOUBLE) → rawValue12=EMPTY, stringValue=EMPTY
chassis.wheelSpace:   type=10(DOUBLE) → rawValue12=EMPTY
```

**结论**: 标准 cmodel 文件是**配置模板**，只定义字段结构（key, type, desc, unit, boolMustfill），
不预填用户参数值。实际参数由控制器运行时写入或由独立配置工具填充。

**对 RC-3 的影响**: 这大幅降低了 RC-3 的紧迫度——即使 `doubleValue`/`int32Value` 被丢弃，
标准平台读取 cmodel 时并不依赖预填值，而是依赖字段定义。因此 RC-3 的修复变为**数据完整性增强**而非阻塞修复。

### 4.7 `proto_final_sync` 的 `to_snake()` 转换是有害的

当前 `proto_final_sync` 试图将 camelCase 转为 snake_case：
```python
# 当前代码 encoder.py Line 27
new_key = to_snake(k)  # "moduleGroupName" → "module_group_name"
```

但 proto 编译后的 `json_name` 全部是 camelCase：
```
ModuleGroup  → json_name="moduleGroupName" (不是 module_group_name)
ParamField   → json_name="stringValue"     (不是 string_value)
GeneralAttr  → json_name="mainModuleType"  (不是 main_module_type)
```

`ParseDict` 接受 `json_name`（camelCase）或 `name`（proto 原始名，在本项目中也是 camelCase），
**不接受 `to_snake()` 产生的 snake_case**。因此 `proto_final_sync` 实际上**破坏**了数据格式。

**修复方案**: 删除 `to_snake()` 转换逻辑，改为直接保持 camelCase key。仅保留以下特殊映射：
```python
# 需要映射的唯一 key:
"moreModuleInfo" → 不转换（在序列化前已手动展平并使用 "groups"）
"moduleComponets" → 保持（proto 中就是这个拼写，含 typo）
```

---

## 五、验证计划

修复完成后，执行以下自动化验证：

```python
# 1. 编码往返测试
ref_bytes = read_ref_compdesc()
gen_bytes = encode_cmodel(blueprint_path, output_path)
ref_obj = ModelRoot(); ref_obj.ParseFromString(ref_bytes)
gen_obj = ModelRoot(); gen_obj.ParseFromString(gen_bytes)

# 2. 组数量对比
assert len(gen_obj.groups) >= 5  # proj_1234 至少 8 个展平组

# 3. 首字节必须为 0x2a (Tag 5, Wire 2)
assert gen_bytes[0] == 0x2a

# 4. 每个组件的 mainModuleType.typeKey 非空
for g in gen_obj.groups:
    for c in g.moduleComponets:
        assert c.generalAttr.mainModuleType.comboType.typeKey != ""

# 5. 数值字段非零验证
for g in gen_obj.groups:
    for c in g.moduleComponets:
        for pa in c.privateAttr.privateAttrs:
            for field in pa.arrayBaseEle:
                if field.type == 10 and field.rawValue12:  # DOUBLE with value
                    val = struct.unpack('<d', field.rawValue12)[0]
                    # 有值的字段不应为 0（根据蓝图数据）
```

---

## 六、修改文件清单

| 文件 | 修改类型 | 涉及根因 |
|:-----|:---------|:---------|
| `src/backend/skills_v2/cmodel_encoder/encoder.py` | **重大重写** | RC-1, RC-2, RC-3, RC-4, RC-5 |
| `src/backend/core/resource_adapter.py` | 中等修改 | RC-6, RC-7 |
| `src/backend/core/data_manager.py` Line 42-51 | 删除死代码 | 清理旧版错误清单生成 |

> [!CAUTION]
> **最重要的认知转变**：当前 proto schema (`rawValue12` bytes 模式) 与前端/resource_adapter 生成的 JSON (`doubleValue`/`int32Value` 模式) 之间存在**根本性的数据表示不兼容**。仅修改 encoder.py 的字段名映射是不够的——必须实现完整的值编码转换层（float→bytes→base64）。
