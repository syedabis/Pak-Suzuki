"use client";

import { useState } from "react";

import { Calendar, CheckCircle2, Clock, MapPin, Moon, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PHASE_1_CITIES, PHASE_2_CITIES, TOUR_CITIES } from "@/data/suzuki-express/tour-schedule";
import type { TourCity } from "@/data/suzuki-express/types";

export function TourProgressStrip() {
  const [activeTab, setActiveTab] = useState<"phase1" | "phase2" | "all">("phase1");

  const completedCount = TOUR_CITIES.filter((c) => c.status === "completed").length;
  const activeCity = TOUR_CITIES.find((c) => c.status === "active");

  const displayedCities =
    activeTab === "phase1" ? PHASE_1_CITIES : activeTab === "phase2" ? PHASE_2_CITIES : TOUR_CITIES;

  const renderCityCard = (city: TourCity) => {
    const isCompleted = city.status === "completed";
    const isActive = city.status === "active";

    const getRegionStyle = (region: string) => {
      switch (region) {
        case "ROS":
          return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
        case "ROSP":
          return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
        case "ROCP":
          return "bg-sky-500/10 text-sky-700 dark:text-sky-400";
        case "RON":
          return "bg-violet-500/10 text-violet-700 dark:text-violet-400";
        default:
          return "bg-muted text-muted-foreground";
      }
    };

    return (
      <div
        key={city.serialNo}
        className={`flex flex-col justify-between rounded-lg p-2.5 min-w-[135px] border transition-all ${
          isActive
            ? "bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs"
            : isCompleted
              ? "bg-muted/40 border-muted-foreground/20"
              : "bg-card border-dashed border-border/80 opacity-70"
        }`}
      >
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="font-mono font-bold text-muted-foreground">#{city.serialNo}</span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-semibold text-muted-foreground">P{city.phase}</span>
            <Badge
              variant="secondary"
              className={`text-[9px] px-1.5 py-0 h-4 font-normal ${getRegionStyle(city.region)}`}
            >
              {city.region}
            </Badge>
          </div>
        </div>

        <div className="my-1">
          <span className="font-semibold text-xs block text-foreground truncate" title={city.city}>
            {city.city}
          </span>
          <span className="text-[10px] text-muted-foreground block truncate" title={city.dealer}>
            {city.dealer.replace("Suzuki ", "")}
          </span>
        </div>

        <div className="mt-2 pt-1.5 border-t border-border/50 flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground font-mono">{city.eventDate.slice(5)}</span>
          {isActive ? (
            <span className="inline-flex items-center gap-1 font-semibold text-primary">
              <Clock className="size-3" /> Live
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="size-3" /> Done
            </span>
          ) : (
            <span className="text-muted-foreground">Upcoming</span>
          )}
        </div>
      </div>
    );
  };

  const renderBreakCard = () => (
    <div
      key="ramadan-eid-break"
      className="flex flex-col justify-between rounded-lg p-3 min-w-[170px] border border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/15 text-center relative overflow-hidden"
    >
      <div className="flex items-center justify-between text-[10px] text-amber-700 dark:text-amber-400 font-medium">
        <span className="inline-flex items-center gap-1 font-semibold">
          <Moon className="size-3 text-amber-600 dark:text-amber-400" /> Mid-Tour
        </span>
        <Badge
          variant="outline"
          className="text-[9px] px-1.5 py-0 h-4 border-amber-500/40 text-amber-700 dark:text-amber-300"
        >
          Recess
        </Badge>
      </div>

      <div className="my-1.5">
        <span className="text-xs font-bold text-foreground block">Ramadan & Eid</span>
        <span className="text-[10px] text-muted-foreground block">Activity Break</span>
      </div>

      <div className="pt-1.5 border-t border-amber-500/30 flex items-center justify-center gap-1 text-[10px] text-amber-800 dark:text-amber-300 font-medium">
        <Sparkles className="size-3" /> Phase 2 Resumes
      </div>
    </div>
  );

  return (
    <Card className="col-span-12 shadow-xs border-primary/20 bg-linear-to-r from-card via-card to-primary/5">
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            Suzuki Express 2026 • 38-City Tour Schedule
          </CardTitle>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "phase1" | "phase2" | "all")}>
            <TabsList className="h-8">
              <TabsTrigger value="phase1" className="text-xs px-2.5">
                Phase 1 (15 Cities)
              </TabsTrigger>
              <TabsTrigger value="phase2" className="text-xs px-2.5">
                Phase 2 (23 Cities)
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs px-2.5">
                All 38 Cities
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 text-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Active: <strong>{activeCity?.city || "Usta Muhammad"}</strong>
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              Progress: <strong>{completedCount} of 15 (Phase 1)</strong>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-1 pb-4">
        <div className="relative overflow-x-auto pb-2">
          <div className="flex items-stretch gap-2.5 min-w-[1050px]">
            {activeTab === "all" ? (
              <>
                {PHASE_1_CITIES.map(renderCityCard)}
                {renderBreakCard()}
                {PHASE_2_CITIES.map(renderCityCard)}
              </>
            ) : activeTab === "phase1" ? (
              <>
                {PHASE_1_CITIES.map(renderCityCard)}
                {renderBreakCard()}
              </>
            ) : (
              <>
                {renderBreakCard()}
                {PHASE_2_CITIES.map(renderCityCard)}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
