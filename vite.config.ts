import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Permet d'éviter les erreurs 'process is not defined' si le code legacy l'utilise encore
  define: {
    'process.env': {}
  }
})