# Multi-CModel Frontend Roundtrip Verification

Date: 2026-07-12

## Scope

Run multiple `.cmodel` files through the real frontend reconstruction path:

```text
cmodel upload -> Worker protobuf parse -> frontend module state -> init-sandbox -> Worker module/group composition -> UI export -> protobuf decode comparison
```

This report specifically verifies that export is not simply reusing the uploaded archive or cached decoded tree. The frontend state must carry raw component/group data and the Worker must rebuild the output from that frontend config.

## Samples

| Model | Source Components | Frontend Components | Exported Components | Raw Components In UI | Raw Groups In UI | Result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `/Users/wangfeifei/Downloads/0323.cmodel` | 20 | 20 | 20 | 20 | 19 | PASS |
| `/Users/wangfeifei/Downloads/1234.cmodel` | 20 | 20 | 20 | 20 | 19 | PASS |
| `/Users/wangfeifei/Downloads/测试车模型(1).cmodel` | 17 | 17 | 17 | 17 | 16 | PASS |
| `/Users/wangfeifei/Downloads/AOBO.cmodel555.cmodel` | 44 | 44 | 44 | 44 | 43 | PASS |

## Semantic Comparison

| Model | `CompDesc.model` | `AbiSet.model` | `FuncDesc.model` | Console Errors | Decoration Failures |
| --- | --- | --- | --- | ---: | ---: |
| `0323.cmodel` | PASS | PASS | PASS | 0 | 0 |
| `1234.cmodel` | PASS | PASS | PASS | 0 | 0 |
| `测试车模型(1).cmodel` | PASS | PASS | PASS | 0 | 0 |
| `AOBO.cmodel555.cmodel` | PASS | PASS | PASS | 0 | 0 |

## 0323.cmodel Details

`0323.cmodel` was explicitly included because it previously reproduced the browser console path with wheel trace logs.

Observed frontend import state:

- `projectId`: `import_0323_3bd77cf4`
- `driveType`: `STANDARD_DIFF`
- Source/frontend/exported component count: `20 / 20 / 20`
- Raw frontend component nodes: `20 / 20`
- Raw frontend module groups: `19`
- `rawAbiSet`: present
- `rawFuncDesc`: present
- Console errors: `0`
- Decoration failures: `0`

Representative imported components:

| Name | Alias | Category | Type | Interfaces |
| --- | --- | --- | --- | ---: |
| `chassis_diff` | `通用差速底盘` | `CHASSIS` | `diffChassis` | 0 |
| `diffWheel-lft` | `通用差速轮` | `DRIVEWHEEL` | `diffWheel` | 0 |
| `diffWheel-right` | `通用差速轮` | `DRIVEWHEEL` | `diffWheel` | 0 |
| `driver-left` | `步科` | `DRIVER` | `subDriver` | 16 |
| `driver-right` | `步科` | `DRIVER` | `subDriver` | 16 |
| `driver-lift` | `步科` | `DRIVER` | `subDriver` | 16 |
| `motor-left` | `步科电机` | `DRIVER` | `PMSMMotor` | 4 |
| `motor-right` | `步科电机` | `DRIVER` | `PMSMMotor` | 4 |

The frontend logs showed:

```text
[Trace] Wheel: 通用差速轮 (left_group)
[Trace] Wheel: 通用差速轮 (right_group)
[DEBUG] 2. Imported project: using frontend raw AbiSet model
[DEBUG] 3. Imported project: composing chassis from frontend raw module model
[DEBUG] 4. Imported project: composing components from frontend raw module model
```

No `Invalid entity`, `Decoration failed`, `Build Error`, or HTTP 500 occurred.

## Artifacts

Full machine-readable summaries and UI-exported `.cmodel` files are stored under:

```text
artifacts/multi_cmodel_validation_20260712/
```

Important files:

```text
artifacts/multi_cmodel_validation_20260712/multi-validation.summary.json
artifacts/multi_cmodel_validation_20260712/1_0323.cmodel.summary.json
artifacts/multi_cmodel_validation_20260712/2_1234.cmodel.summary.json
artifacts/multi_cmodel_validation_20260712/3__1_.cmodel.summary.json
artifacts/multi_cmodel_validation_20260712/4_AOBO.cmodel555.cmodel.summary.json
```

Temporary Cloudflare KV sandbox/artifact keys created during validation were deleted after the test.

## Conclusion

The validated models, including `0323.cmodel`, pass the required frontend reconstruction path. For each sample, the UI-imported module state retained raw protobuf component/group payloads, the Worker rebuilt the model from that frontend state, and decoded exported `CompDesc`, `AbiSet`, and `FuncDesc` were semantically equal to the source.
