"use client";

import { Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getRegionalCaravanSummaries } from "./performance-data";

export function TeamPerformanceCards() {
  const regions = getRegionalCaravanSummaries();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {regions.map((reg) => {
        const percentAchieved = reg.footfallTarget > 0 ? Math.round((reg.footfall / reg.footfallTarget) * 100) : 0;
        const isActive = reg.status === "Active";

        return (
          <Card
            key={reg.region}
            className="flex flex-col justify-between border border-border/70 shadow-xs transition-all hover:border-primary/30"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-primary text-sm tracking-tight">{reg.region}</span>
                    <span className="font-normal text-muted-foreground text-xs">({reg.totalCities} Cities)</span>
                  </div>
                  <CardTitle className="font-semibold text-sm leading-snug">{reg.label}</CardTitle>
                  <CardDescription className="line-clamp-1 text-muted-foreground text-xs">
                    {reg.subLabel}
                  </CardDescription>
                </div>

                <Badge variant={isActive ? "default" : "secondary"} className="shrink-0 font-medium text-[10px]">
                  {isActive ? "Active Tour Leg" : "Post-Eid Phase"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              {/* Footfall Progress */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Ground Footfall Quota</span>
                  <span className="font-medium tabular-nums">
                    {isActive
                      ? `${reg.footfall.toLocaleString()} / ${reg.footfallTarget.toLocaleString()}`
                      : `${reg.footfallTarget.toLocaleString()} (Target)`}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(percentAchieved, 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric Matrix */}
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                <div>
                  <span className="block text-[11px] text-muted-foreground">Test Drives / Leads:</span>
                  <div className="mt-0.5 font-semibold text-foreground text-xs tabular-nums">
                    {isActive ? `${reg.testDrives} Drives • ${reg.salesInquiries} Leads` : "Scheduled Phase 2"}
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] text-muted-foreground">Mobile 3S Clinic:</span>
                  <div className="mt-0.5 font-semibold text-foreground text-xs tabular-nums">
                    {isActive ? `${reg.freeCheckups} Checkups • ${reg.freeOilChanges} Oil` : "Mobile Team Queued"}
                  </div>
                </div>
              </div>

              <div className="space-y-0.5 text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>PSMCL Lead:</span>
                  <span className="font-medium text-foreground">{reg.psLead}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>OG Event Lead:</span>
                  <span className="font-medium text-foreground">{reg.ogLead}</span>
                </div>
              </div>

              <Separator />

              {/* Leading Stop / Dealership */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="size-3.5 shrink-0 text-primary" />
                  <span className="truncate">Top Tour Dealer:</span>
                </div>
                <span className="max-w-[130px] truncate font-medium text-foreground" title={reg.topDealer}>
                  {reg.topDealer}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
