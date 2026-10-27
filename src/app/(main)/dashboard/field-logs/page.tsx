import Link from "next/link";

import { ArrowLeft, Download, SlidersHorizontal, Sparkles } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { FieldLogsSummary } from "./_components/field-logs-summary";
import { FieldLogsTable } from "./_components/field-logs-table";
import { InquiryAnalyticsCharts } from "./_components/inquiry-analytics-charts";

export const metadata: Metadata = {
  title: "Inquiry Sheets • Suzuki Express 2026",
  description:
    "Official on-ground daily event master inquiry sheets recorded across 15 tour locations, participating 3S dealerships, and field supervisors.",
  alternates: {
    canonical: "/dashboard/field-logs",
  },
};

export default function FieldLogsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Button asChild size="icon-xs" variant="ghost">
            <Link href="/dashboard/ecommerce" title="Back to Campaign Overview">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="font-semibold text-3xl tracking-tight">Inquiry Sheets</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-700 text-xs dark:text-emerald-400">
            <Sparkles className="size-3" /> Season 5 Field Intake
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Select defaultValue="all-venues">
            <SelectTrigger className="w-56" id="log-territory" size="sm">
              <SelectValue placeholder="Tour Stop / City" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-venues">All 15 Tour Cities (ROS &amp; ROSP)</SelectItem>
                <SelectItem value="umerkot">Stop 1: Umerkot (ROS)</SelectItem>
                <SelectItem value="badin">Stop 2: Badin (ROS)</SelectItem>
                <SelectItem value="tmk">Stop 3: Tando M. Khan (ROS)</SelectItem>
                <SelectItem value="jamshoro">Stop 4: Jamshoro (ROS)</SelectItem>
                <SelectItem value="khairpur">Stop 5: Khairpur (ROS)</SelectItem>
                <SelectItem value="usta-muhammad">Stop 6: Usta Muhammad (Active)</SelectItem>
                <SelectItem value="mirpur">Stop 7: Mirpur Mathelo (ROS)</SelectItem>
                <SelectItem value="feroza">Stop 8: Feroza (ROSP)</SelectItem>
                <SelectItem value="yazman">Stop 9: Yazman (ROSP)</SelectItem>
                <SelectItem value="jatoi">Stop 10: Jatoi (ROSP)</SelectItem>
                <SelectItem value="duniyapur">Stop 11: Duniyapur (ROSP)</SelectItem>
                <SelectItem value="mailsi">Stop 12: Mailsi (ROSP)</SelectItem>
                <SelectItem value="hasilpur">Stop 13: Hasilpur (ROSP)</SelectItem>
                <SelectItem value="haroonabad">Stop 14: Haroonabad (ROSP)</SelectItem>
                <SelectItem value="arifwala">Stop 15: Arifwala (ROSP)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          <Button size="icon-sm" variant="outline" title="Export Full Master Sheet (.xlsx)">
            <Download className="size-4" />
          </Button>
          <Button size="icon-sm" variant="outline" title="Filter Settings">
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <FieldLogsSummary />

      <InquiryAnalyticsCharts />

      <FieldLogsTable />
    </div>
  );
}
