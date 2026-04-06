# 端到端数据流审计报告 - CModel 解析与生成

**审计日期**: 2026-04-06  
**版本**: V1.0  
**关联文档**:  
- CLAUDE.md (开发规范)
- ENGINEERING_CONSTRAINTS.md (工程约束)
- controller_model_comp_desc.proto (协议定义)

---

## 执行摘要

本报告详细梳理了 CModel 文件从前端录入到后端生成、以及从 CModel 解压到前端展示的完整双向数据流。基于历史问题和修复经验，定义了每个环节的规则、约束和禁止事项。

### 关键发现

| 严重问题 | 数量 | 状态 |
|---------|------|------|
| 数据丢失风险点 | 5 | 待修复 |
| 硬编码违规 | 15+ | 部分修复 |
| 双向一致性风险 | 3 | 需验证 |

---

## 第一部分: CModel → 前端展示 (导入流程)

### Step 1: CModel 解压与加载

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FLOW 1.1: CModel Binary → Raw JSON                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐   │
│  │ .cmodel  │ ──▶ │ ZIP Unpack   │ ──▶ │ *.model JSON │ ──▶ │ Backend  │   │
│  │ (PKZIP)  │     │ (Python)     │     │ Decode       │     │ Parse    │   │
│  └──────────┘     └──────────────┘     └──────────────┘     └──────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**文件结构**:
```
AMR_ModelSet_Template.cmodel (ZIP)
├── CompDesc_defalut.model          # 组件描述 (CompDesc)
├── controller_abi.model            # 能力集 (AbiDesc)
└── controller_abiset.model          # 能力集定义 (AbiSet)
```

**关键约束**:
| 约束 | 规则 | 违规后果 |
|------|------|----------|
| UTF-8 编码 | 所有 .model 文件必须 UTF-8 无 BOM | 中文乱码、JSON 解析失败 |
| 必填文件 | CompDesc_defalut.model 必须存在 | 导入失败 |
| model_version | Proto `Message_Module_Info.model_version` | 缺失时默认为 undef |

---

### Step 2: Backend JSON 处理与分离

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FLOW 1.2: Backend Python → Frontend API                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────┐    │
│  │ Model       │ ──▶│ Deserializer │ ──▶│ Splitter    │ ──▶│ REST    │    │
│  │ Decoder     │    │ (PB→JSON)    │    │ (3 files)   │    │ API     │    │
│  └─────────────┘    └──────────────┘    └─────────────┘    └─────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**核心组件**:

#### 2.1 ModelDeserializer
**输入**: `CompDesc_default.model` (PB binary)  
**输出**: `model_config.json`

**关键处理**:
```python
# §2.1.1: 双重键名保护 (SnakeCase ↔ CamelCase)
# 由于历史原因，Proto 定义是 CamelCase，但某些旧文件使用 snake_case
class DualKeyDict(dict):
    """同时支持大小写键名访问"""
    def __getitem__(self, key):
        if key in self:
            return super().__getitem__(key)
        # Try snake_case conversion
        snake_key = camel_to_snake(key)
        if snake_key in self:
            return super().__getitem__(snake_key)
        raise KeyError(key)
```

**历史问题** [P0-COMPLETION-20260404]:
- **问题**: AOBO 模型的 8 个电机 `srcName` 均为 "Motor"，导致索引覆盖
- **修复**: 使用 `moduleName` (英文唯一标识) 而非 `srcName` 建立索引
- **规则**: 模块索引必须使用英文 `moduleName`，禁止依赖中文 `srcName`

#### 2.2 ResourceAdapter
**输入**: `model_config.json` (原始解码数据)  
**输出**: 规范化后为 encoder 准备的结构化数据

**关键转换**:

| 原始字段 | 目标字段 | 转换规则 | 风险 |
|---------|---------|---------|------|
| `generalAttr.moduleShape` | `shape` | shape_type → {BOX/CYLINDER} × {length/width/height/diameter} | 缺失 shape_type 时默认 BOX |
| `structParam.extendParams` | `mountX/Y/Z/...` | 提取 locCoordX/Y/Z/ROLL/PITCH/YAW | 坐标缺失时下级组件无法定位 |
| `privateAttr.privateAttrs` | `privateAttrs` | 分组结构保留 | **严禁扁平化** |

**禁止事项** [ENGINEERING_CONSTRAINTS.md §16]:
```
❌ 严禁行为: 将底盘的 privateAttrs 移入 structParam.extendParams
原因: extendParams 仅用于安装坐标
后果: 33 个底盘属性全部丢失，UI 无法显示
```

#### 2.3 Splitter (文件分离器)
**输入**: unified config  
**输出**: `{type}_desc.json`, `abi_desc.json`, `{type}_abi_info.json`

**分离逻辑**:
```python
# 按模块组 (moduleGroup) 分离文件
groups = config.get('moreModuleInfo', [])
for group in groups:
    module_sys = group.get('moduleSys') or group.get('module_sys')
    if module_sys == 'chassis':
        output = 'chassis_desc.json'
    elif module_sys == 'model_set':  # AOBO 风格
        output = 'model_set_desc.json'
    # ...
```

**历史问题**:
- **问题**: AOBO 模型使用 `model_set` 作为顶层组名，与 `chassis` 语义冲突
- **修复**: 添加 `moduleSys` 别名支持 (`module_sys`)
- **规则**: 引擎必须同时支持 `moduleSys` 和 `module_sys`

---

### Step 3: 前端解析 (ImportService)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FLOW 1.3: Frontend ImportService Deep Discovery                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────┐    ┌───────────────┐    ┌──────────────┐    ┌──────────┐   │
│  │ API JSON │ ──▶│ ImportService │ ──▶│ Component[]  │ ──▶│ Zustand  │   │
│  │          │    │ (Deep Parse)  │    │ Identity     │    │ Store    │   │
│  └──────────┘    └───────────────┘    └──────────────┘    └──────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**核心处理** [ImportService.ts]:

#### 3.1 模块索引建立 (§24.5)
```typescript
// ✅ 正确: 使用英文 moduleName (唯一标识)
const moduleNameToId = new Map<string, string>();
components.forEach(c => {
  const moduleName = c.generalAttr?.moduleName?.stringValue
    || c.generalAttr?.module_name?.string_value;  // 双重键名保护
  if (moduleName) moduleNameToId.set(moduleName, c.id);
});
```

**历史问题**: 使用 `srcName` (别名) 导致 AOBO 模型 8 电机同名覆盖。

#### 3.2 Shape 解析 (§24)
```typescript
// §24: 从 moduleShape 解析形状
const shapeType = chassis.generalAttr?.moduleShape?.shapeType
  || chassis.generalAttr?.module_shape?.shape_type;

identity.chassisShape = (shapeType === 'ENUM_CYLINDER' ? 'CYLINDER' : 'BOX');

// BOX: length/width/height
// CYLINDER: diameter/height
identity.chassisLength = chassis.shape?.length ?? SCHEMA_DEFAULTS.chassis.length;
identity.chassisWidth = chassis.shape?.width ?? SCHEMA_DEFAULTS.chassis.width;
identity.chassisHeight = chassis.shape?.height ?? SCHEMA_DEFAULTS.chassis.height;
```

**风险点**: 如果 `shapeType === undefined`，默认使用 `BOX`，但此时如果实际是 CYLINDER，会丢失 `diameter`。

#### 3.3 COMBOX 属性递归搜索 (§24.2)
```typescript
// 对于 DATA_COMBOX 字段，**只搜索选中的 typeGroup**
// 不是搜索所有 groups！
const search = (eles: SmartAttribute[]): any => {
  for (const e of eles) {
    if (e.key === key) return e.value;
    if (e.comboType?.typeGroups) {
      // §24.2: 只递归选中的组
      const selectedKey = e.comboType.typeKey;
      const selectedGroup = e.comboType.typeGroups.find(
        (g: any) => g.key === selectedKey
      );
      if (selectedGroup) {
        const res = search(selectedGroup.arrayCmobEle || []);
        if (res !== undefined) return res;
      }
    }
  }
};
```

**历史问题**: 搜索了所有 COMBOX groups，导致取值错误。

#### 3.4 拓扑连接解析
```typescript
// 轮组 → 驱动器/电机/编码器 的级联关系
pairs.forEach(p => {
  // 从 wheel.privateAttrs 读取 relateLeftMotor, relateRightMotor 等
  const targetSrcName = this.deepFindAttributeValue(w.privateAttrs, p.key);
  const targetId = moduleNameToId.get(targetSrcName);
  // ...建立 slots[wheel_left_group], slots[driver_left_group] 等
});
```

**核心算法**:
| 驱动类型 | 轮组键名规则 | 驱动器键名规则 |
|---------|-------------|---------------|
| STANDARD_DIFF | `left_group`/`right_group` | `driver_left_group`/`driver_right_group` |
| DUAL_STEER | `front_steer`/`rear_steer` | `steerDriver_front_steer` |
| QUAD_STEER | `fl_steer`/`fr_steer`/`rl_steer`/`rr_steer` | 同上 |

---

## 第二部分: 前端录入 → CModel 生成 (导出流程)

这是导入流程的逆向，但必须保持数据一致性。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FLOW 2.1: Frontend Store → Backend Encoder                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐   │
│  │ Zustand  │ ──▶│ ExportService│ ──▶│ REST POST    │ ──▶│ Backend  │   │
│  │ Store    │    │ (encode)     │    │ /api/encode  │    │ Encoder  │   │
│  └──────────┘    └──────────────┘    └──────────────┘    └──────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 1: ExportService 编码

**输入**: `RobotConfig { components[], identity }`  
**输出**: `encoded_data` (POST body)

**核心规则** [ENGINEERING_CONSTRAINTS.md §15]:

#### 1.1 后端默认填充 (Frontend-First)
```
原则: 前端提供的值优先，后端模板填充缺失字段

Frontend ──[提供字段]──▶ Backend ──[模板默认值]──▶ Final
          ──[未提供字段 X]──▶ Backend ──[必须填充 X]──▶ Final

禁止: 后端覆盖前端已提供的值
禁止: 缺失字段留空/省略
```

#### 1.2 Proto 字段零省略 (Strict Proto Compliance)
```
❌ 禁止: 前端因为值是 0/false/"" 而省略字段
✅ 必须: 所有 Proto 定义的字段都必须存在

示例:
  chassisLength: 0 → 必须发送 { "chassisLength", value: 0 }
  而不是省略该字段

后果: Proto 解析器会将缺失字段视为未设置，可能导致默认值覆盖
```

### Step 2: Backend Encoder

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FLOW 2.2: Backend Encoding Pipeline                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────┐    ┌─────────────┐    ┌──────────────┐    ┌──────────┐    │
│  │ API JSON │ ──▶│ enrich_from │ ──▶│ build_proto  │ ──▶│ Serialize│    │
│  │          │    │ _templates  │    │ _from_frontend│    │ to PB    │    │
│  └──────────┘    └─────────────┘    └──────────────┘    └──────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 2.1 模板丰富化 (enrich_from_templates)
**输入**: 前端提供的不完整数据结构  
**处理**: 从 `resources/modules/*.json` 加载模板并填充缺失字段  
**输出**: 完整的 Proto-ready 数据结构

```python
def enrich_from_templates(frontend_data):
    for component in traverse(frontend_data):
        template = load_template(component.category, component.type)

        # 遍历模板所有字段，填充前端未提供的值
        for attr_group in template.privateAttrs:
            for attr in attr_group.elements:
                if attr.key not in frontend_component:
                    # ⚠️ 补充缺失字段，保留结构完整性
                    frontend_component[attr.key] = attr.default
```

**关键兜底值** [ENGINEERING_CONSTRAINTS.md §2]:
| 字段 | 默认值 | 说明 |
|------|--------|------|
| subSysType | `UnclassifiedSys` | 未知子系统分类 |
| modelVersion | `"V1.0"` | 模型版本 |
| shape | `box(100x100x100)` | 当 shape 缺失时 |

#### 2.2 Proto 构建 (build_proto_from_frontend)

**字段映射规则**:

| Frontend | Proto | 转换规则 | 风险 |
|----------|-------|---------| ------|
| `identity.chassisLength` | `box.size_len` | 数值转换 | 必须 uint32 |
| `component.privateAttrs` | `private_attr.private_attrs` | 嵌套分组结构 | **严禁扁平化** |
| `component.mountX` etc. | `struct_param.extend_params` | locCoordX/Y/Z/... | 顺序重要 |

**COMBOX 编码**:
```python
# 前端发送: { key: 'ENCType', value: 'ENCODER_INC', comboType: { typeKey: 'ENCODER_INC' } }
# Proto 编码:
Message_Base_Element {
  key: 'ENCType'
  type: DATA_COMBOX
  combo_type {
    type_key: 'ENCODER_INC'
    type_desc: '增量式编码器'
    type_groups: [...]  # 所有可选 group
  }
}
```

#### 2.3 CModel 打包

```python
# 生成三个 .model 文件
cmodel_zip = ZipFile('output.cmodel', 'w')
cmodel_zip.write('CompDesc_default.model')  # PB binary
cmodel_zip.write('controller_abi.model')    # JSON
cmodel_zip.write('controller_abiset.model') # JSON
```

---

## 第三部分: 关键字段生命周期追踪

### 追踪 1: chassisLength (底盘长度)

```
CModel ─────────────────────────────────────────────────────────▶ UI

.stage1: box.size_len (uint32)                                    │
  │                                                                │
  ▼                                                                │
[ModelDeserializer] ──▶ chass.component.generalAttr.moduleShape   │
                    │       .box.size_len                          │
                    │                                              │
  ▼                                                                │
[ResourceAdapter] ──▶ component.shape.length                      │
                    │                                              │
  ▼                                                                │
[API Response] ──▶ { ..., "shape": { "length": 1200, ... } }      │
              │                                                    │
  ▼                                                                │
[ImportService] ──▶ identity.chassisLength = chassis.shape?.length│
                │                                                  │
  ▼                                                                │
[Zustand Store] ──▶ state.config.identity.chassisLength          │
                │                                                  │
  ▼                                                                │
[UI Display] ──▶ <InputNumber value={identity.chassisLength}/>   │

───────────────────────────────────────────────────────────────────────────────

UI ─────────────────────────────────────────────────────────────────▶ CModel

[User Edit] ──▶ identity.chassisLength = 1250                     │
           │                                                       │
  ▼                                                                │
[ExportService] ──▶ component.shape.length = identity.chassisLength│
                │  component.shape.width = identity.chassisWidth   │
                │  ...                                             │
  ▼                                                                │
[Backend Encoder] ──▶ Message_Module_General_Attribute            │
                  │   module_shape {                              │
                  │     shape_type: ENUM_BOX                      │
                  │     box { size_len: 1250, ... }               │
                  │   }                                           │
                  │                                               │
  ▼                                                                │
[CModel Output] ──▶ CompDesc_default.model (PB binary)            │
```

**关键注意点**:
- Proto 中使用 `uint32`，转换时检查负数
- UI 中单位为 mm，Proto 中无单位（纯数值）
- shape 类型必须显式指定 (ENUM_BOX/ENUM_CYLINDER)，不能省略

---

### 追踪 2: privateAttrs (私有属性组)

```
CModel ─────────────────────────────────────────────────────────▶ UI

Message_Module_Private_Attribute {                                │
  repeated private_attrs = [                                      │
    { key: "motionCenterAttr", elements: [...] },                  │
    { key: "chassisAttr", elements: [...] },                      │
    { key: "wheelsAttr", elements: [...] }                        │
  ]                                                               │
}                                                                 │
  │                                                                │
  ▼                                                                │
[Backend] ──▶ 保持分组结构                                        │
  │                                                                │
  ▼                                                                │
[API Response] ──▶ { privateAttr: { privateAttrs: [...] } }       │
  │                                                                │
  ▼                                                                │
[ImportService] ──▶ component.privateAttrs (保留分组)              │
  │                                                                │
  ▼                                                                │
[ComponentPropertyPanel] ──▶ 按 group 渲染多个 Form                │

───────────────────────────────────────────────────────────────────────────────❌ 危险区域 ────────────────────────────────────────────────────────────

历史问题 [ENGINEERING_CONSTRAINTS.md §16]:
底盘 privateAttrs 被错误地 FLATTEN 并移入 extendParams

结果: 
  Before: [motionCenterAttr(11项), chassisAttr(11项), wheelsAttr(11项)]
  After: [ {key: "motionCenterReducerRatio", value: 1}, { ... } ] 33项扁平数组

后果:
  - ComponentPropertyPanel 无法识别分组 Key
  - 所有底盘参数无法渲染
  - 导出时丢失了分组结构

修复:
  严格分离: extendParams 仅用于 locCoordX/Y/Z, privateAttrs 保持分组结构
```

---

## 第四部分: 双向一致性审计点

### 审计点 1: 默认值的源与汇

```
┌─────────────────────────────────────────────────────────────────┐
│                    默认值流向审计                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Schema Templates (JSON)                                     │
│   ┌─────────────┐                                               │
│   │defaults: {  │                                               │
│   │  length: 1200 │                                              │
│   │  width: 800   │                                              │
│   │  ...        │  ─────┐                                       │
│   └─────────────┘      │                                       │
│                        │ 谁定义的？                           │
│   Frontend ────────────┼─定义────┐                              │
│   ┌─────────────┐      │        │                              │
│   │SCHEMA_      │──────┘        │                              │
│   │DEFAULTS = { │               │                              │
│   │  length: 1200│               │ 共享？                         │
│   └─────────────┘              │                              │
│                                ▼                              │
│   Backend ────────────────────┐                               │
│   ┌─────────────┐             │                               │
│   │enrich_from_ │─────────────┘                               │
│   │templates()  │                                             │
│   │  (从Template)│                                             │
│   └─────────────┘                                             │
│                                                                 │
│   ❌ 问题: 前后端默认值可能不一致                               │
│   ✅ 解决: 统一从 ModuleLibrary JSON Schema 读取              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**状态**: ❌ 部分修复  
**优先级**: P1 (高)

### 审计点 2: COMBOX 选中的值传递

```
Frontend State                                     Backend Proto

{                                                  Message_Base_Element {
  type: 'DATA_COMBOX',                              type: DATA_COMBOX
  key: 'ENCType',                                   key: 'ENCType'
  value: 'ENCODER_INC',                            ──▶?
  comboType: {                                      comboType {
    typeKey: 'ENCODER_INC',                          typeKey: 'ENCODER_INC'  ← 假设这里
    typeDesc: '增量式...',                          typeDesc: '增量式...'
    typeGroups: [...]                                typeGroups: [...]
  }                                                  }
}                                                  }

混淆点:
  - frontend.value = 'ENCODER_INC' 是一个字符串
  - oneof_value 应该包含什么？
    A. string_value = 'ENCODER_INC' (简单字符串)
    B. 不设置 oneof_value，仅设置 comboType.type_key

正确答案: B (comboType.type_key 即为选中值)

历史问题: 曾经编码成 string_value，导致后端反序列化时读取不到
```

**状态**: ✅ 已修复  
**验证**: 需要回归测试 AOBO 模型导入导出

### 审计点 3: 安装坐标父级归属

```
组件安装坐标: mountX/Y/Z/..., mountRoll/Pitch/Yaw

Frontend ──▶ Backend ──▶ CModel Proto

mountX ──────────────────▶ structParam.extendParams {
                             arrayBaseEle: [
                               {key: 'locCoordX', doubleValue: 123},
                               {key: 'locCoordY', doubleValue: 456},
                               ...
                             ]
                           }

歧义: parentNodeUuid 在哪里存储？

答案:
  - extendParams 存储坐标
  - component.parentNodeUuid (前端 component 级别属性) 存储父级引用
  - Proto 中 parentNodeUuid 是应用层概念，不在 extendParams 中

❌ 历史问题:
  - 曾尝试将 parentNodeUuid 塞入 extendParams
  - ExportService 未导出 parentNodeUuid，导致拓扑丢失

✅ 修复:
  - ExportService 显式处理 parentNodeUuid
  - 作为 component 级别的字段传递，与 extendParams 分离
```

---

## 第五部分: 录入 → 生成的正向审计

### 流程: 新建组件 → 生成 CModel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP BY STEP: 用户新建一个差速轮 → 生成完整 CModel                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ 1. 用户点击 "添加差速轮"
│    ▼
│ 2. useProjectStore.addComponent('DRIVEWHEEL', type?, position?)
│    ▼
│ 3. 模板选择 (Schema 驱动)
│    - category: 'DRIVEWHEEL'
│    - driveType.includes('STEER') ? 'horizontalSteerWheel' : 'diffWheel'
│    ▼
│ 4. SchemaEngine.buildAttributesFromSchema(subType)
│    - 加载 src/assets/ModuleLibrary/.../diffWheel/PrivateAttribute.json
│    - 应用 EngineeringConstraints
│    - 生成 AttributeGroup[]
│    ▼
│ 5. 生成 ComponentConfig
│    {
│      id: uuidv4(),
│      category: 'DRIVEWHEEL',
│      type: 'diffWheel',
│      mountX, mountY, mountZ: (UI输入或默认值)
│      privateAttrs: [...], // 来自 SchemaEngine
│      interfaces: [...],   // 来自模板或 XML 注入
│      parentNodeUuid: null (或底盘ID如果是Top组件)
│    }
│    ▼
│ 6. 拓扑级联 (根据 ENGINEERING_CONSTRAINTS.md §10)
│    - diffWheel 必须生成 1 个 PMSMMotor
│    - 自动绑定到 relateMotor
│    ▼
│ 7. 用户保存项目
│    ▼
│ 8. ExportService.encodeComponents()
│    - 遍历所有 components
│    - 每个 component → Message_Module_Componets
│    - 建立 moduleGroup 层级
│    ▼
│ 9. Backend /api/encode
│    - 接收 JSON
│    - enrich_from_templates (补充缺失字段)
│    - 格式标准化 (proto_final_sync: snake → camel)
│    - 序列化为 PB
│    ▼
│ 10. 返回 CModel ZIP
│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 第六部分: 审计发现的风险清单

| 风险ID | 位置 | 风险描述 | 严重程度 | 状态 |
|--------|------|---------|---------|------|
| R001 | ExportService | shape 类型判断依赖名称匹配，可能出错 | 🟠 | 待修复 |
| R002 | Backend Encoder | 底盘 parentNodeUuid 归属未明确 | 🟠 | 待验证 |
| R003 | Import/Export 双向 | 默认值前后端不一致 | 🟠 | 进行中 |
| R004 | UI 表单 | 某些字段隐藏时，默认值未正确填充 | 🟡 | 待确认 |
| R005 | Protocol | data_type 整数值与 Proto enum 映射 | 🟠 | 已修复，需验证 |

---

## 附录 A: Proto/JSON/TS 类型映射

### data_type (MESSAGE_BASE_DATA_TYPE)

| Proto Enum | 整数值 | JSON Type | TypeScript |
|-----------|--------|-----------|------------|
| DATA_STRING | 1 | string | string |
| DATA_BOOL | 4 | boolean | boolean |
| DATA_INT32 | 5 | number | number |
| DATA_UINT32 | 6 | number | number |
| DATA_DOUBLE | 10 | number | number |
| **DATA_COMBOX** | 11 | object | SmartAttribute with comboType |
| **DATA_FIXED_E** | 12 | string (UUID) | reference to other component |

### 特殊处理: DATA_COMBOX

```typescript
// Proto → JSON
Message_Combox_Type {
  type_key: string        // 选中的 key
  type_desc: string      // 描述
  type_groups: [...]     // 所有可选 group
}

// JSON → TypeScript
interface SmartAttribute {
  type: 'DATA_COMBOX'
  key: string
  value: string  // 当前选中的 typeKey
  comboType: {
    typeKey: string
    typeDesc: string
    typeGroups: Array<...>
  }
}
```

### 特殊处理: DATA_FIXED_E

```typescript
// 用于: relateMotor, relateDriver, relateEncode 等引用字段
// Proto: string_value = "uuid-of-target-component"
// UI: 下拉选择器，显示目标组件的 srcName
```

---

## 附录 B: 关键 Proto Message 完整定义

### Message_Module_Componets (组件定义)

```protobuf
message Message_Module_Componets {
  // Tag 1: 通用属性 (模块名、描述、UUID、型号、厂商等)
  Message_Module_General_Attribute general_attr = 1;

  // Tag 2: 私有属性 (私有参数，分组结构)
  Message_Module_Private_Attribute private_attr = 2;

  // Tag 3: 接口能力 (该模块支持哪些总线接口)
  Message_Interface_Ability interface_ability = 3;

  // Tag 4: 接口实例 (CAN0/CAN1/Ethernet 等实际配置的接口)
  Message_Interface_Param interface_params = 4;

  // Tag 5: 结构参数 (安装坐标等)
  Message_Struct_Param struct_param = 5;

  // Tag 6-7: 废弃/禁用标志
  bool bool_deprecated = 6;
  bool bool_disable = 7;
}
```

---

**报告编制**: Claude Code  
**审核状态**: Draft  
**下次更新**: 修复 R001-R005 后
