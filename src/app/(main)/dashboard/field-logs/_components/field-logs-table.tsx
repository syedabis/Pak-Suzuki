"use client";

import { useMemo, useState } from "react";

import {
  ArrowUpDown,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  FileSpreadsheet,
  MapPin,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DAILY_INQUIRY_RECORDS } from "@/data/suzuki-express/daily-inquiry-data";
import type { DailyInquirySheetRecord } from "@/data/suzuki-express/types";

import { InquirySheetModal } from "./inquiry-sheet-modal";

interface FieldLogsTableProps {
  readonly selectedCity?: string;
  readonly onCityChange?: (city: string) => void;
}

export function FieldLogsTable({ selectedCity = "all-venues" }: FieldLogsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [supervisorFilter, setSupervisorFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"date" | "footfall" | "revenue">("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [selectedSheet, setSelectedSheet] = useState<DailyInquirySheetRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Extract unique supervisors
  const supervisors = useMemo(() => {
    const list = new Set<string>();
    for (const r of DAILY_INQUIRY_RECORDS) {
      if (r.supervisorOG) list.add(r.supervisorOG);
      if (r.supervisorPS) list.add(r.supervisorPS);
    }
    return Array.from(list).sort();
  }, []);

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    const isCityFiltered = selectedCity !== "all-venues" && selectedCity !== "all-38";

    return DAILY_INQUIRY_RECORDS.filter((r) => {
      const matchesCity = !isCityFiltered || r.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesRegion = regionFilter === "all" || r.region === regionFilter;
      const matchesSupervisor =
        supervisorFilter === "all" || r.supervisorOG === supervisorFilter || r.supervisorPS === supervisorFilter;
      const matchesSearch =
        searchTerm === "" ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.participatingDealer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.supervisorOG.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.supervisorPS.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCity && matchesRegion && matchesSupervisor && matchesSearch;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = a.eventDate.localeCompare(b.eventDate);
      } else if (sortField === "footfall") {
        comparison = a.customerFootfall - b.customerFootfall;
      } else if (sortField === "revenue") {
        comparison = a.aftersales.partsSalesPkr - b.aftersales.partsSalesPkr;
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [selectedCity, regionFilter, supervisorFilter, searchTerm, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRowClick = (record: DailyInquirySheetRecord) => {
    setSelectedSheet(record);
    setModalOpen(true);
  };

  const handleExportCSV = () => {
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
      "4W Test Drives",
      "4W Sales Inquiries",
      "4W Conversions",
      "Free Checkups",
      "Oil Changes",
      "Parts Sales PKR",
    ];

    const rows = filteredRecords.map((r) => {
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
    link.setAttribute("download", `Suzuki_Express_Master_Inquiry_Sheets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card className="shadow-xs">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-primary" />
                <CardTitle className="font-semibold text-lg">Inquiry Sheet Ledger</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Daily event reporting sheets across all tour locations, dealers, and field supervisors
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
                <Input
                  className="pl-8 text-xs h-8"
                  placeholder="Search city, venue, dealer, supervisor..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <Select
                value={regionFilter}
                onValueChange={(val) => {
                  setRegionFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-28 text-xs">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="ROS">ROS (Sindh)</SelectItem>
                  <SelectItem value="ROSP">ROSP (Punjab)</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={supervisorFilter}
                onValueChange={(val) => {
                  setSupervisorFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-36 text-xs truncate">
                  <SelectValue placeholder="Supervisor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Supervisors</SelectItem>
                  {supervisors.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={handleExportCSV}>
                <Download className="size-3.5" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="text-xs">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-28">Sheet ID &amp; Date</TableHead>
                  <TableHead className="w-48">Tour Stop &amp; Venue</TableHead>
                  <TableHead className="w-44">Participating 3S Dealer</TableHead>
                  <TableHead className="w-40">Field Supervisors</TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-muted/50 select-none"
                    onClick={() => {
                      setSortField("footfall");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    <div className="flex items-center justify-center gap-1 font-semibold">
                      Footfall
                      <ArrowUpDown className="size-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">4W Inquiries &amp; Drives</TableHead>
                  <TableHead className="text-center">Free Checkups &amp; Oil</TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted/50 select-none"
                    onClick={() => {
                      setSortField("revenue");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    <div className="flex items-center justify-end gap-1 font-semibold">
                      Parts Sales (PKR)
                      <ArrowUpDown className="size-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Vendor Rating</TableHead>
                  <TableHead className="text-right pr-4">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((r) => {
                    const testDrives = r.fourWheelers.reduce((sum, item) => sum + item.testDrive, 0);
                    const salesEnq = r.fourWheelers.reduce((sum, item) => sum + item.salesEnquiry, 0);
                    const conversions = r.fourWheelers.reduce((sum, item) => sum + item.conversion, 0);

                    return (
                      <TableRow
                        key={r.id}
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => handleRowClick(r)}
                      >
                        {/* 1. Sheet ID & Date */}
                        <TableCell className="font-mono text-[11px]">
                          <div className="font-bold text-foreground flex items-center gap-1.5">
                            {r.id}
                            <Badge
                              variant={r.region === "ROS" ? "default" : "secondary"}
                              className="text-[9px] px-1 py-0"
                            >
                              {r.region}
                            </Badge>
                          </div>
                          <span className="text-muted-foreground">{r.eventDate}</span>
                        </TableCell>

                        {/* 2. Tour Stop & Venue */}
                        <TableCell>
                          <div className="font-bold text-foreground text-xs">{r.city}</div>
                          <div className="text-muted-foreground text-[11px] truncate max-w-[190px]" title={r.venue}>
                            {r.venue}
                          </div>
                        </TableCell>

                        {/* 3. Dealer */}
                        <TableCell>
                          <div className="font-medium text-foreground text-xs">{r.participatingDealer}</div>
                          <span className="text-muted-foreground text-[10px]">{r.timings}</span>
                        </TableCell>

                        {/* 4. Supervisors */}
                        <TableCell>
                          <div className="text-xs">
                            <span className="text-muted-foreground font-medium">OG: </span>
                            <span className="font-semibold text-foreground">{r.supervisorOG}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span>PS: </span>
                            <span>{r.supervisorPS}</span>
                          </div>
                        </TableCell>

                        {/* 5. Footfall */}
                        <TableCell className="text-center font-bold text-xs tabular-nums text-foreground">
                          {r.customerFootfall}
                        </TableCell>

                        {/* 6. 4W Inquiries & Drives */}
                        <TableCell className="text-center tabular-nums">
                          <span className="font-semibold text-primary">{testDrives} Drives</span>
                          <span className="text-muted-foreground text-[11px] block">
                            {salesEnq} Enq • {conversions} Conv
                          </span>
                        </TableCell>

                        {/* 7. Aftersales Checkups & Oil */}
                        <TableCell className="text-center tabular-nums">
                          <span className="font-semibold text-foreground">
                            {r.aftersales.freeCheckupsTotal} Checked
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 text-[11px] block">
                            {r.aftersales.oilChangesTotal} Oil Changes
                          </span>
                        </TableCell>

                        {/* 8. Parts Sales PKR */}
                        <TableCell className="text-right font-mono font-bold text-xs tabular-nums">
                          PKR {r.aftersales.partsSalesPkr.toLocaleString()}
                        </TableCell>

                        {/* 9. Vendor Evaluation */}
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              r.vendorEvaluation.aftersales === "Excellent"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                                : r.vendorEvaluation.aftersales === "Good"
                                  ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {r.vendorEvaluation.aftersales}
                          </Badge>
                        </TableCell>

                        {/* 10. Action */}
                        <TableCell className="text-right pr-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 gap-1 text-[11px] text-primary hover:text-primary hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(r);
                            }}
                          >
                            <Eye className="size-3.5" />
                            <span>Audit Sheet</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-28 text-center text-muted-foreground">
                      No master inquiry sheets found matching the active filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer with Summary Count and Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t gap-3 text-xs text-muted-foreground">
            <div>
              Showing <strong>{paginatedRecords.length}</strong> of <strong>{filteredRecords.length}</strong> tour stop
              inquiry sheets (Page {currentPage} of {totalPages})
            </div>

            {totalPages > 1 && (
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full Sheet Audit Modal */}
      <InquirySheetModal sheet={selectedSheet} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
