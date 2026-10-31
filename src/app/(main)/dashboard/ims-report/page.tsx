import type { Metadata } from "next";

import { ImsReportClient } from "./_components/ims-report-client";

export const metadata: Metadata = {
  title: "IMS Master Report • Suzuki Express",
  description:
    "Official Pak Suzuki IMS Data Sheet report displaying dealer and venue-wise enquiry metrics, cross-city event summary, free checkup summary, and conversion records.",
  alternates: {
    canonical: "/dashboard/ims-report",
  },
};

export default function ImsReportPage() {
  return <ImsReportClient />;
}
