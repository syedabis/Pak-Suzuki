"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Flame, Tag, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { K_CARRY_SURVEY_DATA } from "@/data/suzuki-express/k-carry-survey-data";
import { supabase } from "@/lib/supabase";

export function SurveyKpiStrip() {
  const [surveys, setSurveys] = useState<any[]>(K_CARRY_SURVEY_DATA);

  useEffect(() => {
    async function loadCloudSurveys() {
      const { data, error } = await supabase
        .from("k_carry_surveys")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setSurveys(data);
      }
    }

    loadCloudSurveys();

    const channel = supabase
      .channel("public:k_carry_surveys_kpi")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "k_carry_surveys" }, (payload: any) => {
        setSurveys((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalResponses = surveys.length;
  const raviYesCount = surveys.filter(
    (r) => r.suitable_replacement_for_ravi === "Yes" || r.suitableReplacementForRavi === "Yes",
  ).length;
  const raviYesPercent = totalResponses > 0 ? Math.round((raviYesCount / totalResponses) * 100) : 0;

  const hotLeads = surveys.filter((r) => r.lead_status === "Hot" || r.leadStatus === "Hot").length;
  const warmLeads = surveys.filter((r) => r.lead_status === "Warm" || r.leadStatus === "Warm").length;

  const price22to24Count = surveys.filter(
    (r) =>
      r.reasonable_price_range === "PKR 22–24 lakh" ||
      r.reasonablePriceRange === "PKR 22–24 lakh" ||
      r.reasonable_price_range?.includes("22"),
  ).length;
  const price22to24Percent = totalResponses > 0 ? Math.round((price22to24Count / totalResponses) * 100) : 0;

  const intentYesCount = surveys.filter(
    (r) => r.would_consider_buying === "Definitely Yes" || r.wouldConsiderBuying === "Definitely Yes",
  ).length;
  const intentYesPercent = totalResponses > 0 ? Math.round((intentYesCount / totalResponses) * 100) : 0;

  const kpis = [
    {
      title: "Total Survey Responses",
      value: totalResponses.toString(),
      subtext: "Live from Supabase Cloud DB",
      badge: "+Live Sync",
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
