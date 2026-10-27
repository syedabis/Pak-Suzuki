"use client";

import { useMemo } from "react";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { K_CARRY_SURVEY_DATA } from "@/data/suzuki-express/k-carry-survey-data";

const TOTAL_RESPONSES = K_CARRY_SURVEY_DATA.length;

// Coolors palette: 001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
const OCCUPATION_COLORS = ["#0a9396", "#ee9b00", "#005f73", "#ca6702", "#94d2bd", "#e9d8a6"];
const REQUIREMENT_COLORS = ["#005f73", "#0a9396", "#ee9b00", "#ca6702", "#94d2bd", "#e9d8a6"];
const FLEET_COLORS = ["#0a9396", "#ee9b00", "#ca6702", "#bb3e03", "#94d2bd", "#005f73"];
const FEATURE_COLORS = ["#005f73", "#0a9396", "#ee9b00", "#ca6702", "#94d2bd", "#e9d8a6"];
const PROBLEM_COLORS = ["#ae2012", "#bb3e03", "#ca6702", "#9b2226", "#ee9b00", "#0a9396"];

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
      color: "#0a9396",
    },
  } satisfies ChartConfig;

  const reqChartConfig = {
    count: {
      label: "Respondents",
      color: "#005f73",
    },
  } satisfies ChartConfig;

  const vehicleChartConfig = {
    count: {
      label: "Current Fleet Users",
      color: "#ee9b00",
    },
  } satisfies ChartConfig;

  const featureChartConfig = {
    count: {
      label: "Priority Demand",
      color: "#ca6702",
    },
  } satisfies ChartConfig;

  const problemChartConfig = {
    count: {
      label: "Reported Bottlenecks",
      color: "#ae2012",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Questions 1 to 3 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Q1. Main Occupation */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-base">Q1: Main Occupation Breakdown</CardTitle>
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
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {occupationData.map((_, i) => (
                    <Cell key={`occ-cell-${i}`} fill={OCCUPATION_COLORS[i % OCCUPATION_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-muted-foreground text-xs">
              Top segments: <strong className="text-foreground">Farmer / Agri (40%)</strong> &amp;{" "}
              <strong className="text-foreground">Business (34%)</strong>
            </div>
          </CardContent>
        </Card>

        {/* Q2. Primary Requirement */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-base">Q2: Primary Vehicle Requirement</CardTitle>
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
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {requirementData.map((_, i) => (
                    <Cell key={`req-cell-${i}`} fill={REQUIREMENT_COLORS[i % REQUIREMENT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-muted-foreground text-xs">
              Core usage: <strong className="text-foreground">Farm Work (35%)</strong> &amp;{" "}
              <strong className="text-foreground">Goods Transport (34%)</strong>
            </div>
          </CardContent>
        </Card>

        {/* Q3. Current Vehicle in Fleet */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-base">Q3: Current Vehicle in Fleet</CardTitle>
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
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {vehicleData.slice(0, 6).map((_, i) => (
                    <Cell key={`fleet-cell-${i}`} fill={FLEET_COLORS[i % FLEET_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-muted-foreground text-xs">
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
            <CardTitle className="font-semibold text-base">Q4: Most Critical Feature Priority</CardTitle>
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
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {featureData.map((_, i) => (
                    <Cell key={`feat-cell-${i}`} fill={FEATURE_COLORS[i % FEATURE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-muted-foreground text-xs">
              Priority demand: <strong className="text-foreground">Load Capacity (34%)</strong> &amp;{" "}
              <strong className="text-foreground">Fuel Economy (26%)</strong>
            </div>
          </CardContent>
        </Card>

        {/* Q5. Biggest Operational Transport Problem */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-base">Q5: Biggest Operational Transport Problem</CardTitle>
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
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {problemData.map((_, i) => (
                    <Cell key={`prob-cell-${i}`} fill={PROBLEM_COLORS[i % PROBLEM_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-muted-foreground text-xs">
              Major pain points: <strong className="text-foreground">High Fuel Cost (36%)</strong> &amp;{" "}
              <strong className="text-foreground">Limited Load Capacity (26%)</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
