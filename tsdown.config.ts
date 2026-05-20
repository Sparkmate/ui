import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'browser',
  dts: true,
  clean: true,
  deps: {
    neverBundle: ['react', 'react-dom'],
  },
})
