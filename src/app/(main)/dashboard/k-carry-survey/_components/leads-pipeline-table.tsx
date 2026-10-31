"use client";

import { useMemo, useState, useEffect } from "react";

import { Download, Phone, Search, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { K_CARRY_SURVEY_DATA } from "@/data/suzuki-express/k-carry-survey-data";
import { supabase } from "@/lib/supabase";

export function LeadsPipelineTable() {
  const [leads, setLeads] = useState<any[]>(K_CARRY_SURVEY_DATA);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live leads from Supabase and subscribe to live additions
  useEffect(() => {
    async function loadCloudLeads() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("k_carry_surveys")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const cloudMapped = data.map((d: any) => ({
          id: d.id,
          customerName: d.respondent_name,
          mobileNo: d.contact_no,
          campaignLocation: d.city,
          region: d.region || "ROS",
          eventDate: d.event_date,
          createdAt: d.created_at,
          leadStatus: d.lead_status,
          mainOccupation: d.main_occupation,
          mainRequirement: d.main_requirement,
          currentVehicle: d.current_vehicle,
          mostImportantFeature: d.most_important_feature,
          biggestTransportProblem: d.biggest_transport_problem,
          reasonablePriceRange: d.reasonable_price_range,
          wouldConsiderBuying: d.would_consider_buying,
          notes: d.notes,
        }));
        // Live cloud leads from Supabase
        setLeads(cloudMapped);
      }
      setIsLoading(false);
    }

    loadCloudLeads();

    // Subscribe to real-time incoming surveys
    const channel = supabase
      .channel("public:k_carry_surveys_leads")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "k_carry_surveys" }, (payload: any) => {
        const row = payload.new;
        setLeads((prev) => [
          {
            id: row.id,
            customerName: row.respondent_name,
            mobileNo: row.contact_no,
            campaignLocation: row.city,
            region: row.region || "ROS",
            eventDate: row.event_date,
            createdAt: row.created_at,
            leadStatus: row.lead_status,
            mainOccupation: row.main_occupation,
            mainRequirement: row.main_requirement,
            currentVehicle: row.current_vehicle,
            mostImportantFeature: row.most_important_feature,
            biggestTransportProblem: row.biggest_transport_problem,
            reasonablePriceRange: row.reasonable_price_range,
            wouldConsiderBuying: row.would_consider_buying,
            notes: row.notes,
          },
          ...prev,
        ]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" || lead.leadStatus === statusFilter;
      const matchesCity = cityFilter === "all" || lead.campaignLocation === cityFilter;
      const matchesSearch =
        lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.mobileNo.includes(searchTerm) ||
        lead.mainOccupation.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesCity && matchesSearch;
    });
  }, [leads, statusFilter, cityFilter, searchTerm]);

  const uniqueCities = useMemo(() => {
    return Array.from(new Set(leads.map((l) => l.campaignLocation)));
  }, [leads]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">K-CARRY Customer Lead Intelligence</CardTitle>
          <CardDescription className="text-xs">
            Direct survey respondents tagged for dealership test drive booking and vehicle trade-in
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue placeholder="Lead Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Hot">🔥 Hot Leads</SelectItem>
              <SelectItem value="Warm">⚡ Warm Leads</SelectItem>
              <SelectItem value="Cold">❄️ Cold Leads</SelectItem>
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="Tour City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tour Cities</SelectItem>
              {uniqueCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-xs"
            onClick={() => {
              const headers = "ID,Name,Contact,City,Occupation,Current Vehicle,Expected Price,Intent,Status\n";
              const rows = filteredLeads
                .map(
                  (l) =>
                    `"${l.id}","${l.customerName}","${l.mobileNo}","${l.campaignLocation}","${l.mainOccupation}","${l.currentVehicle}","${l.reasonablePriceRange}","${l.wouldConsiderBuying}","${l.leadStatus}"`,
                )
                .join("\n");
              const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", `k_carry_leads_${new Date().toISOString().slice(0, 10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-[11px]">
                <TableHead>Customer / Phone</TableHead>
                <TableHead>Tour Stop</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Current Transport</TableHead>
                <TableHead>Price Target</TableHead>
                <TableHead>Buy Intent</TableHead>
                <TableHead>Date &amp; Time (PKT)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.slice(0, 10).map((lead) => (
                <TableRow key={lead.id} className="text-xs">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{lead.customerName}</span>
                      <span className="text-muted-foreground text-[11px]">{lead.mobileNo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {lead.campaignLocation}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.mainOccupation}</TableCell>
                  <TableCell>
                    <span className="truncate max-w-[140px] block font-mono text-[11px]">{lead.currentVehicle}</span>
                  </TableCell>
                  <TableCell className="font-medium">{lead.reasonablePriceRange}</TableCell>
                  <TableCell>
                    <span
                      className={`text-[11px] font-medium ${
                        lead.wouldConsiderBuying === "Definitely Yes"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : lead.wouldConsiderBuying === "No"
                            ? "text-muted-foreground"
                            : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {lead.wouldConsiderBuying}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground text-xs">
                        {(lead as any).eventDate || "2026-10-31"}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {(lead as any).createdAt
                          ? new Intl.DateTimeFormat("en-US", {
                              timeZone: "Asia/Karachi",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }).format(new Date((lead as any).createdAt))
                          : "PKT"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        lead.leadStatus === "Hot"
                          ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                          : lead.leadStatus === "Warm"
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                            : "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20"
                      }
                      variant="outline"
                    >
                      {lead.leadStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      title={`Call ${lead.customerName}`}
                      onClick={() => alert(`Calling customer ${lead.customerName} at ${lead.mobileNo}`)}
                    >
                      <Phone className="size-3.5 text-primary" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>
            Showing <strong>{Math.min(filteredLeads.length, 10)}</strong> of <strong>{filteredLeads.length}</strong>{" "}
            leads
          </span>
          <span className="text-[11px]">Direct integration with Suzuki Dealership CRM</span>
        </div>
      </CardContent>
    </Card>
  );
}
