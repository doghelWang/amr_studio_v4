# Verification Report 2026-04-23 29

## Scope

This report covers:

- compile/export diagnostics integration
- backend unit and regression validation
- frontend production build validation
- local full-service runtime validation
- backend/frontend startup status for manual confirmation

## Code Change Summary

Added compile/export diagnostic visibility:

- `collect_comp_desc_diagnostics(comp_desc)` traverses resolved `CompDesc` protocol structures.
- `compile_project()` now returns structured `diagnostics`.
- `compile_project()` also appends short `DIAGNOSTIC[...]` lines to `audit`.
- diagnostics remain outside protocol payload files.

Updated tests:

- `tests/unit/test_fallback_diagnostics.py`
- `tests/unit/test_backend_export_regressions.py`
- `tests/unit/test_resource_adapter_compat.py`

## Commands Run

### Backend Unit Discovery

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

Result:

- `Ran 52 tests in 0.301s`
- `OK`

### Focused Backend Regression

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_fallback_diagnostics tests.unit.test_backend_export_regressions tests.unit.test_resource_adapter_compat tests.unit.test_compile_service
```

Result:

- `Ran 12 tests in 0.149s`
- `OK`

### Python Compile Check

```bash
src/backend/.venv310/bin/python -m compileall -q src/backend/app src/backend/core src/backend/main.py tests/unit
```

Result:

- exit code `0`
- no syntax compilation errors reported

### Frontend Production Build

```bash
npm run build
```

Result:

- TypeScript build passed.
- Vite build passed.
- Output generated under `src/frontend/dist`.
- Non-blocking warning: one JS chunk is larger than Vite's 500 kB warning threshold.

## Services Started

Backend:

- URL: `http://127.0.0.1:8002`
- Command: `.venv310/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8002`
- PID observed: `95175`

Frontend:

- URL: `http://127.0.0.1:3001`
- Command: `npm run dev -- --host 0.0.0.0 --port 3001`
- PID observed: `94937`

## HTTP Validation

### Backend Version

```bash
curl http://127.0.0.1:8002/api/v1/system/version
```

Result:

- HTTP `200`
- returned backend version payload

### Backend Schemas

```bash
curl http://127.0.0.1:8002/api/v1/schemas
```

Result:

- HTTP `200`
- response size: `1596203` bytes

### Frontend Root

```bash
curl http://127.0.0.1:3001/
```

Result:

- HTTP `200`
- returned Vite HTML shell

### Frontend Proxy to Backend

```bash
curl http://127.0.0.1:3001/api/v1/system/version
```

Result:

- HTTP `200`
- returned backend version payload through frontend proxy

### Compile Existing Project

```bash
curl -X POST http://127.0.0.1:8002/api/v1/models/proj_8b800f1b/compile
```

Result:

- HTTP `200`
- returned `status: success`
- returned `download_url`
- returned `module_list_url`
- returned `audit`
- returned structured `diagnostics`
- audit includes `DIAGNOSTIC[...]` lines

### Download Generated CModel

```bash
curl http://127.0.0.1:8002/downloads/proj_8b800f1b/proj_8b800f1b_packed.cmodel
```

Result:

- HTTP `200`
- response size: `18552` bytes

### Download Generated Module List CSV

```bash
curl http://127.0.0.1:8002/downloads/proj_8b800f1b/proj_8b800f1b_module_list.csv
```

Result:

- HTTP `200`
- response size: `4346` bytes
- header: `模块名,所属子系统,子系统Key,模块主类别,主类别Key,子类别,子类别Key,安装位置(X/Y/Z),旋转姿态(R/P/Y)`

## Judgment

Full-service validation is ready for human confirmation.

The backend and frontend are both running locally. Automated checks passed for:

- backend unit/regression tests
- Python syntax compilation
- frontend production build
- backend HTTP API
- frontend dev server
- frontend proxy
- compile/export endpoint
- generated cmodel download
- generated module-list download

## Manual Confirmation Targets

Please open:

- `http://127.0.0.1:3001/`
- optionally `http://127.0.0.1:8002/api/v1/system/version`

Suggested manual checks:

- UI loads normally.
- API calls from UI reach backend successfully.
- existing project export still works.
- audit panel or browser console can show returned diagnostic lines if compile is triggered.
