"use client";

import React, { createContext, useContext } from "react";
import type { UserSession } from "@/lib/auth/session";

export interface UserContextType {
  user: UserSession;
  isAdmin: boolean;
  isViewer: boolean;
  roleName: string;
}

const UserContext = createContext<UserContextType | null>(null);

export function isDashboardAdmin(role?: string | null): boolean {
  if (!role) return false;
  const normalized = role.toLowerCase().trim();
  return (
    normalized === "dashboard admin access" ||
    normalized === "system administrator" ||
    normalized === "administrator" ||
    normalized === "admin"
  );
}

export function isDashboardViewer(role?: string | null): boolean {
  if (!role) return false;
  const normalized = role.toLowerCase().trim();
  return (
    normalized === "dashboard view access" ||
    normalized === "viewer" ||
    normalized === "view only" ||
    normalized === "read only"
  );
}

export function UserSessionProvider({ user, children }: { user: UserSession; children: React.ReactNode }) {
  const isAdmin = isDashboardAdmin(user?.role);
  const isViewer = isDashboardViewer(user?.role);

  return (
    <UserContext.Provider
      value={{
        user,
        isAdmin,
        isViewer,
        roleName: user?.role || (isAdmin ? "Dashboard Admin Access" : "Dashboard View Access"),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserSession(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) {
    return {
      user: {
        id: "default",
        name: "Dashboard User",
        username: "user",
        email: "user@paksuzuki.com.pk",
        avatar: "",
        role: "Dashboard View Access",
      },
      isAdmin: false,
      isViewer: true,
      roleName: "Dashboard View Access",
    };
  }
  return ctx;
}
