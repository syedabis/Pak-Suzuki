import type { Metadata } from "next";

import { PerformanceClient } from "./_components/performance-client";

export const metadata: Metadata = {
  title: "Participating Dealer & Tour Performance • Suzuki Express 2026",
  description:
    "Executive evaluation of participating 3S dealerships, regional footfall quotas, K-Carry test drives, and mobile clinic service throughput across all 38 Suzuki Express tour stops.",
  alternates: {
    canonical: "/dashboard/performance",
  },
};

export default function PerformancePage() {
  return <PerformanceClient />;
}
