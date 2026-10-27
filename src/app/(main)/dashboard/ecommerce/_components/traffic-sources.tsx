"use client";

import { Bar, BarChart, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const leadAcquisitionData = [
  {
    name: "3S Dealership Walk-ins",
    description: "Direct Showroom Footfall & In-person Consultations",
    share: 52,
    badge: "52.0%",
    isPrimary: true,
  },
  {
    name: "Mega Galas & Promotional Expos",
    description: "Karachi & Lahore Expo Centers, Family Festivals",
    share: 24,
    badge: "24.0%",
    isPrimary: true,
  },
  {
    name: "Pak Suzuki Web Portal",
    description: "Online Booking Desk & Digital Lead Inquiries",
    share: 16,
    badge: "16.0%",
    isPrimary: false,
  },
  {
    name: "Corporate & Commercial Fleet",
    description: "Commercial Cargo Every/Ravi Bulk Fleet Leases",
    share: 8,
    badge: "8.0%",
    isPrimary: false,
  },
] as const;

const oemMarketShareData = [
  {
    name: "Pak Suzuki (PSMCL)",
    households: "Rank #1 • Alto, Swift, Cultus, Every",
    share: 48,
    change: "+3.2%",
    badge: "47.6%",
    isSuzuki: true,
  },
  {
    name: "Toyota Indus (IMC)",
    households: "Rank #2 • Yaris, Corolla, Fortuner",
    share: 24,
    change: "-1.4%",
    badge: "24.2%",
    isSuzuki: false,
  },
  {
    name: "Honda Atlas Cars",
    households: "Rank #3 • City, Civic, BR-V",
    share: 14,
    change: "-0.8%",
    badge: "13.5%",
    isSuzuki: false,
  },
  {
    name: "Changan Master Motors",
    households: "Rank #4 • Alsvin, Karvaan MPV",
    share: 8,
    change: "+0.6%",
    badge: "8.4%",
    isSuzuki: false,
  },
  {
    name: "Hyundai / Kia / Others",
    households: "Rank #5 • Tucson, Sportage, Stonic",
    share: 6,
    change: "-1.6%",
    badge: "6.3%",
    isSuzuki: false,
  },
] as const;

const chartConfig = {
  share: {
    label: "Share",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type SourceLabelProps = LabelProps & {
  index?: number;
};

function getNumber(value: number | string | undefined) {
  return typeof value === "number" ? value : Number(value);
}

function ChannelNameLabel({ height, index, x, y }: SourceLabelProps) {
  if (typeof index !== "number") {
    return null;
  }

  const channel = leadAcquisitionData[index];
  const xValue = getNumber(x);
  const yValue = getNumber(y);
  const heightValue = getNumber(height);

  if (!channel || Number.isNaN(xValue) || Number.isNaN(yValue) || Number.isNaN(heightValue)) {
    return null;
  }

  return (
    <text dominantBaseline="middle" textAnchor="start" x={2} y={yValue + heightValue / 2}>
      <tspan className="fill-foreground font-medium" fontSize={13} x={2} y={yValue + heightValue / 2 - 7}>
        {channel.name}
      </tspan>
      <tspan className="fill-muted-foreground" fontSize={11} x={2} y={yValue + heightValue / 2 + 11}>
        {channel.description}
      </tspan>
    </text>
  );
}

function ChannelShareLabel({ height, index, value, y }: SourceLabelProps & { value?: number | string }) {
  const yValue = getNumber(y);
  const heightValue = getNumber(height);
  const shareVal = getNumber(value);

  if (Number.isNaN(yValue) || Number.isNaN(heightValue) || Number.isNaN(shareVal)) {
    return null;
  }

  const channel = typeof index === "number" ? leadAcquisitionData[index] : undefined;

  return (
    <text
      className={
        channel?.isPrimary ? "fill-emerald-600 font-bold dark:fill-emerald-400" : "fill-foreground font-semibold"
      }
      dominantBaseline="middle"
      dx={-4}
      fontSize={13}
      textAnchor="end"
      x="100%"
      y={yValue + heightValue / 2}
    >
      {channel?.badge ?? `${shareVal}%`}
    </text>
  );
}

function BrandNameLabel({ height, index, x, y }: SourceLabelProps) {
  if (typeof index !== "number") {
    return null;
  }

  const brand = oemMarketShareData[index];
  const xValue = getNumber(x);
  const yValue = getNumber(y);
  const heightValue = getNumber(height);

  if (!brand || Number.isNaN(xValue) || Number.isNaN(yValue) || Number.isNaN(heightValue)) {
    return null;
  }

  return (
    <text dominantBaseline="middle" textAnchor="start" x={2} y={yValue + heightValue / 2}>
      <tspan className="fill-foreground font-medium" fontSize={13} x={2} y={yValue + heightValue / 2 - 7}>
        {brand.name}
      </tspan>
      <tspan className="fill-muted-foreground" fontSize={11} x={2} y={yValue + heightValue / 2 + 11}>
        {brand.households}
      </tspan>
    </text>
  );
}

function BrandShareLabel({ height, index, value, y }: SourceLabelProps & { value?: number | string }) {
  const yValue = getNumber(y);
  const heightValue = getNumber(height);
  const shareVal = getNumber(value);

  if (Number.isNaN(yValue) || Number.isNaN(heightValue) || Number.isNaN(shareVal)) {
    return null;
  }

  const brand = typeof index === "number" ? oemMarketShareData[index] : undefined;

  return (
    <text
      className={brand?.isSuzuki ? "fill-emerald-600 font-bold dark:fill-emerald-400" : "fill-foreground font-semibold"}
      dominantBaseline="middle"
      dx={-4}
      fontSize={13}
      textAnchor="end"
      x="100%"
      y={yValue + heightValue / 2}
    >
      {brand?.badge ?? `${shareVal}%`}
    </text>
  );
}

export function TrafficSources() {
  return (
    <Card className="h-full">
      <Tabs defaultValue="channels" className="flex h-full flex-col">
        <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="font-normal text-muted-foreground text-sm">
              Commercial Intelligence & Market Position
            </CardTitle>
            <TabsContent value="channels" className="mt-0">
              <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
                52% 3S Walk-ins • 24% Mega Galas & Expos
              </CardDescription>
            </TabsContent>
            <TabsContent value="oem-share" className="mt-0">
              <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
                47.6% National Market Share • Rank #1 OEM
              </CardDescription>
            </TabsContent>
          </div>

          <TabsList className="h-8 self-start sm:self-auto">
            <TabsTrigger value="channels" className="text-xs">
              Lead Channels
            </TabsTrigger>
            <TabsTrigger value="oem-share" className="text-xs">
              OEM Market Share
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="flex-1">
          {/* Section 1: Customer Acquisition & Lead Channels */}
          <TabsContent value="channels" className="mt-0">
            <ChartContainer config={chartConfig} className="h-54 w-full">
              <BarChart
                accessibilityLayer
                barCategoryGap={14}
                data={leadAcquisitionData}
                layout="vertical"
                margin={{ bottom: 0, left: 215, right: 60, top: 0 }}
              >
                <XAxis dataKey="share" domain={[0, 60]} hide type="number" />
                <YAxis
                  axisLine={false}
                  dataKey="name"
                  domain={[-0.5, leadAcquisitionData.length - 0.5]}
                  hide
                  interval={0}
                  tickLine={false}
                  type="category"
                />
                <Bar barSize={16} dataKey="share" fill="var(--color-share)" radius={[0, 6, 6, 0]}>
                  <LabelList content={<ChannelNameLabel />} position="left" />
                  <LabelList content={<ChannelShareLabel />} dataKey="share" position="right" />
                </Bar>
              </BarChart>
            </ChartContainer>
          </TabsContent>

          {/* Section 2: Pakistan OEM Market Share (PAMA Benchmark) */}
          <TabsContent value="oem-share" className="mt-0">
            <ChartContainer config={chartConfig} className="h-54 w-full">
              <BarChart
                accessibilityLayer
                barCategoryGap={10}
                data={oemMarketShareData}
                layout="vertical"
                margin={{ bottom: 0, left: 195, right: 60, top: 0 }}
              >
                <XAxis dataKey="share" domain={[0, 55]} hide type="number" />
                <YAxis
                  axisLine={false}
                  dataKey="name"
                  domain={[-0.5, oemMarketShareData.length - 0.5]}
                  hide
                  interval={0}
                  tickLine={false}
                  type="category"
                />
                <Bar barSize={15} dataKey="share" fill="var(--color-share)" radius={[0, 6, 6, 0]}>
                  <LabelList content={<BrandNameLabel />} position="left" />
                  <LabelList content={<BrandShareLabel />} dataKey="share" position="right" />
                </Bar>
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
