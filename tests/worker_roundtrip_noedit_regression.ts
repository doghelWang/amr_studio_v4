import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { ImportService } from '../src/frontend/src/store/ImportService.js';

const baseUrl = process.env.AMR_TEST_BASE_URL || 'http://127.0.0.1:18891';
const sourcePath = process.env.AMR_TEST_CMODEL || '/Users/wangfeifei/Downloads/0323.cmodel';

async function uploadBytes(bytes: Uint8Array, filename: string): Promise<any> {
  const body = new FormData();
  body.append('file', new Blob([bytes.buffer as ArrayBuffer]), filename);
  const response = await fetch(`${baseUrl}/api/v1/models/upload`, { method: 'POST', body });
  assert.equal(response.status, 200);
  const result = await response.json() as any;
  assert.equal(result.status, 'success');
  return result;
}

async function getProjectResource(projectId: string, resource: 'abilities' | 'functions'): Promise<any> {
  const response = await fetch(`${baseUrl}/api/v1/models/${projectId}/${resource}`);
  assert.equal(response.status, 200);
  return response.json();
}

const sourceBytes = new Uint8Array(await readFile(sourcePath));
const upload = await uploadBytes(sourceBytes, basename(sourcePath));
const sourceAbilities = await getProjectResource(upload.project_id, 'abilities');
const sourceFunctions = await getProjectResource(upload.project_id, 'functions');
const parsed = ImportService.parseCompDesc(upload.full_json) as any;

const initResponse = await fetch(`${baseUrl}/api/v1/models/init-sandbox`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    projectId: upload.project_id,
    config: {
      identity: parsed.identity,
      components: parsed.components,
      abilities: { version: 'V1.0', componentAbility: [], functionAbility: [] },
      rawCompDescMeta: parsed.rawCompDescMeta,
    },
  }),
});
assert.equal(initResponse.status, 200);

const compileResponse = await fetch(`${baseUrl}/api/v1/models/${upload.project_id}/compile`, { method: 'POST' });
assert.equal(compileResponse.status, 200);
const compile = await compileResponse.json() as any;
assert.equal(compile.status, 'success');

const artifactResponse = await fetch(`${baseUrl}${compile.download_url}`);
assert.equal(artifactResponse.status, 200);
const artifactBytes = new Uint8Array(await artifactResponse.arrayBuffer());
assert.ok(artifactBytes.byteLength > 0);
if (process.env.AMR_TEST_ARTIFACT_OUT) {
  await writeFile(process.env.AMR_TEST_ARTIFACT_OUT, artifactBytes);
}

const reimport = await uploadBytes(artifactBytes, `${basename(sourcePath)}.roundtrip.cmodel`);
const reimportedAbilities = await getProjectResource(reimport.project_id, 'abilities');
const reimportedFunctions = await getProjectResource(reimport.project_id, 'functions');
assert.deepEqual(reimport.full_json, upload.full_json, 'no-edit round-trip changed CompDesc protobuf fields');
assert.deepEqual(
  reimportedAbilities,
  sourceAbilities,
  'no-edit round-trip changed AbiSet protobuf fields',
);
assert.deepEqual(
  reimportedFunctions,
  sourceFunctions,
  'no-edit round-trip changed FuncDesc protobuf fields',
);

console.log(JSON.stringify({
  status: 'PASS',
  source: sourcePath,
  projectId: upload.project_id,
  sourceBytes: sourceBytes.byteLength,
  artifactBytes: artifactBytes.byteLength,
  componentCount: parsed.components.length,
  semanticDiff: { compDesc: 'none', abiSet: 'none', funcDesc: 'none' },
}));
