import { Banknote, CheckCircle2, ShieldCheck, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FieldLogsSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Total Gate Footfall Logged</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">19,850</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">4,320 Registered</span> (21.8% buyer
            intent)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">On-Spot Booking Value</CardTitle>
          <CheckCircle2 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">PKR 384.5M</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">142 Units Booked</span> (+18.4% vs expo
            target)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">130-Point Inspected Units</CardTitle>
          <ShieldCheck className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">214 Inspected</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-foreground">188 Certified</span> (87.9% certification pass rate)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-normal text-muted-foreground text-sm">Bank Financing Leases Initiated</CardTitle>
          <Banknote className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl tabular-nums">PKR 218.0M</div>
          <p className="text-muted-foreground text-xs">
            <span className="font-medium text-blue-600 dark:text-blue-400">86 Approvals</span> (Meezan & Alfalah Booths)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
