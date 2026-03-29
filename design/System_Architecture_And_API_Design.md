# AMR Studio V4 核心架构与 API 通信协议设计文档

## 一、 模型文件体系特征深度解析
根据底层的深度解剖，整个 AMR 建模链路包含三种形态的文件生态，具有以下鲜明特点和构成：

### 1. `.cmodel` 文件 (AMR 工业级二进制归档包)
- **核心特点**：工业级标准发布格式。它是前端配置完成后的最终“封存态”，具备防篡改性、强压缩比和极高的分发效率，供下位机 (MCU/ROS) 启动时直接加载。
- **物理构成**：本质为一个 **ZIP 格式规范的压缩包**。它不仅包含了定义机器人的全部参数模型，还可容纳如 CAD 3D 渲染索引、数字签名证书等物料。

### 2. `.model` 文件 (Protobuf 紧凑字节码流)
- **核心特点**：处于压缩包内部，是数据存储的实质载体。采用 Google Protocol Buffers 3 进行极致二进制序列化，具有解析极速、体积微小（体积缩减约 60%）、强数据格式校验（禁止错乱的 String 传给 Float）等优点。一旦字段非法或错位将抛出 Decode Error。
- **物理构成**：完全是机器不可读的十六进制字节流。常见的模型包含：
  - `CompDesc.model`: 记录车体长宽、电机功率极值、所有传感器挂载引脚的整车物理蓝图。
  - `AbiSet.model`: 记录软硬件底座能力集。
  - `FuncDesc.model`: 记录逻辑层面调用的上层业务功能表。

### 3. `.json` 文件 (微服务间及前端可读领域模型)
- **核心特点**：由 `.model` 通过 Schema 逆向反弹生成的高可读文本形态结构。这是前后端“握手”与“修改”的唯一渠道载体。
- **物理构成**：由极致深度的字典嵌套构成。提取其骨架包括：
  - `general_attr`：记录硬件 UUID、名称、三维边界等只读元数据。
  - `private_attr`：包含多组针对电机加减速、激光雷达测距精度的枚举与浮点参数（包含上下限极值限定）。
  - `interface_params` / `interface_ability`：刻画了下位机硬件拓扑树结构，指明了总线关系（比如 CAN_1 节点下挂载了哪些传感器）。

---

## 二、 后端核心实现流程与微服务编排 (Backend Implementation Flow)

为了支撑前端在极低延迟下加载上百个节点的 3D 模型拓扑，后端摒弃了“单开单存大文件”的做法，转为 **“提取-碎片化存储-组装”** 的块操作模型：

### 核心流转机制 (Workflow)
1. **模型破译与上云 (Import & Splittng)**
   - 用户通过门户上传 `.cmodel` 固件。后端保存至临时隔离沙箱存储 `<temp_sandbox>/`。
   - 微服务容器挂载 `cmodel_decoder`，利用预构筑的 pb2 绑定规则直接解出原始 `CompDesc.json`（内存级别流转，不落盘减速）。
   - 管道随即流入 `model_splitter`，以后端并行协程切离出数百个单模块 JSON（`module_{name}_{uuid}.json`），并生成唯一的拓扑地图 `blueprint_CompDesc.json`。
   - 所有独立的 JSON 切片存储至缓存数据库 (如 Redis JSON) 或敏捷的分布式块存储介质中。
2. **读写差分引擎 (Delta R/W Engine)**
   - 当前端请求某个轮胎 (`diffWheel`) 的配置时，后端根据前端传入的 `uuid` 直接从块存储中极速下发该原子的 JSON 给前端。
   - 前端若修改了车体轮距 `wheelSpace`，则发起 PATCH 请求。后端**仅针对该 UUID 产生的原子 JSON 进行局部覆写**。极大降低并发覆写导致的脏数据（Dirty Write）。
3. **编译与封包下发 (Compile & Packager)**
   - 确认修改后，后端触发流水线。首先通过内存拼接技术（参考前序 `cmodel_encoder` 逻辑），按图索骥 (Blueprint) 读取所有原子块，在内存中拼凑成全量 JSON 树。
   - 调用 `google.protobuf.json_format.ParseDict` 原生接口灌注给 Protobuf Message。由于 Schema 的强校验，如有越界、非法类型将拦截并抛出对应的 HTTP 400 Bad Request 以及具体的出错 `node_path` 给前端。
   - 校验通过后调用 `.SerializeToString()` 序列化为 `.model`，无缝打包装箱并提供下载链接。

---

## 三、 前后端 RESTful API 接口协议设计 (Contract & Protocol)

协议遵循严谨的 RESTful 标准。前后端通讯**统一以 JSON application/json 为传输格式**。

### 1. 模型上传与解码接口
*   **Endpoint**: `POST /api/v1/models/upload`
*   **Description**: 接收 cmodel 二进制文件格式，后端解析并返回模型空间唯一标识与顶层蓝图信息。
*   **Request**: `multipart/form-data` (file: `modelset312.cmodel`)
*   **Response (200 OK)**:
```json
{
  "project_id": "amr_proj_8a1f33be",
  "BlueprintMap": {
    "module_group_name": "ROBOT_CAR",
    "more_module_info": [
      {
         "group_id": "chassis_diff",
         "refs": [ "module_chassis_diff_xxx_uuid" ]
      }
    ]
  },
  "status": "decoded_and_split_success"
}
```

### 2. 获取单一组件属性数据
*   **Endpoint**: `GET /api/v1/models/{project_id}/components/{module_uuid}`
*   **Description**: 获取拆分后的某个具体原子模块全部属性规范。
*   **Response (200 OK)**:
```json
{
  "general_attr": { ... },
  "private_attr": {
      "private_attrs": [
          {
              "key": "Kinematics",
              "array_base_ele": [
                  { "key": "wheelSpace", "float_value": 0.45, "float_maxvalue": 1.5 }
              ]
          }
      ]
  },
  "interface_params": { ... }
}
```

### 3. 保存/更新单一实体组件 (差分更新)
*   **Endpoint**: `PATCH /api/v1/models/{project_id}/components/{module_uuid}`
*   **Description**: 前端修改表单后，将更新后的单一组件 JSON payload 覆盖提交，后端负责原子存储。
*   **Request Body**:
```json
{ "private_attr": { "private_attrs": [ { "key": "Kinematics", "array_base_ele": [ {"key": "wheelSpace", "float_value": 0.50} ] } ] } }
```

### 4. 拓扑级联挂载 (连线机制)
*   **Endpoint**: `POST /api/v1/models/{project_id}/topology/connect`
*   **Description**: 前端由画布上拖拽连线（例如将传感器连到主板 CAN 接口）。
*   **Request Body**:
```json
{
   "source_uuid": "main_mcu_uuid",
   "source_port": "CAN_1",
   "target_uuid": "laser_front_uuid",
   "target_port": "CAN_IN"
}
```

### 5. 即时编译与模型下载导出
*   **Endpoint**: `POST /api/v1/models/{project_id}/compile`
*   **Description**: 通知后端将所有模块通过 blueprint 进行重新聚合与序列化编码校验。
*   **Response (200 OK)**:
```json
{ "status": "success", "download_url": "https://<server>/downloads/build_ModelSet312_v2.cmodel" }
```
*(If Validation Failed - 400 Bad Request)*:
```json
{ "error": "VALIDATION_FAILED", "detail": "Value 0.5 for wheelSpace exceeds float_maxvalue 0.45 in module <chassis_diff>" }
```
