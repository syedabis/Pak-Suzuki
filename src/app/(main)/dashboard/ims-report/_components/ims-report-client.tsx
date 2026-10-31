"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Filter,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  Users,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IMS_EVENT_DETAIL_ROWS,
  IMS_FREE_CHECKUP_SUMMARY,
  IMS_REGION_CONVERSIONS,
  IMS_SUMMARY_MATRIX,
  IMS_TOTAL_ROW,
  type ImsEventDetailRow,
} from "@/data/suzuki-express/ims-sheet-data";
import { supabase } from "@/lib/supabase";

export function ImsReportClient() {
  const [activeTab, setActiveTab] = useState<string>("event-detail");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cloudSheets, setCloudSheets] = useState<any[]>([]);

  // Fetch live Supabase Daily Master Sheets to overlay real-time data
  useEffect(() => {
    async function fetchCloudSheets() {
      const { data, error } = await supabase
        .from("daily_master_sheets")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setCloudSheets(data);
      }
    }

    fetchCloudSheets();

    const channel = supabase
      .channel("public:daily_master_sheets_ims")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "daily_master_sheets" }, (payload: any) => {
        setCloudSheets((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Merge live cloud sheets with Excel base rows if city matches
  const mergedRows: ImsEventDetailRow[] = useMemo(() => {
    return IMS_EVENT_DETAIL_ROWS.map((row) => {
      const cloudMatch = cloudSheets.find((cs) => cs.city?.trim().toLowerCase() === row.venue?.trim().toLowerCase());
      if (!cloudMatch) return row;

      // Extract 4W metrics from cloud match
      const fourWheelData = cloudMatch.four_wheel_data || {};
      let cloudTd = 0;
      let cloudSalesEnq = 0;
      let cloudConversions = 0;

      if (typeof fourWheelData === "object" && fourWheelData !== null) {
        Object.values(fourWheelData).forEach((item: any) => {
          cloudTd += Number(item?.testDrive) || 0;
          cloudSalesEnq += Number(item?.salesEnquiry) || 0;
          cloudConversions += Number(item?.conversion) || 0;
        });
      }

      return {
        ...row,
        testDriveNo: cloudTd > 0 ? cloudTd : row.testDriveNo,
        salesEnquiry: {
          ...row.salesEnquiry,
          enq: cloudSalesEnq > 0 ? cloudSalesEnq : row.salesEnquiry.enq,
          conversion: cloudConversions > 0 ? cloudConversions : row.salesEnquiry.conversion,
        },
        freeEvaluationNo: Number(cloudMatch.trade_in_evaluations) || row.freeEvaluationNo,
        freeCheckupNo: Number(cloudMatch.free_inspections) || row.freeCheckupNo,
        oilChangeNo: Number(cloudMatch.free_oil_changes) || row.oilChangeNo,
        partsSalesPkr: Number(cloudMatch.genuine_parts_revenue_pkr) || row.partsSalesPkr,
        headCount: Number(cloudMatch.customer_footfall) || row.headCount,
      };
    });
  }, [cloudSheets]);

  // Filtered rows for Tab 1
  const filteredRows = useMemo(() => {
    return mergedRows.filter((r) => {
      const matchesRegion = selectedRegion === "ALL" || r.region.toUpperCase() === selectedRegion.toUpperCase();
      const matchesSearch =
        searchQuery === "" ||
        r.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.dealer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.date.includes(searchQuery);
      return matchesRegion && matchesSearch;
    });
  }, [mergedRows, selectedRegion, searchQuery]);

  // Dynamic Totals based on filtered rows
  const computedTotals = useMemo(() => {
    const sum = {
      testDrive: 0,
      salesEnq: 0,
      salesHot: 0,
      salesWarm: 0,
      salesLost: 0,
      salesCon: 0,
      exchEnq: 0,
      exchHot: 0,
      exchWarm: 0,
      exchLost: 0,
      exchCon: 0,
      usedEnq: 0,
      usedHot: 0,
      usedWarm: 0,
      usedLost: 0,
      usedCon: 0,
      evalNo: 0,
      checkupNo: 0,
      oilNo: 0,
      showroomVis: 0,
      showroomRev: 0,
      finEnq: 0,
      finCon: 0,
      insEnq: 0,
      insCon: 0,
      mcTestRide: 0,
      mcSalesEnq: 0,
      mcSalesHot: 0,
      mcSalesWarm: 0,
      mcSalesLost: 0,
      mcSalesCon: 0,
      partsPkr: 0,
      headCount: 0,
    };

    filteredRows.forEach((r) => {
      sum.testDrive += r.testDriveNo || 0;
      sum.salesEnq += r.salesEnquiry.enq || 0;
      sum.salesHot += r.salesEnquiry.hot || 0;
      sum.salesWarm += r.salesEnquiry.warm || 0;
      sum.salesLost += r.salesEnquiry.lost || 0;
      sum.salesCon += r.salesEnquiry.conversion || 0;
      sum.exchEnq += r.exchangeEnquiry.enq || 0;
      sum.exchHot += r.exchangeEnquiry.hot || 0;
      sum.exchWarm += r.exchangeEnquiry.warm || 0;
      sum.exchLost += r.exchangeEnquiry.lost || 0;
      sum.exchCon += r.exchangeEnquiry.conversion || 0;
      sum.usedEnq += r.usedCarEnquiry.enq || 0;
      sum.usedHot += r.usedCarEnquiry.hot || 0;
      sum.usedWarm += r.usedCarEnquiry.warm || 0;
      sum.usedLost += r.usedCarEnquiry.lost || 0;
      sum.usedCon += r.usedCarEnquiry.conversion || 0;
      sum.evalNo += r.freeEvaluationNo || 0;
      sum.checkupNo += r.freeCheckupNo || 0;
      sum.oilNo += r.oilChangeNo || 0;
      sum.showroomVis += r.showroomServiceVisitors || 0;
      sum.showroomRev += r.showroomServiceRevenue || 0;
      sum.finEnq += r.financing.enquiry || 0;
      sum.finCon += r.financing.conversion || 0;
      sum.insEnq += r.insurance.enquiry || 0;
      sum.insCon += r.insurance.conversion || 0;
      sum.mcTestRide += r.motorcycle.testRide || 0;
      sum.mcSalesEnq += r.motorcycle.salesEnquiry.enquiry || 0;
      sum.mcSalesHot += r.motorcycle.salesEnquiry.hot || 0;
      sum.mcSalesWarm += r.motorcycle.salesEnquiry.warm || 0;
      sum.mcSalesLost += r.motorcycle.salesEnquiry.lost || 0;
      sum.mcSalesCon += r.motorcycle.salesEnquiry.conversion || 0;
      sum.partsPkr += r.partsSalesPkr || 0;
      sum.headCount += r.headCount || 0;
    });

    return sum;
  }, [filteredRows]);

  // Export filtered Event Detail table to CSV
  const handleExportCsv = () => {
    const headers = [
      "Date",
      "Venue",
      "Region",
      "Dealer",
      "Test Drive No",
      "Sales Enq",
      "Sales Hot",
      "Sales Warm",
      "Sales Lost",
      "Sales Con",
      "Exchange Enq",
      "Exchange Hot",
      "Exchange Warm",
      "Exchange Lost",
      "Exchange Con",
      "Used Car Enq",
      "Used Car Hot",
      "Used Car Warm",
      "Used Car Lost",
      "Used Car Con",
      "Free Evaluation",
      "Free Checkup",
      "Oil Change",
      "Service Visitors",
      "Service Revenue PKR",
      "Financing Enq",
      "Financing Con",
      "Insurance Enq",
      "Insurance Con",
      "Motorcycle Test Ride",
      "Motorcycle Sales Enq",
      "Parts Sales PKR",
      "Head Count",
    ];

    const rows = filteredRows.map((r) => [
      `"${r.date}"`,
      `"${r.venue}"`,
      `"${r.region}"`,
      `"${r.dealer}"`,
      r.testDriveNo ?? "",
      r.salesEnquiry.enq ?? "",
      r.salesEnquiry.hot ?? "",
      r.salesEnquiry.warm ?? "",
      r.salesEnquiry.lost ?? "",
      r.salesEnquiry.conversion ?? "",
      r.exchangeEnquiry.enq ?? "",
      r.exchangeEnquiry.hot ?? "",
      r.exchangeEnquiry.warm ?? "",
      r.exchangeEnquiry.lost ?? "",
      r.exchangeEnquiry.conversion ?? "",
      r.usedCarEnquiry.enq ?? "",
      r.usedCarEnquiry.hot ?? "",
      r.usedCarEnquiry.warm ?? "",
      r.usedCarEnquiry.lost ?? "",
      r.usedCarEnquiry.conversion ?? "",
      r.freeEvaluationNo ?? "",
      r.freeCheckupNo ?? "",
      r.oilChangeNo ?? "",
      r.showroomServiceVisitors ?? "",
      r.showroomServiceRevenue ?? "",
      r.financing.enquiry ?? "",
      r.financing.conversion ?? "",
      r.insurance.enquiry ?? "",
      r.insurance.conversion ?? "",
      r.motorcycle.testRide ?? "",
      r.motorcycle.salesEnquiry.enquiry ?? "",
      r.partsSalesPkr ?? "",
      r.headCount ?? "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Suzuki_Express_IMS_Data_Sheet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-[1700px] mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/campaign-overview"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Campaign Overview
            </Link>
            <span className="text-muted-foreground">•</span>
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Live IMS Master Sheet
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <FileSpreadsheet className="h-7 w-7 text-red-600" />
            Suzuki Express IMS Data Sheet
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official Pak Suzuki On-Ground Campaign Report • Master Dealer & Venue-wise Inquiry, Automobile Matrix,
            Services & Footfall Ledger
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5 text-xs font-medium">
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Link href="/dashboard/data-entry">
            <Button size="sm" className="gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white">
              Data Entry Intake
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Footfall / Headcount
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{computedTotals.headCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across {filteredRows.length} tour stops</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              4W Test Drives
            </CardTitle>
            <Car className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{computedTotals.testDrive.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Trials on ground</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              4W Sales Enquiries / Bookings
            </CardTitle>
            <Layers className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {computedTotals.salesEnq} / <span className="text-emerald-600">{computedTotals.salesCon}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Conversion rate:{" "}
              {computedTotals.salesEnq > 0 ? ((computedTotals.salesCon / computedTotals.salesEnq) * 100).toFixed(1) : 0}
              %
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Parts Revenue (PKR)
            </CardTitle>
            <Wrench className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">PKR {computedTotals.partsPkr.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Checkups: {computedTotals.checkupNo} • Oil: {computedTotals.oilNo}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
          <TabsList className="bg-muted/80 p-1">
            <TabsTrigger value="event-detail" className="text-xs gap-1.5 font-medium">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Event Detail (Dealer & Venue wise)
            </TabsTrigger>
            <TabsTrigger value="event-summary" className="text-xs gap-1.5 font-medium">
              <Layers className="h-3.5 w-3.5" />
              Event Summary (Matrix)
            </TabsTrigger>
            <TabsTrigger value="free-checkup" className="text-xs gap-1.5 font-medium">
              <Wrench className="h-3.5 w-3.5" />
              Free Checkup Summary
            </TabsTrigger>
            <TabsTrigger value="region-conversion" className="text-xs gap-1.5 font-medium">
              <Car className="h-3.5 w-3.5" />
              Region Conversion Data
            </TabsTrigger>
          </TabsList>

          {/* Filters for Event Detail */}
          {activeTab === "event-detail" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filter venue or dealer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Regions</SelectItem>
                  <SelectItem value="ROS">ROS (South)</SelectItem>
                  <SelectItem value="ROSP">ROSP (South Punjab)</SelectItem>
                  <SelectItem value="ROCP">ROCP (Central Punjab)</SelectItem>
                  <SelectItem value="RON">RON (North)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* TAB 1: EVENT DETAIL TABLE (Matches Excel Exactly) */}
        <TabsContent value="event-detail" className="space-y-4 m-0">
          <div className="rounded-md border overflow-hidden bg-card">
            <div className="overflow-x-auto max-h-[720px] relative">
              <table className="w-full text-xs border-collapse">
                {/* Level 1 Header */}
                <thead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 shadow-sm">
                  <tr className="border-b text-center font-bold text-slate-800 dark:text-slate-100">
                    <th
                      rowSpan={3}
                      className="sticky left-0 z-30 bg-slate-100 dark:bg-slate-900 border-r border-b px-3 py-2 text-left min-w-[105px]"
                    >
                      Date
                    </th>
                    <th
                      rowSpan={3}
                      className="sticky left-[105px] z-30 bg-slate-100 dark:bg-slate-900 border-r border-b px-3 py-2 text-left min-w-[130px]"
                    >
                      Venue
                    </th>
                    <th rowSpan={3} className="border-r border-b px-2.5 py-2 min-w-[65px]">
                      Region
                    </th>
                    <th rowSpan={3} className="border-r border-b px-3 py-2 text-left min-w-[190px]">
                      Dealer
                    </th>
                    <th
                      colSpan={25}
                      className="border-r border-b px-2 py-1.5 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200"
                    >
                      Automobile (4W)
                    </th>
                    <th
                      colSpan={6}
                      className="border-r border-b px-2 py-1.5 bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200"
                    >
                      Motorcycle (2W)
                    </th>
                    <th
                      rowSpan={2}
                      colSpan={1}
                      className="border-r border-b px-2 py-1.5 bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200"
                    >
                      Spare Parts
                    </th>
                    <th rowSpan={2} colSpan={1} className="border-b px-2 py-1.5 bg-slate-200 dark:bg-slate-800">
                      Head Count
                    </th>
                  </tr>

                  {/* Level 2 Header */}
                  <tr className="border-b text-center font-semibold text-[11px] text-slate-700 dark:text-slate-200">
                    <th
                      rowSpan={2}
                      className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20 min-w-[60px]"
                    >
                      Test Drive
                    </th>
                    <th colSpan={5} className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20">
                      Sales Enquiry
                    </th>
                    <th colSpan={5} className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20">
                      Exchange Enquiry
                    </th>
                    <th colSpan={5} className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20">
                      Used Car Enquiry
                    </th>
                    <th
                      rowSpan={2}
                      className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20 min-w-[55px]"
                    >
                      Free Eval
                    </th>
                    <th
                      rowSpan={2}
                      className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20 min-w-[55px]"
                    >
                      Free Check
                    </th>
                    <th
                      rowSpan={2}
                      className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20 min-w-[55px]"
                    >
                      Oil Change
                    </th>
                    <th
                      rowSpan={2}
                      className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20 min-w-[70px]"
                    >
                      Service Vis
                    </th>
                    <th
                      rowSpan={2}
                      className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20 min-w-[80px]"
                    >
                      Rev (PKR)
                    </th>
                    <th colSpan={2} className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20">
                      Financing
                    </th>
                    <th colSpan={2} className="border-r border-b px-2 py-1 bg-blue-50/50 dark:bg-blue-950/20">
                      Insurance
                    </th>
                    <th
                      rowSpan={2}
                      className="border-r border-b px-2 py-1 bg-amber-50/50 dark:bg-amber-950/20 min-w-[55px]"
                    >
                      Test Ride
                    </th>
                    <th colSpan={5} className="border-r border-b px-2 py-1 bg-amber-50/50 dark:bg-amber-950/20">
                      Sales Enquiry
                    </th>
                  </tr>

                  {/* Level 3 Sub-Headers */}
                  <tr className="border-b text-center text-[10px] text-muted-foreground bg-slate-50 dark:bg-slate-900/90">
                    {/* Sales Enquiry */}
                    <th className="border-r border-b px-1.5 py-1 min-w-[40px]">Enq</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Hot</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Warm</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Lost</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[40px] text-emerald-600 font-bold">Con</th>
                    {/* Exchange Enquiry */}
                    <th className="border-r border-b px-1.5 py-1 min-w-[40px]">Enq</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Hot</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Warm</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Lost</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[40px] text-emerald-600 font-bold">Con</th>
                    {/* Used Car Enquiry */}
                    <th className="border-r border-b px-1.5 py-1 min-w-[40px]">Enq</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Hot</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Warm</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Lost</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[40px] text-emerald-600 font-bold">Con</th>
                    {/* Financing */}
                    <th className="border-r border-b px-1.5 py-1 min-w-[40px]">Enq</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px] text-emerald-600 font-bold">Con</th>
                    {/* Insurance */}
                    <th className="border-r border-b px-1.5 py-1 min-w-[40px]">Enq</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px] text-emerald-600 font-bold">Con</th>
                    {/* Motorcycle Sales Enquiry */}
                    <th className="border-r border-b px-1.5 py-1 min-w-[40px]">Enq</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Hot</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Warm</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[36px]">Lost</th>
                    <th className="border-r border-b px-1.5 py-1 min-w-[40px] text-emerald-600 font-bold">Con</th>
                    {/* Spare parts PKR */}
                    <th className="border-r border-b px-2 py-1 min-w-[85px] text-purple-700 dark:text-purple-300">
                      PKR
                    </th>
                    {/* Head count */}
                    <th className="border-b px-2 py-1 min-w-[50px] font-bold">Total</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y text-slate-700 dark:text-slate-300">
                  {filteredRows.map((r, i) => {
                    const hasCon = (r.salesEnquiry.conversion || 0) > 0;
                    return (
                      <tr
                        key={`${r.venue}-${r.date}-${i}`}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                          hasCon ? "bg-emerald-50/30 dark:bg-emerald-950/10" : ""
                        }`}
                      >
                        {/* Sticky Date & Venue */}
                        <td className="sticky left-0 z-10 bg-card border-r px-3 py-2 text-left font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                          {r.date || "—"}
                        </td>
                        <td className="sticky left-[105px] z-10 bg-card border-r px-3 py-2 text-left font-medium text-foreground whitespace-nowrap">
                          {r.venue}
                        </td>
                        <td className="border-r px-2.5 py-2 text-center text-[10px] font-semibold text-muted-foreground">
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              r.region === "ROS"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : r.region === "ROSP"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                  : r.region === "ROCP"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                    : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            }`}
                          >
                            {r.region}
                          </span>
                        </td>
                        <td
                          className="border-r px-3 py-2 text-left text-[11px] text-muted-foreground truncate max-w-[200px]"
                          title={r.dealer}
                        >
                          {r.dealer}
                        </td>

                        {/* Automobile - Test Drive */}
                        <td className="border-r px-2 py-2 text-center font-medium">{r.testDriveNo ?? "—"}</td>

                        {/* Automobile - Sales Enquiry */}
                        <td className="border-r px-1.5 py-2 text-center">{r.salesEnquiry.enq ?? "—"}</td>
                        <td className="border-r px-1.5 py-2 text-center text-rose-600">{r.salesEnquiry.hot ?? "—"}</td>
                        <td className="border-r px-1.5 py-2 text-center text-amber-600">
                          {r.salesEnquiry.warm ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center text-muted-foreground">
                          {r.salesEnquiry.lost ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center font-bold text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30">
                          {r.salesEnquiry.conversion ?? "—"}
                        </td>

                        {/* Automobile - Exchange Enquiry */}
                        <td className="border-r px-1.5 py-2 text-center">{r.exchangeEnquiry.enq ?? "—"}</td>
                        <td className="border-r px-1.5 py-2 text-center text-rose-600">
                          {r.exchangeEnquiry.hot ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center text-amber-600">
                          {r.exchangeEnquiry.warm ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center text-muted-foreground">
                          {r.exchangeEnquiry.lost ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center font-bold text-emerald-600">
                          {r.exchangeEnquiry.conversion ?? "—"}
                        </td>

                        {/* Automobile - Used Car Enquiry */}
                        <td className="border-r px-1.5 py-2 text-center">{r.usedCarEnquiry.enq ?? "—"}</td>
                        <td className="border-r px-1.5 py-2 text-center text-rose-600">
                          {r.usedCarEnquiry.hot ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center text-amber-600">
                          {r.usedCarEnquiry.warm ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center text-muted-foreground">
                          {r.usedCarEnquiry.lost ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center font-bold text-emerald-600">
                          {r.usedCarEnquiry.conversion ?? "—"}
                        </td>

                        {/* Automobile - Services */}
                        <td className="border-r px-2 py-2 text-center">{r.freeEvaluationNo ?? "—"}</td>
                        <td className="border-r px-2 py-2 text-center">{r.freeCheckupNo ?? "—"}</td>
                        <td className="border-r px-2 py-2 text-center">{r.oilChangeNo ?? "—"}</td>
                        <td className="border-r px-2 py-2 text-center">{r.showroomServiceVisitors ?? "—"}</td>
                        <td className="border-r px-2 py-2 text-right font-mono text-[11px]">
                          {r.showroomServiceRevenue ? r.showroomServiceRevenue.toLocaleString() : "—"}
                        </td>

                        {/* Automobile - Financing & Insurance */}
                        <td className="border-r px-1.5 py-2 text-center">{r.financing.enquiry ?? "—"}</td>
                        <td className="border-r px-1.5 py-2 text-center font-bold text-emerald-600">
                          {r.financing.conversion ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center">{r.insurance.enquiry ?? "—"}</td>
                        <td className="border-r px-1.5 py-2 text-center font-bold text-emerald-600">
                          {r.insurance.conversion ?? "—"}
                        </td>

                        {/* Motorcycle */}
                        <td className="border-r px-2 py-2 text-center">{r.motorcycle.testRide ?? "—"}</td>
                        <td className="border-r px-1.5 py-2 text-center">{r.motorcycle.salesEnquiry.enquiry ?? "—"}</td>
                        <td className="border-r px-1.5 py-2 text-center text-rose-600">
                          {r.motorcycle.salesEnquiry.hot ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center text-amber-600">
                          {r.motorcycle.salesEnquiry.warm ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center text-muted-foreground">
                          {r.motorcycle.salesEnquiry.lost ?? "—"}
                        </td>
                        <td className="border-r px-1.5 py-2 text-center font-bold text-emerald-600">
                          {r.motorcycle.salesEnquiry.conversion ?? "—"}
                        </td>

                        {/* Spare Parts PKR */}
                        <td className="border-r px-2 py-2 text-right font-mono text-[11px] text-purple-700 dark:text-purple-300">
                          {r.partsSalesPkr ? r.partsSalesPkr.toLocaleString() : "—"}
                        </td>

                        {/* Head Count */}
                        <td className="px-2 py-2 text-center font-bold text-foreground">{r.headCount ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Table Footer - TOTAL */}
                <tfoot className="sticky bottom-0 z-20 bg-slate-100 dark:bg-slate-900 font-bold border-t-2 border-slate-300 dark:border-slate-700 shadow-lg">
                  <tr className="text-center text-[11px]">
                    <td
                      colSpan={2}
                      className="sticky left-0 z-30 bg-slate-100 dark:bg-slate-900 border-r px-3 py-2.5 text-left text-xs uppercase tracking-wider font-extrabold text-foreground"
                    >
                      TOTAL ({filteredRows.length} Stops)
                    </td>
                    <td className="border-r px-2 py-2.5">—</td>
                    <td className="border-r px-3 py-2.5 text-left">—</td>

                    <td className="border-r px-2 py-2.5 text-center text-foreground font-extrabold">
                      {computedTotals.testDrive}
                    </td>

                    {/* Sales Enquiry */}
                    <td className="border-r px-1.5 py-2.5 text-center text-foreground">{computedTotals.salesEnq}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-rose-600">{computedTotals.salesHot}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-amber-600">{computedTotals.salesWarm}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-muted-foreground">
                      {computedTotals.salesLost}
                    </td>
                    <td className="border-r px-1.5 py-2.5 text-center text-emerald-600 bg-emerald-100/60 dark:bg-emerald-950/60 font-extrabold">
                      {computedTotals.salesCon}
                    </td>

                    {/* Exchange Enquiry */}
                    <td className="border-r px-1.5 py-2.5 text-center">{computedTotals.exchEnq}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-rose-600">{computedTotals.exchHot}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-amber-600">{computedTotals.exchWarm}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-muted-foreground">
                      {computedTotals.exchLost}
                    </td>
                    <td className="border-r px-1.5 py-2.5 text-center text-emerald-600 font-extrabold">
                      {computedTotals.exchCon}
                    </td>

                    {/* Used Car Enquiry */}
                    <td className="border-r px-1.5 py-2.5 text-center">{computedTotals.usedEnq}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-rose-600">{computedTotals.usedHot}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-amber-600">{computedTotals.usedWarm}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-muted-foreground">
                      {computedTotals.usedLost}
                    </td>
                    <td className="border-r px-1.5 py-2.5 text-center text-emerald-600 font-extrabold">
                      {computedTotals.usedCon}
                    </td>

                    {/* Services */}
                    <td className="border-r px-2 py-2.5 text-center">{computedTotals.evalNo}</td>
                    <td className="border-r px-2 py-2.5 text-center">{computedTotals.checkupNo}</td>
                    <td className="border-r px-2 py-2.5 text-center">{computedTotals.oilNo}</td>
                    <td className="border-r px-2 py-2.5 text-center">{computedTotals.showroomVis}</td>
                    <td className="border-r px-2 py-2.5 text-right font-mono text-[11px]">
                      {computedTotals.showroomRev.toLocaleString()}
                    </td>

                    {/* Financing & Insurance */}
                    <td className="border-r px-1.5 py-2.5 text-center">{computedTotals.finEnq}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-emerald-600 font-extrabold">
                      {computedTotals.finCon}
                    </td>
                    <td className="border-r px-1.5 py-2.5 text-center">{computedTotals.insEnq}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-emerald-600 font-extrabold">
                      {computedTotals.insCon}
                    </td>

                    {/* Motorcycle */}
                    <td className="border-r px-2 py-2.5 text-center">{computedTotals.mcTestRide}</td>
                    <td className="border-r px-1.5 py-2.5 text-center">{computedTotals.mcSalesEnq}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-rose-600">{computedTotals.mcSalesHot}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-amber-600">{computedTotals.mcSalesWarm}</td>
                    <td className="border-r px-1.5 py-2.5 text-center text-muted-foreground">
                      {computedTotals.mcSalesLost}
                    </td>
                    <td className="border-r px-1.5 py-2.5 text-center text-emerald-600 font-extrabold">
                      {computedTotals.mcSalesCon}
                    </td>

                    {/* Spare Parts PKR */}
                    <td className="border-r px-2 py-2.5 text-right font-mono text-[11px] text-purple-700 dark:text-purple-300 font-extrabold">
                      {computedTotals.partsPkr.toLocaleString()}
                    </td>

                    {/* Head Count */}
                    <td className="px-2 py-2.5 text-center font-extrabold text-foreground">
                      {computedTotals.headCount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: EVENT SUMMARY (Matrix) */}
        <TabsContent value="event-summary" className="space-y-4 m-0">
          <div className="rounded-md border overflow-hidden bg-card">
            <div className="p-3 border-b bg-muted/40 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Campaign Cross-City Event Summary Matrix</h3>
                <p className="text-xs text-muted-foreground">
                  Detailed metric comparison across all 41 caravan tour stops
                </p>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[640px]">
              <table className="w-full text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900">
                  <tr className="border-b">
                    <th className="sticky left-0 z-30 bg-slate-100 dark:bg-slate-900 border-r px-3 py-2 text-left font-bold min-w-[200px]">
                      Metric / Detail
                    </th>
                    {IMS_SUMMARY_MATRIX.venues.map((venue, idx) => (
                      <th
                        key={`${venue}-${idx}`}
                        className="border-r px-3 py-2 text-center min-w-[110px] font-semibold text-[11px]"
                      >
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {IMS_SUMMARY_MATRIX.dates[idx] || ""}
                        </div>
                        <div className="truncate max-w-[100px]" title={venue}>
                          {venue}
                        </div>
                        <span className="inline-block px-1 text-[9px] rounded bg-slate-200 dark:bg-slate-800 text-muted-foreground mt-0.5">
                          {IMS_SUMMARY_MATRIX.regions[idx] || "ROS"}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 dark:text-slate-300">
                  {IMS_SUMMARY_MATRIX.metrics.map((m, mIdx) => {
                    const isTotal = m.metric.toUpperCase().includes("TOTAL");
                    return (
                      <tr
                        key={m.metric}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                          isTotal ? "bg-slate-100 dark:bg-slate-900 font-bold" : ""
                        }`}
                      >
                        <td className="sticky left-0 z-10 bg-card border-r px-3 py-2 font-medium text-foreground whitespace-nowrap">
                          {m.metric}
                        </td>
                        {m.values.map((val, vIdx) => (
                          <td
                            key={`${m.metric}-${vIdx}`}
                            className={`border-r px-2 py-2 text-center ${
                              val && val > 0 ? "font-semibold text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {val !== null && val !== undefined ? val : "—"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: FREE CHECKUP SUMMARY */}
        <TabsContent value="free-checkup" className="space-y-4 m-0">
          <div className="rounded-md border overflow-hidden bg-card">
            <div className="p-3 border-b bg-muted/40">
              <h3 className="text-sm font-semibold text-foreground">Free Check-up Summary by Vehicle Model</h3>
              <p className="text-xs text-muted-foreground">
                Model-wise distribution of complimentary inspections across caravan tour locations
              </p>
            </div>
            <div className="overflow-x-auto max-h-[640px]">
              <table className="w-full text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900">
                  <tr className="border-b">
                    <th className="sticky left-0 z-30 bg-slate-100 dark:bg-slate-900 border-r px-3 py-2 text-left font-bold min-w-[140px]">
                      Vehicle Model
                    </th>
                    {IMS_FREE_CHECKUP_SUMMARY.venues.map((v, idx) => (
                      <th
                        key={`${v}-${idx}`}
                        className="border-r px-2.5 py-2 text-center min-w-[95px] font-semibold text-[11px]"
                      >
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {IMS_FREE_CHECKUP_SUMMARY.dates[idx] || ""}
                        </div>
                        <div className="truncate max-w-[90px]" title={v}>
                          {v}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {IMS_FREE_CHECKUP_SUMMARY.models.map((mod) => {
                    const isTotal = mod.model.toLowerCase() === "total";
                    return (
                      <tr
                        key={mod.model}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                          isTotal ? "bg-slate-100 dark:bg-slate-900 font-extrabold text-foreground" : ""
                        }`}
                      >
                        <td className="sticky left-0 z-10 bg-card border-r px-3 py-2 font-medium text-foreground whitespace-nowrap">
                          {mod.model}
                        </td>
                        {mod.counts.map((cnt, cIdx) => (
                          <td
                            key={`${mod.model}-${cIdx}`}
                            className={`border-r px-2 py-2 text-center ${
                              cnt > 0 ? "font-semibold text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {cnt || 0}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: REGION CONVERSION DATA */}
        <TabsContent value="region-conversion" className="space-y-4 m-0">
          <div className="rounded-md border overflow-hidden bg-card">
            <div className="p-3 border-b bg-muted/40">
              <h3 className="text-sm font-semibold text-foreground">Region Conversion Records</h3>
              <p className="text-xs text-muted-foreground">
                Dealership on-spot booked unit logs across New Car Sales, Exchange, and Certified Used Cars
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b">
                  <tr className="font-semibold text-left">
                    <th className="px-3 py-2.5 border-r">Date</th>
                    <th className="px-3 py-2.5 border-r">Venue</th>
                    <th className="px-2.5 py-2.5 border-r text-center">Region</th>
                    <th className="px-3 py-2.5 border-r">Dealer</th>
                    <th className="px-3 py-2.5 border-r bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200">
                      New Car Sales
                    </th>
                    <th className="px-3 py-2.5 border-r bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200">
                      Exchange
                    </th>
                    <th className="px-3 py-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200">
                      Used Car
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {IMS_REGION_CONVERSIONS.map((rc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2.5 border-r font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {rc.date}
                      </td>
                      <td className="px-3 py-2.5 border-r font-medium text-foreground">{rc.venue}</td>
                      <td className="px-2.5 py-2.5 border-r text-center font-semibold text-muted-foreground">
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px]">
                          {rc.region}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 border-r text-muted-foreground">{rc.dealer}</td>
                      <td className="px-3 py-2.5 border-r font-bold text-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/10">
                        {rc.newCarSales || "—"}
                      </td>
                      <td className="px-3 py-2.5 border-r font-bold text-blue-600 bg-blue-50/30 dark:bg-blue-950/10">
                        {rc.exchange || "—"}
                      </td>
                      <td className="px-3 py-2.5 font-bold text-amber-600 bg-amber-50/30 dark:bg-amber-950/10">
                        {rc.usedCar || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
