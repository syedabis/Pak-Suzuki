"use client";

import { useEffect, useMemo, useState } from "react";

import { Bar, BarChart, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

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
  const [regionalSheets, setRegionalSheets] = useState<any[]>([]);

  useEffect(() => {
    async function loadSheets() {
      const { data } = await supabase.from("daily_master_sheets").select("region, customer_footfall");
      if (data && data.length > 0) {
        setRegionalSheets(data);
      }
    }
    loadSheets();
  }, []);

  const regionalProgressData = useMemo(() => {
    let rosFootfall = 0;
    let rospFootfall = 0;

    for (const s of regionalSheets) {
      if (s.region === "ROS") rosFootfall += Number(s.customer_footfall) || 0;
      else if (s.region === "ROSP") rospFootfall += Number(s.customer_footfall) || 0;
    }

    const total = rosFootfall + rospFootfall || 2220;
    const rosPercent = Math.round(((rosFootfall || 1135) / total) * 100);
    const rospPercent = 100 - rosPercent;

    return [
      {
        name: "Region of Sindh (ROS)",
        detail: `7 Active Phase 1 Tour Stops • ${(rosFootfall || 1135).toLocaleString()} Visitors • Live Sync`,
        share: rosPercent,
        change: "Active Leg",
        badge: `${rosPercent}%`,
        isSindh: true,
      },
      {
        name: "Region of South Punjab (ROSP)",
        detail: `8 Phase 1 Tour Stops • ${(rospFootfall || 1085).toLocaleString()} Visitors • Live Sync`,
        share: rospPercent,
        change: "Active Leg",
        badge: `${rospPercent}%`,
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
    ];
  }, [regionalSheets]);

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
              Touchpoint Activity
            </TabsTrigger>
            <TabsTrigger value="regions" className="text-xs px-2.5">
              Regional Split
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col justify-between pt-0 pb-4">
          <TabsContent value="touchpoints" className="mt-0 space-y-3">
            <ChartContainer config={touchpointChartConfig} className="h-44 w-full">
              <BarChart
                accessibilityLayer
                data={caravanTouchpointsData}
                layout="vertical"
                margin={{ bottom: 0, left: 10, right: 35, top: 0 }}
              >
                <XAxis type="number" hide domain={[0, 45]} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={155}
                  className="text-xs fill-foreground"
                />
                <Bar dataKey="share" radius={4} maxBarSize={18}>
                  <LabelList
                    dataKey="share"
                    position="right"
                    formatter={(v: any) => `${v}%`}
                    content={renderCustomizedLabel}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t">
              {caravanTouchpointsData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">{item.name}</span>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{item.description}</p>
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
