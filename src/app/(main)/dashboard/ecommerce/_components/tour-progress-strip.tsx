"use client";

import { CheckCircle2, Clock, MapPin, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TOUR_CITIES } from "@/data/suzuki-express/tour-schedule";

export function TourProgressStrip() {
  const completedCount = TOUR_CITIES.filter((c) => c.status === "completed").length;
  const activeCity = TOUR_CITIES.find((c) => c.status === "active");

  return (
    <Card className="col-span-12 shadow-xs border-primary/20 bg-linear-to-r from-card via-card to-primary/5">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              Suzuki Express 2026 • 15-City Campaign Tour Schedule
            </CardTitle>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
              Season 5 Live
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Direct on-ground caravan spanning ROS (Sindh) and ROSP (South Punjab), followed by Ramadan/Eid break
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Active Tour Stop: <strong>{activeCity?.city || "Usta Muhammad"}</strong>
            </span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            Progress:{" "}
            <strong>
              {completedCount} of {TOUR_CITIES.length} Cities Completed
            </strong>
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-1 pb-4">
        <div className="relative overflow-x-auto pb-2">
          <div className="flex items-stretch gap-2.5 min-w-[1050px]">
            {TOUR_CITIES.map((city) => {
              const isCompleted = city.status === "completed";
              const isActive = city.status === "active";

              return (
                <div
                  key={city.serialNo}
                  className={`flex flex-col justify-between rounded-lg p-2.5 min-w-[130px] border transition-all ${
                    isActive
                      ? "bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs"
                      : isCompleted
                        ? "bg-muted/40 border-muted-foreground/20"
                        : "bg-card border-dashed border-border/80 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-muted-foreground">#{city.serialNo}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[9px] px-1.5 py-0 h-4 font-normal ${
                        city.region === "ROS"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {city.region}
                    </Badge>
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
            })}

            {/* Ramadan & Eid Break marker */}
            <div className="flex flex-col justify-center items-center rounded-lg p-2.5 min-w-[130px] border border-primary/30 bg-primary/5 text-center">
              <Sparkles className="size-4 text-primary mb-1" />
              <span className="text-[11px] font-semibold text-foreground">Ramadan & Eid</span>
              <span className="text-[9px] text-muted-foreground">Activity Break</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
