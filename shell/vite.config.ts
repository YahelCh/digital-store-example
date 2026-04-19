import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      filename: 'remoteEntry.js',
      exposes: {
        './UserStore': './src/store/userStore.ts'
      },
      shared: ['react', 'react-dom', 'zustand']
    })
  ],
  server: {
    port: 5173
  }
})
