import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  build: {

    /** If you set esmExternals to true, this plugins assumes that 
       all external dependencies are ES modules */

    commonjsOptions: {
        esmExternals: true 
    },
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'], // add any problematic packages here
  },
  
})
