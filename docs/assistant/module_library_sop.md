# AMR Studio V4 资源库维护与扩展指南

## 1. 资源库加载原理

AMR Studio V4 采用"动态扫描"机制加载硬件资源库。

### 📡 数据流向
1.  **后端扫描**: 每次调用资源接口时，后端会实时遍历本地磁盘目录。
2.  **API 接口**: `GET /api/v1/resources/modules` 返回按系统分类的 JSON 对象。
3.  **前端过滤**: `ComponentLibraryStep.tsx` 根据当前向导步骤（如：感知避障）的 `systems` 和 `categories` 配置，对后端返回的全量库进行二次智能过滤。

### 📁 核心目录结构
资源库的物理存放路径为：
`amr_studio_v4/docs/reference/ModuleLibrary/ModuleEntity/`

目录层级定义如下：
- `[SystemName]/` (如 `SensorSys`, `ControlSys`)：对应硬件所属的子系统。
- `Internal/`：固定存放目录下，后端仅扫描此文件夹。
- `*.json`：每个硬件模块对应一个 JSON 文件（基于 Protobuf 定义）。

## 2. 如何新增一个模块？

### 第一步：准备 JSON 定义
新模块的 JSON 文件必须符合 `CompDesc` 协议规范。核心字段包括：
- `moduleGroupName`: 模块显示的组名称。
- `moduleComponets`: 包含 `generalAttr`（基础属性）和 `privateAttr`（私有属性）。
- `mainModuleType`: 指明模块分类（如 `sensor`, `driver`, `ioModule`）。

### 第二步：放置文件
将准备好的 JSON 文件存放到对应的子系统目录下。
**示例：新增一个激光雷达**
路径：`docs/reference/ModuleLibrary/ModuleEntity/SensorSys/Internal/MyNewLaser.json`

### 第三步：验证加载
1. 刷新 AMR Studio V4 网页。
2. 进入向导第 3 步 "骨架装配"。
3. 选择对应的子系统（如 "感知避障"）。
4. 点击 "新增"，在弹出的资源库中即可搜索并看到新加入的模块。

## 3. 高级维护技巧

### 💡 自动分类逻辑
前端根据 `mainModuleType` 来决定模块出现在哪个步骤。如需调整，请在 JSON 中修改以下路径：
`moduleComponets[0].generalAttr.mainModuleType.comboType.typeKey`

### 🛠️ 属性即时生效
由于前端 `ComponentPropertyPanel` 优先从 Store 读取属性，如果您修改了 `Internal` 下的 JSON 文件中的默认值，新添加的组件将自动应用这些新默认值。

### ⚠️ 注意事项
- **文件名唯一性**: 后端以文件名为 ID，确保目录内无同名文件。
- **编码格式**: 务必使用 `UTF-8` 编码保存 JSON 源码，否则后台解析可能报错。
