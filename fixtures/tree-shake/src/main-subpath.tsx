import React from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@spkm/ui/button'
import { Sidebar, SidebarContent, SidebarProvider } from '@spkm/ui/sidebar'

function App() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <Button variant="outline">Subpath Import</Button>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

const root = document.createElement('div')
document.body.append(root)
createRoot(root).render(<App />)
