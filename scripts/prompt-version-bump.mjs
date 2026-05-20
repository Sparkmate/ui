#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const shouldSkip =
  process.env.CI === 'true' ||
  process.env.SKIP_VERSION_BUMP === '1' ||
  !process.stdin.isTTY

if (shouldSkip) {
  process.exit(0)
}

const packageJsonPath = path.resolve(process.cwd(), 'package.json')
const raw = fs.readFileSync(packageJsonPath, 'utf8')
const pkg = JSON.parse(raw)

const semver = /^(\d+)\.(\d+)\.(\d+)(-.+)?$/
const match = semver.exec(pkg.version)

if (!match) {
  console.error(`Invalid semver in package.json: "${pkg.version}"`)
  process.exit(1)
}

const [, majorRaw, minorRaw, patchRaw, prerelease] = match
let major = Number(majorRaw)
let minor = Number(minorRaw)
let patch = Number(patchRaw)

const rl = readline.createInterface({ input, output })

try {
  output.write('\nVersion bump before commit:\n')
  output.write('  [p] patch  [m] minor  [M] major  [s] skip\n')
  const answer = (await rl.question('Choose bump type: ')).trim()

  if (answer === 's' || answer === '') {
    output.write('Skip version bump.\n')
    process.exit(0)
  }

  if (answer === 'p') {
    patch += 1
  } else if (answer === 'm') {
    minor += 1
    patch = 0
  } else if (answer === 'M') {
    major += 1
    minor = 0
    patch = 0
  } else {
    console.error('Invalid choice. Use p, m, M, or s.')
    process.exit(1)
  }

  pkg.version = `${major}.${minor}.${patch}${prerelease ?? ''}`
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')
  output.write(`Version updated -> ${pkg.version}\n`)
  output.write('Remember to stage package.json if hook runner does not auto-stage.\n')
} finally {
  rl.close()
}
