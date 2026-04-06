# AMR Studio V4 - 交互设计规范与设计变更记录

## 文档信息
- **版本**: v2.0
- **日期**: 2025-04-05
- **范围**: Step 3-4 交互优化、主题系统、可视化器重设计

---

## 第一部分: 交互设计规范 (Interaction Design Specification)

### 1.1 核心设计原则

| 原则 | 描述 | 应用实例 |
|-----|------|---------|
| **一致性** | 相同模式保持相同交互行为 | 所有列表项使用相同的选中样式 |
| **清晰性** | 功能一目了然，减少认知负担 | 组件分类使用颜色编码 |
| **反馈性** | 操作即时得到视觉反馈 | Hover/Active状态0.2s过渡 |
| **效率性** | 高频操作路径最短化 | 快速动作按钮(置底/归平/居中) |

### 1.2 布局规范

#### 弹性布局 (Elastic Layout)
```typescript
// 禁止: 使用固定像素宽度
<div style={{ width: '700px' }}>  // ❌

// 推荐: 使用 flex 比例
<div style={{ flex: 1.5 }}>       // 可视化区
<div style={{ flex: 1 }}>         // 编辑面板
```

#### 响应式断点
| 断点 | 宽度范围 | 布局调整 |
|-----|---------|---------|
| Desktop | ≥1200px | 水平布局，visualizer:editor = 1.5:1 |
| Tablet | 768-1199px | 垂直堆叠，editor水平分割 |
| Mobile | <768px | 全宽单列，compact模式 |

### 1.3 组件交互规范

#### 列表-详情模式 (List-Detail Pattern)

**列表项规范:**
```typescript
const LIST_ITEM_SPEC = {
  height: '48px',
  padding: '10px 16px',
  borderLeft: {
    default: '3px solid transparent',
    active: '3px solid var(--accent)',
  },
  background: {
    default: 'transparent',
    hover: 'var(--bg-hover)',
    active: 'var(--accent-soft)',
  },
  transition: 'all 0.2s ease',
  
  // 选中指示器
  activeIndicator: {
    type: 'left-border',
    glow: true,
  },
};
```

**分组标题规范:**
```typescript
const GROUP_HEADER_SPEC = {
  height: '32px',
  typography: {
    size: '11px',
    weight: '500',
    transform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-muted)',
  },
};
```

#### 分组输入规范 (Grouped Input)

**6轴坐标输入:**
```typescript
const AXIS_INPUT_SPEC = {
  layout: '3-column grid',
  gap: '12px',
  
  axisLabel: {
    X: { color: 'var(--red)',    label: 'X', unit: 'mm' },
    Y: { color: 'var(--green)',  label: 'Y', unit: 'mm' },
    Z: { color: 'var(--accent)',  label: 'Z', unit: 'mm' },
    Roll:  { color: 'var(--orange)', label: 'Roll',  unit: '°' },
    Pitch: { color: 'var(--purple)', label: 'Pitch', unit: '°' },
    Yaw:   { color: 'var(--accent-text)', label: 'Yaw', unit: '°' },
  },
  
  inputStyle: {
    border: 'none',
    background: 'var(--bg-hover)',
    textAlign: 'right',
    focusBorder: 'var(--accent)',
  },
};
```

**快速动作按钮:**
```typescript
const QUICK_ACTIONS = [
  { id: 'resetZ',   label: '置底', action: 'mountZ = 0' },
  { id: 'resetRot', label: '归平', action: 'Roll=Pitch=Yaw=0' },
  { id: 'resetPos', label: '居中', action: 'X=Y=Z=0' },
];
```

### 1.4 视觉交互规范

#### 状态过渡
```css
/* 所有交互元素必须有0.2s过渡 */
.interactive-element {
  transition: all 0.2s ease;
}

.interactive-element:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-soft);
}
```

#### 分类颜色系统
```typescript
const CATEGORY_COLORS = {
  SENSOR:     'var(--red)',      // 传感器 - 红色系
  DRIVEWHEEL: 'var(--accent-text)', // 驱动轮 - 青色
  MOTOR:      'var(--green)',    // 电机 - 绿色
  DRIVER:     'var(--orange)',   // 驱动器 - 橙色
  MAINCPU:    'var(--accent)',   // 主控 - 蓝色
  BATTERY:    'var(--purple)',   // 电池 - 紫色
  BUTTON:     'var(--yellow)',   // 按钮 - 黄色系
};
```

---

## 第二部分: 设计变更记录 (Design Change Log)

### 变更 1: Step 3 全域硬件层级关系过滤

**变更编号**: CHG-2025-0405-001
**日期**: 2025-04-05
**状态**: 已完成

#### 变更描述
优化"全域硬件层级关系"树的展示逻辑，避免与"已添加组件"列表重复。

#### 变更内容
```typescript
// BEFORE: 显示所有组件的层级关系
const treeData = useMemo(() => { ... }, [components]);

// AFTER: 过滤后显示
const filteredTreeData = useMemo(() => {
  const hiddenIds = new Set<string>();
  
  // Rule 1: 隐藏当前步骤已添加的组件
  filteredComponents.forEach(c => hiddenIds.add(c.id));
  
  // Rule 2: 隐藏底盘及其子组件(轮组/驱动器/电机)
  const chassisRoot = components.find(c => c.category === 'CHASSIS');
  if (chassisRoot) {
    hiddenIds.add(chassisRoot.id);
    collectChildren(chassisRoot.id, hiddenIds); // 递归收集
  }
  
  // 构建过滤后的树...
}, [components, filteredComponents]);
```

#### 设计约束
- ✅ 过滤规则必须不影响实际数据 `config.components`
- ✅ 仅展示层过滤，使用 `useMemo` 计算派生数据
- ✅ 隐藏组件在Store中完整保留

---

### 变更 2: Step 4 可视化器重设计

**变更编号**: CHG-2025-0405-002
**日期**: 2025-04-05
**状态**: 已完成

#### 问题背景
原可视化器存在投影不一致问题：底盘用3D投影，组件用2D形状导致"轮子像竖着的杆子"。

#### 变更内容

**2.1 统一投影函数**
```typescript
// BEFORE: 每个元素独立的投影逻辑
// AFTER: 统一使用 projectPoint
const projectPoint = (x, y, z, type, centerX, centerY, scale) => {
  if (type === 'iso') {
    const angle = Math.PI / 6;
    const isoX = (x - y) * Math.cos(angle);
    const isoY = (x + y) * Math.sin(angle) - z;
    return { x: centerX + isoX * scale, y: centerY + isoY * scale };
  } else {
    // Top: X向右, Y向上
    return { x: centerX + x * scale, y: centerY - y * scale };
  }
};
```

**2.2 视图简化**
- ❌ 移除 Side 视图
- ❌ 移除 Front 视图
- ✅ 保留 ISO (轴侧)
- ✅ 保留 Top (俯视)

**2.3 轮子渲染优化**
```typescript
// BEFORE (ISO): 竖直矩形
<rect x={pos.x - 10} y={pos.y - 120} width={20} height={240} ... />

// AFTER (ISO): 椭圆盘面
<ellipse cx={pos.x} cy={pos.y} rx={wheelLen/2 * scale} ry={wheelWidth/2 * scale} ... />

// AFTER (Top): 俯视椭圆
<ellipse cx={pos.x} cy={pos.y} rx={wheelWidth/2 * scale} ry={wheelLen/2 * scale} ... />
```

**2.4 激光LiDAR渲染增强**
```typescript
const LIDAR_SPEC = {
  // FOV 增强
  fillOpacity: 0.15,      // was 0.05
  strokeWidth: 2,         // was 1
  
  // Top 视图新增
  scanArcs: [0.3, 0.6, 0.9], // 3层同心扫描弧线
  directionLineWidth: 4,      // was 2
  directionGlowWidth: 8,      // 发光效果
  
  // ISO 视图增强
  size: 50,                 // was 40
  borderWidth: 3,           // 新增边框
  scanBeam: true,           // 新增扫描光束效果
};
```

**2.5 底盘俯视图轮廓**
```typescript
// BEFORE: 简单矩形
<rect ... />

// AFTER: 带轮拱的完整轮廓
<path d={chassisPath} ... />
// 包含: 4个轮拱凹陷 + 中心十字线 + 方向指示
```

---

### 变更 3: 主题系统颜色修复

**变更编号**: CHG-2025-0405-003
**日期**: 2025-04-05
**状态**: 已完成

#### 修复范围
| 文件 | 硬编码颜色 → CSS变量 |
|-----|-------------------|
| ComponentLibraryStep.tsx | `#f0f6fc` → `var(--text-primary)`, `#0d1117` → `var(--bg-card)` |
| ComponentPropertyPanel.tsx | `rgba(255,255,255,0.05)` → `var(--bg-hover)` |
| ChassisStep.tsx | `#8b949e`, `#f0f6fc` → 变量 |
| WiringStep.tsx | `rgba(255,255,255,0.1)` → `var(--border-default)` |
| AbilityStep.tsx | `rgba(0,0,0,0.2)` → `var(--bg-hover)` |
| VersionInfo.tsx | `#f0f6fc`, `#8b949e`, `rgba(255,255,255,0.06)` → 变量 |
| Sidebar.tsx | `#1c2128`, `#58a6ff`, `#c9d1d9` → 变量 |
| PowerTopologyCanvas.tsx | `#0d1117` → `var(--bg-card)` |

#### 禁止使用的硬编码值
```typescript
const PROHIBITED_VALUES = [
  { old: '#0d1117',    new: 'var(--bg-main)' },
  { old: '#1c2128',    new: 'var(--bg-card)' },
  { old: '#f0f6fc',    new: 'var(--text-primary)' },
  { old: '#8b949e',    new: 'var(--text-muted)' },
  { old: 'rgba(255,255,255,0.05)', new: 'var(--bg-hover)' },
  { old: 'rgba(255,255,255,0.1)',  new: 'var(--border-default)' },
];
```

---

## 第三部分: CSS变量规范

### 3.1 背景系统
```css
--bg-main:      /* 主背景 */
--bg-sidebar:   /* 侧边栏背景 */
--bg-card:      /* 卡片背景 */
--bg-input:     /* 输入框背景 */
--bg-hover:     /* 悬停背景 */
--bg-active:    /* 激活背景 */
```

### 3.2 文字系统
```css
--text-primary:   /* 主文字 */
--text-secondary: /* 次要文字 */
--text-muted:     /* 辅助文字 */
--text-accent:    /* 强调文字 */
```

### 3.3 边框系统
```css
--border-default: /* 默认边框 */
--border-strong:  /* 强调边框 */
--border-subtle:  /* 微妙边框 */
--border-accent:  /* 强调边框(带颜色) */
```

### 3.4 强调色
```css
--accent:       /* 主强调色：Cyber=#58a6ff, Industrial=#cc5200 */
--accent-soft:  /* 柔和强调色(用于hover背景) */
--success:      /* 成功：绿色系 */
--warning:      /* 警告：橙色系 */
--danger:       /* 危险：红色系 */
```

### 3.5 轴颜色
```css
--red:           /* X轴 */
--green:         /* Y轴 */
--accent:        /* Z轴(蓝色) */
--orange:        /* Roll轴 */
--purple:        /* Pitch轴 */
--accent-text:   /* Yaw轴(青色) */
```

---

## 第四部分: 代码规范

### 4.1 SVG可视化器规范

**必须遵循:**
```typescript
// ✅ VIS-01: 统一投影函数
const projectPoint = (...) => {...};

// ✅ VIS-02: 所有3D元素使用相同投影
const pos = projectPoint(x, y, z, ...);

// ✅ VIS-03: TOP视图纯2D投影
return { x: centerX + x * scale, y: centerY - y * scale };

// ✅ VIS-04: 组件和底盘相同缩放比例
const scale = Math.min(width, height) / (maxDim * 1.2);

// ✅ VIS-05: 只允许ISO和Top视图
resizeMode === 'iso' || resizeMode === 'top'

// ✅ VIS-06: 组件按Z坐标排序
components.sort((a, b) => (a.mountZ || 0) - (b.mountZ || 0))
```

### 4.2 React组件规范

**Hook使用:**
```typescript
// 必须使用useMemo缓存派生数据
const filteredTreeData = useMemo(() => {...}, [deps]);

// 必须使用useCallback缓存事件处理
const handleSelect = useCallback((id: string) => {...}, []);
```

---

## 第五部分: 设计验证清单

### Step 4 MountingStep 验证项
```
□ [ ] 组件列表按分类分组显示
□ [ ] 选中项有左侧边框高亮
□ [ ] ISO视图中轮子显示为椭圆(非竖条)
□ [ ] Top视图中轮子显示为椭圆
□ [ ] 激光FOV扇形清晰可见
□ [ ] ISO视图中激光有扫描光束效果
□ [ ] Top视图中底盘有轮拱轮廓
□ [ ] 两种主题颜色正确
□ [ ] 快速动作按钮(置底/归平/居中)可用
□ [ ] 视图切换(Split/ISO)正常
```

### Step 3 ComponentLibraryStep 验证项
```
□ [ ] 全域硬件层级树已过滤当前步骤组件
□ [ ] 底盘及其子组件不显示在层级树中
□ [ ] 已添加组件不在层级树中重复
□ [ ] 列表项hover/active状态正常
□ [ ] 两种主题下卡片样式正确
```

---

## 附录: 相关文件

| 文件路径 | 描述 | 变更状态 |
|---------|------|---------|
| `src/components/wizard/MountingStep.tsx` | Step 4 完全重设计 | ✅ 已完成 |
| `src/components/visualizer/CoordinateVisualizer.tsx` | 可视化器重设计 | ✅ 已完成 |
| `src/components/wizard/ComponentLibraryStep.tsx` | 树过滤逻辑 | ✅ 已完成 |
| `src/components/wizard/ChassisStep.tsx` | 主题颜色修复 | ✅ 已完成 |
| `src/components/wizard/WiringStep.tsx` | 主题颜色修复 | ✅ 已完成 |
| `src/components/wizard/AbilityStep.tsx` | 主题颜色修复 | ✅ 已完成 |
| `src/components/wizard/ComponentPropertyPanel.tsx` | 主题颜色修复 | ✅ 已完成 |
| `src/components/VersionInfo.tsx` | 主题颜色修复 | ✅ 已完成 |
| `src/components/layout/Sidebar.tsx` | 主题颜色修复 | ✅ 已完成 |
| `src/components/visualizer/ChassisVisualizer.tsx` | 主题颜色修复 | ✅ 已完成 |
| `src/components/wizard/PowerTopologyPanel.tsx` | 主题颜色修复 | ✅ 已完成 |

---

## 变更统计

| 类别 | 数量 |
|-----|------|
| 组件重设计 | 2 (MountingStep, CoordinateVisualizer) |
| 逻辑优化 | 1 (Tree过滤) |
| 主题颜色修复 | 10+ 文件 |
| 新增CSS变量 | 20+ |
| 移除视图类型 | 2 (Side, Front) |

---

**文档结束**

_Last Updated: 2025-04-05_
