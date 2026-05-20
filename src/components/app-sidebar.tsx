"use client";

import * as React from "react";

import type { NavGroup, NavUserInfo } from "../types/navigation";
import { Button } from "./ui/button";
import { NavMain } from "./nav/nav-main";
import { NavUser } from "./nav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  groups: NavGroup[];
  pathname: string;
  onNavigate: (path: string) => void;
  user: NavUserInfo;
  onProfileClick?: () => void;
  onSignOut?: () => void | Promise<void>;
  logoSrc?: string;
  logoIconSrc?: string;
  afterNavMain?: React.ReactNode;
  beforeNavUser?: React.ReactNode;
};

export function AppSidebar({
  groups,
  pathname,
  onNavigate,
  user,
  onProfileClick,
  onSignOut,
  logoSrc = "https://cdn.brandfetch.io/id0nvnoUuq/theme/light/logo.svg?c=1bxkv1dyj3uktf70hkd0yurufsb0MtP0E4s",
  logoIconSrc = "https://cdn.brandfetch.io/id0nvnoUuq/theme/light/symbol.svg?c=1bxkv1dyj3uktf70hkd0yurufsb0MtP0E4s",
  afterNavMain,
  beforeNavUser,
  ...props
}: AppSidebarProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="flex w-full cursor-pointer items-center justify-center px-2 py-2 hover:border-none"
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Logo"
              className="h-6 object-contain group-data-[collapsible=icon]:hidden"
            />
          ) : (
            <span className="h-6 text-sm font-semibold tracking-normal normal-case group-data-[collapsible=icon]:hidden">
              Sparkmate
            </span>
          )}
          {logoIconSrc ? (
            <img
              src={logoIconSrc}
              alt="Logo icon"
              className="hidden h-8 w-8 object-contain group-data-[collapsible=icon]:block"
            />
          ) : (
            <span className="hidden h-8 w-8 items-center justify-center rounded-none border border-border text-sm font-semibold tracking-normal normal-case group-data-[collapsible=icon]:flex">
              S
            </span>
          )}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={groups} pathname={pathname} onNavigate={onNavigate} />
        {afterNavMain}
      </SidebarContent>
      <SidebarFooter className="border-t border-brand-dark">
        {beforeNavUser}
        <NavUser
          user={user}
          {...(onProfileClick ? { onProfileClick } : {})}
          {...(onSignOut ? { onSignOut } : {})}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
