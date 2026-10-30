"use client";

import { useMemo, useState } from "react";

import { ArrowLeft, Bike, Car, Layers, MapPin, RotateCcw } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { DailyInquirySheetRecord } from "@/data/suzuki-express/types";

type DrilldownState =
  | { level: "overview" }
  | { level: "category"; category: "cars" | "bikes" }
  | { level: "model"; model: string; category: "cars" | "bikes" };

const MODEL_TRIM_VARIANTS: Record<string, { name: string; share: number; leads: number }[]> = {
  "K-Carry": [
    { name: "Flat Deck Pickup", share: 58, leads: 502 },
    { name: "Cargo Carrier Box", share: 26, leads: 225 },
    { name: "High Deck Heavy Duty", share: 16, leads: 139 },
  ],
  Every: [
    { name: "Every VXR (AC/Power)", share: 62, leads: 494 },
    { name: "Every VX (Standard)", share: 38, leads: 303 },
  ],
  Alto: [
    { name: "Alto VXR", share: 52, leads: 137 },
    { name: "Alto VXL AGS", share: 34, leads: 89 },
    { name: "Alto VX", share: 14, leads: 37 },
  ],
  Swift: [
    { name: "Swift GLX CVT", share: 54, leads: 57 },
    { name: "Swift GL CVT", share: 28, leads: 30 },
    { name: "Swift GL Manual", share: 18, leads: 19 },
  ],
  Cultus: [
    { name: "Cultus VXL", share: 46, leads: 38 },
    { name: "Cultus Auto Gear Shift (AGS)", share: 34, leads: 28 },
    { name: "Cultus VXR", share: 20, leads: 17 },
  ],
  WagonR: [
    { name: "WagonR VXL", share: 68, leads: 41 },
    { name: "WagonR VXR", share: 32, leads: 19 },
  ],
  Ravi: [{ name: "Ravi Euro II Standard Pickup", share: 100, leads: 30 }],
  "GS 150": [
    { name: "GS 150 Euro II Drum", share: 56, leads: 210 },
    { name: "GS 150 SE Alloy Disc", share: 44, leads: 165 },
  ],
  "GD 110S": [
    { name: "GD 110S Standard Commuter", share: 68, leads: 204 },
    { name: "GD 110S Special Edition", share: 32, leads: 96 },
  ],
  "GSX 125": [{ name: "GSX 125 Street Sport", share: 100, leads: 180 }],
  "GR 150": [{ name: "GR 150 Dual Sport Special", share: 100, leads: 150 }],
};

// Coolors palette: 001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
const CHART_PALETTE = [
  "#005f73",
  "#0a9396",
  "#ee9b00",
  "#ca6702",
  "#94d2bd",
  "#e9d8a6",
  "#bb3e03",
  "#ae2012",
  "#9b2226",
  "#001219",
];

interface InquiryAnalyticsChartsProps {
  readonly selectedCity?: string;
  readonly onResetCity?: () => void;
  readonly records?: DailyInquirySheetRecord[];
}

export function InquiryAnalyticsCharts({
  selectedCity = "all-venues",
  onResetCity,
  records,
}: InquiryAnalyticsChartsProps) {
  const [drilldown, setDrilldown] = useState<DrilldownState>({ level: "overview" });

  const isCityFiltered = selectedCity !== "all-venues" && selectedCity !== "all-38";

  const activeRecords = useMemo(() => {
    const dataSource = records && records.length > 0 ? records : DAILY_INQUIRY_RECORDS;
    if (!isCityFiltered) return dataSource;
    const filtered = dataSource.filter((r) => r.city.toLowerCase() === selectedCity.toLowerCase());
    return filtered.length > 0 ? filtered : dataSource;
  }, [selectedCity, isCityFiltered, records]);

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

    for (const record of activeRecords) {
      for (const fw of record.fourWheelers) {
        if (modelMap[fw.model]) {
          modelMap[fw.model].testDrive += fw.testDrive;
          modelMap[fw.model].salesEnquiry += fw.salesEnquiry;
          modelMap[fw.model].freeEvaluation += fw.freeEvaluation;
        }
      }
    }

    return Object.values(modelMap);
  }, [activeRecords]);

  // 2. City Caravan Footfall & Dispatched Test Drives
  const cityFootfallData = useMemo(() => {
    return activeRecords.map((r) => {
      const drives = (r.fourWheelers || []).reduce((sum: number, item: any) => sum + (item.testDrive || 0), 0);
      return {
        city: r.city,
        footfall: r.customerFootfall,
        testDrives: drives,
      };
    });
  }, [activeRecords]);

  // 3. Computed Totals for Cars & Bikes
  const aggregatedTotals = useMemo(() => {
    const carsByModel: Record<string, number> = {};
    const bikesByModel: Record<string, number> = {};
    let carsTotal = 0;
    let bikesTotal = 0;

    for (const record of activeRecords) {
      for (const fw of record.fourWheelers) {
        const sum = fw.salesEnquiry + fw.testDrive;
        carsTotal += sum;
        carsByModel[fw.model] = (carsByModel[fw.model] || 0) + sum;
      }
      for (const tw of record.twoWheelers) {
        const sum = tw.salesEnquiry + tw.testDrive;
        bikesTotal += sum;
        bikesByModel[tw.model] = (bikesByModel[tw.model] || 0) + sum;
      }
    }

    return { carsTotal, bikesTotal, carsByModel, bikesByModel };
  }, [activeRecords]);

  // 4. Dynamic Pie Chart Data & Config based on current Drilldown state
  const { pieChartData, pieChartConfig, currentTitle, currentSubtitle } = useMemo(() => {
    const { carsTotal, bikesTotal, carsByModel, bikesByModel } = aggregatedTotals;

    if (drilldown.level === "overview") {
      const total = carsTotal + bikesTotal || 1;
      const carsPercent = Math.round((carsTotal / total) * 100);
      const bikesPercent = Math.round((bikesTotal / total) * 100);

      const data = [
        {
          name: "Cars",
          value: carsTotal,
          percentage: carsPercent,
          fill: "#0a9396",
        },
        {
          name: "Bikes",
          value: bikesTotal,
          percentage: bikesPercent,
          fill: "#ee9b00",
        },
      ];

      const config: ChartConfig = {
        Cars: {
          label: "Cars (4-Wheelers)",
          icon: Car,
          color: "#0a9396",
        },
        Bikes: {
          label: "Bikes (2-Wheelers)",
          icon: Bike,
          color: "#ee9b00",
        },
      };

      return {
        pieChartData: data,
        pieChartConfig: config,
        currentTitle: "Vehicle Segment Share: Cars vs Bikes",
        currentSubtitle: "4-Wheelers vs 2-Wheelers • Click slice or bar to drill down",
      };
    }

    if (drilldown.level === "category") {
      if (drilldown.category === "cars") {
        const entries = Object.entries(carsByModel).sort((a, b) => b[1] - a[1]);
        const data = entries.map(([model, val], index) => {
          const pct = Math.round((val / (carsTotal || 1)) * 100);
          return {
            name: model,
            value: val,
            percentage: pct,
            fill: CHART_PALETTE[index % CHART_PALETTE.length],
          };
        });

        const config: ChartConfig = {};
        for (const item of data) {
          config[item.name] = {
            label: item.name,
            icon: Car,
            color: item.fill,
          };
        }

        return {
          pieChartData: data,
          pieChartConfig: config,
          currentTitle: "Car Models: Inquiry & Trial Share",
          currentSubtitle: `Distribution across ${carsTotal.toLocaleString()} 4-Wheeler leads • Click model for variants`,
        };
      }

      // Bikes category
      const entries = Object.entries(bikesByModel).sort((a, b) => b[1] - a[1]);
      const data = entries.map(([model, val], index) => {
        const pct = Math.round((val / (bikesTotal || 1)) * 100);
        return {
          name: model,
          value: val,
          percentage: pct,
          fill: CHART_PALETTE[index % CHART_PALETTE.length],
        };
      });

      const config: ChartConfig = {};
      for (const item of data) {
        config[item.name] = {
          label: item.name,
          icon: Bike,
          color: item.fill,
        };
      }

      return {
        pieChartData: data,
        pieChartConfig: config,
        currentTitle: "Bike Models: Inquiry & Trial Share",
        currentSubtitle: `Distribution across ${bikesTotal.toLocaleString()} 2-Wheeler leads • Click model for variants`,
      };
    }

    // Model trim variants level
    const variants = MODEL_TRIM_VARIANTS[drilldown.model] || [
      { name: `${drilldown.model} Standard`, share: 100, leads: 50 },
    ];

    const data = variants.map((v, index) => ({
      name: v.name,
      value: v.leads,
      percentage: v.share,
      fill: CHART_PALETTE[index % CHART_PALETTE.length],
    }));

    const config: ChartConfig = {};
    for (const item of data) {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      };
    }

    return {
      pieChartData: data,
      pieChartConfig: config,
      currentTitle: `${drilldown.model}: Variant % Breakdown`,
      currentSubtitle: `Trim & variant distribution from on-ground field registrations`,
    };
  }, [drilldown, aggregatedTotals]);

  // Click on pie chart slice
  const handlePieSliceClick = (entry: { name: string }) => {
    if (drilldown.level === "overview") {
      if (entry.name === "Cars") {
        setDrilldown({ level: "category", category: "cars" });
      } else if (entry.name === "Bikes") {
        setDrilldown({ level: "category", category: "bikes" });
      }
    } else if (drilldown.level === "category") {
      setDrilldown({ level: "model", model: entry.name, category: drilldown.category });
    }
  };

  // Click on Bar Chart bar (drills down directly to that car model's variants!)
  const handleBarClick = (modelName: string) => {
    setDrilldown({ level: "model", model: modelName, category: "cars" });
  };

  const handleResetToOverview = () => {
    setDrilldown({ level: "overview" });
  };

  const handleGoBack = () => {
    if (drilldown.level === "model") {
      setDrilldown({ level: "category", category: drilldown.category });
    } else if (drilldown.level === "category") {
      setDrilldown({ level: "overview" });
    }
  };

  const modelChartConfig = {
    testDrive: {
      label: "Test Drives",
      color: "#0a9396",
    },
    salesEnquiry: {
      label: "Sales Inquiries",
      color: "#ee9b00",
    },
    freeEvaluation: {
      label: "Trade-In Appraisals",
      color: "#ca6702",
    },
  } satisfies ChartConfig;

  const cityChartConfig = {
    footfall: {
      label: "Verified Footfall",
      color: "#0a9396",
    },
    testDrives: {
      label: "Test Drives Dispatched",
      color: "#ee9b00",
    },
  } satisfies ChartConfig;

  const selectedModel = drilldown.level === "model" ? drilldown.model : null;

  const renderCardIcon = () => {
    if (drilldown.level === "model" || (drilldown.level === "category" && drilldown.category === "cars")) {
      return <Car className="size-4 text-primary" />;
    }
    if (drilldown.level === "category" && drilldown.category === "bikes") {
      return <Bike className="size-4 text-primary" />;
    }
    return <Layers className="size-4 text-primary" />;
  };

  const renderBottomInsights = () => {
    if (drilldown.level === "overview") {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 text-center text-muted-foreground text-xs">
          <span className="font-semibold text-foreground">
            Cars: {pieChartData[0]?.percentage}% ({pieChartData[0]?.value.toLocaleString()} leads)
          </span>
          <span>•</span>
          <span className="font-semibold text-foreground">
            Bikes: {pieChartData[1]?.percentage}% ({pieChartData[1]?.value.toLocaleString()} leads)
          </span>
          <span className="w-full text-[11px] text-muted-foreground">
            (Click a segment above or any bar on the left to drill down)
          </span>
        </div>
      );
    }

    if (drilldown.level === "category") {
      return (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {pieChartData.map((item) => (
            <button
              type="button"
              key={item.name}
              onClick={() =>
                setDrilldown({
                  level: "model",
                  model: item.name,
                  category: drilldown.category,
                })
              }
              className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] transition-colors hover:bg-muted hover:text-foreground"
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="font-medium text-foreground">{item.name}</span>
              <span className="text-muted-foreground">{item.percentage}%</span>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {pieChartData.map((variant) => (
            <div
              key={variant.name}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-2.5 py-0.5 text-[11px] shadow-2xs"
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: variant.fill }} />
              <span className="font-medium text-foreground">{variant.name}:</span>
              <strong className="text-primary">{variant.percentage}%</strong>
              <span className="text-muted-foreground">({variant.value} leads)</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center pt-1">
          <Button
            size="xs"
            variant="ghost"
            onClick={handleResetToOverview}
            className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            Reset to Cars vs Bikes
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Model Demand Matrix & Interactive Drill-Down Pie Chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Graph 1: 4W Demand & Test Drive Distribution by Model (7 cols) */}
        <Card className="shadow-xs lg:col-span-7">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 font-semibold text-base">
                  <Car className="size-4 text-primary" />
                  Vehicle Demand &amp; Inquiries by Model
                </CardTitle>
                <CardDescription className="text-xs">
                  Automobile matrix: Test drives, sales inquiries &amp; trade-in appraisals{" "}
                  {isCityFiltered ? `for ${selectedCity}` : "across Phase 1 tour stops"}
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {isCityFiltered && (
                  <Badge
                    variant="outline"
                    className="w-fit gap-1 border-primary/30 bg-primary/10 font-normal text-primary text-xs"
                  >
                    <span>City:</span>
                    <strong className="text-foreground">{selectedCity}</strong>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="ml-1 size-4 p-0 text-muted-foreground hover:text-foreground"
                      onClick={onResetCity}
                      title="Clear city filter"
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {selectedModel && (
                  <Badge variant="secondary" className="w-fit gap-1 font-normal text-xs">
                    <span>Model:</span>
                    <strong className="text-foreground">{selectedModel}</strong>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="ml-1 size-4 p-0 text-muted-foreground hover:text-foreground"
                      onClick={handleResetToOverview}
                      title="Clear filter"
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={modelChartConfig} className="h-64 w-full">
              <BarChart
                accessibilityLayer
                data={modelDemandData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                className="cursor-pointer"
                onClick={(state) => {
                  if (state?.activeLabel && typeof state.activeLabel === "string") {
                    handleBarClick(state.activeLabel);
                  }
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="model" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="testDrive"
                  fill="var(--color-testDrive, #0a9396)"
                  radius={[4, 4, 0, 0]}
                  onClick={(_, index) => {
                    const item = modelDemandData[index];
                    if (item?.model) handleBarClick(item.model);
                  }}
                />
                <Bar
                  dataKey="salesEnquiry"
                  fill="var(--color-salesEnquiry, #ee9b00)"
                  radius={[4, 4, 0, 0]}
                  onClick={(_, index) => {
                    const item = modelDemandData[index];
                    if (item?.model) handleBarClick(item.model);
                  }}
                />
                <Bar
                  dataKey="freeEvaluation"
                  fill="var(--color-freeEvaluation, #ca6702)"
                  radius={[4, 4, 0, 0]}
                  onClick={(_, index) => {
                    const item = modelDemandData[index];
                    if (item?.model) handleBarClick(item.model);
                  }}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Graph 2: Vehicle Segment Share & Variant Drill-Down (5 cols) */}
        <Card className="flex flex-col justify-between shadow-xs lg:col-span-5">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-semibold text-base">
                  {renderCardIcon()}
                  {currentTitle}
                </CardTitle>

                {drilldown.level !== "overview" && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={handleGoBack}
                    className="h-7 gap-1 px-2 text-muted-foreground text-xs hover:text-foreground"
                    title="Go back up one level"
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <CardDescription className="text-xs">{currentSubtitle}</CardDescription>

                {/* Level Navigation Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    size="xs"
                    variant={drilldown.level === "overview" ? "default" : "outline"}
                    className="h-6 px-2 text-[11px]"
                    onClick={handleResetToOverview}
                  >
                    Cars vs Bikes
                  </Button>
                  <Button
                    size="xs"
                    variant={drilldown.level === "category" && drilldown.category === "cars" ? "default" : "outline"}
                    className="h-6 px-2 text-[11px]"
                    onClick={() => setDrilldown({ level: "category", category: "cars" })}
                  >
                    Cars
                  </Button>
                  <Button
                    size="xs"
                    variant={drilldown.level === "category" && drilldown.category === "bikes" ? "default" : "outline"}
                    className="h-6 px-2 text-[11px]"
                    onClick={() => setDrilldown({ level: "category", category: "bikes" })}
                  >
                    Bikes
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col items-center justify-between">
            <ChartContainer config={pieChartConfig} className="h-52 w-full">
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={46}
                  outerRadius={74}
                  paddingAngle={pieChartData.length > 1 ? 4 : 0}
                  className="cursor-pointer select-none"
                  onClick={(entry) => {
                    if (entry?.name) {
                      handlePieSliceClick(entry as { name: string });
                    }
                  }}
                >
                  {pieChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} className="transition-opacity hover:opacity-80" />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>

            {/* Bottom Insight & Quick Variant Chips */}
            <div className="mt-2 w-full space-y-1.5">{renderBottomInsights()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Caravan Tour Stop Footfall & Engagement Corridor (Full Width) */}
      <Card className="shadow-xs">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-semibold text-base">
                <MapPin className="size-4 text-primary" />
                Caravan Tour Stop Footfall &amp; Engagement Corridor (15 Tour Cities)
              </CardTitle>
              <CardDescription className="text-xs">
                City-by-city comparison of verified customer footfall vs test drives dispatched across ROS &amp; ROSP
              </CardDescription>
            </div>
            <div className="text-muted-foreground text-xs">
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
              <Bar dataKey="footfall" fill="var(--color-footfall, #0a9396)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="testDrives" fill="var(--color-testDrives, #ee9b00)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
          <div className="mt-2 flex flex-wrap items-center justify-between px-2 text-muted-foreground text-xs">
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
