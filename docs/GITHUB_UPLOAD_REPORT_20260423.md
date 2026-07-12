# GitHub Upload Report 2026-04-23

## Repository

- GitHub URL: `https://github.com/doghelWang/amr_studio_v4_refactor_20260423`
- Visibility: private
- Branch: `main`
- Upload method: clean snapshot repository

## Source Workspace

- Source path: `/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4`
- Snapshot path: `/tmp/amr_studio_v4_refactor_20260423_snapshot`

## Included Content

- Backend source code
- Frontend source code
- Tests
- Specifications
- Refactor plans and review reports
- Daily work summary
- Verification reports
- Project scripts and supporting repository files

## Excluded Local-Only Content

- `.git`
- `node_modules`
- `.venv` / `.venv*`
- Python bytecode and cache directories
- Vite dependency cache directories
- local test result output directories
- local-only restricted proto source files matched by existing ignore rules

## Verification Before Upload

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment
```

Result:

- Export regressions: PASS
- Backend API E2E: PASS
- Protobuf export alignment: PASS

Detailed verification report:

- `docs/verification/VERIFICATION_REPORT_20260423_02.md`

## Notes

- The repository was uploaded from a clean snapshot rather than the active worktree history to avoid publishing local dependency caches or virtual environments.
- The active source worktree remains unchanged except for upload-related documentation and `.gitignore` hardening.
