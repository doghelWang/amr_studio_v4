# Fix-04: 全量无损深度数据映射设计方案

## 1. 现状问题分析
1.  **字段失配**：后端 `json_format` 返回的 JSON 包含 `double_maxvalue`, `type_groups`, `array_cmob_ele` 等字段。
2.  **UI 渲染失效**：前端组件（如 `AbilityStep.tsx`）访问的是 `attr.maxValue` 或 `group.arrayCmobEle`。由于大小写不匹配，UI 无法渲染出具体的参数值和下拉选项。
3.  **数据类型不统一**：部分 `INT64` 字段在 JSON 中是字符串，前端需要确保正确转换。

## 2. 修复方案设计

### 2.1 强化 ImportService (深度递归映射)
- **方案**：在 `mapAttribute` 方法中，显式地将每一个 Proto 字段映射到 Store 对应的驼峰属性。
- **映射表**：
  - `double_maxvalue` / `int32_maxvalue` -> `maxValue`
  - `combo_type` -> `comboType`
  - `type_groups` -> `typeGroups`
  - `array_cmob_ele` -> `arrayCmobEle`
  - `array_base_ele` -> `elements`
  - `string_value` / `double_value` -> `value` (基于 type 提取)

### 2.2 强化 Ability 映射
- 后端返回的 `abilities` (AbiSet.json) 同样是全量 Snake Case。
- 需要实现 `mapAbilityToStore` 函数，递归处理 `function_ability` -> `child_function` -> `attr` 的深度转换。

### 2.3 保持 ExportService 的逆向能力
- 确保导出时，所有驼峰字段能被重新转换为下划线字段，满足后端 `ParseDict` 的严格要求。

## 3. 核心修复伪代码

### 属性映射器
```typescript
static mapAttribute(raw: any): SmartAttribute {
  return {
    key: raw.key,
    desc: raw.desc || raw.key,
    type: raw.type,
    value: this.extractValue(raw),
    maxValue: raw.double_maxvalue ?? raw.int32_maxvalue ?? raw.float_maxvalue,
    // ... 其他元数据 ...
    comboType: raw.combo_type ? {
      typeKey: raw.combo_type.type_key,
      typeGroups: raw.combo_type.type_groups?.map(g => ({
        key: g.key,
        desc: g.desc,
        arrayCmobEle: g.array_cmob_ele?.map(e => this.mapAttribute(e))
      }))
    } : undefined
  };
}
```

## 4. 验证计划 (Test Cases)
1.  **数值渲染校验**：导入后，检查底盘参数（如轮距）是否显示为模型中的真实数值（如 738.0）而非 0。
2.  **下拉框校验**：检查 `activeLevel` 等下拉框是否能正确列出“高电平生效/低电平生效”选项。
3.  **能力集深度校验**：进入 AbilityStep，检查“导航能力”下的子项是否能看到正确的关联组件 ID。
