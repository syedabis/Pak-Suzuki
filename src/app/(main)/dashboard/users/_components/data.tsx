export type SupervisorStatus = "Active" | "Deactivated";

export type SupervisorUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  employee_id: string;
  role: string;
  assigned_city: string;
  assigned_dealer: string;
  station_venue: string;
  region: string;
  is_active: boolean;
  created_at: string;
};

// Fallback seed data if offline
export const initialSupervisors: SupervisorUser[] = [
  {
    id: "bab36568-992a-4ba7-b7f2-f9e8d1ad645a",
    name: "Pak Suzuki Admin",
    email: "admin@paksuzuki.com.pk",
    password: "paksuzuki2026",
    employee_id: "PSMC-ADM-001",
    role: "System Administrator",
    assigned_city: "Karachi",
    assigned_dealer: "Pak Suzuki Motor Co.",
    station_venue: "Head Office",
    region: "ROS",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "f956bc78-a0cc-496b-a507-f7f036ede798",
    name: "Gohar Ali",
    email: "gohar.ali@suzuki.com.pk",
    password: "paksuzuki2026",
    employee_id: "PSMC-SUP-108",
    role: "On-Ground Lead Supervisor",
    assigned_city: "Usta Muhammad",
    assigned_dealer: "Suzuki Jacobabad Motors",
    station_venue: "Grain Market Ground",
    region: "ROS",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const filters = {
  role: [
    "All",
    "K-Carry Form Access Only",
    "Visitor Interception Form Access Only",
    "Daily Master Sheet Access Only",
    "View Access for All Forms",
    "On-Ground Lead Supervisor",
    "Dashboard View Access",
    "Dashboard Admin Access",
    "System Administrator",
  ],
  city: ["All", "Karachi", "Usta Muhammad", "Jacobabad", "Sukkur", "Larkana", "Quetta"],
  region: ["All", "ROS", "ROSP", "South", "North", "Central"],
  status: ["All", "Active", "Deactivated"],
};

export const statusMeta: Record<SupervisorStatus, { badgeClass: string; dotClass: string }> = {
  Active: {
    badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  Deactivated: {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
};
