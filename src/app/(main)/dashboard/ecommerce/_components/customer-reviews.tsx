"use client";

import { useState } from "react";

import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const surveyVerbatims = [
  {
    name: "Mrs. Farzana Akhtar",
    area: "Gulshan-e-Iqbal, Block 4",
    initials: "FA",
    comment:
      "Switched from Dalda because the 5L Meezan can had a great promotional bundle and the oil doesn't smell during frying samosas.",
    rating: 5,
  },
  {
    name: "Tariq Mehmood",
    area: "North Nazimabad, Block H",
    initials: "TM",
    comment:
      "The agent was polite, wore clean uniform, and showed us the trans-fat free certification. Bought 4 pouches of Banaspati on spot.",
    rating: 5,
  },
  {
    name: "Sadia Kamran",
    area: "DHA Phase 5",
    initials: "SK",
    comment:
      "Direct doorstep delivery saves a supermarket trip. Very convenient paying via Raast QR code to the sales boy.",
    rating: 5,
  },
  {
    name: "Haji Abdul Rasheed",
    area: "F.B. Area, Block 14",
    initials: "AR",
    comment:
      "Quality is top notch. We compared color and clarity with our existing brand. Very pleased with the price.",
    rating: 5,
  },
];

const ratingDistribution = [
  { label: "5 ★", pct: 82, count: "1,853 homes" },
  { label: "4 ★", pct: 12, count: "271 homes" },
  { label: "3 ★", pct: 4, count: "90 homes" },
  { label: "1-2 ★", pct: 2, count: "46 homes" },
];

const purchaseDrivers = [
  { label: "Zero Frying Odor", pct: "44%" },
  { label: "Promo Bundle Value", pct: "31%" },
  { label: "Trans-Fat Free Cert", pct: "25%" },
  { label: "Instant Doorstep Delivery", pct: "22%" },
];

export function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = surveyVerbatims[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? surveyVerbatims.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === surveyVerbatims.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Consumer Survey Verbatims</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          4.8 / 5.0 Doorstep Sentiment
        </CardDescription>
        <CardAction>
          <ArrowUpRight className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Active Customer Review Quote */}
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-0.5 text-foreground">
                {["star-1", "star-2", "star-3", "star-4", "star-5"].slice(0, current.rating).map((key) => (
                  <Star key={key} className="size-3.5 fill-current" />
                ))}
              </div>
              <div>
                <div className="font-medium text-sm">{current.name}</div>
                <div className="text-[11px] text-muted-foreground">{current.area}</div>
                <p className="mt-2 line-clamp-3 text-muted-foreground text-sm leading-relaxed">"{current.comment}"</p>
              </div>
            </div>

            <div className="flex shrink-0 gap-1">
              <Button aria-label="Previous review" size="icon-xs" variant="outline" onClick={handlePrev}>
                <ArrowLeft />
              </Button>
              <Button aria-label="Next review" size="icon-xs" variant="outline" onClick={handleNext}>
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex flex-col gap-2 rounded-lg border p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Doorstep Rating Breakdown</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">2,260 respondents</span>
          </div>
          <div className="flex flex-col gap-2">
            {ratingDistribution.map((item) => (
              <div key={item.label} className="grid grid-cols-[38px_1fr_42px] items-center gap-2 text-xs">
                <span className="font-medium text-[11px] text-muted-foreground">{item.label}</span>
                <Progress value={item.pct} className="h-1.5" />
                <span className="text-right font-medium text-[11px] text-muted-foreground tabular-nums">
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Decision Drivers */}
        <div className="flex flex-col gap-2">
          <div className="font-medium text-[11px] text-muted-foreground">Top Customer Purchase Drivers:</div>
          <div className="flex flex-wrap gap-1.5">
            {purchaseDrivers.map((driver) => (
              <Badge key={driver.label} variant="secondary" className="py-0.5 font-normal text-[11px]">
                <span className="font-medium text-foreground">{driver.label}</span>
                <span className="ml-1 text-muted-foreground">({driver.pct})</span>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
