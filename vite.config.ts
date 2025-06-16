import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   outDir: '../Backend/wwwroot',
  // },
  server: {
    port: 3000,
     strictPort: true,
    host: true, // cho phép truy cập qua IP/domain
    allowedHosts: [
      '7de4-2001-ee0-40c1-5c38-d27-53ab-e5c0-ee1c.ngrok-free.app' // thêm domain ngrok vào đây
    ]
  },
   base: '/',
});
