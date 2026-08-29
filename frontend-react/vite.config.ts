import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// backend-nest routes are mounted at the root (no /api prefix) — the rewrite
// below strips it so the app can always call fetch('/api/...') regardless of
// whether it's running under this dev proxy or the production Caddyfile.
//
// Target is overridable via API_PROXY_TARGET: defaults to the host-mapped
// port for `npm run dev` outside Docker, but the frontend-react-dev compose
// service sets it to the Docker network hostname (http://backend-nest:80).
const apiProxyTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:8081';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
