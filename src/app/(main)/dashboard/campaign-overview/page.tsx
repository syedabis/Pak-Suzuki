import type { Metadata } from "next";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CustomerReviews } from "./_components/customer-reviews";
import { KpiStrip } from "./_components/kpi-strip";
import { NonConversionReasons } from "./_components/non-conversion-reasons";
import { StoreTraffic } from "./_components/store-traffic";
import { TopProducts } from "./_components/top-products";
import { TourProgressStrip } from "./_components/tour-progress-strip";
import { TrafficSources } from "./_components/traffic-sources";

export const metadata: Metadata = {
  title: "Suzuki Express 2026 • Campaign Overview & IMS Dashboard",
  description:
    "Real-time nationwide caravan footfall, 4W & 2W booked test drives, K-Carry launch demand, and aftersales service throughput across 38 tour cities (Phase 1: 15 cities, Ramadan & Eid break, Phase 2: 23 cities).",
  alternates: {
    canonical: "/dashboard/campaign-overview",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl leading-none tracking-tight">Suzuki Express 2026 • Campaign Overview</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
          <Select defaultValue="all-tour">
            <SelectTrigger className="w-56" id="field-territory" size="sm">
              <SelectValue placeholder="Campaign Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-tour">All 38 Tour Stops (Nationwide)</SelectItem>
                <SelectItem value="phase1">Phase 1: 15 Cities (ROS & ROSP - Active)</SelectItem>
                <SelectItem value="phase2">Phase 2: 23 Cities (ROCP & RON - Post-Eid)</SelectItem>
                <SelectItem value="ros">Region of Sindh (ROS • 7 Stops)</SelectItem>
                <SelectItem value="rosp">Region of South Punjab (ROSP • 8 Stops)</SelectItem>
                <SelectItem value="rocp">Region of Central Punjab (ROCP • 9 Stops)</SelectItem>
                <SelectItem value="ron">Region of North (RON • 14 Stops)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <TourProgressStrip />
        <KpiStrip />
        <div className="xl:col-span-5">
          <StoreTraffic />
        </div>
        <div className="xl:col-span-7">
          <TrafficSources />
        </div>
        <div className="xl:col-span-4">
          <TopProducts />
        </div>
        <div className="xl:col-span-4">
          <NonConversionReasons />
        </div>
        <div className="xl:col-span-4">
          <CustomerReviews />
        </div>
      </div>
    </div>
  );
}
