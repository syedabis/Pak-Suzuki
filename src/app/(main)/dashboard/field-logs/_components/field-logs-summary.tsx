"use client";

import { useMemo } from "react";

import { cn } from "cn";
import { Banknote, Car, FileCheck, ShieldCheck, Users, Wrench } from "lucide-react";

import { Card } from "@/components/ui/card";
import { DAILY_INQUIRY_RECORDS } from "@/data/suzuki-express/daily-inquiry-data";

interface FieldLogsSummaryProps {
  readonly selectedCity?: string;
}

export function FieldLogsSummary({ selectedCity = "all-venues" }: FieldLogsSummaryProps) {
  const isCitySelected = selectedCity !== "all-venues" && selectedCity !== "all-38";

  const summary = useMemo(() => {
    const targetRecords = isCitySelected
      ? DAILY_INQUIRY_RECORDS.filter((r) => r.city.toLowerCase() === selectedCity.toLowerCase())
      : DAILY_INQUIRY_RECORDS;

    const activeList = targetRecords.length > 0 ? targetRecords : DAILY_INQUIRY_RECORDS;

    let totalFootfall = 0;
    let totalTestDrives = 0;
    let totalSalesEnquiries = 0;
    let totalTradeInEvals = 0;
    let totalConversions = 0;
    let totalFreeCheckups = 0;
    let totalOilChanges = 0;
    let totalPartsSales = 0;

    for (const r of activeList) {
      totalFootfall += r.customerFootfall;
      totalPartsSales += r.aftersales.partsSalesPkr;
      totalFreeCheckups += r.aftersales.freeCheckupsTotal;
      totalOilChanges += r.aftersales.oilChangesTotal;

      for (const fw of r.fourWheelers) {
        totalTestDrives += fw.testDrive;
        totalSalesEnquiries += fw.salesEnquiry;
        totalTradeInEvals += fw.freeEvaluation;
        totalConversions += fw.conversion;
      }
    }

    const firstRecord = activeList[0];

    return {
      totalFootfall,
      totalTestDrives,
      totalSalesEnquiries,
      totalTradeInEvals,
      totalConversions,
      totalFreeCheckups,
      totalOilChanges,
      totalPartsSales,
      cityDealer: firstRecord?.participatingDealer || "3S Network",
      citySerial: firstRecord?.serialNo ? `Stop #${firstRecord.serialNo}` : "",
      recordsCount: activeList.length,
    };
  }, [selectedCity, isCitySelected]);

  const kpis = [
    {
      title: "Caravan Footfall",
      value: `${summary.totalFootfall.toLocaleString()}`,
      subtext: isCitySelected ? `${summary.citySerial} · ${summary.cityDealer}` : "Phase 1 Active Leg Total",
      icon: Users,
      highlightColor: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      title: "Test Drives Dispatched",
      value: `${summary.totalTestDrives.toLocaleString()}`,
      subtext: isCitySelected ? "4W (K-Carry, Every) & 2W" : "85% K-Carry & Every",
      icon: Car,
      highlightColor: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      title: "Sales & Trade Enquiries",
      value: `${summary.totalSalesEnquiries.toLocaleString()}`,
      subtext: `${summary.totalTradeInEvals.toLocaleString()} trade-in appraisals`,
      icon: FileCheck,
      highlightColor: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10 dark:bg-violet-500/20",
    },
    {
      title: "Free Check-ups Done",
      value: `${summary.totalFreeCheckups.toLocaleString()}`,
      subtext: isCitySelected ? "On-site clinic inspections" : "Mobile 3S clinic throughput",
      icon: ShieldCheck,
      highlightColor: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-500/10 dark:bg-sky-500/20",
    },
    {
      title: "Free Oil Changes",
      value: `${summary.totalOilChanges.toLocaleString()}`,
      subtext: isCitySelected ? "Delivered at event grounds" : "Genuine SGP oil service",
      icon: Wrench,
      highlightColor: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
      title: "Parts Sales Revenue",
      value: `PKR ${(summary.totalPartsSales / 1000).toFixed(0)}k`,
      subtext: isCitySelected ? `Generated at ${selectedCity}` : "Over-the-counter campaign total",
      icon: Banknote,
      highlightColor: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.title}
            className="flex flex-col justify-between gap-3 p-4 sm:p-4.5 rounded-xl border border-border/70 shadow-xs hover:border-primary/30 transition-all bg-card"
          >
            {/* Header: Title and Icon Badge */}
            <div className="flex items-center justify-between gap-2">
              <span
                className="font-medium text-xs sm:text-sm text-muted-foreground tracking-tight truncate leading-tight"
                title={kpi.title}
              >
                {kpi.title}
              </span>
              <div className={cn("grid size-7 sm:size-8 place-items-center rounded-lg shrink-0", kpi.bg)}>
                <Icon className={cn("size-3.5 sm:size-4", kpi.highlightColor)} />
              </div>
            </div>

            {/* Metric Value & Contextual Subtext */}
            <div className="space-y-1">
              <div className="font-bold text-2xl sm:text-3xl text-foreground tabular-nums tracking-tight leading-none">
                {kpi.value}
              </div>
              <p className="text-xs text-muted-foreground font-medium truncate leading-tight mt-1" title={kpi.subtext}>
                {kpi.subtext}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
