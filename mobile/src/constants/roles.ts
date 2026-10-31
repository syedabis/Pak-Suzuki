export type MobileRole =
  | "K-Carry Form Access Only"
  | "Visitor Interception Form Access Only"
  | "Daily Master Sheet Access Only"
  | "View Access for All Forms"
  | "On-Ground Lead Supervisor"
  | "System Administrator"
  | "Dashboard Admin Access";

export function isKCarryOnly(role?: string | null): boolean {
  if (!role) return false;
  const r = role.toLowerCase().trim();
  return (
    r.includes("k-carry") ||
    r.includes("kcarry") ||
    r === "k-carry form access only"
  );
}

export function isInterceptionOnly(role?: string | null): boolean {
  if (!role) return false;
  const r = role.toLowerCase().trim();
  return (
    r.includes("interception") ||
    r.includes("visitor") ||
    r === "visitor interception form access only"
  );
}

export function isMasterSheetOnly(role?: string | null): boolean {
  if (!role) return false;
  const r = role.toLowerCase().trim();
  return (
    (r.includes("master") && !r.includes("view")) ||
    r.includes("daily event") ||
    r === "daily master sheet access only"
  );
}

export function isMobileViewOnly(role?: string | null): boolean {
  if (!role) return false;
  const r = role.toLowerCase().trim();
  return (
    r.includes("view access for all forms") ||
    r.includes("mobile view") ||
    (r.includes("view") && !r.includes("dashboard"))
  );
}

export function isFullSupervisor(role?: string | null): boolean {
  if (!role) return false;
  const r = role.toLowerCase().trim();
  return (
    r === "on-ground lead supervisor" ||
    r.includes("admin") ||
    r === "field auditor" ||
    r === "area manager"
  );
}

