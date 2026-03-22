# Fix-08: 深度交互、递归属性与接口修复方案

## 1. 现状问题分析
1.  **接口丢失**：模型中的 `interface_params` 或 `interface_group` 字段由于路径映射不严谨，导致前端 `interfaces` 数组始终为空。
2.  **嵌套属性不可见**：对于电机、驱动器等复杂模块，许多关键参数（如分辨率、线数）是作为 `COMBOX` 选项的附加属性（`array_cmob_ele`）存在的。目前的 UI 只能渲染第一层。
3.  **信息密度不足**：用户无法直观看到模块在模型中的原始 ID (`module_name`)。

## 2. 修复方案设计

### 2.1 递归属性渲染 (Recursive Property Rendering)
- 修改 `ComponentPropertyPanel.tsx`。
- 当渲染 `DATA_COMBOX` 类型时，根据当前选中的 `value` (key)，去 `comboType.typeGroups` 中寻找匹配的组。
- 如果该组下有 `arrayCmobEle`，则**递归调用**渲染函数，将其展示在缩进面板中。

### 2.2 接口解析路径增强
- 在 `ImportService.mapToComponent` 中，增加对以下路径的兼容：
  - `comp.interface_params.interface_group`
  - `comp.interface_param.interface_group`
  - `comp.interface_params.interface_params_array`

### 2.3 UI 增强
- **列表项**：将 `ComponentLibraryStep` 中的显示改为 `alias (module_name)`。
- **详情头**：在属性面板顶部显著位置展示“模型原名”。

## 3. 核心修复伪代码 (递归渲染逻辑)
```tsx
const renderAttribute = (attr) => {
  // ... 渲染基础 Input ...
  if (attr.type === 'DATA_COMBOX' && attr.comboType) {
    const selectedGroup = attr.comboType.typeGroups.find(g => g.key === attr.value);
    if (selectedGroup?.arrayCmobEle) {
      return (
        <div className="nested-attr">
          {selectedGroup.arrayCmobEle.map(sub => renderAttribute(sub))}
        </div>
      );
    }
  }
}
```

## 4. 验证计划
1. **接口验证**：进入“接口连线”步骤，应能看到 DI/DO/CAN 等接口列表。
2. **递归验证**：选择电机，切换编码器类型，观察下方是否动态出现了“分辨率/线数”输入框。
3. **名称验证**：左侧列表应显示如 “差速轮 (diffWheel_lft)” 这样的格式。
