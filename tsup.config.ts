import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/server/index.ts'],
    outDir: 'dist/server',
    format: ['cjs'],
    sourcemap: true,
    dts: true,
    clean: false,
    external: [
      '@nocobase/server',
      '@nocobase/client',
      'react',
      'react-dom',
      '@formily/react',
      '@formily/core',
    ],
  },
  {
    entry: ['src/client/index.tsx'],
    outDir: 'dist/client',
    format: ['cjs'],
    sourcemap: true,
    dts: true,
    clean: false,
    external: [
      '@nocobase/client',
      'react',
      'react-dom',
      '@formily/react',
      '@formily/core',
    ],
  },
]);
