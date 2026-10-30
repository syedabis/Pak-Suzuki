"use client";

import { useMemo, useState, useEffect } from "react";

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
import type { DailyInquirySheetRecord } from "@/data/suzuki-express/types";
import { supabase } from "@/lib/supabase";

import { FieldLogsSummary } from "./field-logs-summary";
import { FieldLogsTable } from "./field-logs-table";
import { InquiryAnalyticsCharts } from "./inquiry-analytics-charts";

export function FieldLogsClient() {
  const [selectedCity, setSelectedCity] = useState<string>("all-venues");
  const [cloudMasterSheets, setCloudMasterSheets] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCloudSheets() {
      const { data, error } = await supabase
        .from("daily_master_sheets")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setCloudMasterSheets(data);
      }
    }

    fetchCloudSheets();

    const channel = supabase
      .channel("public:daily_master_sheets_client")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "daily_master_sheets" }, (payload: any) => {
        setCloudMasterSheets((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Map Supabase rows to typed DailyInquirySheetRecord with fallback
  const liveRecords: DailyInquirySheetRecord[] = useMemo(() => {
    if (!cloudMasterSheets || cloudMasterSheets.length === 0) {
      return DAILY_INQUIRY_RECORDS;
    }

    return cloudMasterSheets.map((row, index) => {
      let fourWheelers: any[] = [];
      if (Array.isArray(row.four_wheel_data)) {
        fourWheelers = row.four_wheel_data;
      } else if (row.four_wheel_data && typeof row.four_wheel_data === "object") {
        fourWheelers = Object.entries(row.four_wheel_data).map(([model, metrics]: [string, any]) => ({
          model,
          testDrive: metrics?.testDrive || 0,
          salesEnquiry: metrics?.salesEnquiry || 0,
          exchangeEnquiry: metrics?.exchangeEnquiry || 0,
          usedCarEnquiry: metrics?.usedCarEnquiry || 0,
          freeEvaluation: metrics?.freeEvaluation || 0,
          financing: metrics?.financing || 0,
          insurance: metrics?.insurance || 0,
          conversion: metrics?.conversion || 0,
        }));
      }
      return {
        id: row.client_id || row.id,
        serialNo: index + 1,
        city: row.city,
        eventDate: row.event_date,
        venue: row.venue,
        participatingDealer: row.dealer,
        timings: row.timings || "09:00 to 17:30",
        supervisorOG: row.supervisor_og || "On-Ground Lead",
        supervisorPS: row.supervisor_ps || "Area Manager",
        region: row.region || "ROS",
        customerFootfall: Number(row.customer_footfall) || 0,
        fourWheelers:
          fourWheelers.length > 0
            ? fourWheelers
            : [
                {
                  model: "Every",
                  testDrive: Number(row.every_test_drives) || 0,
                  salesEnquiry: 15,
                  exchangeEnquiry: 3,
                  usedCarEnquiry: 2,
                  freeEvaluation: 5,
                  financing: 3,
                  insurance: 3,
                  conversion: 1,
                },
                {
                  model: "K-Carry",
                  testDrive: Number(row.k_carry_test_drives) || 0,
                  salesEnquiry: 20,
                  exchangeEnquiry: 9,
                  usedCarEnquiry: 0,
                  freeEvaluation: 19,
                  financing: 6,
                  insurance: 5,
                  conversion: 2,
                },
              ],
        twoWheelers: [],
        aftersales: {
          oilChangesTotal: Number(row.free_oil_changes) || 0,
          oilChangesBreakdown: [],
          freeCheckupsTotal: Number(row.free_inspections) || 0,
          nextAppointmentsTotal: Number(row.appointments_given) || 0,
          partsSalesPkr: Number(row.genuine_parts_revenue_pkr) || 0,
          serviceRevenuePkr: Number(row.genuine_parts_revenue_pkr) * 2 || 0,
        },
        vendorEvaluation: {
          sales: row.dealer_rating || "Good",
          aftersales: row.dealer_rating || "Good",
          usedCar: "Good",
        },
        observation: row.supervisor_notes || "",
      };
    });
  }, [cloudMasterSheets]);

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
        ? liveRecords
        : liveRecords.filter((r) => r.city.toLowerCase() === selectedCity.toLowerCase());

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
      <FieldLogsSummary selectedCity={selectedCity} records={liveRecords} />

      {/* Dynamic Model & Variant Analytics */}
      <InquiryAnalyticsCharts
        selectedCity={selectedCity}
        records={liveRecords}
        onResetCity={() => setSelectedCity("all-venues")}
      />

      {/* Interactive Master Table */}
      <FieldLogsTable selectedCity={selectedCity} records={liveRecords} onCityChange={setSelectedCity} />
    </div>
  );
}
