// Type definitions for Pak Suzuki Mobile Application

export interface InquiryRecord {
  id: string;
  tourStop: string;
  supervisorName: string;
  dealerName: string;
  customerName: string;
  phone: string;
  vehicleInterested: string;
  testDriveDone: boolean;
  notes?: string;
  createdAt: string;
}

export interface KCarrySurveyRecord {
  id: string;
  respondentName: string;
  contactNumber: string;
  businessType: string;
  currentVehicle: string;
  monthlyMileageKm: number;
  payloadRequirementKg: number;
  purchaseIntentMonths: number;
  fuelPreference: "Petrol" | "CNG" | "Hybrid" | "EV";
  createdAt: string;
}
