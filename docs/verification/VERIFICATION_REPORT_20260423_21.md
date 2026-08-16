# Verification Report 2026-04-23 21

## Scope

- Pre-change regression baseline before adding `compile_service` module-list row tests
- Planned task: lock down CSV row extraction fallback and recursion behavior before further refactor

## Commands

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_model_service tests.unit.test_resource_adapter_compat tests.unit.test_project_repository tests.unit.test_xml_component_adapter
src/backend/.venv310/bin/python -m unittest tests.unit.test_ability_export_builder tests.unit.test_module_group_builder tests.unit.test_component_general_attrs tests.unit.test_component_payload_builders
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions tests.unit.test_backend_api_e2e tests.unit.test_protobuf_export_alignment
```

## Results

### 1. Service, compatibility, repository, and XML adapter tests

- Status: PASS
- Summary: `Ran 13 tests in 0.007s`

### 2. Builder-level tests

- Status: PASS
- Summary: `Ran 16 tests in 0.000s`

### 3. Backend export/API/protobuf regressions

- Status: PASS
- Summary: `Ran 8 tests in 0.285s`

## Conclusion

- Backend regression baseline remains green
- It is safe to proceed with adding `compile_service` module-list row tests
