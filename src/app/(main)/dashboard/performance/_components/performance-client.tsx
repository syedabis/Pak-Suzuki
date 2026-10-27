"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowLeft, Building2, Compass, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { IndividualLeaderboard } from "./individual-leaderboard";
import { getTourStopsPerformance } from "./performance-data";
import { PerformanceKpis } from "./performance-kpis";
import { TeamPerformanceChart } from "./team-chart";
import { TeamPerformanceCards } from "./team-performance";

export function PerformanceClient() {
  const [selectedScope, setSelectedScope] = useState<string>("phase-1");

  const handleExportMaster = () => {
    const allStops = getTourStopsPerformance();
    const headers = [
      "Stop #",
      "City",
      "Region",
      "Phase",
      "Event Date",
      "Participating Dealership",
      "Venue",
      "PS Supervisor",
      "OG Supervisor",
      "Status",
      "Footfall",
      "Test Drives",
      "Sales Inquiries",
      "Trade-in Appraisals",
      "Free 3S Checkups",
      "Free Oil Changes",
      "Parts Sales PKR",
    ];

    const rows = allStops.map((s) => [
      s.serialNo,
      s.city,
      s.region,
      `Phase ${s.phase}`,
      s.eventDate,
      `"${s.dealer.replace(/"/g, '""')}"`,
      `"${s.venue.replace(/"/g, '""')}"`,
      `"${s.supervisorPS.replace(/"/g, '""')}"`,
      `"${s.supervisorOG.replace(/"/g, '""')}"`,
      s.status,
      s.footfall,
      s.testDrives,
      s.salesInquiries,
      s.tradeInEvaluations,
      s.freeCheckups,
      s.freeOilChanges,
      s.partsSalesPkr,
    ]);

    const csvContent = `data:text/csv;charset=utf-8,${[headers.join(","), ...rows.map((r) => r.join(","))].join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Suzuki_Express_Performance_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Streamlined Header Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <Button asChild size="icon-xs" variant="ghost">
            <Link href="/dashboard/campaign-overview" title="Back to Campaign Overview">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              <h1 className="font-semibold text-3xl tracking-tight">Dealer &amp; Tour Performance</h1>
            </div>
            <p className="text-muted-foreground text-xs">
              38-City Nationwide Caravan: On-ground 3S dealer mobilization, test drive velocity &amp; mobile clinic
              throughput
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2.5">
          {/* Caravan Scope Selector */}
          <Select value={selectedScope} onValueChange={setSelectedScope}>
            <SelectTrigger className="w-64" id="perf-scope" size="sm">
              <SelectValue placeholder="Select Tour Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="phase-1" className="font-semibold">
                  Phase 1: 15 Cities (ROS &amp; ROSP)
                </SelectItem>
                <SelectItem value="all-38" className="font-semibold">
                  All 38 Tour Cities (Nationwide)
                </SelectItem>
                <SelectItem value="phase-2">Phase 2: 23 Cities (Post-Eid)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectItem value="ROS">ROS: Region of South (7 Stops)</SelectItem>
                <SelectItem value="ROSP">ROSP: Region of South Punjab (8 Stops)</SelectItem>
                <SelectItem value="ROCP">ROCP: Region of Central Punjab (14 Stops)</SelectItem>
                <SelectItem value="RON">RON: Region of North &amp; KP (9 Stops)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportMaster}
            className="flex items-center gap-1.5 text-xs"
            title="Export Master Dealer Performance (.csv)"
          >
            <Download className="size-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Dynamic Summary KPI Strip */}
      <PerformanceKpis selectedScope={selectedScope} />

      {/* Structured Tabs View */}
      <Tabs defaultValue="all" className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b pb-2">
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              Caravan Performance Overview
            </TabsTrigger>
            <TabsTrigger value="teams" className="text-xs">
              Regional Operational Legs (4 Zones)
            </TabsTrigger>
            <TabsTrigger value="individuals" className="text-xs">
              38-City Dealership Ledger
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Comprehensive Overview */}
        <TabsContent value="all" className="m-0 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-12">
              <TeamPerformanceChart />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-lg">
                <Compass className="size-4 text-primary" />
                Caravan Regional Operational Legs (ROS • ROSP • ROCP • RON)
              </h2>
              <span className="text-muted-foreground text-xs">
                Aggregated footfall quotas, supervisor coverage &amp; leading dealer by zone
              </span>
            </div>
            <TeamPerformanceCards />
          </div>

          <IndividualLeaderboard />
        </TabsContent>

        {/* Tab 2: Regional Legs Focus */}
        <TabsContent value="teams" className="m-0 flex flex-col gap-5">
          <TeamPerformanceChart />
          <TeamPerformanceCards />
        </TabsContent>

        {/* Tab 3: Dealership Ledger Focus */}
        <TabsContent value="individuals" className="m-0 flex flex-col gap-5">
          <IndividualLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
