# Fix-03: 前后端数据同步与导出无损性验证设计方案

## 1. 现状问题分析
1.  **数据组装复杂性**：前端 Zustand Store 存储的是打散后的组件列表，而导出时需要重建嵌套的 `more_module_info` 树结构。
2.  **默认值缺失**：Protobuf `ParseDict` 默认对缺失字段敏感。如果前端导出时漏掉了某些必填的 Proto 字段（即使是空的），后端可能报错。
3.  **能力集同步**：当前前端尚未实现自动将 Ability 修改同步到服务器的逻辑。

## 2. 修复方案设计

### 2.1 强化 ExportService
- **方案**：重建树算法（Tree Reconstruction Algorithm）。遍历 `components` 列表，根据 `parentNodeUuid` 和 `moduleGroupName` 重新构建层级。
- **保留元数据**：确保 `general_attr` 和 `interface_ability` 等原始字段在往返过程中不被丢失。

### 2.2 自动同步机制
- **Hook 实现**：在 `App.tsx` 或 `useProjectStore` 中增加一个 `useEffect`，当 `isDirty` 为 true 时（或在用户切换步骤时），异步触发 `apiUpdateAbilities` 和组件 PATCH 请求。

### 2.3 后端 Compile 强化
- **异常捕获**：在后端 `compile_cmodel_api` 中增加对 `google.protobuf.json_format.ParseError` 的精确捕获，将错误的 `node_path` 返回给前端。

## 3. 核心修复伪代码

### Frontend `ExportService.ts`
```typescript
static assembleCompDesc(config: RobotConfig): any {
  // 1. 创建根对象
  const root = { more_module_info: [], robot_name: config.identity.robotName ... };
  // 2. 将扁平 components 映射回 tree
  // ... 递归组装 logic ...
  return root;
}
```

## 4. 验证计划 (Test Cases)
1.  **端到端闭环测试**：
    - 上传 `ModelSet39.cmodel` -> 前端修改轮距 `0.45` 为 `0.55` -> 点击导出 -> 下载新 cmodel -> 再次上传新 cmodel -> 验证轮距是否为 `0.55` 且其他字段无损。
2.  **错误拦截校验**：
    - 在前端输入超出 `maxValue` 的数值，点击导出，检查后端是否返回 400 校验错误。
