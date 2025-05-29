// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // String shorthand for simple cases:
      // '/api': 'http://localhost:5000' 
      // Or, with options:
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true, // Recommended for most cases, changes the 'Origin' header to the target URL
        // secure: false, // Set to false if your backend is HTTP (not HTTPS) - typically for local dev
        // rewrite: (path) => path.replace(/^\/api/, '') // Optional: if your backend API routes DON'T start with /api
                                                       // For our setup, the backend routes DO start with /api (e.g. /api/auth), so no rewrite is needed.
      }
    }
  }
})
