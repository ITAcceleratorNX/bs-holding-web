import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { leadApiPlugin } from './server/vite-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), leadApiPlugin()],
  server: {
    port: 5173,
  },
})
