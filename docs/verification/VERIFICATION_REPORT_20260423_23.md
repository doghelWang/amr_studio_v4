# Verification Report 2026-04-23 23

## Scope

- Validate module-list row construction extraction from `compile_service`
- Confirm direct `module_list_builder` tests and existing backend regressions remain green

## Changed Files

- `src/backend/app/services/module_list_builder.py`
- `src/backend/app/services/compile_service.py`
- `tests/unit/test_module_list_builder.py`

## Commands

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_module_list_builder tests.unit.test_compile_service
src/backend/.venv310/bin/python -m unittest tests.unit.test_model_service tests.unit.test_resource_adapter_compat tests.unit.test_project_repository tests.unit.test_xml_component_adapter
src/backend/.venv310/bin/python -m unittest tests.unit.test_ability_export_builder tests.unit.test_module_group_builder tests.unit.test_component_general_attrs tests.unit.test_component_payload_builders
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions tests.unit.test_backend_api_e2e tests.unit.test_protobuf_export_alignment
```

## Results

### 1. Module-list and compile service tests

- Status: PASS
- Summary: `Ran 6 tests in 0.000s`

### 2. Service, compatibility, repository, and XML adapter tests

- Status: PASS
- Summary: `Ran 13 tests in 0.007s`

### 3. Builder-level tests

- Status: PASS
- Summary: `Ran 16 tests in 0.001s`

### 4. Backend export/API/protobuf regressions

- Status: PASS
- Summary: `Ran 8 tests in 0.292s`

## Coverage Added

- direct `module_list_builder` row construction tests
- IO category normalization
- explicit and fallback module type resolution
- recursive child row collection
- compile service private compatibility wrappers remain covered

## Conclusion

- Module-list construction is now separated from compile orchestration
- Existing export/API/protobuf regression behavior remains unchanged
