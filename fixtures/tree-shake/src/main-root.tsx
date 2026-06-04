import React from 'react'
import { createRoot } from 'react-dom/client'
import { Button, Sidebar, SidebarContent, SidebarProvider } from '@spkm/ui'

function App() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <Button variant="outline">Root Import</Button>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

const root = document.createElement('div')
document.body.append(root)
createRoot(root).render(<App />)
