"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const branchClusterData = [
  { cluster: "Karachi Metro", target: 140, actual: 154, conversion: 14.2 },
  { cluster: "Lahore City", target: 120, actual: 138, conversion: 15.6 },
  { cluster: "ISB & Rawalpindi", target: 80, actual: 86, conversion: 13.8 },
  { cluster: "FSD & Central", target: 60, actual: 62, conversion: 11.2 },
  { cluster: "Multan & South", target: 40, actual: 42, conversion: 11.8 },
  { cluster: "Peshawar & KP", target: 40, actual: 38, conversion: 9.8 },
];

const teamChartConfig = {
  actual: {
    label: "Actual Bookings (Units)",
    color: "var(--chart-3)",
  },
  target: {
    label: "Target Quota (Units)",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

export function TeamPerformanceChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">
          Branch Clusters: Monthly Sales Quota vs Actual (Units)
        </CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          520 Units Booked / 480 Quota (108.3% Network Target Achieved)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={teamChartConfig} className="h-60 w-full">
          <BarChart accessibilityLayer data={branchClusterData} margin={{ bottom: 0, left: -10, right: 10, top: 10 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="cluster" axisLine={false} tickLine={false} tickMargin={10} tick={{ fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tickMargin={6} tick={{ fontSize: 11 }} width={38} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-muted-foreground">{String(name)}</span>
                      <span className="font-medium font-mono text-foreground tabular-nums">{Number(value)} Units</span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend
              align="right"
              verticalAlign="top"
              className="justify-end pb-2"
              content={<ChartLegendContent />}
            />
            <Bar dataKey="actual" fill="var(--color-actual, var(--chart-3))" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="target"
              fill="var(--color-target, var(--muted-foreground))"
              opacity={0.3}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
