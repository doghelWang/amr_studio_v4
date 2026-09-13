# Verification Report 2026-04-23 12

## Scope

- Pre-change regression baseline before adding `ProjectRepository` unit tests
- Confirms all current builder-level and backend regression suites remain stable

## Commands

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_ability_export_builder
src/backend/.venv310/bin/python -m unittest tests.unit.test_module_group_builder
src/backend/.venv310/bin/python -m unittest tests.unit.test_component_general_attrs
src/backend/.venv310/bin/python -m unittest tests.unit.test_component_payload_builders
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment
```

## Results

### 1. Ability export builder unit tests

- Status: PASS
- Summary: `Ran 4 tests in 0.000s`

### 2. Module group builder unit tests

- Status: PASS
- Summary: `Ran 3 tests in 0.000s`

### 3. Component general attrs unit tests

- Status: PASS
- Summary: `Ran 4 tests in 0.000s`

### 4. Component payload builders unit tests

- Status: PASS
- Summary: `Ran 5 tests in 0.000s`

### 5. Export regressions

- Status: PASS
- Summary: `Ran 4 tests in 0.147s`

### 6. Backend API E2E

- Status: PASS
- Summary: `Ran 1 test in 0.201s`

### 7. Protobuf export alignment

- Status: PASS
- Summary: `Ran 3 tests in 0.000s`

## Conclusion

- Backend regression baseline remains green
- It is safe to proceed with adding `ProjectRepository` unit tests
