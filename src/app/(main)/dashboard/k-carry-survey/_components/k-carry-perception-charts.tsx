"use client";

import { useEffect, useMemo, useState } from "react";

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
import { K_CARRY_SURVEY_DATA } from "@/data/suzuki-express/k-carry-survey-data";
import { supabase } from "@/lib/supabase";

// Coolors palette: 001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
const PRICE_BAND_COLORS = ["#0a9396", "#ee9b00", "#ca6702", "#9b2226"];

export function KCarryPerceptionCharts() {
  const [data, setData] = useState<any[]>(K_CARRY_SURVEY_DATA);

  useEffect(() => {
    async function loadCloudSurveys() {
      const { data: sups, error } = await supabase
        .from("k_carry_surveys")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && sups && sups.length > 0) {
        setData(
          sups.map((s) => ({
            heardAboutKCarryBefore: s.heard_about_kcarry_before,
            knowsReplacementForRavi: s.knows_replacement_for_ravi,
            suitableReplacementForRavi: s.suitable_replacement_for_ravi,
            reasonablePriceRange: s.reasonable_price_range,
            wouldConsiderBuying: s.would_consider_buying,
          })),
        );
      }
    }
    loadCloudSurveys();
  }, []);

  const totalResponses = data.length || 1;

  // Q6: Prior K-CARRY Awareness
  const priorAwarenessData = useMemo(() => {
    const counts = { Yes: 0, No: 0 };
    for (const r of data) {
      if (r.heardAboutKCarryBefore === "Yes") counts.Yes++;
      else if (r.heardAboutKCarryBefore === "No") counts.No++;
    }
    return [
      { name: "Yes (Aware)", value: counts.Yes, fill: "#0a9396" },
      { name: "No (Unaware)", value: counts.No, fill: "#e9d8a6" },
    ];
  }, [data]);

  const priorAwarenessPercent = useMemo(() => {
    const yesCount = priorAwarenessData[0]?.value || 0;
    return Math.round((yesCount / totalResponses) * 100);
  }, [priorAwarenessData, totalResponses]);

  // Q7: Ravi Replacement Awareness
  const replacementAwarenessData = useMemo(() => {
    const counts = { Yes: 0, No: 0 };
    for (const r of data) {
      if (r.knowsReplacementForRavi === "Yes") counts.Yes++;
      else if (r.knowsReplacementForRavi === "No") counts.No++;
    }
    return [
      { name: "Yes (Aware of Succession)", value: counts.Yes, fill: "#005f73" },
      { name: "No (Unaware)", value: counts.No, fill: "#e9d8a6" },
    ];
  }, [data]);

  const replacementAwarenessPercent = useMemo(() => {
    const yesCount = replacementAwarenessData[0]?.value || 0;
    return Math.round((yesCount / totalResponses) * 100);
  }, [replacementAwarenessData, totalResponses]);

  // Q8: Ravi Replacement Suitability Sentiment
  const raviSentimentData = useMemo(() => {
    const counts: Record<string, number> = { Yes: 0, "Not Sure": 0, No: 0 };
    for (const r of data) {
      if (counts[r.suitableReplacementForRavi] !== undefined) {
        counts[r.suitableReplacementForRavi]++;
      }
    }
    return [
      { name: "Yes (Endorsed)", value: counts.Yes, fill: "#0a9396" },
      { name: "Not Sure", value: counts["Not Sure"], fill: "#e9d8a6" },
      { name: "No", value: counts.No, fill: "#bb3e03" },
    ];
  }, [data]);

  const raviYesPercent = useMemo(() => {
    const yesCount = raviSentimentData[0]?.value || 0;
    return Math.round((yesCount / totalResponses) * 100);
  }, [raviSentimentData, totalResponses]);

  // Q9: Price Band Acceptance
  const priceBandData = useMemo(() => {
    const counts: Record<string, number> = {
      "PKR 22–24 lakh": 0,
      "PKR 24–27 lakh": 0,
      "PKR 28–30 lakh": 0,
      "Above PKR 30 lakh": 0,
    };
    for (const r of data) {
      if (counts[r.reasonablePriceRange] !== undefined) {
        counts[r.reasonablePriceRange]++;
      }
    }
    return [
      {
        band: "22–24 Lakh",
        count: counts["PKR 22–24 lakh"],
        percentage: Math.round((counts["PKR 22–24 lakh"] / totalResponses) * 100),
      },
      {
        band: "24–27 Lakh",
        count: counts["PKR 24–27 lakh"],
        percentage: Math.round((counts["PKR 24–27 lakh"] / totalResponses) * 100),
      },
      {
        band: "28–30 Lakh",
        count: counts["PKR 28–30 lakh"],
        percentage: Math.round((counts["PKR 28–30 lakh"] / totalResponses) * 100),
      },
      {
        band: "Above 30L",
        count: counts["Above PKR 30 lakh"],
        percentage: Math.round((counts["Above PKR 30 lakh"] / totalResponses) * 100),
      },
    ];
  }, [data, totalResponses]);

  // Q10: Purchase Intent
  const purchaseIntentData = useMemo(() => {
    const counts: Record<string, number> = {
      "Definitely Yes": 0,
      "Maybe / Needs More Information": 0,
      No: 0,
    };
    for (const r of data) {
      if (counts[r.wouldConsiderBuying] !== undefined) {
        counts[r.wouldConsiderBuying]++;
      }
    }
    return [
      { name: "Definitely Buy", value: counts["Definitely Yes"], fill: "#0a9396" },
      { name: "Maybe / Need Info", value: counts["Maybe / Needs More Information"], fill: "#ee9b00" },
      { name: "Not Interested", value: counts.No, fill: "#bb3e03" },
    ];
  }, [data]);

  const totalBuyIntentPercent = useMemo(() => {
    const defCount = purchaseIntentData[0]?.value || 0;
    const maybeCount = purchaseIntentData[1]?.value || 0;
    return Math.round(((defCount + maybeCount) / totalResponses) * 100);
  }, [purchaseIntentData, totalResponses]);

  const priorChartConfig = {
    "Yes (Aware)": {
      label: "Aware",
      color: "#0a9396",
    },
    "No (Unaware)": {
      label: "Unaware",
      color: "#e9d8a6",
    },
  } satisfies ChartConfig;

  const replaceAwareChartConfig = {
    "Yes (Aware of Succession)": {
      label: "Aware of Succession",
      color: "#005f73",
    },
    "No (Unaware)": {
      label: "Unaware",
      color: "#e9d8a6",
    },
  } satisfies ChartConfig;

  const sentimentChartConfig = {
    "Yes (Endorsed)": {
      label: "Suitable",
      color: "#0a9396",
    },
    "Not Sure": {
      label: "Not Sure",
      color: "#e9d8a6",
    },
    No: {
      label: "Not Suitable",
      color: "#bb3e03",
    },
  } satisfies ChartConfig;

  const priceChartConfig = {
    count: {
      label: "Respondents",
      color: "#0a9396",
    },
  } satisfies ChartConfig;

  const intentChartConfig = {
    "Definitely Buy": {
      label: "Definitely Buy",
      color: "#0a9396",
    },
    "Maybe / Need Info": {
      label: "Need More Info",
      color: "#ee9b00",
    },
    "Not Interested": {
      label: "Not Interested",
      color: "#bb3e03",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Questions 6, 7, and 8 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Q6. Prior Awareness of K-CARRY */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-base">Q6: Prior Brand Awareness</CardTitle>
            <CardDescription className="text-xs">"Have you heard about Suzuki K-CARRY before today?"</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer config={priorChartConfig} className="h-52 w-full">
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={priorAwarenessData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {priorAwarenessData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 text-center text-muted-foreground text-xs">
              <strong className="text-foreground">{priorAwarenessPercent}%</strong> of respondents already had prior
              awareness
            </div>
          </CardContent>
        </Card>

        {/* Q7. Awareness of K-CARRY as Ravi Replacement */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-base">Q7: Ravi Replacement Awareness</CardTitle>
            <CardDescription className="text-xs">"Did you know K-CARRY is replacing the legacy Ravi?"</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer config={replaceAwareChartConfig} className="h-52 w-full">
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={replacementAwarenessData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {replacementAwarenessData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 text-center text-muted-foreground text-xs">
              <strong className="text-foreground">{replacementAwarenessPercent}%</strong> recognized K-CARRY as Ravi's
              successor
            </div>
          </CardContent>
        </Card>

        {/* Q8. Ravi Replacement Suitability Sentiment */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-base">Q8: Ravi Replacement Suitability</CardTitle>
            <CardDescription className="text-xs">
              "Do you feel K-CARRY is a suitable replacement for Ravi?"
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer config={sentimentChartConfig} className="h-52 w-full">
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={raviSentimentData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {raviSentimentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 text-center text-muted-foreground text-xs">
              <strong className="text-foreground">{raviYesPercent}%</strong> endorsed K-CARRY as a suitable replacement
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Questions 9 and 10 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Q9. Price Acceptance Tolerance */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-base">Q9: Price Acceptance Tolerance</CardTitle>
            <CardDescription className="text-xs">
              "In your opinion, what would be a reasonable price range for Suzuki K-CARRY?"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={priceChartConfig} className="h-56 w-full">
              <BarChart accessibilityLayer data={priceBandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="band" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priceBandData.map((_, i) => (
                    <Cell key={`price-band-${i}`} fill={PRICE_BAND_COLORS[i % PRICE_BAND_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="mt-2 flex justify-between px-2 text-muted-foreground text-xs">
              <span>
                Sweet Spot Range: <strong className="text-foreground">22–24L (42%)</strong>
              </span>
              <span>
                Secondary Acceptable: <strong className="text-foreground">24–27L (35%)</strong>
              </span>
              <span>
                Total Sweet Spot: <strong className="text-foreground">78%</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Q10. Purchase Consideration Intent */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-base">Q10: Purchase Consideration Intent</CardTitle>
            <CardDescription className="text-xs">
              "Would you consider buying / booking the Suzuki K-CARRY for your business?"
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer config={intentChartConfig} className="h-56 w-full">
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={purchaseIntentData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {purchaseIntentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 text-center text-muted-foreground text-xs">
              <strong className="text-emerald-600 dark:text-emerald-400">{totalBuyIntentPercent}%</strong> active
              commercial sales pipeline (49% Definite + 36% Warm / Needs Info)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
