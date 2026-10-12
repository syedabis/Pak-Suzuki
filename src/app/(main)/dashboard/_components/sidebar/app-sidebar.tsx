"use client";

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
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { rootUser } from "@/data/users";
import type { UserSession } from "@/lib/auth/session";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { readonly user?: UserSession }) {
  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.values.sidebar_variant,
      sidebarCollapsible: s.values.sidebar_collapsible,
      isSynced: s.isSynced,
    })),
  );

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="h-12 hover:bg-sidebar-accent/50">
              <Link prefetch={false} href="/dashboard/ecommerce" className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-14 shrink-0 items-center justify-center">
                  <Image
                    src="/meezan_logo.png"
                    alt="Meezan Oil"
                    width={56}
                    height={26}
                    className="h-6.5 w-auto object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="font-bold text-foreground text-sm tracking-tight">{APP_CONFIG.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Field Sales Ops</span>
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
