import { AlertCircle, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const objectionReasons = [
  {
    reason: "Pantry Already Stocked",
    count: "682 homes",
    share: 35,
    detail: "Recently bought monthly ration; scheduled callback",
    color: "var(--chart-3)",
  },
  {
    reason: "Loyal to Dalda / Habib",
    count: "487 homes",
    share: 25,
    detail: "Long-time habit; requested free sample sachet",
    color: "var(--chart-2)",
  },
  {
    reason: "Price Sensitivity",
    count: "273 homes",
    share: 14,
    detail: "Awaiting wholesale bundle or promotional discount",
    color: "var(--chart-1)",
  },
  {
    reason: "Prefers Ghee / Banaspati",
    count: "195 homes",
    share: 10,
    detail: "Only cooks in Banaspati; agent oil stock in bag",
    color: "var(--chart-4)",
  },
  {
    reason: "Decision Maker Absent",
    count: "175 homes",
    share: 9,
    detail: "Spouse or elder buys groceries; requested evening visit",
    color: "var(--chart-5)",
  },
  {
    reason: "Prefers Kiryana Store Credit",
    count: "136 homes",
    share: 7,
    detail: "Buys on monthly khata at local corner store",
    color: "var(--chart-1)",
  },
] as const;

export function NonConversionReasons() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Reasons Customer Did Not Buy</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          1,948 Doorstep Objections
        </CardDescription>
        <CardAction>
          <Button aria-label="View all objections" size="icon-sm" variant="ghost">
            <ArrowUpRight className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex flex-col gap-3">
          {objectionReasons.map((item) => (
            <div className="flex flex-col gap-1" key={item.reason}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground text-xs">{item.reason}</span>
                <span className="font-semibold text-foreground tabular-nums">{item.share}%</span>
              </div>

              <div
                aria-label={`${item.reason}: ${item.share}%`}
                className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: item.color,
                    width: `${item.share}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="truncate pr-2">{item.detail}</span>
                <span className="shrink-0 tabular-nums">{item.count}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Separator />
          <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <AlertCircle className="size-3.5 text-primary" />
              <span>Agreed to Follow-up / Re-visit</span>
            </div>
            <div className="font-semibold text-foreground tabular-nums">65% (1,266 homes)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
