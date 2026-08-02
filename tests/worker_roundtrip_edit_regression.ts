import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { ImportService } from '../src/frontend/src/store/ImportService.js';

const baseUrl = process.env.AMR_TEST_BASE_URL || 'http://127.0.0.1:18891';
const sourcePath = process.env.AMR_TEST_CMODEL || '/Users/wangfeifei/Downloads/0323.cmodel';

function findRawComponent(group: any, moduleUuid: string): any | null {
  for (const rawComponent of group?.moduleComponets || group?.module_componets || []) {
    const rawUuid = rawComponent?.generalAttr?.moduleUuid?.stringValue
      || rawComponent?.general_attr?.module_uuid?.string_value;
    if (rawUuid === moduleUuid) return rawComponent;
  }
  for (const child of group?.moreModuleInfo || group?.more_module_info || []) {
    const found = findRawComponent(child, moduleUuid);
    if (found) return found;
  }
  return null;
}

async function uploadBytes(bytes: Uint8Array, filename: string): Promise<any> {
  const body = new FormData();
  body.append('file', new Blob([bytes]), filename);
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

const upload = await uploadBytes(new Uint8Array(await readFile(sourcePath)), '0323.cmodel');
const sourceAbilities = await getProjectResource(upload.project_id, 'abilities');
const sourceFunctions = await getProjectResource(upload.project_id, 'functions');

const parsed = ImportService.parseCompDesc(upload.full_json) as any;
const component = parsed.components.find((item: any) => item.interfaces?.length > 1);
assert.ok(component, 'fixture must contain a component with multiple interfaces');

const sourceAttribute = component.privateAttrs
  .flatMap((group: any) => group.elements)
  .find((attribute: any) => attribute.type === 'DATA_STRING');
assert.ok(sourceAttribute, 'fixture must contain an editable string attribute');
const editedValue = `${sourceAttribute.value || ''}__roundtrip_edit`;
sourceAttribute.value = editedValue;
const sourceInterface = component.interfaces[0];
const targetInterface = component.interfaces[1];
sourceInterface.linkedInterfaceUuid = [targetInterface.interfaceUuid];

const projectId = upload.project_id;
const initResponse = await fetch(`${baseUrl}/api/v1/models/init-sandbox`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    projectId,
    config: {
      identity: parsed.identity,
      components: parsed.components,
      abilities: { version: 'V1.0', componentAbility: [], functionAbility: [] },
      rawCompDescMeta: parsed.rawCompDescMeta,
    },
  }),
});
assert.equal(initResponse.status, 200);

const compileResponse = await fetch(`${baseUrl}/api/v1/models/${projectId}/compile`, { method: 'POST' });
assert.equal(compileResponse.status, 200);
const compile = await compileResponse.json() as any;
assert.equal(compile.status, 'success');
assert.ok(compile.download_url);

const artifactResponse = await fetch(`${baseUrl}${compile.download_url}`);
assert.equal(artifactResponse.status, 200);
const artifactBytes = new Uint8Array(await artifactResponse.arrayBuffer());
assert.ok(artifactBytes.byteLength > 0);
await writeFile(process.env.AMR_TEST_ARTIFACT_OUT || '/tmp/amr_worker_roundtrip_edit.cmodel', artifactBytes);

const expectedCompDesc = structuredClone(upload.full_json);
const expectedComponent = findRawComponent(expectedCompDesc, component.id);
assert.ok(expectedComponent, 'edited component must exist in source protobuf projection');
const expectedGroups = expectedComponent.privateAttr?.privateAttrs || expectedComponent.private_attr?.private_attrs || [];
const expectedAttribute = expectedGroups
  .flatMap((group: any) => group.arrayBaseEle || group.array_base_ele || [])
  .find((attribute: any) => attribute.key === sourceAttribute.key);
assert.ok(expectedAttribute, 'edited attribute must exist in source protobuf projection');
expectedAttribute.stringValue = editedValue;
const expectedInterfaces = expectedComponent.interfaceParams?.interfaceGroup
  || expectedComponent.interfaceParams?.interface_Group
  || expectedComponent.interface_params?.interface_group
  || [];
const expectedInterface = expectedInterfaces.find((item: any) => item.interfaceUuid === sourceInterface.interfaceUuid);
assert.ok(expectedInterface, 'edited interface must exist in source protobuf projection');
expectedInterface.linkedInterfaceUuid = [targetInterface.interfaceUuid];

const reimport = await uploadBytes(artifactBytes, '0323_roundtrip_edit.cmodel');
const reimportedAbilities = await getProjectResource(reimport.project_id, 'abilities');
const reimportedFunctions = await getProjectResource(reimport.project_id, 'functions');
assert.deepEqual(
  reimport.full_json,
  expectedCompDesc,
  'round-trip output contains protobuf changes outside the explicitly edited attribute and connection',
);
assert.deepEqual(
  reimportedAbilities,
  sourceAbilities,
  'component edit unexpectedly changed AbiSet protobuf fields',
);
assert.deepEqual(
  reimportedFunctions,
  sourceFunctions,
  'component edit unexpectedly changed FuncDesc protobuf fields',
);

console.log(JSON.stringify({
  status: 'PASS',
  projectId,
  componentId: component.id,
  editedAttribute: { key: sourceAttribute.key, value: editedValue },
  editedConnection: { source: sourceInterface.interfaceUuid, target: targetInterface.interfaceUuid },
  semanticDiff: {
    compDesc: 'only_explicit_edits',
    abiSet: 'none',
    funcDesc: 'none',
  },
}));
