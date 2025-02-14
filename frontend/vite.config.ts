import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all addresses, including those from Docker
    port: 5173,      // Set the port to Vite's default port
    proxy: {
      '/api': 'http://backend:8000', // Use the Docker Compose service name
    },
  },
});
