import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './MfeApp': './src/App.tsx'
      },
      remotes: {
        shell: 'http://localhost:4178/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'zustand']
    }),
    react()
  ],
  build: {
    target: 'es2022'
  },
  server: {
    port: 4173
  }
})
