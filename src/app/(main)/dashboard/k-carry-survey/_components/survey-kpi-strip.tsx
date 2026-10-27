import { BadgeCheck, Flame, Tag, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { K_CARRY_SURVEY_DATA } from "@/data/suzuki-express/k-carry-survey-data";

export function SurveyKpiStrip() {
  const totalResponses = K_CARRY_SURVEY_DATA.length;
  const raviYesCount = K_CARRY_SURVEY_DATA.filter((r) => r.suitableReplacementForRavi === "Yes").length;
  const raviYesPercent = Math.round((raviYesCount / totalResponses) * 100);

  const hotLeads = K_CARRY_SURVEY_DATA.filter((r) => r.leadStatus === "Hot").length;
  const warmLeads = K_CARRY_SURVEY_DATA.filter((r) => r.leadStatus === "Warm").length;

  const price22to24Count = K_CARRY_SURVEY_DATA.filter((r) => r.reasonablePriceRange === "PKR 22–24 lakh").length;
  const price22to24Percent = Math.round((price22to24Count / totalResponses) * 100);

  const intentYesCount = K_CARRY_SURVEY_DATA.filter((r) => r.wouldConsiderBuying === "Definitely Yes").length;
  const intentYesPercent = Math.round((intentYesCount / totalResponses) * 100);

  const kpis = [
    {
      title: "Total Survey Responses",
      value: totalResponses.toString(),
      subtext: "Across 6 completed tour stops in ROS",
      badge: "+18 today",
      icon: Users,
    },
    {
      title: "Ravi Replacement Approval",
      value: `${raviYesPercent}%`,
      subtext: `${raviYesCount} respondents endorse K-CARRY`,
      badge: "Strong endorsement",
      icon: BadgeCheck,
    },
    {
      title: "Target Price Band Preference",
      value: "PKR 22–24L",
      subtext: `${price22to24Percent}% chose this optimal range`,
      badge: "Sweet spot",
      icon: Tag,
    },
    {
      title: "Commercial Leads Pipeline",
      value: `${hotLeads} Hot`,
      subtext: `${warmLeads} Warm • Ready for dealer contact`,
      badge: `${intentYesPercent}% Buy Intent`,
      icon: Flame,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title} className="shadow-xs">
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs">{kpi.title}</span>
                <span className="rounded-full bg-primary/10 p-1.5 text-primary">
                  <Icon className="size-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-2xl tracking-tight">{kpi.value}</span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground">
                  {kpi.badge}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">{kpi.subtext}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
