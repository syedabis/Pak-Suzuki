"use client";

import { useMemo } from "react";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { K_CARRY_SURVEY_DATA } from "@/data/suzuki-express/k-carry-survey-data";

const TOTAL_RESPONSES = K_CARRY_SURVEY_DATA.length;

export function UtilityNeedsCharts() {
  // Q1: Main Occupation
  const occupationData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of K_CARRY_SURVEY_DATA) {
      counts[r.mainOccupation] = (counts[r.mainOccupation] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / TOTAL_RESPONSES) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Q2: Primary Vehicle Requirement / Use Case
  const requirementData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of K_CARRY_SURVEY_DATA) {
      counts[r.mainRequirement] = (counts[r.mainRequirement] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / TOTAL_RESPONSES) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Q3: Current Vehicles in Fleet
  const vehicleData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of K_CARRY_SURVEY_DATA) {
      counts[r.currentVehicle] = (counts[r.currentVehicle] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({
        name: name.replace(" — ", " "),
        count,
        percentage: Math.round((count / TOTAL_RESPONSES) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Q4: Most Important Feature Priority
  const featureData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of K_CARRY_SURVEY_DATA) {
      counts[r.mostImportantFeature] = (counts[r.mostImportantFeature] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / TOTAL_RESPONSES) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Q5: Biggest Transport Problem / Bottleneck
  const problemData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of K_CARRY_SURVEY_DATA) {
      counts[r.biggestTransportProblem] = (counts[r.biggestTransportProblem] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / TOTAL_RESPONSES) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const occChartConfig = {
    count: {
      label: "Respondents",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const reqChartConfig = {
    count: {
      label: "Respondents",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const vehicleChartConfig = {
    count: {
      label: "Current Fleet Users",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  const featureChartConfig = {
    count: {
      label: "Priority Demand",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  const problemChartConfig = {
    count: {
      label: "Reported Bottlenecks",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Questions 1 to 3 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Q1. Main Occupation */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Q1: Main Occupation Breakdown</CardTitle>
            <CardDescription className="text-xs">
              Commercial profile of rural and semi-urban survey respondents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={occChartConfig} className="h-60 w-full">
              <BarChart
                accessibilityLayer
                data={occupationData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Top segments: <strong className="text-foreground">Farmer / Agri (40%)</strong> &amp;{" "}
              <strong className="text-foreground">Business (34%)</strong>
            </div>
          </CardContent>
        </Card>

        {/* Q2. Primary Requirement */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Q2: Primary Vehicle Requirement</CardTitle>
            <CardDescription className="text-xs">
              Main intended operational purpose for acquiring a commercial pickup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={reqChartConfig} className="h-60 w-full">
              <BarChart
                accessibilityLayer
                data={requirementData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={125}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Core usage: <strong className="text-foreground">Farm Work (35%)</strong> &amp;{" "}
              <strong className="text-foreground">Goods Transport (34%)</strong>
            </div>
          </CardContent>
        </Card>

        {/* Q3. Current Vehicle in Fleet */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Q3: Current Vehicle in Fleet</CardTitle>
            <CardDescription className="text-xs">
              Existing vehicle owned or operated (K-CARRY displacement target)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={vehicleChartConfig} className="h-60 w-full">
              <BarChart
                accessibilityLayer
                data={vehicleData.slice(0, 6)}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-3)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Primary target: <strong className="text-foreground">37% existing Suzuki Ravi</strong> owners
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Questions 4 and 5 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Q4. Most Important Feature */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Q4: Most Critical Feature Priority</CardTitle>
            <CardDescription className="text-xs">
              Highest-ranked decision criteria when choosing a utility pickup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={featureChartConfig} className="h-56 w-full">
              <BarChart
                accessibilityLayer
                data={featureData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-4)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Priority demand: <strong className="text-foreground">Load Capacity (34%)</strong> &amp;{" "}
              <strong className="text-foreground">Fuel Economy (26%)</strong>
            </div>
          </CardContent>
        </Card>

        {/* Q5. Biggest Operational Transport Problem */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Q5: Biggest Operational Transport Problem</CardTitle>
            <CardDescription className="text-xs">
              Key operational pain points faced with existing commercial vehicles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={problemChartConfig} className="h-56 w-full">
              <BarChart
                accessibilityLayer
                data={problemData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={135}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-5)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Major pain points: <strong className="text-foreground">High Fuel Cost (36%)</strong> &amp;{" "}
              <strong className="text-foreground">Limited Load Capacity (26%)</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
