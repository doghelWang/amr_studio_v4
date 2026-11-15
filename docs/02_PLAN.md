# AMR Studio v5 — Plan

| Stage | Deliverable | Done when | Document |
|---|---|---|---|
| 0 | Redesign | Design agreed (architecture, scope, branch chosen by Wang) | `01_REDESIGN.md` |
| 1 | Plan | This file | `02_PLAN.md` |
| 2 | Core: codec | Every fixture decodes and re-encodes byte-identical; zip container round-trips; MD5s verified | `03_STAGE_CORE.md` |
| 3 | Core: model, edit, catalog | View rows match the independent Python decode used earlier; edits keep links reciprocal; add/remove module leaves a valid model | `03_STAGE_CORE.md` |
| 4 | Core: validate, diff | Rules reproduce the known problems in `diff-2lidar.cmodel`; diff reproduces the known `modelset` vs `modelset-wide` differences (15 component values, 4 function values, 1 calibration file) | `03_STAGE_CORE.md` |
| 5 | CLI + Worker | `amr info/check/diff/export` work on fixtures; Worker API tested with an in-memory KV | `04_STAGE_CLI_WORKER.md` |
| 6 | Web UI | Open → browse → edit → validate → compare → export works in a real browser | `05_STAGE_WEB.md` |
| 7 | Test report | Unit tests, typecheck, build, browser walkthrough with screenshots | `06_TEST_REPORT.md` |

Progress is logged in `PROGRESS.md` about every 10 minutes.

## Test strategy

- **Golden fixtures**: six real cmodels in `fixtures/` (two-lidar diff AMR, ModelSet, wide variant, MQ-Q3, MQ-Q3 actuator, empty template).
- **Round-trip**: bytes in = bytes out for all model files; container export re-imports to an equal project.
- **Edit safety**: after each edit operation the model re-encodes, re-decodes, and unrelated bytes are unchanged where that is checkable.
- **Known answers**: validator and diff are checked against results established independently in the earlier analysis of these same files.
- **Browser**: Playwright walkthrough against the built app.

## Out of scope for this pass

3D workshop, power-topology canvas, guided new-vehicle wizard, Feishu integration, deployment to Cloudflare (code is ready; deploying is Wang's call).
