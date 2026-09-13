# Verification Report 2026-04-23 16

## Scope

- Pre-change regression baseline before decoupling `project_service` from `resource_adapter`
- Planned task: introduce explicit cmodel export adapter and keep `resource_adapter` as compatibility façade

## Commands

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_project_repository tests.unit.test_xml_component_adapter
src/backend/.venv310/bin/python -m unittest tests.unit.test_ability_export_builder tests.unit.test_module_group_builder tests.unit.test_component_general_attrs tests.unit.test_component_payload_builders
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions tests.unit.test_backend_api_e2e tests.unit.test_protobuf_export_alignment
```

## Results

### 1. Repository and XML adapter tests

- Status: PASS
- Summary: `Ran 8 tests in 0.011s`

### 2. Builder-level tests

- Status: PASS
- Summary: `Ran 16 tests in 0.000s`

### 3. Backend export/API/protobuf regressions

- Status: PASS
- Summary: `Ran 8 tests in 0.327s`

## Conclusion

- Backend regression baseline remains green
- It is safe to introduce a dedicated cmodel export adapter and migrate service-layer imports
