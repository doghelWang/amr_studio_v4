# AMR Studio Pro V4 — 代码框架设计

> **文档版本**: V4.0 | **日期**: 2026-03-07  
> **技术栈**: React 18 + TypeScript + Vite + Zustand + ReactFlow + FastAPI

---

## 一、项目目录结构

```
amr_studio/
├── frontend/                          # React前端
│   ├── src/
│   │   ├── main.tsx                   # 应用入口
│   │   ├── App.tsx                    # 根路由（Home/Editor两个路由页）
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.tsx           # 项目主页（最近文件、模板库）
│   │   │   └── EditorPage.tsx         # 主编辑器页面（IDE布局）
│   │   │
│   │   ├── layout/                    # IDE布局组件
│   │   │   ├── TopMenuBar.tsx         # 顶部菜单栏（文件/编辑/工具/编译）
│   │   │   ├── SidebarProjectTree.tsx # 左侧项目树
│   │   │   ├── PropertyInspector.tsx  # 右侧属性检查器
│   │   │   ├── StatusBar.tsx          # 底部状态栏（总线占用/警告数）
│   │   │   └── TabsMainArea.tsx       # 主编辑区标签页容器
│   │   │
│   │   ├── panels/                    # 各配置面板（主内容区）
│   │   │   ├── IdentityPanel.tsx
│   │   │   ├── ControlBoardPanel.tsx
│   │   │   ├── DrivePanel.tsx         # 含ConfirmSwitchDialog
│   │   │   ├── SensorPanel.tsx
│   │   │   ├── IOPanel.tsx
│   │   │   ├── BlueprintCanvas.tsx    # 2D SVG可交互画布
│   │   │   └── WiringCanvas.tsx       # React Flow电气拓扑图
│   │   │
│   │   ├── components/                # 原子组件
│   │   │   ├── DriveTypeConfirmDialog.tsx   # 驱动切换确认框
│   │   │   ├── HealthDashboard.tsx          # 健康度仪表盘
│   │   │   ├── UndoHistoryPanel.tsx         # 撤销历史面板
│   │   │   ├── VersionDiffView.tsx          # 版本对比视图
│   │   │   ├── TemplateGallery.tsx          # 模板选择画廊
│   │   │   ├── ExportDialog.tsx             # 导出选项对话框
│   │   │   ├── ValidatedInput.tsx           # 带内联错误的输入框封装
│   │   │   └── BusIndicator.tsx             # 底部总线负载指示器
│   │   │
│   │   ├── store/                     # Zustand 状态管理
│   │   │   ├── useProjectStore.ts     # 主状态（含undo中间件）
│   │   │   ├── useValidationStore.ts  # 校验结果状态（只读派生）
│   │   │   ├── useHistoryStore.ts     # 版本快照状态
│   │   │   ├── useUIStore.ts          # UI状态（选中节点/面板状态）
│   │   │   └── types.ts               # 所有TypeScript类型定义
│   │   │
│   │   ├── services/                  # 业务逻辑服务层
│   │   │   ├── projectFileService.ts  # .amrproj 文件读写
│   │   │   ├── validationEngine.ts    # 前端校验引擎（纯函数）
│   │   │   ├── templateService.ts     # 模板加载与管理
│   │   │   ├── apiService.ts          # 后端API调用封装
│   │   │   └── snapshotService.ts     # 版本快照创建与对比
│   │   │
│   │   ├── canvas/                    # 画布专用模块
│   │   │   ├── blueprintDrag.ts       # 2D蓝图拖动逻辑（useDrag hook）
│   │   │   ├── blueprintRotation.ts   # 旋转手柄逻辑
│   │   │   └── wiringNodeTypes.tsx    # React Flow自定义节点类型
│   │   │
│   │   └── assets/
│   │       └── templates/             # 内置模板JSON文件
│   │           ├── diff_drive.json
│   │           ├── single_steer.json
│   │           ├── dual_steer.json
│   │           ├── quad_steer.json
│   │           └── mecanum.json
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                           # FastAPI后端
    ├── main.py                        # 应用入口 + 路由注册
    ├── requirements.txt
    │
    ├── api/
    │   ├── generate.py                # POST /api/v1/generate
    │   ├── validate.py                # POST /api/v1/validate
    │   ├── report.py                  # POST /api/v1/report/pdf
    │   ├── bom.py                     # POST /api/v1/report/bom
    │   └── templates.py               # GET  /api/v1/templates
    │
    ├── schemas/
    │   ├── robot_config.py            # Pydantic完整配置模型
    │   └── validation_result.py       # 校验结果模型
    │
    ├── core/
    │   ├── protobuf_engine.py         # Protobuf序列化引擎
    │   ├── validation_engine.py       # 服务端二次校验（与前端同逻辑）
    │   ├── report_generator.py        # PDF报告生成 (reportlab)
    │   └── bom_generator.py           # BOM Excel生成 (openpyxl)
    │
    └── templates/                     # Protobuf模板文件
        ├── CompDesc.model
        └── FuncDesc.model
```

---

## 二、状态管理设计 (Zustand)

### 2.1 主状态 `useProjectStore` — 带 Undo 中间件

```typescript
// store/useProjectStore.ts

import { create } from 'zustand';
import { temporal } from 'zundo';  // Zundo: Zustand的undo/redo中间件

interface ProjectState {
  // 项目元数据
  projectMeta: ProjectMeta;

  // 机器人配置数据
  config: RobotConfig;

  // Actions
  setMeta: (meta: Partial<ProjectMeta>) => void;
  setDriveType: (type: DriveType) => void;       // 触发确认框
  updateWheel: (id: string, data: Partial<WheelConfig>) => void;
  addSensor: (sensor: Omit<SensorConfig, 'id'>) => void;
  removeSensor: (id: string) => void;
  updateSensor: (id: string, data: Partial<SensorConfig>) => void;
  // ... 其他 CRUD actions
}

// 使用 temporal 中间件包裹，获得 undo/redo 能力
// 50步历史，每个 action 自动记录
export const useProjectStore = create(
  temporal<ProjectState>(
    (set, get) => ({ /* state + actions */ }),
    { limit: 50 }
  )
);

// Undo/Redo 通过以下方式调用
// useProjectStore.temporal.getState().undo()
// useProjectStore.temporal.getState().redo()
// useProjectStore.temporal.getState().futureStates.length > 0
```

### 2.2 校验状态 `useValidationStore` — 派生状态（只读）

```typescript
// store/useValidationStore.ts
// 不直接存储 — 由 validationEngine 根据 ProjectState 计算派生

interface ValidationResult {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  isCompilable: boolean;  // errors.length === 0
}

interface ValidationIssue {
  code: string;                         // 'CAN_ID_CONFLICT' | 'IP_DUPLICATE' | ...
  severity: 'ERROR' | 'WARNING';
  message: string;
  location: { panelKey: string; nodeId: string; fieldPath: string };
  // 用于在UI上定位并跳转到出错字段
}
```

### 2.3 UI 状态 `useUIStore`

```typescript
interface UIState {
  activePanel: 'identity' | 'control' | 'drive' | 'sensor' | 'io' | 'blueprint' | 'wiring';
  selectedNodeId: string | null;       // 当前选中的组件ID（画布/树）
  canvasMode: 'view' | 'edit';         // 蓝图编辑模式
  isDriveConfirmOpen: boolean;          // 驱动切换确认框
  pendingDriveType: DriveType | null;  // 待切换的类型
  isHealthDashboardOpen: boolean;
  isExportDialogOpen: boolean;
}
```

---

## 三、校验引擎设计 (validationEngine.ts)

```typescript
// services/validationEngine.ts

export interface ValidationRule {
  code: string;
  check: (config: RobotConfig) => ValidationIssue[];
}

// 规则注册表
const RULES: ValidationRule[] = [
  {
    code: 'CAN_ID_CONFLICT',
    check: (config) => {
      const issues: ValidationIssue[] = [];
      // 按 canBus 分组，检查同总线内 canNodeId 重复
      const busGroups = groupBy([...config.wheels, ...config.ioBoards], 'canBus');
      for (const [bus, devices] of Object.entries(busGroups)) {
        const ids = devices.map(d => d.canNodeId);
        const duplicates = findDuplicates(ids);
        duplicates.forEach(id => {
          const conflicted = devices.filter(d => d.canNodeId === id);
          conflicted.forEach(d => issues.push({
            code: 'CAN_ID_CONFLICT',
            severity: 'ERROR',
            message: `${bus} 上 ID=${id} 被多个设备占用`,
            location: { panelKey: d.type === 'wheel' ? 'drive' : 'control', nodeId: d.id, fieldPath: 'canNodeId' }
          }));
        });
      }
      return issues;
    }
  },
  {
    code: 'ETHERNET_IP_CONFLICT',
    check: (config) => { /* 检查传感器 IP 重复 */ }
  },
  {
    code: 'ETH_PORT_OVERSUBSCRIBED',
    check: (config) => {
      // 检查分配给传感器的 ethPort 是否超过 MCU 声明的 ethPorts
    }
  },
  {
    code: 'CAN_BUS_OVERLOADED',
    check: (config) => {
      // 每条总线设备数 > 8 → WARNING
    }
  },
  {
    code: 'SENSOR_IP_EMPTY',
    check: (config) => {
      // Ethernet 传感器 IP 为空 → ERROR
    }
  },
  {
    code: 'STEER_LIMIT_INVALID',
    check: (config) => {
      // leftLimit > 0 或 rightLimit < 0 → WARNING（物理不合理）
    }
  }
];

// 运行全部规则，返回合并结果
export function runValidation(config: RobotConfig): ValidationResult {
  const allIssues = RULES.flatMap(rule => rule.check(config));
  return {
    errors: allIssues.filter(i => i.severity === 'ERROR'),
    warnings: allIssues.filter(i => i.severity === 'WARNING'),
    isCompilable: !allIssues.some(i => i.severity === 'ERROR')
  };
}
```

**集成方式**: 在 `useProjectStore` 的每个 setter action 尾部，触发 `validationEngine.runValidation()` 并将结果写入 `useValidationStore`（debounce 50ms）。

---

## 四、项目文件格式 (.amrproj)

```json
// 文件格式：JSON，UTF-8编码，扩展名 .amrproj
{
  "formatVersion": "1.0",
  "meta": {
    "projectId": "uuid-v4",
    "createdAt": "2026-03-07T13:00:00Z",
    "modifiedAt": "2026-03-07T21:15:00Z",
    "author": "Wang Feifei",
    "templateOrigin": "dual_steer"
  },
  "config": {
    "identity": {
      "robotName": "Custom AGV",
      "version": "V2.0",
      "chassisLength": 1200,
      "chassisWidth": 800
    },
    "mcu": { /* McuConfig */ },
    "ioBoards": [ /* IoBoardConfig[] */ ],
    "driveType": "DUAL_STEER",
    "wheels": [ /* WheelConfig[] */ ],
    "sensors": [ /* SensorConfig[] */ ],
    "ioPorts": [ /* IOConfig[] */ ]
  },
  "snapshots": [
    {
      "snapshotId": "snap-001",
      "label": "V1.2 - 初始化配置",
      "createdAt": "2026-03-07T18:30:00Z",
      "config": { /* 完整config快照 */ }
    }
  ]
}
```

**持久化策略**:
1. **主力**: Browser File System Access API（`showSaveFilePicker`）→ 用户显式保存到本地
2. **备用**: IndexedDB 每 30 秒自动保存草稿（`autosave_draft`），防止意外关闭丢失

---

## 五、画布拖动逻辑 (blueprintDrag.ts)

```typescript
// canvas/blueprintDrag.ts

interface DragState {
  isDragging: boolean;
  nodeId: string;
  startPx: { x: number; y: number };
  startMm: { x: number; y: number };
}

// 自定义 Hook
export function useBlueprintDrag(svgRef: RefObject<SVGSVGElement>) {
  const updateWheel = useProjectStore(s => s.updateWheel);
  const updateSensor = useProjectStore(s => s.updateSensor);
  const { undo } = useProjectStore.temporal.getState();

  const onMouseDown = (nodeId: string, type: 'wheel' | 'sensor', e: MouseEvent) => {
    // 记录拖动开始状态
  };

  const onMouseMove = (e: MouseEvent) => {
    // 将像素增量转换为mm增量
    // deltaMmX = deltaPx.x / SCALE
    // 实时更新store（不写undo历史）
  };

  const onMouseUp = () => {
    // 拖动结束时，写入undo历史（记录完整的from/to）
    // 这样撤销时是整个拖动操作，而不是每一个像素变化
  };
}
```

---

## 六、后端新增模块

### 6.1 PDF 报告生成 (report_generator.py)
```python
from reportlab.platypus import SimpleDocTemplate, Table, Paragraph, Image
from reportlab.lib.styles import getSampleStyleSheet

def generate_config_report(config: RobotConfig, output_path: str):
    """
    生成包含以下内容的PDF报告:
    1. 扉页（机器人名称、版本、生成时间）
    2. 硬件配置摘要表（MCU / IO板 / 轮组 / 传感器）
    3. 安装位置图（SVG俯视图转PNG嵌入）
    4. 电气连接清单（每个设备：接口类型/总线/地址）
    """
```

### 6.2 BOM 表生成 (bom_generator.py)
```python
from openpyxl import Workbook

def generate_bom(config: RobotConfig, output_path: str):
    """
    生成Excel BOM表，包含列:
    序号 | 零件类型 | 型号/规格 | 数量 | 连接方式 | 总线/网络地址 | 备注
    """
```

---

## 七、技术依赖清单

### 前端新增依赖
```json
{
  "zundo": "^2.0.0",              // Zustand undo/redo 中间件
  "@xyflow/react": "^12.0.0",    // 已有 (React Flow)
  "react-router-dom": "^6.0.0",  // 页面路由 (Home/Editor)
  "file-saver": "^2.0.5",        // 文件下载
  "jspdf": "^2.5.1",             // 客户端PDF（备选）
  "react-dnd": "^16.0.1"         // 拖拽（或用自定义SVG鼠标事件）
}
```

### 后端新增依赖
```
reportlab>=4.0.0      # PDF生成
openpyxl>=3.1.0       # Excel BOM生成
Pillow>=10.0.0        # 图片处理（SVG转PNG内嵌PDF）
```
