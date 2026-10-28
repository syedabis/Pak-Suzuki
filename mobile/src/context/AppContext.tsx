import React, { createContext, useContext, useState } from "react";

export interface SupervisorProfile {
  name: string;
  email: string;
  employeeId: string;
  role: string;
  assignedCity: string;
  assignedDealer: string;
  stationVenue: string;
  region: "ROS" | "ROSP";
}

export interface InterceptionEntry {
  id: string;
  name: string;
  gender: "Male" | "Female";
  age: number;
  contactNo: string;
  channel: string;
  city: string;
  notes?: string;
  timestamp: string;
  supervisor: string;
  synced: boolean;
}

export interface KCarrySurveyEntry {
  id: string;
  respondentName: string;
  contactNo: string;
  city: string;
  leadStatus: "Hot" | "Warm" | "Cold";
  // Section A (Q1 to Q5)
  mainOccupation: string;
  mainRequirement: string;
  currentVehicle: string;
  mostImportantFeature: string;
  biggestTransportProblem: string;
  // Section B (Q6 to Q10)
  heardAboutKCarryBefore: string;
  knowsReplacementForRavi: string;
  suitableReplacementForRavi: string;
  reasonablePriceRange: string;
  wouldConsiderBuying: string;
  notes?: string;
  timestamp: string;
  supervisor: string;
  synced: boolean;
}

export interface DailyMasterSheetEntry {
  id: string;
  eventDate: string;
  city: string;
  dealer: string;
  venue: string;
  footfall?: number;
  ogSupervisor?: string;
  psSupervisor?: string;
  eventTimings?: string;
  fourWheelData?: Record<string, Record<string, number>>;
  everyTestDrives: number;
  kCarryTestDrives: number;
  tradeInEvaluations: number;
  freeInspections: number;
  freeOilChanges: number;
  appointmentsGiven?: number;
  genuinePartsRevenuePkr: number;
  dealerRating: "Satisfactory" | "Good" | "Excellent";
  supervisorNotes: string;
  timestamp: string;
  synced: boolean;
}

interface AppContextType {
  supervisor: SupervisorProfile | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; pass: string; city: string }) => boolean;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    employeeId?: string;
    city?: string;
    role?: string;
    password?: string;
  }) => boolean;
  logout: () => void;
  updateCityStation: (city: string, dealer: string, venue: string) => void;
  // Interceptions
  interceptions: InterceptionEntry[];
  addInterception: (entry: Omit<InterceptionEntry, "id" | "timestamp" | "synced" | "supervisor">) => void;
  // K-Carry Surveys
  surveys: KCarrySurveyEntry[];
  addSurvey: (entry: Omit<KCarrySurveyEntry, "id" | "timestamp" | "synced" | "supervisor">) => void;
  // Daily Master Sheets
  masterSheets: DailyMasterSheetEntry[];
  addMasterSheet: (entry: Omit<DailyMasterSheetEntry, "id" | "timestamp" | "synced">) => void;
  // Stats
  todayStats: {
    totalInterceptions: number;
    totalSurveys: number;
    totalTestDrives: number;
    syncPending: number;
  };
}

const DEFAULT_SUPERVISOR: SupervisorProfile = {
  name: "Gohar Ali",
  email: "gohar.ali@suzuki.com.pk",
  employeeId: "PSMC-SUP-108",
  role: "On-Ground Lead Supervisor",
  assignedCity: "Usta Muhammad",
  assignedDealer: "Suzuki Jacobabad Motors",
  stationVenue: "Grain Market Ground",
  region: "ROS",
};

const SEED_INTERCEPTIONS: InterceptionEntry[] = [
  {
    id: "INT-101",
    name: "Kashif Talpur",
    gender: "Male",
    age: 54,
    contactNo: "0319-4719445",
    channel: "Recorded Calls",
    city: "Khairpur",
    timestamp: "10 mins ago",
    supervisor: "Gohar Ali",
    synced: true,
  },
  {
    id: "INT-102",
    name: "Kashif Dahani",
    gender: "Female",
    age: 26,
    contactNo: "0323-3702248",
    channel: "Auto Rickshaw Banner",
    city: "Jamshoro",
    timestamp: "25 mins ago",
    supervisor: "Gohar Ali",
    synced: true,
  },
  {
    id: "INT-103",
    name: "Sikandar Channa",
    gender: "Male",
    age: 42,
    contactNo: "0316-8085052",
    channel: "Auto Rickshaw Banner",
    city: "Khairpur",
    timestamp: "45 mins ago",
    supervisor: "Gohar Ali",
    synced: true,
  },
  {
    id: "INT-104",
    name: "Shoaib Lashari",
    gender: "Male",
    age: 43,
    contactNo: "0326-7363234",
    channel: "Auto Rickshaw Banner",
    city: "Jamshoro",
    timestamp: "1 hour ago",
    supervisor: "Gohar Ali",
    synced: true,
  },
  {
    id: "INT-105",
    name: "Junaid Rind",
    gender: "Male",
    age: 51,
    contactNo: "0318-2588799",
    channel: "Street Banner",
    city: "Umerkot",
    timestamp: "2 hours ago",
    supervisor: "Gohar Ali",
    synced: true,
  },
  {
    id: "INT-106",
    name: "Sikandar Talpur",
    gender: "Male",
    age: 58,
    contactNo: "0310-8244202",
    channel: "Auto Rickshaw Banner",
    city: "Umerkot",
    timestamp: "3 hours ago",
    supervisor: "Gohar Ali",
    synced: true,
  },
  {
    id: "INT-107",
    name: "Farhan Panhwar",
    gender: "Male",
    age: 45,
    contactNo: "0347-3790564",
    channel: "Facebook",
    city: "Umerkot",
    timestamp: "3 hours ago",
    supervisor: "Gohar Ali",
    synced: true,
  },
  {
    id: "INT-108",
    name: "Adnan Abbasi",
    gender: "Male",
    age: 22,
    contactNo: "0301-1536752",
    channel: "Facebook",
    city: "Khairpur",
    timestamp: "4 hours ago",
    supervisor: "Gohar Ali",
    synced: true,
  },
];

const SEED_SURVEYS: KCarrySurveyEntry[] = [
  {
    id: "SURV-201",
    respondentName: "Ghulam Rasool Bhatti",
    contactNo: "0300-9876543",
    city: "Usta Muhammad",
    leadStatus: "Hot",
    mainOccupation: "Farmer / Agriculture",
    mainRequirement: "Goods Transportation",
    currentVehicle: "Suzuki Ravi",
    mostImportantFeature: "Fuel Economy",
    biggestTransportProblem: "High Fuel Cost",
    heardAboutKCarryBefore: "Yes",
    knowsReplacementForRavi: "Yes",
    suitableReplacementForRavi: "Yes",
    reasonablePriceRange: "PKR 22–24 lakh",
    wouldConsiderBuying: "Definitely Yes",
    notes: "Inquiring about Meezan Islamic financing; wants evaluation on 2018 Ravi",
    timestamp: "30 mins ago",
    supervisor: "Gohar Ali",
    synced: true,
  },
  {
    id: "SURV-202",
    respondentName: "Malik Shahzad",
    contactNo: "0333-5432109",
    city: "Usta Muhammad",
    leadStatus: "Warm",
    mainOccupation: "Transport / Delivery",
    mainRequirement: "Goods Transportation",
    currentVehicle: "FAW — Carrier",
    mostImportantFeature: "Load Carrying Capacity",
    biggestTransportProblem: "Frequent Breakdowns",
    heardAboutKCarryBefore: "Yes",
    knowsReplacementForRavi: "Yes",
    suitableReplacementForRavi: "Yes",
    reasonablePriceRange: "PKR 24–27 lakh",
    wouldConsiderBuying: "Maybe / Needs More Information",
    notes: "Interested in test driving on rural dirt tracks with 1-ton weight load",
    timestamp: "1 hour ago",
    supervisor: "Gohar Ali",
    synced: true,
  },
];

const SEED_MASTER_SHEETS: DailyMasterSheetEntry[] = [
  {
    id: "EVT-ROS-06",
    eventDate: "2026-11-16",
    city: "Usta Muhammad",
    dealer: "Suzuki Jacobabad Motors",
    venue: "Grain Market Ground",
    everyTestDrives: 46,
    kCarryTestDrives: 38,
    tradeInEvaluations: 80,
    freeInspections: 83,
    freeOilChanges: 81,
    genuinePartsRevenuePkr: 60754,
    dealerRating: "Excellent",
    supervisorNotes: "High turn-out for K-Carry cargo bed trials. Parts sales exceeded daily target.",
    timestamp: "Yesterday",
    synced: true,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [supervisor, setSupervisor] = useState<SupervisorProfile | null>(DEFAULT_SUPERVISOR);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Logged in by default with Gohar Ali
  const [interceptions, setInterceptions] = useState<InterceptionEntry[]>(SEED_INTERCEPTIONS);
  const [surveys, setSurveys] = useState<KCarrySurveyEntry[]>(SEED_SURVEYS);
  const [masterSheets, setMasterSheets] = useState<DailyMasterSheetEntry[]>(SEED_MASTER_SHEETS);

  const login = ({ email, city }: { email: string; pass: string; city: string }) => {
    setSupervisor({
      name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Gohar Ali",
      email: email || "gohar.ali@suzuki.com.pk",
      employeeId: "PSMC-SUP-108",
      role: "On-Ground Lead Supervisor",
      assignedCity: city || "Usta Muhammad",
      assignedDealer: "Suzuki Jacobabad Motors",
      stationVenue: "Grain Market Ground",
      region: "ROS",
    });
    setIsAuthenticated(true);
    return true;
  };

  const register = (data: {
    name: string;
    email: string;
    phone: string;
    employeeId?: string;
    city?: string;
    role?: string;
    password?: string;
  }) => {
    setSupervisor({
      name: data.name.trim() || "Gohar Ali",
      email: data.email.trim() || "supervisor@suzuki.com.pk",
      employeeId: data.employeeId?.trim() || `PSMC-SUP-${Math.floor(100 + Math.random() * 900)}`,
      role: data.role || "On-Ground Lead Supervisor",
      assignedCity: data.city || "Usta Muhammad",
      assignedDealer: "Suzuki Jacobabad Motors",
      stationVenue: "Grain Market Ground",
      region: "ROS",
    });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateCityStation = (city: string, dealer: string, venue: string) => {
    if (supervisor) {
      setSupervisor({
        ...supervisor,
        assignedCity: city,
        assignedDealer: dealer,
        stationVenue: venue,
      });
    }
  };

  const addInterception = (entry: Omit<InterceptionEntry, "id" | "timestamp" | "synced" | "supervisor">) => {
    const newRecord: InterceptionEntry = {
      ...entry,
      id: `INT-${Date.now().toString().slice(-4)}`,
      timestamp: "Just now",
      supervisor: supervisor?.name || "Gohar Ali",
      synced: true,
    };
    setInterceptions((prev) => [newRecord, ...prev]);
  };

  const addSurvey = (entry: Omit<KCarrySurveyEntry, "id" | "timestamp" | "synced" | "supervisor">) => {
    const newRecord: KCarrySurveyEntry = {
      ...entry,
      id: `SURV-${Date.now().toString().slice(-4)}`,
      timestamp: "Just now",
      supervisor: supervisor?.name || "Gohar Ali",
      synced: true,
    };
    setSurveys((prev) => [newRecord, ...prev]);
  };

  const addMasterSheet = (entry: Omit<DailyMasterSheetEntry, "id" | "timestamp" | "synced">) => {
    const newRecord: DailyMasterSheetEntry = {
      ...entry,
      id: `MS-${Date.now().toString().slice(-4)}`,
      timestamp: "Just now",
      synced: true,
    };
    setMasterSheets((prev) => [newRecord, ...prev]);
  };

  const todayStats = {
    totalInterceptions: interceptions.length,
    totalSurveys: surveys.length,
    totalTestDrives: masterSheets.reduce((acc, curr) => acc + curr.everyTestDrives + curr.kCarryTestDrives, 84),
    syncPending: 0,
  };

  return (
    <AppContext.Provider
      value={{
        supervisor,
        isAuthenticated,
        login,
        register,
        logout,
        updateCityStation,
        interceptions,
        addInterception,
        surveys,
        addSurvey,
        masterSheets,
        addMasterSheet,
        todayStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
