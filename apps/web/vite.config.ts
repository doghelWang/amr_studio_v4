import { cloudflare } from '@cloudflare/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The Cloudflare plugin runs the real Worker (apps/worker) inside workerd for `vite dev` and `vite preview`,
// with local KV, and produces the deployable build output that `cf deploy` uploads.
export default defineConfig({
  plugins: [react(), cloudflare()],
  build: { target: 'es2022', chunkSizeWarningLimit: 1500 },
});
