"use client";

import { ArrowUpRight } from "lucide-react";
import { Bar, BarChart, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const oemMarketShareData = [
  {
    name: "Pak Suzuki (PSMCL)",
    households: "Rank #1 • Alto, Swift, Cultus, Every",
    share: 48,
    change: "+3.2%",
    badge: "47.6%",
  },
  {
    name: "Toyota Indus (IMC)",
    households: "Rank #2 • Yaris, Corolla, Fortuner",
    share: 24,
    change: "-1.4%",
    badge: "24.2%",
  },
  {
    name: "Honda Atlas Cars",
    households: "Rank #3 • City, Civic, BR-V",
    share: 14,
    change: "-0.8%",
    badge: "13.5%",
  },
  {
    name: "Changan Master Motors",
    households: "Rank #4 • Alsvin, Karvaan MPV",
    share: 8,
    change: "+0.6%",
    badge: "8.4%",
  },
  {
    name: "Hyundai / Kia / Others",
    households: "Rank #5 • Tucson, Sportage, Stonic",
    share: 6,
    change: "-1.6%",
    badge: "6.3%",
  },
] as const;

const brandSurveyConfig = {
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
  const isSuzuki = brand?.name.toLowerCase().includes("suzuki");

  return (
    <text
      className={isSuzuki ? "fill-emerald-600 font-bold dark:fill-emerald-400" : "fill-foreground font-semibold"}
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
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">
          Pakistan OEM Market Share (PAMA Benchmark)
        </CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          47.6% National Market Share • Rank #1 OEM
        </CardDescription>
        <CardAction>
          <ArrowUpRight className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={brandSurveyConfig} className="h-54 w-full">
          <BarChart
            accessibilityLayer
            barCategoryGap={12}
            data={oemMarketShareData}
            layout="vertical"
            margin={{ bottom: 0, left: 190, right: 60, top: 0 }}
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
            <Bar barSize={16} dataKey="share" fill="var(--color-share)" radius={[0, 6, 6, 0]}>
              <LabelList content={<BrandNameLabel />} position="left" />
              <LabelList content={<BrandShareLabel />} dataKey="share" position="right" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
