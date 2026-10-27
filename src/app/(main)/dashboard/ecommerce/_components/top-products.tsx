import { ArrowUpRight, TrendingUp } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const categories = [
  {
    name: "Economy (Alto 660cc)",
    share: 42,
    color: "var(--chart-3)",
  },
  {
    name: "Commercial (K-CARRY & Every)",
    share: 34,
    color: "var(--chart-1)",
  },
  {
    name: "Family (Swift & Cultus)",
    share: 14,
    color: "var(--chart-2)",
  },
  {
    name: "Motorcycles (GD/GS/GSX)",
    share: 10,
    color: "var(--chart-4)",
  },
] as const;

const products = [
  {
    name: "Suzuki Alto 660cc (VXR/VXL)",
    category: "Economy Segment • 98 Inquiries",
    marketShare: "42.5%",
    trend: "+8.2%",
    sales: "12 Bookings",
  },
  {
    name: "Suzuki K-CARRY (Ravi Successor)",
    category: "Commercial Pickup • 89 Inquiries",
    marketShare: "28.4%",
    trend: "+34.5%",
    sales: "9 Bookings",
  },
  {
    name: "Suzuki Every (VX / VXR)",
    category: "Rural Multi-Utility MPV • 48 Inquiries",
    marketShare: "12.8%",
    trend: "+14.1%",
    sales: "5 Bookings",
  },
  {
    name: "Suzuki GD 110S & GS 150",
    category: "2W Rural Fleet • 56 Inquiries",
    marketShare: "9.6%",
    trend: "+6.0%",
    sales: "6 Bookings",
  },
  {
    name: "Suzuki Swift & Cultus",
    category: "Family Hatchbacks • 32 Inquiries",
    marketShare: "6.7%",
    trend: "+2.3%",
    sales: "2 Bookings",
  },
] as const;

export function TopProducts() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Vehicle Segment Demand Mix</CardTitle>
        <div className="flex items-baseline justify-between gap-2">
          <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
            323 Campaign Inquiries & 34 Bookings
          </CardDescription>
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600 text-xs dark:text-emerald-400">
            <TrendingUp className="size-3" />
            +5.4% volume growth
          </span>
        </div>
        <CardAction>
          <ArrowUpRight className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div
            aria-label="Market share by category"
            className="flex h-2 gap-1 overflow-hidden rounded-full bg-muted"
            role="img"
          >
            {categories.map((category) => (
              <div
                aria-hidden="true"
                key={category.name}
                className="rounded-full"
                style={{
                  backgroundColor: category.color,
                  width: `${category.share}%`,
                }}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {categories.map((category) => (
              <div className="flex items-center gap-1.5" key={category.name}>
                <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-muted-foreground text-xs">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3">
          <div className="font-medium text-muted-foreground text-xs">Our Product SKU</div>
          <div className="text-right font-medium text-muted-foreground text-xs">Market Share %</div>

          {products.map((product) => (
            <div className="contents text-sm" key={product.name}>
              <div className="min-w-0">
                <div className="font-medium text-xs sm:text-sm">{product.name}</div>
                <div className="text-[11px] text-muted-foreground sm:text-xs">{product.category}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground text-xs tabular-nums sm:text-sm">
                  {product.marketShare}
                </div>
                <div className="font-medium text-[10px] text-emerald-600 sm:text-[11px] dark:text-emerald-400">
                  {product.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
