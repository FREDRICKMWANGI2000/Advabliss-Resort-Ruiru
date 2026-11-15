import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Local dev: forward /api calls to the Express server when VITE_API_URL is not set
    proxy: { '/api': 'http://localhost:5000' },
  },
})
