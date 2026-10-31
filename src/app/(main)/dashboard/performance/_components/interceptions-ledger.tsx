"use client";

import { useMemo, useState } from "react";
import { Download, Megaphone, Phone, Radio, Search, UserCheck, Users, X } from "lucide-react";

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
import { CUSTOMER_INTERCEPTIONS } from "@/data/suzuki-express/customer-interceptions";
import { TOUR_CITIES } from "@/data/suzuki-express/tour-schedule";

interface InterceptionsLedgerProps {
  readonly interceptions?: any[];
}

function formatPktDateTime(eventDate?: string, createdAt?: string) {
  if (createdAt && createdAt !== "Live") {
    try {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        const dateStr = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Karachi",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(d);
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Karachi",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(d);
        return { date: dateStr, time: timeStr };
      }
    } catch {}
  }
  return { date: eventDate || "2026-10-31", time: "PKT" };
}

export function InterceptionsLedger({ interceptions }: InterceptionsLedgerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Build a lookup map from city to dealer
  const cityToDealer = useMemo(() => {
    const map = new Map<string, { dealer: string; region: string; venue: string }>();
    for (const c of TOUR_CITIES) {
      map.set(c.city.toLowerCase().trim(), {
        dealer: c.dealer,
        region: c.region,
        venue: c.venue,
      });
    }
    return map;
  }, []);

  // Merge provided live interceptions with seed records
  const allRecords = useMemo(() => {
    const list = interceptions && interceptions.length > 0 ? interceptions : CUSTOMER_INTERCEPTIONS;
    return list.map((item: any, idx: number) => {
      const cityKey = (item.city || "Usta Muhammad").toLowerCase().trim();
      const meta = cityToDealer.get(cityKey) || {
        dealer: "Authorized Dealership",
        region: "ROS",
        venue: "Exhibition Ground",
      };

      return {
        id: item.id || `INT-${idx + 1}`,
        name: item.name || "Customer Lead",
        gender: item.gender || "Male",
        age: item.age || 35,
        contactNo: item.contact_no || item.contactNo || "0300-0000000",
        channel: item.channel || "Auto Rickshaw Banner",
        city: item.city || "Usta Muhammad",
        dealer: meta.dealer,
        region: meta.region,
        venue: meta.venue,
        supervisor: item.supervisor_name || item.supervisor || "Gohar Ali",
        eventDate: item.event_date || item.eventDate || "2026-11-16",
        createdAt: item.created_at || "Live",
      };
    });
  }, [interceptions, cityToDealer]);

  // Unique channels and cities for filter dropdowns
  const availableChannels = useMemo(() => {
    const set = new Set<string>();
    for (const r of allRecords) {
      if (r.channel) set.add(r.channel);
    }
    return Array.from(set).sort();
  }, [allRecords]);

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    for (const r of allRecords) {
      if (r.city) set.add(r.city);
    }
    return Array.from(set).sort();
  }, [allRecords]);

  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      const matchesSearch =
        searchQuery === "" ||
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.contactNo.includes(searchQuery) ||
        record.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.dealer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.supervisor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = selectedCity === "all" || record.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesChannel =
        selectedChannel === "all" || record.channel.toLowerCase() === selectedChannel.toLowerCase();

      return matchesSearch && matchesCity && matchesChannel;
    });
  }, [allRecords, searchQuery, selectedCity, selectedChannel]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCsv = () => {
    const headers = [
      "Lead ID",
      "Visitor Name",
      "Gender",
      "Age",
      "Contact No",
      "Tour City",
      "Assigned Dealership",
      "Region",
      "Marketing Acquisition Channel",
      "Field Supervisor",
      "Date",
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      r.gender,
      r.age,
      r.contactNo,
      r.city,
      `"${r.dealer.replace(/"/g, '""')}"`,
      r.region,
      `"${r.channel.replace(/"/g, '""')}"`,
      `"${r.supervisor.replace(/"/g, '""')}"`,
      r.eventDate,
    ]);

    const csvContent = `data:text/csv;charset=utf-8,${[headers.join(","), ...rows.map((row) => row.join(","))].join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Suzuki_Express_Customer_Interceptions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border border-border/70 shadow-xs">
      <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 font-semibold text-base">
            <Users className="size-5 text-primary" />
            Customer Interception &amp; Dealership Leads Register
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            Direct on-ground visitor interactions logged by supervisors across participating 3S dealerships (
            {filteredRecords.length} leads matching filter)
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 text-xs"
            title="Export Customer Leads to CSV"
          >
            <Download className="size-3.5" />
            Export Leads CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls row */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search visitor, phone, city, dealership, or supervisor..."
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
            {/* City / Dealership Filter */}
            <Select
              value={selectedCity}
              onValueChange={(val) => {
                setSelectedCity(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-40 text-xs">
                <SelectValue placeholder="Filter by City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities ({availableCities.length})</SelectItem>
                {availableCities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Channel Filter */}
            <Select
              value={selectedChannel}
              onValueChange={(val) => {
                setSelectedChannel(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-44 text-xs">
                <SelectValue placeholder="Marketing Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Acquisition Channels</SelectItem>
                {availableChannels.map((ch) => (
                  <SelectItem key={ch} value={ch}>
                    {ch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Interceptions Table */}
        <div className="overflow-hidden rounded-lg border border-border/70">
          <Table className="text-xs">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-14 font-semibold">ID</TableHead>
                <TableHead className="min-w-[150px] font-semibold">Visitor &amp; Profile</TableHead>
                <TableHead className="min-w-[190px] font-semibold">Tour City &amp; Assigned 3S Dealer</TableHead>
                <TableHead className="min-w-[130px] font-semibold">Contact No</TableHead>
                <TableHead className="min-w-[150px] font-semibold">Marketing Channel</TableHead>
                <TableHead className="min-w-[140px] font-semibold">Field Supervisor</TableHead>
                <TableHead className="min-w-[130px] font-semibold">Date &amp; Time (PKT)</TableHead>
                <TableHead className="w-24 text-center font-semibold">Intake Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-28 text-center text-muted-foreground">
                    No customer interceptions found matching the criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-bold font-mono text-[11px] text-primary">{item.id}</TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-xs">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {item.gender} • {item.age} yrs
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground">{item.dealer}</span>
                          <Badge variant="outline" className="h-4 px-1 py-0 text-[9px]">
                            {item.region}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          City: <strong className="text-foreground">{item.city}</strong>
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <a
                        href={`tel:${item.contactNo.replace(/[^0-9+]/g, "")}`}
                        className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                        title="Click to dial"
                      >
                        <Phone className="size-3 text-emerald-600" />
                        {item.contactNo}
                      </a>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-[10px] bg-muted/60 text-foreground">
                        <Megaphone className="mr-1 size-2.5 text-muted-foreground" />
                        {item.channel}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="size-3 text-muted-foreground" />
                        <span className="text-[11px] text-foreground">{item.supervisor}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const { date, time } = formatPktDateTime(item.eventDate, item.createdAt);
                        return (
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground text-xs">{date}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{time}</span>
                          </div>
                        );
                      })()}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="border-0 bg-emerald-500/10 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium"
                      >
                        ✓ Live Ingested
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
            <p className="text-muted-foreground text-xs">
              Showing{" "}
              <strong className="text-foreground">
                {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredRecords.length)}
              </strong>{" "}
              of <strong className="text-foreground">{filteredRecords.length}</strong> visitor leads
            </p>

            <Pagination className="w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    size="default"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage((p) => p - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50 text-xs" : "text-xs"}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        size="default"
                        isActive={currentPage === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        className="text-xs"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    size="default"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50 text-xs" : "text-xs"}
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
