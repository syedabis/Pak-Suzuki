import { Banknote, CheckCircle2, Home, QrCode } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FieldLogsSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Doorstep Visits Logged</CardTitle>
          <Home className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">2,840</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">892 Converted</span> (31.4% conversion)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Total Revenue Collected</CardTitle>
          <CheckCircle2 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">Rs. 2,410,000</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">+15.8%</span> vs quota (4,820 L sold)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Cash In Hand (Vans)</CardTitle>
          <Banknote className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">Rs. 1,410,000</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-foreground">58.5%</span> physical cash collected
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Digital / Raast Payments</CardTitle>
          <QrCode className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">Rs. 1,000,000</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-blue-600 dark:text-blue-400">41.5%</span> instant bank QR settlement
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
