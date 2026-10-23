import { ArrowUpRight, TrendingUp } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const categories = [
  {
    name: "Economy (Alto 660cc)",
    share: 48,
    color: "var(--chart-3)",
  },
  {
    name: "Premium (Swift 1.2L)",
    share: 25,
    color: "var(--chart-2)",
  },
  {
    name: "Family (Cultus VXL)",
    share: 16,
    color: "var(--chart-1)",
  },
  {
    name: "Commercial (Every/Ravi)",
    share: 11,
    color: "var(--chart-4)",
  },
] as const;

const products = [
  {
    name: "Suzuki Alto VXL AGS",
    category: "660cc Hatchback • 228 units booked",
    marketShare: "48.2%",
    trend: "+4.8%",
    sales: "PKR 704.5M",
  },
  {
    name: "Suzuki Swift GLX CVT",
    category: "1.2L Dual VVT • 114 units booked",
    marketShare: "24.5%",
    trend: "+6.2%",
    sales: "PKR 538.0M",
  },
  {
    name: "Suzuki Cultus VXL",
    category: "1.0L K-Series • 76 units booked",
    marketShare: "16.4%",
    trend: "+1.9%",
    sales: "PKR 311.6M",
  },
  {
    name: "Suzuki Every VX (New MPV)",
    category: "660cc Commercial MPV • 38 units",
    marketShare: "8.1%",
    trend: "+12.4%",
    sales: "PKR 106.4M",
  },
  {
    name: "Suzuki Ravi Pickup",
    category: "800cc LCV • 12 units booked",
    marketShare: "2.8%",
    trend: "+1.1%",
    sales: "PKR 22.8M",
  },
] as const;

export function TopProducts() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Vehicle Segment Share & Sales</CardTitle>
        <div className="flex items-baseline justify-between gap-2">
          <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
            468 Units Booked Today
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
