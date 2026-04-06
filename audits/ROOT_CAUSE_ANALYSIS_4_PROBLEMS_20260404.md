# Root Cause Analysis Report
## 四大问题深度根因分析
**分析时间**: 2026-04-04  
**分析人**: Claude Code  

---

## 问题1：底盘形状解析为圆形 (BUG-001)

### 现象
导入后底盘形状显示为 `undefined`，UI 回退到圆形渲染。

### 根因定位
**文件**: `src/frontend/src/store/ImportService.ts:239-243`  
**问题代码**:
```typescript
shape: gen.moduleShape?.box ? {
  type: 'BOX',
  length: gen.moduleShape.box.sizeLen || gen.moduleShape.box.size_len || 0,
  width: gen.moduleShape.box.sizeWidth || gen.moduleShape.box.size_width || 0,
  height: gen.moduleShape.box.sizeHeight || gen.moduleShape.box.size_height || 0
} : undefined,
```

**致命缺陷**: 代码只检查了 `box` 形状，完全未处理 `cylinder` 形状！

### Proto 定义对照
```protobuf
message Message_Module_Shape {
  MESSAGE_SHAPE_TYPE shape_type = 1;  // ENUM_BOX=1, ENUM_CYLINDER=2
  oneof oneof_value {
    Message_Sphere sphere = 10;
    Message_BOX box = 11;
    Message_CYLINDER cylinder = 12;  // 丢失的处理分支！
  }
}
```

### 修复方案
```typescript
shape: gen.moduleShape?.box ? {
  type: 'BOX',
  length: gen.moduleShape.box.sizeLen || gen.moduleShape.box.size_len || 0,
  width: gen.moduleShape.box.sizeWidth || gen.moduleShape.box.size_width || 0,
  height: gen.moduleShape.box.sizeHeight || gen.moduleShape.box.size_height || 0
} : gen.moduleShape?.cylinder ? {
  type: 'CYLINDER',
  diameter: gen.moduleShape.cylinder.diameter || gen.moduleShape.cylinder.diameter || 0,
  height: gen.moduleShape.cylinder.height || gen.moduleShape.cylinder.height || 0
} : undefined,
```

---

## 问题2：底盘性能信息缺失 (BUG-002)

### 现象
2-2 界面只显示 maxSpeed，缺失 maxAccel/maxDecel/avoidMaxDec。

### 根因定位
**文件**: `src/frontend/src/store/ImportService.ts:59-68`  
**提取代码缺失**:
```typescript
const findVal = (key: string) => this.deepFindAttributeValue(chassis.privateAttrs, key);
identity.maxSpeed = Number(findVal('maxSpeed(Idle)')) || 0;
// ❌ 缺失 acceleration/deceleration 提取
```

**应提取但未提取的字段**:
- `maxAcceleration(Idle)` → identity.maxAccel
- `maxDeceleration(Idle)` → identity.maxDecel  
- `avoidMaxDec (Idle)` → identity.avoidMaxDec
- 满载版本: `maxAcceleration (Full Load)`, `maxDeceleration (Full Load)`, `avoidMaxDec (Full Load)`

### 修复方案
```typescript
identity.maxSpeed = Number(findVal('maxSpeed(Idle)')) || 0;
identity.maxAccel = Number(findVal('maxAcceleration(Idle)')) || 0;
identity.maxDecel = Number(findVal('maxDeceleration(Idle)')) || 0;
identity.avoidMaxDec = Number(findVal('avoidMaxDec (Idle)')) || 0;
// 满载版本
identity.maxSpeedFull = Number(findVal('maxSpeed (Full Load)')) || 0;
identity.maxAccelFull = Number(findVal('maxAcceleration (Full Load)')) || 0;
identity.maxDecelFull = Number(findVal('maxDeceleration (Full Load)')) || 0;
identity.avoidMaxDecFull = Number(findVal('avoidMaxDec (Full Load)')) || 0;
```

---

## 问题3：错误关联孤立增量编码器 (BUG-003)

### 现象
2-3 动力拓扑显示孤零零的 incrementalEncode，丢失了真正的 absoluteValueEncode。

### 根因分析
**问题A**: `PowerSystemStep.tsx` 的过滤器问题：
```typescript
// 当前代码只匹配 category === 'SENSOR' 且包含 'encode' 关键字的组件
if (cat === 'SENSOR' && (alias.includes('编码') || subType.includes('encode'))) return true;
```

**问题B**: `ImportService.ts` 的拓扑配对**仅检查 5 个 key**：
```typescript
const pairs = [
  { key: 'relateLeftMotor', role: 'walk_left' },
  { key: 'relateRightMotor', role: 'walk_right' },
  { key: 'relateWalkMotor', role: 'walk' },
  { key: 'relateRotMotor', role: 'steer' },
  { key: 'relatedEncode', role: 'encoder' }  // 只认这个！
];
```

**关键发现**: 在 `horizontalSteerWheel` 模板中，编码器关联在 **arrayCmobEle 嵌套下**：
```yaml
angleSensorType: GROUP_CALI_ABS_EXTERNAL
  └─ arrayCmobEle:
       └─ relatedEncode: DATA_FIXED_E  ← 这里！
```

`deepFindAttributeValue` 虽然支持递归搜索，但 **horizontalSteerWheel 和 diffSteerWheel 的实际关联 key 不同**！

| 轮组类型 | 编码器关联 Key |
|---------|---------------|
| horizontalSteerWheel | `angleSensor` → `relatedEncode` (嵌套) |
| diffSteerWheel | `relateLeftEncoder`, `relateRightEncoder` |

### 完整修复清单
1. 添加 `relateLeftEncoder`, `relateRightEncoder` 到 pairs 列表
2. 确保 `deepFindAttributeValue` 穿透 `DATA_COMBOX` 的 `arrayCmobEle`
3. PowerSystemStep 过滤器应排除 `incrementalEncode`（内置编码器），只显示外置绝对值编码器

---

## 问题4：PowerSystemStep 属性不显示 (BUG-004)

### 现象
2-3 中点击轮组/电机/驱动器节点，属性面板空白。

### 根因定位
**API 签名不匹配**！

**ComponentPropertyPanel 期望的 Props** (行 25-35):
```typescript
interface Props {
  projectId: string | null;   // 必需！
  selectedUuid: string;       // 必需！
  onAttributeChange?: ...
}
```

**PowerSystemStep 实际调用** (行 103-120):
```typescript
<ComponentPropertyPanel
  component={activeComp}      // ❌ 完全不是期望的 props！
  onAttributeChange={...}
  onInterfaceChange={...}
  ...
/>
```

**两种使用方式冲突**:
1. `ChassisStep.tsx` 直接传入 `component` 对象（旧方式）
2. 新组件期望 `projectId` + `selectedUuid` 并从后端获取（新方式）

由于传入的 prop 不是 `{ projectId, selectedUuid }`，组件内部使用：
```typescript
const { config, updateAttribute, ... } = useProjectStore();
const selectedStoreComponent = config.components.find(c => c.id === selectedUuid);  // ❌ selectedUuid 是 component 对象！
```

当 `selectedUuid` 实际上是 component 对象而非字符串时，`find` 返回 `undefined`。

### 修复方案
统一 API：让 ComponentPropertyPanel 支持两种模式：
1. **Direct Mode**: 直接传入 `component` 对象（导入/创建时用）
2. **Fetch Mode**: 传入 `projectId` + `selectedUuid` 从后端获取

```typescript
interface Props {
  // Mode 1: Direct
  component?: ComponentConfig;
  // Mode 2: Fetch
  projectId?: string;
  selectedUuid?: string;
  // ...
}
```

---

## 总结表

| 问题 | 文件 | 行号 | 根因 |
|-----|------|------|------|
| 1-形状错误 | ImportService.ts | 239-243 | 只检查 box，未检查 cylinder |
| 2-加速度缺失 | ImportService.ts | 59-68 | 未提取 maxAccel/maxDecel/avoidMaxDec |
| 3-编码器错误 | ImportService.ts<br>PowerSystemStep.tsx | 94-100<br>26-38 | 缺失关联 key<br>过滤器过于宽泛 |
| 4-属性不显示 | ComponentPropertyPanel.tsx<br>PowerSystemStep.tsx | 25-35<br>103-120 | API Props 签名不匹配 |

---

## 修复优先级

1. **P0**: BUG-004 (PowerSystemStep 属性不显示) - 阻断性，无法配置动力组件
2. **P0**: BUG-001 (底盘形状) - 视觉错误，影响底盘可视化
3. **P1**: BUG-002 (加速度缺失) - 功能缺失，影响运动控制
4. **P1**: BUG-003 (编码器错误) - 拓扑不完整，但可以手动后配置
