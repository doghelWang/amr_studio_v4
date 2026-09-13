# Verification Report 2026-04-23 14

## Scope

- Pre-change regression baseline before extracting XML component parsing from `resource_adapter`
- Confirms repository, builder-level, and backend regression suites remain stable

## Commands

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_project_repository
src/backend/.venv310/bin/python -m unittest tests.unit.test_ability_export_builder tests.unit.test_module_group_builder tests.unit.test_component_general_attrs tests.unit.test_component_payload_builders
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions tests.unit.test_backend_api_e2e tests.unit.test_protobuf_export_alignment
```

## Results

### 1. Project repository unit tests

- Status: PASS
- Summary: `Ran 6 tests in 0.010s`

### 2. Builder-level unit tests

- Status: PASS
- Summary: `Ran 16 tests in 0.001s`

### 3. Backend export/API/protobuf regressions

- Status: PASS
- Summary: `Ran 8 tests in 0.319s`

## Conclusion

- Backend regression baseline remains green
- It is safe to proceed with extracting XML component parsing from `resource_adapter`
