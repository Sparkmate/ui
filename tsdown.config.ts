import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  unbundle: true,
  outDir: 'dist',
  outExtensions() {
    return { js: '.js' }
  },
  clean: true,
})
