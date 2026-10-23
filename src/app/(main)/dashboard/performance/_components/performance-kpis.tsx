import { Award, CheckCircle2, Percent, Trophy, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PerformanceKpis() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Top Performing Region</CardTitle>
          <Trophy className="size-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">Central Region</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">228 Units Booked</span> (114% of quota
            • 68 3S Dealerships)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Top Dealership Branch</CardTitle>
          <Award className="size-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">Central Motor World</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">38 Units</span> (Karachi • 14.8%
            conversion rate)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">National Showroom Conversion</CardTitle>
          <Percent className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">12.8%</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">468 / 3,656</span> qualified walk-ins
            converted
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Workshop 3S SLA Compliance</CardTitle>
          <Wrench className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">94.2%</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-foreground">Express PMS &lt; 45m</span> average across all branches
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
