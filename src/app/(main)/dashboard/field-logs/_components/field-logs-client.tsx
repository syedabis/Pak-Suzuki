"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { ArrowLeft, Download, FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAILY_INQUIRY_RECORDS } from "@/data/suzuki-express/daily-inquiry-data";
import { PHASE_1_CITIES, PHASE_2_CITIES, TOUR_CITIES } from "@/data/suzuki-express/tour-schedule";

import { FieldLogsSummary } from "./field-logs-summary";
import { FieldLogsTable } from "./field-logs-table";
import { InquiryAnalyticsCharts } from "./inquiry-analytics-charts";

export function FieldLogsClient() {
  const [selectedCity, setSelectedCity] = useState<string>("all-venues");

  const handleExportAll = () => {
    const headers = [
      "ID",
      "City",
      "Region",
      "Date",
      "Venue",
      "Dealer",
      "OG Supervisor",
      "PS Supervisor",
      "Footfall",
      "Test Drives",
      "Sales Inquiries",
      "Conversions",
      "Free Checkups",
      "Oil Changes",
      "Parts Sales PKR",
    ];

    const recordsToExport =
      selectedCity === "all-venues" || selectedCity === "all-38"
        ? DAILY_INQUIRY_RECORDS
        : DAILY_INQUIRY_RECORDS.filter((r) => r.city.toLowerCase() === selectedCity.toLowerCase());

    const rows = recordsToExport.map((r) => {
      const testDrives = r.fourWheelers.reduce((sum, item) => sum + item.testDrive, 0);
      const inquiries = r.fourWheelers.reduce((sum, item) => sum + item.salesEnquiry, 0);
      const conversions = r.fourWheelers.reduce((sum, item) => sum + item.conversion, 0);

      return [
        r.id,
        r.city,
        r.region,
        r.eventDate,
        `"${r.venue.replace(/"/g, '""')}"`,
        `"${r.participatingDealer.replace(/"/g, '""')}"`,
        `"${r.supervisorOG}"`,
        `"${r.supervisorPS}"`,
        r.customerFootfall,
        testDrives,
        inquiries,
        conversions,
        r.aftersales.freeCheckupsTotal,
        r.aftersales.oilChangesTotal,
        r.aftersales.partsSalesPkr,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Suzuki_Express_Inquiry_Sheets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Streamlined Header Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <Button asChild size="icon-xs" variant="ghost">
            <Link href="/dashboard/campaign-overview" title="Back to Campaign Overview">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-primary" />
            <h1 className="font-semibold text-3xl tracking-tight">Inquiry Sheets</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2.5">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-64" id="log-territory" size="sm">
              <SelectValue placeholder="Filter by Tour City" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectGroup>
                <SelectItem value="all-venues" className="font-semibold">
                  Phase 1: 15 Cities (ROS &amp; ROSP)
                </SelectItem>
                <SelectItem value="all-38" className="font-semibold">
                  All 38 Tour Cities (Nationwide Route)
                </SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 mt-1">
                  Phase 1 Tour Stops (Active &amp; Completed)
                </SelectLabel>
                {PHASE_1_CITIES.map((c) => (
                  <SelectItem key={`p1-${c.serialNo}-${c.city}`} value={c.city}>
                    #{c.serialNo} {c.city} ({c.region}) {c.status === "active" ? "• Live" : ""}
                  </SelectItem>
                ))}
              </SelectGroup>

              <SelectGroup>
                <SelectLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 mt-1">
                  Phase 2 Tour Stops (Post-Eid Schedule)
                </SelectLabel>
                {PHASE_2_CITIES.map((c) => (
                  <SelectItem key={`p2-${c.serialNo}-${c.city}`} value={c.city}>
                    #{c.serialNo} {c.city} ({c.region})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportAll}
            className="text-xs flex items-center gap-1.5"
            title="Export Master Inquiry Records (.csv)"
          >
            <Download className="size-3.5" />
            Export Records
          </Button>
        </div>
      </div>

      {/* Dynamic Summary Strip */}
      <FieldLogsSummary selectedCity={selectedCity} />

      {/* Dynamic Model & Variant Analytics */}
      <InquiryAnalyticsCharts selectedCity={selectedCity} onResetCity={() => setSelectedCity("all-venues")} />

      {/* Interactive Master Table */}
      <FieldLogsTable selectedCity={selectedCity} onCityChange={setSelectedCity} />
    </div>
  );
}
