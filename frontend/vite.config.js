import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Re-enable plugin-react for proper React handling (refresh/preamble).
// export default defineConfig({
// 	plugins: [react()],
// 	server: {
// 		hmr: true,
// 	},
// })

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dès que Vite voit une requête commençant par /api, il la redirige vers Django
      '/api': {
        target: 'http://127.0.0.1:8000', // Modifiez le port (8000) si votre Django en utilise un autre
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
