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

const teamVolumeData = [
  { team: "DHA & Clifton", target: 1000, actual: 1120, conversion: 36.8 },
  { team: "Gulshan-e-Iqbal", target: 900, actual: 880, conversion: 34.2 },
  { team: "North Nazimabad", target: 800, actual: 780, conversion: 30.5 },
  { team: "F.B. Area", target: 750, actual: 720, conversion: 29.4 },
  { team: "Johar Force", target: 750, actual: 710, conversion: 28.6 },
  { team: "PECHS & Saddar", target: 700, actual: 610, conversion: 27.2 },
];

const teamChartConfig = {
  actual: {
    label: "Actual Volume Sold (L)",
    color: "var(--chart-3)",
  },
  target: {
    label: "Target Quota (L)",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

export function TeamPerformanceChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">
          Team Volume: Target vs Actual (Litres)
        </CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          4,820 L / 4,900 L Daily Quota (98.4%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={teamChartConfig} className="h-60 w-full">
          <BarChart accessibilityLayer data={teamVolumeData} margin={{ bottom: 0, left: -10, right: 10, top: 10 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="team" axisLine={false} tickLine={false} tickMargin={10} tick={{ fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tickMargin={6} tick={{ fontSize: 11 }} width={38} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-muted-foreground">{String(name)}</span>
                      <span className="font-medium font-mono text-foreground tabular-nums">{Number(value)} Litres</span>
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
