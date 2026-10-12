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
import { TrafficSources } from "./_components/traffic-sources";

export const metadata: Metadata = {
  title: "Meezan Oil - Field Sales & Door-to-Door Operations Dashboard",
  description:
    "Direct-to-consumer field sales, doorstep surveys, and inventory distribution tracking for 50 agents selling Meezan Oil.",
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
            <h1 className="text-3xl leading-none tracking-tight">Meezan Oil • D2D Field Sales</h1>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-700 text-xs dark:text-emerald-400">
              50 Agents Deployed
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {formattedDate} • Real-time door-to-door sales & consumer survey intelligence
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
          <Select defaultValue="today">
            <SelectTrigger className="w-36" id="field-shift-period" size="sm">
              <SelectValue placeholder="Today's Shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Today's Shift</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="all-territories">
            <SelectTrigger className="w-48" id="field-territory" size="sm">
              <SelectValue placeholder="All Territories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-territories">All Areas (50 Agents)</SelectItem>
                <SelectItem value="gulshan">Gulshan-e-Iqbal (8 Agents)</SelectItem>
                <SelectItem value="dha-clifton">DHA & Clifton (10 Agents)</SelectItem>
                <SelectItem value="north-nazimabad">North Nazimabad (8 Agents)</SelectItem>
                <SelectItem value="johar">Gulistan-e-Johar (8 Agents)</SelectItem>
                <SelectItem value="fb-area">F.B. Area (8 Agents)</SelectItem>
                <SelectItem value="saddar">Saddar & PECHS (8 Agents)</SelectItem>
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
