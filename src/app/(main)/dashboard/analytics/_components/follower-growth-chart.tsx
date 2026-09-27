"use client";

import { Ellipsis, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const followerSeries = [
  { date: "May 01", instagram: 42100, linkedin: 28400, youtube: 35100, twitter: 18200 },
  { date: "May 05", instagram: 42600, linkedin: 28900, youtube: 35400, twitter: 18400 },
  { date: "May 10", instagram: 43200, linkedin: 29500, youtube: 36000, twitter: 18700 },
  { date: "May 15", instagram: 44100, linkedin: 30200, youtube: 36800, twitter: 19100 },
  { date: "May 20", instagram: 44900, linkedin: 31000, youtube: 37500, twitter: 19500 },
  { date: "May 25", instagram: 45800, linkedin: 31800, youtube: 38200, twitter: 19900 },
  { date: "May 30", instagram: 47200, linkedin: 32600, youtube: 39100, twitter: 20400 },
];

const chartConfig = {
  instagram: {
    label: "Instagram",
    color: "var(--chart-1)",
  },
  linkedin: {
    label: "LinkedIn",
    color: "var(--chart-2)",
  },
  youtube: {
    label: "YouTube",
    color: "var(--chart-3)",
  },
  twitter: {
    label: "X (Twitter)",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function FollowerGrowthChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-normal text-base">Social Media Follower Growth</CardTitle>
            <CardDescription className="text-xs">
              Cumulative follower counts across main channels over the last 30 days
            </CardDescription>
          </div>
          <CardAction>
            <Ellipsis className="size-4 text-muted-foreground" />
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <AreaChart data={followerSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillInstagram" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-instagram)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-instagram)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillLinkedin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-linkedin)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-linkedin)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={8} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              type="monotone"
              dataKey="instagram"
              stroke="var(--color-instagram)"
              fill="url(#fillInstagram)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="linkedin"
              stroke="var(--color-linkedin)"
              fill="url(#fillLinkedin)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="youtube"
              stroke="var(--color-youtube)"
              fill="none"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ChartContainer>

        <div className="mt-4 flex flex-wrap items-center justify-between border-border border-t pt-3 text-muted-foreground text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[var(--chart-1)]" /> Instagram (47.2k)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[var(--chart-2)]" /> LinkedIn (32.6k)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[var(--chart-3)]" /> YouTube (39.1k)
            </span>
          </div>
          <div className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
            <TrendingUp className="size-3.5" /> +12.4% overall growth
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
