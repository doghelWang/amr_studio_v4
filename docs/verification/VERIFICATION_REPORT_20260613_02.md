# 验证报告：前端电气连接 P1 编辑闭环

日期：2026-06-13

## 1. 本轮目标

在 P0 “连接实体只读可见”的基础上，推进 P1 的最小编辑闭环：

- 通过连接清单创建电气连接。
- 创建前执行接口兼容性校验。
- 创建后写入 `linkedInterfaceUuid`。
- 删除连接时清理相关接口引用。
- 导出前显式调用 `materializeConnectionsToInterfaces()`。

## 2. 本轮改动

### 2.1 电气领域层

文件：

- `src/frontend/src/store/domain/electrical.ts`

新增能力：

- `validateInterfaceConnection()`：校验源/目标接口兼容性。
- `findInterfaceRef()`：按接口 UUID 查询接口所属组件。
- `getCompatibleInterfaceTargets()`：返回指定源接口的兼容目标接口。

### 2.2 Store 编辑动作

文件：

- `src/frontend/src/store/useProjectStore.ts`

新增动作：

- `createConnection(sourceComponentId, sourceIfaceUuid, targetComponentId, targetIfaceUuid)`
- `removeConnection(sourceIfaceUuid, targetIfaceUuid)`
- `materializeConnectionsToInterfaces()`

保留兼容：

- `linkInterface()` 仍存在，但内部转为调用新连接动作。

新增校验：

- 接口不存在时阻断。
- 接口类型不兼容时阻断。
- 点对点接口已被占用时阻断。

### 2.3 UI 编辑入口

文件：

- `src/frontend/src/components/wizard/WiringStep.tsx`

新增能力：

- 连接清单顶部增加“源接口 / 兼容目标接口 / 创建连接”控制区。
- 目标接口下拉只展示兼容接口。
- 点对点已占用接口不会出现在目标候选中。
- 连接表格增加“删除”操作。

### 2.4 导出前物化

文件：

- `src/frontend/src/App.tsx`

调整：

- 导出流程中使用 `exportConfig = { ...config, components: materializeConnectionsToInterfaces() }`。
- 后续 sandbox 初始化、abilities 同步、底盘同步、组件位姿同步均使用 `exportConfig`。

## 3. 验证命令

后端单元回归：

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

前端构建：

```bash
cd src/frontend
npm run build
```

运行服务检查：

```bash
curl -sS http://127.0.0.1:8002/api/v1/system/version
curl -sS http://127.0.0.1:3001/src/components/wizard/WiringStep.tsx
```

## 4. 验证结果

后端：

- 用例数：53
- 结果：OK

前端：

- TypeScript 编译：通过
- Vite 构建：通过
- 仍存在既有 chunk size warning，不影响本轮功能。

运行服务：

- 后端 `GET /api/v1/system/version`：正常返回。
- 前端 dev server 可访问 `WiringStep.tsx` 热更新源码。
- 源码中可检索到：
  - `选择源接口`
  - `选择兼容目标接口`
  - `创建连接`
  - `删除`

## 5. 当前结论

P1 最小编辑闭环已完成：

- 连接清单不再只是只读视图，已成为可创建/删除连接的入口。
- 创建连接会经由领域校验和 store 校验。
- 点对点接口重复占用会被阻断。
- 删除连接会清理相关接口引用。
- 导出前已有连接物化调用点。

## 6. 已知边界

- 当前连接实体仍以 `linkedInterfaceUuid` 为底层存储，尚未独立持久化 `ElectricalConnection[]`。
- 总线多节点的高级编辑体验仍未展开，当前允许 `CAN`、`RS485` 这类 `bus_multi_drop` 接口多连接。
- 连接参数编辑尚未实现。
- 浏览器插件本轮不可用，未做 GUI 点击级验证；已通过构建、服务、源码热更新检查完成运行验证。

## 7. 下一步建议

建议继续 P1 后半段：

1. 增加连接参数编辑面板。
2. 为连接创建/删除补前端单元测试。
3. 将总线类连接从点对点表格升级为 bus group 视图。
4. 引入模块库注册表校验接口协议、波特率、SWTAGS/BUSTAGS 等参数。
