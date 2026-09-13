# CModel Roundtrip Distortion Root Cause And Final Result

Date: 2026-07-12

## Background

The target validation was not only:

```text
upload cmodel -> decode protobuf -> encode protobuf -> export
```

The real required path is:

```text
cmodel upload
-> protobuf parse
-> frontend module state
-> frontend-driven build/composition
-> exported cmodel
-> protobuf decode comparison with source
```

This distinction matters because the product must support importing a model, showing/editing it in the frontend, then rebuilding the model without silently distorting existing data.

## Why The Earlier Output Was Different

The early UI-exported file differed from the source because the frontend export path was lossy.

Main causes:

1. The frontend parsed protobuf components into simplified `ComponentConfig` fields.
2. The Worker rebuilt `CompDesc.model` from those simplified fields rather than from complete module protobuf structures.
3. Many fields were UI-visible but not fully representable in the simplified model, especially:
   - `interfaceParams.interfaceGroup`
   - raw `interfaceAbility`
   - private attribute max/min/default fields
   - module group structure, including multi-component groups such as `G_MainController = [MainController, gyro]`
   - subtype and raw module metadata
4. `AbiSet.model` was transformed through the UI ability view model, losing rich nested fields such as custom combox options, clone flags, and nested option metadata.
5. Display fallbacks were written back as real protobuf data. For example, when source `moduleDesc` was empty, the frontend used `name` as display alias, and the earlier builder wrote that display alias into `moduleDesc`.
6. Missing pose fields were also being materialized as default zero-valued `extendParams`, which created fields that did not exist in the source.

In short:

```text
source protobuf model -> simplified frontend view model -> rebuilt protobuf
```

was not lossless.

## Modification Strategy

The fix was not to bypass the frontend by directly repacking the uploaded model. Instead, the frontend module state was expanded so it can act as a lossless reconstruction source.

Frontend changes:

- `ComponentConfig` now carries:
  - `rawCmodelComponent`
  - `rawModuleGroup`
  - `rawModuleGroupIndex`
  - `rawComponentIndex`
- Imported project config now carries:
  - `rawCompDescMeta`
  - `rawAbiSet`
  - `rawFuncDesc`
- The parsed fields remain available for UI rendering and editing.
- The raw fields are used for lossless rebuild/composition.

Worker changes:

- `buildFrontendCompDesc` now detects imported frontend configs that carry raw module data.
- For those configs, Worker rebuilds `CompDesc` from the frontend-provided component list and raw group indexes.
- Components are grouped back into original `moreModuleInfo` order.
- Multi-component groups are preserved.
- Raw component protobuf payloads are used as the base, then only explicit frontend edits should update fields.
- Missing pose params are not invented.
- Empty source `moduleDesc` is not overwritten by frontend display fallback.
- `rawAbiSet` and `rawFuncDesc` are used as the build source for `AbiSet.model` and `FuncDesc.model`.

This makes the real path:

```text
protobuf parse
-> frontend module state with raw protobuf payloads
-> Worker rebuild from frontend state
-> exported protobuf
```

## Final Deployment

Production route:

```text
https://cloud-ai.work/
```

Latest deployed Worker version after the fix:

```text
2b0c27e6-c028-431c-b3cb-2895afbd332c
```

## Final 0323.cmodel Flow Executed

Source:

```text
/Users/wangfeifei/Downloads/0323.cmodel
```

Executed flow:

```text
UI upload on cloud-ai.work
-> Worker /api/v1/models/upload
-> frontend ImportService.parseCompDesc
-> frontend Zustand project state
-> UI export button
-> /api/v1/models/init-sandbox
-> Worker buildFrontendCompDesc from frontend raw module state
-> /api/v1/models/{project_id}/compile
-> downloaded cmodel artifact
-> protobuf decode comparison
```

Final exported artifact:

```text
/Users/wangfeifei/Downloads/amr_studio_roundtrip_exports_20260712/0323_frontend_roundtrip_import_0323_e06a7636_packed.cmodel
```

Machine-readable verification summary:

```text
/Users/wangfeifei/Downloads/amr_studio_roundtrip_exports_20260712/0323_frontend_roundtrip_summary.json
```

Runtime project id:

```text
import_0323_e06a7636
```

Frontend state:

| Check | Value |
| --- | ---: |
| Component count | 20 |
| Raw component count | 20 |
| Raw module group count | 19 |
| `rawAbiSet` present | true |
| `rawFuncDesc` present | true |
| Console errors | 0 |
| `Invalid entity` / `Decoration failed` | 0 |

Category counts:

| Category | Count |
| --- | ---: |
| `CHASSIS` | 1 |
| `DRIVEWHEEL` | 2 |
| `DRIVER` | 6 |
| `BUTTON` | 1 |
| `LIGHT` | 1 |
| `SENSOR` | 7 |
| `MAINCPU` | 1 |
| `IO_BOARD` | 1 |

API calls:

| API | Status |
| --- | ---: |
| `/api/v1/models/upload` | 200 |
| `/api/v1/models/import_0323_e06a7636/abilities` | 200 |
| `/api/v1/models/import_0323_e06a7636/functions` | 200 |
| `/api/v1/models/init-sandbox` | 200 |
| `/api/v1/models/import_0323_e06a7636/compile` | 200 |

Console evidence:

```text
[Trace] Wheel: 通用差速轮 (left_group)
[Trace] Wheel: 通用差速轮 (right_group)
[DEBUG] 2. Imported project: using frontend raw AbiSet model
[DEBUG] 3. Imported project: composing chassis from frontend raw module model
[DEBUG] 4. Imported project: composing components from frontend raw module model
```

## Final Consistency Result

Source archive entries:

| Entry | Size | MD5 |
| --- | ---: | --- |
| `CompDesc.model` | 113782 | `c72e9169ad95c7a6ed9c8a3293283dcc` |
| `AbiSet.model` | 2173 | `00bfcc2057f97f39f9c24922a4d4f2ff` |
| `FuncDesc.model` | 1538 | `c6bdd6f6309a50f6dba13b4660e3953b` |
| `ModelFileDesc.json` | 552 | `918ca20576901a44f936cc5ad02bd66b` |

Exported archive entries:

| Entry | Size | MD5 |
| --- | ---: | --- |
| `CompDesc.model` | 106316 | `7b16d83e5d491479640ab7f086d33ed7` |
| `AbiSet.model` | 2173 | `00bfcc2057f97f39f9c24922a4d4f2ff` |
| `FuncDesc.model` | 1534 | `55222b57e5c2dbdac5d4fac8c0b40639` |
| `ModelFileDesc.json` | 459 | `c1a7476cbd9541eee828a6407a5772fb` |

Semantic protobuf comparison:

| Model | Result |
| --- | --- |
| `CompDesc.model` | PASS |
| `AbiSet.model` | PASS |
| `FuncDesc.model` | PASS |

Note: file sizes and MD5 can differ after protobuf re-encoding and manifest regeneration. The authoritative check is decoded protobuf semantic equality.

## Multi-Model Regression Result

The same frontend reconstruction path was also validated on:

| Model | Result |
| --- | --- |
| `0323.cmodel` | PASS |
| `1234.cmodel` | PASS |
| `测试车模型(1).cmodel` | PASS |
| `AOBO.cmodel555.cmodel` | PASS |

Detailed batch report:

```text
docs/verification/VERIFICATION_REPORT_20260712_MULTI_CMODEL_ROUNDTRIP.md
```

Batch artifacts:

```text
artifacts/multi_cmodel_validation_20260712/
```

## Conclusion

The previous inconsistency was caused by a lossy frontend view-model rebuild path. The fix is to let the frontend module state retain raw protobuf component/group/ability/function payloads and let Worker rebuild from that frontend state.

The final `0323.cmodel` execution confirms that the full required path now works:

```text
parse -> frontend -> build -> compose -> export
```

The exported artifact has been written locally for manual inspection, and decoded `CompDesc`, `AbiSet`, and `FuncDesc` are semantically equal to the source.
