import { ArrowUpRight, TrendingUp } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const categories = [
  {
    name: "Cooking Oil (38.5%)",
    share: 42,
    color: "var(--chart-3)",
  },
  {
    name: "Banaspati Ghee (31.2%)",
    share: 26,
    color: "var(--chart-2)",
  },
  {
    name: "Canola Oil (22.4%)",
    share: 18,
    color: "var(--chart-1)",
  },
  {
    name: "Sunflower Oil (16.8%)",
    share: 14,
    color: "var(--chart-4)",
  },
] as const;

const products = [
  {
    name: "Meezan Cooking Oil (1L Pouch)",
    category: "Cooking Oil • 2,024 units sold",
    marketShare: "38.5%",
    trend: "+3.8%",
    sales: "Rs. 1,012,000",
  },
  {
    name: "Meezan Banaspati (1kg Pouch)",
    category: "Banaspati Ghee • 1,350 units sold",
    marketShare: "31.2%",
    trend: "+2.4%",
    sales: "Rs. 675,000",
  },
  {
    name: "Meezan Cooking Oil (5L Can)",
    category: "Cooking Oil • 174 cans sold",
    marketShare: "24.6%",
    trend: "+1.9%",
    sales: "Rs. 434,000",
  },
  {
    name: "Meezan Canola Oil (1L Pouch)",
    category: "Canola Oil • 578 units sold",
    marketShare: "19.4%",
    trend: "+4.1%",
    sales: "Rs. 289,000",
  },
  {
    name: "Meezan Sunflower Oil (1L Pouch)",
    category: "Sunflower Oil • 412 units sold",
    marketShare: "16.8%",
    trend: "+2.8%",
    sales: "Rs. 206,000",
  },
] as const;

export function TopProducts() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Product Market Share %</CardTitle>
        <div className="flex items-baseline justify-between gap-2">
          <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
            34.8% Overall Market Share
          </CardDescription>
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600 text-xs dark:text-emerald-400">
            <TrendingUp className="size-3" />
            +4.2% penetration
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
