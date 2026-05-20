# Publish `@spkm/ui` to npm

## Why you do not see Trusted Publisher yet

Trusted Publisher is **not** in org settings or account settings.

It appears only on an **existing package page**:

`npmjs.com/package/@spkm/ui` -> **Settings** -> **Trusted publishing**

npm requires the package to be published **at least once** before you can configure trusted publishing.

Reference: [npm trusted publishers docs](https://docs.npmjs.com/trusted-publishers/)

## Step 1: First publish locally (one time)

From this repo on your machine:

```bash
npm login
bun run build
npm publish --access public
```

- npm will ask for 2FA OTP once (local only, fine)
- this creates `@spkm/ui` under org `spkm`

## Step 2: Enable Trusted Publisher

After first publish:

1. Open https://www.npmjs.com/package/@spkm/ui
2. Click **Settings** (package settings, not org settings)
3. Open **Trusted publishing**
4. Select **GitHub Actions**
5. Set:
   - Repository owner: `Sparkmate`
   - Repository name: `ui`
   - Workflow filename: `publish-npm.yml` (filename only)
6. Save

Optional hardening (after trusted publishing works):

- Package Settings -> **Publishing access** -> "Require two-factor authentication and disallow tokens"

## Step 3: CI publishes next versions

Workflow requirements already in repo:

- `permissions.id-token: write`
- Node >= 22.14
- npm CLI >= 11.5.1
- no `NPM_TOKEN` during publish

Push a new version to `main` (e.g. `1.0.2`).

## Error guide

### `E404` on `@spkm/ui`

- org `spkm` missing publish rights for auth identity
- or package not created yet (do Step 1 first)

### `EOTP` in GitHub Actions

- CI is using a 2FA publish token
- delete GitHub secret `NPM_TOKEN`
- use trusted publishing after Step 2

## Fallback: Automation token (if you skip trusted publishing)

Create npm **Automation** token (classic, bypasses OTP):

- org `spkm` -> read/write
- scope `@spkm` -> read/write

Set secret:

```bash
gh secret set NPM_TOKEN --repo Sparkmate/ui
```

And add to publish step:

```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Do not use granular publish tokens that require OTP in CI.

## Release flow

1. Bump version (commit hook or manual)
2. Push to `main`
3. GitHub Action publishes only if version not already on npm
