import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces (0.0.0.0 & 127.0.0.1)
    port: 3000,
    strictPort: false,
    cors: true,
  },
  build: {
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
