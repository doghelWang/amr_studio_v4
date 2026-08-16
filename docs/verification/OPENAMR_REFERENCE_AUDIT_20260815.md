# OpenAMR 硬件项目参考审计

日期：2026-08-15

## 结论

`openAMRobot/openamr` 是历史入口仓库，README 已说明项目已拆分；当前硬件、机械 CAD、BOM、生产图纸和电气资料应以 [`openamr-platform-hw`](https://github.com/openAMRobot/openamr-platform-hw) 为主要参考。它不是单纯的 AMR 外观图，而是一套有机械装配层级和已验证硬件配置的差速移动底盘参考。

## 已确认的项目结构

### 仓库边界

- `openamr`：历史聚合入口，保留旧版硬件图片、BOM、CAD 索引和软件子模块。
- `openamr-platform-hw`：当前硬件主仓库，包含机械 CAD、生产资料、电气、BOM、装配和安全文档。
- `openamr-platform-sw`：ROS 2、仿真、导航和软件描述。
- `openamr-platform-fw`：Teensy 电机控制、编码器、里程计和固件。

### 机械装配层级

OpenAMR 的 MMP（Multipurpose Mobile Platform）不是平面底板，机械编号明确区分：

```text
MMP.00  平台总成、前后侧板、塑料外壳
MMP.01  上盖总成
MMP.02  底座总成
MMP.03  轮组总成
        外轮架 / 内轮架 / 电机支架 / 驱动轴
MMP.04  中心支架总成
MMP.05  支撑总成
MMP.07  激光雷达支架总成
PT1     编码器、转接件、相机外壳等共享件
```

这说明 AMR 3D 界面必须以“总成—子总成—零件”表达，不能将轮子、电机、驱动器和电池全部作为同一层的浮动标签。

## 真实底盘视觉与工程事实

### 底盘体积

- 上层是有折弯边和防护斜面的外壳/上盖。
- 中层是侧板、中心支架、电子模块和电池空间。
- 下层是底座、轮架、驱动轴和承重结构。
- 驱动轮从底盘侧面/底部露出并接地；辅助脚轮位于前后支撑位置。
- 透明视图可以看到内框、安装孔、板金折弯、模块安装区和轮组悬挂/支架关系。

### 轮组总成

OpenAMR 的轮组并不是一个轮子图标，而是：

```text
车体侧板
  └─ 外轮架 / 内轮架
      ├─ 驱动轴
      ├─ 电机支架
      ├─ BLDC 电机 + 减速箱
      ├─ 编码器
      └─ 重载驱动轮
```

仓库 BOM 还明确列出重载驱动轮、轻载万向脚轮、轴承座、键、驱动轴、电机和编码器。因此前端应将轮组作为一个可展开的机械总成，并显示轮轴、支架和反馈关系。

### 参考硬件配置

`openamr-platform-hw` 当前文档记录的已验证配置包括：

- 左右 BLDC 电机各 1 个：ZD Z4BLD60-24GN-30S。
- 左右驱动器各 1 个：ZBLD.C20-120L2R。
- 左右磁编码器各 1 个：AS5040。
- Raspberry Pi 5 8GB + Teensy 4.0。
- RPLIDAR A1、IMU、Pi Camera Module 3 NoIR。
- 24V 电池系统。
- 物理测量轮径约 0.2m，轮距约 0.46m；这些只属于 OpenAMR 参考项目事实，不能直接写入 AMR Studio 当前车型。

## 对 AMR Studio V4 的直接影响

当前装备工坊的问题可以准确归纳为：

1. 以组件平铺代替机械总成。
2. 以 `translateZ` 阴影代替真实车体厚度。
3. 没有把车体外壳、底座、中心支架和轮架分层。
4. 轮组没有连接到驱动轴、电机、编码器和驱动器关系。
5. 透明/拆解视图没有显示内部安装空间。
6. 模块名称标签覆盖实体，没有使用工程引线和选中态标注。

## 后续设计基线

AMR Studio 后续 3D 设计应改为四种真实视图：

1. **整车实体视图**：外壳、侧板、底座、落地轮组、雷达和急停。
2. **半透明内部视图**：电池、主控、IO、驱动器、中心支架和线束区域。
3. **轮组总成视图**：轮胎、轮毂、轴、支架、电机、编码器、驱动器关系。
4. **工程爆炸视图**：按 MMP 总成层级拆分，所有偏移只用于视图，不写回 Proto。

必须保留数据边界：OpenAMR 的 CAD/BOM 参数是外部参考，不得自动覆盖当前 AMR Studio 的 Proto、模块模板或用户模型；没有当前车型资产时应标记 `reference-only` 或 `unknown`。

## 参考资源

- [历史入口仓库 openamr](https://github.com/openAMRobot/openamr)
- [当前硬件仓库 openamr-platform-hw](https://github.com/openAMRobot/openamr-platform-hw)
- [机械 CAD 说明](https://github.com/openAMRobot/openamr-platform-hw/tree/main/mechanical/cad)
- [机械装配说明](https://github.com/openAMRobot/openamr-platform-hw/tree/main/manufacturing/assembly)
- [机械 BOM](https://github.com/openAMRobot/openamr-platform-hw/blob/main/manufacturing/bom/mechanical-bom.md)
- [电气接线与轮组控制](https://github.com/openAMRobot/openamr-platform-hw/blob/main/electrical/wiring/wiring-pinout.md)
