import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

import { CUSTOMER_INTERCEPTIONS } from "../src/data/suzuki-express/customer-interceptions";
import { DAILY_INQUIRY_RECORDS } from "../src/data/suzuki-express/daily-inquiry-data";
import { K_CARRY_SURVEY_DATA } from "../src/data/suzuki-express/k-carry-survey-data";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://svvkckmuuleaysqmcwea.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedData() {
  console.log("=================================================");
  console.log("PAK SUZUKI EXPRESS 2026 - PUSHING ALL SEED DATA");
  console.log("=================================================");
  console.log(`Target: ${supabaseUrl}\n`);

  // 1. SEED CUSTOMER INTERCEPTIONS (100 records)
  console.log(`[1/3] Mapping ${CUSTOMER_INTERCEPTIONS.length} Customer Interceptions...`);
  const mappedInterceptions = CUSTOMER_INTERCEPTIONS.map((item) => ({
    client_id: item.id,
    name: item.name,
    gender: item.gender,
    age: item.age,
    contact_no: item.contactNo,
    channel: item.channel,
    city: item.city,
    event_date: item.eventDate,
    supervisor_name: "Gohar Ali",
    synced: true,
  }));

  // Batch insert in chunks of 50
  for (let i = 0; i < mappedInterceptions.length; i += 50) {
    const chunk = mappedInterceptions.slice(i, i + 50);
    const { error } = await supabase.from("customer_interceptions").insert(chunk);
    if (error) {
      console.error(`Error inserting interceptions chunk ${i}:`, error.message);
    } else {
      console.log(`  ✓ Inserted interceptions ${i + 1} to ${Math.min(i + 50, mappedInterceptions.length)}`);
    }
  }

  // 2. SEED K-CARRY SURVEYS (130 records)
  console.log(`\n[2/3] Mapping ${K_CARRY_SURVEY_DATA.length} K-Carry Survey Records...`);
  const mappedSurveys = K_CARRY_SURVEY_DATA.map((item) => ({
    client_id: item.id,
    respondent_name: item.customerName,
    contact_no: item.mobileNo,
    city: item.campaignLocation,
    region: item.region || "ROS",
    event_date: item.eventDate,
    lead_status: item.leadStatus,
    main_occupation: item.mainOccupation,
    main_requirement: item.mainRequirement,
    current_vehicle: item.currentVehicle,
    most_important_feature: item.mostImportantFeature,
    biggest_transport_problem: item.biggestTransportProblem,
    heard_about_kcarry_before: item.heardAboutKCarryBefore,
    knows_replacement_for_ravi: item.knowsReplacementForRavi,
    suitable_replacement_for_ravi: item.suitableReplacementForRavi,
    reasonable_price_range: item.reasonablePriceRange,
    would_consider_buying: item.wouldConsiderBuying,
    notes: item.notes || "",
    supervisor_name: "Gohar Ali",
  }));

  // Batch insert in chunks of 50
  for (let i = 0; i < mappedSurveys.length; i += 50) {
    const chunk = mappedSurveys.slice(i, i + 50);
    const { error } = await supabase.from("k_carry_surveys").insert(chunk);
    if (error) {
      console.error(`Error inserting surveys chunk ${i}:`, error.message);
    } else {
      console.log(`  ✓ Inserted surveys ${i + 1} to ${Math.min(i + 50, mappedSurveys.length)}`);
    }
  }

  // 3. SEED DAILY MASTER INQUIRY SHEETS (15 records)
  console.log(`\n[3/3] Mapping ${DAILY_INQUIRY_RECORDS.length} Daily Master Inquiry Sheets...`);
  const mappedMasterSheets = DAILY_INQUIRY_RECORDS.map((item) => {
    // Calculate totals
    const everyRow = item.fourWheelers?.find((m) => m.model === "Every");
    const kCarryRow = item.fourWheelers?.find((m) => m.model === "K-Carry");
    const tradeInSum = item.fourWheelers?.reduce((acc, m) => acc + (m.freeEvaluation || 0), 0) || 0;

    return {
      client_id: item.id,
      event_date: item.eventDate,
      city: item.city,
      dealer: item.participatingDealer,
      venue: item.venue,
      region: item.region || "ROS",
      customer_footfall: item.customerFootfall || 0,
      timings: item.timings || "09:00 to 17:30",
      supervisor_og: item.supervisorOG || "Ali Raza",
      supervisor_ps: item.supervisorPS || "Tahir Mehmood",
      four_wheel_data: item.fourWheelers || [],
      every_test_drives: everyRow?.testDrive || 0,
      k_carry_test_drives: kCarryRow?.testDrive || 0,
      trade_in_evaluations: tradeInSum,
      free_inspections: item.aftersales?.freeCheckupsTotal || 0,
      free_oil_changes: item.aftersales?.oilChangesTotal || 0,
      appointments_given: item.aftersales?.nextAppointmentsTotal || 0,
      genuine_parts_revenue_pkr: item.aftersales?.partsSalesPkr || 0,
      dealer_rating:
        item.vendorEvaluation?.aftersales === "Excellent"
          ? "Excellent"
          : item.vendorEvaluation?.aftersales === "Good"
            ? "Good"
            : "Satisfactory",
      supervisor_notes: item.observation || "Caravan stop completed successfully.",
    };
  });

  const { error: masterErr } = await supabase.from("daily_master_sheets").insert(mappedMasterSheets);
  if (masterErr) {
    console.error("Error inserting master sheets:", masterErr.message);
  } else {
    console.log(`  ✓ Inserted all ${mappedMasterSheets.length} Daily Master Sheets successfully.`);
  }

  console.log("\n=================================================");
  console.log("VERIFYING FINAL ROW COUNTS IN SUPABASE...");
  console.log("=================================================");

  const { count: countInter } = await supabase
    .from("customer_interceptions")
    .select("*", { count: "exact", head: true });
  const { count: countSurv } = await supabase.from("k_carry_surveys").select("*", { count: "exact", head: true });
  const { count: countMaster } = await supabase.from("daily_master_sheets").select("*", { count: "exact", head: true });

  console.log(`• Customer Interceptions : ${countInter} rows`);
  console.log(`• K-Carry Surveys        : ${countSurv} rows`);
  console.log(`• Daily Master Sheets    : ${countMaster} rows`);
  console.log("=================================================\n");
  console.log("ALL DATA SUCCESSFULLY PUSHED TO SUPABASE!");
}

seedData().catch((err) => {
  console.error("Seed script encountered an error:", err);
});
