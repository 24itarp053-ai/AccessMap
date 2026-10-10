import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode, searching process.cwd()
  const env = loadEnv(mode, process.cwd(), '');

  // Determine proxy target host for /api requests
  // If VITE_PROXY_TARGET is specified, use it.
  // Otherwise, if VITE_API_BASE_URL starts with http, extract its origin.
  // Default fallback: http://localhost:5000
  let proxyTarget = 'http://localhost:5000';
  if (env.VITE_PROXY_TARGET) {
    proxyTarget = env.VITE_PROXY_TARGET;
  } else if (env.VITE_API_BASE_URL && env.VITE_API_BASE_URL.startsWith('http')) {
    try {
      proxyTarget = new URL(env.VITE_API_BASE_URL).origin;
    } catch {
      proxyTarget = 'http://localhost:5000';
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
