"use client";

import { ArrowUpRight } from "lucide-react";
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

const hourlyFieldActivity = [
  { time: "9 AM", visits: 140, callbacks: 12 },
  { time: "10 AM", visits: 220, callbacks: 18 },
  { time: "11 AM", visits: 310, callbacks: 24 },
  { time: "12 PM", visits: 360, callbacks: 28 },
  { time: "1 PM", visits: 280, callbacks: 22 },
  { time: "2 PM", visits: 190, callbacks: 15 },
  { time: "3 PM", visits: 250, callbacks: 20 },
  { time: "4 PM", visits: 390, callbacks: 32 },
  { time: "5 PM", visits: 350, callbacks: 29 },
  { time: "6 PM", visits: 230, callbacks: 19 },
  { time: "7 PM", visits: 120, callbacks: 10 },
];

const trafficConfig = {
  visits: {
    label: "Door Knocks / Visits",
    color: "var(--chart-3)",
  },
  callbacks: {
    label: "Re-visits / Callbacks",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StoreTraffic() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Door Knocks & Visit Pace</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          2,840 visits logged today
        </CardDescription>
        <CardAction>
          <ArrowUpRight className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={trafficConfig} className="h-54 w-full">
          <ComposedChart
            accessibilityLayer
            data={hourlyFieldActivity}
            margin={{ bottom: 0, left: -14, right: 10, top: 8 }}
          >
            <defs>
              <linearGradient id="fillVisitsPace" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-visits, var(--chart-3))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-visits, var(--chart-3))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={6}
              tick={{ fontSize: 11 }}
              width={38}
              domain={[0, 450]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-muted-foreground">{String(name)}</span>
                      <span className="font-medium font-mono text-foreground tabular-nums">{Number(value)} doors</span>
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
            <Area
              dataKey="visits"
              type="natural"
              fill="url(#fillVisitsPace)"
              stroke="var(--color-visits, var(--chart-3))"
              strokeWidth={2}
            />
            <Line
              dataKey="callbacks"
              type="natural"
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
              stroke="var(--color-callbacks, var(--chart-1))"
              strokeWidth={2}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
