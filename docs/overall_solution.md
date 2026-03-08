# AMR Studio Pro V4 — 总体方案设计

> **文档版本**: V4.0 | **日期**: 2026-03-07 | **作者**: Antigravity Design Team  
> **背景**: 基于客户真实使用反馈（8项痛点），对 V3 版本进行工程化升级设计

---

## 一、产品定位重新审视

### 当前定位 (V3)
> "一款让机器人工程师能够在线填写 AMR 参数并生成 ModelSet 的配置工具"

### 升级定位 (V4)
> **"AMR 硬件平台工程化设计平台"**
> 
> — 面向机器人整机厂商的**多人协作、版本管理、可持续迭代**的工程级配置管理系统，从需求分析到工程交付形成完整闭环。

| 维度         | V3                | V4 目标                                            |
| ------------ | ----------------- | -------------------------------------------------- |
| 数据生命周期 | 单次会话          | 持久化项目文件，跨会话/跨设备                      |
| 用户角色     | 单人使用          | 多角色协作（结构工程师 / 电气工程师 / 软件工程师） |
| 验证能力     | 无                | 实时冲突检测 + 编译前全量校验                      |
| 可视化层次   | 静态展示          | 可交互配置画布（拖动定位 + 旋转方向）              |
| 交付物       | Protobuf ModelSet | ModelSet ZIP + 工程配置报告 + BOM 清单             |
| 历史追踪     | 无                | Undo/Redo + 配置版本快照对比                       |

---

## 二、V4 核心特性范围

### 特性 1：项目持久化与管理（Project Persistence）
- 每个 AMR 定义为一个**项目文件**（`.amrproj` JSON 格式）
- 支持 **新建 / 打开 / 另存为 / 导入 / 导出**
- 项目文件包含：机器人配置 + 历史版本快照 + 元数据（创建人、修改时间、版本号）
- 最近文件列表（Home 页展示）

### 特性 2：配置防错与校验引擎（Validation Engine）
- **实时** CAN Node ID 唯一性检测（同总线内）
- **实时** Ethernet IP 地址格式校验 + 重复检测
- **编译前** 全量校验 Checklist（含必填字段、范围约束、物理合理性约束）
- 错误以**内联红圈标记**显示，不阻止编辑但阻止编译
- 提供"配置健康度"仪表盘（Pass / Warning / Error 三级）

### 特性 3：撤销/重做历史（Undo/Redo）
- 所有用户操作（字段修改、增删组件、驱动类型切换）均可撤销
- 最多保留 50 步操作历史
- 切换驱动类型时给出明确**确认对话框**，提示"此操作将重置所有轮组参数"

### 特性 4：机器人模板库（Template Library）
- 内置 **10 种标准 AMR 模板**（差速双驱、单舵轮、双舵轮、四舵轮、麦轮等）
- 支持用户**将当前配置另存为模板**
- 支持**从模板克隆**新项目并修改

### 特性 5：可交互可视化画布（Interactive Canvas）
- 2D 蓝图：组件图标可**拖动**改变 X/Y 位置，可**旋转手柄**调整 Yaw
- 电气拓扑图：节点可移动，边标签可点击快速定位对应侧边栏配置项
- 两个画布共享同一状态，互为镜像（修改表单→画布自动更新，拖动画布→表单自动同步）

### 特性 6：工程文档导出（Engineering Report Export）
- 一键导出 **配置摘要 PDF**（包含：机器人参数表格、安装位置图、电气连接图）
- 一键导出 **BOM 清单 Excel**（零件型号 + 数量 + 连接关系）
- 标准 **ModelSet.zip** 保持兼容（供机器人软件使用）

### 特性 7：配置版本快照对比（Version Snapshot）
- 每次"编译"自动生成一个版本快照（含时间戳）
- 支持任意两个版本进行**参数对比**（Diff View，高亮差异字段）

### 特性 8：总线负载分析（Bus Load Analyzer）
- CAN 总线：统计每条总线上的设备数，显示负载状态（绿/黄/红）
- 推荐设备数量限制（每条 CAN 建议 ≤ 8 个节点）
- ETH 端口：检测是否超出 MCU 可用端口数

---

## 三、用户故事地图

```
[新项目] ──→ [从模板选取] ──→ [配置控制板] → [配置轮组驱动] → [配置传感器] → [配置IO]
                                    ↓                   ↓               ↓
                              [实时校验]          [安装蓝图拖动]    [电气连接图]
                                    ↓
                              [健康度检查] ──→ [编译ModelSet] ──→ [导出工程报告]
                                    ↓
                               [版本快照] ──→ [版本对比] ──→ [项目另存]
```

---

## 四、系统架构演进

### V3 架构
```
Browser (React) ──── HTTP ──── FastAPI (Python)
    └── Zustand (Session State)      └── Protobuf Engine
```

### V4 目标架构
```
Browser (React + Vite)
    ├── Zustand + undo-history middleware (State Layer)
    ├── Validation Engine (Pure TS, 前端实时校验)
    ├── Canvas Layer (SVG Drag + ReactFlow Edit)
    └── Project IO (LocalStorage + File System Access API)
              │
         HTTP REST API
              │
      FastAPI (Python)
    ├── /api/v1/generate    → Protobuf Compiler
    ├── /api/v1/validate    → 服务端二次校验
    ├── /api/v1/report      → PDF/Excel 生成 (reportlab + openpyxl)
    └── /api/v1/templates   → 模板库管理
```

---

## 五、非功能性需求

| 指标         | 要求                                                      |
| ------------ | --------------------------------------------------------- |
| 配置文件大小 | 单项目 ≤ 5MB                                              |
| 实时校验响应 | ≤ 50ms（前端纯逻辑）                                      |
| 编译时间     | ≤ 3 秒（含后端 Protobuf 生成）                            |
| PDF 导出     | ≤ 8 秒                                                    |
| 浏览器支持   | Chrome 110+, Edge 110+（支持 File System Access API）     |
| 持久化策略   | 主力：本地文件（.amrproj） / 备选：IndexedDB 自动保存草稿 |

---

## 六、V4 交付物清单

| 交付物                       | 格式              | 说明                    |
| ---------------------------- | ----------------- | ----------------------- |
| `overall_solution_design.md` | Markdown          | **本文档**              |
| `ux_optimization_design.md`  | Markdown          | 交互界面优化设计        |
| `code_framework_design.md`   | Markdown          | 代码框架设计            |
| `detailed_design_spec.md`    | Markdown          | 详细设计规格说明书      |
| 实现代码                     | React/TS + Python | V4 代码实现（后续阶段） |
