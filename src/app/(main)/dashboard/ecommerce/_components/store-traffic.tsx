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

const hourlyShowroomActivity = [
  { time: "9 AM", visits: 840, appointments: 88 },
  { time: "10 AM", visits: 1320, appointments: 145 },
  { time: "11 AM", visits: 1890, appointments: 210 },
  { time: "12 PM", visits: 2140, appointments: 260 },
  { time: "1 PM", visits: 1480, appointments: 180 },
  { time: "2 PM", visits: 1120, appointments: 130 },
  { time: "3 PM", visits: 1650, appointments: 195 },
  { time: "4 PM", visits: 2280, appointments: 275 },
  { time: "5 PM", visits: 2110, appointments: 240 },
  { time: "6 PM", visits: 1240, appointments: 160 },
  { time: "7 PM", visits: 570, appointments: 70 },
];

const trafficConfig = {
  visits: {
    label: "Showroom Walk-ins",
    color: "var(--chart-3)",
  },
  appointments: {
    label: "Booked Test Drives & Consultations",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StoreTraffic() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">
          Showroom Footfall & Appointment Pace
        </CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          15,640 Walk-ins & 1,840 Appointments Today
        </CardDescription>
        <CardAction>
          <ArrowUpRight className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={trafficConfig} className="h-54 w-full">
          <ComposedChart
            accessibilityLayer
            data={hourlyShowroomActivity}
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
              domain={[0, 2500]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-muted-foreground">{String(name)}</span>
                      <span className="font-medium font-mono text-foreground tabular-nums">
                        {Number(value).toLocaleString()}{" "}
                        {String(name).toLowerCase().includes("walk") ? "visitors" : "appts"}
                      </span>
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
              dataKey="appointments"
              type="natural"
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
              stroke="var(--color-appointments, var(--chart-1))"
              strokeWidth={2}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
