# Fix-02: 前端 Snake Case 适配与 AbilityStep 实现设计方案

## 1. 现状问题分析
1.  **协议变更**：后端已统一为 Snake Case。前端原有的 `ImportService.ts` 及其类型模型需要确保能够正确解析 `module_uuid` 等下划线字段。
2.  **功能缺失**：`AbilityStep.tsx` 目前仅为占位符。用户无法配置机器人的导航、安全等逻辑能力。
3.  **数据同步**：由于后端已支持 `GET/PATCH /abilities`，前端需要新增对应的 API 调用逻辑。

## 2. 修复与开发方案设计

### 2.1 ImportService 适配
- **策略**：在 `ImportService` 中增加一个转换层（Mapping Layer），或者直接修改 `ImportService` 使其消费 Snake Case 字段。由于 `src/store/types.ts` 中定义的 `SmartAttribute` 键名通常与业务逻辑挂钩，我们将确保 `ImportService` 在读取 JSON 时指向正确的下划线键名。

### 2.2 AbilityStep 核心 UI 实现
- **组件结构**：
  - `AbilityStep`: 主容器，负责从 Store 获取 `config.abilities`。
  - `AbilityFunctionGroup`: 渲染能力组（如 `navi`, `safety`）。
  - `AbilityAttributeItem`: 渲染具体能力属性，复用 `SmartForm` 的原子组件逻辑。
- **状态同步**：调用 `useProjectStore` 中的 `updateAbilityAttribute` 进行本地状态更新。

### 2.3 API 增强 (api_v2.ts)
- 增加 `fetchAbilities(projectId)`
- 增加 `patchAbilities(projectId, delta)`

## 3. 核心开发伪代码

### Frontend `ImportService.ts` (片段)
```typescript
// 适配 Snake Case
const moduleUuid = comp.general_attr.module_uuid.string_value;
const moduleName = comp.general_attr.module_name.string_value;
// ... 确保所有对后端 JSON 的访问都符合 snake_case ...
```

### Frontend `AbilityStep.tsx` (伪代码)
```tsx
const AbilityStep = () => {
  const { abilities, updateAbilityAttribute } = useProjectStore();
  
  return (
    <div className="ability-container">
      {abilities.functionAbility.map(func => (
        <Card title={func.desc} key={func.type}>
          {func.childFunction.map(child => (
            <div key={child.key}>
              <h4>{child.desc}</h4>
              <SmartForm elements={child.attr} onChange={...} />
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
};
```

## 4. 验证计划 (Test Cases)
1.  **加载校验**：上传 `.cmodel` 后，前端能够正确渲染出组件列表（证明 Snake Case 解析成功）。
2.  **能力编辑校验**：在 AbilityStep 修改某个布尔值，检查本地 Store 状态。
3.  **往返校验**：点击“导出”，检查生成的下载请求 Payload 是否依然保持 Snake Case 且包含修改后的能力项。
