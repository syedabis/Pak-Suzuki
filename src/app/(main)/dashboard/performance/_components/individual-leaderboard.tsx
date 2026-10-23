"use client";

import * as React from "react";

import { ArrowUpDown, Building2, Download, MapPin, Medal, Search, Trophy, X } from "lucide-react";

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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type BranchRow = {
  rank: number;
  id: string;
  name: string;
  city: string;
  region: "South" | "Central" | "North";
  targetUnits: number;
  actualUnits: number;
  quotaPct: number;
  footfall: number;
  testDrives: number;
  conversion: number;
  revenueM: number;
  bayUtilPct: number;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
};

function getTierVariant(tier: BranchRow["tier"]): "default" | "secondary" | "outline" {
  if (tier === "Platinum") return "default";
  if (tier === "Gold") return "secondary";
  return "outline";
}

function getConversionColor(rate: number): string {
  if (rate >= 14) return "text-emerald-600 dark:text-emerald-400";
  if (rate >= 11) return "text-foreground";
  return "text-muted-foreground";
}

const branchesData: BranchRow[] = [
  {
    rank: 1,
    id: "PSMCL-KHI-01",
    name: "Pak Suzuki Central Motor World",
    city: "Karachi",
    region: "South",
    targetUnits: 35,
    actualUnits: 38,
    quotaPct: 108.6,
    footfall: 382,
    testDrives: 26,
    conversion: 14.8,
    revenueM: 148.5,
    bayUtilPct: 88.9,
    tier: "Platinum",
  },
  {
    rank: 2,
    id: "PSMCL-LHR-02",
    name: "Suzuki Central Motors (Gulberg)",
    city: "Lahore",
    region: "Central",
    targetUnits: 32,
    actualUnits: 36,
    quotaPct: 112.5,
    footfall: 440,
    testDrives: 34,
    conversion: 15.6,
    revenueM: 140.4,
    bayUtilPct: 95.5,
    tier: "Platinum",
  },
  {
    rank: 3,
    id: "PSMCL-ISB-01",
    name: "Suzuki Capital Motors (I-9)",
    city: "Islamabad",
    region: "North",
    targetUnits: 25,
    actualUnits: 28,
    quotaPct: 112.0,
    footfall: 275,
    testDrives: 19,
    conversion: 13.8,
    revenueM: 112.0,
    bayUtilPct: 85.7,
    tier: "Platinum",
  },
  {
    rank: 4,
    id: "PSMCL-KHI-04",
    name: "Suzuki South Motors (Clifton)",
    city: "Karachi",
    region: "South",
    targetUnits: 24,
    actualUnits: 26,
    quotaPct: 108.3,
    footfall: 294,
    testDrives: 18,
    conversion: 13.2,
    revenueM: 104.0,
    bayUtilPct: 92.9,
    tier: "Platinum",
  },
  {
    rank: 5,
    id: "PSMCL-LHR-07",
    name: "Suzuki Cantt Motors",
    city: "Lahore",
    region: "Central",
    targetUnits: 22,
    actualUnits: 24,
    quotaPct: 109.1,
    footfall: 310,
    testDrives: 20,
    conversion: 12.0,
    revenueM: 96.0,
    bayUtilPct: 87.5,
    tier: "Gold",
  },
  {
    rank: 6,
    id: "PSMCL-FSD-01",
    name: "Suzuki Faisalabad Motors",
    city: "Faisalabad",
    region: "Central",
    targetUnits: 20,
    actualUnits: 22,
    quotaPct: 110.0,
    footfall: 260,
    testDrives: 16,
    conversion: 11.2,
    revenueM: 88.0,
    bayUtilPct: 92.9,
    tier: "Gold",
  },
  {
    rank: 7,
    id: "PSMCL-RWP-03",
    name: "Suzuki Rawal Motors",
    city: "Rawalpindi",
    region: "North",
    targetUnits: 18,
    actualUnits: 19,
    quotaPct: 105.6,
    footfall: 248,
    testDrives: 14,
    conversion: 10.4,
    revenueM: 76.0,
    bayUtilPct: 91.7,
    tier: "Gold",
  },
  {
    rank: 8,
    id: "PSMCL-MUL-01",
    name: "Suzuki Multan Motors",
    city: "Multan",
    region: "Central",
    targetUnits: 16,
    actualUnits: 18,
    quotaPct: 112.5,
    footfall: 215,
    testDrives: 13,
    conversion: 11.8,
    revenueM: 72.0,
    bayUtilPct: 83.3,
    tier: "Gold",
  },
  {
    rank: 9,
    id: "PSMCL-KHI-09",
    name: "Suzuki Defence Motors",
    city: "Karachi",
    region: "South",
    targetUnits: 18,
    actualUnits: 18,
    quotaPct: 100.0,
    footfall: 230,
    testDrives: 15,
    conversion: 11.5,
    revenueM: 72.0,
    bayUtilPct: 81.8,
    tier: "Gold",
  },
  {
    rank: 10,
    id: "PSMCL-PEW-02",
    name: "Suzuki Khyber Motors",
    city: "Peshawar",
    region: "North",
    targetUnits: 16,
    actualUnits: 15,
    quotaPct: 93.8,
    footfall: 192,
    testDrives: 9,
    conversion: 8.6,
    revenueM: 60.0,
    bayUtilPct: 70.0,
    tier: "Silver",
  },
  {
    rank: 11,
    id: "PSMCL-GUJ-01",
    name: "Suzuki Gujranwala Motors",
    city: "Gujranwala",
    region: "Central",
    targetUnits: 14,
    actualUnits: 14,
    quotaPct: 100.0,
    footfall: 185,
    testDrives: 11,
    conversion: 10.5,
    revenueM: 56.0,
    bayUtilPct: 80.0,
    tier: "Silver",
  },
  {
    rank: 12,
    id: "PSMCL-HYD-01",
    name: "Suzuki Mehran Motors",
    city: "Hyderabad",
    region: "South",
    targetUnits: 14,
    actualUnits: 13,
    quotaPct: 92.9,
    footfall: 178,
    testDrives: 10,
    conversion: 9.8,
    revenueM: 52.0,
    bayUtilPct: 75.0,
    tier: "Silver",
  },
  {
    rank: 13,
    id: "PSMCL-SKT-01",
    name: "Suzuki Sialkot Motors",
    city: "Sialkot",
    region: "Central",
    targetUnits: 12,
    actualUnits: 12,
    quotaPct: 100.0,
    footfall: 160,
    testDrives: 9,
    conversion: 10.2,
    revenueM: 48.0,
    bayUtilPct: 77.8,
    tier: "Silver",
  },
  {
    rank: 14,
    id: "PSMCL-QTA-01",
    name: "Suzuki Bolan Motors",
    city: "Quetta",
    region: "South",
    targetUnits: 10,
    actualUnits: 10,
    quotaPct: 100.0,
    footfall: 140,
    testDrives: 7,
    conversion: 11.2,
    revenueM: 40.0,
    bayUtilPct: 75.0,
    tier: "Silver",
  },
  {
    rank: 15,
    id: "PSMCL-ABT-01",
    name: "Suzuki Pine Motors",
    city: "Abbottabad",
    region: "North",
    targetUnits: 8,
    actualUnits: 8,
    quotaPct: 100.0,
    footfall: 125,
    testDrives: 6,
    conversion: 9.6,
    revenueM: 32.0,
    bayUtilPct: 66.7,
    tier: "Silver",
  },
  {
    rank: 16,
    id: "PSMCL-BWP-01",
    name: "Suzuki Bahawalpur Motors",
    city: "Bahawalpur",
    region: "Central",
    targetUnits: 8,
    actualUnits: 7,
    quotaPct: 87.5,
    footfall: 110,
    testDrives: 5,
    conversion: 8.8,
    revenueM: 28.0,
    bayUtilPct: 62.5,
    tier: "Bronze",
  },
  {
    rank: 17,
    id: "PSMCL-SUK-01",
    name: "Suzuki Sukkur Motors",
    city: "Sukkur",
    region: "South",
    targetUnits: 8,
    actualUnits: 7,
    quotaPct: 87.5,
    footfall: 105,
    testDrives: 5,
    conversion: 8.5,
    revenueM: 28.0,
    bayUtilPct: 60.0,
    tier: "Bronze",
  },
  {
    rank: 18,
    id: "PSMCL-MIR-01",
    name: "Suzuki Kashmir Motors",
    city: "Mirpur (AJK)",
    region: "North",
    targetUnits: 6,
    actualUnits: 6,
    quotaPct: 100.0,
    footfall: 95,
    testDrives: 4,
    conversion: 9.4,
    revenueM: 24.0,
    bayUtilPct: 71.4,
    tier: "Silver",
  },
  {
    rank: 19,
    id: "PSMCL-SGD-01",
    name: "Suzuki Sargodha Motors",
    city: "Sargodha",
    region: "Central",
    targetUnits: 6,
    actualUnits: 5,
    quotaPct: 83.3,
    footfall: 88,
    testDrives: 4,
    conversion: 8.0,
    revenueM: 20.0,
    bayUtilPct: 58.3,
    tier: "Bronze",
  },
  {
    rank: 20,
    id: "PSMCL-LRK-01",
    name: "Suzuki Larkana Motors",
    city: "Larkana",
    region: "South",
    targetUnits: 5,
    actualUnits: 4,
    quotaPct: 80.0,
    footfall: 76,
    testDrives: 3,
    conversion: 7.8,
    revenueM: 16.0,
    bayUtilPct: 50.0,
    tier: "Bronze",
  },
];

type SortKey = "rank" | "actualUnits" | "quotaPct" | "footfall" | "conversion" | "revenueM";

export function IndividualLeaderboard() {
  const [search, setSearch] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const filteredBranches = React.useMemo(() => {
    let list = [...branchesData];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.city.toLowerCase().includes(q),
      );
    }

    if (selectedRegion !== "all") {
      list = list.filter((b) => b.region.toLowerCase() === selectedRegion.toLowerCase());
    }

    list.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortAsc ? diff : -diff;
    });

    return list;
  }, [search, selectedRegion, sortKey, sortAsc]);

  const totalPages = Math.ceil(filteredBranches.length / pageSize) || 1;

  const paginatedBranches = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBranches.slice(start, start + pageSize);
  }, [filteredBranches, page]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CardTitle className="font-semibold text-lg">3S Branch & Showroom Performance Directory</CardTitle>
              <Badge variant="outline" className="text-xs">
                156 Authorized Facilities
              </Badge>
            </div>
            <CardDescription className="text-muted-foreground text-xs">
              Live ranking of dealership branches by vehicle quota completion, footfall conversion, and workshop
              utilization
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                className="pl-8 text-xs"
                placeholder="Search branch name, code, city..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  type="button"
                  className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearch("")}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <Select
              value={selectedRegion}
              onValueChange={(val) => {
                setSelectedRegion(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40" size="sm">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="South">South Region</SelectItem>
                  <SelectItem value="Central">Central Region</SelectItem>
                  <SelectItem value="North">North Region</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button size="sm" variant="outline" className="shrink-0 gap-1.5">
              <Download className="size-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-0">
        <div className="overflow-x-auto">
          <Table className="**:data-[slot='table-cell']:px-4.5 **:data-[slot='table-head']:px-4.5">
            <TableHeader className="border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-normal **:data-[slot='table-head']:text-foreground **:data-[slot='table-head']:text-sm">
              <TableRow>
                <TableHead className="w-16">
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("rank")}
                  >
                    Rank <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>Dealership Branch</TableHead>
                <TableHead>Region & Hub</TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("actualUnits")}
                  >
                    Units Booked <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("quotaPct")}
                  >
                    Quota % <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("footfall")}
                  >
                    Walk-ins <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">Test Drives</TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("conversion")}
                  >
                    Conv % <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("revenueM")}
                  >
                    Revenue (PKR M) <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">Workshop Bay Util</TableHead>
                <TableHead className="text-center">Tier</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedBranches.length > 0 ? (
                paginatedBranches.map((branch) => (
                  <TableRow key={branch.id} className="hover:bg-muted/40">
                    <TableCell className="font-semibold tabular-nums">
                      <div className="flex items-center gap-1.5">
                        {branch.rank === 1 && <Trophy className="size-4 shrink-0 text-amber-500" />}
                        {branch.rank === 2 && <Medal className="size-4 shrink-0 text-slate-400" />}
                        {branch.rank === 3 && <Medal className="size-4 shrink-0 text-amber-700" />}
                        <span>#{branch.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground text-xs">{branch.name}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{branch.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs">
                        <MapPin className="size-3 text-muted-foreground" />
                        <span>
                          {branch.city} • <span className="text-muted-foreground">{branch.region}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-xs tabular-nums">
                      {branch.actualUnits}{" "}
                      <span className="font-normal text-muted-foreground">/ {branch.targetUnits}</span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-xs tabular-nums">
                      <span
                        className={branch.quotaPct >= 100 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"}
                      >
                        {branch.quotaPct}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-xs tabular-nums">{branch.footfall}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{branch.testDrives}</TableCell>
                    <TableCell className="text-right font-semibold text-xs tabular-nums">
                      <span className={getConversionColor(branch.conversion)}>{branch.conversion}%</span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-xs tabular-nums">
                      PKR {branch.revenueM.toFixed(1)}M
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums">
                      <span
                        className={
                          branch.bayUtilPct >= 85
                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-foreground"
                        }
                      >
                        {branch.bayUtilPct}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getTierVariant(branch.tier)} className="text-[10px]">
                        {branch.tier}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                    No dealership branches found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 pt-2">
            <div className="text-muted-foreground text-xs tabular-nums">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredBranches.length)} of{" "}
              {filteredBranches.length} dealership branches
            </div>

            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={page === 1 ? "pointer-events-none opacity-50" : undefined}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <PaginationItem key={`branch-page-${pageNumber}`}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
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
