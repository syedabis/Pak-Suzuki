import { Award, Flame, Percent, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PerformanceKpis() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Top Performing Team</CardTitle>
          <Trophy className="size-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">DHA & Clifton</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">1,120 L Sold</span> (112% of quota • 10
            Agents)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Top Agent of the Day</CardTitle>
          <Award className="size-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">Zeeshan Ali</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">148 L Sold</span> (Rs. 74,000 • 38.5%
            conversion)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Avg Doorstep Conversion</CardTitle>
          <Percent className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">31.4%</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">892 / 2,840</span> households converted
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Daily Incentive Pool Earned</CardTitle>
          <Flame className="size-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">Rs. 144,600</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-foreground">Rs. 3,012 avg</span> per active field agent
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
