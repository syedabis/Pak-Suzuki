interface PersonReference {
  name: string;
  role: string;
  initials: string;
}

export interface ProfileDocument {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
  status: "Signed" | "Current";
  isRestricted: boolean;
}

export interface ProfileRecord {
  name: string;
  preferredName: string;
  legalName: string;
  pronouns: string;
  initials: string;
  avatar: string;
  engagementStatus: "Active";
  jobTitle: string;
  jobLevel: string;
  department: string;
  team: string;
  currentProject: string;
  workEmail: string;
  personalEmail: string;
  workPhone: string;
  workplace: string;
  timeZone: string;
  contractorId: string;
  startDate: string;
  engagementLength: string;
  employmentType: string;
  weeklyHours: string;
  schedule: string;
  contractingEntity: string;
  noticePeriod: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  manager: PersonReference;
  bio: string;
  leavePolicy: string;
  annualLeaveAllowance: string;
  remainingLeave: string;
  carriedOverLeave: string;
  usedLeave: string;
  scheduledLeave: string;
  pendingLeaveRequests: string;
  leaveYear: string;
  nextLeave: string;
  lastWorkingDay: string;
  updatedBy: string;
  updatedAt: string;
  documents: ProfileDocument[];
}

export const profile: ProfileRecord = {
  name: "Meezan Administrator",
  preferredName: "Administrator",
  legalName: "Meezan Administrator",
  pronouns: "He / him",
  initials: "MA",
  avatar: "",
  engagementStatus: "Active",
  jobTitle: "Operations & Field Sales Lead",
  jobLevel: "Lead",
  department: "Field Sales & Operations",
  team: "Pak Suzuki Commercial & Operations",
  currentProject: "Operational Intelligence System",
  workEmail: "admin@wavex.ltd",
  personalEmail: "admin@wavex.ltd",
  workPhone: "+92 (21) 3500-1122",
  workplace: "Karachi HQ & Dealerships",
  timeZone: "UTC+5:00",
  contractorId: "PS-1001",
  startDate: "January 15, 2024",
  engagementLength: "2 years, 3 months",
  employmentType: "Permanent Staff",
  weeklyHours: "40 hours",
  schedule: "Monday–Saturday · 9:00 AM–6:00 PM",
  contractingEntity: "Pak Suzuki Motor Company Ltd",
  noticePeriod: "30 days",
  dateOfBirth: "March 15, 1990",
  address: "Plot 12, Korangi Industrial Area, Karachi",
  emergencyContact: "Operations Control · Central Office",
  emergencyPhone: "+92 (21) 3500-1120",
  manager: {
    name: "Tariq Mahmood",
    role: "Head of Distribution",
    initials: "TM",
  },
  bio: "Oversees direct-to-consumer field sales, door-to-door sales teams, inventory allocation, and consumer conversion analytics for Meezan Oil distribution operations across metropolitan territories.",
  leavePolicy: "Standard company leave allowance",
  annualLeaveAllowance: "25 days",
  remainingLeave: "18 days",
  carriedOverLeave: "0 days",
  usedLeave: "7 days",
  scheduledLeave: "5 days",
  pendingLeaveRequests: "0",
  leaveYear: "January 1–December 31, 2026",
  nextLeave: "August 24–28, 2026",
  lastWorkingDay: "October 3, 2026",
  updatedBy: "Meezan Administrator",
  updatedAt: "Today",
  documents: [
    {
      id: "doc-1",
      name: "Contractor agreement",
      category: "Contract",
      updatedAt: "Mar 18, 2022",
      status: "Signed",
      isRestricted: false,
    },
    {
      id: "doc-2",
      name: "Confidentiality agreement",
      category: "Compliance",
      updatedAt: "Mar 18, 2022",
      status: "Signed",
      isRestricted: true,
    },
    {
      id: "doc-4",
      name: "Information security policy acknowledgement",
      category: "Policy",
      updatedAt: "Jan 8, 2026",
      status: "Current",
      isRestricted: false,
    },
  ],
};

export function getProfileForUser(user: {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}): ProfileRecord {
  const initials =
    user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "MO";

  const isAgent = user.role?.toLowerCase().includes("agent");

  return {
    ...profile,
    name: user.name,
    preferredName: user.name.split(" ")[0] || user.name,
    legalName: user.name,
    initials,
    avatar: user.avatar || "",
    jobTitle: isAgent ? "Senior Field Sales Agent" : "Operations & Field Sales Lead",
    jobLevel: isAgent ? "Field Agent Level 2" : "Lead",
    department: "Field Sales & Operations",
    team: "Meezan Oil Direct-to-Consumer",
    currentProject: "Karachi D2D Sales Campaign",
    workEmail: user.email,
    personalEmail: user.email,
    bio: `${user.name} is a member of the Meezan Oil field operations team, managing direct-to-consumer field sales, retail distribution, doorstep consumer surveys, and territory execution across assigned zones.`,
    updatedBy: user.name,
    updatedAt: "Today",
  };
}
