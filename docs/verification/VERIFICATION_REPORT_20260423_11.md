# Verification Report 2026-04-23 11

## Scope

- Validate `ability_export_builder` unit tests
- Confirm all builder-level and backend regression suites remain green

## Changed Files

- `tests/unit/test_ability_export_builder.py`

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
- Summary: `Ran 1 test in 0.198s`

### 7. Protobuf export alignment

- Status: PASS
- Summary: `Ran 3 tests in 0.000s`

## Coverage Added

- default empty ability export shape
- version and component ability preservation
- function ability structure shaping
- child function `type` preference over `key`
- `key` fallback behavior through child-function type construction
- attr mapper invocation with `is_ability=True`
- `cloneEnable` default and explicit preservation

## Conclusion

- The fourth builder-level unit test suite is stable
- Existing export/API/protobuf regression behavior remains unchanged
- The currently extracted builder modules now have direct unit-test coverage
