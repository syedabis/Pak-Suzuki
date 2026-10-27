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
  name: "Pak Suzuki Administrator",
  preferredName: "Administrator",
  legalName: "Pak Suzuki Administrator",
  pronouns: "He / him",
  initials: "PSA",
  avatar: "",
  engagementStatus: "Active",
  jobTitle: "Operations & Field Sales Lead",
  jobLevel: "Lead / Head of Operations",
  department: "Marketing & Regional Field Operations",
  team: "Suzuki Express National Caravan Operations",
  currentProject: "Suzuki Express Season 5 (ROS & ROSP Caravan Tour)",
  workEmail: "admin@wavex.ltd",
  personalEmail: "admin@wavex.ltd",
  workPhone: "+92 (21) 3500-1122",
  workplace: "Umerkot",
  timeZone: "UTC+5:00",
  contractorId: "PS-1001",
  startDate: "January 15, 2024",
  engagementLength: "2 years, 9 months",
  employmentType: "Permanent Staff",
  weeklyHours: "40 hours",
  schedule: "Monday–Saturday · 9:00 AM–6:00 PM",
  contractingEntity: "Pak Suzuki Motor Company Ltd (PSMCL)",
  noticePeriod: "30 days",
  dateOfBirth: "March 15, 1990",
  address: "DSU-13, Pakistan Steel Industrial Estate, Bin Qasim, Karachi",
  emergencyContact: "PSMCL Security & Operations Control",
  emergencyPhone: "+92 (21) 3472-3551",
  manager: {
    name: "Ghulam Hussain",
    role: "General Manager Marketing & After Sales",
    initials: "GH",
  },
  bio: "Oversees on-ground field operations, national caravan tour coordination across 15 cities, regional 3S dealership liaison, and customer inquiry intake for the Suzuki Express Season 5 campaign and K-Carry regional launch.",
  leavePolicy: "Standard PSMCL company leave allowance",
  annualLeaveAllowance: "25 days",
  remainingLeave: "18 days",
  carriedOverLeave: "0 days",
  usedLeave: "7 days",
  scheduledLeave: "5 days",
  pendingLeaveRequests: "0",
  leaveYear: "January 1–December 31, 2026",
  nextLeave: "August 24–28, 2026",
  lastWorkingDay: "N/A (Active Employment)",
  updatedBy: "Pak Suzuki Administrator",
  updatedAt: "Today",
  documents: [
    {
      id: "doc-1",
      name: "Employment agreement",
      category: "Contract",
      updatedAt: "Jan 15, 2024",
      status: "Signed",
      isRestricted: false,
    },
    {
      id: "doc-2",
      name: "Confidentiality & Non-Disclosure agreement",
      category: "Compliance",
      updatedAt: "Jan 15, 2024",
      status: "Signed",
      isRestricted: true,
    },
    {
      id: "doc-4",
      name: "Information security & operational guidelines",
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
      .toUpperCase() || "PSA";

  const isAgent = user.role?.toLowerCase().includes("agent");

  return {
    ...profile,
    name: user.name,
    preferredName: user.name.split(" ")[0] || user.name,
    legalName: user.name,
    initials,
    avatar: user.avatar ?? "",
    jobTitle: isAgent ? "Regional Field Supervisor" : "Operations & Field Sales Lead",
    jobLevel: isAgent ? "Field Supervisor Level 2" : "Lead / Head of Operations",
    department: "Marketing & Regional Field Operations",
    team: "Suzuki Express National Caravan Operations",
    currentProject: "Suzuki Express Season 5 (ROS & ROSP Caravan Tour)",
    workEmail: user.email,
    personalEmail: user.email,
    bio: `${user.name} is a member of the Pak Suzuki field operations team, managing regional caravan tours, dealership coordination, test-drive operations, and customer inquiry intake across 15 tour destinations in Sindh and South Punjab.`,
    updatedBy: user.name,
    updatedAt: "Today",
  };
}
