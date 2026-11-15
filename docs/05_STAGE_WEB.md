# Stage report — web UI

Status: **done** · 20-step browser walkthrough passes · 2026-11-14

React 18 + Zustand + Vite, 1021 lines including CSS (v4 frontend: ~12,000). No UI framework: plain components and one stylesheet with light and dark themes. The UI holds no model of its own; it renders `@amr/core` views and calls its edit operations.

## Screens

| Area | What it does |
|---|---|
| Welcome | Drop or choose a `.cmodel`; list of projects saved on the server. A file that is not a cmodel is refused with the reason. |
| Header | Project name, module count, error / warning counts (click to open Validate), Undo / Redo, Save to server, Export, Close. Warns before closing or leaving with unexported edits. |
| Module tree | All modules grouped by main type, searchable, with an error / warning marker per module. |
| Properties | General, private groups, mounting and per-port interface parameters. Editors follow the proto type: number (with range), text, checkbox, option list; the parent is chosen from the module list. A rejected value shows the reason next to the field and is not saved. Flagged fields are highlighted with the finding text. Hidden parameters can be shown. Enable / disable, remove module. |
| Wiring | One table per bus (named by the controller port) with node ID, baud rate, protocol, terminator, IP; point-to-point links; connect form that only offers compatible ports; disconnect. |
| Functions | Function bindings from FuncDesc, each editable from the module list; missing targets are marked. |
| Validate | Findings filterable by level; each links to its module and shows the parameter path and rule id. |
| Compare | Choose a second cmodel; added / removed modules and per-module changes. |
| Catalog | 142 templates, searchable; Add inserts the module or the whole assembly. Loaded on demand (separate chunk). |

Screenshots from the walkthrough are in `docs/screenshots/`.

## Build

`npm run build` → `apps/web/dist`: app 326 kB (102 kB gzip), catalog chunk 904 kB (175 kB gzip, loaded only when the Catalog tab is opened).

## Not in this pass (as agreed)

3D workshop / top view, power-topology canvas, guided new-vehicle wizard. Also not done: editing non-binding function parameters (e.g. safety box sizes) — they are compared and exported but have no editor yet; editing capability-library (AbiSet) content.
