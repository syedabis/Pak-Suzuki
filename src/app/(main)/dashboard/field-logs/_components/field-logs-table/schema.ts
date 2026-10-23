export const orderFilters = [
  "All",
  "Certified Booked",
  "130-Pt Inspected",
  "Test Drive Completed",
  "Financing Approved",
  "Trade-in Appraised",
] as const;

export type OrderFilter = (typeof orderFilters)[number];

export type VisitSurvey = {
  currentBrand: string;
  monthlyLiters: number;
  reasonOrFeedback: string;
  decisionMaker: string;
};

export type OrderRow = {
  id: string;
  date: string;
  customer: string;
  area: string;
  agent: string;
  payment:
    | "Bank Financing (Meezan)"
    | "Bank Financing (Alfalah)"
    | "Pay Order / PayPro"
    | "Trade-In Advance"
    | "Token Advance";
  total: string;
  items: string;
  fulfillment:
    | "Certified Booked"
    | "130-Pt Inspected"
    | "Test Drive Completed"
    | "Financing Approved"
    | "Trade-in Appraised";
  survey?: VisitSurvey;
};
