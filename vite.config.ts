import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import linaria from '@linaria/rollup';

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  envDir: './env',
  plugins: [react(), tsconfigPaths(), svgrPlugin(), linaria()],
  server: {
    port: 4000,
  },
  build: {
    sourcemap: true,
  },
});
