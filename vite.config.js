import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    cors: true,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'tracks-data': [
            './src/data/tracks/java.js',
            './src/data/tracks/sql.js',
            './src/data/tracks/javascript.js',
            './src/data/tracks/react.js',
            './src/data/tracks/communication.js',
          ],
        }
      }
    }
  }
})
