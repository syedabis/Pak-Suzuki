import { AlertCircle, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const objectionReasons = [
  {
    reason: "Bank Lease / KIBOR Sensitivity",
    count: "540 prospects",
    share: 38,
    detail: "High bank interest rates; awaiting PSMCL subvention financing",
    color: "var(--chart-3)",
  },
  {
    reason: "Chassis Delivery Queue",
    count: "340 prospects",
    share: 24,
    detail: "Prospect seeking ready on-spot delivery vs 4-6 week factory wait",
    color: "var(--chart-2)",
  },
  {
    reason: "Used Car Trade-In Valuation",
    count: "256 prospects",
    share: 18,
    detail: "Awaiting 130-point evaluation score & fair trade-in valuation",
    color: "var(--chart-1)",
  },
  {
    reason: "Color / Trim Out of Stock",
    count: "156 prospects",
    share: 11,
    detail: "Requesting Swift Phoenix Red or Alto Metallic Grey allocation",
    color: "var(--chart-4)",
  },
  {
    reason: "Corporate / Fleet Sign-Off",
    count: "128 prospects",
    share: 9,
    detail: "Corporate procurement approval pending committee review",
    color: "var(--chart-5)",
  },
] as const;

export function NonConversionReasons() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Reasons for Postponed Booking</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          1,420 Showroom Walkout Objections
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
