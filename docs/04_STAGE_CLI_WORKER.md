# Stage report — CLI and Worker

Status: **done** · 2026-11-14

## CLI (`packages/cli`, 142 lines)

```
npm run amr -- info   <file.cmodel>                      modules, links, bindings
npm run amr -- params <file.cmodel> <module> [--all]     parameters of one module
npm run amr -- check  <file.cmodel> [--json] [--level error|warning|info]   exit 1 on errors
npm run amr -- diff   <a.cmodel> <b.cmodel> [--json]     semantic differences, exit 1 when different
npm run amr -- set    <file.cmodel> <module> <path> <value> [-o out.cmodel]
npm run amr -- json   <file.cmodel> [-o out.json]        decoded model as JSON
```

The CLI is a thin shell over `@amr/core`; it is the same code the browser runs. `check` and `diff` exit codes make it usable in CI.

Example on the two-lidar model:

```
ERROR   can.nodeId     MainController  Node ID 1 is used by MainController.CAN_2 and driver-left.CAN_1 on the same CANopen bus
WARNING lidar.heading  laser-front     Mounted at (554, 458) but yaw -90° points across the vehicle body
WARNING lidar.forward  laser-C200      No obstacle-avoidance laser sees straight ahead (bound: laser-C200)
1 error(s), 2 warning(s), 19 note(s)
```

## Worker (`apps/worker`, 107 lines — v4's was 1,832)

| Method | Path | Result |
|---|---|---|
| GET | `/api/v1/system/version` | version and deployment id |
| GET | `/api/v1/projects` | saved projects with module count, size, time |
| GET | `/api/v1/projects/:name` | the stored `.cmodel` bytes |
| PUT | `/api/v1/projects/:name` | store; the container is checked first (zip, file description, MD5s), so only real cmodels are stored |
| DELETE | `/api/v1/projects/:name` | delete |

- Every failure is structured JSON `{error, detail}`; an unexpected exception becomes a 500 with a plain message (REQ-EX-01). Tested for six failure cases plus a simulated KV outage.
- Project names are restricted to letters, digits, spaces and `. _ - ( )`, 80 characters; uploads are capped at 20 MB.
- `wrangler.jsonc` reuses the v4 KV namespace with its own key prefix (`cmodel:`), so v4 data is untouched. **Nothing has been deployed.**
- The Vite dev and preview servers mount this same handler with an in-memory store, so the UI is always exercised against the production API code.

## Tests

`packages/cli/test/cli.test.ts` (6 tests) and `apps/worker/test/worker.test.ts` (6 tests), all passing.
