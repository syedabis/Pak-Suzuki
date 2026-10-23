"use client";

import { format, parse } from "date-fns";
import { ArrowUpRight, Calendar, Car, Percent, PieChart, UserCheck, Users } from "lucide-react";
import { Area, Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const revenueBucketRanges = ["01-05", "06-10", "11-15", "16-20", "21-25", "26-31"] as const;
const volumeMultiplier = [0.48, 0.52, 0.5] as const;

const salesTrendValues = [
  [48200, 51500, 50600, 55200, 59900, 68800],
  [51400, 53600, 55200, 58600, 61200, 67200],
  [49200, 46800, 51500, 53600, 57200, 61500],
  [54800, 59200, 56600, 61800, 63400, 66600],
  [58400, 62200, 64800, 61100, 66800, 72300],
  [62800, 67400, 69600, 71200, 67800, 72400],
  [68200, 72400, 76800, 74100, 79200, 78100],
  [60400, 64200, 61500, 68600, 70800, 70900],
  [58600, 61200, 63400, 60800, 66200, 69000],
  [65200, 68400, 70600, 74200, 71600, 82800],
  [69800, 73200, 76400, 71600, 80400, 86200],
  [74000, 79000, 84000, 89000, 86000, 96000],
] as const;

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

function getRollingSalesBuckets() {
  const currentMonth = new Date();
  currentMonth.setDate(1);

  return salesTrendValues.map((values, index) => {
    const monthDate = new Date(currentMonth);
    monthDate.setMonth(currentMonth.getMonth() - (salesTrendValues.length - 1 - index));

    return {
      month: `${monthFormatter.format(monthDate)} ${String(monthDate.getFullYear()).slice(-2)}`,
      values,
    };
  });
}

const salesOverviewData = getRollingSalesBuckets().flatMap(({ month, values }) =>
  values.map((revenue, index) => ({
    period: `${month} ${revenueBucketRanges[index]}`,
    volume: Math.round((revenue / 500) * volumeMultiplier[index % volumeMultiplier.length]),
    revenue,
  })),
);

const salesOverviewConfig = {
  revenue: {
    label: "Vehicle Sales Value (PKR)",
    color: "var(--foreground)",
  },
  volume: {
    label: "Units Delivered",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

function formatMonthTick(value: string) {
  const parts = value.split(" ");
  const range = parts.at(-1);
  const month = parts.slice(0, -1).join(" ");

  return range === "11-15" ? month : "";
}

function formatTooltipLabel(value: string) {
  const parts = value.split(" ");
  const range = parts.at(-1);
  const month = parse(parts.slice(0, -1).join(" "), "MMM yy", new Date());
  const [start, end] = String(range).split("-");
  const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const startDate = new Date(month.getFullYear(), month.getMonth(), Number(start));
  const endDate = new Date(month.getFullYear(), month.getMonth(), Math.min(Number(end), lastDayOfMonth));

  return `${format(month, "MMM")} ${format(startDate, "do")} - ${format(endDate, "do")}, ${format(month, "yyyy")}`;
}

function formatValue(value: unknown, name: string | undefined) {
  if (typeof value !== "number") return String(value ?? "");
  if (name?.toLowerCase().includes("unit")) {
    return `${value.toLocaleString()} Units`;
  }
  return `PKR ${value.toLocaleString()}`;
}

export function KpiStrip() {
  return (
    <div className="h-full overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 xl:col-span-12">
      <div>
        <div className="grid grid-cols-1 xl:grid-cols-12">
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 xl:col-span-5 xl:border-r">
            <Card className="h-full rounded-none border-0 border-border border-b ring-0 md:border-r">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Vehicle Units Booked</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  468 Units
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <Car className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-green-700 dark:text-green-300">PKR 1.84 Billion</span>
                  <span className="text-muted-foreground"> (+14.2% vs target)</span>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full rounded-none border-0 border-border border-b ring-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Showroom Walk-ins</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  15,640
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <Users className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-green-700 dark:text-green-300">92.5%</span>
                  <span className="text-muted-foreground"> of 16,900 network daily capacity</span>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full rounded-none border-0 border-border border-b ring-0 md:border-r">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Footfall-to-Booking</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  12.8%
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <Percent className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-green-700 dark:text-green-300">1,998 buyers</span>
                  <span className="text-muted-foreground"> quoted or tokened</span>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full rounded-none border-0 border-border border-b ring-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Active Consultation Desks</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  482 / 510
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <UserCheck className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-green-700 dark:text-green-300">94.5% active</span>
                  <span className="text-muted-foreground"> across 156 3S facilities</span>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full rounded-none border-0 border-border border-b ring-0 md:border-r md:border-b-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Appointments Completed</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  1,840
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <Calendar className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-green-700 dark:text-green-300">88.5%</span>
                  <span className="text-muted-foreground"> test drive & visit fulfillment</span>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full rounded-none border-0 ring-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Pakistan Market Share</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  47.6%
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <PieChart className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-green-700 dark:text-green-300">Rank #1 OEM</span>
                  <span className="text-muted-foreground"> across PAMA segments</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="h-full rounded-none border-0 ring-0 xl:col-span-7">
            <CardHeader>
              <div className="flex flex-col gap-1">
                <CardTitle className="font-normal">Daily Vehicle Sales Revenue & Delivery Volume</CardTitle>
                <p className="text-muted-foreground text-xs">
                  Cumulative daily vehicle booking value in PKR with delivery unit volume across 156 3S dealerships
                </p>
              </div>
              <CardAction>
                <ArrowUpRight className="size-4" />
              </CardAction>
            </CardHeader>

            <CardContent>
              <ChartContainer config={salesOverviewConfig} className="h-74 w-full">
                <ComposedChart
                  accessibilityLayer
                  data={salesOverviewData}
                  margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
                >
                  <defs>
                    <filter id="sales-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feFlood floodColor="var(--color-revenue)" floodOpacity="0.35" />
                      <feComposite in2="blur" operator="in" />
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid yAxisId="volume" vertical={false} />
                  <XAxis
                    dataKey="period"
                    axisLine={false}
                    height={30}
                    interval={0}
                    minTickGap={0}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => formatMonthTick(String(value))}
                  />
                  <YAxis yAxisId="revenue" hide domain={[30000, 105000]} />
                  <YAxis yAxisId="volume" hide domain={[0, 120]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-44"
                        labelFormatter={(value) => formatTooltipLabel(String(value))}
                        formatter={(value, name, item) => (
                          <>
                            <div
                              className="size-2.5 shrink-0 rounded-[2px]"
                              style={{
                                backgroundColor: item.color,
                              }}
                            />
                            <div className="flex flex-1 items-center justify-between leading-none">
                              <span className="text-muted-foreground">{String(name ?? "")}</span>
                              <span className="font-medium font-mono text-foreground tabular-nums">
                                {formatValue(value, String(name ?? ""))}
                              </span>
                            </div>
                          </>
                        )}
                      />
                    }
                    cursor={{
                      stroke: "var(--border)",
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Bar
                    yAxisId="volume"
                    barSize={4}
                    dataKey="volume"
                    fill="var(--color-volume)"
                    name="Litres Sold"
                    opacity={0.25}
                    radius={[6, 6, 0, 0]}
                  />
                  <Area
                    yAxisId="revenue"
                    dataKey="revenue"
                    fill="none"
                    name="Sales (PKR)"
                    stroke="var(--color-revenue, var(--foreground))"
                    strokeWidth={2}
                    type="monotone"
                    activeDot={{
                      r: 4,
                      fill: "var(--background)",
                      stroke: "var(--color-revenue, var(--foreground))",
                      strokeWidth: 2,
                    }}
                    dot={false}
                  />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
