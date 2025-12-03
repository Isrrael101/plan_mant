import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            }
        }
    },
    build: {
        target: 'esnext',
        minify: 'esbuild',
        // Optimizar code splitting
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                entryFileNames: 'assets/index-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
                // Separar dependencias grandes en chunks específicos
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'router': ['react-router-dom']
                }
            }
        }
    },
    esbuild: {
        charset: 'utf8',
        // Remover console.log en producción
        drop: ['console', 'debugger']
    }
})

// Version 3.0.0 - MySQL Only - CRUD Complete - Optimizado
