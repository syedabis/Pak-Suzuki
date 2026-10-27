import { format } from "date-fns";
import { Download, SlidersHorizontal, Sparkles } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { KCarryPerceptionCharts } from "./_components/k-carry-perception-charts";
import { LeadsPipelineTable } from "./_components/leads-pipeline-table";
import { SurveyKpiStrip } from "./_components/survey-kpi-strip";
import { UtilityNeedsCharts } from "./_components/utility-needs-charts";

export const metadata: Metadata = {
  title: "Suzuki K-CARRY Survey & Market Intelligence • Suzuki Express 2026",
  description:
    "Rural customer feedback, Ravi replacement perception, pricing tolerance, and commercial lead analytics from the Suzuki Express 2026 campaign.",
  alternates: {
    canonical: "/dashboard/k-carry-survey",
  },
};

export default function KCarrySurveyPage() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-3xl tracking-tight">K-CARRY Market Perception & Survey Intelligence</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
              <Sparkles className="size-3" /> Season 5 Special
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {formattedDate} • Rural customer feedback on Suzuki K-CARRY as replacement for Ravi across 15 campaign tour
            cities
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Select defaultValue="all-ros">
            <SelectTrigger className="w-52" id="survey-region" size="sm">
              <SelectValue placeholder="Campaign Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-ros">All Tour Cities (ROS & ROSP)</SelectItem>
                <SelectItem value="ros">Region of Sindh (7 Stops)</SelectItem>
                <SelectItem value="rosp">Region of South Punjab (8 Stops)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          <Button size="icon-sm" variant="outline" title="Export Survey Intelligence Report">
            <Download className="size-4" />
          </Button>
          <Button size="icon-sm" variant="outline" title="Filter Settings">
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <SurveyKpiStrip />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg tracking-tight">
            Section A: Customer Demographics & Utility Requirements (Questions 1–5)
          </h2>
          <span className="text-muted-foreground text-xs">Rural business, agricultural & goods transport patterns</span>
        </div>
        <UtilityNeedsCharts />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg tracking-tight">
            Section B: K-CARRY Perception, Price Sensitivity & Purchase Intent (Questions 6–10)
          </h2>
          <span className="text-muted-foreground text-xs">Ravi replacement acceptance and sweet-spot price bands</span>
        </div>
        <KCarryPerceptionCharts />
      </div>

      <LeadsPipelineTable />
    </div>
  );
}
