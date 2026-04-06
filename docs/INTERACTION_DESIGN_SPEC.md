# AMR Studio V4 - 交互设计规范约束 (Interaction Design Specification)

## 1. 设计原则 (Design Principles)

### 1.1 核心原则
- **清晰性 (Clarity)**: 每个界面元素的功能应一目了然
- **一致性 (Consistency)**: 相同模式保持相同的交互行为
- **反馈性 (Feedback)**: 用户操作必须得到即时视觉反馈
- **效率性 (Efficiency)**: 高频操作路径最短化

### 1.2 布局原则
```
┌─────────────────────────────────────────────────────────────┐
│ 原则1: 弹性布局 (Elastic Layout)                             │
├─────────────────────────────────────────────────────────────┤
│ • 禁止使用固定像素宽度作为容器主尺寸                         │
│ • 使用 flex: N 比例分配空间，如 visualizer:flex 1.5,        │
│   editor:flex 1                                             │
│ • 关键容器设置 minWidth/maxWidth 约束极端情况               │
│ • 响应断点: 1200px(平板), 768px(移动)                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 原则2: 空间层级 (Spatial Hierarchy)                         │
├─────────────────────────────────────────────────────────────┤
│ • 主视觉区(左侧) : 编辑器/可视化区，占 60-70% 空间            │
│ • 属性面板(右侧) : 配置编辑器，占 30-40% 空间               │
│ • 信息密度: 单屏可见主要操作，避免滚动超过2屏               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 组件交互规范 (Component Interaction Specs)

### 2.1 列表-详情模式 (List-Detail Pattern)

以 Step 4 MountingStep 为范例:

```typescript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 左侧列表面板 (Left List Panel)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ListPanelSpec {
  // 1. 分组展示
  grouping: {
    enabled: true;
    criteria: 'category' | 'type' | 'custom';
    groupHeader: {
      height: '32px';
      background: 'var(--bg-hover)';
      typography: {
        size: '11px';
        weight: '500';
        transform: 'uppercase';
        letterSpacing: '0.5px';
        color: 'var(--text-muted)';
      };
    };
  };

  // 2. 列表项状态
  item: {
    height: '48px';
    padding: '10px 16px';
    borderLeft: {
      default: '3px solid transparent';
      active: '3px solid var(--accent)';
    };
    background: {
      default: 'transparent';
      hover: 'var(--bg-hover)';
      active: 'var(--accent-soft)';
    };
    transition: 'all 0.2s ease';
  };

  // 3. 选中指示器
  activeIndicator: {
    type: 'left-border' | 'dot' | 'background';
    recommended: 'left-border + background';
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 右侧编辑器面板 (Right Editor Panel)  
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface EditorPanelSpec {
  // 1. 上下文感知标题
  header: {
    shows: 'selected-item-name';
    fallback: '请选择组件';
    accentIcon: true; // 显示类别图标
  };

  // 2. 分组输入
  inputGrouping: {
    sections: ['position' | 'rotation' | 'scale' | 'other'];
    sectionTitle: {
      icon: string;
      label: string;
      color: 'var(--text-secondary)';
    };
    grid: {
      columns: 3; // 3列网格用于6轴输入
      gap: '12px';
    };
  };

  // 3. 快速操作
  quickActions: {
    position: 'bottom';
    style: 'button-group' | 'links';
    naming: 'semantic'; // 置底, 归平, 居中
  };
}
```

### 2.2 分组输入控件 (Grouped Input Controls)

```
┌────────────────────────────────────────────────────────────┐
│  ⊕ 位置坐标 (线性偏移)                                      │
│  ──────────────────────────────────────────────────────── │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │ X              │  │ Y              │  │ Z              │ │
│  │ (mm)     [  0]│  │ (mm)     [  0]│  │ (mm)     [  0]│ │
│  │ axis: red      │  │ axis: green    │  │ axis: blue     │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└────────────────────────────────────────────────────────────┘

规范:
• 轴标签颜色: X=var(--red), Y=var(--green), Z=var(--accent)
• 单位显示: (mm) 或 (°), 小号字体, 置于标签右侧
• 输入框样式: 无边框, 右对齐数字, 透明背景
• 焦点状态: 边框高亮 var(--accent) + 外发光
```

---

## 3. 视觉交互细节 (Visual Interaction Details)

### 3.1 状态过渡 (State Transitions)

```css
/* Hover 效果 */
.interactive-element {
  transition: all 0.2s ease;
}

.interactive-element:hover {
  border-color: var(--accent);
  /* 外发光 - 仅用于重要元素 */
  box-shadow: 0 0 0 2px var(--accent-soft);
}

/* Active 选中状态 */
.list-item.active {
  background: var(--accent-soft);
  border-left: 3px solid var(--accent);
}

.list-item.active::after {
  /* 右侧指示点 */
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
}
```

### 3.2 分类标识系统 (Category Identification System)

```typescript
const CATEGORY_SPEC = {
  // 传感器类 - 红色系
  SENSOR: { color: 'var(--red)', icon: 'RadarChartOutlined' },
  LASER:  { color: 'var(--red)', icon: 'ScanOutlined' },
  CAMERA: { color: 'var(--orange)', icon: 'VideoCameraOutlined' },
  
  // 动力类 - 绿色系
  MOTOR:      { color: 'var(--green)', icon: 'ThunderboltOutlined' },
  DRIVER:     { color: 'var(--cyan)', icon: 'ControlOutlined' },
  DRIVEWHEEL: { color: 'var(--accent-text)', icon: 'ApartmentOutlined' },
  
  // 控制类 - 蓝色系
  MAINCPU: { color: 'var(--accent)', icon: 'DeploymentUnitOutlined' },
  IO_BOARD: { color: 'var(--purple)', icon: 'UsbOutlined' },
  
  // 能源类 - 紫色系
  BATTERY: { color: 'var(--purple)', icon: 'BatteryOutlined' },
  
  // 交互类 - 黄色系
  BUTTON: { color: 'var(--yellow)', icon: 'SafetyOutlined' },
  SCREEN: { color: 'var(--yellow)', icon: 'DesktopOutlined' },
};

// 使用位置:
// 1. 列表左侧色点
// 2. 视觉化组件着色
// 3. Panel 标题图标
```

---

## 4. 主题系统规范 (Theme System Specification)

### 4.1 CSS变量强制使用规则

```typescript
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 禁止使用的硬编码值 (PROHIBITED HARDCODED VALUES)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const PROHIBITED_COLORS = [
  '#0d1117',  // → 使用 var(--bg-main)
  '#161b22',  // → 使用 var(--bg-sidebar)  
  '#1c2128',  // → 使用 var(--bg-card)
  '#21262d',  // → 使用 var(--border-default)
  '#30363d',  // → 使用 var(--border-strong)
  '#8b949e',  // → 使用 var(--text-muted)
  '#c9d1d9',  // → 使用 var(--text-secondary)
  '#f0f6fc',  // → 使用 var(--text-primary)
  '#58a6ff',  // → 使用 var(--accent)
];

const PROHIBITED_RGBA = [
  'rgba(255,255,255,0.05)', // → var(--bg-hover)
  'rgba(255,255,255,0.1)',  // → var(--border-default)  
  'rgba(255,255,255,0.06)', // → var(--border-default)
  'rgba(0,0,0,0.2)',        // → var(--bg-hover)
];

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 推荐的变量映射
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const COLOR_MIGRATION_MAP = {
  // 背景色
  '#0d1117'        : 'var(--bg-main)',
  '#1c2128'        : 'var(--bg-card)',
  'rgba(0,0,0,0.2)': 'var(--bg-hover)',
  'rgba(0,0,0,0.05)': 'var(--bg-hover)',
  
  // 文字色
  '#f0f6fc'        : 'var(--text-primary)',
  '#c9d1d9'        : 'var(--text-secondary)', 
  '#8b949e'        : 'var(--text-muted)',
  '#fff'           : 'var(--text-primary)',
  
  // 边框色
  '#30363d'        : 'var(--border-default)',
  'rgba(255,255,255,0.1)': 'var(--border-default)',
  'rgba(255,255,255,0.05)': 'var(--border-default)',
  
  // 强调色
  '#58a6ff'        : 'var(--accent)',
  'rgba(88,166,255,0.15)': 'var(--accent-soft)',
};
```

### 4.2 SVG视觉器主题适配

SVG元素需要特殊处理，因为CSS变量在SVG属性中支持有限：

```typescript
// 推荐方案: 主题检测 + 动态颜色
const useSvgThemeColors = () => {
  const [theme, setTheme] = useState('cyber');
  
  useEffect(() => {
    const themeAttr = document.documentElement.getAttribute('data-theme');
    setTheme(themeAttr || 'cyber');
  }, []);
  
  const colors = useMemo(() => {
    const isDark = theme === 'cyber';
    return {
      background: isDark ? '#0d1117' : '#ffffff', // SVG根背景需硬编码
      grid: isDark ? '#30363d' : '#e5e7eb',
      text: isDark ? '#f0f6fc' : '#1f2937',
      chassis: isDark ? '#58a6ff' : '#2563eb',
      // ...等等
    };
  }, [theme]);
  
  return colors;
};

// 注意: SVG内部应尽可能使用CSS变量，对于不支持的属性(如pattern的stroke)
// 可以接受硬编码，但颜色必须从主题调色板中选择
```

---

## 5. 响应式设计断点 (Responsive Breakpoints)

```typescript
const RESPONSIVE_SPEC = {
  breakpoints: {
    desktop: { min: 1200 },
    tablet:  { min: 768, max: 1199 },
    mobile:  { max: 767 },
  },
  
  layout: {
    // Step 4 MountingStep 响应式适配
    mountingStep: {
      desktop: {
        flexDirection: 'row',
        visualizer: { flex: 1.5 },
        editor: { flex: 1, maxWidth: '420px' },
      },
      tablet: {
        flexDirection: 'column',
        editor: { flexDirection: 'row', maxWidth: 'none' },
        componentList: { flex: '0 0 280px' },
        coordinateEditor: { flex: 1 },
      },
      mobile: {
        flexDirection: 'column',
        editor: { flexDirection: 'column', maxWidth: 'none' },
        componentList: { maxHeight: '200px' },
      },
    },
  },
};
```

---

## 6. 交互模式速查 (Interaction Pattern Checklist)

### 6.1 列表选择模式
- [ ] 列表项有明确的hover状态
- [ ] 选中项有视觉区分(左侧边框+背景色)
- [ ] 选中指示器使用发光效果
- [ ] 分组标题使用小号大写字母
- [ ] 分类使用有色圆点标识

### 6.2 表单编辑模式
- [ ] 输入框无边框，hover时显示边框
- [ ] 轴输入使用颜色区分(X红Y绿Z蓝)
- [ ] 数字右对齐
- [ ] 输入分组有图标+标题
- [ ] 有快捷操作按钮(语义命名)

### 6.3 视觉化预览模式
- [ ] 支持多种视图(ISO/Top/Side)
- [ ] 视图切换使用Segmented控件
- [ ] 选中元素高亮显示
- [ ] 网格背景不抢眼
- [ ] FOV等高级特性使用半透明填充

### 6.4 模态窗口模式
- [ ] 搜索框放在顶部
- [ ] 过滤选项与搜索同行
- [ ] 卡片网格使用悬停动效(上浮+阴影)
- [ ] 卡片有添加指示图标

---

## 7. 实施检查清单 (Implementation Checklist)

### 7.1 代码审查要点
```
□ 是否使用CSS变量而非硬编码颜色?
□ 是否有响应式断点处理(1200px/768px)?
□ 列表项是否有hover/active状态?
□ 交互元素是否有0.2s过渡动画?
□ 输入框是否有焦点高亮?
□ 空状态是否有友好提示?
□ 错误状态是否有明显标识?
```

### 7.2 主题测试要点
```
□ Cyber主题所有文字可读?
□ Industrial主题所有文字可读?
□ 边框在两种主题下都可见?
□ 选中高亮在两种主题下都清晰?
□ 输入框在两种主题下都可用?
```

---

## 附录: 参考实现

### MountingStep 完整组件结构
```
MountingStep
├── Header
│   ├── Title + Icon
│   └── ViewModeToggle (Split/ISO)
├── Content (flex container)
│   ├── VisualizerPanel (flex: 1.5)
│   │   └── CoordinateVisualizer 
│   │       ├── ViewRenderer (ISO/Top/Side/Front)
│   │       └── ViewModeSelector (when ISO mode)
│   └── EditorPanel (flex: 1)
│       ├── ComponentListCard
│       │   ├── GroupHeader (by category)
│       │   └── ComponentItem (clickable)
│       └── CoordinateEditorCard
│           ├── SelectedComponentTitle
│           ├── PositionSection (X,Y,Z)
│           ├── RotationSection (Roll,Pitch,Yaw)
│           └── QuickActions (置底/归平/居中)
└── Styles (inline CSS)
```
