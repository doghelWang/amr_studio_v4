# AOBO CModel Import/Export Roundtrip Verification

Date: 2026-07-12

## Scope

Validate `/Users/wangfeifei/Downloads/AOBO.cmodel555.cmodel` through:

- Worker protobuf import parsing.
- Frontend UI import and displayed project state.
- Frontend UI export download.
- Protobuf-level semantic comparison between source and exported `.cmodel`.

## Source File

```text
/Users/wangfeifei/Downloads/AOBO.cmodel555.cmodel
```

Source archive entries:

| Entry | Size | MD5 |
| --- | ---: | --- |
| `CompDesc.model` | 200593 | `9cf77faff81a7718a48aba350c6d0b61` |
| `AbiSet.model` | 13172 | `ca5cca7229e9efd601af396efb957a10` |
| `FuncDesc.model` | 1532 | `d695aba0290812d941646772b6523441` |
| `ModelFileDesc.json` | 552 | `fa252b98a53bc4eb952f81d47ea061e7` |

## Initial Finding

Direct Worker path passed:

```text
upload -> compile -> download -> protobuf decode
```

The direct Worker-exported file was semantically equal to the source for:

- `CompDesc.model`
- `AbiSet.model`
- `FuncDesc.model`

However, the frontend UI path initially failed semantic equality:

```text
UI upload -> frontend parsed editing state -> UI export -> protobuf decode
```

Observed issue before fix:

- Component count remained `44`, but `CompDesc.model` was rebuilt from the simplified frontend component model.
- Many `interfaceParams.interfaceGroup` arrays were dropped to `0`.
- Some subtype keys were generalized, for example `laser -> sensor`, `PMSMMotor -> driver`.
- Chassis `moduleName` changed from `chassis_steer` to frontend fallback `Imported_AMR`.
- `AbiSet.model` lost rich `customCombox`, `cloneEnable`, and related nested option metadata.

Root cause:

- `init-sandbox` overwrote imported protobuf JSON with frontend-generated `CompDesc`.
- The frontend export flow always synchronized abilities, chassis metadata, and all component positions, even for unmodified imported models.
- That transformed the model through a lossy editing representation instead of preserving imported protobuf as the source of truth.

## Fix

Worker:

- Added sandbox `sourceKind: "imported" | "frontend"`.
- `POST /api/v1/models/upload` marks uploaded `.cmodel` sandboxes as `imported`.
- Frontend import stores raw protobuf component/group data on each `ComponentConfig` as `rawCmodelComponent`, `rawModuleGroup`, `rawModuleGroupIndex`, and `rawComponentIndex`.
- `POST /api/v1/models/init-sandbox` rebuilds `CompDesc` from the frontend component list. For imported models it uses those frontend-carried raw module nodes and raw group indexes to re-compose the original module tree.
- `rawAbiSet` and `rawFuncDesc` are carried by the frontend config and used as the source for `AbiSet.model` and `FuncDesc.model`, while parsed `abilities`/`functionProcesses` remain the UI view model.
- The Worker no longer relies on the uploaded sandbox's cached `fullJson` to export unmodified imported models.

Frontend:

- Imported projects are detected by `projectId.startsWith("import_")`.
- For imported projects, UI export sends the parsed frontend config containing raw module/component nodes to `init-sandbox`, then Worker rebuilds the output from that frontend config.
- Success progress messages now use `console.log` instead of `console.error`.

Cloudflare deployment:

```text
Worker version: 2b0c27e6-c028-431c-b3cb-2895afbd332c
Route: https://cloud-ai.work/*
```

## Post-Fix UI Verification

Final UI import state after uploading `AOBO.cmodel555.cmodel`:

| Check | Result |
| --- | --- |
| Project created | PASS, `import_AOBO_cmodel555_4412ae86` |
| Visible wizard loaded | PASS |
| `robotName` visible | PASS, `Imported_AMR` |
| Drive type parsed | PASS, `DUAL_STEER` |
| Component count | PASS, `44` |
| Raw frontend component nodes | PASS, `44/44` components contain `rawCmodelComponent` |
| Raw frontend module groups | PASS, `43` groups reconstructed from frontend state |
| MainController group composition | PASS, `G_MainController = [MainController, gyro]` |
| Ability function count | PASS, `5` |
| Function process count | PASS, `5` |
| Console `Decoration failed` | PASS, `0` |
| Console `Invalid entity` | PASS, `0` |
| Console build/500 errors | PASS, `0` |

Frontend category counts:

| Category | Count |
| --- | ---: |
| `CHASSIS` | 1 |
| `DRIVER` | 10 |
| `DRIVEWHEEL` | 2 |
| `MAINCPU` | 1 |
| `SENSOR` | 24 |
| `IO_BOARD` | 2 |
| `LIGHT` | 1 |
| `SCREEN` | 1 |
| `BATTERY` | 1 |
| `BUTTON` | 1 |

Key component checks:

| Name | Alias | Category | Type | Pose/Interfaces |
| --- | --- | --- | --- | --- |
| `Steerwheel_BR` | `轮子` | `DRIVEWHEEL` | `diffSteerWheel` | `x=545`, `y=640` |
| `Steerwheel_FL` | `轮子` | `DRIVEWHEEL` | `diffSteerWheel` | `x=-545`, `y=-640` |
| `MainController` | `四代主控...` | `MAINCPU` | `subMainCPU` | `29` interfaces |
| `gyro` | `板载陀螺仪` | `SENSOR` | `gyro` | `0` interfaces |
| `IO module` | `IO module` | `IO_BOARD` | `IOModule` | `20` interfaces |
| `laser` | `通用激光` | `SENSOR` | `laser` | `x=389.68`, `y=-596.55`, `z=1946.5`, `1` interface |

## Post-Fix Export Comparison

UI exported file:

```text
artifacts/aobo_cmodel_validation/ui_front_rebuild_final_1783857329646_import_AOBO_cmodel555_4412ae86_packed.cmodel
```

Exported archive entries:

| Entry | Size | MD5 |
| --- | ---: | --- |
| `CompDesc.model` | 187498 | `18b67220b453f9a5ff7c114a956fa520` |
| `AbiSet.model` | 12965 | `799c7dc6f57f568f369a1245d8db173a` |
| `FuncDesc.model` | 1526 | `2ee0778e12e961176f81885776cdbdc9` |
| `ModelFileDesc.json` | 459 | `b57edbdb1ad866eaa2028855aa59c3ab` |

Semantic comparison after protobuf decode:

| Model | Source vs UI Export |
| --- | --- |
| `CompDesc.model` | PASS, semantic equal |
| `AbiSet.model` | PASS, semantic equal |
| `FuncDesc.model` | PASS, semantic equal |

Note: Binary sizes and MD5 values differ because protobuf re-encoding and manifest regeneration are not byte-stable. The decoded protobuf object content is equal under sorted JSON comparison.

## Local Artifacts

```text
artifacts/aobo_cmodel_validation/source.decoded.json
artifacts/aobo_cmodel_validation/upload.response.json
artifacts/aobo_cmodel_validation/compile.response.json
artifacts/aobo_cmodel_validation/exported.decoded.json
artifacts/aobo_cmodel_validation/validation.summary.json
artifacts/aobo_cmodel_validation/ui-validation.summary.json
artifacts/aobo_cmodel_validation/ui-diff.summary.json
artifacts/aobo_cmodel_validation/ui-validation-after-fix.summary.json
```

Temporary Cloudflare KV sandbox/artifact keys created during validation were deleted after the test.

## Conclusion

`AOBO.cmodel555.cmodel` now parses successfully in Worker and imports successfully through the frontend UI. The UI displays the parsed model with the expected component count, drive type, key devices, positions, interfaces, abilities, and function processes.

After the final fix, exporting the unmodified imported model through the UI follows the required path:

```text
cmodel upload -> protobuf parse -> frontend module state -> Worker module/group composition -> cmodel export
```

The decoded `CompDesc`, `AbiSet`, and `FuncDesc` from that UI-exported file are semantically consistent with the source file. This verification is not based on directly reusing the uploaded archive as the output artifact.
