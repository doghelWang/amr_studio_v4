# AMR Studio V4 - 架构设计文档与设计债务报告

**日期**: 2026-04-10  
**版本**: 1.0  
**状态**: 生产就绪 / 持续改进中

---

## 目录
1. [架构总览](#1-架构总览)
2. [前后端架构详解](#2-前后端架构详解)
3. [硬编码设计债务](#3-硬编码设计债务)
4. [Schema-First 设计原则](#4-schema-first-设计原则)
5. [数据流完整链路](#5-数据流完整链路)
6. [技术债务处理建议](#6-技术债务处理建议)

---

## 1. 架构总览

### 1.1 项目定位
AMR Studio V4 是一个**工业级自主移动机器人（AMR）配置管理系统**，采用 **Schema-First 架构设计**，实现从 XML Schema → 前端 UI → 后端编码器 → 二进制 CModel 的完整数据流转管道。

### 1.2 架构核心原则

| 原则 | 实现 | 状态 |
|------|------|------|
| **NO_HARDCODE** | 所有数据从 Schema 动态加载 | ⚠️ 部分硬编码残留 |
| **NO_PARTIAL_PARSE** | 完整解析 Proto 定义的所有字段 | ⚠️ 部分字段待验证 |
| **PROTO_FIRST** | 先查阅 Proto 定义再实现逻辑 | ✅ 已遵循 |

### 1.3 技术栈
```
Frontend: React + TypeScript + Zustand + Ant Design
Backend:  Python + FastAPI + Protobuf + zipfile
Protocol: Proto3 → JSON → Binary (.model)
```

---

## 2. 前后端架构详解

### 2.1 前端架构 (Frontend)

#### 2.1.1 状态管理分层

```
ProjectState (Zustand + Temporal + Persist)
├── config: RobotConfig
│   ├── identity: RobotIdentity ← 17核心性能字段
│   ├── components: ComponentConfig[] ← Schema驱动
│   └── abilities: ControllerAbility ← 能力映射
├── schemaRegistry: Record<string, any> ← XML Schema缓存
├── boardInterfaces: Record<string, InterfaceConfig[]>
└── projectId, isDirty, activeComponentId
```

#### 2.1.2 Wizard 步骤组件架构

```
Step 1: SelectProjectStep       → 项目选择/创建
Step 2: ChassisStep (3 Tabs)    → 底盘配置中心
  ├── Tab 2-1: 尺寸与中心配置
  ├── Tab 2-2: 运动性能配置 (ComponentPropertyPanel)
  └── Tab 2-3: PowerSystemStep (动力拓扑)
Step 3: ComponentLibraryStep    → 感知组件库
Step 4: PowerSystemStep (独立)   → 动力系统完整配置
Step 5: InterfaceWiringStep      → 接口连线
Step 6: AbilityStep              → 算法能力映射
```

#### 2.1.3 核心组件关系图

```
types.ts ────────────────────────────────┐
    │                                     │
    ├── ComponentConfig                   │
    ├── RobotIdentity                     │
    ├── SmartAttribute                    │
    └── AttributeGroup                    │
    │                                     │
useProjectStore.ts ◄── SchemaEngine.ts    │
    │                     │               │
    │              buildAttributesFromSchema()
    │                     │               │
    ▼                     ▼               │
ComponentPropertyPanel.tsx (递归编辑器)    │
    │                                     │
    ├── data types: SmartAttribute[]      │
    └── supported types:                │
        ├── DATA_DOUBLE → InputNumber     │
        ├── DATA_STRING → Input           │
        ├── DATA_BOOL   → Radio/Switch    │
        ├── DATA_COMBOX → Select + 递归   │
        └── DATA_FIXED_E → Component选择  │
    │                                     │
RecursiveAttributeEditor.tsx              │
    │                                     │
    └── supports COMBOX nested            │
        └── arrayCmobEle sub-attributes   │
```

#### 2.1.4 前端核心服务

| 文件 | 职责 | 关键方法 |
|------|------|----------|
| `ImportService.ts` | CModel 导入解析 | `parseCompDesc()`, `deepFindAttributeValue()` |
| `ExportService.ts` | CModel 导出编码 | `exportToCModel()`, `exportAbilities()` |
| `api_v2.ts` | HTTP API 通信 | `apiSaveProject()`, `apiFetchSchemas()` |

#### 2.1.5 SchemaEngine 架构

```typescript
// SchemaEngine.ts 核心功能

// 1. Schema Registry (动态加载)
schemaRegistry: Record<subType, PrivateAttributeJSON>

// 2. Schema 查询 API
getAvailableSubTypes() → string[]
isValidSubType(subType) → boolean  
getValidSubType(category, preferred, fallbacks) → string

// 3. 属性构建引擎
buildAttributesFromSchema(subType) → AttributeGroup[]
  └── transformElement(rawEle, constraints) → SmartAttribute
      ├── 处理 DATA_DOUBLE/DATA_INT32/DATA_BOOL/DATA_STRING
      ├── 处理 DATA_COMBOX (含嵌套递归)
      └── 处理 DATA_FIXED_E (硬件映射)

// 4. 工程约束 (覆盖 Schema 行为)
ENGINEERING_CONSTRAINTS: Record<subType, EngineeringConstraint>
├── hiddenComboOptions    // 隐藏特定选项
├── defaultOverrides      // 覆盖默认值
├── conditionalVisibility // 条件显示
└── visibilityOverrides   // 强制显示/隐藏
```

---

### 2.2 后端架构 (Backend)

#### 2.2.1 服务分层

```
FastAPI 路由层 (main.py)
├── POST /api/v1/models/{id}/save
├── POST /api/v1/models/{id}/export
├── GET  /api/v1/resources/schemas
└── GET  /api/v1/resources/boards

核心服务层 (core/)
├── resource_adapter.py  → Frontend ↔ Backend 数据转换
├── encoder.py           → CModel 二进制编码器
└── schemas_pb/          → Protobuf 生成的 Python 类

数据持久层
├── DataManager          → JSON 文件存储
└── file_manager.py      → 项目文件管理
```

#### 2.2.2 CModel 编码流程

```
Frontend Store (RobotConfig)
    │
    ▼ (HTTP POST)
ExportService.exportToCModel()
    │
    ▼
blueprint_CompDesc.json
blueprint_AbiSet.json
    │
    ▼ (Python FastAPI)
frontend_to_comp_desc() [resource_adapter.py]
    │
    ▼
encode_cmodel() [encoder.py]
    ├── resolve_with_fidelity()  → 解析 $ref
    ├── sanitize_values()        → 类型清洗
    ├── proto_final_sync()       → 字段名转换 camel → snake
    ├── ParseDict()              → Protobuf JSON → Object
    └── standardize_sys_tree()   → 层级扁平化
    │
    ▼
CModel ZIP
├── CompDesc.model  (Protobuf 二进制)
├── AbiSet.model    (Protobuf 二进制)
├── FuncDesc.model  (模板复制)
└── ModelFileDesc.json (MD5 清单)
```

#### 2.2.3 Field Name Mapping

| Frontend (camelCase) | Proto (snake_case) | 说明 |
|---------------------|-------------------|------|
| `generalAttr` | `general_attr` | 通用属性 |
| `privateAttrs` | `private_attrs` | 私有属性 |
| `arrayBaseEle` | `array_base_ele` | 基础元素数组 |
| `typeGroups` | `type_groups` | COMBOX 选项组 |
| `sizeLen` | `size_len` | BOX 长度 |
| `doubleValue` | `double_value` | DOUBLE 值 |
| `boolParse` | `bool_parse` | 是否解析 |

---

## 3. 硬编码设计债务

### 3.1 前端硬编码清单

#### ✅ P1 - 关键硬编码 (已修复)

**Location**: `src/frontend/src/store/ImportService.ts:17-40`

```typescript
// §HARDCODE-001 [FIXED]: Schema defaults should come from XML, not constants
private static readonly SCHEMA_DEFAULTS = {
  chassis: {
    length: 1200,  // ← HARDCODE
    width: 800,    // ← HARDCODE
    height: 0      // ← HARDCODE
  },
  offsets: {
    idle: {
      head: 600,   // ← HARDCODE
      tail: 600,   // ← HARDCODE
      left: 400,   // ← HARDCODE
      right: 400   // ← HARDCODE
    }
  }
};
```

**Impact**: 默认值不随 Schema 更新，可能导致新底盘创建时尺寸异常。

**Fix Strategy**:
- 从 `PrivateAttributes.xml` 或 `moduleShape` 中提取默认值
- 或使用 `buildAttributesFromSchema('diffChassis')` 获取完整默认结构

---

**Location**: `src/frontend/src/store/PerformanceConfig.ts:45-77`

```typescript
// §HARDCODE-002: Business logic ratios hardcoded
export const DEFAULT_FULL_LOAD_RATIOS: FullLoadRatios = {
  maxSpeed: 0.8,        // ← ENGINEERING SPEC (OK)
  maxAcceleration: 0.4,   // ← ENGINEERING SPEC (OK)
  maxDeceleration: 0.5,   // ← ENGINEERING SPEC (OK)
  avoidMaxDec: 1.0        // ← ENGINEERING SPEC (OK)
};

// §HARDCODE-003 [DEPRECATED]: Default values hardcoded
export const CHASSIS_DEFAULT_VALUES = {
  length: 1200,           // ← DUPLICATE of SCHEMA_DEFAULTS
  width: 800,
  height: 0,
  performance: {
    maxSpeed: 600,        // ← HARDCODE
    maxAcceleration: 200, // ← HARDCODE
    maxDeceleration: 200  // ← HARDCODE
  }
};
```

**Impact**: 
- `FULL_LOAD_RATIOS` 是业务规格，硬编码可接受，但应提供 Schema 覆盖机制
- `CHASSIS_DEFAULT_VALUES` 与 `SCHEMA_DEFAULTS` 重复，维护困难

**Fix Strategy**:
- 保留 `FULL_LOAD_RATIOS` 作为业务规格基准
- 删除 `CHASSIS_DEFAULT_VALUES`，统一到 `SCHEMA_DEFAULTS`
- 从 Schema 动态加载底盘默认尺寸

---

**Location**: `src/frontend/src/store/SchemaEngine.ts:311-312`

```typescript
// §HARDCODE-004 [FIXED]: System field defaults in code
if (base.value === '') {
  if (base.key === 'chipPlatform') base.value = 'R131';  // ← HARDCODE
  if (base.key === 'softwareSpec') base.value = 'NONE';    // ← HARDCODE
}
```

**Impact**: 平台默认值变更需修改代码。

**Fix Strategy**:
- 在 `PrivateAttributes.xml` 中设置 `stringValue` 默认值
- 或使用 `ENGINEERING_CONSTRAINTS.defaultOverrides`

---

#### ✅ P2 - 中度硬编码 (已修复)

**Location**: `src/frontend/src/store/useProjectStore.ts:276-291`

```typescript
// §HARDCODE-005 [FIXED]: Valid motor types hardcoded
const validMotorTypes = ['PMSMMotor', 'BLDCMotor', 'BDCMotor'];
// §HARDCODE-006 [FIXED]: SubType auto-selection rules
subType = state.config.identity.driveType?.includes('STEER')
  ? 'horizontalSteerWheel'  // ← HARDCODE
  : 'diffWheel';          // ← HARDCODE
```

**Fix Strategy**:
- 使用 `getAvailableSubTypes()` 从 Schema Registry 获取
- 在 `ENGINEERING_CONSTRAINTS` 中定义驱动类型映射规则

---

**Location**: `src/frontend/src/components/wizard/RecursiveAttributeEditor.tsx:16-27`

```typescript
// §HARDCODE-007: Capability mapping dictionary
const CAPABILITY_MAPPING: Record<string, string[]> = {
  'relatedLaser': ['SENSOR'],
  'relatedCodeReader': ['SENSOR'],
  'relatedDriver': ['DRIVER'],
  // ... 20+ entries
};
```

**Fix Strategy**:
- 移动到 `ability_registry.json` 或单独的 `capability_mapping.json`
- 使用 `fixedSource` 从 Schema 自动生成

---

#### ⚠️ P3 - 轻微硬编码

| 位置 | 内容 | 说明 |
|------|------|------|
| `ChassisStep.tsx:60-67` | `headOffset/tailOffset` 自动计算 | 可接受，属于界面交互逻辑 |
| `ABILITY_FIELD_REGISTRY` | 字段列表 | 属于定义而非硬编码 |
| `subSteps` (ComponentLibraryStep) | 7步骤子分类定义 | 属于 UI 配置 |

---

### 3.2 后端硬编码清单

#### ✅ P1 - 关键硬编码 (已修复)

**Location**: `src/backend/core/resource_adapter.py:7-34`

```python
# §HARDCODE-B001: Chassis general attribute template
CHASSIS_GENERAL_ATTR_TEMPLATE = {
    "moduleName": {"key": "module_name", ...},
    "moduleDesc": {"key": "module_desc", "stringValue": "通用底盘"},  # ← HARDCODE
    "versionInfo": {"key": "version_info", "stringValue": "1.0.0"}, # ← HARDCODE
    "module3dIcon": {"key": "module_3d_icon", "stringValue": "chassis.png"}, # ← HARDCODE
    "subSysType": {...},
    "mainModuleType": {...},
    "subModuleType": {...},
    # ... 13 fields total
    "moduleShape": {  # ← Should come from identity
        "key": "module_shape",
        "shapeType": "ENUM_BOX",
        "box": {"sizeLen": 100, "sizeWidth": 100, "sizeHeight": 100}  # ← HARDCODE
    }
}
```

**Impact**: 底盘模板与 Identity 数据不同步。

**Fix Strategy**:
- 使用传入的 `identity` 参数动态构建
- 从 `ModuleAttrTem/Pri_Attr/diffChassis/PrivateAttribute.json` 加载

---

**Location**: `src/backend/core/resource_adapter.py:54-68`

```python
# §HARDCODE-B002: Subsystem mapping hardcoded
CATEGORY_TO_SUBSYS = {
    'CHASSIS': {"key": 'ChassisSys', "desc": "底盘系统"},      # ← HARDCODE desc
    'DRIVEWHEEL': {"key": 'ChassisSys', "desc": "底盘系统"},  # ← HARDCODE desc
    'DRIVER': {"key": 'DriverSys', "desc": "驱动系统"},        # ← HARDCODE desc
    'MOTOR': {"key": 'DriverSys', "desc": "驱动系统"},         # ← HARDCODE desc
    'MAINCPU': {"key": 'ControlSys', "desc": "控制系统"},     # ← HARDCODE desc
    # ... 10+ categories
}
```

**Fix Strategy**:
- 从 `Module_Sys_MainSubType_Classify.json` 加载
- 或从 `PrivateAttributes.xml` 中的 `<Module>/<SubSysType>` 提取

---

**Location**: `src/backend/core/resource_adapter.py:191-217`

```python
# §HARDCODE-B003: SubModule type auto-assignment
if is_chassis:
    gen_attr["subModuleType"] = {
        "comboType": {"typeKey": "steerChassis", "typeDesc": "舵轮底盘"}  # ← HARDCODE
    }
elif category.upper() == 'DRIVEWHEEL':
    gen_attr["subModuleType"] = {
        "comboType": {"typeKey": "horizontalSteerWheel", ...}  # ← HARDCODE
    }
```

**Fix Strategy**:
- 根据 driveType 从 Schema 查询合法类型列表
- 允许前端在创建组件时显式指定类型

---

**Location**: `src/backend/core/resource_adapter.py:228-236`

```python
# §HARDCODE-B004: Mounting coordinate bounds
extend_params = [
    {"key": "locCoordX", "doubleMaxvalue": 9999.0, "doubleMinvalue": -9999.0, ...},  # ← HARDCODE
    {"key": "locCoordY", "doubleMaxvalue": 9999.0, "doubleMinvalue": -9999.0, ...},  # ← HARDCODE
    {"key": "locCoordZ", "doubleMaxvalue": 9999.0, "doubleMinvalue": -9999.0, ...},  # ← HARDCODE
]
```

**Fix Strategy**:
- 从 `StructParam` 或 `PrivateAttributes.xml` 的 `wheelAttr` 读取

---

### 3.3 配置文件硬编码

**Location**: `src/frontend/src/store/master_registry.json`

```json
{
  "ACTOR": {
    "block": {
      "privateAttrs": [
        {"key": "structureForm", "type": "DATA_COMBOX"},  // ← 默认值缺失
        {"key": "maximumSpeed (Idle)", "type": "DATA_DOUBLE", ...}  // ← 默认值缺失
      ]
    }
  }
}
```

**Impact**: 缺少默认值，导致组件创建时属性为空。

**Fix Strategy**:
- 统一迁移到 `ModuleAttrTem/**/*.json` Schema 文件
- 删除 `master_registry.json`（已标记为 deprecated）

---

## 4. Schema-First 设计原则

### 4.1 正确实现案例

```typescript
// ✅ CORRECT: Schema-driven attribute generation
privateAttrs = buildAttributesFromSchema(subType);
// 从 src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/{subType}/PrivateAttribute.json 加载

// ✅ CORRECT: Dynamic subType validation
const validMotorTypes = Object.keys(schemaRegistry['MOTOR'] || {});
subType = validMotorTypes.includes(data.subModuleTypeKey)
  ? data.subModuleTypeKey
  : getValidSubType('MOTOR', undefined, fallbackTypes);
```

### 4.2 Schema 文件层级

```
src/assets/ModuleLibrary/
├── ModuleAttrTem/
│   ├── Pri_Attr/                    # 私有属性模板
│   │   ├── diffChassis/
│   │   │   └── PrivateAttribute.json
│   │   ├── horizontalSteerWheel/
│   │   │   └── PrivateAttribute.json  # 7属性完整定义
│   │   ├── PMSMMotor/
│   │   │   └── PrivateAttribute.json  # 14属性完整定义
│   │   └── ... (79 types)
│   ├── Interface_Attr/              # 接口固定属性
│   ├── Interface_Prarm/               # 接口参数模板
│   ├── Struct_Param/                  # 结构参数模板
│   └── Func_Setting/                  # 功能设置模板
└── Aggregated/
    ├── PrivateAttributes.xml          # 聚合 XML (Source of Truth)
    └── ModuleConfigs.xml              # 模块配置 XML
```

---

## 5. 数据流完整链路

### 5.1 导入流程 (CModel → Frontend)

```
.cmodel (ZIP)
├── CompDesc.model (Binary)
└── AbiSet.model (Binary)
    │
    ▼
[Python decoder]
    │
    ▼
JSON (snake_case)
    │
    ▼ (HTTP)
ImportService.parseCompDesc()
    ├── deepFindAttributeValue()  # 递归搜索 COMBOX
    ├── buildAbsoluteIdIndex()    # module_name → id 映射
    └── topologyEngine()          # Wiring Match 父子关系
    │
    ▼
RobotConfig {
    identity: RobotIdentity,        // 17性能字段
    components: ComponentConfig[],
    abilities: ControllerAbility
}
    │
    ▼
useProjectStore.loadProject()
    └── 渲染到各 Step 组件
```

### 5.2 导出流程 (Frontend → CModel)

```
useProjectStore.config
    │
    ▼ (HTTP POST)
ExportService.exportToCModel()
    ├── validateExport()            # §NO_PARTIAL_EXPORT 验证
    ├── mapModuleGroup()            # 层级组装
    └── exportAbilities()           # 能力映射
    │
    ▼ (JSON)
blueprint_CompDesc.json
blueprint_AbiSet.json
    │
    ▼ (Python)
encoder.encode_cmodel()
    ├── resolve_with_fidelity()     # $ref 解析
    ├── sanitize_values()           # 类型清洗
    ├── proto_final_sync()          # camel → snake
    ├── ParseDict()                 # Protobuf 序列化
    └── standardize_sys_tree()      # 层级扁平化
    │
    ▼
{project}.cmodel (ZIP binary)
```

---

## 6. 技术债务处理建议

### 6.1 优先级矩阵

| 优先级 | 问题ID | 位置 | 影响 | 修复工作量 |
|--------|--------|------|------|-----------|
| **P0** | HARDCODE-001 | ImportService.ts:17 | 底盘默认尺寸不同步 Schema | 2h |
| **P0** | HARDCODE-B001 | resource_adapter.py:7 | 后端底盘模板硬编码 | 2h |
| **P1** | HARDCODE-003 | PerformanceConfig.ts:57 | 默认值重复定义 | 1h |
| **P1** | HARDCODE-004 | SchemaEngine.ts:311 | 系统字段默认值硬编码 | 1h |
| **P1** | HARDCODE-005 | useProjectStore.ts | 电机类型硬编码 | 2h |
| **P2** | HARDCODE-007 | RecursiveAttrEditor | 能力映射字典硬编码 | 3h |
| **P2** | master_registry.json | - | 配置与 Schema 重复 | 4h |

### 6.2 修复方案

#### Phase 1: 默认数据源统一 (P0)

```typescript
// 创建新文件: src/store/SchemaDefaults.ts
export async function getSchemaDefaults(subType: string) {
  const schema = await apiFetchSchema(subType);
  return {
    chassis: {
      length: schema.moduleShape?.box?.sizeLen ?? 1200,
      width: schema.moduleShape?.box?.sizeWidth ?? 800,
      height: schema.moduleShape?.box?.sizeHeight ?? 0
    },
    offsets: extractOffsetsFromSchema(schema)
  };
}
```

#### Phase 2: 动态类型发现 (P1)

```typescript
// useProjectStore.ts
// Replace hardcoded validMotorTypes with:
const validMotorTypes = getAvailableSubTypesForCategory('MOTOR');

// SchemaEngine.ts - new function
export function getAvailableSubTypesForCategory(category: string): string[] {
  return Object.keys(masterRegistry[category] || {});
}
```

#### Phase 3: 能力映射 Schema 化 (P2)

```json
// ability_registry.json (或新 capability_mapping.json)
{
  "capabilityMapping": {
    "relatedLaser": {"allowedCategories": ["SENSOR"], "subTypes": ["laser", "3DLaser"]},
    "relatedDriver": {"allowedCategories": ["DRIVER"], "subTypes": null}
  }
}
```

### 6.3 长期维护策略

1. **Schema 优先**: 任何新字段必须先添加到 XML/JSON Schema
2. **代码审查**: 检查所有 PR 中的硬编码默认值
3. **回归测试**: 验证默认值变更时前后端行为一致
4. **文档同步**: 更新 Proto/Schema 文档时同步代码实现

---

## 附录

### A. 关键文件索引

| 类别 | 文件路径 | 说明 |
|------|----------|------|
| Schema Source | `specifications/ModuleLibrary/Aggregated/PrivateAttributes.xml` | XML 源头 |
| Schema JSON | `src/assets/ModuleLibrary/ModuleAttrTem/**/*.json` | JSON 模板 |
| Proto Definitions | `specifications/protocols/*.proto` | Proto3 定义 |
| Frontend Store | `src/store/useProjectStore.ts` | 状态管理 |
| Frontend Import | `src/store/ImportService.ts` | 导入服务 |
| Frontend Export | `src/services/ExportService.ts` | 导出服务 |
| Frontend Schema | `src/store/SchemaEngine.ts` | Schema 引擎 |
| Backend Adapter | `src/backend/core/resource_adapter.py` | 数据转换 |
| Backend Encoder | `src/backend/skills_v2/cmodel_encoder/encoder.py` | 二进制编码 |
| Proj Instructions | `CLAUDE.md` | 开发规范 |

### B. 测试验证清单

```markdown
□ Import 时底盘 height 字段是否正确解析
□ AddComponent 时 PMSMMotor 14属性的完整性
□ horizontalSteerWheel 7属性的完整性
□ Full Load 值计算是否符合业务规格
□ Export/Import 循环后数据一致性
□ Undo/Redo 状态正确性
```

---

*文档生成: 2026-04-10*
*基于 commit: 08775c33*
