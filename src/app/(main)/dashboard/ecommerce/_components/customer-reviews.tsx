"use client";

import { useState } from "react";

import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const surveyVerbatims = [
  {
    name: "Engr. Bilal Sheikh",
    area: "Clifton 3S, Karachi",
    initials: "BS",
    comment:
      "Took the Swift GLX CVT on the Marine Drive loop. The push-start, cruise control, and responsive CVT transmission won me over. Booked right after the drive.",
    rating: 5,
  },
  {
    name: "Dr. M. Kamran",
    area: "Gulberg 3S, Lahore",
    initials: "MK",
    comment:
      "Impressed by the Alto VXL AGS fuel economy on city roads. The sales consultant explained the Meezan Bank car financing scheme with zero processing fee.",
    rating: 5,
  },
  {
    name: "Syeda Fatima",
    area: "I-9 3S, Islamabad",
    initials: "SF",
    comment:
      "The 3S showroom had great hospitality. Test drove the new Suzuki Every. It has immense cabin space and smooth air conditioning.",
    rating: 5,
  },
  {
    name: "Tariq Mehmood",
    area: "University Road 3S, Peshawar",
    initials: "TM",
    comment:
      "Fast-track 15-minute test drive dispatch. Consultant verified my driving license via digital tablet in under a minute.",
    rating: 5,
  },
];

const ratingDistribution = [
  { label: "5 ★", pct: 86, count: "1,582 reviews" },
  { label: "4 ★", pct: 10, count: "184 reviews" },
  { label: "3 ★", pct: 3, count: "55 reviews" },
  { label: "1-2 ★", pct: 1, count: "19 reviews" },
];

const purchaseDrivers = [
  { label: "Exceptional Fuel Economy", pct: "48%" },
  { label: "Nationwide 3S Network", pct: "32%" },
  { label: "High Resale Value", pct: "26%" },
  { label: "Instant Bank Approval", pct: "19%" },
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
        <CardTitle className="font-normal text-muted-foreground text-sm">Test Drive Experience & CSI</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          4.8 / 5.0 CSI Satisfaction Score
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
            <span className="font-medium text-foreground">Test Drive CSI Rating Breakdown</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">1,840 respondents</span>
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
