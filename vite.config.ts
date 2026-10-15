import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // The live host serves /api/contact.php; proxy it in dev when DANAU_API is set.
    proxy: process.env.DANAU_API ? { '/api': { target: process.env.DANAU_API, changeOrigin: true } } : undefined,
  },
})
