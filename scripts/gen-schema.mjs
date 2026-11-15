// Generates packages/core/src/proto/schema.json from proto/*.proto (single source of truth).
import protobuf from 'protobufjs';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const files = { comp: 'controller_model_comp_desc', func: 'controller_model_abi_desc', abi: 'controller_model_abi_set' };
const out = {};
for (const [k, f] of Object.entries(files)) {
  const root = protobuf.parse(readFileSync(`proto/${f}.proto`, 'utf8'), { keepCase: true }).root;
  out[k] = root.toJSON();
}
mkdirSync('packages/core/src/proto', { recursive: true });
writeFileSync('packages/core/src/proto/schema.json', JSON.stringify(out));
console.log('schema.json written', JSON.stringify(out).length, 'bytes');
