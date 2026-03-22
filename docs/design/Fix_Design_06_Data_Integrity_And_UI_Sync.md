# Fix-06: 导入数据完整性与 UI 同步修复方案

## 1. 现状问题分析
1.  **底盘尺寸静态化**：导入后，`identity` 保持默认值，未从 ID 为 `CHASSIS` 的组件中同步 `shape` 数据。
2.  **组件基本信息缺失**：UI 列表未渲染 `name` 和 `alias`，可能是因为 `ImportService` 的 `mapToComponent` 未正确提取。
3.  **私有属性空洞**：虽然日志显示提取了 `privateAttrs`，但 UI 面板为空，说明 `SmartForm` 在渲染时对 `boolHide` 或 `type` 的判断逻辑与数据不匹配。
4.  **布线数据断裂**：`interface_params` 路径解析错误，导致 `interfaces` 数组为空。

## 2. 修复方案设计

### 2.1 Identity 自动同步
- 在 `parseCompDesc` 循环完成后，寻找 `category === 'CHASSIS'` 的组件。
- 如果找到，将该组件的 `shape`（length, width, height）同步到 `identity` 对象中。

### 2.2 修正接口解析路径
- 后端结构：`comp.interface_params.interface_group` (Array)
- 属性映射：确保 `interface_uuid` 和 `linked_interface_uuid` 能够正确提取。

### 2.3 修正私有属性渲染
- 确保 `SmartAttribute` 中的 `value` 提取逻辑覆盖所有数据类型。
- 强制设置 `boolBasic: true` 给所有提取到的私有属性，确保它们在“基础视图”中可见。

## 3. 核心修复伪代码

### 接口解析 (ImportService)
```typescript
const rawIface = comp.interface_params;
const ifaceList = rawIface?.interface_group || rawIface?.interface_params_array || [];
// 适配多层嵌套路径
```

### 底盘尺寸同步 (ImportService)
```typescript
const chassis = components.find(c => c.category === 'CHASSIS');
if (chassis && chassis.shape) {
    identity.chassisLength = chassis.shape.length;
    identity.chassisWidth = chassis.shape.width;
}
```

## 4. 验证计划
1. **底盘验证**：导入后，Step 1 的长宽应自动变为 1476x1063。
2. **组件名验证**：左侧列表应显示“差速底盘”、“激光”、“陀螺仪”等名称。
3. **属性验证**：点击组件，右侧面板应列出“轮半径”、“安装坐标”等私有属性。
