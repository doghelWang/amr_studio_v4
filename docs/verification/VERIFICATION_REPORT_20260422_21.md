# Verification Report 2026-04-22 21

## Scope

- Pre-change regression baseline before continuing backend modular refactor
- Current target: extract ability export shaping from `resource_adapter`

## Commands

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment
```

## Results

### 1. Export regressions

- Status: PASS
- Summary: `Ran 4 tests in 0.132s`

### 2. Backend API E2E

- Status: PASS
- Summary: `Ran 1 test in 0.178s`

### 3. Protobuf export alignment

- Status: PASS
- Summary: `Ran 3 tests in 0.000s`

## Conclusion

- Backend regression baseline remains green
- It is safe to continue with the next small-step modular refactor in `resource_adapter`
