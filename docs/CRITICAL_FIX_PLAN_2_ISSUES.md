# 致命问题修复计划

## 问题1: 底盘形状解析为圆形 (已定位 root cause)

### 根因分析
**文件**: `src/frontend/src/store/ImportService.ts:239-243`

```typescript
// BUG: 只检查 box，未检查 cylinder，导致 shape 为 undefined
shape: gen.moduleShape?.box ? {
  type: 'BOX', ...
} : undefined,  // ← 当实际为 cylinder 时，返回 undefined
```

当 shape 为 undefined 时，组件会继承默认值... 但等等，让我检查实际渲染逻辑：

**ChassisVisualizer.tsx** 的 shape 处理：
```typescript
// 如果 shape 未定义或不是 BOX，会显示圆形！
{
  identity.chassisShape === 'BOX' ? (
    <rect ... />
  ) : (
    <circle ... />  // ← 默认回退到圆形
  )
}
```

### 修复
**文件**: ImportService.ts 第239-243行

替换为：
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

## 问题2: 增量编码器错误关联 (root cause + 解决方案)

### 根因分析

**多层问题叠加**:
1. **PowerSystemStep 过滤器过于宽泛** (第35行)
   - 任何包含"编码"字符的 SENSOR 都会被包括
   - 未区分别名相似但功能不同的编码器

2. **ImportService 拓扑配对缺失关键 keys**
   - 当前只检查 `relatedEncode`
   - 但 horizontalSteerWheel 的编码器嵌套在 `angleSensor` 组下的 `arrayCmobEle` 中
   - diffSteerWheel 有 `relateLeftEncoder`/`relateRightEncoder`

3. **parentNodeUuid 赋值逻辑问题**
   - 代码遍历轮组属性时，**未穿透 DATA_COMBOX 嵌套层级**
   - `deepFindAttributeValue` 虽然支持递归，但 **horizontalSteerWheel 的编码器关联** 需要特殊处理

### PrivateAttribute.xml 结构证据

**horizontalSteerWheel (第741-791行)**:
```xml
<Group key="angleSensor" desc="转向反馈">
  <Attribute key="angleSensorType" type="DATA_COMBOX">
    <comboType typeKey="GROUP_CALI_ABS_EXTERNAL">
      <typeGroups>
        <Item key="GROUP_CALI_ABS_EXTERNAL" desc="绝对式编码器(外置)">
          <arrayCmobEle>
            <Item key="relatedEncode" type="DATA_FIXED_E"/>  <!-- 在这里！-->
            <Item key="gearRatio" type="DATA_DOUBLE"/>
          </arrayCmobEle>
        </Item>
      </typeGroups>
    </comboType>
  </Attribute>
</Group>
```

**编码器关联路径**:
- 水平舵轮: `angleSensor` → `angleSensorType=GROUP_CALI_ABS_EXTERNAL` → `relatedEncode`
- 垂直舵轮: 同上
- 差速舵轮: `relateLeftEncoder`/`relateRightEncoder` (顶层)

### 修复方案

#### 修复 A: 增强 PowerSystemStep 过滤器

**文件**: PowerSystemStep.tsx 第26-38行

```typescript
const powerComponents = useMemo(() => config.components.filter(c => {
  const cat = c.category;
  const alias = (c.alias || '').toLowerCase();
  const subType = (c.subModuleTypeKey || '').toLowerCase();

  // Only include core power chain categories
  if (['DRIVEWHEEL', 'DRIVER', 'MOTOR'].includes(cat)) return true;

  // [P1-FIX-2026-04-04] 严格筛选编码器：只包含外置绝对值编码器
  if (cat === 'SENSOR' && subType.includes('encode')) {
    // 排除增量编码器（电机内置）
    if (subType === 'incrementalencode' || subType.includes('increment')) {
      return false;
    }
    // 只保留绝对值编码器
    if (subType === 'absolutevalueencode' || 
        subType === 'multiturnabsencoder' ||
        subType.includes('absolute')) {
      return true;
    }
    // 其他编码器类型暂不显示
    return false;
  }

  return false;
}), [config.components]);
```

#### 修复 B: 增强 ImportService 拓扑解析

**需要添加的关联 keys** (第94-100行附近):

```typescript
// 编码器关联配置
const encoderKeys = {
  // 标准轮组 - 直接属性
  standard: ['relatedEncode'],
  
  // 舵轮 - 嵌套在 angleSensor combo 内
  steerWheel: [
    { group: 'angleSensor', attr: 'relatedEncode', when: 'angleSensorType', is: 'GROUP_CALI_ABS_EXTERNAL' }
  ],
  
  // 差速舵轮 - 左右独立
  diffSteer: ['relateLeftEncoder', 'relateRightEncoder']
};
```

**更重要的是修改 deepFindAttributeValue**, 让其支持 **comboType 条件路径**:

```typescript
// 新函数：智能查找，支持条件路径
private static smartFindAttribute(attrs: AttributeGroup[], path: string[]): any {
  // path 示例: ['angleSensor', 'angleSensorType=GROUP_CALI_ABS_EXTERNAL', 'relatedEncode']
  // 实现遍历逻辑...
}
```

### 建议的完整修复优先级

1. **立即修复 (P0)**: ImportService.ts 添加 cylinder 支持 ← 单点修复，低风险
2. **立即修复 (P0)**: PowerSystemStep 过滤器 ← 排除增量编码器
3. **后续优化 (P1)**: ImportService 增强 encoder 关联解析 ← 需要深入测试

### 关键验证清单

| 修复项 | 验证方法 |
|--------|---------|
| 底盘形状 | 导入后检查 `chassisComponent.shape.type` 应为 'BOX' |
| 编码器过滤 | 2-3 页面只显示 "绝对值编码器" 类型节点 |
| 拓扑关联 | absoluteValueEncode.parentNodeUuid 应指向对应轮组 |

---

## 是否需要我直接修复？

由于这是运行时致命问题，我可以：
1. **立即执行上述 P0 修复** (约 5 分钟)
2. **生成测试验证脚本**
3. 或您按上述说明手动修改后，我帮您**验证重启命令**

请告诉我您的选择。
