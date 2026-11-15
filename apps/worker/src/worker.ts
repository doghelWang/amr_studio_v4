/**
 * AMR Studio Worker: serves the web app and stores projects.
 * The browser decodes, edits, validates and encodes by itself, so the server only keeps `.cmodel` files.
 * Every upload is opened with @amr/core first, so nothing that is not a cmodel is ever stored.
 */
import { openCmodel, modules, CmodelError } from '@amr/core';

export interface KV {
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
  put(key: string, value: ArrayBuffer | string, options?: { metadata?: unknown }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; cursor?: string }): Promise<{ keys: { name: string; metadata?: unknown }[]; list_complete: boolean; cursor?: string }>;
}
export interface Env {
  AMR_PROJECTS: KV;
  ASSETS?: { fetch(request: Request): Promise<Response> };
  CF_VERSION_METADATA?: { id: string; tag?: string; timestamp?: string };
}

export const VERSION = '5.0.0';
const PREFIX = 'cmodel:';
const MAX_BYTES = 20 * 1024 * 1024;
const NAME = /^[\p{L}\p{N}][\p{L}\p{N} ._()\-]{0,79}$/u;

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const fail = (status: number, error: string, detail?: string): Response => json({ error, detail }, status);

interface Meta { modules: number; bytes: number; savedAt: string }

export async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  const method = request.method;

  if (path === '/api/v1/system/version' && method === 'GET') {
    return json({ version: VERSION, runtime: 'cloudflare-worker', deployment: env.CF_VERSION_METADATA?.id ?? null });
  }

  if (path === '/api/v1/projects' && method === 'GET') {
    const items: ({ name: string } & Partial<Meta>)[] = [];
    let cursor: string | undefined;
    do {
      const page = await env.AMR_PROJECTS.list({ prefix: PREFIX, cursor });
      for (const k of page.keys) items.push({ name: k.name.slice(PREFIX.length), ...((k.metadata as Meta | undefined) ?? {}) });
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
    items.sort((a, b) => (b.savedAt ?? '').localeCompare(a.savedAt ?? ''));
    return json({ projects: items });
  }

  const m = /^\/api\/v1\/projects\/([^/]+)$/.exec(path);
  if (m) {
    let name: string;
    try {
      name = decodeURIComponent(m[1]);
    } catch {
      return fail(400, 'bad_name', 'The project name is not valid URL encoding');
    }
    if (!NAME.test(name)) return fail(400, 'bad_name', 'Use letters, digits, spaces and . _ - ( ), at most 80 characters');
    const key = PREFIX + name;

    if (method === 'GET') {
      const data = await env.AMR_PROJECTS.get(key, 'arrayBuffer');
      if (!data) return fail(404, 'not_found', `No project named "${name}"`);
      return new Response(data, { headers: { 'content-type': 'application/octet-stream', 'cache-control': 'no-store' } });
    }
    if (method === 'PUT') {
      const data = await request.arrayBuffer();
      if (data.byteLength === 0) return fail(400, 'empty', 'The request has no body');
      if (data.byteLength > MAX_BYTES) return fail(413, 'too_large', `A project may be at most ${MAX_BYTES / 1024 / 1024} MB`);
      let count: number;
      try {
        count = modules(openCmodel(new Uint8Array(data), name)).length;
      } catch (err) {
        if (err instanceof CmodelError) return fail(422, 'not_a_cmodel', err.message);
        throw err;
      }
      const meta: Meta = { modules: count, bytes: data.byteLength, savedAt: new Date().toISOString() };
      await env.AMR_PROJECTS.put(key, data, { metadata: meta });
      return json({ name, ...meta });
    }
    if (method === 'DELETE') {
      await env.AMR_PROJECTS.delete(key);
      return json({ name, deleted: true });
    }
    return fail(405, 'method_not_allowed', `${method} is not supported on a project`);
  }

  return fail(404, 'not_found', `No API route ${method} ${path}`);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env);
      } catch (err) {
        // Never leak a raw exception to the user (REQ-EX-01).
        console.error(err);
        return fail(500, 'internal_error', 'The request could not be completed');
      }
    }
    return env.ASSETS ? env.ASSETS.fetch(request) : fail(404, 'not_found');
  },
};
