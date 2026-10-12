"use client";

import { ArrowUpRight } from "lucide-react";
import { Bar, BarChart, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const brandSurveyData = [
  {
    name: "Dalda",
    households: "1,020 homes",
    share: 36,
    change: "-4%",
    badge: "36%",
  },
  {
    name: "Habib",
    households: "680 homes",
    share: 24,
    change: "-3%",
    badge: "24%",
  },
  {
    name: "Sufi",
    households: "510 homes",
    share: 18,
    change: "-2%",
    badge: "18%",
  },
  {
    name: "Meezan (Loyalists)",
    households: "395 homes",
    share: 14,
    change: "+8%",
    badge: "14%",
  },
  {
    name: "Others / Loose",
    households: "235 homes",
    share: 8,
    change: "-1%",
    badge: "8%",
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

  const brand = brandSurveyData[index];
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

  const brand = typeof index === "number" ? brandSurveyData[index] : undefined;
  const isMeezan = brand?.name.toLowerCase().includes("meezan");

  return (
    <text
      className={isMeezan ? "fill-emerald-600 font-bold dark:fill-emerald-400" : "fill-foreground font-semibold"}
      dominantBaseline="middle"
      dx={-4}
      fontSize={13}
      textAnchor="end"
      x="100%"
      y={yValue + heightValue / 2}
    >
      {shareVal}%
    </text>
  );
}

export function TrafficSources() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">
          Doorstep Survey • Current Brand Market Share
        </CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          2,840 households surveyed
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
            data={brandSurveyData}
            layout="vertical"
            margin={{ bottom: 0, left: 130, right: 60, top: 0 }}
          >
            <XAxis dataKey="share" domain={[0, 45]} hide type="number" />
            <YAxis
              axisLine={false}
              dataKey="name"
              domain={[-0.5, brandSurveyData.length - 0.5]}
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
