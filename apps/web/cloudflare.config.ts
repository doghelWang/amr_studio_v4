import { bindings, defineConfig } from 'cf/config';

/**
 * Cloudflare deployment of AMR Studio v5 (used by `cf deploy`, `cf dev` and the Vite plugin).
 * One Worker: the storage API in apps/worker, plus this Vite app as its static assets.
 */
export default defineConfig({
  worker: {
    name: 'amr-studio-v5',
    compatibilityDate: '2026-07-11',
    entrypoint: '../worker/src/worker.ts',
    assets: {
      notFoundHandling: 'single-page-application',
      runWorkerFirst: ['/api/*'],
    },
    env: {
      // Same KV namespace as v4; v5 only writes keys that start with "cmodel:".
      AMR_PROJECTS: bindings.kv({ id: '7b09e5334d584ea591ec8626f6fb22b3' }),
      CF_VERSION_METADATA: bindings.versionMetadata(),
      ASSETS: bindings.assets(),
    },
  },
});
