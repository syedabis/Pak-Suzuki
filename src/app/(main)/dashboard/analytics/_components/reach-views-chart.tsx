"use client";

import { Ellipsis } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const reachViewsData = [
  { week: "W1", organicReach: 280000, paidReach: 95000, views: 540000 },
  { week: "W2", organicReach: 320000, paidReach: 110000, views: 620000 },
  { week: "W3", organicReach: 390000, paidReach: 125000, views: 780000 },
  { week: "W4", organicReach: 450000, paidReach: 112000, views: 920000 },
];

const chartConfig = {
  organicReach: {
    label: "Organic Reach",
    color: "var(--chart-1)",
  },
  paidReach: {
    label: "Paid Reach",
    color: "var(--chart-5)",
  },
  views: {
    label: "Total Views",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ReachViewsChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-normal text-base">Weekly Reach vs. Total Views</CardTitle>
            <CardDescription className="text-xs">
              Comparing organic & paid audience reach with total video views
            </CardDescription>
          </div>
          <CardAction>
            <Ellipsis className="size-4 text-muted-foreground" />
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <ComposedChart data={reachViewsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="week" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="organicReach" stackId="a" fill="var(--color-organicReach)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="paidReach" stackId="a" fill="var(--color-paidReach)" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={3} dot={{ r: 4 }} />
          </ComposedChart>
        </ChartContainer>

        <div className="mt-4 flex flex-wrap items-center justify-around border-border border-t pt-3 text-xs">
          <div className="text-center">
            <span className="text-muted-foreground">Organic Share</span>
            <div className="font-semibold text-foreground text-sm">76.0%</div>
          </div>
          <div className="text-center">
            <span className="text-muted-foreground">Paid Share</span>
            <div className="font-semibold text-foreground text-sm">24.0%</div>
          </div>
          <div className="text-center">
            <span className="text-muted-foreground">Views to Reach Ratio</span>
            <div className="font-semibold text-primary text-sm">1.69x</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
