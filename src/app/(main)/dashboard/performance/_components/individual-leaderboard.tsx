"use client";

import * as React from "react";

import { ArrowUpDown, Download, Medal, Search, Trophy, X } from "lucide-react";

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

export type AgentRow = {
  rank: number;
  id: string;
  name: string;
  team: string;
  knocks: number;
  converted: number;
  conversion: number;
  liters: number;
  revenue: number;
  surveys: number;
  incentive: number;
  tier: "Gold" | "Silver" | "Bronze" | "Standard";
};

function getTierVariant(tier: AgentRow["tier"]): "default" | "secondary" | "outline" {
  if (tier === "Gold") return "default";
  if (tier === "Silver") return "secondary";
  return "outline";
}

function getConversionColor(rate: number): string {
  if (rate >= 35) return "text-emerald-600 dark:text-emerald-400";
  if (rate >= 30) return "text-foreground";
  return "text-muted-foreground";
}

const agentsData: AgentRow[] = [
  {
    rank: 1,
    id: "AGT-15",
    name: "Zeeshan Ali",
    team: "DHA & Clifton",
    knocks: 65,
    converted: 25,
    conversion: 38.5,
    liters: 148,
    revenue: 74000,
    surveys: 54,
    incentive: 4440,
    tier: "Gold",
  },
  {
    rank: 2,
    id: "AGT-01",
    name: "Bilal Khan",
    team: "Gulshan-e-Iqbal",
    knocks: 64,
    converted: 24,
    conversion: 37.5,
    liters: 136,
    revenue: 68000,
    surveys: 51,
    incentive: 4080,
    tier: "Gold",
  },
  {
    rank: 3,
    id: "AGT-22",
    name: "Kashif Raza",
    team: "North Nazimabad",
    knocks: 62,
    converted: 22,
    conversion: 35.5,
    liters: 124,
    revenue: 62000,
    surveys: 49,
    incentive: 3720,
    tier: "Gold",
  },
  {
    rank: 4,
    id: "AGT-19",
    name: "Shoaib Akhtar",
    team: "F.B. Area",
    knocks: 60,
    converted: 21,
    conversion: 35.0,
    liters: 118,
    revenue: 59000,
    surveys: 48,
    incentive: 3540,
    tier: "Silver",
  },
  {
    rank: 5,
    id: "AGT-08",
    name: "Hamza Tariq",
    team: "Johar Force",
    knocks: 59,
    converted: 20,
    conversion: 33.9,
    liters: 112,
    revenue: 56000,
    surveys: 46,
    incentive: 3360,
    tier: "Silver",
  },
  {
    rank: 6,
    id: "AGT-44",
    name: "Owais Siddiqui",
    team: "PECHS & Saddar",
    knocks: 58,
    converted: 19,
    conversion: 32.8,
    liters: 106,
    revenue: 53000,
    surveys: 45,
    incentive: 3180,
    tier: "Silver",
  },
  {
    rank: 7,
    id: "AGT-12",
    name: "Farooq Sattar",
    team: "DHA & Clifton",
    knocks: 60,
    converted: 19,
    conversion: 31.7,
    liters: 104,
    revenue: 52000,
    surveys: 47,
    incentive: 3120,
    tier: "Silver",
  },
  {
    rank: 8,
    id: "AGT-03",
    name: "Usman Ghani",
    team: "Gulshan-e-Iqbal",
    knocks: 58,
    converted: 18,
    conversion: 31.0,
    liters: 98,
    revenue: 49000,
    surveys: 44,
    incentive: 2940,
    tier: "Silver",
  },
  {
    rank: 9,
    id: "AGT-31",
    name: "Adeel Ahmed",
    team: "North Nazimabad",
    knocks: 56,
    converted: 17,
    conversion: 30.4,
    liters: 96,
    revenue: 48000,
    surveys: 42,
    incentive: 2880,
    tier: "Silver",
  },
  {
    rank: 10,
    id: "AGT-27",
    name: "Mubashir Lucman",
    team: "F.B. Area",
    knocks: 55,
    converted: 17,
    conversion: 30.9,
    liters: 94,
    revenue: 47000,
    surveys: 43,
    incentive: 2820,
    tier: "Bronze",
  },
  {
    rank: 11,
    id: "AGT-14",
    name: "Daniyal Qureshi",
    team: "DHA & Clifton",
    knocks: 57,
    converted: 17,
    conversion: 29.8,
    liters: 92,
    revenue: 46000,
    surveys: 45,
    incentive: 2760,
    tier: "Bronze",
  },
  {
    rank: 12,
    id: "AGT-05",
    name: "Fahad Mustafa",
    team: "Gulshan-e-Iqbal",
    knocks: 56,
    converted: 16,
    conversion: 28.6,
    liters: 90,
    revenue: 45000,
    surveys: 42,
    incentive: 2700,
    tier: "Bronze",
  },
  {
    rank: 13,
    id: "AGT-39",
    name: "Kamran Akmal",
    team: "Johar Force",
    knocks: 54,
    converted: 16,
    conversion: 29.6,
    liters: 88,
    revenue: 44000,
    surveys: 41,
    incentive: 2640,
    tier: "Bronze",
  },
  {
    rank: 14,
    id: "AGT-47",
    name: "Saad Rafique",
    team: "PECHS & Saddar",
    knocks: 53,
    converted: 15,
    conversion: 28.3,
    liters: 86,
    revenue: 43000,
    surveys: 40,
    incentive: 2580,
    tier: "Bronze",
  },
  {
    rank: 15,
    id: "AGT-25",
    name: "Waqar Younis",
    team: "North Nazimabad",
    knocks: 55,
    converted: 15,
    conversion: 27.3,
    liters: 84,
    revenue: 42000,
    surveys: 41,
    incentive: 2520,
    tier: "Standard",
  },
  {
    rank: 16,
    id: "AGT-17",
    name: "Haris Rauf",
    team: "DHA & Clifton",
    knocks: 54,
    converted: 15,
    conversion: 27.8,
    liters: 82,
    revenue: 41000,
    surveys: 40,
    incentive: 2460,
    tier: "Standard",
  },
  {
    rank: 17,
    id: "AGT-09",
    name: "Naseem Shah",
    team: "Gulshan-e-Iqbal",
    knocks: 52,
    converted: 14,
    conversion: 26.9,
    liters: 80,
    revenue: 40000,
    surveys: 39,
    incentive: 2400,
    tier: "Standard",
  },
  {
    rank: 18,
    id: "AGT-33",
    name: "Iftikhar Ahmed",
    team: "F.B. Area",
    knocks: 51,
    converted: 14,
    conversion: 27.5,
    liters: 78,
    revenue: 39000,
    surveys: 38,
    incentive: 2340,
    tier: "Standard",
  },
  {
    rank: 19,
    id: "AGT-41",
    name: "Shan Masood",
    team: "Johar Force",
    knocks: 50,
    converted: 13,
    conversion: 26.0,
    liters: 76,
    revenue: 38000,
    surveys: 37,
    incentive: 2280,
    tier: "Standard",
  },
  {
    rank: 20,
    id: "AGT-50",
    name: "Sarfaraz Ahmed",
    team: "PECHS & Saddar",
    knocks: 49,
    converted: 13,
    conversion: 26.5,
    liters: 74,
    revenue: 37000,
    surveys: 36,
    incentive: 2220,
    tier: "Standard",
  },
];

export function IndividualLeaderboard() {
  const [search, setSearch] = React.useState("");
  const [selectedTeam, setSelectedTeam] = React.useState("all");
  const [sortField, setSortField] = React.useState<keyof AgentRow>("rank");
  const [sortAsc, setSortAsc] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const filteredAgents = React.useMemo(() => {
    let list = agentsData;
    if (selectedTeam !== "all") {
      list = list.filter((a) => a.team.toLowerCase().includes(selectedTeam.toLowerCase()));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.team.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });
  }, [search, selectedTeam, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredAgents.length / pageSize);
  const pageNumbers = React.useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);
  const paginatedAgents = filteredAgents.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: keyof AgentRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CardTitle className="font-semibold text-lg">Individual Agent Performance Leaderboard</CardTitle>
              <Badge variant="outline" className="text-xs">
                50 Agents Tracked
              </Badge>
            </div>
            <CardDescription className="text-muted-foreground text-xs">
              Individual door knocks, conversion rates, litres sold, and commission earned
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                className="pl-8 text-xs"
                placeholder="Search agent name, ID..."
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
              value={selectedTeam}
              onValueChange={(val) => {
                setSelectedTeam(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40" size="sm">
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="DHA">DHA & Clifton</SelectItem>
                  <SelectItem value="Gulshan">Gulshan-e-Iqbal</SelectItem>
                  <SelectItem value="Nazimabad">North Nazimabad</SelectItem>
                  <SelectItem value="Johar">Johar Force</SelectItem>
                  <SelectItem value="F.B.">F.B. Area</SelectItem>
                  <SelectItem value="PECHS">PECHS & Saddar</SelectItem>
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
                <TableHead>Agent Name & ID</TableHead>
                <TableHead>Assigned Squad</TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("knocks")}
                  >
                    Knocks <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
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
                    onClick={() => handleSort("liters")}
                  >
                    Litres Sold <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("revenue")}
                  >
                    Sales (PKR) <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">Surveys</TableHead>
                <TableHead className="text-right">Incentive (PKR)</TableHead>
                <TableHead className="text-center">Tier</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedAgents.length > 0 ? (
                paginatedAgents.map((agent) => (
                  <TableRow key={agent.id} className="hover:bg-muted/40">
                    <TableCell className="font-semibold tabular-nums">
                      <div className="flex items-center gap-1.5">
                        {agent.rank === 1 && <Trophy className="size-4 shrink-0 text-amber-500" />}
                        {agent.rank === 2 && <Medal className="size-4 shrink-0 text-slate-400" />}
                        {agent.rank === 3 && <Medal className="size-4 shrink-0 text-amber-700" />}
                        <span>#{agent.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground text-xs">{agent.name}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{agent.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-xs">{agent.team}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-xs tabular-nums">{agent.knocks} doors</TableCell>
                    <TableCell className="text-right font-semibold text-xs tabular-nums">
                      <span className={getConversionColor(agent.conversion)}>{agent.conversion}%</span>
                      <span className="font-normal text-[11px] text-muted-foreground"> ({agent.converted})</span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-xs tabular-nums">{agent.liters} L</TableCell>
                    <TableCell className="text-right font-medium text-xs tabular-nums">
                      Rs. {agent.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs tabular-nums">
                      {agent.surveys}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600 text-xs tabular-nums dark:text-emerald-400">
                      Rs. {agent.incentive.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getTierVariant(agent.tier)} className="text-[10px]">
                        {agent.tier}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                    No agents found matching your query.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 pt-2">
            <div className="text-muted-foreground text-xs tabular-nums">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredAgents.length)} of{" "}
              {filteredAgents.length} agents
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
                {pageNumbers.map((pageNumber) => (
                  <PaginationItem key={`leaderboard-page-${pageNumber}`}>
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
