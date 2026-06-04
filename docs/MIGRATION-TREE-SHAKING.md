# Tree-Shaking Migration Guide

## Why change

`@spkm/ui` now publishes module-preserved ESM output with first-class subpath exports.  
Goal: consumer bundlers parse only imported modules, reducing module graph size and build memory pressure.

## What stays compatible

- Existing root imports still work:

```ts
import { Button, Sidebar } from '@spkm/ui'
```

- Styles import unchanged:

```ts
import '@spkm/ui/styles.css'
```

## Recommended migration

Prefer subpath imports for production apps:

```ts
import { Button } from '@spkm/ui/button'
import { Sidebar, SidebarProvider, SidebarInset } from '@spkm/ui/sidebar'
import { NavMain } from '@spkm/ui/nav-main'
import { NavUser } from '@spkm/ui/nav-user'
```

Also available:

- `@spkm/ui/app-sidebar`
- `@spkm/ui/agent-chat`
- `@spkm/ui/release-badge`
- `@spkm/ui/status-row`
- `@spkm/ui/use-mobile`
- `@spkm/ui/utils`
- `@spkm/ui/types/navigation`

## Expected impact

- Smaller parsed module graph in consumer builds
- Less unrelated dependency loading (for example `recharts` not touched when importing only `button` + `sidebar`)
- Lower peak memory during Vite/Rollup builds
