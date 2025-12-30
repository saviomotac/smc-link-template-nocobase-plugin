import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['cjs'],
    sourcemap: true,
    dts: true,
    clean: false,
    external: ['@nocobase/server'],
  },
  {
    entry: ['src/server/index.ts'],
    outDir: 'dist/server',
    format: ['cjs'],
    sourcemap: true,
    dts: true,
    clean: false,
    external: ['@nocobase/server'],
  },
  {
    entry: ['src/client/index.tsx'],
    outDir: 'dist/client',
    format: ['cjs'],
    sourcemap: false,
    dts: true,
    clean: false,
    platform: 'browser',
    external: ['@nocobase/client', 'react', '@formily/react', 'react/jsx-runtime'],
  },
]);
