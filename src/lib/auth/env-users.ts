import type { UserSession } from "./session";

export interface EnvUser extends UserSession {
  password: string;
}

const DEFAULT_USERS: EnvUser[] = [
  {
    id: "user-1",
    name: "Pak Suzuki Administrator",
    username: "admin",
    email: "admin@wavex.ltd",
    password: "admin@wavex.ltd",
    avatar: "",
    role: "administrator",
  },
];

export function getEnvUsers(): EnvUser[] {
  const parsedUsers: EnvUser[] = [];

  // 1. Check for JSON format in AUTH_USERS
  if (process.env.AUTH_USERS) {
    try {
      const jsonList = JSON.parse(process.env.AUTH_USERS);
      if (Array.isArray(jsonList)) {
        for (let idx = 0; idx < jsonList.length; idx++) {
          const item = jsonList[idx];
          if (item?.email && item?.password) {
            parsedUsers.push({
              id: item.id ?? `user-${idx + 1}`,
              name: item.name ?? item.email.split("@")[0],
              username: item.username ?? item.email.split("@")[0],
              email: String(item.email).trim().toLowerCase(),
              password: String(item.password).trim(),
              avatar: item.avatar ?? "",
              role: item.role ?? "user",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Failed to parse AUTH_USERS JSON from env:", e);
    }
  }

  // 2. Check for numbered environment variables: AUTH_USER_1_..., AUTH_USER_2_..., etc.
  for (let i = 1; i <= 20; i++) {
    const email = process.env[`AUTH_USER_${i}_EMAIL`];
    const password = process.env[`AUTH_USER_${i}_PASSWORD`];

    if (email && password) {
      const name = process.env[`AUTH_USER_${i}_NAME`] || email.split("@")[0];
      const username = process.env[`AUTH_USER_${i}_USERNAME`] || email.split("@")[0];
      const role = process.env[`AUTH_USER_${i}_ROLE`] || (i === 1 ? "administrator" : "agent");
      const avatar = process.env[`AUTH_USER_${i}_AVATAR`] || "";

      parsedUsers.push({
        id: `user-${i}`,
        name,
        username,
        email: email.trim().toLowerCase(),
        password: password.trim(),
        avatar,
        role,
      });
    }
  }

  // If no env users were found, fall back to default Meezan accounts
  if (parsedUsers.length === 0) {
    return DEFAULT_USERS;
  }

  return parsedUsers;
}

export function getPublicUsers(): UserSession[] {
  const envUsers = getEnvUsers();
  return envUsers.map(({ password: _, ...sessionUser }) => sessionUser);
}

export function findUserByEmail(email: string): EnvUser | undefined {
  const normalized = email.trim().toLowerCase();
  return getEnvUsers().find((u) => u.email.toLowerCase() === normalized);
}

export function verifyCredentials(email: string, password: string): EnvUser | null {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }
  if (user.password !== password) {
    return null;
  }
  return user;
}
