import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const rickMortyProxy = {
  target: 'https://rickandmortyapi.com',
  changeOrigin: true,
  secure: true,
} as const

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Listen on all interfaces so 127.0.0.1, localhost, and LAN URLs all work (Windows/WSL/port-forward).
    host: true,
    port: 5173,
    strictPort: false,
    open: '/',
    proxy: {
      '/graphql': rickMortyProxy,
    },
  },
})
