import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const source = resolve('src/styles.css')
const target = resolve('dist/styles.css')

await mkdir(dirname(target), { recursive: true })
await copyFile(source, target)
