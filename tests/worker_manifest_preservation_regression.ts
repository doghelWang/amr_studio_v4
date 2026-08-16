import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { unzipSync } from 'fflate';
import { md5 } from 'js-md5';
import { ImportService } from '../src/frontend/src/store/ImportService.js';

const baseUrl = process.argv[2] || process.env.AMR_TEST_BASE_URL || 'http://127.0.0.1:8888';
const sourcePath = process.argv[3] || process.env.AMR_TEST_CMODEL || '/Users/wangfeifei/Downloads/0323.cmodel';

async function upload(bytes: Uint8Array, filename: string): Promise<any> {
  const form = new FormData();
  form.append('file', new Blob([bytes.buffer as ArrayBuffer]), filename);
  const response = await fetch(`${baseUrl}/api/v1/models/upload`, { method: 'POST', body: form });
  assert.equal(response.status, 200);
  const result = await response.json() as any;
  assert.equal(result.status, 'success');
  return result;
}

async function getResource(projectId: string, resource: 'abilities' | 'functions'): Promise<any> {
  const response = await fetch(`${baseUrl}/api/v1/models/${projectId}/${resource}`);
  assert.equal(response.status, 200);
  return response.json();
}

const sourceBytes = new Uint8Array(await readFile(sourcePath));
const sourceEntries = unzipSync(sourceBytes);
const sourceManifest = JSON.parse(new TextDecoder().decode(sourceEntries['ModelFileDesc.json']));
const sourceUpload = await upload(sourceBytes, basename(sourcePath));
const sourceAbilities = await getResource(sourceUpload.project_id, 'abilities');
const sourceFunctions = await getResource(sourceUpload.project_id, 'functions');
const projection = ImportService.parseCompDesc(sourceUpload.full_json) as any;

const initResponse = await fetch(`${baseUrl}/api/v1/models/init-sandbox`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    projectId: sourceUpload.project_id,
    config: {
      identity: projection.identity,
      components: projection.components,
      rawCompDescMeta: projection.rawCompDescMeta,
      rawAbiSet: sourceAbilities,
      rawFuncDesc: sourceFunctions,
    },
  }),
});
assert.equal(initResponse.status, 200);

const compileResponse = await fetch(`${baseUrl}/api/v1/models/${sourceUpload.project_id}/compile`, { method: 'POST' });
assert.equal(compileResponse.status, 200);
const compile = await compileResponse.json() as any;
assert.equal(compile.status, 'success');
const artifactResponse = await fetch(`${baseUrl}${compile.download_url}`);
assert.equal(artifactResponse.status, 200);
const generatedEntries = unzipSync(new Uint8Array(await artifactResponse.arrayBuffer()));
const generatedManifest = JSON.parse(new TextDecoder().decode(generatedEntries['ModelFileDesc.json']));

const sourceDescriptors = sourceManifest.ModelFileDesc || [];
const generatedDescriptors = generatedManifest.ModelFileDesc || [];
assert.deepEqual(
  generatedDescriptors.map((entry: any) => entry.name),
  sourceDescriptors.map((entry: any) => entry.name),
  'manifest entry order or names changed',
);

for (let index = 0; index < sourceDescriptors.length; index += 1) {
  const sourceDescriptor = structuredClone(sourceDescriptors[index]);
  const generatedDescriptor = structuredClone(generatedDescriptors[index]);
  const name = sourceDescriptor.name;
  delete sourceDescriptor.md5;
  delete generatedDescriptor.md5;
  assert.deepEqual(generatedDescriptor, sourceDescriptor, `manifest metadata changed for ${name}`);
  assert.ok(generatedEntries[name], `generated archive is missing ${name}`);
  assert.equal(generatedDescriptors[index].md5, md5(generatedEntries[name]), `manifest MD5 is stale for ${name}`);
  assert.deepEqual(generatedEntries[name], sourceEntries[name], `no-edit round-trip changed ${name} bytes`);
}

console.log(JSON.stringify({
  status: 'PASS',
  source: sourcePath,
  descriptorCount: sourceDescriptors.length,
  preservedMetadata: true,
  regeneratedMd5Valid: true,
  modelPayloadBytesEqual: true,
}));
