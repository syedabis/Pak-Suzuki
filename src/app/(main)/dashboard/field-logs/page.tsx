import type { Metadata } from "next";

import { FieldLogsClient } from "./_components/field-logs-client";

export const metadata: Metadata = {
  title: "Inquiry Sheets • Suzuki Express 2026",
  description:
    "Official on-ground daily event master inquiry sheets recorded across 38 tour cities nationwide (Phase 1: 15 cities, Ramadan & Eid break, Phase 2: 23 cities), participating 3S dealerships, and field supervisors.",
  alternates: {
    canonical: "/dashboard/field-logs",
  },
};

export default function FieldLogsPage() {
  return <FieldLogsClient />;
}
