"use client";

import { useState } from "react";

import { ArrowLeft, ArrowRight, MessageSquareQuote, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const caravanTestimonials = [
  {
    name: "Wadera Ghulam Rasool",
    area: "Umerkot • Tharparkar Motors",
    initials: "GR",
    comment:
      "Test drove the new K-Carry on the dirt bypass road. The pulling power with 800kg onion sacks is far superior to our old Ravi. Ready to book token right after cotton crop harvest.",
    rating: 5,
  },
  {
    name: "Haji Muhammad Ismail",
    area: "Badin • Carachi Motors Badin",
    initials: "MI",
    comment:
      "Brought our Bolan for the free mobile service clinic. Suzuki technicians inspected the brakes, suspension, and tuned the engine on the spot in 20 minutes. Very impressed.",
    rating: 5,
  },
  {
    name: "Mirza Aslam Baig",
    area: "Usta Muhammad • Jacobabad Motors",
    initials: "AB",
    comment:
      "Tested both GD 110S bike and K-Carry pickup. The local dealer team provided an honest quotation and trade-in assessment. A game changer for agricultural logistics.",
    rating: 5,
  },
  {
    name: "Chaudhry Niaz Ahmad",
    area: "T.M. Khan • Zeeshan Autos TMK",
    initials: "NA",
    comment:
      "Our agricultural produce delivery needs a reliable vehicle. The K-Carry deck bed is noticeably wider than competitors, fitting standard crates without overhang.",
    rating: 5,
  },
];

const customerSatisfaction = [
  { label: "5 ★", pct: 91, count: "680 rural visitors" },
  { label: "4 ★", pct: 7, count: "52 rural visitors" },
  { label: "3 ★", pct: 2, count: "16 rural visitors" },
];

const purchaseDrivers = [
  { label: "Payload Capacity & Suspension", pct: "54%" },
  { label: "Rural Fuel Economy", pct: "46%" },
  { label: "Parts Availability & Low Upkeep", pct: "38%" },
  { label: "On-Spot Trade-In Facility", pct: "28%" },
];

export function CustomerReviews() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prev = () => setCurrentIdx((i) => (i === 0 ? caravanTestimonials.length - 1 : i - 1));
  const next = () => setCurrentIdx((i) => (i === caravanTestimonials.length - 1 ? 0 : i + 1));

  const review = caravanTestimonials[currentIdx];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm flex items-center gap-1.5">
          <MessageSquareQuote className="size-4 text-primary" />
          On-Ground Caravan Field Feedback
        </CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          4.9 / 5.0 Tour Camp CSI Rating
        </CardDescription>
        <CardAction className="flex items-center gap-1">
          <Button size="icon-xs" variant="ghost" onClick={prev} aria-label="Previous review">
            <ArrowLeft className="size-3.5" />
          </Button>
          <Button size="icon-xs" variant="ghost" onClick={next} aria-label="Next review">
            <ArrowRight className="size-3.5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-3 text-xs">
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-bold text-[10px] text-primary">
                {review.initials}
              </span>
              <div>
                <span className="font-semibold text-foreground block">{review.name}</span>
                <span className="text-[10px] text-muted-foreground">{review.area}</span>
              </div>
            </div>
            <div className="flex items-center text-amber-500">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="size-3 fill-amber-500" />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground italic text-[11px] leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-muted-foreground font-medium text-[11px]">
            <span>Top Rural Purchase Drivers</span>
            <span>Customer %</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {purchaseDrivers.map((driver) => (
              <div
                key={driver.label}
                className="flex items-center justify-between rounded-md border border-border/50 bg-card px-2.5 py-1.5 text-[11px]"
              >
                <span className="truncate text-muted-foreground">{driver.label}</span>
                <span className="font-mono font-bold text-foreground shrink-0 ml-1">{driver.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
