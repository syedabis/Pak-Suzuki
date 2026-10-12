import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const teamData = [
  {
    name: "DHA & Clifton Elite",
    lead: "Salman Farooq",
    agents: 10,
    area: "DHA Phases 1–8 & Clifton Blocks",
    targetLiters: 1000,
    actualLiters: 1120,
    revenue: "Rs. 560,000",
    knocks: 580,
    converted: 213,
    conversion: 36.8,
    topAgent: "Zeeshan Ali (#15)",
    status: "Quota Exceeded",
  },
  {
    name: "Gulshan-e-Iqbal Squad",
    lead: "Tariq Rasheed",
    agents: 8,
    area: "Gulshan Blocks 1–19, University Rd",
    targetLiters: 900,
    actualLiters: 880,
    revenue: "Rs. 440,000",
    knocks: 490,
    converted: 168,
    conversion: 34.2,
    topAgent: "Bilal Khan (#01)",
    status: "On Track",
  },
  {
    name: "North Nazimabad Tigers",
    lead: "Imran Siddiqui",
    agents: 8,
    area: "Blocks A–T, Hyderi Market Sector",
    targetLiters: 800,
    actualLiters: 780,
    revenue: "Rs. 390,000",
    knocks: 460,
    converted: 140,
    conversion: 30.5,
    topAgent: "Kashif Raza (#22)",
    status: "On Track",
  },
  {
    name: "F.B. Area Vanguards",
    lead: "Rehan Qureshi",
    agents: 8,
    area: "Blocks 1–22, Water Pump, Dastagir",
    targetLiters: 750,
    actualLiters: 720,
    revenue: "Rs. 360,000",
    knocks: 450,
    converted: 132,
    conversion: 29.4,
    topAgent: "Shoaib Akhtar (#19)",
    status: "Near Target",
  },
  {
    name: "Gulistan-e-Johar Force",
    lead: "Nasir Abbas",
    agents: 8,
    area: "Blocks 1–20, Pehlwan Goth",
    targetLiters: 750,
    actualLiters: 710,
    revenue: "Rs. 355,000",
    knocks: 440,
    converted: 126,
    conversion: 28.6,
    topAgent: "Hamza Tariq (#08)",
    status: "Near Target",
  },
  {
    name: "PECHS & Saddar Centrals",
    lead: "Waqas Ahmed",
    agents: 8,
    area: "PECHS Blocks 1–6, Tariq Rd, Saddar",
    targetLiters: 700,
    actualLiters: 610,
    revenue: "Rs. 305,000",
    knocks: 420,
    converted: 113,
    conversion: 27.2,
    topAgent: "Owais Siddiqui (#44)",
    status: "Needs Support",
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
        const percentAchieved = Math.round((team.actualLiters / team.targetLiters) * 100);
        return (
          <Card key={team.name} className="flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <CardTitle className="font-semibold text-base">{team.name}</CardTitle>
                  <CardDescription className="text-xs">
                    Lead: {team.lead} • {team.agents} Agents
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
                  <span className="text-muted-foreground">Volume Target Progress</span>
                  <span className="font-medium tabular-nums">
                    {team.actualLiters} L / {team.targetLiters} L
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
                  <span className="text-muted-foreground">Doors Converted:</span>
                  <div className="font-semibold text-foreground text-sm tabular-nums">
                    {team.converted} / {team.knocks} ({team.conversion}%)
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Revenue Generated:</span>
                  <div className="font-semibold text-foreground text-sm tabular-nums">{team.revenue}</div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="size-3.5" />
                  <span>Top Field Rep:</span>
                </div>
                <span className="font-medium text-foreground">{team.topAgent}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
