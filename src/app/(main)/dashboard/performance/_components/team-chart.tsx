"use client";

import { useState } from "react";

import { Compass, Calendar, Clock } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getRegionalCaravanSummaries, type DealershipTourStop } from "./performance-data";

const regionalChartConfig = {
  footfall: {
    label: "Caravan Footfall",
    color: "#0a9396",
  },
  testDrives: {
    label: "Test Drives Dispatched",
    color: "#ee9b00",
  },
  salesInquiries: {
    label: "Sales & Trade Inquiries",
    color: "#ca6702",
  },
  freeCheckups: {
    label: "Mobile 3S Clinic Inspections",
    color: "#005f73",
  },
  freeOilChanges: {
    label: "Free Oil Changes",
    color: "#94d2bd",
  },
} satisfies ChartConfig;

export function TeamPerformanceChart({ stops }: { stops?: DealershipTourStop[] } = {}) {
  const [metricView, setMetricView] = useState<"engagement" | "services">("engagement");
  const regionSummaries = getRegionalCaravanSummaries(stops);

  const chartData = regionSummaries.map((r) => ({
    region: r.region,
    regionLabel: r.label.split(" ")[0],
    footfall: r.footfall,
    target: r.footfallTarget,
    testDrives: r.testDrives,
    salesInquiries: r.salesInquiries,
    freeCheckups: r.freeCheckups,
    freeOilChanges: r.freeOilChanges,
    status: r.status,
  }));

  const totalPhase1Footfall = regionSummaries
    .filter((r) => r.status === "Active")
    .reduce((sum, r) => sum + r.footfall, 0);

  const totalPhase1TestDrives = regionSummaries
    .filter((r) => r.status === "Active")
    .reduce((sum, r) => sum + r.testDrives, 0);

  return (
    <Card className="h-full shadow-xs">
      <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 font-semibold text-base">
            <Compass className="size-4 text-primary" />
            Caravan Regional Operational Legs Comparison
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            {totalPhase1Footfall.toLocaleString()} Active Tour Footfall &amp; {totalPhase1TestDrives.toLocaleString()}{" "}
            Test Drives across Phase 1 (ROS &amp; ROSP) vs Phase 2 Benchmarks
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium bg-muted/60 px-2.5 py-1 rounded-md border border-border/50">
            <span className="flex items-center gap-1">
              <Calendar className="size-3 text-primary" />
              <span>05 Nov 2026 – 05 Jan 2027</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400">
              <Clock className="size-3" />
              <span>09:00 to 17:30 (PKT)</span>
            </span>
          </div>

          <Tabs value={metricView} onValueChange={(v) => setMetricView(v as typeof metricView)}>
            <TabsList className="h-8">
              <TabsTrigger value="engagement" className="px-2.5 text-xs">
                Footfall &amp; Inquiries
              </TabsTrigger>
              <TabsTrigger value="services" className="px-2.5 text-xs">
                Mobile 3S Clinic Services
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={regionalChartConfig} className="h-64 w-full sm:h-72">
          <BarChart accessibilityLayer data={chartData} margin={{ bottom: 0, left: -10, right: 10, top: 10 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="region"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fontSize: 12, fontWeight: 500 }}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={6} tick={{ fontSize: 11 }} width={38} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground text-xs">{String(name)}</span>
                      <span className="font-mono font-semibold text-foreground text-xs tabular-nums">
                        {Number(value).toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend
              align="right"
              verticalAlign="top"
              className="justify-end pb-2"
              content={<ChartLegendContent />}
            />

            {metricView === "engagement" ? (
              <>
                <Bar dataKey="footfall" fill="var(--color-footfall, #0a9396)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="testDrives" fill="var(--color-testDrives, #ee9b00)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="salesInquiries" fill="var(--color-salesInquiries, #ca6702)" radius={[4, 4, 0, 0]} />
              </>
            ) : (
              <>
                <Bar dataKey="freeCheckups" fill="var(--color-freeCheckups, #005f73)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="freeOilChanges" fill="var(--color-freeOilChanges, #94d2bd)" radius={[4, 4, 0, 0]} />
              </>
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
