# Test report

2026-11-14 · branch `rewrite/v5`

| Check | Command | Result |
|---|---|---|
| Unit and integration tests | `npm test` | **62 passed**, 0 failed (core 50, CLI 6, Worker 6) |
| Type check (strict) | `npm run typecheck` | clean for core, CLI, Worker, web |
| Production build | `npm run build` | succeeds |
| Browser walkthrough (Vite preview, Worker running in workerd) | `npm run e2e` | **21 steps passed**, no console or page errors |

## What the tests establish

**Lossless (REQ-NF-01).** For each of the six real cmodels: all three model files re-encode byte-identical; exporting without edits leaves every archive entry byte-identical; MD5s in `ModelFileDesc.json` verify. After an edit only the edited file and the description file change, and reverting the edit restores the original bytes.

**Correct reading.** Module counts (22 / 32 / 32 / 31 / 41 / 0) and the lidar parameters, links, buses and function bindings match the independent Python decode done earlier in this conversation.

**Safe editing.** Type and option checks reject bad input; links are always written on both ends; rename follows into function bindings; removing a module leaves no dangling link; added templates get unique names and UUIDs; assemblies keep their internal wiring; undo restores exact bytes.

**Validation.** The two-lidar model yields exactly 1 error and 2 warnings (duplicate CANopen node ID, front lidar heading, no forward obstacle laser); fixing them clears them. The four production models yield 0 errors. Deliberately broken structure (one-sided link, dangling link, duplicate IP, duplicate node ID) is detected.

**Diff.** A model equals itself; `modelset` vs `modelset-wide` gives 20 differences (15 component, 4 function, 1 calibration file); `mq-q3` vs `mq-q3-actuator` reports the 11 added modules, the removed gyro and the changed CAN_2 membership, and does not report function instances whose only change is a regenerated key.

**Browser.** Open → refuse bad file → search → edit with rejection of bad input → fix the three findings → wiring disconnect / reconnect → undo / redo → compare (exactly 3 edits) → add a controller from the catalog → export (the exported file passes the CLI check and has 23 modules) → save, close, reopen from the server list → open a 41-module production model → narrow-screen layout without horizontal overflow.

## Size of the rewrite

| Part | Lines |
|---|---|
| Core library | 1284 |
| CLI | 142 |
| Worker | 107 |
| Web UI (incl. CSS) | 1021 |
| Tests | 661 |

Tracked files on the branch: 271 (v4 main: 24,744).

## Known limits

- Tested on six cmodels (five vehicle designs). Steer-wheel vehicles and the `MR-HL8` family have not been run through it.
- Validation rules are calibrated on four production models; a rule may still be too strict or too lax on designs unlike these. Each rule's level is one line in `packages/core/src/validate/index.ts`.
- Byte-identity is proven for decode → encode. Files written by other tool versions with non-canonical field order would still decode correctly but would be normalised on re-encode; unedited files are always written back from their original bytes, so this only matters for files that are edited.
- The Worker has been tested in-process and under workerd locally (see `07_DEPLOY.md`), not yet on Cloudflare itself.
