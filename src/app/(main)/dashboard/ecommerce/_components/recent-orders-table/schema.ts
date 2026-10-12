export const orderFilters = ["All", "Delivered", "Sample Given", "Revisit Scheduled", "Digital Pay", "Cash"] as const;

export type OrderFilter = (typeof orderFilters)[number];

export type OrderRow = {
  id: string;
  date: string;
  customer: string;
  agent: string;
  payment: "Cash" | "Raast / Digital" | "Follow-up";
  total: string;
  items: string;
  fulfillment: "Delivered" | "Sample Given" | "Revisit Scheduled";
};
