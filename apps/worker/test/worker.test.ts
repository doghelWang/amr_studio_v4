import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Env, KV } from '../src/api';
import worker from '../src/worker';

function memoryKv(): KV {
  const store = new Map<string, { value: ArrayBuffer; metadata?: unknown }>();
  return {
    async get(key) { return store.get(key)?.value ?? null; },
    async put(key, value, options) { store.set(key, { value: typeof value === 'string' ? new TextEncoder().encode(value).buffer as ArrayBuffer : value, metadata: options?.metadata }); },
    async delete(key) { store.delete(key); },
    async list(options) { return { keys: [...store].filter(([k]) => k.startsWith(options?.prefix ?? '')).map(([name, v]) => ({ name, metadata: v.metadata })), list_complete: true }; },
  };
}
const env = (): Env => ({ AMR_PROJECTS: memoryKv() });
const call = (e: Env, method: string, path: string, body?: BodyInit, headers?: Record<string, string>) => worker.fetch(new Request(`https://x${path}`, { method, body, headers }), e);
const cmodel = new Uint8Array(readFileSync('fixtures/mq-q3.cmodel'));

describe('worker API', () => {
  it('reports its version', async () => {
    const r = await call(env(), 'GET', '/api/v1/system/version');
    expect(await r.json()).toMatchObject({ version: '5.0.0' });
  });
  it('stores, lists, returns and deletes a project', async () => {
    const e = env();
    const put = await call(e, 'PUT', '/api/v1/projects/MQ-Q3%20(test)', cmodel, { 'x-amr-modules': '31' });
    expect(put.status).toBe(200);
    expect(await put.json()).toMatchObject({ name: 'MQ-Q3 (test)', modules: 31, bytes: cmodel.length });
    const list = (await (await call(e, 'GET', '/api/v1/projects')).json()) as { projects: { name: string; modules: number }[] };
    expect(list.projects).toMatchObject([{ name: 'MQ-Q3 (test)', modules: 31 }]);
    const got = new Uint8Array(await (await call(e, 'GET', '/api/v1/projects/MQ-Q3%20(test)')).arrayBuffer());
    expect(got.length).toBe(cmodel.length);
    expect(got.every((b, i) => b === cmodel[i])).toBe(true);
    expect((await call(e, 'DELETE', '/api/v1/projects/MQ-Q3%20(test)')).status).toBe(200);
    expect((await call(e, 'GET', '/api/v1/projects/MQ-Q3%20(test)')).status).toBe(404);
  });
  it('answers every failure with structured JSON', async () => {
    const e = env();
    const cases: [string, string, BodyInit | undefined, number, string][] = [
      ['PUT', '/api/v1/projects/x', 'not a zip', 422, 'not_a_cmodel'],
      ['PUT', '/api/v1/projects/x', undefined, 400, 'empty'],
      ['PUT', '/api/v1/projects/..%2Fetc', cmodel, 400, 'bad_name'],
      ['GET', '/api/v1/projects/missing', undefined, 404, 'not_found'],
      ['POST', '/api/v1/projects/x', cmodel, 405, 'method_not_allowed'],
      ['GET', '/api/v1/nope', undefined, 404, 'not_found'],
    ];
    for (const [method, path, body, status, error] of cases) {
      const r = await call(e, method, path, body);
      expect(r.status, `${method} ${path}`).toBe(status);
      expect(r.headers.get('content-type')).toContain('application/json');
      expect(await r.json()).toMatchObject({ error });
    }
  });
  it('refuses an archive whose contents do not match its description', async () => {
    const { unzipSync, zipSync } = await import('fflate');
    const z = unzipSync(cmodel);
    z['CompDesc.model'] = z['CompDesc.model'].slice(0, 100);
    const r = await call(env(), 'PUT', '/api/v1/projects/broken', zipSync(z));
    expect(r.status).toBe(422);
    expect(await r.json()).toMatchObject({ error: 'not_a_cmodel', detail: expect.stringContaining('MD5') });
  });
  it('does not load protobufjs (run-time code generation is forbidden on Workers)', async () => {
    const src = (await import('node:fs')).readFileSync('apps/worker/src/api.ts', 'utf8');
    expect(src).not.toMatch(/from '@amr\/core'/);
    expect(src).toMatch(/from '@amr\/core\/container'/);
  });
  it('turns an unexpected exception into a structured 500', async () => {
    const broken: Env = { AMR_PROJECTS: { ...memoryKv(), list: async () => { throw new Error('kv down'); } } };
    const r = await call(broken, 'GET', '/api/v1/projects');
    expect(r.status).toBe(500);
    expect(await r.json()).toEqual({ error: 'internal_error', detail: 'The request could not be completed' });
  });
});
