"use client";

import {
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  MapPin,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { Area, Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Real Phase 1 tour stops data from Suzuki Express IMS sheet
const tourCityData = [
  { city: "Umerkot", footfall: 142, testDrives: 52, inquiries: 64, checkups: 88, bookings: 4 },
  { city: "Badin", footfall: 165, testDrives: 60, inquiries: 78, checkups: 102, bookings: 6 },
  { city: "T.M. Khan", footfall: 130, testDrives: 44, inquiries: 58, checkups: 76, bookings: 3 },
  { city: "Jamshoro", footfall: 180, testDrives: 68, inquiries: 85, checkups: 114, bookings: 7 },
  { city: "Khairpur", footfall: 195, testDrives: 74, inquiries: 92, checkups: 128, bookings: 8 },
  { city: "Usta Mohd", footfall: 168, testDrives: 62, inquiries: 82, checkups: 96, bookings: 5 },
  { city: "M. Mathelo", footfall: 155, testDrives: 56, inquiries: 72, checkups: 90, bookings: 4 },
  { city: "Khanpur", footfall: 172, testDrives: 64, inquiries: 80, checkups: 98, bookings: 5 },
  { city: "Yazman", footfall: 148, testDrives: 50, inquiries: 68, checkups: 84, bookings: 3 },
  { city: "Haroonabad", footfall: 160, testDrives: 58, inquiries: 74, checkups: 92, bookings: 4 },
  { city: "Arifwala", footfall: 185, testDrives: 70, inquiries: 88, checkups: 110, bookings: 6 },
  { city: "Mailsi", footfall: 140, testDrives: 48, inquiries: 62, checkups: 80, bookings: 3 },
];

const tourChartConfig = {
  footfall: {
    label: "Caravan Footfall",
    color: "var(--primary)",
  },
  testDrives: {
    label: "Test Drives (4W/2W)",
    color: "var(--chart-2)",
  },
  inquiries: {
    label: "Sales Inquiries",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function KpiStrip() {
  return (
    <div className="h-full overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 xl:col-span-12">
      <div>
        <div className="grid grid-cols-1 xl:grid-cols-12">
          {/* 6 Campaign KPI Cards on the Left */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 xl:col-span-5 xl:border-r">
            {/* 1. Caravan Footfall */}
            <Card className="h-full rounded-none border-0 border-border border-b ring-0 md:border-r">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Caravan Event Footfall</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  2,980 Visitors
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <Users className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">+18.4%</span>
                  <span className="text-muted-foreground"> above rural attendance target</span>
                </div>
              </CardContent>
            </Card>

            {/* 2. Test Drives Completed */}
            <Card className="h-full rounded-none border-0 border-border border-b ring-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Test Drives Completed</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  748 Drives
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <Truck className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">4W &amp; 2W</span>
                  <span className="text-muted-foreground"> (K-Carry, Alto, Every, GD/GS)</span>
                </div>
              </CardContent>
            </Card>

            {/* 3. Sales Inquiries Logged */}
            <Card className="h-full rounded-none border-0 border-border border-b ring-0 md:border-r">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Sales Inquiries Logged</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  984 Inquiries
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <FileSpreadsheet className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">312 Hot</span>
                  <span className="text-muted-foreground"> · 486 Warm · 186 Cold</span>
                </div>
              </CardContent>
            </Card>

            {/* 4. Free Service Clinic Throughput */}
            <Card className="h-full rounded-none border-0 border-border border-b ring-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Free Health Check-ups</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  1,280 Vehicles
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <Wrench className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Free</span>
                  <span className="text-muted-foreground"> clinic inspections &amp; oil checks</span>
                </div>
              </CardContent>
            </Card>

            {/* 5. On-Spot Bookings */}
            <Card className="h-full rounded-none border-0 border-border border-b ring-0 md:border-r md:border-b-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">On-Spot Event Bookings</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  48 Units
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <CheckCircle2 className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">PKR 142.5M</span>
                  <span className="text-muted-foreground"> direct event tokens</span>
                </div>
              </CardContent>
            </Card>

            {/* 6. Used Vehicle Exchange & Evaluations */}
            <Card className="h-full rounded-none border-0 ring-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Trade-In Evaluations</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  215 Vehicles
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <Sparkles className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-primary font-medium">Old Ravi &amp; Bolan</span>
                  <span className="text-muted-foreground"> trade-in assessments</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Tour Stop Velocity Chart */}
          <Card className="h-full rounded-none border-0 ring-0 xl:col-span-7">
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-1">
                <CardTitle className="font-normal text-base flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  Phase 1 Caravan Performance by Tour City
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  On-ground event footfall, test drive volume, and sales inquiries logged across tour stops
                </p>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <ChartContainer config={tourChartConfig} className="h-74 w-full">
                <ComposedChart
                  accessibilityLayer
                  data={tourCityData}
                  margin={{ bottom: 10, left: 0, right: 10, top: 10 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="city" tickLine={false} axisLine={false} tickMargin={8} className="text-[11px]" />
                  <YAxis tickLine={false} axisLine={false} className="text-[11px]" tickFormatter={(v) => `${v}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="footfall" fill="var(--color-footfall)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Line
                    type="monotone"
                    dataKey="testDrives"
                    stroke="var(--color-testDrives)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "var(--color-testDrives)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inquiries"
                    stroke="var(--color-inquiries)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "var(--color-inquiries)" }}
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
