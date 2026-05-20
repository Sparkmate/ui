# @spkm/ui

Shared Sparkmate React UI library: design tokens, Tailwind CSS, shadcn/ui primitives, app shell (`AppSidebar`), and AI chat shell (`AgentChat`).

Published on npm as [`@spkm/ui`](https://www.npmjs.com/package/@spkm/ui).

---

## Requirements

| Requirement | Version |
|-------------|---------|
| `react` | `^19.2.0` (peer) |
| `react-dom` | `^19.2.0` (peer) |
| Package manager | npm, pnpm, yarn, or bun |

Node 18+ recommended for consuming apps. React 19 is required because components use React 19 APIs.

---

## Install

```bash
npm install @spkm/ui
# or
bun add @spkm/ui
```

---

## Package exports

Only three public entry points exist:

| Import path | What you get |
|-------------|--------------|
| `@spkm/ui` | All React components, hooks, types, and `cn` |
| `@spkm/ui/styles.css` | Sparkmate tokens, Tailwind base, and component utilities (import once) |
| `@spkm/ui/package.json` | Package metadata (rarely needed) |

There are **no** deep imports like `@spkm/ui/button`. Import everything from `@spkm/ui`.

---

## Step 1: Load styles (required)

Import the stylesheet **exactly once** at your app root (before any component render):

```tsx
// main.tsx, layout.tsx, _app.tsx, or equivalent root file
import '@spkm/ui/styles.css'
```

This file includes:

- Sparkmate color tokens (`bg-canvas`, `text-spark`, `border-line`, etc.)
- DM Sans font
- Tailwind v4 base styles and shadcn theme variables
- Utility classes used by package components (`.serial`, `.prose-chat`, `.app-release-badge`, etc.)

If you skip this import, components render unstyled.

### Vite

```ts
// vite.config.ts — no extra Tailwind config required for @spkm/ui itself
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
})
```

```tsx
// src/main.tsx
import '@spkm/ui/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Next.js (App Router)

Put the CSS import in your root layout:

```tsx
// app/layout.tsx
import '@spkm/ui/styles.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

Client components that use interactive primitives (`AppSidebar`, `AgentChat`, dialogs, etc.) must be in files with `'use client'` at the top. The root layout can stay a Server Component as long as it only imports CSS.

### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import '@spkm/ui/styles.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

---

## Step 2: Import components

```tsx
import {
  AppSidebar,
  SidebarProvider,
  SidebarInset,
  AgentChat,
  Button,
  cn,
  type NavGroup,
  type AgentChatMessage,
} from '@spkm/ui'
```

---

## Ownership: what the package does vs your app

| Package owns | Your app owns |
|--------------|---------------|
| UI components and styling | Routes and URL state |
| Design tokens and layout primitives | Auth/session and `onSignOut` |
| `AgentChat` presentation and input UX | API calls, streaming, tool use |
| `AppSidebar` / `NavMain` rendering | `groups` nav configuration |
| Default empty-state copy in chat | Business logic in `onSubmit` |

The package does **not** ship default navigation, auth, or backend wiring.

---

## App shell: sidebar layout

### Minimal layout

`AppSidebar` must be wrapped in `SidebarProvider`. Page content goes in `SidebarInset`.

```tsx
import { useState } from 'react'
import {
  AppSidebar,
  SidebarProvider,
  SidebarInset,
  type NavGroup,
} from '@spkm/ui'

const navGroups: NavGroup[] = [
  {
    title: 'Home',
    path: '/',
    items: [{ name: 'Overview', path: '/overview' }],
  },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState('/')

  return (
    <SidebarProvider>
      <AppSidebar
        groups={navGroups}
        pathname={pathname}
        onNavigate={setPathname}
        user={{ name: 'Jane Doe', email: 'jane@example.com' }}
        onSignOut={() => console.log('sign out')}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
```

### With React Router

Wire `pathname` and `onNavigate` to the router — the package does not call `useNavigate` for you.

```tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { AppSidebar, SidebarProvider, SidebarInset, type NavGroup } from '@spkm/ui'

const navGroups: NavGroup[] = [/* ... */]

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <SidebarProvider>
      <AppSidebar
        groups={navGroups}
        pathname={pathname}
        onNavigate={(path) => navigate(path)}
        user={{ name: 'Jane Doe', email: 'jane@example.com' }}
        onSignOut={async () => { /* your auth logout */ }}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
```

### `NavGroup` shape

```ts
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  id?: string      // optional stable key; path is used if omitted
  name: string     // label in submenu
  path: string     // route path, e.g. '/settings/profile'
}

type NavGroup = {
  title: string           // sidebar group label (also used as React key)
  path?: string           // default: `/${title.toLowerCase()}`
  icon?: LucideIcon       // lucide icon component
  imageSrc?: string       // alternative to icon (square image, 20×20 area)
  imageAlt?: string
  items?: NavItem[]       // submenu entries; omit or [] for leaf group
}

type NavUserInfo = {
  name?: string | null
  email?: string | null
  image?: string | null   // avatar URL
}
```

**Icon vs image:** use `icon` (Lucide component) **or** `imageSrc`, not both for the same group.

**Active state:** a group is active when `pathname` equals the group `path` (or derived path) or matches any child `item.path` (prefix match for non-root paths).

**Expand/collapse:** groups with `items` expand on click; clicking an expanded group collapses it. Route changes auto-expand the group that contains the current path.

### `AppSidebar` props

| Prop | Required | Type | Description |
|------|----------|------|-------------|
| `groups` | yes | `NavGroup[]` | Full nav tree; no defaults |
| `pathname` | yes | `string` | Current URL path for active styles |
| `onNavigate` | yes | `(path: string) => void` | Called when user selects nav; you update router/state |
| `user` | yes | `NavUserInfo` | Footer user block |
| `onSignOut` | no | `() => void \| Promise<void>` | Shows logout button when set |
| `onProfileClick` | no | `() => void` | Makes avatar/name clickable |
| `logoSrc` | no | `string` | Header logo (expanded sidebar); Sparkmate default URL if omitted |
| `logoIconSrc` | no | `string` | Icon when sidebar collapsed to rail |
| `afterNavMain` | no | `React.ReactNode` | Slot below nav links, above footer |
| `beforeNavUser` | no | `React.ReactNode` | Slot above user row |
| `...props` | — | `Sidebar` props | Passed to underlying shadcn `Sidebar` (`side`, `variant`, etc.) |

### Custom slots example

```tsx
<AppSidebar
  groups={groups}
  pathname={pathname}
  onNavigate={navigate}
  user={session.user}
  afterNavMain={<ReleaseBadge label="My Service" version="1.2.0" />}
  beforeNavUser={<StatusRow status="online" label="API" />}
  onSignOut={signOut}
/>
```

### Composing lower-level nav pieces

If you need a custom sidebar layout, use the same primitives:

```tsx
import { NavMain, NavUser, Sidebar, SidebarContent, SidebarFooter } from '@spkm/ui'
```

`NavMain` requires the same `groups`, `pathname`, and `onNavigate` as `AppSidebar`.

---

## Agent chat: `AgentChat`

Presentation-only chat UI. You implement AI/backend logic in `onSubmit`.

### Controlled messages (recommended for real apps)

```tsx
import { useState } from 'react'
import { AgentChat, type AgentChatMessage } from '@spkm/ui'

export function ChatPanel() {
  const [messages, setMessages] = useState<AgentChatMessage[]>([])

  return (
    <AgentChat
      messages={messages}
      onMessagesChange={setMessages}
      assistantName="Kim"
      assistantAvatarSrc="/avatars/kim.png"
      assistantAvatarAlt="Kim"
      modelLabel="GPT-5.1"
      placeholder="Ask a question..."
      onSubmit={async (text) => {
        const res = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: text }),
        })
        const data = await res.json()
        return { role: 'assistant', content: data.reply }
      }}
    />
  )
}
```

### Uncontrolled messages

Omit `messages` / `onMessagesChange`; optional `defaultMessages` seeds initial state.

```tsx
<AgentChat
  defaultMessages={[{ role: 'assistant', content: 'Hello.', id: '1' }]}
  onSubmit={async (text) => ({ role: 'assistant', content: `Echo: ${text}` })}
/>
```

### `onSubmit` contract

```ts
onSubmit?: (
  text: string,
) =>
  | void
  | AgentChatMessage
  | AgentChatMessage[]
  | Promise<void | AgentChatMessage | AgentChatMessage[]>
```

| Return value | Behavior |
|--------------|----------|
| `void` / `undefined` | User message is kept; you must update messages yourself (e.g. via controlled `messages`) |
| Single `AgentChatMessage` | Appended after user message; `id` and `ts` auto-filled if missing |
| `AgentChatMessage[]` | All appended in order |
| Promise | Same rules after resolve; shows loading spinner until settled |

`AgentChatMessage` fields:

```ts
type AgentChatRole = 'user' | 'assistant'

type AgentChatMessage = {
  id?: string
  role: AgentChatRole
  content: string
  ts?: string    // display timestamp; auto-generated if omitted on submit
}
```

### `AgentChat` props reference

| Prop | Default | Description |
|------|---------|-------------|
| `messages` | — | Controlled message list |
| `onMessagesChange` | — | Called when messages change (send, clear, submit result) |
| `defaultMessages` | `[]` | Initial messages when uncontrolled |
| `onSubmit` | — | Handler for user sends and suggestion clicks |
| `suggestions` | 4 investor-style prompts | Empty-state quick actions |
| `placeholder` | `'What would you like to know?'` | Input placeholder |
| `emptyTitle` | `'Welcome to your AI copilot'` | Empty state heading |
| `emptyDescription` | `'Ask a question to get started.'` | Empty state subtext |
| `assistantName` | `'AI'` | Used in avatar alt fallback |
| `assistantAvatarSrc` | — | Assistant avatar image URL |
| `assistantAvatarAlt` | — | Avatar alt; falls back to `assistantName` |
| `modelLabel` | — | Shown bottom-right (e.g. model name) |
| `showClear` | `true` | Show "New chat" when thread has messages |
| `onClear` | — | Called after clear, in addition to resetting messages |
| `showClose` | `false` | Show close button (requires `onClose`) |
| `onClose` | — | Close button handler |
| `disabled` | `false` | Disables input, suggestions, and send |
| `className` | — | Root container classes |

**Keyboard:** Enter sends; Shift+Enter inserts a newline. Suggestion buttons call `onSubmit` with the suggestion text.

**Layout:** parent should give the chat a bounded height (e.g. `min-h-[520px]` or `h-full` in a flex child). Root uses `h-full flex flex-col`.

### Streaming / multi-turn pattern

`onSubmit` runs once per user message. For streaming, use controlled mode and update `messages` from your stream handler instead of returning from `onSubmit`:

```tsx
onSubmit={async (text) => {
  const userMsg = { role: 'user' as const, content: text }
  setMessages((prev) => [...prev, userMsg])
  const assistantId = crypto.randomUUID()
  setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])
  for await (const chunk of streamFromApi(text)) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantId ? { ...m, content: m.content + chunk } : m,
      ),
    )
  }
  // return void — you already updated state
}}
```

---

## Sparkmate status components

### `ReleaseBadge`

```tsx
import { ReleaseBadge } from '@spkm/ui'

<ReleaseBadge label="AI-Core-Agents" version="2.6.0" />
// Renders: "AI-Core-Agents v2.6.0"

<ReleaseBadge label="Beta" />
// Renders: "Beta" (no version)
```

### `StatusRow` / `StatusDot`

```tsx
import { StatusRow, StatusDot, type StatusState } from '@spkm/ui'

type StatusState = 'online' | 'error' | 'disabled' | 'unknown'

<StatusRow status="online" label="Web Search" />
<StatusRow status="error" label="Notion MCP" value="401" />
<StatusDot status="unknown" />
```

---

## shadcn/ui primitives

All components under `src/components/ui/*` are re-exported from `@spkm/ui`. Import by name:

```tsx
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast, // from sonner wrapper if exported
  Toaster,
} from '@spkm/ui'
```

Available UI modules (each exports its shadcn API):

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `button-group`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `dialog`, `direction`, `drawer`, `dropdown-menu`, `empty`, `field`, `form`, `hover-card`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `menubar`, `native-select`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`

Sidebar-related exports used by `AppSidebar`:

`Sidebar`, `SidebarProvider`, `SidebarInset`, `SidebarTrigger`, `SidebarContent`, `SidebarHeader`, `SidebarFooter`, `useSidebar`, etc.

---

## Utilities

### `cn(...classes)`

```tsx
import { cn } from '@spkm/ui'

<div className={cn('px-2', isActive && 'border-brand-primary')} />
```

Combines `clsx` + `tailwind-merge` (same pattern as shadcn).

### `useIsMobile()`

```tsx
import { useIsMobile } from '@spkm/ui'

const isMobile = useIsMobile() // true when viewport < 768px
```

Used internally by sidebar/nav; safe to use in consumer layouts.

---

## Design tokens (Tailwind classes)

Prefer these semantic classes in app code that sits beside `@spkm/ui`:

| Token class | Role |
|-------------|------|
| `bg-canvas` | App background |
| `bg-panel` | Elevated panels |
| `bg-surface` | Inputs, cards |
| `border-line` | Default borders |
| `text-body` | Primary text |
| `text-muted` | Secondary text |
| `text-spark` | Brand accent (yellow-green) |
| `bg-spark` | Accent fills |
| `serial` | Uppercase mono-style labels |
| `prose-chat` | Chat message typography |

CSS variables are defined in `@spkm/ui/styles.css` (`--canvas`, `--spark`, etc.). Do not duplicate the theme in a second Tailwind config unless you have a deliberate reason; that can cause conflicting tokens.

---

## Full page example

```tsx
import { useState } from 'react'
import { Home } from 'lucide-react'
import {
  AgentChat,
  AppSidebar,
  ReleaseBadge,
  SidebarInset,
  SidebarProvider,
  StatusRow,
  type AgentChatMessage,
  type NavGroup,
} from '@spkm/ui'

const groups: NavGroup[] = [
  { title: 'Home', icon: Home, path: '/', items: [] },
  {
    title: 'Settings',
    items: [
      { name: 'Profile', path: '/settings/profile' },
      { name: 'Billing', path: '/settings/billing' },
    ],
  },
]

export function DashboardPage() {
  const [pathname, setPathname] = useState('/')
  const [messages, setMessages] = useState<AgentChatMessage[]>([])

  return (
    <SidebarProvider>
      <AppSidebar
        groups={groups}
        pathname={pathname}
        onNavigate={setPathname}
        user={{ name: 'Sparkmate User', email: 'user@sparkmate.com' }}
        afterNavMain={<ReleaseBadge label="API" version="1.0.1" />}
        onSignOut={() => alert('Sign out wired in app')}
      />
      <SidebarInset className="p-6">
        <div className="grid h-[calc(100vh-3rem)] gap-4 lg:grid-cols-2">
          <section className="border border-line bg-panel p-6">
            <h1>Current path</h1>
            <code>{pathname}</code>
            <StatusRow status="online" label="Connected" />
          </section>
          <section className="min-h-[520px] border border-line">
            <AgentChat
              messages={messages}
              onMessagesChange={setMessages}
              assistantName="Kim"
              assistantAvatarSrc="/Kim.png"
              modelLabel="GPT-5.1"
              onSubmit={async (text) => ({
                role: 'assistant',
                content: `Response for: ${text}`,
              })}
            />
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Unstyled / no colors | Add `import '@spkm/ui/styles.css'` once at app root |
| `AppSidebar` nav does nothing | Implement `onNavigate` and sync `pathname` with your router |
| Active nav wrong | Pass exact `pathname` from router (`useLocation().pathname`) |
| Chat height collapsed | Parent needs explicit height (`min-h-*`, `h-full`, grid row) |
| Type errors on `icon` | Import icons from `lucide-react` and pass component, not string |
| Duplicate Tailwind styles | Avoid importing a second full Tailwind preset; rely on `@spkm/ui/styles.css` |
| React version mismatch | Upgrade app to React `^19.2.0` |

---

## Agent / LLM quick reference

Stable import block for coding agents:

```tsx
import '@spkm/ui/styles.css'
import {
  AppSidebar,
  SidebarProvider,
  SidebarInset,
  AgentChat,
  type NavGroup,
  type AgentChatMessage,
} from '@spkm/ui'
```

Integration rules:

1. CSS import once at root.
2. App provides `groups`, `pathname`, `onNavigate`, `user`.
3. App implements `onSubmit` and optional controlled `messages`.
4. No default nav or auth in the package.

See [docs/CONSUMER-CONTRACT.md](./docs/CONSUMER-CONTRACT.md) for the formal contract.

---

## Developing this package

```bash
bun install
bun run play      # Vite playground at playground/
bun run typecheck
bun run build     # outputs dist/ for publish
```

Publishing: [docs/NPM_PUBLISH.md](./docs/NPM_PUBLISH.md).
