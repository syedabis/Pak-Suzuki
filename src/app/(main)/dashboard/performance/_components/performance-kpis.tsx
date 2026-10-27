"use client";

import { useMemo } from "react";

import { cn } from "cn";
import { Car, ShieldCheck, Trophy, Users } from "lucide-react";

import { Card } from "@/components/ui/card";

import { getTourStopsPerformance } from "./performance-data";

interface PerformanceKpisProps {
  readonly selectedScope?: string;
}

export function PerformanceKpis({ selectedScope = "phase-1" }: PerformanceKpisProps) {
  const kpis = useMemo(() => {
    const allStops = getTourStopsPerformance();

    let targetStops = allStops;
    if (selectedScope === "phase-1") {
      targetStops = allStops.filter((s) => s.phase === 1);
    } else if (selectedScope === "phase-2") {
      targetStops = allStops.filter((s) => s.phase === 2);
    } else if (selectedScope !== "all-38") {
      targetStops = allStops.filter((s) => s.region.toLowerCase() === selectedScope.toLowerCase());
    }

    if (targetStops.length === 0) targetStops = allStops;

    let totalFootfall = 0;
    let totalTarget = 0;
    let totalTestDrives = 0;
    let totalInquiries = 0;
    let totalTradeIns = 0;
    let totalCheckups = 0;
    let totalOilChanges = 0;
    let totalPartsSales = 0;
    let topStop = targetStops[0];

    for (const s of targetStops) {
      totalFootfall += s.footfall;
      totalTarget += s.footfallTarget;
      totalTestDrives += s.testDrives;
      totalInquiries += s.salesInquiries;
      totalTradeIns += s.tradeInEvaluations;
      totalCheckups += s.freeCheckups;
      totalOilChanges += s.freeOilChanges;
      totalPartsSales += s.partsSalesPkr;

      if (!topStop || s.footfall > (topStop.footfall || 0)) {
        topStop = s;
      }
    }

    const quotaPct = totalTarget > 0 ? ((totalFootfall / totalTarget) * 100).toFixed(1) : "100";

    return [
      {
        title: "Top Performing Tour Stop",
        value: topStop ? `${topStop.city} (#${topStop.serialNo})` : "Khairpur (#5)",
        subtext: topStop ? `${topStop.dealer} · ${topStop.footfall} Visitors` : "Suzuki Sukkur Motors · 195 Visitors",
        icon: Trophy,
        highlightColor: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
      },
      {
        title: "Caravan Footfall Mobilized",
        value: `${totalFootfall.toLocaleString()} Visitors`,
        subtext: `${quotaPct}% of tour ground quota (${targetStops.length} stops)`,
        icon: Users,
        highlightColor: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      },
      {
        title: "Test Drives & Sales Leads",
        value: `${totalTestDrives.toLocaleString()} / ${totalInquiries.toLocaleString()}`,
        subtext: `${totalTradeIns.toLocaleString()} trade-in appraisals · K-Carry & 4W`,
        icon: Car,
        highlightColor: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
      },
      {
        title: "Mobile 3S Clinic Throughput",
        value: `${totalCheckups.toLocaleString()} Check-ups`,
        subtext: `${totalOilChanges.toLocaleString()} free oil changes · PKR ${(totalPartsSales / 1000).toFixed(0)}k parts`,
        icon: ShieldCheck,
        highlightColor: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      },
    ];
  }, [selectedScope]);

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.title}
            className="flex flex-col justify-between gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-all hover:border-primary/30 sm:p-4.5"
          >
            {/* Header: Title and Icon Badge */}
            <div className="flex items-center justify-between gap-2">
              <span
                className="truncate font-medium text-muted-foreground text-xs leading-tight tracking-tight sm:text-sm"
                title={kpi.title}
              >
                {kpi.title}
              </span>
              <div className={cn("grid size-7 shrink-0 place-items-center rounded-lg sm:size-8", kpi.bg)}>
                <Icon className={cn("size-3.5 sm:size-4", kpi.highlightColor)} />
              </div>
            </div>

            {/* Metric Value & Contextual Subtext */}
            <div className="space-y-1">
              <div
                className="truncate font-bold text-2xl text-foreground tabular-nums leading-none tracking-tight sm:text-3xl"
                title={kpi.value}
              >
                {kpi.value}
              </div>
              <p className="mt-1 truncate font-medium text-muted-foreground text-xs leading-tight" title={kpi.subtext}>
                {kpi.subtext}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
