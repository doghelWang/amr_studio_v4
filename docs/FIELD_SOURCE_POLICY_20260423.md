# Field Source Policy 2026-04-23

## Purpose

This document records the first code-backed field source and fallback policy for cmodel construction.

The policy is implemented in:

- `src/backend/core/field_source_policy.py`

The policy tests are implemented in:

- `tests/unit/test_field_source_policy.py`

## Fallback Categories

| Category | Meaning |
| --- | --- |
| `required` | Field must come from an authoritative source; it should not be guessed |
| `user_input` | Field is expected from frontend/user configuration |
| `template_default` | Field can be populated from module template data |
| `schema_default` | Field can default because the schema/proto allows an empty/default value |
| `mapping_default` | Field can be derived from an existing mapping table |
| `compat_default` | Field remains defaulted for historical compatibility but should be reviewed |

## Initial Registered Fields

| Field | Primary Source | Fallback Kind | Risk |
| --- | --- | --- | --- |
| `generalAttr.moduleName` | frontend component name or module template | `user_input` | empty component names still need semantic validation |
| `generalAttr.moduleUuid` | frontend component id | `required` | missing ids can break module lookup and patch operations |
| `generalAttr.subSysType` | module template or category subsystem mapping | `mapping_default` | unclassified subsystem can hide unsupported categories |
| `generalAttr.mainModuleType` | module template or category type mapping | `mapping_default` | unknown main type can produce exportable but semantically weak output |
| `generalAttr.subModuleType` | module template or specialized category rule | `mapping_default` | special-case mapping must remain aligned with cmodel fixtures |
| `generalAttr.moduleShape` | module template or chassis identity dimensions | `compat_default` | default dimensions can hide missing physical geometry |
| `structParam.extendParams` | frontend mount fields | `compat_default` | zero pose can hide missing mount data |
| `interfaceParams.interfaceGroup` | frontend interfaces | `schema_default` | empty interfaces may be valid for some components but should be schema-checked |
| `ability.functionAbility` | frontend abilities | `schema_default` | empty ability list may hide missing ability configuration |
| `moduleList.mainType` | resolved blueprint `generalAttr.mainModuleType` | `mapping_default` | CSV audit output can inherit weak fallback semantics |

## Current Decision

This first step is intentionally non-behavioral:

- no export behavior changed
- no fallback has been converted to an error yet
- no warning channel has been introduced yet

The purpose is to make fallback semantics explicit and testable before tightening behavior.

## Recommended Next Steps

1. Add validation helpers that can detect use of `compat_default` values.
2. Add warnings for high-risk compatibility defaults before turning anything into an error.
3. Start with non-breaking diagnostics for:
   - missing `moduleUuid`
   - unknown `mainModuleType`
   - `UnclassifiedSys`
   - default chassis/module shape dimensions
   - all-zero mount pose
4. Only after diagnostics are proven should selected fields become hard errors.
