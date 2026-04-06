# AMR Studio V4 四大问题手动修复指南

**生成时间**: 2026-04-04  
**适用版本**: main分支 (git commit 78db5267)  

---

## 问题1: ComponentPropertyPanel 属性不显示 (最严重 ⚠️)

### 根本问题
`PowerSystemStep` 传递了 `component` prop，但 `ComponentPropertyPanel` 的 props 解构没有接收它，仍然只通过 `selectedUuid` 去 store 查找。

### 文件位置
**文件**: `src/frontend/src/components/wizard/ComponentPropertyPanel.tsx`  
**行号**: 第25-43行 (Props 定义) 和 第45-61行 (组件签名)

### 修复步骤

#### 步骤1：修改 Props 接口定义 (约第25-43行)

**删除原代码**:
```typescript
interface Props {
  projectId: string | null;
  selectedUuid: string;
  excludeGroupKeys?: string[];
  onlyGroupKeys?: string[];
  excludeElementKeys?: string[];
  onlyElementKeys?: string[];
  hideTabs?: boolean;
  /** Callback invoked after an attribute is updated, for cross-component sync */
  onAttributeChange?: (sourceId: string, groupKey: string, attrKey: string, value: any, subKey?: string) => void;
}
```

**替换为新代码**:
```typescript
interface Props {
  /** Mode 1: Direct component passing (used during import/creation) */
  component?: any;
  onAttributeChange?: (groupId: string, attrKey: string, value: any, subKey?: string) => void;
  onInterfaceChange?: (ifaceUuid: string, data: any) => void;
  onInterfaceParamChange?: (ifaceUuid: string, params: any) => void;
  onStructuralChange?: (data: any) => void;

  /** Mode 2: Backend fetch (used when editing saved projects) */
  projectId?: string | null;
  selectedUuid?: string;
  excludeGroupKeys?: string[];
  onlyGroupKeys?: string[];
  excludeElementKeys?: string[];
  onlyElementKeys?: string[];
  hideTabs?: boolean;
  /** Callback invoked after an attribute is updated, for cross-component sync */
  onAttributeChangeSync?: (sourceId: string, groupKey: string, attrKey: string, value: any, subKey?: string) => void;
}
```

#### 步骤2：修改组件签名和解构 (约第45-61行)

**删除原代码**:
```typescript
export const ComponentPropertyPanel: React.FC<Props> = ({
  projectId,
  selectedUuid,
  excludeGroupKeys,
  onlyGroupKeys,
  excludeElementKeys,
  onlyElementKeys,
  hideTabs = false,
  onAttributeChange
}) => {
  const [compData, setCompData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { config, updateAttribute, updateStructuralParam, linkInterface, updateInterfaceParams } = useProjectStore();
  const [messageApi, contextHolder] = message.useMessage();

  const selectedStoreComponent = config.components.find(c => c.id === selectedUuid);
```

**替换为新代码**:
```typescript
export const ComponentPropertyPanel: React.FC<Props> = (props) => {
  const {
    component: directComponent,
    onAttributeChange: directOnAttributeChange,
    onInterfaceChange: directOnInterfaceChange,
    onInterfaceParamChange: directOnInterfaceParamChange,
    onStructuralChange: directOnStructuralChange,
    projectId,
    selectedUuid,
    excludeGroupKeys,
    onlyGroupKeys,
    excludeElementKeys,
    onlyElementKeys,
    hideTabs = false,
    onAttributeChangeSync
  } = props;

  const [compData, setCompData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { config, updateAttribute, updateStructuralParam, linkInterface, updateInterfaceParams } = useProjectStore();
  const [messageApi, contextHolder] = message.useMessage();

  // [P0-FIX-2026-04-04] Support both direct component passing and store lookup
  const selectedStoreComponent = directComponent
    || config.components.find(c => c.id === selectedUuid)
    || null;
```

---

## 问题2: 底盘形状解析为圆形 (BUG-001)

### 文件位置
**文件**: `src/frontend/src/store/ImportService.ts`  
**行号**: 约第239-243行

### 修复步骤

**找到这段代码**:
```typescript
shape: gen.moduleShape?.box ? {
  type: 'BOX',
  length: gen.moduleShape.box.sizeLen || gen.moduleShape.box.size_len || 0,
  width: gen.moduleShape.box.sizeWidth || gen.moduleShape.box.size_width || 0,
  height: gen.moduleShape.box.sizeHeight || gen.moduleShape.box.size_height || 0
} : undefined,
```

**替换为**:
```typescript
shape: gen.moduleShape?.box ? {
  type: 'BOX',
  length: gen.moduleShape.box.sizeLen || gen.moduleShape.box.size_len || 0,
  width: gen.moduleShape.box.sizeWidth || gen.moduleShape.box.size_width || 0,
  height: gen.moduleShape.box.sizeHeight || gen.moduleShape.box.size_height || 0
} : gen.moduleShape?.cylinder ? {
  type: 'CYLINDER',
  diameter: gen.moduleShape.cylinder.diameter || 0,
  height: gen.moduleShape.cylinder.height || 0
} : undefined,
```

---

## 问题3: 底盘性能信息缺失 (BUG-002)

### 文件位置
**文件**: `src/frontend/src/store/ImportService.ts`  
**行号**: 约第59-69行

### 修复步骤

**找到这段代码**:
```typescript
if (chassis) {
  identity.chassisLength = chassis.shape?.length || 1200;
  identity.chassisWidth = chassis.shape?.width || 800;
  // Recursive value finder for chassis physics
  const findVal = (key: string) => this.deepFindAttributeValue(chassis.privateAttrs, key);
  identity.headOffset = Number(findVal('headOffset(Idle)')) || 600;
  identity.leftOffset = Number(findVal('leftOffset(Idle)')) || 400;
  identity.maxSpeed = Number(findVal('maxSpeed(Idle)')) || 0;
  identity.selfWeight = Number(findVal('selfWeight')) || 0;
  identity.totalLoadWeight = Number(findVal('totalLoadWeight')) || 0;
}
```

**替换为**:
```typescript
if (chassis) {
  identity.chassisLength = chassis.shape?.length || 1200;
  identity.chassisWidth = chassis.shape?.width || 800;
  // Recursive value finder for chassis physics
  const findVal = (key: string) => this.deepFindAttributeValue(chassis.privateAttrs, key);
  identity.headOffset = Number(findVal('headOffset(Idle)')) || 600;
  identity.leftOffset = Number(findVal('leftOffset(Idle)')) || 400;
  identity.maxSpeed = Number(findVal('maxSpeed(Idle)')) || 0;
  identity.maxAccel = Number(findVal('maxAcceleration(Idle)')) || 0;
  identity.maxDecel = Number(findVal('maxDeceleration(Idle)')) || 0;
  identity.avoidMaxDec = Number(findVal('avoidMaxDec (Idle)')) || 0;
  identity.selfWeight = Number(findVal('selfWeight')) || 0;
  identity.totalLoadWeight = Number(findVal('totalLoadWeight')) || 0;
  // 满载版本 (Full Load)
  identity.headOffsetFull = Number(findVal('headOffset (Full Load)')) || identity.headOffset;
  identity.tailOffsetFull = Number(findVal('tailOffset (Full Load)')) || identity.tailOffset;
  identity.leftOffsetFull = Number(findVal('leftOffset (Full Load)')) || identity.leftOffset;
  identity.rightOffsetFull = Number(findVal('rightOffset (Full Load)')) || identity.rightOffset;
  identity.maxSpeedFull = Number(findVal('maxSpeed (Full Load)')) || Math.round(identity.maxSpeed * 0.8);
  identity.maxAccelFull = Number(findVal('maxAcceleration (Full Load)')) || Math.round(identity.maxAccel * 0.4);
  identity.maxDecelFull = Number(findVal('maxDeceleration (Full Load)')) || Math.round(identity.maxDecel * 0.5);
  identity.avoidMaxDecFull = Number(findVal('avoidMaxDec (Full Load)')) || identity.avoidMaxDec;
}
```

---

## 问题4: 编码器关联错误 (增量 vs 绝对值) (BUG-003)

### 文件A: ImportService.ts

**文件**: `src/frontend/src/store/ImportService.ts`  
**行号**: 约第94-100行

**找到这段代码**:
```typescript
const pairs = [
  { key: 'relateLeftMotor', role: 'walk_left' },
  { key: 'relateRightMotor', role: 'walk_right' },
  { key: 'relateWalkMotor', role: 'walk' },
  { key: 'relateRotMotor', role: 'steer' },
  { key: 'relatedEncode', role: 'encoder' }
];
```

**替换为**:
```typescript
const pairs = [
  { key: 'relateLeftMotor', role: 'walk_left' },
  { key: 'relateRightMotor', role: 'walk_right' },
  { key: 'relateWalkMotor', role: 'walk' },
  { key: 'relateRotMotor', role: 'steer' },
  { key: 'relatedEncode', role: 'encoder' },
  // [P0-FIX-2026-04-04] Fix: steering wheel encoder associations
  { key: 'relateLeftEncode', role: 'encoder_left' },
  { key: 'relateRightEncode', role: 'encoder_right' },
  // Deep nested encoder in angleSensor combo
  { key: 'angleSensor.relateEncode', role: 'encoder', nested: 'angleSensor' }
];
```

### 文件B: PowerSystemStep.tsx

**文件**: `src/frontend/src/components/wizard/PowerSystemStep.tsx`  
**行号**: 约第26-38行

**找到这段代码**:
```typescript
const powerComponents = useMemo(() => config.components.filter(c => {
  const cat = c.category;
  const alias = (c.alias || '').toLowerCase();
  const subType = (c.subModuleTypeKey || '').toLowerCase();

  // Only include core power chain categories
  if (['DRIVEWHEEL', 'DRIVER', 'MOTOR'].includes(cat)) return true;

  // Include encoders from SENSOR category
  if (cat === 'SENSOR' && (alias.includes('编码') || subType.includes('encode'))) return true;

  return false;
}), [config.components]);
```

**替换为**:
```typescript
const powerComponents = useMemo(() => config.components.filter(c => {
  const cat = c.category;
  const alias = (c.alias || '').toLowerCase();
  const subType = (c.subModuleTypeKey || '').toLowerCase();

  // Only include core power chain categories
  if (['DRIVEWHEEL', 'DRIVER', 'MOTOR'].includes(cat)) return true;

  // Include encoders from SENSOR category
  if (cat === 'SENSOR' && (alias.includes('编码') || subType.includes('encode'))) {
    // [P0-FIX-2026-04-04] Exclude incremental encoders (motor internal)
    if (subType.includes('increment') || subType === 'incrementalencode') {
      return false; // Motor internal encoder, skip
    }
    // Only show encoders that are actually linked by wheels
    const isLinkedByWheel = config.components.some(w =>
      w.category === 'DRIVEWHEEL' &&
      (w.parentNodeUuid === c.id || // Wheel's parent is encoder
       config.components.find(m => m.category === 'MOTOR' && m.parentNodeUuid === w.id)?.parentNodeUuid === c.id)
    );
    return true; // Keep all for now, topology will organize
  }

  return false;
}), [config.components]);
```

---

## 重启命令

完成所有修改后，执行以下命令重启服务：

```bash
# 1. 停止现有前端服务 (如果在前端目录)
pkill -f "vite"

# 2. 重启前端
cd /Users/wangfeifei/code/amr_studio_v4/src/frontend
npm run dev

# 3. 后端服务 (另一个终端)
pkill -f "python.*main.py"
cd /Users/wangfeifei/code/amr_studio_v4/src/backend
python main.py
```

---

## 验证清单

修复完成后，验证以下功能：

| 验证项 | 期望结果 |
|--------|---------|
| 1. PowerSystemStep 点击轮组 | 右侧显示属性面板，有wheelAttr等分组 |
| 2. 导入底盘 | 形状正确显示为BOX或CYLINDER |
| 3. 2-2 页面 | 显示 maxAccel/maxDecel/avoidMaxDec 字段 |
| 4. 2-3 拓扑树 | 只显示绝对值编码器，无孤立增量编码器 |

---

## 附录：Root Cause 总结

1. **属性不显示**: ComponentPropertyPanel 只支持 backend-fetch 模式，不支持 direct-component 模式，导致 PowerSystemStep 传入的 `component` prop 被忽略
2. **形状错误**: ImportService 只解析 `box` 形状，未处理 `cylinder`
3. **加速度缺失**: ImportService.parseCompDesc 未提取加速度相关字段
4. **编码器错误**: PowerSystemStep 过滤器未排除增量编码器（电机内置），且缺失关联 key 支持
