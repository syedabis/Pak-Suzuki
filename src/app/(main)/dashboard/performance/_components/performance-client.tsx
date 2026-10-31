"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { ArrowLeft, Building2, Calendar, Clock, Compass, Download, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

import { IndividualLeaderboard } from "./individual-leaderboard";
import { InterceptionsLedger } from "./interceptions-ledger";
import { getTourStopsPerformance } from "./performance-data";
import { PerformanceKpis } from "./performance-kpis";
import { TeamPerformanceChart } from "./team-chart";
import { TeamPerformanceCards } from "./team-performance";

export function PerformanceClient() {
  const [selectedScope, setSelectedScope] = useState<string>("phase-1");
  const [cloudMasterSheets, setCloudMasterSheets] = useState<any[]>([]);
  const [cloudInterceptions, setCloudInterceptions] = useState<any[]>([]);

  useEffect(() => {
    async function loadCloudData() {
      // 1. Fetch latest daily master sheets
      const { data: sheetsData } = await supabase
        .from("daily_master_sheets")
        .select("*")
        .order("created_at", { ascending: false });

      if (sheetsData && sheetsData.length > 0) {
        setCloudMasterSheets(sheetsData);
      }

      // 2. Fetch latest customer interceptions
      const { data: intData } = await supabase
        .from("customer_interceptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (intData && intData.length > 0) {
        setCloudInterceptions(intData);
      }
    }

    loadCloudData();

    // Subscribe to realtime changes for customer interceptions
    const intChannel = supabase
      .channel("perf:customer_interceptions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "customer_interceptions" },
        (payload: any) => {
          setCloudInterceptions((prev) => [payload.new, ...prev]);
        },
      )
      .subscribe();

    // Subscribe to realtime changes for daily master sheets
    const sheetsChannel = supabase
      .channel("perf:daily_master_sheets")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "daily_master_sheets" }, (payload: any) => {
        setCloudMasterSheets((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(intChannel);
      supabase.removeChannel(sheetsChannel);
    };
  }, []);

  const allStops = useMemo(
    () => getTourStopsPerformance(cloudMasterSheets, cloudInterceptions),
    [cloudMasterSheets, cloudInterceptions],
  );

  const handleExportMaster = () => {
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
      "Visitor Leads",
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
      s.interceptionsCount,
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
              38-City Nationwide Caravan: On-ground 3S dealer mobilization, visitor interceptions, test drive velocity
              &amp; mobile clinic throughput
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
      <PerformanceKpis selectedScope={selectedScope} stops={allStops} totalInterceptions={cloudInterceptions.length} />

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
            <TabsTrigger value="interceptions" className="text-xs flex items-center gap-1.5">
              <Users className="size-3.5" />
              Customer Leads ({cloudInterceptions.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Comprehensive Overview */}
        <TabsContent value="all" className="m-0 flex flex-col gap-5">
          {/* Caravan Tour Schedule & Pakistan Standard Time Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 px-3.5 py-2.5 rounded-lg border border-border/70 bg-card/60 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-foreground">Nationwide Caravan Tour Schedule</span>
              <span className="text-xs text-muted-foreground">• 38 Tour Stop Cities across 4 Operational Zones</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Calendar className="size-3.5 text-primary" />
                05 Nov 2026 – 05 Jan 2027
              </span>
              <span className="flex items-center gap-1.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                <Clock className="size-3" />
                09:00 to 17:30 (PKT UTC+5)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-12">
              <TeamPerformanceChart stops={allStops} />
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
            <TeamPerformanceCards stops={allStops} />
          </div>

          <IndividualLeaderboard stops={allStops} />

          {/* Customer Interceptions Leads directly visible on Overview */}
          <InterceptionsLedger interceptions={cloudInterceptions} />
        </TabsContent>

        {/* Tab 2: Regional Legs Focus */}
        <TabsContent value="teams" className="m-0 flex flex-col gap-5">
          <TeamPerformanceChart stops={allStops} />
          <TeamPerformanceCards stops={allStops} />
        </TabsContent>

        {/* Tab 3: Dealership Ledger Focus */}
        <TabsContent value="individuals" className="m-0 flex flex-col gap-5">
          <IndividualLeaderboard stops={allStops} />
        </TabsContent>

        {/* Tab 4: Customer Interceptions Leads Focus */}
        <TabsContent value="interceptions" className="m-0 flex flex-col gap-5">
          <InterceptionsLedger interceptions={cloudInterceptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
