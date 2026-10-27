"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import { useShallow } from "zustand/react/shallow";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { rootUser } from "@/data/users";
import type { UserSession } from "@/lib/auth/session";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { readonly user?: UserSession }) {
  const { open, setOpen, isMobile } = useSidebar();
  const wasCollapsedRef = useRef(false);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.values.sidebar_variant,
      sidebarCollapsible: s.values.sidebar_collapsible,
      isSynced: s.isSynced,
    })),
  );

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (!open && !isMobile) {
      wasCollapsedRef.current = true;
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (wasCollapsedRef.current && !isMobile) {
      leaveTimerRef.current = setTimeout(() => {
        setOpen(false);
        wasCollapsedRef.current = false;
      }, 200);
    }
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  return (
    <Sidebar
      {...props}
      variant={variant}
      collapsible={collapsible}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="h-14 hover:bg-sidebar-accent/50 px-1.5">
              <Link
                prefetch={false}
                href="/dashboard/campaign-overview"
                className="flex items-center justify-start w-full"
              >
                <div className="relative flex h-10 items-center justify-start">
                  <Image
                    src="/air%20baloon%20logos%2012x3-4.png"
                    alt="Pak Suzuki"
                    width={180}
                    height={50}
                    className="h-10 w-auto object-contain object-left"
                    priority
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ?? rootUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
