import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The browser restricts requests made to a different port (like 8081).
      // Vite proxy bypasses CORS by routing requests internally from port 5173 over to the backends.
      '/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/user/, '')
      },
      '/products': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/orders': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/payments': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      }
    }
  }
})
