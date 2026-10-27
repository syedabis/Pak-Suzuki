"use client";

import { Bar, BarChart, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const caravanTouchpointsData = [
  {
    name: "4W & 2W Test Drive Arena",
    description: "K-Carry rough track drives, Alto 660cc, Every MPV & GD/GS bikes",
    share: 34,
    badge: "34.0%",
    isPrimary: true,
  },
  {
    name: "Free Vehicle Health Clinic",
    description: "On-site multi-point inspection, oil checkups & genuine parts",
    share: 32,
    badge: "32.0%",
    isPrimary: true,
  },
  {
    name: "Sales Inquiries & Token Desk",
    description: "New vehicle booking consultation, delivery timeline & price quotation",
    share: 22,
    badge: "22.0%",
    isPrimary: false,
  },
  {
    name: "Exchange & Evaluation Counter",
    description: "Old Ravi, Bolan & Mehran physical appraisal for trade-in upgrade",
    share: 12,
    badge: "12.0%",
    isPrimary: false,
  },
] as const;

const regionalProgressData = [
  {
    name: "Region of Sindh (ROS)",
    detail: "7 Active Phase 1 Tour Stops • 1,135 Visitors • 33 Direct Bookings",
    share: 51,
    change: "Active Leg",
    badge: "51.2%",
    isSindh: true,
  },
  {
    name: "Region of South Punjab (ROSP)",
    detail: "8 Phase 1 Tour Stops • 1,085 Visitors • 26 Direct Bookings",
    share: 49,
    change: "Active Leg",
    badge: "48.8%",
    isSindh: false,
  },
  {
    name: "Region of Central Punjab (ROCP)",
    detail: "9 Scheduled Stops (Gojra, Chiniot, Shahkot, Pattoki, Daska...)",
    share: 0,
    change: "Phase 2 (Post-Eid)",
    badge: "Phase 2",
    isSindh: false,
  },
  {
    name: "Region of North (RON)",
    detail: "14 Scheduled Stops (Khui Ratta, Rawalakot, Bagh, Murree, Buner...)",
    share: 0,
    change: "Phase 2 (Post-Eid)",
    badge: "Phase 2",
    isSindh: false,
  },
] as const;

const touchpointChartConfig = {
  share: {
    label: "Engagement Share",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const regionChartConfig = {
  share: {
    label: "Phase 1 Volume Share",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function renderCustomizedLabel(props: LabelProps) {
  const { x, y, width, value } = props;
  if (x === undefined || y === undefined || width === undefined || value === undefined) return null;

  return (
    <text
      x={Number(x) + Number(width) + 8}
      y={Number(y) + 14}
      textAnchor="start"
      dominantBaseline="middle"
      className="fill-foreground font-semibold text-xs tabular-nums"
    >
      {String(value)}
    </text>
  );
}

export function TrafficSources() {
  return (
    <Card className="h-full">
      <Tabs defaultValue="touchpoints" className="flex h-full flex-col">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3">
          <div>
            <CardTitle className="font-normal text-muted-foreground text-sm">
              Caravan Engagement &amp; Regional Reach
            </CardTitle>
            <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
              On-Ground Touchpoint Mix • 38-City Deployment
            </CardDescription>
          </div>
          <TabsList className="h-8">
            <TabsTrigger value="touchpoints" className="text-xs px-2.5">
              Event Touchpoints
            </TabsTrigger>
            <TabsTrigger value="regions" className="text-xs px-2.5">
              Regional Split
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col justify-between pt-0 pb-4">
          <TabsContent value="touchpoints" className="mt-0 space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {caravanTouchpointsData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground block">{item.name}</span>
                    <span className="text-[11px] text-muted-foreground">{item.description}</span>
                  </div>
                  <span className="font-mono font-bold text-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="regions" className="mt-0 space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {regionalProgressData.map((region) => (
                <div
                  key={region.name}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{region.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">({region.change})</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{region.detail}</span>
                  </div>
                  <span className="font-mono font-bold text-foreground bg-secondary px-2 py-0.5 rounded-md text-xs">
                    {region.badge}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
