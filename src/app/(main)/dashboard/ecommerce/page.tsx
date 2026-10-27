import { format } from "date-fns";
import { Download, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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
    "Real-time rural caravan footfall, 4W & 2W booked test drives, K-Carry launch demand, and aftersales service throughput across 15 tour cities.",
  alternates: {
    canonical: "/dashboard/ecommerce",
  },
};

export default function Page() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl leading-none tracking-tight">Suzuki Express 2026 • Campaign Overview</h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
              Season 5 Live
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {formattedDate} • 15-city rural tour footfall, 4W & 2W test drives, K-Carry commercial debut & aftersales
            service
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
          <Select defaultValue="all-tour">
            <SelectTrigger className="w-48" id="field-territory" size="sm">
              <SelectValue placeholder="Campaign Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-tour">All 15 Tour Stops (ROS & ROSP)</SelectItem>
                <SelectItem value="ros">Region of Sindh (7 Stops)</SelectItem>
                <SelectItem value="rosp">Region of South Punjab (8 Stops)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" />

          <Button size="icon-sm" variant="outline" title="Export Daily Field Report">
            <Download />
          </Button>
          <Button size="icon-sm" variant="outline" title="Shift Settings">
            <SlidersHorizontal />
          </Button>
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
