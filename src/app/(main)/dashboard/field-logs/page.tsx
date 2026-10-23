import Link from "next/link";

import { format } from "date-fns";
import { ArrowLeft, Download, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { FieldLogsSummary } from "./_components/field-logs-summary";
import { FieldLogsTable } from "./_components/field-logs-table";

export const metadata: Metadata = {
  title: "Mega Gala & Expo Activity Logs • Pak Suzuki",
  description:
    "Real-time stream of attendee check-ins, 130-point vehicle inspections, test drive dispatches, and on-spot bookings across Suzuki Mega Galas.",
  alternates: {
    canonical: "/dashboard/field-logs",
  },
};

export default function FieldLogsPage() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Button asChild size="icon-xs" variant="ghost">
              <Link href="/dashboard/ecommerce" title="Back to Main Overview">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="font-semibold text-3xl tracking-tight">Mega Gala & Expo Activity Logs</h1>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-700 text-xs dark:text-emerald-400">
              Live Feed
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {formattedDate} • Detailed transaction logs, 130-pt inspection tokens & bank financing recorded across expo
            halls
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Select defaultValue="all-venues">
            <SelectTrigger className="w-52" id="log-territory" size="sm">
              <SelectValue placeholder="All Expo Venues" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-venues">All Expo Venues (National)</SelectItem>
                <SelectItem value="expo-karachi">Expo Centre Karachi (Halls 1-3)</SelectItem>
                <SelectItem value="expo-lahore">Expo Centre Lahore (Halls 1-2)</SelectItem>
                <SelectItem value="pak-china-isb">Pak-China Centre (Islamabad)</SelectItem>
                <SelectItem value="peshawar-arena">Peshawar Sports Arena</SelectItem>
                <SelectItem value="multan-complex">Multan Stadium Complex</SelectItem>
                <SelectItem value="faisalabad-club">Faisalabad Club Ground</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="today">
            <SelectTrigger className="w-36" id="log-shift" size="sm">
              <SelectValue placeholder="Today's Shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Today (Day 2 Live)</SelectItem>
                <SelectItem value="yesterday">Day 1 (Inauguration)</SelectItem>
                <SelectItem value="weekend">Full Gala Weekend</SelectItem>
                <SelectItem value="last-expo">Previous Expo (Lahore)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          <Button size="icon-sm" variant="outline" title="Export Full Report">
            <Download className="size-4" />
          </Button>
          <Button size="icon-sm" variant="outline" title="Filter Settings">
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <FieldLogsSummary />

      <FieldLogsTable />
    </div>
  );
}
