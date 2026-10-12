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
  title: "Door-to-Door Sales & Visit Logs • Meezan Oil",
  description:
    "Complete log of doorstep sales, consumer surveys, SKU deliveries, and payment settlements from 50 field agents.",
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
            <h1 className="font-semibold text-3xl tracking-tight">Door-to-Door Sales & Visit Logs</h1>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-700 text-xs dark:text-emerald-400">
              Live Feed
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {formattedDate} • Detailed transaction logs & survey questionnaires recorded by 50 field agents
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Select defaultValue="all-territories">
            <SelectTrigger className="w-44" id="log-territory" size="sm">
              <SelectValue placeholder="All Territories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-territories">All Areas (50 Agents)</SelectItem>
                <SelectItem value="gulshan">Gulshan-e-Iqbal</SelectItem>
                <SelectItem value="dha-clifton">DHA & Clifton</SelectItem>
                <SelectItem value="north-nazimabad">North Nazimabad</SelectItem>
                <SelectItem value="johar">Gulistan-e-Johar</SelectItem>
                <SelectItem value="fb-area">F.B. Area</SelectItem>
                <SelectItem value="pechs">PECHS & Saddar</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="today">
            <SelectTrigger className="w-32" id="log-shift" size="sm">
              <SelectValue placeholder="Today's Shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
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
