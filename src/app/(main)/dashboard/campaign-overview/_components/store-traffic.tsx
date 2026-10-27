"use client";

import { Clock, TrendingUp } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const hourlyCaravanActivity = [
  { time: "10 AM", visitors: 85, testDrives: 22 },
  { time: "11 AM", visitors: 165, testDrives: 48 },
  { time: "12 PM", visitors: 240, testDrives: 72 },
  { time: "1 PM", visitors: 180, testDrives: 55 },
  { time: "2 PM", visitors: 290, testDrives: 88 },
  { time: "3 PM", visitors: 340, testDrives: 98 },
  { time: "4 PM", visitors: 310, testDrives: 90 },
  { time: "5 PM", visitors: 220, testDrives: 64 },
  { time: "6 PM", visitors: 110, testDrives: 30 },
];

const trafficConfig = {
  visitors: {
    label: "On-Ground Visitors",
    color: "var(--primary)",
  },
  testDrives: {
    label: "Test Drives Conducted",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function StoreTraffic() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm flex items-center gap-1.5">
          <Clock className="size-4 text-primary" />
          Caravan Ground Activity Pace
        </CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          Hourly Tour Stop Footfall &amp; Test Drive Run Rate
        </CardDescription>
        <CardAction className="text-xs text-muted-foreground">10:00 AM – 6:00 PM Active Camp</CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={trafficConfig} className="h-54 w-full">
          <ComposedChart
            accessibilityLayer
            data={hourlyCaravanActivity}
            margin={{ bottom: 0, left: -16, right: 12, top: 10 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} className="text-[11px]" />
            <YAxis tickLine={false} axisLine={false} className="text-[11px]" tickFormatter={(v) => `${v}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="visitors"
              fill="var(--color-visitors)"
              fillOpacity={0.15}
              stroke="var(--color-visitors)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="testDrives"
              stroke="var(--color-testDrives)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--color-testDrives)" }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
