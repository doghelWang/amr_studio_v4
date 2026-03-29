---
name: "CModel Attribute Analyzer"
description: "A specialized skill to extract the 100% full property registry from AMR Studio V4 binary .cmodel files. Use this whenever the user wants to audit a new hardware module, align the UI with official system metadata, or perform a deep-dive comparison between the frontend and the underlying CModel specification."
---

# CModel Attribute Analyzer & Protocol Expert Skill

## Overview
This skill provides a standard automation pipeline to convert proprietary `.cmodel` (Packed ZIP + Protobuf) files into clean, machine-readable JSON Attribute Registries. It ensures **100% structure fidelity** and **zero data loss** during bidirectional conversion.

## Standard Analysis Process

### Phase 1: Decoding & Scavenging
1. Locate the `.cmodel` file (e.g., `packed_ModelSet312.cmodel`).
2. Use the system's `decoder.py` to unzip and deserialize.
3. **MANDATORY**: Use `MessageToJson` with `always_print_fields_with_no_presence=True` to prevent field pruning.
4. Adapt to both **CamelCase** and **SnakeCase** keys using greedy matching.

### Phase 2: Structural Extraction
1. Target specific module types within `CompDesc.json`.
2. Recursively traverse the `moduleComponets` hierarchy.
3. Capture all system-level flags: `boolMustfill`, `boolBasic`, `boolHide`, `boolNoeditable`.

### Phase 3: High-Fidelity Reconstruction
1. **Structural Fidelity**: Use the "Original Tree Injection" strategy—never flatten or rebuild the tree from scratch.
2. **Normalization**: Force `proto_final_sync` (Last-Mile Normalization) to align with official CamelCase naming.
3. **Safe Merging**: Execute `deep_update` based on primary keys (`key` or `type`) to protect non-editable metadata.

---

## Usage Instructions

### 1. Run the Decoder
```bash
source backend/skills/model_deserializer/venv/bin/activate
python3 backend/skills_v2/cmodel_decoder/decoder.py <path_to_cmodel> <output_dir>
```

### 2. Run the Extractor
```bash
python3 <appDataDir>/skills/cmodel_attribute_analyzer/scripts/extractor.py <decoded_json> <output_dir>
```

---

## Integrity Verification
- **Pre-Export Audit**: Real-time value check before serialization.
- **Full-Tree Diff**: Compare new JSON against binary backup (`.bak`) to identify unexpected shifts.

## Metadata Mapping Guide (UI Translation)
- **`boolNoeditable: true`** -> UI: `readOnly={true}`.
- **`boolMustfill: true`** -> UI: `required={true}`.
- **`boolBasic: false`** -> UI: "Advanced Settings" (高级设定).
- **`boolHide: true`** -> UI: Hidden unless in "Developer Mode".

