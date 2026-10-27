export type Region = "ROS" | "ROSP";

export type TourCity = {
  serialNo: number;
  city: string;
  eventDate: string;
  dayOfWeek: string;
  region: Region;
  regionLabel: string;
  dealer: string;
  venue: string;
  status: "completed" | "active" | "upcoming";
  footfall?: number;
  testDrives?: number;
  salesInquiries?: number;
  conversions?: number;
  serviceCompleted?: number;
};

export type LeadStatus = "Hot" | "Warm" | "Cold";

export type KCarrySurveyRecord = {
  id: string;
  customerName: string;
  mobileNo: string;
  campaignLocation: string;
  region: Region;
  eventDate: string;
  leadStatus: LeadStatus;
  // Section A: Customer Usage & Needs
  mainOccupation:
    | "Farmer / Agriculture"
    | "Business / Trader"
    | "Shopkeeper"
    | "Transport / Delivery"
    | "Job / Employee"
    | "Other";
  mainRequirement:
    | "Agriculture / Farm Work"
    | "Goods Transportation"
    | "Business / Shop"
    | "Delivery"
    | "Personal / Family Use"
    | "Other";
  currentVehicle:
    | "Suzuki Ravi"
    | "FAW — Carrier"
    | "Hyundai — Shehzore"
    | "Forland — C10 / C10 Fortis"
    | "JAC — X200"
    | "Changan — M9 / other commercial variants"
    | "Tractor / Trolley"
    | "Motorcycle / Loader"
    | "No Vehicle"
    | "Other";
  mostImportantFeature:
    | "Load Carrying Capacity"
    | "Fuel Economy"
    | "Durability"
    | "Low Maintenance Cost"
    | "Comfort"
    | "Price";
  biggestTransportProblem:
    | "High Fuel Cost"
    | "Limited Load Capacity"
    | "High Maintenance Cost"
    | "Frequent Breakdowns"
    | "Lack of Comfort"
    | "No Major Problem";
  // Section B: K-CARRY Perception
  heardAboutKCarryBefore: "Yes" | "No";
  knowsReplacementForRavi: "Yes" | "No";
  suitableReplacementForRavi: "Yes" | "No" | "Not Sure";
  reasonablePriceRange: "PKR 22–24 lakh" | "PKR 24–27 lakh" | "PKR 28–30 lakh" | "Above PKR 30 lakh";
  wouldConsiderBuying: "Definitely Yes" | "Maybe / Needs More Information" | "No";
  notes?: string;
};

export type AcquisitionChannel =
  | "Facebook"
  | "Youtube"
  | "Television"
  | "Recorded Calls"
  | "Auto Rickshaw Banner"
  | "Street Banner"
  | "Flyer"
  | "Dealership Calls";

export type CustomerInterceptionRecord = {
  id: string;
  sNo: number;
  name: string;
  gender: "Male" | "Female";
  age: number;
  contactNo: string;
  channel: AcquisitionChannel;
  city: string;
  eventDate: string;
};

export type FourWheelerModel = "Alto" | "Cultus" | "WagonR" | "Swift" | "Every" | "Ravi" | "K-Carry";
export type TwoWheelerModel = "GD 110S" | "GS 150" | "GSX 125" | "GR 150";

export type DailyInquirySheetRecord = {
  id: string;
  serialNo: number;
  city: string;
  eventDate: string;
  venue: string;
  participatingDealer: string;
  timings: string;
  supervisorOG: string;
  supervisorPS: string;
  region: Region;
  customerFootfall: number;
  fourWheelers: {
    model: FourWheelerModel;
    testDrive: number;
    salesEnquiry: number;
    exchangeEnquiry: number;
    usedCarEnquiry: number;
    freeEvaluation: number;
    financing: number;
    insurance: number;
    conversion: number;
  }[];
  twoWheelers: {
    model: TwoWheelerModel;
    testDrive: number;
    salesEnquiry: number;
    salesConversion: number;
  }[];
  aftersales: {
    oilChangesTotal: number;
    oilChangesBreakdown?: { model: string; qty: number }[];
    freeCheckupsTotal: number;
    nextAppointmentsTotal: number;
    partsSalesPkr: number;
    serviceRevenuePkr: number;
  };
  vendorEvaluation: {
    sales: "Excellent" | "Good" | "Satisfactory" | "Fair" | "Poor";
    aftersales: "Excellent" | "Good" | "Satisfactory" | "Fair" | "Poor";
    usedCar: "Excellent" | "Good" | "Satisfactory" | "Fair" | "Poor";
  };
  observation: string;
};
