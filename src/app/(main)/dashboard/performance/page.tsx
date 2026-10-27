import { format } from "date-fns";
import { Download, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { IndividualLeaderboard } from "./_components/individual-leaderboard";
import { PerformanceKpis } from "./_components/performance-kpis";
import { TeamPerformanceChart } from "./_components/team-chart";
import { TeamPerformanceCards } from "./_components/team-performance";

export const metadata: Metadata = {
  title: "Regional & Dealer Performance • Suzuki Express 2026",
  description:
    "Executive evaluation of participating 3S dealerships, regional sales conversion quotas, K-Carry customer leads, and workshop throughput across ROS and ROSP tour stops.",
  alternates: {
    canonical: "/dashboard/performance",
  },
};

export default function PerformancePage() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-3xl tracking-tight">Regional & Dealership Tour Performance</h1>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-700 text-xs dark:text-emerald-400">
              Phase 1: 15 Cities • Total 38 Cities
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {formattedDate} • Campaign conversion quotas, K-Carry replacement sentiment, and workshop efficiency across
            participating dealerships
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-40" id="perf-period" size="sm">
              <SelectValue placeholder="This Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Today's Shift</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month (MTD)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          <Button size="icon-sm" variant="outline" title="Export Branch Performance Report">
            <Download className="size-4" />
          </Button>
          <Button size="icon-sm" variant="outline" title="Settings">
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <PerformanceKpis />

      <Tabs defaultValue="all" className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b pb-2">
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              Overview & All Sections
            </TabsTrigger>
            <TabsTrigger value="teams" className="text-xs">
              Regional Territory Clusters
            </TabsTrigger>
            <TabsTrigger value="individuals" className="text-xs">
              Branch & Dealership Directory
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="m-0 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-12">
              <TeamPerformanceChart />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Regional Territory Clusters (6 Zones)</h2>
              <span className="text-muted-foreground text-xs">
                Aggregated quotas and conversion metrics by metropolitan hub
              </span>
            </div>
            <TeamPerformanceCards />
          </div>

          <IndividualLeaderboard />
        </TabsContent>

        <TabsContent value="teams" className="m-0 flex flex-col gap-5">
          <TeamPerformanceChart />
          <TeamPerformanceCards />
        </TabsContent>

        <TabsContent value="individuals" className="m-0 flex flex-col gap-5">
          <IndividualLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
