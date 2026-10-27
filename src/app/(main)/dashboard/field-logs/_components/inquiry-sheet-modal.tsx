"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  MapPin,
  ShieldCheck,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DailyInquirySheetRecord } from "@/data/suzuki-express/types";

interface InquirySheetModalProps {
  sheet: DailyInquirySheetRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InquirySheetModal({ sheet, open, onOpenChange }: InquirySheetModalProps) {
  if (!sheet) return null;

  // Calculate totals for 4-wheelers
  const total4W = sheet.fourWheelers.reduce(
    (acc, row) => ({
      testDrive: acc.testDrive + row.testDrive,
      salesEnquiry: acc.salesEnquiry + row.salesEnquiry,
      exchangeEnquiry: acc.exchangeEnquiry + row.exchangeEnquiry,
      usedCarEnquiry: acc.usedCarEnquiry + row.usedCarEnquiry,
      freeEvaluation: acc.freeEvaluation + row.freeEvaluation,
      financing: acc.financing + row.financing,
      insurance: acc.insurance + row.insurance,
      conversion: acc.conversion + row.conversion,
    }),
    {
      testDrive: 0,
      salesEnquiry: 0,
      exchangeEnquiry: 0,
      usedCarEnquiry: 0,
      freeEvaluation: 0,
      financing: 0,
      insurance: 0,
      conversion: 0,
    },
  );

  // Calculate totals for 2-wheelers
  const total2W = sheet.twoWheelers.reduce(
    (acc, row) => ({
      testDrive: acc.testDrive + row.testDrive,
      salesEnquiry: acc.salesEnquiry + row.salesEnquiry,
      salesConversion: acc.salesConversion + row.salesConversion,
    }),
    { testDrive: 0, salesEnquiry: 0, salesConversion: 0 },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={sheet.region === "ROS" ? "default" : "secondary"} className="text-xs font-semibold">
                  {sheet.region}
                </Badge>
                <DialogTitle className="text-lg font-bold">
                  {sheet.city} • Master Inquiry &amp; Operational Audit Sheet
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs mt-1">
                PSMCL Marketing Master Record #{sheet.id} • Suzuki Express Rural Campaign (Season 5)
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-muted/40">
                Stop #{sheet.serialNo} of 15
              </Badge>
            </div>
          </div>

          {/* Operational Header Metadata Strip */}
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border bg-muted/20 p-3 sm:grid-cols-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <MapPin className="size-3 text-primary" /> Venue / Location
              </span>
              <p className="font-semibold text-foreground truncate" title={sheet.venue}>
                {sheet.venue}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <Building2 className="size-3 text-primary" /> Participating Dealer
              </span>
              <p className="font-semibold text-foreground truncate" title={sheet.participatingDealer}>
                {sheet.participatingDealer}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <Calendar className="size-3 text-primary" /> Date &amp; Hours
              </span>
              <p className="font-semibold text-foreground">
                {sheet.eventDate} ({sheet.timings})
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <Users className="size-3 text-primary" /> Verified Footfall
              </span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                {sheet.customerFootfall} Verified Visitors
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <UserCheck className="size-3 text-blue-500" /> OG Supervisor
              </span>
              <p className="font-semibold text-foreground">{sheet.supervisorOG}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <ShieldCheck className="size-3 text-indigo-500" /> PSMC Supervisor
              </span>
              <p className="font-semibold text-foreground">{sheet.supervisorPS}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <Wrench className="size-3 text-amber-500" /> Parts Consumption
              </span>
              <p className="font-bold text-foreground">PKR {sheet.aftersales.partsSalesPkr.toLocaleString()}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <CheckCircle2 className="size-3 text-emerald-500" /> Aftersales Rating
              </span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                {sheet.vendorEvaluation.aftersales}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Tabbed Sheet Content */}
        <Tabs defaultValue="four-wheelers" className="space-y-4 pt-2">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="four-wheelers" className="text-xs">
              4-Wheelers Inquiry Matrix
            </TabsTrigger>
            <TabsTrigger value="aftersales" className="text-xs">
              Workshop &amp; Free Service
            </TabsTrigger>
            <TabsTrigger value="two-wheelers" className="text-xs">
              2-Wheelers &amp; Audit Notes
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: 4-Wheelers Automobile Matrix */}
          <TabsContent value="four-wheelers" className="space-y-3">
            <div className="rounded-md border overflow-x-auto">
              <Table className="text-xs">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold">Automobile Model</TableHead>
                    <TableHead className="text-center">Test Drive</TableHead>
                    <TableHead className="text-center">Sales Enq</TableHead>
                    <TableHead className="text-center">Exchange Enq</TableHead>
                    <TableHead className="text-center">Used Car Enq</TableHead>
                    <TableHead className="text-center">Free Eval</TableHead>
                    <TableHead className="text-center">Financing</TableHead>
                    <TableHead className="text-center">Insurance</TableHead>
                    <TableHead className="text-center font-bold">Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sheet.fourWheelers.map((row) => (
                    <TableRow key={row.model} className={row.model === "K-Carry" ? "bg-primary/5 font-medium" : ""}>
                      <TableCell className="font-semibold flex items-center gap-1.5">
                        {row.model}
                        {row.model === "K-Carry" && (
                          <span className="rounded-full bg-primary/20 text-primary text-[9px] px-1 py-0.2">
                            New Hero
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.testDrive > 0 ? <strong>{row.testDrive}</strong> : "-"}
                      </TableCell>
                      <TableCell className="text-center">{row.salesEnquiry || "-"}</TableCell>
                      <TableCell className="text-center">{row.exchangeEnquiry || "-"}</TableCell>
                      <TableCell className="text-center">{row.usedCarEnquiry || "-"}</TableCell>
                      <TableCell className="text-center">{row.freeEvaluation || "-"}</TableCell>
                      <TableCell className="text-center">{row.financing || "-"}</TableCell>
                      <TableCell className="text-center">{row.insurance || "-"}</TableCell>
                      <TableCell className="text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        {row.conversion > 0 ? row.conversion : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold border-t-2">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-center text-primary">{total4W.testDrive}</TableCell>
                    <TableCell className="text-center">{total4W.salesEnquiry}</TableCell>
                    <TableCell className="text-center">{total4W.exchangeEnquiry}</TableCell>
                    <TableCell className="text-center">{total4W.usedCarEnquiry}</TableCell>
                    <TableCell className="text-center">{total4W.freeEvaluation}</TableCell>
                    <TableCell className="text-center">{total4W.financing}</TableCell>
                    <TableCell className="text-center">{total4W.insurance}</TableCell>
                    <TableCell className="text-center text-emerald-600 dark:text-emerald-400">
                      {total4W.conversion}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-muted-foreground text-[11px]">
              * Matches exact formatting from PSMCL Marketing Master Spreadsheet (Section: Automobile Enquiry &amp;
              Conversions).
            </p>
          </TabsContent>

          {/* Tab 2: Workshop Aftersales & Free Check-ups */}
          <TabsContent value="aftersales" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-4 space-y-3 bg-muted/10">
                <h4 className="font-semibold text-xs flex items-center gap-1.5 text-foreground">
                  <Wrench className="size-3.5 text-primary" /> Free Oil Changes Breakdown
                </h4>
                <div className="space-y-1.5">
                  {sheet.aftersales.oilChangesBreakdown?.map((item) => (
                    <div
                      key={item.model}
                      className="flex justify-between items-center text-xs py-1 border-b border-muted"
                    >
                      <span className="text-muted-foreground">{item.model}</span>
                      <strong className="font-mono">{item.qty} units</strong>
                    </div>
                  )) ?? (
                    <div className="text-xs text-muted-foreground py-2">
                      Total Oil Changes: {sheet.aftersales.oilChangesTotal}
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs pt-1 font-bold">
                    <span>Total Oil Changes Done</span>
                    <span className="text-primary">{sheet.aftersales.oilChangesTotal} vehicles</span>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4 space-y-3 bg-muted/10">
                <h4 className="font-semibold text-xs flex items-center gap-1.5 text-foreground">
                  <ShieldCheck className="size-3.5 text-primary" /> Workshop Operations &amp; Consumption
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-muted">
                    <span className="text-muted-foreground">Free Vehicle Inspections / Checkups</span>
                    <strong className="font-mono">{sheet.aftersales.freeCheckupsTotal} vehicles</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-muted">
                    <span className="text-muted-foreground">Next Appointments Given (3 Months)</span>
                    <strong className="font-mono">{sheet.aftersales.nextAppointmentsTotal} scheduled</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-muted">
                    <span className="text-muted-foreground">Parts &amp; Accessories Sales (PKR)</span>
                    <strong className="font-mono text-foreground">
                      PKR {sheet.aftersales.partsSalesPkr.toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center pt-1 font-bold">
                    <span>Estimated 3S Service Revenue</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      PKR {sheet.aftersales.serviceRevenuePkr.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: 2-Wheelers & Supervisor Observations */}
          <TabsContent value="two-wheelers" className="space-y-4">
            <div className="rounded-md border overflow-x-auto">
              <Table className="text-xs">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold">Motorcycle Model</TableHead>
                    <TableHead className="text-center">Test Ride</TableHead>
                    <TableHead className="text-center">Sales Enquiry</TableHead>
                    <TableHead className="text-center font-bold">Sales Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sheet.twoWheelers.map((row) => (
                    <TableRow key={row.model}>
                      <TableCell className="font-medium">{row.model}</TableCell>
                      <TableCell className="text-center">{row.testDrive}</TableCell>
                      <TableCell className="text-center">{row.salesEnquiry}</TableCell>
                      <TableCell className="text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        {row.salesConversion}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold border-t-2">
                    <TableCell>TOTAL 2-WHEELERS</TableCell>
                    <TableCell className="text-center">{total2W.testDrive}</TableCell>
                    <TableCell className="text-center">{total2W.salesEnquiry}</TableCell>
                    <TableCell className="text-center text-emerald-600 dark:text-emerald-400">
                      {total2W.salesConversion}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Vendor Evaluation and Observations */}
            <div className="rounded-md border p-4 bg-muted/10 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-semibold text-xs">Supervisor Vendor Evaluation</h4>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    Sales: {sheet.vendorEvaluation.sales}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    Aftersales: {sheet.vendorEvaluation.aftersales}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    Used Car: {sheet.vendorEvaluation.usedCar}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Field Observations &amp; Market Insights
                </span>
                <p className="mt-1 text-xs text-foreground bg-background p-3 rounded border italic">
                  "{sheet.observation}"
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t pt-3 flex sm:justify-between items-center gap-2">
          <span className="text-muted-foreground text-xs">
            Audit verified by {sheet.supervisorOG} (OG) &amp; {sheet.supervisorPS} (PSMC)
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Download className="size-3.5" />
              Export Sheet (.xlsx)
            </Button>
            <Button size="sm" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
