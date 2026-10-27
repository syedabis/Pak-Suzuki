"use client";

import { useMemo } from "react";

import { Bike, Car, MapPin } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DAILY_INQUIRY_RECORDS } from "@/data/suzuki-express/daily-inquiry-data";

export function InquiryAnalyticsCharts() {
  // 1. Model Demand Matrix: Test Drives, Sales Enquiries & Free Evaluations
  const modelDemandData = useMemo(() => {
    const modelMap: Record<string, { model: string; testDrive: number; salesEnquiry: number; freeEvaluation: number }> =
      {
        "K-Carry": { model: "K-Carry", testDrive: 0, salesEnquiry: 0, freeEvaluation: 0 },
        Every: { model: "Every", testDrive: 0, salesEnquiry: 0, freeEvaluation: 0 },
        Alto: { model: "Alto", testDrive: 0, salesEnquiry: 0, freeEvaluation: 0 },
        Swift: { model: "Swift", testDrive: 0, salesEnquiry: 0, freeEvaluation: 0 },
        Cultus: { model: "Cultus", testDrive: 0, salesEnquiry: 0, freeEvaluation: 0 },
        WagonR: { model: "WagonR", testDrive: 0, salesEnquiry: 0, freeEvaluation: 0 },
        Ravi: { model: "Ravi", testDrive: 0, salesEnquiry: 0, freeEvaluation: 0 },
      };

    for (const record of DAILY_INQUIRY_RECORDS) {
      for (const fw of record.fourWheelers) {
        if (modelMap[fw.model]) {
          modelMap[fw.model].testDrive += fw.testDrive;
          modelMap[fw.model].salesEnquiry += fw.salesEnquiry;
          modelMap[fw.model].freeEvaluation += fw.freeEvaluation;
        }
      }
    }

    return Object.values(modelMap);
  }, []);

  // 2. City Caravan Footfall & Dispatched Test Drives
  const cityFootfallData = useMemo(() => {
    return DAILY_INQUIRY_RECORDS.map((r) => {
      const drives = r.fourWheelers.reduce((sum, item) => sum + item.testDrive, 0);
      return {
        city: r.city,
        footfall: r.customerFootfall,
        testDrives: drives,
      };
    });
  }, []);

  // 3. Vehicle Segment Share: Cars (4-Wheelers) vs Bikes (2-Wheelers)
  const segmentDistributionData = useMemo(() => {
    let carsTotal = 0;
    let bikesTotal = 0;

    for (const record of DAILY_INQUIRY_RECORDS) {
      for (const fw of record.fourWheelers) {
        carsTotal += fw.salesEnquiry + fw.testDrive;
      }
      for (const tw of record.twoWheelers) {
        bikesTotal += tw.salesEnquiry + tw.testDrive;
      }
    }

    const total = carsTotal + bikesTotal || 1;
    const carsPercent = Math.round((carsTotal / total) * 100);
    const bikesPercent = Math.round((bikesTotal / total) * 100);

    return [
      {
        name: "Cars",
        value: carsTotal,
        percentage: carsPercent,
        fill: "var(--chart-1)",
      },
      {
        name: "Bikes",
        value: bikesTotal,
        percentage: bikesPercent,
        fill: "var(--chart-2)",
      },
    ];
  }, []);

  const modelChartConfig = {
    testDrive: {
      label: "Test Drives",
      color: "var(--chart-1)",
    },
    salesEnquiry: {
      label: "Sales Inquiries",
      color: "var(--chart-2)",
    },
    freeEvaluation: {
      label: "Trade-In Appraisals",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  const cityChartConfig = {
    footfall: {
      label: "Verified Footfall",
      color: "var(--chart-1)",
    },
    testDrives: {
      label: "Test Drives Dispatched",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const segmentChartConfig = {
    Cars: {
      label: "Cars",
      icon: Car,
      color: "var(--chart-1)",
    },
    Bikes: {
      label: "Bikes",
      icon: Bike,
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Model Demand Matrix & Segment Distribution (Cars vs Bikes) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Graph 1: 4W Demand & Test Drive Distribution by Model (7 cols) */}
        <Card className="shadow-xs lg:col-span-7">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Car className="size-4 text-primary" />
                  Vehicle Demand &amp; Inquiries by Model
                </CardTitle>
                <CardDescription className="text-xs">
                  Automobile matrix: Test drives, sales inquiries &amp; trade-in appraisals across 15 tour stops
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={modelChartConfig} className="h-64 w-full">
              <BarChart accessibilityLayer data={modelDemandData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="model" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="testDrive" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="salesEnquiry" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="freeEvaluation" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              <strong className="text-foreground">K-Carry &amp; Every</strong> accounted for 1,023 test drives;{" "}
              <strong className="text-foreground">Alto &amp; Ravi</strong> drove 752 trade-in appraisals
            </div>
          </CardContent>
        </Card>

        {/* Graph 2: Vehicle Segment Share: Cars vs Bikes (5 cols) */}
        <Card className="shadow-xs lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Car className="size-4 text-primary" />
              Vehicle Segment Share: Cars vs Bikes
            </CardTitle>
            <CardDescription className="text-xs">
              4-Wheelers (Automobiles) vs 2-Wheelers (Motorcycles) demand volume
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer config={segmentChartConfig} className="h-56 w-full">
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={segmentDistributionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={6}
                >
                  {segmentDistributionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              <strong className="text-foreground">
                Cars: {segmentDistributionData[0].percentage}% ({segmentDistributionData[0].value.toLocaleString()}{" "}
                leads)
              </strong>{" "}
              •{" "}
              <strong className="text-foreground">
                Bikes: {segmentDistributionData[1].percentage}% ({segmentDistributionData[1].value.toLocaleString()}{" "}
                leads)
              </strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Caravan Tour Stop Footfall & Engagement Corridor (Full Width) */}
      <Card className="shadow-xs">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <MapPin className="size-4 text-primary" />
                Caravan Tour Stop Footfall &amp; Engagement Corridor (15 Tour Cities)
              </CardTitle>
              <CardDescription className="text-xs">
                City-by-city comparison of verified customer footfall vs test drives dispatched across ROS &amp; ROSP
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground">
              Master Stop: <strong className="text-foreground">Usta Muhammad (168 Visitors • 76 Drives)</strong>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={cityChartConfig} className="h-60 w-full">
            <BarChart accessibilityLayer data={cityFootfallData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="city"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="footfall" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="testDrives" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
          <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-muted-foreground px-2">
            <span>
              Peak Turnout: <strong>Khairpur (174)</strong>, <strong>Usta Muhammad (168)</strong>,{" "}
              <strong>Badin (165)</strong>
            </span>
            <span>
              Average Conversion: <strong>~45% of attendees dispatched for test drives</strong>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
