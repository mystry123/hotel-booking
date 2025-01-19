import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    watch: {
      usePolling: true
    }
  }
})
