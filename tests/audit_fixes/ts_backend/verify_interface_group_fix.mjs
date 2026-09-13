#!/usr/bin/env node
// Empirical verification for the cloudflare/worker.ts `interfaceGroup` vs `interface_Group`
// bug found during the TS-backend audit (2026-09-12).
//
// BACKGROUND
// ----------
// cloudflare/worker.ts is the code actually deployed at the production Cloudflare Worker
// (confirmed by matching its hardcoded backendVersion/buildDate/commitHash constants against
// the live /api/v1/system/version response). Its CompDesc encoder
// (encodeCompDesc -> AMR_MODEL_NSP.Message_Module_Info.fromObject().encode(), backed by the
// repo-committed cloudflare/generated/protobuf_models.js) expects the interface/bus-wiring
// array under the literal proto field name `interface_Group` (mixed case — confirmed by
// grepping both protobuf_models.d.ts and protobuf_models.js:
// `Message_Interface_Param.prototype.interface_Group = $util.emptyArray`). This is the ONLY
// field in the whole schema with this odd casing (confirmed via
// `grep -oE '[a-zA-Z0-9_]+_[A-Z][a-zA-Z0-9_]*' protobuf_models.d.ts`).
//
// worker.ts's mapComponentToCmodel() — used for every brand-new / non-imported component
// (worker.ts, the branch at the top of that function) — built the field as
// `interfaceParams: { interfaceGroup: buildComponentInterfaceGroups(component) }`, i.e. the
// camelCase spelling. Since Message_Interface_Param.fromObject() only ever reads
// `object.interface_Group`, the camelCase key was invisible to it and every brand-new
// component's bus/interface wiring was silently dropped from the compiled CompDesc.model —
// while the raw/imported-component path (mergeRawInterfaces) already resolved this correctly
// by checking which key the existing raw proto JSON used.
//
// This script proves it empirically by running the REAL, UNMODIFIED fromObject() code from
// cloudflare/generated/protobuf_models.js (not a reimplementation) against both key spellings.
// Only the module's own `import $protobuf from "protobufjs/minimal.js"` line is redirected to
// a local shim (see protobufjs_minimal_shim.mjs) because this sandbox's network egress policy
// blocks registry.npmjs.org, so `protobufjs` cannot be npm-installed here — that is reported,
// not routed around. Every other byte of generated logic executed below is the real file.
//
// USAGE: node tests/audit_fixes/ts_backend/verify_interface_group_fix.mjs

import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const generatedPath = path.join(repoRoot, "cloudflare/generated/protobuf_models.js");
const shimPath = path.join(__dirname, "protobufjs_minimal_shim.mjs");

async function loadPatchedGeneratedModule() {
  const source = await readFile(generatedPath, "utf8");
  const needle = 'import $protobuf from "protobufjs/minimal.js";';
  if (!source.includes(needle)) {
    throw new Error(
      `Expected exact import line not found in ${generatedPath} — the generated file's shape ` +
        "changed; update this harness rather than silently proceeding.",
    );
  }
  const patched = source.replace(needle, `import $protobuf from ${JSON.stringify(shimPath)};`);

  const tmpDir = await mkdtemp(path.join(tmpdir(), "amr-worker-ts-audit-"));
  const tmpFile = path.join(tmpDir, "protobuf_models_realcode.mjs");
  await writeFile(tmpFile, patched, "utf8");
  try {
    return await import(`file://${tmpFile}`);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}

function buildFakeCompDesc(interfaceFieldName) {
  return {
    moduleGroupName: "TestGroup",
    moduleGroupUuid: "group-uuid-1",
    moduleComponets: [
      {
        generalAttr: {
          moduleUuid: { key: "moduleUuid", type: "DATA_STRING", stringValue: "chassis-root" },
          moduleName: { key: "moduleName", type: "DATA_STRING", stringValue: "Chassis" },
        },
        interfaceParams: {
          [interfaceFieldName]: [
            {
              key: "BUS_MOTOR_L",
              type: "CAN",
              path: "/dev/can0",
              interfaceUuid: "iface-uuid-A",
              linkedInterfaceUuid: ["iface-uuid-B"],
            },
          ],
        },
      },
    ],
  };
}

function testFromObject(AMR_MODEL_NSP, label, fieldName) {
  const payload = buildFakeCompDesc(fieldName);
  // Exactly what worker.ts's encodeCompDesc() calls before .encode():
  const message = AMR_MODEL_NSP.Message_Module_Info.fromObject(payload);
  const ip = message.moduleComponets[0].interfaceParams;
  const group = ip ? ip.interface_Group : undefined;

  console.log(`\n=== ${label} (input key: "${fieldName}") ===`);
  console.log("Decoded interface_Group:", JSON.stringify(group));
  const survived = Array.isArray(group) && group.length === 1 && group[0].interfaceUuid === "iface-uuid-A";
  console.log(survived ? "RESULT: SURVIVED" : "RESULT: LOST");
  return survived;
}

const { AMR_MODEL_NSP } = await loadPatchedGeneratedModule();

const camelResult = testFromObject(
  AMR_MODEL_NSP,
  "mapComponentToCmodel() PRE-FIX shape (camelCase interfaceGroup)",
  "interfaceGroup",
);
const fixedResult = testFromObject(
  AMR_MODEL_NSP,
  "mapComponentToCmodel() POST-FIX shape (literal interface_Group)",
  "interface_Group",
);

console.log("\n=== SUMMARY ===");
console.log("Pre-fix key 'interfaceGroup':", camelResult ? "would survive (unexpected)" : "SILENTLY DROPPED (bug reproduced)");
console.log("Post-fix key 'interface_Group':", fixedResult ? "SURVIVES (fix confirmed)" : "still lost (fix NOT working)");

if (camelResult) {
  console.error("\nUNEXPECTED: the pre-fix camelCase key survived — this harness or the generated file changed shape; investigate before trusting this result.");
  process.exit(1);
}
if (!fixedResult) {
  console.error("\nFIX NOT CONFIRMED: interface_Group still does not survive fromObject(). Check cloudflare/worker.ts mapComponentToCmodel().");
  process.exit(1);
}
console.log("\nBug reproduced with the old camelCase key, and confirmed fixed with the literal proto field name 'interface_Group'.");
