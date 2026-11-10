import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

function jobsApiPlugin() {
  return {
    name: 'jobs-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/jobs')) {
          const { handleJobsApiRequest } = await import('./src/services/serpBackendHandler');
          await handleJobsApiRequest(req, res);
          return;
        }
        next();
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/jobs')) {
          const { handleJobsApiRequest } = await import('./src/services/serpBackendHandler');
          await handleJobsApiRequest(req, res);
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    jobsApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: process.env.NODE_ENV === 'production' ? false : true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/framer-motion')) {
            return 'ui';
          }
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) {
            return 'charts';
          }
          if (id.includes('node_modules/react/')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
