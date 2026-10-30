import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

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
  login: (credentials: { email: string; pass: string; city?: string }) => Promise<{ success: boolean; message?: string }>;
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
  const [supervisor, setSupervisor] = useState<SupervisorProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [interceptions, setInterceptions] = useState<InterceptionEntry[]>(SEED_INTERCEPTIONS);
  const [surveys, setSurveys] = useState<KCarrySurveyEntry[]>(SEED_SURVEYS);
  const [masterSheets, setMasterSheets] = useState<DailyMasterSheetEntry[]>(SEED_MASTER_SHEETS);

  // Sync latest records from Supabase on mount
  useEffect(() => {
    async function fetchCloudData() {
      try {
        const [intRes, survRes, msRes] = await Promise.all([
          supabase.from("customer_interceptions").select("*").order("created_at", { ascending: false }).limit(25),
          supabase.from("k_carry_surveys").select("*").order("created_at", { ascending: false }).limit(25),
          supabase.from("daily_master_sheets").select("*").order("created_at", { ascending: false }).limit(25),
        ]);

        if (intRes.data && intRes.data.length > 0) {
          const cloudInts: InterceptionEntry[] = intRes.data.map((row: any) => ({
            id: row.client_id || row.id,
            name: row.name,
            gender: row.gender,
            age: row.age,
            contactNo: row.contact_no,
            channel: row.channel,
            city: row.city,
            timestamp: "Cloud",
            supervisor: row.supervisor_name || "Supervisor",
            synced: true,
          }));
          // Merge unique by phone/id
          setInterceptions((prev) => {
            const existingIds = new Set(prev.map((p) => p.contactNo));
            const newOnes = cloudInts.filter((c) => !existingIds.has(c.contactNo));
            return [...newOnes, ...prev];
          });
        }

        if (survRes.data && survRes.data.length > 0) {
          const cloudSurvs: KCarrySurveyEntry[] = survRes.data.map((row: any) => ({
            id: row.client_id || row.id,
            respondentName: row.respondent_name,
            contactNo: row.contact_no,
            city: row.city,
            leadStatus: row.lead_status,
            mainOccupation: row.main_occupation,
            mainRequirement: row.main_requirement,
            currentVehicle: row.current_vehicle,
            mostImportantFeature: row.most_important_feature,
            biggestTransportProblem: row.biggest_transport_problem,
            heardAboutKCarryBefore: row.heard_about_kcarry_before,
            knowsReplacementForRavi: row.knows_replacement_for_ravi,
            suitableReplacementForRavi: row.suitable_replacement_for_ravi,
            reasonablePriceRange: row.reasonable_price_range,
            wouldConsiderBuying: row.would_consider_buying,
            notes: row.notes,
            timestamp: "Cloud",
            supervisor: row.supervisor_name || "Supervisor",
            synced: true,
          }));

          setSurveys((prev) => {
            const existingIds = new Set(prev.map((p) => p.contactNo));
            const newOnes = cloudSurvs.filter((c) => !existingIds.has(c.contactNo));
            return [...newOnes, ...prev];
          });
        }

        if (msRes.data && msRes.data.length > 0) {
          const cloudMasterSheets: DailyMasterSheetEntry[] = msRes.data.map((row: any) => ({
            id: row.client_id || row.id,
            eventDate: row.event_date || "2026-11-16",
            city: row.city,
            dealer: row.dealer,
            venue: row.venue,
            footfall: row.customer_footfall,
            ogSupervisor: row.supervisor_og,
            psSupervisor: row.supervisor_ps,
            eventTimings: row.timings,
            fourWheelData: row.four_wheel_data,
            everyTestDrives: row.every_test_drives || 0,
            kCarryTestDrives: row.k_carry_test_drives || 0,
            tradeInEvaluations: row.trade_in_evaluations || 0,
            freeInspections: row.free_inspections || 0,
            freeOilChanges: row.free_oil_changes || 0,
            appointmentsGiven: row.appointments_given || 0,
            genuinePartsRevenuePkr: row.genuine_parts_revenue_pkr || 0,
            dealerRating: row.dealer_rating || "Good",
            supervisorNotes: row.supervisor_notes || "",
            timestamp: "Cloud Synced",
            synced: true,
          }));

          setMasterSheets((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newOnes = cloudMasterSheets.filter((c) => !existingIds.has(c.id));
            return [...newOnes, ...prev];
          });
        }
      } catch (err) {
        console.warn("Cloud initial sync fetch error:", err);
      }
    }

    fetchCloudData();
  }, []);

  const login = async ({ email, pass, city }: { email: string; pass: string; city?: string }): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    try {
      // 1. Query Supabase supervisors table
      const { data, error } = await supabase
        .from("supervisors")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (error) {
        console.warn("Supabase auth check query error:", error.message);
      } else if (data) {
        if (!data.is_active) {
          return { success: false, message: "Account is deactivated. Please contact your administrator." };
        }
        if (data.password && data.password !== cleanPass) {
          return { success: false, message: "Incorrect password. Please try again." };
        }

        setSupervisor({
          name: data.name || "Supervisor",
          email: data.email,
          employeeId: data.employee_id || "PSMC-SUP-101",
          role: data.role || "On-Ground Lead Supervisor",
          assignedCity: data.assigned_city || city || "Usta Muhammad",
          assignedDealer: data.assigned_dealer || "Suzuki Jacobabad Motors",
          stationVenue: data.station_venue || "Grain Market Ground",
          region: data.region === "ROSP" ? "ROSP" : "ROS",
        });
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (err) {
      console.warn("Supabase auth connection issue, checking offline admin fallback:", err);
    }

    // 2. Admin master fallback (for offline or local emergency setup)
    const validEmail = (process.env.EXPO_PUBLIC_ADMIN_EMAIL || "admin@paksuzuki.com.pk").trim().toLowerCase();
    const validPass = (process.env.EXPO_PUBLIC_ADMIN_PASSWORD || "paksuzuki2026").trim();

    if (cleanEmail === validEmail && cleanPass === validPass) {
      setSupervisor({
        name: "Pak Suzuki Admin",
        email: validEmail,
        employeeId: "PSMC-ADM-001",
        role: "System Administrator",
        assignedCity: city || "Usta Muhammad",
        assignedDealer: "Suzuki Jacobabad Motors",
        stationVenue: "Grain Market Ground",
        region: "ROS",
      });
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, message: "Invalid email or password" };
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

  const addInterception = async (entry: Omit<InterceptionEntry, "id" | "timestamp" | "synced" | "supervisor">) => {
    const localId = `INT-${Date.now().toString().slice(-4)}`;
    const newRecord: InterceptionEntry = {
      ...entry,
      id: localId,
      timestamp: "Just now",
      supervisor: supervisor?.name || "Gohar Ali",
      synced: false,
    };
    setInterceptions((prev) => [newRecord, ...prev]);

    try {
      const { error } = await supabase.from("customer_interceptions").insert({
        client_id: localId,
        name: entry.name,
        gender: entry.gender,
        age: entry.age,
        contact_no: entry.contactNo,
        channel: entry.channel,
        city: entry.city,
        supervisor_name: supervisor?.name || "Gohar Ali",
        synced: true,
      });

      if (!error) {
        setInterceptions((prev) =>
          prev.map((item) => (item.id === localId ? { ...item, synced: true } : item))
        );
      }
    } catch (err) {
      console.warn("Offline or sync pending for interception:", err);
    }
  };

  const addSurvey = async (entry: Omit<KCarrySurveyEntry, "id" | "timestamp" | "synced" | "supervisor">) => {
    const localId = `SURV-${Date.now().toString().slice(-4)}`;
    const newRecord: KCarrySurveyEntry = {
      ...entry,
      id: localId,
      timestamp: "Just now",
      supervisor: supervisor?.name || "Gohar Ali",
      synced: false,
    };
    setSurveys((prev) => [newRecord, ...prev]);

    try {
      const { error } = await supabase.from("k_carry_surveys").insert({
        client_id: localId,
        respondent_name: entry.respondentName,
        contact_no: entry.contactNo,
        city: entry.city,
        lead_status: entry.leadStatus,
        main_occupation: entry.mainOccupation,
        main_requirement: entry.mainRequirement,
        current_vehicle: entry.currentVehicle,
        most_important_feature: entry.mostImportantFeature,
        biggest_transport_problem: entry.biggestTransportProblem,
        heard_about_kcarry_before: entry.heardAboutKCarryBefore,
        knows_replacement_for_ravi: entry.knowsReplacementForRavi,
        suitable_replacement_for_ravi: entry.suitableReplacementForRavi,
        reasonable_price_range: entry.reasonablePriceRange,
        would_consider_buying: entry.wouldConsiderBuying,
        notes: entry.notes || "",
        supervisor_name: supervisor?.name || "Gohar Ali",
      });

      if (!error) {
        setSurveys((prev) =>
          prev.map((item) => (item.id === localId ? { ...item, synced: true } : item))
        );
      }
    } catch (err) {
      console.warn("Offline or sync pending for survey:", err);
    }
  };

  const addMasterSheet = async (entry: Omit<DailyMasterSheetEntry, "id" | "timestamp" | "synced">) => {
    const localId = `MS-${Date.now().toString().slice(-4)}`;
    const newRecord: DailyMasterSheetEntry = {
      ...entry,
      id: localId,
      timestamp: "Just now",
      synced: false,
    };
    setMasterSheets((prev) => [newRecord, ...prev]);

    try {
      const { error } = await supabase.from("daily_master_sheets").insert({
        client_id: localId,
        event_date: entry.eventDate,
        city: entry.city,
        dealer: entry.dealer,
        venue: entry.venue,
        customer_footfall: entry.footfall || 0,
        timings: entry.eventTimings || "09:00 to 17:30",
        supervisor_og: entry.ogSupervisor || "",
        supervisor_ps: entry.psSupervisor || "",
        four_wheel_data: entry.fourWheelData || {},
        every_test_drives: entry.everyTestDrives,
        k_carry_test_drives: entry.kCarryTestDrives,
        trade_in_evaluations: entry.tradeInEvaluations,
        free_inspections: entry.freeInspections,
        free_oil_changes: entry.freeOilChanges,
        appointments_given: entry.appointmentsGiven || 0,
        genuine_parts_revenue_pkr: entry.genuinePartsRevenuePkr,
        dealer_rating: entry.dealerRating,
        supervisor_notes: entry.supervisorNotes || "",
      });

      if (!error) {
        setMasterSheets((prev) =>
          prev.map((item) => (item.id === localId ? { ...item, synced: true } : item))
        );
      }
    } catch (err) {
      console.warn("Offline or sync pending for master sheet:", err);
    }
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
