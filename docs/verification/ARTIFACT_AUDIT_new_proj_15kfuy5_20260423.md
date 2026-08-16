# Artifact Audit: new_proj_15kfuy5_packed.cmodel

## Scope

Audited artifact:

- `/Users/wangfeifei/Downloads/new_proj_15kfuy5_packed.cmodel`

Compared with backend copy:

- `src/backend/saved_projects/new_proj_15kfuy5/new_proj_15kfuy5_packed.cmodel`

## Result

The artifact is structurally valid, but the exported data reveals a real backend export issue.

The issue is not ZIP corruption, not protobuf parse failure, and not file-download damage. It is a semantic data-loss issue in the encode normalization path.

## Structural Checks

Download artifact:

- size: `7780` bytes
- md5: `8f0699de08a31ccaffa508556f4270b7`
- sha256: `1cd8a5a3d0c69062bbcc97b2d2d418c6c9c1406c7fe71934c210b110a81f7be7`

Backend project copy:

- size: `7780` bytes
- md5: `8f0699de08a31ccaffa508556f4270b7`
- sha256: `1cd8a5a3d0c69062bbcc97b2d2d418c6c9c1406c7fe71934c210b110a81f7be7`

ZIP contents:

| File | Raw size |
| --- | ---: |
| `AbiSet.model` | 673 |
| `CompDesc.model` | 28081 |
| `FuncDesc.model` | 0 |
| `ModelFileDesc.json` | 551 |

Protobuf decode:

- `CompDesc.model`: decoded successfully
- `AbiSet.model`: decoded successfully
- `FuncDesc.model`: decoded successfully as empty/default function description

`ModelFileDesc.json` MD5 entries match actual embedded model files.

## Semantic Summary

Decoded `CompDesc.model`:

- groups: `16`
- components: `15`
- root `moreModuleInfo`: `15`
- max depth: `1`
- module-list CSV rows: `15`
- duplicate module UUIDs: `0`
- missing parent references: `0`
- non-flat nested groups: `0`
- non-empty `moduleSys`: `0`

This confirms that the export is parseable and keeps the expected flat module layout.

## Critical Finding

The chassis component is corrupted in the packed artifact:

Expected from project JSON:

- `moduleName`: `chassis_diff`
- `moduleUuid`: `chassis-root`
- `mainModuleType`: `chassis`
- `subSysType`: `ChassisSys`
- `subModuleType`: `steerChassis`

Observed after decoding packed `CompDesc.model`:

- `moduleName`: `robot01`
- `moduleUuid`: empty
- `mainModuleType`: empty
- `subSysType`: empty
- `subModuleType`: empty

Diagnostics produced by the new fallback auditor:

- `REQUIRED_MODULE_UUID_MISSING`: `1`
- `TYPE_MAPPING_DEFAULT_USED`: `1`
- `SUBSYSTEM_MAPPING_DEFAULT_USED`: `1`
- `EMPTY_INTERFACE_GROUP`: `7`
- `DEFAULT_MODULE_SHAPE_USED`: `14`

The first two diagnostics are high-signal export correctness issues for the chassis component.

## Root Cause

The project module file contains both camelCase and snake_case protocol branches:

- correct full branch: `generalAttr`
- partial stale branch: `general_attr`

Relevant file:

- `src/backend/saved_projects/new_proj_15kfuy5/modules/module_chassis_diff_chassis-root.json`

Correct branch:

- line 2: `generalAttr`
- line 3: `moduleName.stringValue = chassis_diff`
- line 17: `moduleUuid.stringValue = chassis-root`

Stale partial branch:

- line 642: `general_attr`
- line 643: `module_name`
- line 644: `string_value = robot01`
- line 646: `module_shape`

During encode, `proto_final_sync()` maps `generalAttr` to `general_attr`, but leaves existing `general_attr` as `general_attr`.

Relevant code:

- `src/backend/skills_v2/cmodel_encoder/encoder.py:60`
- `src/backend/skills_v2/cmodel_encoder/encoder.py:63`
- `src/backend/skills_v2/cmodel_encoder/encoder.py:65`
- `src/backend/skills_v2/cmodel_encoder/encoder.py:124`

Because both source keys normalize to the same target key, the later partial `general_attr` branch overwrites the earlier complete `generalAttr` branch.

Stage trace:

| Stage | Chassis name | UUID | Main type |
| --- | --- | --- | --- |
| `resolved` | `chassis_diff` | `chassis-root` | `chassis` |
| `sanitized` | `chassis_diff` | `chassis-root` | `chassis` |
| `proto_final_sync` | `robot01` | empty | empty |
| `standardize_sys_tree` | `robot01` | empty | empty |

## Judgment

The refactor has exposed and partially improved visibility into this class of issue, but the backend export path still has a real bug:

- mixed camelCase/snake_case branches can collide during final proto normalization
- when a collision occurs, the later branch overwrites instead of merging or rejecting
- partial branches can silently drop required fields

This violates the no-fabrication/no-silent-loss direction of the engineering constraints because the exported artifact no longer preserves the authoritative module data already present in the project module file.

## Recommended Fix

Immediate fix:

- change `proto_final_sync()` to detect normalized key collisions
- when both values are dictionaries, deep-merge them instead of overwriting
- prefer richer non-empty branches over sparse partial branches
- for required fields such as `module_uuid`, fail fast or emit blocking diagnostics if they become empty after normalization

Follow-up validation:

- add a regression test with both `generalAttr` and `general_attr` present
- assert that `moduleUuid`, `mainModuleType`, `subSysType`, and `subModuleType` survive final encoding
- re-export `new_proj_15kfuy5_packed.cmodel`
- re-run artifact audit and full service validation
