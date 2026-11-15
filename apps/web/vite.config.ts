import react from '@vitejs/plugin-react';
import { defineConfig, type Connect, type Plugin } from 'vite';
import { handleApi, type KV } from '@amr/worker';

/** Runs the real Worker API inside the dev/preview server with an in-memory store, so the UI is developed against the production code path. */
function localApi(): Plugin {
  const store = new Map<string, { value: ArrayBuffer; metadata?: unknown }>();
  const kv: KV = {
    async get(key) { return store.get(key)?.value ?? null; },
    async put(key, value, options) { store.set(key, { value: typeof value === 'string' ? (new TextEncoder().encode(value).buffer as ArrayBuffer) : value, metadata: options?.metadata }); },
    async delete(key) { store.delete(key); },
    async list(options) { return { keys: [...store].filter(([k]) => k.startsWith(options?.prefix ?? '')).map(([name, v]) => ({ name, metadata: v.metadata })), list_complete: true }; },
  };
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    if (!req.url?.startsWith('/api/')) return next();
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', async () => {
      const body = Buffer.concat(chunks);
      const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && body.length > 0;
      const response = await handleApi(new Request(`http://local${req.url}`, { method: req.method, body: hasBody ? body : undefined, headers: req.headers as Record<string, string> }), { AMR_PROJECTS: kv });
      res.statusCode = response.status;
      response.headers.forEach((v, k) => res.setHeader(k, v));
      res.end(Buffer.from(await response.arrayBuffer()));
    });
  };
  return { name: 'amr-local-api', configureServer: (s) => void s.middlewares.use(middleware), configurePreviewServer: (s) => void s.middlewares.use(middleware) };
}

export default defineConfig({ plugins: [react(), localApi()], build: { target: 'es2022', chunkSizeWarningLimit: 1500 } });
