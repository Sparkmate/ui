import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '../..')
const distRoot = path.resolve(packageRoot, 'dist')

function moduleStatsPlugin(entryName: string): Plugin {
  return {
    name: 'module-stats',
    generateBundle(_outputOptions, bundle) {
      const chunkModules = new Set<string>()
      let chunkBytes = 0

      for (const item of Object.values(bundle)) {
        if (item.type === 'chunk') {
          chunkBytes += Buffer.byteLength(item.code, 'utf8')
          for (const moduleId of Object.keys(item.modules)) {
            chunkModules.add(moduleId)
          }
        }
      }

      const outputPath = path.resolve(distRoot, `tree-shake-${entryName}-stats.json`)
      const stats = {
        entry: entryName,
        moduleCount: chunkModules.size,
        chunkBytes,
        modules: [...chunkModules].sort(),
      }

      this.emitFile({
        type: 'asset',
        fileName: `tree-shake-${entryName}-stats.json`,
        source: JSON.stringify(stats, null, 2),
      })
      this.warn(`tree-shake stats will be emitted to ${outputPath}`)
    },
  }
}

export default defineConfig(() => {
  const entry = process.env.TREE_SHAKE_ENTRY === 'subpath' ? 'main-subpath.tsx' : 'main-root.tsx'
  const entryName = entry === 'main-subpath.tsx' ? 'subpath' : 'root'

  return {
    root: __dirname,
    plugins: [react(), moduleStatsPlugin(entryName)],
    build: {
      outDir: path.resolve(distRoot),
      emptyOutDir: false,
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
      },
    },
    resolve: {
      alias: [
        {
          find: '@spkm/ui/button',
          replacement: path.resolve(distRoot, 'components/ui/button.js'),
        },
        {
          find: '@spkm/ui/sidebar',
          replacement: path.resolve(distRoot, 'components/ui/sidebar.js'),
        },
        {
          find: '@spkm/ui/nav-main',
          replacement: path.resolve(distRoot, 'components/nav/nav-main.js'),
        },
        {
          find: '@spkm/ui/nav-user',
          replacement: path.resolve(distRoot, 'components/nav/nav-user.js'),
        },
        {
          find: '@spkm/ui/app-sidebar',
          replacement: path.resolve(distRoot, 'components/app-sidebar.js'),
        },
        {
          find: '@spkm/ui/agent-chat',
          replacement: path.resolve(distRoot, 'components/agent-chat.js'),
        },
        {
          find: /^@spkm\/ui\/(.+)$/,
          replacement: path.resolve(distRoot, '$1.js'),
        },
        {
          find: '@spkm/ui',
          replacement: path.resolve(distRoot, 'index.js'),
        },
      ],
    },
    define: {
      __TREE_SHAKE_ENTRY__: JSON.stringify(entry),
    },
    optimizeDeps: {
      entries: [path.resolve(__dirname, 'src', entry)],
    },
  }
})
