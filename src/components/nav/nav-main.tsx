'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import * as React from 'react'

import type { NavGroup } from '../../types/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '../ui/sidebar'

export type NavMainProps = {
  groups: NavGroup[]
  pathname: string
  onNavigate: (path: string) => void
}

export function NavMain({ groups, pathname, onNavigate }: NavMainProps) {
  const { isMobile, setOpenMobile } = useSidebar()

  const findGroupForPath = React.useCallback(
    (path: string) =>
      groups.find((group) => {
        const groupPath = group.path ?? `/${group.title.toLowerCase()}`
        return (
          path === groupPath ||
          (group.items?.some(
            (item) =>
              path === item.path ||
              (item.path !== '/' && path.startsWith(item.path)),
          ) ??
            false)
        )
      }),
    [groups],
  )

  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(() => {
    const current = findGroupForPath(pathname)
    return current?.title ?? null
  })

  const userCollapsed = React.useRef<string | null>(null)
  const prevPathname = React.useRef(pathname)

  React.useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      userCollapsed.current = null
      const current = findGroupForPath(pathname)
      if (current) {
        setExpandedGroup(current.title)
      }
    }
  }, [findGroupForPath, pathname])

  const isGroupActive = (group: NavGroup) => {
    const groupPath = group.path ?? `/${group.title.toLowerCase()}`
    if (pathname === groupPath) return true
    return (
      group.items?.some(
        (item) =>
          pathname === item.path ||
          (item.path !== '/' && pathname.startsWith(item.path)),
      ) ?? false
    )
  }

  const handleGroupClick = (event: React.MouseEvent, group: NavGroup) => {
    event.preventDefault()
    const hasItems = (group.items?.length ?? 0) > 0
    const groupPath = group.path ?? `/${group.title.toLowerCase()}`

    if (expandedGroup === group.title && hasItems) {
      userCollapsed.current = group.title
      setExpandedGroup(null)
      return
    }

    userCollapsed.current = null
    setExpandedGroup(group.title)
    onNavigate(groupPath)
  }

  const handleSubmenuLinkClick = (path: string) => {
    onNavigate(path)
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {groups.map((group) => {
          const isExpanded = expandedGroup === group.title
          const hasItems = (group.items?.length ?? 0) > 0
          const GroupIcon = group.icon
          const hasImage = Boolean(group.imageSrc)

          return (
            <Collapsible
              key={group.title}
              asChild
              open={isExpanded}
              onOpenChange={() => {}}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={group.title}
                    isActive={isGroupActive(group)}
                    className={
                      isGroupActive(group)
                        ? 'border-l-2 border-brand-primary'
                        : 'border-l-2 border-transparent'
                    }
                    onClick={(event: React.MouseEvent) =>
                      handleGroupClick(event, group)
                    }
                  >
                    {hasImage ? (
                      <img
                        src={group.imageSrc}
                        alt={group.imageAlt ?? group.title}
                        className="h-5 w-5 flex-shrink-0 object-cover"
                        style={{ borderRadius: 0 }}
                      />
                    ) : GroupIcon ? (
                      <GroupIcon />
                    ) : null}
                    <span>{group.title}</span>
                    {hasItems &&
                      (isExpanded ? (
                        <ChevronDown className="ml-auto" />
                      ) : (
                        <ChevronRight className="ml-auto" />
                      ))}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {hasItems ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {group.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.path}>
                          <SidebarMenuSubButton
                            isActive={pathname === subItem.path}
                            className={
                              pathname === subItem.path
                                ? 'border-l-2 border-brand-primary'
                                : 'border-l-2 border-transparent'
                            }
                            asChild
                          >
                            <a
                              href={subItem.path}
                              onClick={(event) => {
                                event.preventDefault()
                                handleSubmenuLinkClick(subItem.path)
                              }}
                            >
                              <span>{subItem.name}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
