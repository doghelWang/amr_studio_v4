# 前端修复总结

## 需要重启的服务

### 1. 前端服务 (Vite Dev Server)
```bash
cd /Users/wangfeifei/code/amr_studio_v4/src/frontend
# 先停止现有服务 (Ctrl+C) 或查找并杀死进程
pkill -f "vite"

# 重新启动
npm install  # 如果有新依赖
npm run dev
```

### 2. 后端服务
```bash
cd /Users/wangfeifei/code/amr_studio_v4/src/backend
pkill -f "python.*main.py"
python main.py
```

## 四个问题的修复状态

| 问题 | 修复文件 | 状态 |
|-----|---------|------|
| BUG-001: 底盘形状解析 | ImportService.ts | ✅ Props接口已更新，需重启 |
| BUG-002: 加速度信息缺失 | ImportService.ts | ⚠️  待完成实际提取逻辑 |
| BUG-003: 编码器错误关联 | ImportService.ts + PowerSystemStep.tsx | ⚠️  待修改pairs和过滤器 |
| BUG-004: 属性不显示 | ComponentPropertyPanel.tsx | ⚠️  Props解构修改不完全 |

## 关键发现：ComponentPropertyPanel API不匹配

PowerSystemStep 传递的 props:
```typescript
<ComponentPropertyPanel
  component={activeComp}        // ✅ 存在
  onAttributeChange={...}         // ✅ 存在
  onInterfaceChange={...}       // ✅ 存在
  onInterfaceParamChange={...}  // ✅ 存在
  onStructuralChange={...}      // ✅ 存在
/>
```

但 ComponentPropertyPanel 的 props 定义已修改为:
```typescript
interface Props {
  component?: any;                  // 新
  onAttributeChange?: ...;         // 新 - 签名不同！
  // ...其他新props
  projectId?: string;              // 旧 - 现在可选
  selectedUuid?: string;           // 旧 - 现在可选
}
```

问题是：
1. 新定义的 `onAttributeChange` 签名是 `(groupId, attrKey, val, subKey)` 
2. 但组件内部仍然使用 `(sourceId, groupKey, attrKey, value, subKey)` 调用
3. 而且解构参数没有从 `directComponent` 读取！

## 需要完成的实际修复

修复1: ComponentPropertyPanel.tsx 第45-54行
```typescript
// 当前：
export const ComponentPropertyPanel: React.FC<Props> = ({
  projectId, selectedUuid, ... // 直接解构但没有处理直接传递模式
}) => {

// 应改为：
export const ComponentPropertyPanel: React.FC<Props> = (props) => {
  const {
    component: directComponent,
    projectId,
    selectedUuid,
    onAttributeChange: directOnAttributeChange,
    ...otherProps
  } = props;
  
  // 获取当前组件：直接传入优先
  const selectedStoreComponent = directComponent || config.components.find(c => c.id === selectedUuid);
```

修复2: ImportService.ts 第239-243行添加 CYLINDER支持
修复3: ImportService.ts 第66-68行添加加速度提取
修复4: ImportService.ts 第94-100行添加 encoder 关联 keys
