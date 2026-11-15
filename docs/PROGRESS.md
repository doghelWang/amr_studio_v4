# Progress log

Times are America/Los_Angeles.

| Time | Stage | What happened |
|---|---|---|
| 2026-11-14 21:01 | Audit | Cloned `main` @ 17442f7e with all branches; read CLAUDE.md, the 20260913 design and requirement set, the three backends, the frontend store/services/steps. |
| 2026-11-14 21:04 | Audit | Findings A1–A7 written up; Wang chose: one TypeScript core, core + new UI staged, new branch with clean tree. |
| 2026-11-14 21:06 | Setup | Branch `rewrite/v5` created; old tree removed from the branch; kept protos, 143 module templates, board descriptions, six real cmodels as fixtures. Wang asked for a document per stage and a progress entry every 10 minutes. |
| 2026-11-14 21:08 | Stage 2 | Proved the key design assumption: protobufjs decode → encode is byte-identical on all 18 model files in the fixtures. |
| 2026-11-14 21:07 | Stage 0–1 | `01_REDESIGN.md` and `02_PLAN.md` written and sent. |
| 2026-11-14 21:12 | Stage 2–3 | Core codec, view and edit layers written. Catalog generator converts all 142 templates (4 of them multi-module assemblies) with no value lost; found and fixed a naming trap (`interface_Group` / `module_3d_icon` JSON names) that silently dropped interface data. |
| 2026-11-14 21:16 | Stage 2–4 | Core complete: codec, view, edit, catalog, validator (26 rules), diff. 50 tests pass, typecheck clean. Running the rules over the four production models showed that three things flagged in the earlier manual review are vendor conventions, not faults (controller ETH ports linked to each other, RS485 dataBits = 1, e-stop NO/NC attribute); those rules were removed and CAN terminators downgraded to info. |
| 2026-11-14 21:18 | Stage 5 | CLI (`amr info/params/check/diff/set/json`) and Worker storage API written with tests. |
| 2026-11-14 21:22 | Stage 6 | Web UI written: workspace shell, module tree, Properties, Wiring, Functions, Validate, Compare, Catalog; dev server runs the real Worker API in-process. |
| 2026-11-14 21:26 | Stage 6–7 | Browser walkthrough (Playwright, 20 steps) passes against the built app: open, reject bad file, search, edit with validation, wiring disconnect/reconnect, rebind function, undo/redo, compare, catalog add, export checked by the CLI, save/reopen on server, 41-module production model, narrow layout. |
| 2026-11-14 21:27 | Stage 7 | Stage reports 04–06 and README written; branch committed locally (not pushed). |
| 2026-11-14 21:39 | Deploy | Wang asked to deploy and test in a browser. No Cloudflare credentials in this session. Found before deploying: the Worker decoded uploads with protobufjs, which generates code at run time — not allowed on Cloudflare Workers. Fixing and testing under the real Workers runtime (workerd) locally. |
| 2026-11-14 21:44 | Deploy | Worker fixed for the Workers runtime (no protobuf in the Worker; entry module exports handlers only). 62 tests pass; 21-step browser walkthrough passes against workerd and against Vite preview; `wrangler deploy --dry-run` bundles. `07_DEPLOY.md` written. |
| 2026-11-14 21:45 | Deploy | Branch `rewrite/v5` pushed to GitHub (c1f7391f + this log entry). Cloudflare deploy is waiting on a logged-in terminal. |
