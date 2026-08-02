# AMR Studio V4 Deployment Verification Report

Date: 2026-06-13

## Scope

- Deploy current project release to `116.62.39.177`.
- Verify remote backend/frontend startup.
- Verify backend regression tests.
- Verify public access path for manual validation.

## Remote Deployment

- Login user: `doghell`.
- Deploy root: `/home/doghell/amr_studio_v4`.
- Active release: `/home/doghell/amr_studio_v4/current`.
- Backend service: `amr-studio-backend.service`.
- Frontend service: `amr-studio-frontend.service`.
- Public nginx entry: `http://116.62.39.177:8888/amr-studio/`.

## Fixes Applied During Deployment

- Stopped and disabled `mihomo.service` because DNS resolved package registries to `198.18.0.x` fake-ip addresses and pip/npm traffic timed out.
- Removed residual mihomo policy routing rules:
  - `pref 5210`
  - `pref 5230`
  - `pref 5250`
  - `pref 5270`
- Repointed `amr-studio-backend.service` from old path `/mnt/misc/develop/amr_studio_v4/src/backend` to `/home/doghell/amr_studio_v4/current/src/backend`.
- Added `amr-studio-frontend.service`.
- Rebuilt frontend with Vite base `/amr-studio/`.
- Copied frontend dist to `/var/www/amr_studio_v4/dist`.
- Updated nginx `/amr-studio/`, `/api/`, `/downloads/`, and `/models/` routes to serve/proxy the current deployment.
- Pinned backend dependency versions in `src/backend/requirements.txt` to avoid pulling incompatible latest FastAPI/Starlette versions.

## Remote Verification

- Python dependency install: passed with Tsinghua PyPI mirror.
- Frontend dependency install: passed with `registry.npmmirror.com`.
- Remote frontend build: passed.
- Remote backend unit tests:
  - Command: `PYTHONPATH=src/backend src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p "test_*.py"`
  - Result: `Ran 53 tests ... OK`
- systemd status:
  - `amr-studio-backend.service`: active
  - `amr-studio-frontend.service`: active
  - `nginx`: active
- Local-on-server API:
  - `http://127.0.0.1:8002/api/v1/system/version`: HTTP 200
  - `http://127.0.0.1:8002/api/v1/schemas`: HTTP 200, response size `1596203`
- nginx public path:
  - `http://116.62.39.177:8888/amr-studio/`: HTTP 200
  - `/amr-studio/assets/index-CrcGhBFZ.js`: HTTP 200
  - `http://116.62.39.177:8888/api/v1/system/version`: HTTP 200

## Local Regression Verification

- Backend:
  - Command: `src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'`
  - Result: `Ran 53 tests ... OK`
- Frontend:
  - Command: `cd src/frontend && npm run build`
  - Result: passed
  - Note: Vite chunk-size warning remains; no build failure.

## Public Access Notes

- Direct public access to `:3001` and `:8002` did not reach the host network interface during tcpdump verification.
- Public access through nginx port `8888` works and is the validated access path:
  - `http://116.62.39.177:8888/amr-studio/`

