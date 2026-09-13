# Verification Report 2026-04-23 25

## Scope

- Pre-change regression baseline for the semantic validation and fact-source hardening phase
- Planned task: add a code-level field source/fallback policy registry without changing export behavior

## Commands

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_module_list_builder tests.unit.test_compile_service tests.unit.test_model_service
src/backend/.venv310/bin/python -m unittest tests.unit.test_resource_adapter_compat tests.unit.test_project_repository tests.unit.test_xml_component_adapter
src/backend/.venv310/bin/python -m unittest tests.unit.test_ability_export_builder tests.unit.test_module_group_builder tests.unit.test_component_general_attrs tests.unit.test_component_payload_builders
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions tests.unit.test_backend_api_e2e tests.unit.test_protobuf_export_alignment
```

## Results

### 1. Service-level tests

- Status: PASS
- Summary: `Ran 10 tests in 0.001s`

### 2. Compatibility, repository, and XML adapter tests

- Status: PASS
- Summary: `Ran 9 tests in 0.008s`

### 3. Builder-level tests

- Status: PASS
- Summary: `Ran 16 tests in 0.000s`

### 4. Backend export/API/protobuf regressions

- Status: PASS
- Summary: `Ran 8 tests in 0.320s`

## Conclusion

- Backend regression baseline remains green
- It is safe to begin semantic/fact-source hardening with a non-behavioral policy registry
