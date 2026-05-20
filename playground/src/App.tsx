import * as React from 'react'
import { BookOpen, Home } from 'lucide-react'
import { useState } from 'react'

import {
  AgentChat,
  AppSidebar,
  ReleaseBadge,
  SidebarInset,
  SidebarProvider,
  StatusRow,
  type NavGroup,
} from '../../src'

const demoImageIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Crect x='1' y='1' width='18' height='18' stroke='%23EFFF2F' stroke-width='2'/%3E%3Ccircle cx='10' cy='10' r='4' fill='%23EFFF2F'/%3E%3C/svg%3E"

const demoNavGroups: NavGroup[] = [
  {
    title: 'Home',
    icon: Home,
    path: '/',
    items: [],
  },
  {
    title: 'Docs',
    icon: BookOpen,
    items: [
      { name: 'Getting started', path: '/docs/start' },
      { name: 'Components', path: '/docs/components' },
    ],
  },
  {
    title: 'Image item',
    path: '/image-item',
    imageSrc: demoImageIcon,
    imageAlt: 'Image icon sample',
    items: [],
  },
]

export function App() {
  const [pathname, setPathname] = useState('/docs/start')
  const [chatMessages, setChatMessages] = useState<
    { id?: string; role: 'user' | 'assistant'; content: string }[]
  >([])

  return (
    <SidebarProvider>
      <AppSidebar
        groups={demoNavGroups}
        pathname={pathname}
        onNavigate={setPathname}
        user={{
          name: 'Sparkmate User',
          email: 'user@sparkmate.com',
        }}
        afterNavMain={
          <p className="px-2 text-xs text-muted">Custom slot after NavMain</p>
        }
        beforeNavUser={
          <p className="px-2 pb-2 text-xs text-muted">Custom slot before NavUser</p>
        }
        onSignOut={() => {
          console.log('sign out')
        }}
      />
      <SidebarInset className="p-8">
        <main className="grid h-full gap-4 lg:grid-cols-2">
          <section className="border border-line bg-panel p-6">
            <span className="serial text-spark">Sparkmate UI</span>
            <h1 className="mt-2 text-3xl">App Sidebar</h1>
            <p className="mt-2 text-sm text-muted">
              Current path: <code>{pathname}</code>
            </p>
            <div className="mt-6 space-y-2 border-t border-line pt-4">
              <ReleaseBadge label="AI-Core-Agents" version="2.6.0" />
              <div className="space-y-1">
                <StatusRow status="online" label="Web Search" />
                <StatusRow status="disabled" label="Slack MCP" />
                <StatusRow status="error" label="Notion MCP" />
                <StatusRow status="unknown" label="Linear MCP" />
              </div>
            </div>
          </section>

          <section className="min-h-[520px]">
            <AgentChat
              messages={chatMessages}
              onMessagesChange={setChatMessages}
              assistantName="Kim"
              assistantAvatarSrc="/Kim.png"
              modelLabel="GPT-5.1"
              emptyTitle="Kim. Ready."
              emptyDescription="Ask anything about production, team communications, or factory telemetry."
              placeholder="Enter query..."
              onSubmit={async (text) => ({
                role: 'assistant',
                content: `Demo response from @sparkmate/ui chat for: "${text}"`,
              })}
            />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
