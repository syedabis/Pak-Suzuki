import { Ellipsis, Globe } from "lucide-react";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CountryReach {
  country: string;
  code: string;
  reach: string;
  percentage: number;
}

const countries: CountryReach[] = [
  { country: "United States", code: "us", reach: "640.2k", percentage: 38 },
  { country: "United Kingdom", code: "gb", reach: "310.5k", percentage: 18 },
  { country: "Germany", code: "de", reach: "240.1k", percentage: 14 },
  { country: "India", code: "in", reach: "190.4k", percentage: 11 },
  { country: "Canada", code: "ca", reach: "140.0k", percentage: 8 },
];

export function AudienceDemographics() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-muted-foreground" />
            <CardTitle className="font-normal text-base">Top Geographic Audience Reach</CardTitle>
          </div>
          <CardAction>
            <Ellipsis className="size-4 text-muted-foreground" />
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {countries.map((c) => (
          <div key={c.code} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`fi fi-${c.code} rounded-xs`} />
                <span className="font-medium text-foreground">{c.country}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{c.reach} reach</span>
                <span>•</span>
                <span className="font-semibold text-foreground">{c.percentage}%</span>
              </div>
            </div>
            <Progress value={c.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
