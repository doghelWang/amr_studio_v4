# Verification Report 2026-04-23 27

## Scope

This verification evaluates whether the backend refactor can be considered structurally complete for the current phase, covering:

- engineering constraints and no-fabrication rules
- backend modularization state
- compatibility surface state
- unit and regression test health
- syntax/import health
- remaining completion risks

## Judgment

Backend refactor status: **phase-complete, with follow-up hardening recommended**.

The backend has reached the planned modularization target for this phase:

- API wiring is concentrated in `src/backend/main.py`.
- API workflow logic is concentrated under `src/backend/app/services/`.
- request schemas are isolated under `src/backend/app/schemas/`.
- cmodel conversion and builder logic is decomposed under `src/backend/core/`.
- `data_manager.py` and `resource_adapter.py` are compatibility facades rather than primary implementation locations.
- project file operations are centralized behind `ProjectRepository`.
- field fallback policy is explicitly documented and test-covered.

The backend should not yet be described as permanently finished. It is complete for the current structural refactor phase, while deeper protocol hardening remains a next phase.

## Constraint Review

Confirmed:

- `specifications/ENGINEERING_CONSTRAINTS.md` includes the no-guess/no-fabrication rule.
- Missing or unknown protocol information must not be guessed, invented, or fabricated.
- Allowed fallback behavior is restricted to explicit missing-state, explicit errors, pending-confirmation markers, or registered fallback values.
- `docs/FIELD_SOURCE_POLICY_20260423.md` records current field source and fallback categories.
- `tests/unit/test_field_source_policy.py` verifies that required fields such as `generalAttr.moduleUuid` are not treated as guessable values.

Known boundary:

- Some compatibility defaults are intentionally retained because the current frontend input is incomplete and Proto serialization requires a valid skeleton. These defaults are now documented as compatibility or schema defaults instead of being implicit guesses.

## Commands Run

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

Result:

- `Ran 47 tests in 0.296s`
- `OK`

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_module_list_builder tests.unit.test_compile_service tests.unit.test_model_service tests.unit.test_resource_adapter_compat tests.unit.test_project_repository tests.unit.test_xml_component_adapter tests.unit.test_ability_export_builder tests.unit.test_module_group_builder tests.unit.test_component_general_attrs tests.unit.test_component_payload_builders tests.unit.test_field_source_policy tests.unit.test_backend_export_regressions tests.unit.test_backend_api_e2e tests.unit.test_protobuf_export_alignment
```

Result:

- `Ran 47 tests in 0.306s`
- `OK`

```bash
src/backend/.venv310/bin/python -m compileall -q src/backend/app src/backend/core src/backend/main.py tests/unit
```

Result:

- exit code `0`
- no syntax/import compilation errors reported

## Fixes During Verification

Two legacy exploratory test files still imported the old package path:

- `tests/unit/test_io.py`
- `tests/unit/test_parser_v25.py`

Changes made:

- switched their import setup to insert `src/backend` into `sys.path`
- changed imports from `backend.core...` to `core...`
- changed `test_io.py` to avoid requiring removed legacy decoder symbols during module import

Reason:

- the old import path caused `unittest discover` to fail before any backend behavior was tested
- the removed generic decoder should not be recreated or faked just to satisfy an old manual probe
- the current official parser path remains `ModelParser`

## Structural Review

Observed backend structure:

- `src/backend/main.py`: API entry and route wiring
- `src/backend/app/config.py`: app configuration paths
- `src/backend/app/errors.py`: API exception handling
- `src/backend/app/schemas/request_models.py`: request models
- `src/backend/app/services/*.py`: application service layer
- `src/backend/core/project_repository.py`: project persistence implementation
- `src/backend/core/cmodel_export_adapter.py`: cmodel export public adapter
- `src/backend/core/cmodel_component_mapper.py`: component-to-cmodel mapping
- `src/backend/core/component_general_attrs.py`: general attribute construction
- `src/backend/core/component_payload_builders.py`: component payload construction
- `src/backend/core/module_group_builder.py`: module group construction
- `src/backend/core/ability_export_builder.py`: ability export construction
- `src/backend/core/xml_component_adapter.py`: XML-to-component conversion
- `src/backend/core/field_source_policy.py`: fallback/source policy registry
- `src/backend/core/data_manager.py`: compatibility facade
- `src/backend/core/resource_adapter.py`: compatibility facade

## Completion Criteria Assessment

| Criterion | Status | Evidence |
| --- | --- | --- |
| route layer separated from business logic | Pass | `main.py` delegates to services |
| service modules created | Pass | app service layer exists and is tested |
| cmodel builder logic decomposed | Pass | focused core builder modules exist and are tested |
| repository logic centralized | Pass | `ProjectRepository` exists and is tested |
| legacy imports protected | Pass | `resource_adapter` and `data_manager` remain as facades |
| no-fabrication rule documented | Pass | engineering constraints and field source policy exist |
| curated regression suite passes | Pass | 47 tests OK |
| full unit discovery passes | Pass | 47 tests OK |
| syntax compilation passes | Pass | `compileall` exit code 0 |

## Residual Risks

- Some mapping tables remain in Python constants. The engineering constraint already identifies the medium-term target of moving mappings to XML/config-generated sources.
- Some compatibility defaults remain necessary until frontend input and module-library source coverage are complete.
- Runtime full-stack verification was not rerun in this report; this report focuses on backend code, constraints, and unit/regression validation.
- Frontend generated Vite cache files are dirty in the worktree but unrelated to this backend validation.

## Next Recommended Work

1. Add non-breaking diagnostics for compatibility defaults and mapping defaults so suspicious fallback use is visible in export/audit output.
2. Continue migrating static mappings toward XML/config-derived registries.
3. Convert legacy exploratory test files into formal assertions or move them into a manual tools folder.
4. Rerun full backend/frontend runtime validation before any production handoff.
