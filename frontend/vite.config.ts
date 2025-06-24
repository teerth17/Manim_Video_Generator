import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/chat": "http://localhost:3000",
      "/generate": "http://localhost:3000",
      "/videos": "http://localhost:3000",
    },
  }
  
})

