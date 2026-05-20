# @sparkmate/ui

Shared Sparkmate React UI package.

Includes:
- Sparkmate design tokens and CSS (`@sparkmate/ui/styles.css`)
- AI-core styled `AgentChat`
- App shell primitives (`AppSidebar`, `NavMain`, `NavUser`)
- Full shadcn/ui component set exported from one package

## AI Quickstart

Use this exact import pattern in consuming apps:

```tsx
import '@sparkmate/ui/styles.css'
import {
  AppSidebar,
  SidebarProvider,
  SidebarInset,
  AgentChat,
  type NavGroup,
} from '@sparkmate/ui'
```

### Sidebar Recipe

```tsx
const groups: NavGroup[] = [
  {
    title: 'Home',
    path: '/',
    // icon: Home, // icon OR image
    imageSrc: '/Kim.png',
    imageAlt: 'Kim',
    items: [{ name: 'Overview', path: '/overview' }],
  },
]

<SidebarProvider>
  <AppSidebar
    groups={groups}
    pathname={pathname}
    onNavigate={navigate}
    user={{ name: 'Sparkmate User', email: 'user@sparkmate.com' }}
    afterNavMain={<div className="px-2 text-xs text-muted">After nav main</div>}
    beforeNavUser={<div className="px-2 pb-2 text-xs text-muted">Before nav user</div>}
    onSignOut={signOut}
  />
  <SidebarInset>{children}</SidebarInset>
</SidebarProvider>
```

### Chat Recipe

```tsx
const [messages, setMessages] = useState([])

<AgentChat
  messages={messages}
  onMessagesChange={setMessages}
  assistantName="Kim"
  assistantAvatarSrc="/Kim.png"
  modelLabel="GPT-5.1"
  onSubmit={async (text) => ({
    role: 'assistant',
    content: `Answer for: ${text}`,
  })}
/>
```

## Development

Install:

```bash
bun install
```

Run playground:

```bash
bun run play
```

Typecheck:

```bash
bun run typecheck
```

Build:

```bash
bun run build
```

## Optional: Commit-Time Version Bump Hook

If you want every commit to ask for `patch/minor/major` and update version:

```bash
bun run hooks:install
```

Then on each commit, hook prompts:
- `p` -> patch
- `m` -> minor
- `M` -> major
- `s` -> skip

To bypass once:

```bash
SKIP_VERSION_BUMP=1 git commit -m "your message"
```
