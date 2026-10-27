import { ArrowUpRight, Truck } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const categories = [
  {
    name: "Commercial Pickups (K-Carry)",
    share: 44,
    color: "var(--primary)",
  },
  {
    name: "Economy Rural (Alto 660cc)",
    share: 28,
    color: "var(--chart-2)",
  },
  {
    name: "Utility MPV (Suzuki Every)",
    share: 16,
    color: "var(--chart-3)",
  },
  {
    name: "Rural 2W Fleet (GD & GS)",
    share: 12,
    color: "var(--chart-4)",
  },
] as const;

const products = [
  {
    name: "Suzuki K-CARRY (Ravi Successor)",
    category: "Commercial Pickup • 435 Inquiries",
    marketShare: "44.2%",
    trend: "+42.0%",
    sales: "22 Bookings",
  },
  {
    name: "Suzuki Alto 660cc (VXR/VXL)",
    category: "Rural Economy • 280 Inquiries",
    marketShare: "28.5%",
    trend: "+12.4%",
    sales: "14 Bookings",
  },
  {
    name: "Suzuki Every (VX / VXR)",
    category: "Rural Multi-Utility MPV • 155 Inquiries",
    marketShare: "15.8%",
    trend: "+18.2%",
    sales: "8 Bookings",
  },
  {
    name: "Suzuki GD 110S & GS 150",
    category: "2W Rural Fleet • 114 Inquiries",
    marketShare: "11.5%",
    trend: "+9.5%",
    sales: "4 Bookings",
  },
] as const;

export function TopProducts() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm flex items-center gap-1.5">
          <Truck className="size-4 text-primary" />
          Campaign Vehicle Demand Mix
        </CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          984 Inquiries &amp; 48 Event Bookings
        </CardDescription>
        <CardAction className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          +24.6% vs Target
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full gap-1">
            {categories.map((category) => (
              <div
                key={category.name}
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${category.share}%`,
                  backgroundColor: category.color,
                }}
              />
            ))}
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                <span className="truncate">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Model Variant</span>
            <span>Demand Share</span>
          </div>

          <div className="space-y-2.5">
            {products.map((product) => (
              <div key={product.name} className="flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-foreground">{product.name}</div>
                  <div className="text-[11px] text-muted-foreground">{product.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-foreground">{product.marketShare}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{product.sales}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
