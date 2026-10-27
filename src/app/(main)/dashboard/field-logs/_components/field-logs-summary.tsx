"use client";

import { useMemo } from "react";

import { Banknote, Car, FileCheck, ShieldCheck, Users, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DAILY_INQUIRY_RECORDS } from "@/data/suzuki-express/daily-inquiry-data";

export function FieldLogsSummary() {
  const summary = useMemo(() => {
    let totalFootfall = 0;
    let totalTestDrives = 0;
    let totalSalesEnquiries = 0;
    let totalTradeInEvals = 0;
    let totalConversions = 0;
    let totalFreeCheckups = 0;
    let totalOilChanges = 0;
    let totalPartsSales = 0;

    for (const r of DAILY_INQUIRY_RECORDS) {
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

    return {
      totalFootfall,
      totalTestDrives,
      totalSalesEnquiries,
      totalTradeInEvals,
      totalConversions,
      totalFreeCheckups,
      totalOilChanges,
      totalPartsSales,
      completedStops: DAILY_INQUIRY_RECORDS.length,
    };
  }, []);

  const kpis = [
    {
      title: "Caravan Footfall",
      value: `${summary.totalFootfall.toLocaleString()}`,
      subtext: "168 at Usta Muhammad",
      icon: Users,
      highlightColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Test Drives Dispatched",
      value: `${summary.totalTestDrives.toLocaleString()}`,
      subtext: "85% K-Carry & Every",
      icon: Car,
      highlightColor: "text-primary",
    },
    {
      title: "Sales & Trade Enquiries",
      value: `${summary.totalSalesEnquiries.toLocaleString()}`,
      subtext: `${summary.totalTradeInEvals} trade-in appraisals`,
      icon: FileCheck,
      highlightColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Free Check-ups Done",
      value: `${summary.totalFreeCheckups.toLocaleString()}`,
      subtext: "83 at Usta Muhammad",
      icon: ShieldCheck,
      highlightColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Free Oil Changes",
      value: `${summary.totalOilChanges.toLocaleString()}`,
      subtext: "81 at Usta Muhammad",
      icon: Wrench,
      highlightColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Parts & Accessories Sales",
      value: `PKR ${(summary.totalPartsSales / 1000).toFixed(0)}k`,
      subtext: "PKR 60,754 at Usta Muhammad",
      icon: Banknote,
      highlightColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title} className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-4">
              <CardTitle className="font-medium text-muted-foreground text-xs truncate" title={kpi.title}>
                {kpi.title}
              </CardTitle>
              <Icon className="size-3.5 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="font-bold text-xl tabular-nums tracking-tight text-foreground">{kpi.value}</div>
              <p className="text-muted-foreground text-[11px] mt-0.5 truncate" title={kpi.subtext}>
                {kpi.subtext}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
