"use server";

import { cookies } from "next/headers";

import { findUserByEmail, getPublicUsers, verifyCredentials } from "@/lib/auth/env-users";
import { createSessionToken, SESSION_COOKIE_NAME, type UserSession, verifySessionToken } from "@/lib/auth/session";
import { supabase } from "@/lib/supabase";

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: UserSession;
}

export async function loginAction(data: { email: string; password: string; remember?: boolean }): Promise<LoginResult> {
  const email = data.email?.trim().toLowerCase();
  const password = data.password?.trim();

  if (!email || !password) {
    return { success: false, error: "Please enter both email and password." };
  }

  // 1. Check Supabase supervisors table first
  try {
    const { data: supervisor, error } = await supabase.from("supervisors").select("*").eq("email", email).maybeSingle();

    if (error) {
      console.warn("Supabase supervisor query error:", error.message);
    } else if (supervisor) {
      if (!supervisor.is_active) {
        return {
          success: false,
          error: "This account has been deactivated. Please contact your administrator.",
        };
      }

      if (supervisor.password && supervisor.password !== password) {
        return {
          success: false,
          error: "Invalid email or password. Please try again.",
        };
      }

      // Mobile app accounts cannot sign in to the Web Dashboard
      const roleLower = (supervisor.role || "").toLowerCase().trim();
      const isMobileAccount =
        roleLower.includes("supervisor") ||
        roleLower.includes("k-carry") ||
        roleLower.includes("kcarry") ||
        roleLower.includes("interception") ||
        roleLower.includes("visitor") ||
        roleLower.includes("master") ||
        roleLower.includes("all forms") ||
        roleLower === "field auditor" ||
        roleLower === "area manager";

      if (isMobileAccount && !roleLower.includes("admin") && !roleLower.includes("dashboard")) {
        return {
          success: false,
          error:
            "This mobile application account is for the Mobile App only. Please sign in via the mobile application.",
        };
      }

      const sessionUser: UserSession = {
        id: supervisor.id,
        name: supervisor.name,
        username: supervisor.email.split("@")[0],
        email: supervisor.email,
        avatar: "/avatars/default.png",
        role: supervisor.role || "Supervisor",
      };

      const token = await createSessionToken(sessionUser, data.remember);
      const cookieStore = await cookies();
      const maxAge = data.remember ? 30 * 86400 : 7 * 86400;

      cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge,
      });

      return { success: true, user: sessionUser };
    }
  } catch (err) {
    console.warn("Supabase auth lookup issue:", err);
  }

  // 2. Fallback to .env.local users
  const envUser = verifyCredentials(email, password);
  if (envUser) {
    const sessionUser: UserSession = {
      id: envUser.id,
      name: envUser.name,
      username: envUser.username,
      email: envUser.email,
      avatar: envUser.avatar,
      role: envUser.role,
    };

    const token = await createSessionToken(sessionUser, data.remember);
    const cookieStore = await cookies();
    const maxAge = data.remember ? 30 * 86400 : 7 * 86400;

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return { success: true, user: sessionUser };
  }

  return {
    success: false,
    error: "Invalid email or password. Please try again.",
  };
}

export async function logoutAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return null;
  }
  return verifySessionToken(sessionToken);
}

export async function switchAccountAction(email: string): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  let sessionUser: UserSession | undefined;

  // 1. Try env users
  const user = findUserByEmail(normalizedEmail);
  if (user) {
    sessionUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };
  } else {
    // 2. Try Supabase supervisors
    try {
      const { data: supervisor } = await supabase
        .from("supervisors")
        .select("*")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (supervisor) {
        if (!supervisor.is_active) {
          return { success: false, error: "This account has been deactivated." };
        }
        const roleLower = (supervisor.role || "").toLowerCase().trim();
        const isMobileAccount =
          roleLower.includes("supervisor") ||
          roleLower.includes("k-carry") ||
          roleLower.includes("kcarry") ||
          roleLower.includes("interception") ||
          roleLower.includes("visitor") ||
          roleLower.includes("master") ||
          roleLower.includes("all forms") ||
          roleLower === "field auditor" ||
          roleLower === "area manager";

        if (isMobileAccount && !roleLower.includes("admin") && !roleLower.includes("dashboard")) {
          return {
            success: false,
            error: "Cannot switch to mobile application accounts on the Web Dashboard.",
          };
        }
        sessionUser = {
          id: supervisor.id,
          name: supervisor.name,
          username: supervisor.email.split("@")[0],
          email: supervisor.email,
          avatar: "/avatars/default.png",
          role: supervisor.role || "Dashboard View Access",
        };
      }
    } catch (e) {
      console.warn("Error looking up supervisor for account switch:", e);
    }
  }

  if (!sessionUser) {
    return { success: false, error: "User account not found." };
  }

  const token = await createSessionToken(sessionUser, false);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 86400,
  });

  return { success: true };
}

export async function getAvailableUsers(): Promise<UserSession[]> {
  const envUsers = getPublicUsers();
  try {
    const { data: sups } = await supabase
      .from("supervisors")
      .select("id, name, email, role, is_active")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (sups && sups.length > 0) {
      const dashboardSups = sups.filter((s) => {
        const r = (s.role || "").toLowerCase().trim();
        return r.includes("admin") || (r.includes("view") && r.includes("dashboard")) || r === "dashboard view access";
      });

      const dbUsers: UserSession[] = dashboardSups.map((s) => ({
        id: s.id,
        name: s.name,
        username: s.email.split("@")[0],
        email: s.email,
        avatar: "",
        role: s.role || "Dashboard View Access",
      }));

      const seen = new Set<string>();
      const combined: UserSession[] = [];
      for (const u of [...envUsers, ...dbUsers]) {
        const lower = u.email.toLowerCase().trim();
        if (!seen.has(lower)) {
          seen.add(lower);
          combined.push(u);
        }
      }
      return combined;
    }
  } catch (err) {
    console.warn("Could not fetch database supervisors for user switcher:", err);
  }
  return envUsers;
}
