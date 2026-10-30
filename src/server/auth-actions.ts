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
  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, error: "User account not found." };
  }

  const sessionUser: UserSession = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };

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
  return getPublicUsers();
}
