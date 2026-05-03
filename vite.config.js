import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// За локална разработка: Vite proxy препраща /api и /uploads към http://localhost:3000
// (така не ти трябва VITE_API_URL локално)
// За production: задай VITE_API_URL=https://your-api.onrender.com в .env.production
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
