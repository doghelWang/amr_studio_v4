# Verification Report 2026-04-23 22

## Scope

- Validate new `compile_service` module-list extraction tests
- Confirm existing service, adapter, builder, repository, and backend regression suites remain green

## Changed Files

- `tests/unit/test_compile_service.py`

## Commands

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_compile_service
src/backend/.venv310/bin/python -m unittest tests.unit.test_model_service tests.unit.test_resource_adapter_compat tests.unit.test_project_repository tests.unit.test_xml_component_adapter
src/backend/.venv310/bin/python -m unittest tests.unit.test_ability_export_builder tests.unit.test_module_group_builder tests.unit.test_component_general_attrs tests.unit.test_component_payload_builders
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions tests.unit.test_backend_api_e2e tests.unit.test_protobuf_export_alignment
```

## Results

### 1. Compile service unit tests

- Status: PASS
- Summary: `Ran 3 tests in 0.000s`

### 2. Service, compatibility, repository, and XML adapter tests

- Status: PASS
- Summary: `Ran 13 tests in 0.007s`

### 3. Builder-level tests

- Status: PASS
- Summary: `Ran 16 tests in 0.000s`

### 4. Backend export/API/protobuf regressions

- Status: PASS
- Summary: `Ran 8 tests in 0.283s`

## Coverage Added

- IO-like category normalization for module list rows
- explicit module type and coordinate extraction
- fallback mapping from `moduleType` / `category`
- recursive `moreModuleInfo` row collection
- snake_case fallback field support

## Conclusion

- Module-list extraction behavior is now directly tested
- Existing export/API/protobuf regression behavior remains unchanged
