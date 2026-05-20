import * as React from 'react'

import {
  AgentChat,
  AppSidebar,
  SidebarInset,
  SidebarProvider,
  type AgentChatMessage,
  type NavGroup,
} from '../src'

import '../src/styles.css'

const navGroups: NavGroup[] = [
  {
    title: 'Home',
    path: '/',
    items: [],
  },
  {
    title: 'Kim',
    path: '/kim',
    imageSrc: '/Kim.png',
    imageAlt: 'Kim',
    items: [{ name: 'Chat', path: '/kim/chat' }],
  },
]

export function AiExamples() {
  const [pathname, setPathname] = React.useState('/kim/chat')
  const [messages, setMessages] = React.useState<AgentChatMessage[]>([])

  return (
    <SidebarProvider>
      <AppSidebar
        groups={navGroups}
        pathname={pathname}
        onNavigate={setPathname}
        user={{ name: 'Sparkmate User', email: 'user@sparkmate.com' }}
        onSignOut={() => {
          console.log('sign out')
        }}
      />
      <SidebarInset className="p-4">
        <AgentChat
          messages={messages}
          onMessagesChange={setMessages}
          assistantName="Kim"
          assistantAvatarSrc="/Kim.png"
          modelLabel="GPT-5.1"
          onSubmit={async (text) => ({
            role: 'assistant',
            content: `Demo answer: ${text}`,
          })}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
