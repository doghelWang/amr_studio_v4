# Verification Report 2026-04-23 02

## Scope

- Pre-upload regression baseline before creating and pushing a clean GitHub repository snapshot
- Includes `.gitignore` hardening to exclude local dependency/cache directories from the new repository snapshot

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
- Summary: `Ran 1 test in 0.183s`

### 3. Protobuf export alignment

- Status: PASS
- Summary: `Ran 3 tests in 0.000s`

## Conclusion

- Backend regression baseline is green
- It is safe to create and push the clean GitHub repository snapshot
