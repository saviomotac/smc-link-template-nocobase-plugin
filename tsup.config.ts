import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    client: 'src/client/index.tsx',
    server: 'src/server/plugin.ts',
  },
  format: ['cjs'],
  sourcemap: true,
  clean: true,
  tsconfig: 'tsconfig.json',
  dts: true,
  external: [
    'react',
    'react-dom',
    '@formily/react',
    '@formily/core',
    '@nocobase/client',
    '@nocobase/server',
  ],
});
