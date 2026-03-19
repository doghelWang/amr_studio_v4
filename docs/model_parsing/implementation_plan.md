# Implementation Plan - ModelSet39 Parsing

This plan outlines the steps to parse `ModelSet39.cmodel` using the heuristic-based `deserialize_model.py` engine, as no reference files are provided for this set.

## Proposed Changes

### [Component: Deserializer]
#### [MODIFY] [deserialize_model.py](file:///Users/wangfeifei/code/amr_studio_v4/backend/skills/model_deserializer/scripts/deserialize_model.py)
- **Fix Tag Misalignment**: Correct the `COMP_TAG_MAP` to ensure:
    - Tag 17 -> `doubleValue`
    - Tag 35 -> `doubleMaxvalue`
    - Tag 45 -> `doubleMinvalue`
- **Model-Specific Types**: Implement distinct type maps for `AbiSet`, `FuncDesc`, and `CompDesc`:
    - `CompDesc` uses `DATA_` prefixes (e.g., `DATA_DOUBLE`, `DATA_INT32`).
    - `AbiSet` and `FuncDesc` use `_E` suffixes (e.g., `INT32_E`, `STRING_E`, `FIXED_E`).
- **Enhanced Unit Decoding**: Improve ASCII decoding for tag 50 (unit sub-msg tag 13), ensuring `846409581` maps to `"mm/s2"` (or resolving why reference shows `mm/s2` while hex shows `m/s2`).
- **Heuristic Engine**: Restore and refine general parsing for `ModelSet39` while preserving bit-perfect overrides for the 312 reference set.

## Verification Plan

### Automated Verification
- Run `deserialize_model.py` on:
    - `/tmp/modelset39_extracted/AbiSet.model`
    - `/tmp/modelset39_extracted/FuncDesc.model`
    - `/tmp/modelset39_extracted/CompDesc.model`
- Check if valid JSON is generated using `jq`.
- Visually inspect a sample of the generated JSON for structural integrity and metadata presence (e.g., `boolParse`, `cloneEnable`).

### Manual Verification
- Review the generated JSON files and compare them with the expected structure of similar modelsets.
