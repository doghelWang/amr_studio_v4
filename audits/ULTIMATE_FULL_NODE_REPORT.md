# AMR Studio V4 物理级节点对标审计报告 (String-based)

> 本报告通过物理扫描二进制流中的标识符节点，确证标准模型与生成模型的逻辑交集。

| 标识符节点 (String Node) | 标准样本 (312) | 您的生成物 | 对齐状态 |
| :--- | :--- | :--- | :--- |
| `ChassisSys` | ✅ Present | ✅ Present | ✅ Match |
| `Uuid` | ✅ Present | ✅ Present | ✅ Match |
| `chassis` | ✅ Present | ✅ Present | ✅ Match |
| `chassis_diff` | ✅ Present | ✅ Present | ✅ Match |
| `headOffset` | ✅ Present | ✅ Present | ✅ Match |
| `locCoordPITCH` | ✅ Present | ✅ Present | ✅ Match |
| `locCoordROLL` | ✅ Present | ✅ Present | ✅ Match |
| `locCoordX` | ✅ Present | ✅ Present | ✅ Match |
| `locCoordY` | ✅ Present | ✅ Present | ✅ Match |
| `locCoordYAW` | ✅ Present | ✅ Present | ✅ Match |
| `locCoordZ` | ✅ Present | ✅ Present | ✅ Match |
| `main_module_type` | ✅ Present | ✅ Present | ✅ Match |
| `module_desc` | ✅ Present | ✅ Present | ✅ Match |
| `module_name` | ✅ Present | ✅ Present | ✅ Match |
| `module_uuid` | ✅ Present | ✅ Present | ✅ Match |
| `parentNodeUuid` | ✅ Present | ✅ Present | ✅ Match |
| `root` | ❌ Absent | ✅ Present | ➕ New Addition |
| `sub_sys_type` | ✅ Present | ✅ Present | ✅ Match |