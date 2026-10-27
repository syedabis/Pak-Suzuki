import { DAILY_INQUIRY_RECORDS } from "@/data/suzuki-express/daily-inquiry-data";
import { TOUR_CITIES } from "@/data/suzuki-express/tour-schedule";
import type { Region } from "@/data/suzuki-express/types";

export interface DealershipTourStop {
  serialNo: number;
  city: string;
  venue: string;
  dealer: string;
  region: Region;
  regionLabel: string;
  phase: 1 | 2;
  status: "completed" | "active" | "upcoming";
  eventDate: string;
  supervisorPS: string;
  supervisorOG: string;
  footfall: number;
  footfallTarget: number;
  testDrives: number;
  salesInquiries: number;
  tradeInEvaluations: number;
  conversions: number;
  freeCheckups: number;
  freeOilChanges: number;
  partsSalesPkr: number;
  dealerRating: "Excellent" | "Good" | "On Track" | "Scheduled";
}

export interface RegionSummary {
  region: Region;
  label: string;
  subLabel: string;
  phaseLabel: string;
  totalCities: number;
  dealersCount: number;
  psLead: string;
  ogLead: string;
  footfall: number;
  footfallTarget: number;
  testDrives: number;
  salesInquiries: number;
  tradeInEvals: number;
  conversions: number;
  freeCheckups: number;
  freeOilChanges: number;
  partsSalesPkr: number;
  topDealer: string;
  topCity: string;
  status: "Active" | "Scheduled";
}

/**
 * Builds merged, unified performance dataset for all 38 tour stops
 */
export function getTourStopsPerformance(): DealershipTourStop[] {
  const inquiryMap = new Map(DAILY_INQUIRY_RECORDS.map((r) => [r.city.toLowerCase(), r]));

  return TOUR_CITIES.map((cityObj) => {
    const liveRecord = inquiryMap.get(cityObj.city.toLowerCase());

    if (liveRecord) {
      let testDrives = 0;
      let salesInquiries = 0;
      let tradeInEvals = 0;
      let conversions = 0;

      for (const fw of liveRecord.fourWheelers) {
        testDrives += fw.testDrive;
        salesInquiries += fw.salesEnquiry;
        tradeInEvals += fw.freeEvaluation;
        conversions += fw.conversion;
      }

      for (const tw of liveRecord.twoWheelers) {
        testDrives += tw.testDrive;
        salesInquiries += tw.salesEnquiry;
        conversions += tw.salesConversion;
      }

      const rating = liveRecord.vendorEvaluation?.sales === "Excellent" || conversions >= 5 ? "Excellent" : "Good";

      return {
        serialNo: cityObj.serialNo,
        city: cityObj.city,
        venue: liveRecord.venue || cityObj.venue,
        dealer: liveRecord.participatingDealer || cityObj.dealer,
        region: cityObj.region,
        regionLabel: cityObj.regionLabel,
        phase: cityObj.phase,
        status: cityObj.status,
        eventDate: liveRecord.eventDate || cityObj.eventDate,
        supervisorPS: liveRecord.supervisorPS || "PSMCL Area Lead",
        supervisorOG: liveRecord.supervisorOG || "OG Event Lead",
        footfall: liveRecord.customerFootfall,
        footfallTarget: 150,
        testDrives,
        salesInquiries,
        tradeInEvaluations: tradeInEvals,
        conversions,
        freeCheckups: liveRecord.aftersales.freeCheckupsTotal,
        freeOilChanges: liveRecord.aftersales.oilChangesTotal,
        partsSalesPkr: liveRecord.aftersales.partsSalesPkr,
        dealerRating: rating,
      };
    }

    // Phase 2 / Scheduled stops
    return {
      serialNo: cityObj.serialNo,
      city: cityObj.city,
      venue: cityObj.venue,
      dealer: cityObj.dealer,
      region: cityObj.region,
      regionLabel: cityObj.regionLabel,
      phase: cityObj.phase,
      status: cityObj.status,
      eventDate: cityObj.eventDate,
      supervisorPS: "PSMCL Regional Area Lead",
      supervisorOG: "OG Caravan Operations",
      footfall: cityObj.footfall ?? 0,
      footfallTarget: 150,
      testDrives: cityObj.testDrives ?? 0,
      salesInquiries: cityObj.salesInquiries ?? 0,
      tradeInEvaluations: 0,
      conversions: cityObj.conversions ?? 0,
      freeCheckups: cityObj.serviceCompleted ?? 0,
      freeOilChanges: 0,
      partsSalesPkr: 0,
      dealerRating: "Scheduled",
    };
  });
}

/**
 * Returns regional aggregated analytics for the 4 Caravan Operational Legs
 */
export function getRegionalCaravanSummaries(): RegionSummary[] {
  const allStops = getTourStopsPerformance();

  const regionsConfig: {
    region: Region;
    label: string;
    subLabel: string;
    phaseLabel: string;
    psLead: string;
    ogLead: string;
    status: "Active" | "Scheduled";
  }[] = [
    {
      region: "ROS",
      label: "Region of South (ROS)",
      subLabel: "Lower & Upper Sindh, Balochistan Corridor",
      phaseLabel: "Phase 1 • Active Leg",
      psLead: "Kashif Mehmood (Area Mgr)",
      ogLead: "Farhan Ali (Lead Ops)",
      status: "Active",
    },
    {
      region: "ROSP",
      label: "Region of South Punjab (ROSP)",
      subLabel: "Cotton Belt & Southern Canal Hubs",
      phaseLabel: "Phase 1 • Active Leg",
      psLead: "Malik Irfan (Area Mgr)",
      ogLead: "Zeeshan Haider (Lead Ops)",
      status: "Active",
    },
    {
      region: "ROCP",
      label: "Region of Central Punjab (ROCP)",
      subLabel: "Industrial Agrarian & Inter-City Towns",
      phaseLabel: "Phase 2 • Post-Eid Schedule",
      psLead: "Tariq Mahmood (Area Mgr)",
      ogLead: "Usman Khalid (Lead Ops)",
      status: "Scheduled",
    },
    {
      region: "RON",
      label: "Region of North & KP (RON)",
      subLabel: "Potohar, Northern Valleys & AJK Arteries",
      phaseLabel: "Phase 2 • Post-Eid Schedule",
      psLead: "Raja Khurram (Area Mgr)",
      ogLead: "Bilal Siddiqui (Lead Ops)",
      status: "Scheduled",
    },
  ];

  return regionsConfig.map((cfg) => {
    const stops = allStops.filter((s) => s.region === cfg.region);
    const uniqueDealers = new Set(stops.map((s) => s.dealer)).size;

    let footfall = 0;
    let testDrives = 0;
    let salesInquiries = 0;
    let tradeInEvals = 0;
    let conversions = 0;
    let freeCheckups = 0;
    let freeOilChanges = 0;
    let partsSalesPkr = 0;
    let topStop = stops[0];

    for (const s of stops) {
      footfall += s.footfall;
      testDrives += s.testDrives;
      salesInquiries += s.salesInquiries;
      tradeInEvals += s.tradeInEvaluations;
      conversions += s.conversions;
      freeCheckups += s.freeCheckups;
      freeOilChanges += s.freeOilChanges;
      partsSalesPkr += s.partsSalesPkr;

      if (!topStop || s.footfall > (topStop.footfall || 0)) {
        topStop = s;
      }
    }

    return {
      region: cfg.region,
      label: cfg.label,
      subLabel: cfg.subLabel,
      phaseLabel: cfg.phaseLabel,
      totalCities: stops.length,
      dealersCount: uniqueDealers,
      psLead: cfg.psLead,
      ogLead: cfg.ogLead,
      footfall,
      footfallTarget: stops.length * 150,
      testDrives,
      salesInquiries,
      tradeInEvals,
      conversions,
      freeCheckups,
      freeOilChanges,
      partsSalesPkr,
      topDealer: topStop?.dealer || "Network Dealers",
      topCity: topStop?.city || "Tour Stops",
      status: cfg.status,
    };
  });
}
