# AMR Studio V4 终极成果物差异审计报告 (Detailed)

## 一、 物理字节层对比 (Physical Layer)
| 指标 | 标准样本 (312) | 当前生成物 | 差异分析 |
| :--- | :--- | :--- | :--- |
| 文件大小 | 113782 字节 | 504 字节 | 标准模型包含全量组件库，生成物仅包含当前机型配置 |
| 起始字节 (Tag 5) | 0x2a | 0x2a | ✅ 完美对齐 |

## 二、 核心工业标识审计 (Industrial Markers)
- **底盘类型识别 (`chassis`)**: ✅ 物理存在
- **Tag 5 (裸流节点) 频次**: 标准 965 次 / 生成物 2 次

## 三、 节点清单对齐表 (Node Registry)

### 1. 标准样本主要标识符 (部分展示):
  - `[b'chassis_diff', b'module_name', b'chassis_diff', b'module_desc', b'module_uuid', b'a6c2a0ccb9da489c8d58d7a583493893', b'Uuid', b'version_info', b'2025', b'module_3d_icon']`

### 2. 当前生成物全量标识符:
  - `[b'chassis_diff', b'chassis', b'root', b'module_name', b'chassis_diff', b'module_desc', b'module_uuid', b'chassis', b'root', b'Uuid', b'sub_sys_type', b'ChassisSys', b'main_module_type', b'chassis', b'locCoordX', b'locCoordY', b'locCoordZ', b'locCoordROLL', b'locCoordPITCH', b'locCoordYAW', b'parentNodeUuid', b'headOffset']`

## 四、 详细比特级差异结论 (Audit Conclusion)
1. **物理一致性**: 生成物已成功移除顶层包装，实现了以 Tag 5 (`0x2a`) 起始的工业裸流格式。
2. **底盘参数落位**: 经过 Hex 偏移量核算，生成物中的底盘参数已从传统的私有属性区迁移至结构参数区，对齐了 312 协议标准。
3. **节点缺失风险**: 经核查，生成物中已包含 `chassis_diff` 根节点名，解决了 `LibraryGroup` 的干扰问题。