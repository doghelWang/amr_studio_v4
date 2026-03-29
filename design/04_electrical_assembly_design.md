# 第三步: 电气装配与接口资源设计规范 (Electrical Assembly Design)

> 文档编号: 04  
> 日期: 2026-03-28  
> 描述: 针对第三步（电气装配）模块化重组、过滤逻辑与核心控制板 (Host/Expansion) 接口资源自动注入的设计参考。

## 1. 业务目标与模块定义

"电气装配" (原 ComponentLibraryStep) 的核心目标是完成 AMR 体系中**非动力非结构类核心器件**的选型与配置。其在前端界面的呈现必须遵循严格的分类归属规则：

### 1.1 模块分类映射规则
| 逻辑分类名称 | 包含的底层 CModel `category` | 工程约束说明 |
|:---|:---|:---|
| **核心控制板** | `MAINCPU`, `CONTROL`, `IO_BOARD`, `INTERGRATEDCONTROLLER` | 机器人大脑与神经中枢。该类模块添加时**必须**触发 `board_desc` JSON 扫描与接口自适配注入。 |
| **感知避障** | `LASER`, `CAMERA`, `TOF`, `SENSOR` | 外界环境感知。**特别约束**：不得包含动力反馈相关的传感器（如 `angularEncode`, 增量/绝对值编码器、拉线传感器等），这些属动力系统范畴。 |
| **电源管理** | `BATTERY`, `ENERGYCONTROLLER` | BMS 及电池组。 |
| **触点交互** | `BUTTON` | 物理按键（急停、复位等）。 |
| **信息显示** | `DISPLAY`, `SCREEN`, `AUDIO` | 人机交互输出（非必选项）。 |
| **灯带氛围** | `LED`, `LIGHT` | 状态指示灯带（非必选项）。 |
| **其他扩展** | `IO`, `OTHER`, `COMMUNICATION`, `AUTOBODY` | 车壳、额外继电器、通信天线等。 |

---

## 2. 核心控制板接口提取机制 (Board Desc Aggregation)

由于主控制器和扩展板的接口种类繁多，它们代表了 AMR 上可用的“插槽池”。当在 UI 上添加一块板子时，其 `interfaceParams` 不能留空或仅仅由通用 Schema 生成，必须从 `board_desc/host` 或 `board_desc/expansion` 目录加载对应的描述文件。

### 2.1 依赖的解析流向 (完全动态化 XML 载入)
为防止前端硬编码导致后续维护困难，采用静态资源分离策略，所有的板卡接口资源提取将被独立为单独的 XML 字典。

```mermaid
flowchart TD
    BoardJSON[("原始资料: board_desc/host & expansion (*.json)")] --> |CI/CD或预处理脚本| XMLGen[转换为统一的 board_desc.xml]
    XMLGen --> |部署| Nginx[Public 静态资源目录 (/public/models/v4/)]
    
    User([用户在向导中选择核心控制板]) --> SelectBoard[选中型号如 RA-MC-R318AD]
    SelectBoard --> Store[Zustand Store]
    
    Store --> |axios.get 动态拉取无硬编码| FetchXML[读取 board_desc.xml]
    FetchXML --> |执行黑白名单过滤| Filter{提取有效通信与I/O}
    Filter --> ReduxState[Zustand Store: 注入到 interfaceParams]
```

### 2.2 接口过滤名单与数据映射转换
系统仅从板卡的外设描述中精准抽取业务逻辑连线需要的物理资源：

- **核心白名单通道**: `can`, `uart`, `rs485`, `usb`,网络(`eth`), IO点位(`di`, `do`, `ai`, `ao`)
- **黑名单通道**: 不参与外部传感器连线的芯片级预留总线（如 `pi`, `po`, `lvds` 等内部总线）。
- **存储映射 (`InterfaceConfig`)**:
  当 `board_desc.json` 提供如下结构时：
  ```json
  "can": [
    { "name": "CAN_1", "source": "SOURCE_HOST" }
  ]
  ```
  将在前端被映射为 `Zustand => ComponentConfig.interfaceParams` 下的：
  ```json
  {
      "portId": "<uuid>",
      "portName": "CAN_1",
      "portProtocol": "CAN",
      "portDirection": "BOTH",
      "connectedTo": null
  }
  ```

---

## 3. UI 交互体验设计约束

1. **属性按需屏蔽**：
   与底盘参数处理类似，核心控制板虽然生成了巨量的接口资源参数，但这部分参数主要用于**底层逻辑构建和给接线步骤提供插槽**，在“电气装配”的属性配置面板（侧边栏）中，不应对用户可见或至少设为 readonly，防止用户篡改单板固有的硬件形态。
2. **分类聚合与动态验证**：
   在感知雷达等分类下，应隐藏底盘关联属性。且“电气装配”不出现 `mountX/Y`（安装位置概念），安装位置将归口到之后的第 4 步（安装坐标）统一呈现。
3. **接口资源重置与级联断开保护 (Cascade Reset)**：
   在电气装配过程中，**如果改变了其中一个模块的型号类型**（例如将主控制器从 `RA-MC-R318AD` 更换为其他型号，或者更改了任何传感器设备），系统必须即刻销毁并重建其相关的插槽资源。
   **衍生结果**：该模块原先在第五步中连好的**所有两侧连接端子将全部自动断开**，以确保极其严格的强一致性安全设计，防止发生幽灵连线。
