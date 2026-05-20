'use client'

import { LogOut } from 'lucide-react'

import type { NavUserInfo } from '../../types/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  SidebarMenu,
  SidebarMenuItem,
} from '../ui/sidebar'

export type NavUserProps = {
  user: NavUserInfo
  onProfileClick?: () => void
  onSignOut?: () => void | Promise<void>
}

export function NavUser({ user, onProfileClick, onSignOut }: NavUserProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <button
            type="button"
            onClick={onProfileClick}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
          >
            <Avatar className="h-6 w-6 rounded-full border border-line">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? 'User'}
                referrerPolicy="no-referrer"
                className="rounded-full object-cover"
              />
              <AvatarFallback className="rounded-full bg-surface">
                {user.email?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs leading-none text-body">
                {user.name || 'User'}
              </div>
              <p className="serial mt-0.5 truncate">{user.email}</p>
            </div>
          </button>
          {onSignOut ? (
            <button
              type="button"
              title="Sign out"
              aria-label="Sign out"
              onClick={() => {
                void onSignOut()
              }}
              className="text-muted transition hover:text-body"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
