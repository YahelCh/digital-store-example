import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'shell',
      filename: 'remoteEntry.js',
      exposes: {
        './UserStore': './src/store/userStore.ts'
      },
      remotes: {
        mfe: 'http://localhost:4175/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'zustand']
    }),
    react()
  ],
  build: {
    target: 'es2022'
  },
  server: {
    port: 5173
  }
})
