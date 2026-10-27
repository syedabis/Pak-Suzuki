import { format } from "date-fns";
import { Download, FileSpreadsheet, Sparkles, UserPlus, Users } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CustomerInterceptionForm } from "./_components/customer-interception-form";
import { DailyInquirySheetForm } from "./_components/daily-inquiry-sheet-form";
import { KCarrySurveyForm } from "./_components/k-carry-survey-form";

export const metadata: Metadata = {
  title: "Digital Data Collection Program • Suzuki Express 2026",
  description:
    "Official on-ground data collection portal for Pak Suzuki supervisors: K-Carry survey feedback, visitor interception, and daily event inquiry sheets.",
  alternates: {
    canonical: "/dashboard/data-entry",
  },
};

export default function DataEntryPage() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-3xl tracking-tight">Digital Data Collection Program</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-700 text-xs dark:text-emerald-400">
              Field Supervisor Intake
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {formattedDate} • On-ground data entry for Suzuki Express 2026 (Season 5) authorized by Pak Suzuki Motor
            Company Ltd
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Download className="size-3.5" />
            Download PSMC Blank Formats (.xlsx)
          </Button>
        </div>
      </div>

      <Tabs defaultValue="k-carry-survey" className="flex flex-col gap-5">
        <div className="border-b pb-2">
          <TabsList className="h-10">
            <TabsTrigger value="k-carry-survey" className="text-xs gap-2">
              <Sparkles className="size-3.5 text-primary" />
              1. K-CARRY Customer Survey Form
            </TabsTrigger>
            <TabsTrigger value="visitor-interception" className="text-xs gap-2">
              <UserPlus className="size-3.5" />
              2. Visitor Interception Quick-Logger
            </TabsTrigger>
            <TabsTrigger value="daily-inquiry" className="text-xs gap-2">
              <FileSpreadsheet className="size-3.5" />
              3. Daily Event Master Inquiry Sheet
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="k-carry-survey" className="m-0">
          <KCarrySurveyForm />
        </TabsContent>

        <TabsContent value="visitor-interception" className="m-0">
          <CustomerInterceptionForm />
        </TabsContent>

        <TabsContent value="daily-inquiry" className="m-0">
          <DailyInquirySheetForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
