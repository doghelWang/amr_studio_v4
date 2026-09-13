import assert from 'node:assert/strict';
import { unzipSync } from 'fflate';
import { AMR_MODEL_NSP } from '../cloudflare/generated/protobuf_models.js';

const baseUrl = process.env.AMR_TEST_BASE_URL || 'http://127.0.0.1:18891';
const projectId = `minimal_no_invention_${Date.now()}`;

const config = {
  identity: { robotName: 'Explicit Robot' },
  components: [
    {
      id: 'explicit-component',
      name: 'Explicit Component',
      alias: 'Explicit Alias',
      moduleGroupName: 'explicit-group',
      mainModuleTypeKey: 'explicit-main-type',
      subModuleTypeKey: 'explicit-sub-type',
      mountX: 0,
      privateAttrs: [],
      interfaces: [],
    },
  ],
};

const initResponse = await fetch(`${baseUrl}/api/v1/models/init-sandbox`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ projectId, config }),
});
assert.equal(initResponse.status, 200);

const compileResponse = await fetch(`${baseUrl}/api/v1/models/${projectId}/compile`, { method: 'POST' });
assert.equal(compileResponse.status, 200);
const compile = await compileResponse.json() as any;
assert.equal(compile.status, 'success');

const artifactResponse = await fetch(`${baseUrl}${compile.download_url}`);
assert.equal(artifactResponse.status, 200);
const archive = unzipSync(new Uint8Array(await artifactResponse.arrayBuffer()));
const compDescEntry = Object.entries(archive).find(([name]) => name === 'CompDesc.model' || name.endsWith('/CompDesc.model'));
const compDescBytes = compDescEntry?.[1];
assert.ok(compDescBytes, 'compiled archive must contain compdesc.model');

const decoded = AMR_MODEL_NSP.Message_Module_Info.decode(compDescBytes);
const compDesc = AMR_MODEL_NSP.Message_Module_Info.toObject(decoded, {
  defaults: false,
  enums: String,
  longs: String,
  bytes: String,
  oneofs: true,
}) as any;
const group = compDesc.moreModuleInfo?.[0];
const component = group?.moduleComponets?.[0];
assert.equal(compDesc.moduleGroupName, 'Explicit Robot');
assert.equal(group?.moduleGroupName, 'explicit-group');
assert.equal(component?.generalAttr?.moduleName?.stringValue, 'Explicit Component');
assert.equal(component?.generalAttr?.moduleUuid?.stringValue, 'explicit-component');
assert.equal(component?.generalAttr?.moduleDesc?.stringValue, 'Explicit Alias');
assert.equal(component?.generalAttr?.mainModuleType?.comboType?.typeKey, 'explicit-main-type');
assert.equal(component?.generalAttr?.subModuleType?.comboType?.typeKey, 'explicit-sub-type');

const forbiddenGeneralAttrs = [
  'versionInfo',
  'moduleSupplier',
  'moduleWeight',
  'modulePower',
  'moduleShape',
  'subSysType',
  'moduleDscType',
  'module3dIcon',
  'moduleType',
];
for (const key of forbiddenGeneralAttrs) {
  assert.equal(component?.generalAttr?.[key], undefined, `unexpected inferred general attribute: ${key}`);
}

const extendParams = component?.structParam?.extendParams || [];
assert.deepEqual(extendParams.map((item: any) => item.key), ['locCoordX']);
assert.equal(extendParams[0].doubleValue, 0);
for (const key of ['desc', 'unit', 'doubleMaxvalue', 'doubleMinvalue']) {
  assert.equal(extendParams[0][key], undefined, `unexpected inferred coordinate metadata: ${key}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  projectId,
  explicitFieldsPreserved: true,
  inferredFieldsWritten: false,
}));
