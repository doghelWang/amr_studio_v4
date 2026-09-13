# Creo 4.0 AMR 模型语义采集插件方案

## 1. 目标和基本原则

目标是在 Creo Parametric 4.0 中完成 AMR 的机械设计、模块安装和关键点位定义，由 Creo 插件读取以下信息并转换为 AMR 中间模型：

1. 模块分类。
2. 模块唯一标识和名称。
3. 模块安装位置、姿态和坐标系。
4. 模块之间的组成、控制、反馈、电气或功能关联。
5. 模块端口/关键点之间的距离和方向信息。

核心原则：

- 几何邻近不等于软件关联；必须显式标注关系。
- 文件名不等于模块类型；必须使用受控参数。
- 普通零件、螺钉、垫片、线束零件不应被猜测成软件模块。
- 安装位置必须以装配路径、坐标系和变换矩阵为准，不能只保存手工输入的 XYZ。
- 所有采集结果必须保留来源：Creo 模型名、组件路径、参数名、Datum 名称、版本和采集时间。
- 规则中没有定义的内容只能输出为 `unknown`/`unresolved`，不能由插件补造。

Creo TOOLKIT 是 PTC 的受控数据库访问接口。Creo 4.0 的官方入门资料明确支持使用 C/C++ 编写 TOOLKIT 应用；部署时应以本机 Creo 4.0 安装目录中的 headers、libraries 和 sample 为准，而不是使用其他 Creo 版本的头文件混编。[Creo 4 TOOLKIT Getting Started](https://support.ptc.com/WCMS/files/172149/en/creo4_m010_Toolkit_GSG.pdf)

## 2. 推荐的 Creo 设计组织

### 2.1 顶层装配结构

建议设计人员按以下方式组织顶层装配，名称是本方案定义的命名约定，不是 Creo 内置名称：

```text
AMR_<项目号>.asm
├── AMR_CHASSIS.asm                 # 底盘和轮组
├── AMR_POWER.asm                   # 电池、电源、充电
├── AMR_CONTROL.asm                 # 主控、安全控制器、IO
├── AMR_PERCEPTION.asm              # 激光、双目、TOF、IMU
├── AMR_HMI.asm                     # 按钮、灯、屏、扬声器
├── AMR_ACTUATOR.asm                # 举升、夹具、旋转、平移
└── AMR_META.asm                    # 非物理语义记录，不进入 BOM
```

这只是组织建议。插件不能因为出现这些名称就自动判定模块；真正的判定依据是模块参数和合法的 `AMR_META` 记录。

### 2.2 模块模型的必填参数

每一个需要进入 AMR 软件模型的 part 或 subassembly，在其模型级 Parameters 中填写下表参数：

| 参数 | 类型 | 示例 | 结果含义 |
|---|---|---|---|
| `AMR_EXPORT_KIND` | String/枚举 | `MODULE` | `MODULE` 表示导出为软件模块 |
| `AMR_MODULE_ID` | String | `LIDAR_FRONT_01` | 项目内稳定唯一 ID |
| `AMR_MODULE_TYPE` | String/枚举 | `sensor.laser` | 必须来自项目批准的模块类型字典 |
| `AMR_MODULE_NAME` | String | `前置导航激光` | 面向人员的名称 |
| `AMR_MODULE_SOURCE` | String | `SICK-LS-MID-360` | 来源/型号；若未确认则留空或 `unknown` |
| `AMR_INSTALL_CSYS` | String | `AMR_MOUNT_CSYS` | 模块安装参考坐标系名称 |
| `AMR_REVISION` | String | `A.03` | 设计版本 |
| `AMR_DESCRIPTION` | String | 设计人员填写 | 描述，不能由插件猜测 |

如果模块不进入软件模型：

| 参数 | 值 | 结果 |
|---|---|---|
| `AMR_EXPORT_KIND` | `IGNORE` | 明确忽略，例如螺钉、垫片、装饰件 |
| `AMR_EXPORT_KIND` | `METADATA` | 只作为关系、点位或标注记录，不作为物理模块 |

插件必须拒绝空的 `AMR_MODULE_ID`、重复 ID、未知 `AMR_MODULE_TYPE` 和非法 `AMR_EXPORT_KIND`，不能根据模型名自动补齐。

### 2.3 安装位置和姿态

设计人员在每个软件模块模型内部创建一个安装坐标系：

```text
AMR_MOUNT_CSYS
```

约定：

- 原点：模块安装基准点。
- X/Y/Z 方向：由项目坐标系规范定义；插件只读取，不自行改变轴方向。
- 坐标系名称必须唯一。
- 安装坐标系应位于模块模型内部，而不是只在顶层装配中创建一个无法跟随模块的临时坐标系。
- 如果模块存在接口或测量点，使用同一模块坐标系作为局部参考。

设计人员将模块装配到顶层装配后，插件通过组件路径和安装坐标系的变换计算其在整车坐标系中的位置和姿态。

输出示例：

```json
{
  "moduleId": "LIDAR_FRONT_01",
  "install": {
    "assemblyPath": ["AMR_PERCEPTION", "LS-MID_360_01"],
    "csys": "AMR_MOUNT_CSYS",
    "positionMm": {"x": 820.0, "y": 0.0, "z": 430.0},
    "rotation": {"matrix": [[1,0,0],[0,1,0],[0,0,1]]},
    "source": "Creo component path + AMR_MOUNT_CSYS"
  }
}
```

示例中的数值只说明输出结构，不代表任何实际项目参数；插件不得产生示例数值。

## 3. 关系设计

### 3.1 关系不能只依赖装配约束

Creo 装配约束可以证明机械放置关系，但不能证明：

- 激光连接到哪个控制器。
- 编码器反馈哪个电机或轮组。
- 急停按钮进入哪个安全 IO。
- 双目输出由哪个处理器消费。

因此建议增加 `AMR_META.asm`，其内容为轻量关系记录，不参与物理 BOM。每条关系使用一个独立的 metadata component，避免把多条关系压缩到一个不可校验的长字符串中。

### 3.2 关系记录组件

关系组件的模型级参数建议如下：

| 参数 | 示例 | 含义 |
|---|---|---|
| `AMR_EXPORT_KIND` | `METADATA` | 不是物理模块 |
| `AMR_META_KIND` | `RELATION` | 关系记录 |
| `AMR_RELATION_ID` | `REL_LIDAR_CPU_01` | 关系唯一 ID |
| `AMR_RELATION_TYPE` | `DATA` | `COMPOSITION`、`CONTROL`、`FEEDBACK`、`ELECTRICAL`、`DATA` 等受控值 |
| `AMR_SOURCE_MODULE_ID` | `LIDAR_FRONT_01` | 源模块 |
| `AMR_SOURCE_PORT` | `ETH_OUT` | 源端口/能力 |
| `AMR_TARGET_MODULE_ID` | `MAIN_CPU_01` | 目标模块 |
| `AMR_TARGET_PORT` | `ETH_02` | 目标端口/能力 |
| `AMR_RELATION_DESC` | 设计人员填写 | 关系说明 |

插件只允许关系引用已经存在且 `AMR_EXPORT_KIND=MODULE` 的模块 ID；不存在的引用输出错误，不能自动创建模块。

### 3.3 关系操作示例

设计人员配置前置激光和主控：

1. 在激光模型中创建 `AMR_PORT_ETH_OUT` 坐标系或 Datum Point，并填写端口参数。
2. 在主控模型中创建 `AMR_PORT_ETH_02` 坐标系或 Datum Point。
3. 将激光实例标记为 `MODULE`，ID 为 `LIDAR_FRONT_01`，类型为已批准的激光类型。
4. 将主控实例标记为 `MODULE`，ID 为 `MAIN_CPU_01`。
5. 在 `AMR_META.asm` 中放置一个关系记录组件，填写：

```text
AMR_RELATION_TYPE=ELECTRICAL
AMR_SOURCE_MODULE_ID=LIDAR_FRONT_01
AMR_SOURCE_PORT=ETH_OUT
AMR_TARGET_MODULE_ID=MAIN_CPU_01
AMR_TARGET_PORT=ETH_02
```

6. 插件检查两端模块、端口和接口类型，再输出关系；它不会因为两者距离很近就自动生成连接。

## 4. 特定点位和距离信息

### 4.1 点位类型

设计人员只为业务需要的点创建命名 Datum Point 或 Coordinate System：

```text
AMR_POINT_WHEEL_CENTER
AMR_POINT_SENSOR_ORIGIN
AMR_POINT_CONNECTOR
AMR_POINT_CLEARANCE_REF
AMR_POINT_CHARGE_CONTACT
```

点位名称和点位用途必须来自项目字典。没有字典定义的点位输出为未识别点，不进入正式 cmodel。

点位属性建议：

| 参数 | 示例 |
|---|---|
| `AMR_POINT_ID` | `LIDAR_FRONT_ORIGIN` |
| `AMR_POINT_KIND` | `SENSOR_ORIGIN` |
| `AMR_OWNER_MODULE_ID` | `LIDAR_FRONT_01` |
| `AMR_POINT_DESC` | 设计人员填写 |

### 4.2 距离记录

距离必须由设计人员明确指定两端点和测量语义。建议关系记录支持：

```text
AMR_META_KIND=DISTANCE
AMR_DISTANCE_ID=DIST_SENSOR_TO_AXIS_01
AMR_SOURCE_MODULE_ID=LIDAR_FRONT_01
AMR_SOURCE_POINT_ID=LIDAR_FRONT_ORIGIN
AMR_TARGET_MODULE_ID=CHASSIS_01
AMR_TARGET_POINT_ID=BASE_ORIGIN
AMR_DISTANCE_MODE=EUCLIDEAN
AMR_DISTANCE_UNIT=mm
```

`EUCLIDEAN` 表示三维直线距离；若需要 `DX/DY/DZ` 或沿某根轴的投影，必须由设计规范明确定义，插件不能根据点位名称猜测。

输出结果应同时保留：端点坐标、计算值、单位、测量模式、坐标系、Creo 组件路径和误差/状态。

### 4.3 为什么不直接读取所有 Creo 尺寸

Creo 模型中可能存在设计尺寸、草绘尺寸、参考尺寸、工程图尺寸和制造尺寸。它们的存在不代表是 AMR 软件需要的距离。插件只读取：

- 被明确命名并纳入 AMR 点位字典的点。
- 被明确声明为 `DISTANCE` 的关系记录。
- 或由用户在插件界面中选择两端点后确认生成的测量记录。

## 5. 插件架构

```text
Creo TOOLKIT DLL
├── SessionAdapter          # 当前模型、菜单、交互选择
├── AssemblyWalker          # 递归遍历组件和组件路径
├── ParameterReader         # 读取模型级/特征级参数
├── GeometryResolver        # 解析 Datum Point/Csys 和坐标变换
├── MetadataReader          # 读取 AMR_META 关系记录
├── InclusionFilter         # 排除无效和不导出对象
├── SemanticValidator        # ID、类型、端口、引用、单位、闭合关系
├── DistanceEvaluator        # 点位距离、投影距离、测量来源
├── IntermediateWriter       # 输出 JSON/CSV/审计报告
└── CmodelExporter          # 后续对接现有 protobuf/cmodel 生成链
```

推荐先输出中间 JSON 和审计报告，再接入 cmodel 生成器。这样可以在不经过前端的情况下检查 Creo 采集是否正确。

## 6. Creo TOOLKIT C 示例骨架

下面代码是基于 Creo TOOLKIT 官方函数名称的采集骨架，展示关键调用关系；应使用 Creo 4.0 本机 SDK 头文件和示例工程完成最终编译校准，不能把后续版本头文件直接复制到 Creo 4.0 工程中。

### 6.1 注册入口和当前模型

```c
#include "ProToolkit.h"
#include "ProMdl.h"
#include "ProSolid.h"
#include "ProFeature.h"
#include "ProAsmcomp.h"
#include "ProAsmcomppath.h"

extern "C" int user_initialize(void)
{
    /* 注册菜单命令、初始化日志和插件状态。 */
    return 0;
}

static ProError collect_current_model(void)
{
    ProMdl model = NULL;
    ProError err = ProMdlCurrentGet(&model);
    if (err != PRO_TK_NO_ERROR || model == NULL)
        return err;

    ProMdlType model_type;
    err = ProMdlTypeGet(model, &model_type);
    if (err != PRO_TK_NO_ERROR || model_type != PRO_MDL_ASSEMBLY)
        return PRO_TK_BAD_CONTEXT;

    return ProSolidFeatVisit(
        (ProSolid)model,
        component_visit,
        NULL,
        NULL);
}
```

`ProSolidFeatVisit()` 会访问 solid 中的 feature；装配组件也是 feature，插件使用 `ProFeatureTypeGet()` 过滤出 `PRO_FEAT_COMPONENT`。这是 PTC 官方说明的装配遍历方式。[Visiting Assembly Components](https://support.ptc.com/help/creo_toolkit/protoolkit_pma/r12/french/creo_toolkit/user_guide/Visiting_Assembly_Components.html)

### 6.2 识别组件、读取模型和参数

```c
static int read_string_param(ProMdl model,
                             const char *name,
                             wchar_t *out,
                             size_t out_count);

static ProError component_visit(ProFeature *feature, ProAppData app_data)
{
    ProFeattype feature_type;
    ProError err = ProFeatureTypeGet(feature, &feature_type);
    if (err != PRO_TK_NO_ERROR || feature_type != PRO_FEAT_COMPONENT)
        return PRO_TK_NO_ERROR;

    ProAsmcomp *component = (ProAsmcomp *)feature;
    ProMdl child = NULL;
    err = ProAsmcompMdlGet(component, &child);

    /* 缺失或未载入的组件不能猜测类型，记录 unresolved 后继续。 */
    if (err != PRO_TK_NO_ERROR || child == NULL)
        return PRO_TK_NO_ERROR;

    wchar_t export_kind[64] = {0};
    wchar_t module_id[128] = {0};
    wchar_t module_type[128] = {0};

    read_string_param(child, "AMR_EXPORT_KIND", export_kind, 64);
    read_string_param(child, "AMR_MODULE_ID", module_id, 128);
    read_string_param(child, "AMR_MODULE_TYPE", module_type, 128);

    if (wcscmp(export_kind, L"MODULE") == 0) {
        /* 进入候选模块表，后续读取安装坐标系和实例路径。 */
        collect_module_metadata(child, module_id, module_type);
    } else if (wcscmp(export_kind, L"METADATA") == 0) {
        collect_metadata_component(child);
    }

    /* 对子装配递归访问；具体递归实现必须维护完整 component path。 */
    ProMdlType child_type;
    if (ProMdlTypeGet(child, &child_type) == PRO_TK_NO_ERROR &&
        child_type == PRO_MDL_ASSEMBLY) {
        ProSolidFeatVisit((ProSolid)child, component_visit, NULL, app_data);
    }

    return PRO_TK_NO_ERROR;
}
```

参数读取应通过 `ProModelitem`/`ProParameter`/`ProParameterValueWithUnitsGet()` 完成，并保留单位和原始值。PTC 文档说明参数可以属于模型或模型项，参数值可带单位读取。[ProParameter](https://support.ptc.com/help/creo_toolkit/protoolkit_pma/r12/usascii/creo_toolkit/api/dita/ProParameter.html)、[Accessing Parameters](https://support.ptc.com/help/creo_toolkit/protoolkit_plus/usascii/creo_toolkit/user_guide/Accessing_Parameters.html)

### 6.3 读取安装变换

插件必须维护从顶层装配到当前组件的 `ProAsmcomppath`。对组件路径调用 `ProAsmcomppathTrfGet()`，以 `PRO_B_TRUE` 获取从成员到装配的变换，再将模块内部 `AMR_MOUNT_CSYS` 的原点和轴转换到整车坐标系。

```c
static ProError resolve_mount_transform(ProAssembly root,
                                        ProIdTable member_ids,
                                        int member_count,
                                        ProMatrix out_transform)
{
    ProAsmcomppath path;
    ProError err = ProAsmcomppathInit(
        (ProSolid)root, member_ids, member_count, &path);
    if (err != PRO_TK_NO_ERROR)
        return err;

    return ProAsmcomppathTrfGet(
        &path,
        PRO_B_TRUE,
        out_transform);
}
```

PTC 文档说明 `ProAsmcomppathTrfGet()` 用于获取组件路径下成员和父装配之间的坐标变换；`ProAsmcomppathInit()` 使用顶层装配和成员 ID 表建立路径。[Coordinate Transform](https://support.ptc.com/help/creo_toolkit/protoolkit_pma/r12/portuguese_br/creo_toolkit/207.html)、[ProAsmcomppathInit](https://support.ptc.com/help/creo_toolkit/protoolkit_pma/r12/russian/creo_toolkit/api/dita/206.html)

### 6.4 计算两个特定点的距离

如果两端点可以构造成 `ProSelection`，可以使用：

```c
double distance = 0.0;
ProError err = ProGeomitemDistanceEval(
    selection_a,
    selection_b,
    &distance);
```

`ProGeomitemDistanceEval()` 用两个 `ProSelection` 计算点、轴或平面等几何项距离；跨子装配时必须把组件路径包含在 selection 中。[ProGeomitemDistanceEval](https://support.ptc.com/help/creo_toolkit/protoolkit_pma/r12/portuguese_br/creo_toolkit/1556.html)

如果需要返回两端最近点，也可使用 `ProSelectionWithOptionsDistanceEval()`。对 AMR 关键点，建议优先读取已定义 Datum Point 的坐标并在统一整车坐标系中计算，避免把“最近距离”误当成“设计基准点距离”。

## 7. 无效信息清除策略

### 7.1 过滤优先级

按以下顺序处理，任何一层不通过都不能进入正式模块结果：

1. **导出策略过滤**：`AMR_EXPORT_KIND` 不是 `MODULE` 的对象不作为模块。
2. **对象类型过滤**：排除 Creo 内部 feature、构造几何、草绘、复制几何、隐藏辅助项等非组件对象。
3. **装配状态过滤**：排除 suppressed、failed、unresolved、missing、未放置组件，并在报告中保留原因。
4. **模块完整性过滤**：缺少 ID、类型、安装坐标系或重复 ID 的对象进入 `invalid_modules`，不能静默丢弃。
5. **语义字典过滤**：类型、端口、关系类型不在批准字典中的对象标记 `unknown`，不能按名称相似度匹配。
6. **关系闭合过滤**：关系两端模块和端口必须存在；否则关系进入错误清单。
7. **几何有效性过滤**：点位必须存在且坐标可计算；距离必须有明确端点和单位。

### 7.2 螺钉等纯物理件的处理

推荐在 Creo 中显式填写：

```text
AMR_EXPORT_KIND=IGNORE
AMR_IGNORE_REASON=FASTENER
```

插件可以提供候选提示，但不能自动把名称包含 `SCREW`、`BOLT`、`NUT` 的零件当成无效件，因为真实设备可能存在名称不规范、供应商型号不同或具有软件意义的特殊组件。自动规则只用于发现候选，不用于无确认导出。

### 7.3 BOM、层、简化表示不能作为唯一依据

不建议仅依据“是否出现在 BOM”“是否隐藏”“是否在某个 layer”来判断软件模块。一个模块可能被隐藏但仍需要导出，一个螺钉可能在 BOM 中但不应进入软件模型。BOM/层/简化表示只作为辅助证据，最终以 `AMR_EXPORT_KIND` 和合法语义参数为准。

## 8. 输出数据结构

插件第一阶段输出 `amr_creo_intermediate.json`：

```json
{
  "schemaVersion": "amr-creo-intermediate-v1",
  "source": {
    "modelName": "AMR_PROJECT.asm",
    "creoMajorVersion": "4",
    "assemblyRevision": "A.03"
  },
  "modules": [],
  "relations": [],
  "points": [],
  "distances": [],
  "invalidModules": [],
  "unresolvedReferences": [],
  "warnings": []
}
```

第二阶段再将中间模型映射到现有 AMR Studio 的模块结构和 protobuf/cmodel。这样可以单独验证：

- Creo 采集是否完整。
- 前端构建是否丢失属性。
- cmodel 生成是否改变关系或坐标。

## 9. 设计人员操作规范

### 新增激光模块

1. 使用统一的激光零件/子装配模板。
2. 填写 `AMR_EXPORT_KIND=MODULE`、唯一模块 ID、批准的模块类型和型号来源。
3. 创建并校正 `AMR_MOUNT_CSYS`。
4. 创建 `AMR_PORT_ETH_OUT`、`AMR_PORT_POWER` 或项目字典定义的端口点。
5. 将模块装入 `AMR_PERCEPTION.asm`。
6. 在 `AMR_META.asm` 中创建与主控/IO 的关系记录。
7. 运行插件“预检查”，修复重复 ID、未知类型、未放置、端口不存在等错误。

### 新增急停按钮

1. 使用 `BTN-Emergency` 设计模板。
2. 标记为 `MODULE`，填写唯一 ID 和实际安装坐标系。
3. 标注安全输入端口和复位/停止功能关系。
4. 在 `AMR_META.asm` 中建立到安全 IO/安全控制器的 `ELECTRICAL` 和 `FUNCTION` 关系。
5. 插件检查安全链是否闭合；只有几何安装而没有功能关系时，输出 P0 错误。

### 新增双目相机

1. 标记为 `MODULE`，填写相机类别和来源。
2. 建立安装坐标系、光学原点、左/右相机或厂家定义的点位。
3. 记录处理器关系和标定状态；没有标定信息时不能输出“已标定”。
4. 建立到处理器/主控的接口和数据关系。
5. 插件输出设备、处理器、标定、坐标系和关系的闭合状态。

## 10. 开发阶段和验收标准

### 阶段一：只读扫描

- 读取当前装配。
- 输出全部组件、模型名、路径、状态和参数。
- 不写回 Creo，不生成 cmodel。

### 阶段二：模块和安装位置

- 支持 `AMR_EXPORT_KIND`、模块 ID/类型/名称。
- 支持安装坐标系和顶层坐标转换。
- 使用一个包含激光、按钮、双目、螺钉和子装配的测试装配验证。

### 阶段三：关系和距离

- 支持 metadata relation component。
- 支持端口、关键点、距离模式和单位。
- 输出关系闭合审计和无效引用报告。

### 阶段四：接入 AMR Studio

- 中间 JSON 映射到现有模块模型。
- 经过解析-前端-构建-生成链路后做语义 round-trip 比对。
- 验收依据是模块、属性、关系、坐标、点位和距离语义一致，不是文件字节大小一致。

## 11. 主要风险

- Creo 4.0 API、编译器、位数和 Toolkit license 必须以实际安装环境为准。
- 组件路径必须完整维护；只保存组件模型名会导致同一零件多次实例无法区分。
- Datum/特征句柄可能随模型状态变化，导出结果应保存稳定的模型名、组件路径、特征 ID 和名称，而不是保存内存指针。
- 参数名称、枚举值和关系类型必须版本化；变更后需要迁移工具，不能静默兼容。
- 设计人员未填写的内容必须报告缺失，不允许插件根据邻近、命名或几何相似性创造软件语义。

## 12. 结论

最可落地的方案是：

1. 用模型级受控参数标识可导出的软件模块。
2. 用模块内部安装坐标系和端口/点位定义几何语义。
3. 用 `AMR_META` 轻量关系组件记录无法从机械装配约束推导的软件关系。
4. 用显式 `MODULE/IGNORE/METADATA` 策略排除螺钉等无效物理件。
5. 用 Creo TOOLKIT 读取装配组件、参数、组件路径、坐标变换和几何距离。
6. 先生成中间 JSON 和审计报告，再接入 cmodel 生成，确保每个信息都有来源和验证状态。
