# Acceptance Test Plan: AMR Configurator

## 1. Objective
Define the verification methodology to ensure the AMR Configurator produces valid, bit-perfect reconstructible, and functionally sound `.cmodel` archives.

## 2. Testing Levels

### 2.1 JSON Compliance (Schema Validation)
- **Method**: Use a specialized Python script (`validate_json_schema.py`) to cross-reference the generated JSONs with the original `ModelSet39` counterparts.
- **Criteria**:
    - All tags in the generated JSON must exist in the `.proto` schema.
    - No missing mandatory fields (e.g., `moduleUuid`, `key`, `type`).
    - Standard enums (e.g., `DATA_STRING`, `DATA_DOUBLE`) must be strings, not integers.

### 2.2 Functional Configuration (Wizard Flow)
- **Test Case 1: Minimal Diff Chassis**: Configure a basic Diff chassis with 1 Main Board and 2 Drivers.
- **Test Case 2: Full Omni AMR**: Configure a 4-wheel Omni chassis with Lidar and IMU.
- **Criteria**: UI must prevent moving to Step 3 if Step 1 (Chassis) is not complete.

### 2.3 Binary Reconstruction (Bit-Perfect Validation)
- **Method**: 
    1. Generate a `.cmodel`.
    2. Extract the `.model` files.
    3. Re-serialize them using `systematic_serializer.py`.
    4. Compare hashes.
- **Criteria**: Re-serialization of the generated JSON must match the binary models in the `.cmodel`.

---

## 3. Automated Verification Script (Draft)

### `verify_model_integrity.py`
```python
import json, hashlib

def verify_compliance(gen_json_path, ref_json_path):
    with open(gen_json_path) as f: gen = json.load(f)
    # Check for structural anomalies
    if "moreModuleInfo" not in gen: return False, "Missing root moreModuleInfo"
    # ... recursive check ...
    return True, "Passed"

def verify_archive(cmodel_path):
    # Unzip and check MD5 in ModelFileDesc.json matches actual files
    pass
```

---

## 4. Acceptance Criteria (Go/No-Go)
- [ ] 100% of generated tags are found in Proto definitions.
- [ ] Wizard UI supports at least 5 hardware categories.
- [ ] Generated `.cmodel` can be successfully imported by the `systematic_parser.py`.

---
**Senior Test Engineer**: Antigravity  
**Status**: Final Review Ready
