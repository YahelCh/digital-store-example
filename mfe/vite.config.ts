import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    federation({
      name: 'mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './MfeApp': './src/App.tsx'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        zustand: { singleton: true, requiredVersion: '^4.0.0' }
      }
    }),
    react()
  ],
  build: {
    target: 'esnext'
  },
  server: {
    port: 5002,
    strictPort: true
  },
  preview: {
    port: 5002,
    strictPort: true
  }
})
