import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = resolve('.')
const distDir = resolve(root, 'dist')
const viteBin = resolve(root, 'node_modules/vite/bin/vite.js')
const fixtureConfig = resolve(root, 'fixtures/tree-shake/vite.config.ts')

function run(command, env = {}) {
  const fullEnv = { ...process.env, ...env }
  const result = spawnSync(command, {
    cwd: root,
    env: fullEnv,
    shell: true,
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || '').trim())
  }
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`
}

function parseMaxRss(timeOutput) {
  const labelFirst = timeOutput.match(/maximum resident set size\s+(\d+)/i)
  if (labelFirst) return Number(labelFirst[1])

  const valueFirst = timeOutput.match(/^\s*(\d+)\s+maximum resident set size$/im)
  if (valueFirst) return Number(valueFirst[1])

  return null
}

async function readStats(name) {
  const path = resolve(distDir, `tree-shake-${name}-stats.json`)
  const raw = await readFile(path, 'utf8')
  return JSON.parse(raw)
}

function hasHeavyDeps(modules) {
  const heavyPatterns = [
    'recharts',
    'react-day-picker',
    'embla-carousel',
    'date-fns',
    'cmdk',
    'vaul',
  ]
  return heavyPatterns.filter((dep) => modules.some((id) => id.includes(`/node_modules/${dep}/`)))
}

function kb(bytes) {
  return Number((bytes / 1024).toFixed(2))
}

console.log('Building package with unbundled output...')
run('./node_modules/.bin/tsdown --config-loader tsx')
run('node ./scripts/copy-styles.mjs')

const command = `/usr/bin/time -l node "${viteBin}" build --config "${fixtureConfig}"`

console.log('Running root-import fixture build...')
const rootOutput = run(command, { TREE_SHAKE_ENTRY: 'root' })

console.log('Running subpath-import fixture build...')
const subpathOutput = run(command, { TREE_SHAKE_ENTRY: 'subpath' })

const rootStats = await readStats('root')
const subpathStats = await readStats('subpath')

const report = {
  rootImport: {
    moduleCount: rootStats.moduleCount,
    chunkBytes: rootStats.chunkBytes,
    chunkKiB: kb(rootStats.chunkBytes),
    maxRssKb: parseMaxRss(rootOutput),
    heavyDepsDetected: hasHeavyDeps(rootStats.modules),
  },
  subpathImport: {
    moduleCount: subpathStats.moduleCount,
    chunkBytes: subpathStats.chunkBytes,
    chunkKiB: kb(subpathStats.chunkBytes),
    maxRssKb: parseMaxRss(subpathOutput),
    heavyDepsDetected: hasHeavyDeps(subpathStats.modules),
  },
}

report.delta = {
  moduleCount: report.subpathImport.moduleCount - report.rootImport.moduleCount,
  chunkKiB: Number((report.subpathImport.chunkKiB - report.rootImport.chunkKiB).toFixed(2)),
  maxRssKb:
    report.subpathImport.maxRssKb && report.rootImport.maxRssKb
      ? report.subpathImport.maxRssKb - report.rootImport.maxRssKb
      : null,
}

await writeFile(resolve(distDir, 'tree-shaking-report.json'), JSON.stringify(report, null, 2))

console.log('Tree-shaking report written: dist/tree-shaking-report.json')
console.log(JSON.stringify(report, null, 2))
