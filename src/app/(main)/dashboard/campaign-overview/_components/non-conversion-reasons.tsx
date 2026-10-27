import { AlertCircle, FileText } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ruralObjectionReasons = [
  {
    reason: "Harvest Cash-Flow Seasonality",
    count: "182 prospects",
    share: 38,
    detail: "Awaiting seasonal crop harvest payment (cotton/sugarcane) before token release",
    color: "var(--primary)",
  },
  {
    reason: "Old Ravi / Bolan Trade-In Valuation",
    count: "125 prospects",
    share: 26,
    detail: "Seeking higher exchange appraisal for existing commercial utility vehicles",
    color: "var(--chart-2)",
  },
  {
    reason: "Payload & Heavy Load Verification",
    count: "86 prospects",
    share: 18,
    detail: "Hauler verifying K-Carry deck strength for 800kg–1000kg rural cargo",
    color: "var(--chart-3)",
  },
  {
    reason: "Non-Bank Installment Flexibility",
    count: "53 prospects",
    share: 11,
    detail: "Requesting crop-linked flexible payment plans over traditional bank markup",
    color: "var(--chart-4)",
  },
  {
    reason: "Immediate Spot Delivery Request",
    count: "34 prospects",
    share: 7,
    detail: "Customer ready to buy on-spot but requested drive-away from the tour ground",
    color: "var(--chart-5)",
  },
] as const;

export function NonConversionReasons() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm flex items-center gap-1.5">
          <FileText className="size-4 text-primary" />
          Rural Purchase Drivers &amp; Objections
        </CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          Field Inquiry Follow-Up Dynamics
        </CardDescription>
        <CardAction className="text-xs text-muted-foreground">480 Monitored Leads</CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-3">
        <div className="space-y-3">
          {ruralObjectionReasons.map((item) => (
            <div key={item.reason} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{item.reason}</span>
                <span className="font-mono font-bold text-foreground">{item.share}%</span>
              </div>
              <Progress value={item.share} className="h-1.5" />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="truncate">{item.detail}</span>
                <span className="font-medium shrink-0 ml-1">({item.count})</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
