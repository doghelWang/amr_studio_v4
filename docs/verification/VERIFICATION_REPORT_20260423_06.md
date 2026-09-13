# Verification Report 2026-04-23 06

## Scope

- Pre-change regression baseline before adding `component_payload_builders` unit tests
- Confirms the first builder-level test suite and existing backend regressions are stable

## Commands

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_component_general_attrs
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment
```

## Results

### 1. Component general attrs unit tests

- Status: PASS
- Summary: `Ran 4 tests in 0.000s`

### 2. Export regressions

- Status: PASS
- Summary: `Ran 4 tests in 0.123s`

### 3. Backend API E2E

- Status: PASS
- Summary: `Ran 1 test in 0.179s`

### 4. Protobuf export alignment

- Status: PASS
- Summary: `Ran 3 tests in 0.000s`

## Conclusion

- Backend regression baseline remains green
- It is safe to proceed with adding `component_payload_builders` unit tests
