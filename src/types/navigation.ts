import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  id?: string
  name: string
  path: string
}

export type NavGroup = {
  title: string
  path?: string
  icon?: LucideIcon
  imageSrc?: string
  imageAlt?: string
  items?: NavItem[]
}

export type NavUserInfo = {
  name?: string | null
  email?: string | null
  image?: string | null
}
