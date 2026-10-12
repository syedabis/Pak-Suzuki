"use server";

import { cookies } from "next/headers";

import { findUserByEmail, getPublicUsers, verifyCredentials } from "@/lib/auth/env-users";
import { createSessionToken, SESSION_COOKIE_NAME, type UserSession, verifySessionToken } from "@/lib/auth/session";

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: UserSession;
}

export async function loginAction(data: { email: string; password: string; remember?: boolean }): Promise<LoginResult> {
  const email = data.email?.trim();
  const password = data.password;

  if (!email || !password) {
    return { success: false, error: "Please enter both email and password." };
  }

  const user = verifyCredentials(email, password);
  if (!user) {
    return {
      success: false,
      error: "Invalid email or password. Please verify the credentials configured in .env.local",
    };
  }

  const sessionUser: UserSession = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
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
