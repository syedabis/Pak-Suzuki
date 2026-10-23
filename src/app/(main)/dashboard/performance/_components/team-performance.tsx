import { Building2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const teamData = [
  {
    name: "Karachi Metropolitan Cluster",
    lead: "Tariq Farooq (Regional GM)",
    dealerships: 18,
    area: "South Region • Karachi & Hub",
    targetUnits: 140,
    actualUnits: 154,
    revenue: "PKR 608.2M",
    footfall: 5420,
    converted: 780,
    conversion: 14.4,
    topBranch: "Central Motor World",
    status: "Quota Exceeded",
  },
  {
    name: "Lahore City & Cantt Cluster",
    lead: "M. Asif Raza (Regional GM)",
    dealerships: 16,
    area: "Central Region • Lahore & Kasur",
    targetUnits: 120,
    actualUnits: 138,
    revenue: "PKR 545.1M",
    footfall: 4890,
    converted: 760,
    conversion: 15.5,
    topBranch: "Central Motors Gulberg",
    status: "Quota Exceeded",
  },
  {
    name: "Islamabad & Rawalpindi Cluster",
    lead: "Brig. (R) Khalid Nawaz",
    dealerships: 12,
    area: "North Region • Twin Cities & AJK",
    targetUnits: 80,
    actualUnits: 86,
    revenue: "PKR 344.0M",
    footfall: 3120,
    converted: 430,
    conversion: 13.8,
    topBranch: "Capital Motors I-9",
    status: "Quota Exceeded",
  },
  {
    name: "Faisalabad & Central Punjab",
    lead: "Naveed Sial",
    dealerships: 10,
    area: "Central Region • FSD & Sargodha",
    targetUnits: 60,
    actualUnits: 62,
    revenue: "PKR 248.0M",
    footfall: 2450,
    converted: 275,
    conversion: 11.2,
    topBranch: "Faisalabad Motors",
    status: "On Track",
  },
  {
    name: "Multan & Southern Punjab",
    lead: "Shakir Hussain",
    dealerships: 8,
    area: "Central Region • Multan & Bahawalpur",
    targetUnits: 40,
    actualUnits: 42,
    revenue: "PKR 168.0M",
    footfall: 1940,
    converted: 228,
    conversion: 11.8,
    topBranch: "Multan Motors",
    status: "On Track",
  },
  {
    name: "Peshawar & Northern KP",
    lead: "Jan Alam Khan",
    dealerships: 8,
    area: "North Region • Peshawar & Abbottabad",
    targetUnits: 40,
    actualUnits: 38,
    revenue: "PKR 152.0M",
    footfall: 1820,
    converted: 178,
    conversion: 9.8,
    topBranch: "Khyber Motors",
    status: "Near Target",
  },
];

function getQuotaVariant(percent: number): "default" | "secondary" | "outline" {
  if (percent >= 100) return "default";
  if (percent >= 90) return "secondary";
  return "outline";
}

export function TeamPerformanceCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teamData.map((team) => {
        const percentAchieved = Math.round((team.actualUnits / team.targetUnits) * 100);
        return (
          <Card key={team.name} className="flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <CardTitle className="font-semibold text-base">{team.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {team.lead} • {team.dealerships} Dealerships
                  </CardDescription>
                </div>
                <Badge variant={getQuotaVariant(percentAchieved)} className="text-[11px]">
                  {percentAchieved}% Quota
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Vehicle Quota Progress</span>
                  <span className="font-medium tabular-nums">
                    {team.actualUnits} Units / {team.targetUnits} Units
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(percentAchieved, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                <div>
                  <span className="text-muted-foreground">Footfall Converted:</span>
                  <div className="font-semibold text-foreground text-sm tabular-nums">
                    {team.converted} / {team.footfall} ({team.conversion}%)
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Cluster Booking Value:</span>
                  <div className="font-semibold text-foreground text-sm tabular-nums">{team.revenue}</div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="size-3.5" />
                  <span>Top Branch:</span>
                </div>
                <span className="font-medium text-foreground">{team.topBranch}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
