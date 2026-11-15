# ImportService 模型解析经验文档

## 文档信息
- **版本**: v1.0
- **日期**: 2026-04-05
- **主题**: Model Desc 文件解析经验、问题根因与解决方案、编码反向经验

---

## 一、解析流程总览

```
┌───────────────────────────────────────────────────────────────────┐
│                    ImportService.parseCompDesc                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Step 1: 递归处理分组 → processModuleGroup()                        │
│    └─› 遍历 moreModuleInfo/module_componets                        │
│    └─› 递归处理子分组 (parent-child hierarchy)                      │
│                                                                    │
│  Step 2: 组件映射 → mapToComponent()                               │
│    └─› CATEGORY_MAP 类型标准化 ('driveWheel' → 'DRIVEWHEEL')      │
│    └─› 提取 structParam.extendParams (mountX/Y/Z/roll/pitch/yaw)   │
│    └─› 提取 interfaceParams (wiring connections)                  │
│    └─› 构建 ComponentConfig 对象                                   │
│                                                                    │
│  Step 3: 建立索引 (P0-1 FIX)                                        │
│    ┌─› moduleNameToId: Map<string, string>                         │
│    │      KEY: generalAttr.moduleName (English like "FL_WalkMotor")│
│    │      VALUE: component.id (UUID)                                │
│    │                                                               │
│    └─› ifaceToComp: Map<string, string>                            │
│           KEY: interfaceUuid                                        │
│           VALUE: component.id (owner of this interface)             │
│                                                                    │
│  Step 4: 拓扑解析引擎 (P0-2/3 FIX)                                  │
│    └─› wheels.forEach(w => {                                       │
│          1. 确定位置键 (posKey: left_group/right_group/etc)         │
│          2. 关系属性查找: relateLeftMotor/relateRightMotor/etc      │
│          3. wiring 接口匹配: 找到连接的 Driver                     │
│          4. 设置 parentNodeUuid 构建父子链                          │
│       })                                                           │
│                                                                    │
│  Step 5: 底盘属性提取                                               │
│    └─› deepFindAttributeValue() 递归搜索 privateAttrs             │
│    └─› 提取: headOffset, leftOffset, maxSpeed, selfWeight, etc     │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

---

## 二、关键经验：索引键的选择 (P0-1)

### 问题根因
使用 `srcName` (中文别名如 "电机") 作为 Map key 时，8个电机的别名都是 "电机"，导致索引冲突，后覆盖前。

### 解决方案
使用 `moduleName` (英文唯一标识如 "FL_WalkMotor") 作为索引键。

```typescript
// ❌ WRONG: 使用 srcName (中文别名，可能重复)
const srcNameToId = new Map<string, string>();
components.forEach(c => {
  if (c.srcName) srcNameToId.set(c.srcName, c.id);  // 冲突!
});

// ✅ CORRECT: 使用 moduleName (English ID, unique)
const moduleNameToId = new Map<string, string>();
components.forEach(c => {
  const moduleName = c.generalAttr?.moduleName?.stringValue ||
                     c.generalAttr?.module_name?.string_value;
  if (moduleName) moduleNameToId.set(moduleName, c.id);  // 唯一
});
```

### 编码反向经验
当编码回 model 文件时，必须确保 `module_name` 字段是全局唯一的英文字符串，格式建议：
- `{Position}_{Role}{Type}` 如 "FL_WalkMotor", "RR_SteerMotor"
- 不能使用中文字符作为 module_name

---

## 三、拓扑关系解析经验 (P0-2/P0-3)

### 3.1 轮组-电机-驱动器-编码器关系链

Controller Model Desc 中的拓扑通过两种机制表达：

**机制 A: 关系属性 (Semantic Link)**
```protobuf
// 在 wheel.privateAttrs 中
key: "relateLeftMotor"
value: "FL_WalkMotor"  // 指向 target component 的 moduleName
```

**机制 B: Wiring 接口连接 (Physical Link)**
```protobuf
// Motor.interfaces[] 中的 interface
interfaceUuid: "motor-can-uuid"
linkedInterfaceUuid: ["driver-can-uuid"]  // 连接目标接口
```

### 3.2 解析算法

```typescript
wheels.forEach((w) => {
  const posKey = determinePosKey(w);  // 根据 mountX/Y 计算位置
  slots[`wheel_${posKey}`] = w.id;

  // 关系属性映射表
  const pairs = [
    { key: 'relateLeftMotor', role: 'walk_left' },    // 左行走电机
    { key: 'relateRightMotor', role: 'walk_right' },  // 右行走电机
    { key: 'relateWalkMotor', role: 'walk' },         // 单行走电机
    { key: 'relateRotMotor', role: 'steer' },         // 转向电机
    { key: 'relatedEncode', role: 'encoder' }        // 编码器
  ];

  pairs.forEach(p => {
    // Step 1: 通过关系属性找到 target moduleName
    const targetSrcName = deepFindAttributeValue(w.privateAttrs, p.key);
    if (!targetSrcName) return;

    // Step 2: moduleName → component ID
    const targetId = moduleNameToId.get(targetSrcName);
    const targetComp = components.find(c => c.id === targetId);

    if (targetComp) {
      // Step 3: 编码器直接挂载到 wheel
      if (p.role === 'encoder') {
        targetComp.parentNodeUuid = w.id;
        slots[`encoder_${posKey}`] = targetComp.id;
      }
      // Step 4: 电机需要通过 wiring 找到驱动器
      else {
        let driver: ComponentConfig | undefined;
        for (const iface of targetComp.interfaces) {
          for (const lUuid of (iface.linkedInterfaceUuid || [])) {
            const dId = ifaceToComp.get(lUuid);
            const dComp = components.find(c => c.id === dId);
            if (dComp && dComp.category === 'DRIVER') {
              driver = dComp; break;
            }
          }
        }

        if (driver) {
          // 设置连接关系 slots
          const dSlot = p.role.includes('steer')
            ? `steerDriver_${posKey}`
            : `driver_${posKey}`;
          const mSlot = p.role.includes('steer')
            ? `steerMotor_${posKey}`
            : `motor_${posKey}`;

          slots[dSlot] = driver.id;
          slots[mSlot] = targetComp.id;

          // 父子链: wheel ← driver ← motor
          driver.parentNodeUuid = w.id;
          targetComp.parentNodeUuid = driver.id;
        }
      }
    }
  });
});
```

### 3.3 编码反向经验

编码时必须正确设置关系属性：

```typescript
// Wheel's privateAttrs must contain:
{
  key: "relateLeftMotor",
  value: "FL_WalkMotor",  // 必须匹配 Motor.generalAttr.moduleName
  type: "DATA_STRING"
}
```

**关键注意**: `relateLeftMotor` 等属性字体大小写必须完全匹配后端解析预期。

---

## 四、DRIVEWHEEL 类型自动选择 (P0-2)

### 问题根因
解析时 wheel 默认得到类型 `diffWheel` (只有 2 个属性)，但 STEER 轮组需要更多控制参数。

### 解决方案
根据 driveType 自动推断正确的 wheel subtype：

```typescript
// In ComponentLibraryStep.tsx / Template application logic
const getWheelTypeForDriveType = (driveType: DriveType): string => {
  switch (driveType) {
    case 'STANDARD_DIFF': return 'diffWheel';  // 2 attrs
    case 'DUAL_STEER': return 'horizontalSteerWheel';  // 7 attrs, 带角度控制
    case 'QUAD_STEER': return 'horizontalSteerWheel';
    case 'SINGLE_STEER': return 'horizontalSteerWheel';
    default: return 'diffWheel';
  }
};
```

### 解码经验
解析文件时，通过统计 steer 类型的 wheel 数量可以反向推断 driveType：

```typescript
const steerWheels = wheels.filter(w => w.type.toLowerCase().includes('steer'));
if (steerWheels.length === 1) identity.driveType = 'SINGLE_STEER';
else if (steerWheels.length === 2) identity.driveType = 'DUAL_STEER';
else if (steerWheels.length >= 4) identity.driveType = 'QUAD_STEER';
else if (wheels.length >= 2) identity.driveType = 'STANDARD_DIFF';
```

---

## 五、MOTOR 类型强制 (P0-3)

### 问题根因
电机在解析时得到了错误的类型 'driver' (只有 3 个属性)，导致缺少关键参数。

### 解决方案
编码/应用模板时必须强制设置 motor type：

```typescript
// In useProjectStore.ts addComponent
if (component.category === 'MOTOR') {
  // 强制覆盖为 PMSMMotor (14 属性) 避免错误继承
  componentToAdd.type = 'PMSMMotor';
}
```

### 关键经验
不同 motor type 的属性数量差异：
| Type | Attributes | 适用场景 |
|------|-----------|----------|
| driver | 3 | 驱动器 (注意: 不是电机!) |
| PMSMMotor | 14 | 永磁同步电机 (默认) |
| BLDCMotor | 10 | 无刷直流电机 |

**检查方法**: 属性的 `generalAttr.subModuleType.typeDesc` 应包含 "Motor" 字样。

---

## 六、COMBOX 递归查找经验

### 场景
某些属性嵌套在 COMBOX 类型的组内，需要递归搜索。

### 正确算法
仅搜索被选中的 typeGroup：

```typescript
private static deepFindAttributeValue(attrs: AttributeGroup[], key: string): any {
  const search = (eles: SmartAttribute[]): any => {
    for (const e of eles) {
      if (e.key === key) return e.value;

      // COMBOX: 只搜索被选中的 group
      if (e.comboType?.typeGroups) {
        const selectedKey = e.comboType.typeKey;  // 当前选中的选项
        const selectedGroup = e.comboType.typeGroups.find(g => g.key === selectedKey);
        if (selectedGroup) {
          const res = search(selectedGroup.arrayCmobEle || []);
          if (res !== undefined) return res;
        }
      }
    }
  };

  for (const g of attrs) {
    const res = search(g.elements);
    if (res !== undefined) return res;
  }
}
```

### 反向编码注意
编码 COMBOX 时必须同时设置：
1. `comboType.typeKey` - 选中哪个选项
2. `comboType.typeGroups[].arrayCmobEle` - 该选项下的子属性值

---

## 七、CATEGORY_MAP 标准化

### 类型 Key 映射表

| Model Desc Key | MainModuleType | 备注 |
|----------------|----------------|------|
| chassis | CHASSIS | 底盘 |
| driveWheel / diffSteerWheel / steerWheel | DRIVEWHEEL | 驱动轮 (统一) |
| motor | MOTOR | 电机 |
| driver | DRIVER | 驱动器 |
| sensor | SENSOR | 传感器 |
| mainCPU | MAINCPU | 主控 |
| extendedInterface / extendedlnterface | IO_BOARD | 扩展接口 (注意拼写) |
| battery | BATTERY | 电池 |
| button | BUTTON | 按钮 |
| light | LIGHT | 灯光 |
| actor | ACTOR | 执行器 |

### 编码反向经验
编码时必须使用 lowercase with camelCase/snake_case 的键名，兼容两种命名风格：

```typescript
const rawMainType = gen.mainModuleType?.comboType?.typeKey ||
                    gen.main_module_type?.combo_type?.type_key || 'unknown';
```

---

## 八、完整 ComponentConfig 构建清单

编码回 Model Desc 时必须填充的字段：

```typescript
interface ComponentConfig {
  // 身份标识 (必须)
  id: string;                      // UUID v4
  name: string;                    // moduleName (English)
  alias: string;                   // moduleDesc (中文描述)
  srcName?: string;                // 可选别名

  // 类型分类 (必须)
  category: MainModuleType;        // DRIVEWHEEL/MOTOR/DRIVER/etc
  type: string;                    // subtype key
  mainModuleTypeKey?: string;      // 'driveWheel'
  subModuleTypeKey?: string;       // 'diffWheel'|'horizontalSteerWheel'

  // 层级关系 (拓扑用)
  parentNodeUuid: string | null;   // 父组件 ID
  moduleGroupName?: string;        // 分组名
  moduleGroupUuid?: string;        // 分组 UUID

  // 安装位置 (必须)
  mountX: number;                  // mm
  mountY: number;
  mountZ: number;
  mountRoll: number;               // degrees
  mountPitch: number;
  mountYaw: number;

  // 属性 (必须)
  privateAttrs: AttributeGroup[];  // 组件私有参数
  generalAttr?: any;                // 原始通用属性 (保留)

  // 接口 (拓扑用)
  interfaces: InterfaceConfig[];   // CAN/ETH/RS485 连接

  // 形状 (可选)
  shape?: { type: 'BOX'|'CYLINDER', length, width, height };

  // 功能标记 (前端用)
  functionalRole?: 'walk'|'steer'|'walk_left'|'walk_right'|'encoder';
}
```

---

## 九、编码 Model Desc 检查清单

```
□ 所有 component.id 是有效的 UUID v4
□ moduleName (name 字段) 全局唯一，使用英文，不含中文
□ moduleDesc (alias 字段) 是中文可读描述
□ mountX/Y/Z/roll/pitch/yaw 数值正确 (单位 mm/degree)
□ category 通过 CATEGORY_MAP 标准化
□ type 是有效的 subtype key (如 'PMSMMotor' 不是 'driver')
□ parentNodeUuid 正确形成父子链
□ 轮组的 relateLeftMotor/relateRightMotor 指向正确的 motor moduleName
□ wiring: interfaceUuid 和 linkedInterfaceUuid 双向连接
□ COMBOX 属性的 typeKey 和子属性都正确设置
□ 底盘的 module_shape 正确 (BOX/CYLINDER)
□ 底盘的 headOffset/leftOffset/maxSpeed/selfWeight 在 privateAttrs 中
```

---

## 十、调试技巧

### 10.1 索引构建调试
```typescript
console.group('%c ⚡ [ImportService] Index Building');
components.forEach(c => {
  const moduleName = c.generalAttr?.moduleName?.stringValue;
  console.log(`  ${c.alias} ${c.category} → moduleName: ${moduleName}`);
});
console.groupEnd();
```

### 10.2 拓扑匹配调试
```typescript
console.group(`[Trace] Wheel: ${w.alias} (${posKey})`);
console.log(`- Looking for ${p.key} = ${targetSrcName}`);
console.log(`- Found: ${targetComp ? targetComp.alias : 'MISSING'}`);
console.log(`- Driver via wiring: ${driver ? driver.srcName : 'MISSING'}`);
console.groupEnd();
```

### 10.3 属性查找调试
```typescript
const val = deepFindAttributeValue(chassis.privateAttrs, 'headOffset(Idle)');
console.log('headOffset:', val, 'type:', typeof val);
```

---

## 附录: 相关文件

| 文件 | 作用 |
|------|------|
| `src/store/ImportService.ts` | 解析核心逻辑 |
| `src/store/types.ts` | ComponentConfig 类型定义 |
| `src/store/useProjectStore.ts` | P0-2/3 FIX 位置 |
| `protos/controller_model_comp_desc.proto` | Model Desc Schema |

---

**文档完成**

_Last Updated: 2026-04-05_
