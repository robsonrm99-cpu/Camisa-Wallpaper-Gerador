import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Injeta a variável de ambiente para o código client-side
    'process.env.API_KEY': JSON.stringify("AIzaSyAVDQrotKh3yFW7qtBiUlJu-pWjtwqEzdM")
  }
})