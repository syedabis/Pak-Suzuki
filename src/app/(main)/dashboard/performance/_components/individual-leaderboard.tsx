"use client";

import { useMemo, useState } from "react";

import { Building2, Download, Search, X } from "lucide-react";

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

import { getTourStopsPerformance } from "./performance-data";

export function IndividualLeaderboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"serial" | "footfall" | "testDrives" | "inquiries">("serial");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const allStops = useMemo(() => getTourStopsPerformance(), []);

  const filteredStops = useMemo(() => {
    return allStops
      .filter((stop) => {
        const matchesSearch =
          searchQuery === "" ||
          stop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stop.dealer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stop.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stop.supervisorPS.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stop.supervisorOG.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRegion = selectedRegion === "all" || stop.region === selectedRegion;
        const matchesPhase =
          selectedPhase === "all" ||
          (selectedPhase === "phase-1" && stop.phase === 1) ||
          (selectedPhase === "phase-2" && stop.phase === 2);

        return matchesSearch && matchesRegion && matchesPhase;
      })
      .sort((a, b) => {
        if (sortBy === "footfall") return b.footfall - a.footfall;
        if (sortBy === "testDrives") return b.testDrives - a.testDrives;
        if (sortBy === "inquiries") return b.salesInquiries - a.salesInquiries;
        return a.serialNo - b.serialNo;
      });
  }, [allStops, searchQuery, selectedRegion, selectedPhase, sortBy]);

  const totalPages = Math.ceil(filteredStops.length / pageSize) || 1;
  const paginatedStops = filteredStops.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCsv = () => {
    const headers = [
      "Stop #",
      "City",
      "Region",
      "Phase",
      "Event Date",
      "Participating Dealership",
      "Venue",
      "PS Supervisor",
      "OG Supervisor",
      "Status",
      "Footfall",
      "Test Drives",
      "Sales Inquiries",
      "Trade-in Appraisals",
      "Free 3S Checkups",
      "Free Oil Changes",
      "Parts Sales PKR",
    ];

    const rows = filteredStops.map((s) => [
      s.serialNo,
      s.city,
      s.region,
      `Phase ${s.phase}`,
      s.eventDate,
      `"${s.dealer.replace(/"/g, '""')}"`,
      `"${s.venue.replace(/"/g, '""')}"`,
      `"${s.supervisorPS.replace(/"/g, '""')}"`,
      `"${s.supervisorOG.replace(/"/g, '""')}"`,
      s.status,
      s.footfall,
      s.testDrives,
      s.salesInquiries,
      s.tradeInEvaluations,
      s.freeCheckups,
      s.freeOilChanges,
      s.partsSalesPkr,
    ]);

    const csvContent = `data:text/csv;charset=utf-8,${[headers.join(","), ...rows.map((r) => r.join(","))].join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Suzuki_Express_Dealer_Performance_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border border-border/70 shadow-xs">
      <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 font-semibold text-lg">
            <Building2 className="size-5 text-primary" />
            38-City Participating Dealership &amp; Tour Stop Ledger
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            On-ground performance directory: {filteredStops.length} stops matching filter across Phase 1 &amp; Phase 2
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 text-xs"
            title="Export Tour Stops to CSV"
          >
            <Download className="size-3.5" />
            Export Ledger
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls row */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by city, dealer, supervisor, or venue..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 pl-8 text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Phase filter */}
            <Select
              value={selectedPhase}
              onValueChange={(val) => {
                setSelectedPhase(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue placeholder="Tour Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases (38)</SelectItem>
                <SelectItem value="phase-1">Phase 1 (15 Cities)</SelectItem>
                <SelectItem value="phase-2">Phase 2 (23 Cities)</SelectItem>
              </SelectContent>
            </Select>

            {/* Region filter */}
            <Select
              value={selectedRegion}
              onValueChange={(val) => {
                setSelectedRegion(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-32 text-xs">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="ROS">ROS (South)</SelectItem>
                <SelectItem value="ROSP">ROSP (S. Punjab)</SelectItem>
                <SelectItem value="ROCP">ROCP (C. Punjab)</SelectItem>
                <SelectItem value="RON">RON (North/KP)</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort order */}
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as typeof sortBy)}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="serial">Stop # (Route Order)</SelectItem>
                <SelectItem value="footfall">Footfall (Highest)</SelectItem>
                <SelectItem value="testDrives">Test Drives (Highest)</SelectItem>
                <SelectItem value="inquiries">Inquiries (Highest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-hidden rounded-lg border border-border/70">
          <Table className="text-xs">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-14 font-semibold">Stop #</TableHead>
                <TableHead className="min-w-[140px] font-semibold">Tour City &amp; Venue</TableHead>
                <TableHead className="min-w-[180px] font-semibold">Participating 3S Dealership</TableHead>
                <TableHead className="min-w-[160px] font-semibold">Supervisors (PS &amp; OG)</TableHead>
                <TableHead className="w-24 text-center font-semibold">Tour Status</TableHead>
                <TableHead className="text-right font-semibold">Footfall</TableHead>
                <TableHead className="text-right font-semibold">Test Drives</TableHead>
                <TableHead className="text-right font-semibold">Inquiries</TableHead>
                <TableHead className="text-right font-semibold">3S Clinic</TableHead>
                <TableHead className="text-right font-semibold">Parts (PKR)</TableHead>
                <TableHead className="w-20 text-center font-semibold">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-28 text-center text-muted-foreground">
                    No tour stops match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStops.map((stop) => {
                  const isCompleted = stop.status === "completed";
                  const isActive = stop.status === "active";

                  return (
                    <TableRow key={`stop-${stop.serialNo}-${stop.city}`} className="hover:bg-muted/30">
                      <TableCell className="font-bold font-mono text-primary">#{stop.serialNo}</TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-xs">{stop.city}</span>
                          <span className="max-w-[160px] truncate text-[11px] text-muted-foreground" title={stop.venue}>
                            {stop.venue}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{stop.dealer}</span>
                          <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Badge variant="outline" className="h-4 px-1 py-0 text-[9px]">
                              {stop.region}
                            </Badge>
                            <span>Phase {stop.phase}</span>
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col text-[11px]">
                          <span className="text-foreground">{stop.supervisorPS}</span>
                          <span className="text-[10px] text-muted-foreground">{stop.supervisorOG}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {isCompleted && (
                          <Badge
                            variant="secondary"
                            className="border-0 bg-emerald-500/10 text-[10px] text-emerald-700 dark:text-emerald-400"
                          >
                            Completed
                          </Badge>
                        )}
                        {isActive && (
                          <Badge
                            variant="default"
                            className="animate-pulse bg-primary text-[10px] text-primary-foreground"
                          >
                            Live Stop
                          </Badge>
                        )}
                        {!isCompleted && !isActive && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            Phase 2
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right font-medium font-mono">
                        {stop.footfall > 0 ? (
                          <div>
                            <span className="text-foreground">{stop.footfall.toLocaleString()}</span>
                            <span className="block text-[10px] text-muted-foreground">
                              {Math.round((stop.footfall / stop.footfallTarget) * 100)}% quota
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">150 (tgt)</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right font-medium font-mono">
                        {stop.testDrives > 0 ? (
                          <span className="text-foreground">{stop.testDrives}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right font-medium font-mono">
                        {stop.salesInquiries > 0 ? (
                          <div>
                            <span className="text-foreground">{stop.salesInquiries}</span>
                            {stop.tradeInEvaluations > 0 && (
                              <span className="block text-[10px] text-muted-foreground">
                                +{stop.tradeInEvaluations} trade-ins
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right font-medium font-mono">
                        {stop.freeCheckups > 0 ? (
                          <div>
                            <span className="text-foreground">{stop.freeCheckups} chk</span>
                            {stop.freeOilChanges > 0 && (
                              <span className="block text-[10px] text-muted-foreground">{stop.freeOilChanges} oil</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right font-mono text-xs">
                        {stop.partsSalesPkr > 0 ? (
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            {(stop.partsSalesPkr / 1000).toFixed(0)}k
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        {stop.dealerRating === "Excellent" && (
                          <Badge variant="default" className="bg-emerald-600 text-[10px]">
                            Excellent
                          </Badge>
                        )}
                        {stop.dealerRating === "Good" && (
                          <Badge variant="secondary" className="text-[10px]">
                            Good
                          </Badge>
                        )}
                        {stop.dealerRating === "Scheduled" && (
                          <span className="text-[10px] text-muted-foreground">Queued</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredStops.length)} of{" "}
              {filteredStops.length} tour stops
            </span>

            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
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
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
