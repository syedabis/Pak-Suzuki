"use client";

import { useState } from "react";

import { CheckCircle2, FileSpreadsheet, Save, Loader2, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TOUR_CITIES } from "@/data/suzuki-express/tour-schedule";
import { supabase } from "@/lib/supabase";

const FOUR_WHEELERS = ["Alto", "Cultus", "WagonR", "Swift", "Every", "Ravi", "K-Carry"] as const;
const TWO_WHEELERS = ["GD 110S", "GS 150", "GSX 125", "GR 150"] as const;

export function DailyInquirySheetForm() {
  const [city, setCity] = useState("Usta Muhammad");
  const [venue, setVenue] = useState("Grain Market Exhibition Ground");
  const [dealer, setDealer] = useState("Suzuki Jacobabad Motors");
  const [ogSupervisor, setOgSupervisor] = useState("Gohar Ali");
  const [psSupervisor, setPsSupervisor] = useState("Usama Fareed");
  const [footfall, setFootfall] = useState("168");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Aftersales
  const [oilChanges, setOilChanges] = useState("42");
  const [checkups, setCheckups] = useState("96");
  const [appointments, setAppointments] = useState("58");
  const [partsSales, setPartsSales] = useState("62400");
  const [observation, setObservation] = useState(
    "Parts counter established; strong interest in K-Carry rural payload capacity.",
  );

  const [saved, setSaved] = useState(false);

  const [fourWheelData, setFourWheelData] = useState<Record<string, Record<string, number>>>({
    Alto: {
      testDrive: 0,
      salesEnquiry: 20,
      exchangeEnquiry: 18,
      usedCarEnquiry: 12,
      freeEvaluation: 32,
      financing: 6,
      insurance: 8,
      conversion: 2,
    },
    Cultus: {
      testDrive: 0,
      salesEnquiry: 5,
      exchangeEnquiry: 4,
      usedCarEnquiry: 6,
      freeEvaluation: 9,
      financing: 1,
      insurance: 2,
      conversion: 0,
    },
    WagonR: {
      testDrive: 0,
      salesEnquiry: 3,
      exchangeEnquiry: 2,
      usedCarEnquiry: 4,
      freeEvaluation: 4,
      financing: 1,
      insurance: 1,
      conversion: 0,
    },
    Swift: {
      testDrive: 0,
      salesEnquiry: 7,
      exchangeEnquiry: 3,
      usedCarEnquiry: 5,
      freeEvaluation: 6,
      financing: 2,
      insurance: 3,
      conversion: 1,
    },
    Every: {
      testDrive: 24,
      salesEnquiry: 15,
      exchangeEnquiry: 4,
      usedCarEnquiry: 3,
      freeEvaluation: 7,
      financing: 3,
      insurance: 3,
      conversion: 1,
    },
    Ravi: {
      testDrive: 0,
      salesEnquiry: 0,
      exchangeEnquiry: 14,
      usedCarEnquiry: 9,
      freeEvaluation: 18,
      financing: 0,
      insurance: 0,
      conversion: 0,
    },
    "K-Carry": {
      testDrive: 38,
      salesEnquiry: 22,
      exchangeEnquiry: 11,
      usedCarEnquiry: 0,
      freeEvaluation: 20,
      financing: 7,
      insurance: 6,
      conversion: 2,
    },
  });

  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    const found = TOUR_CITIES.find((c) => c.city === cityName);
    if (found) {
      setVenue(found.venue);
      setDealer(found.dealer);
    }
  };

  const handleCellChange = (model: string, field: string, val: string) => {
    const num = parseInt(val) || 0;
    setFourWheelData((prev) => ({
      ...prev,
      [model]: {
        ...prev[model],
        [field]: num,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const everyTestDrives = fourWheelData.Every?.testDrive || 0;
      const kCarryTestDrives = fourWheelData["K-Carry"]?.testDrive || 0;
      const tradeInEvaluations = fourWheelData.Alto?.freeEvaluation || 0;

      const { error } = await supabase.from("daily_master_sheets").insert({
        city,
        dealer,
        venue,
        event_date: new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Karachi",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date()),
        customer_footfall: parseInt(footfall) || 0,
        timings: new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Karachi",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
        supervisor_og: ogSupervisor,
        supervisor_ps: psSupervisor,
        four_wheel_data: fourWheelData,
        every_test_drives: everyTestDrives,
        k_carry_test_drives: kCarryTestDrives,
        trade_in_evaluations: tradeInEvaluations,
        free_inspections: parseInt(checkups) || 0,
        free_oil_changes: parseInt(oilChanges) || 0,
        appointments_given: parseInt(appointments) || 0,
        genuine_parts_revenue_pkr: parseInt(partsSales) || 0,
        dealer_rating: "Excellent",
        supervisor_notes: observation,
      });

      if (error) {
        console.warn("Supabase master sheet insert error:", error);
        setErrorMessage("Failed to save to cloud database. Please try again.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      }
    } catch (err: any) {
      console.warn("Master sheet error:", err);
      setErrorMessage("Network error connecting to Supabase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-5xl mx-auto shadow-sm">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="size-5 text-primary" />
              Daily Event Master Inquiry Sheet
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Official Pak Suzuki On-Ground & PSMC Supervisor Reporting Format
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs w-fit">
            Master Form Template
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {saved && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
            <span>Master Inquiry Sheet saved successfully and synced with IMS database.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Event Header Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg border">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Tour City</Label>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <Lock className="size-2.5" />
                  Locked (Schedule)
                </span>
              </div>
              <div className="h-8 px-2.5 flex items-center justify-between bg-muted/60 rounded-md border text-xs font-semibold text-foreground select-none">
                <span>{city}</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                  Active Stop
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Venue</Label>
              <Input value={venue} readOnly className="h-8 text-xs bg-muted/50 cursor-not-allowed" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Participating Dealer</Label>
              <Input value={dealer} readOnly className="h-8 text-xs bg-muted/50 cursor-not-allowed" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Customer Footfall</Label>
              <Input
                type="number"
                value={footfall}
                onChange={(e) => setFootfall(e.target.value)}
                className="h-8 text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">OG Supervisor</Label>
              <Input value={ogSupervisor} onChange={(e) => setOgSupervisor(e.target.value)} className="h-8 text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">PSMC Supervisor</Label>
              <Input value={psSupervisor} onChange={(e) => setPsSupervisor(e.target.value)} className="h-8 text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Timestamp (PKT)</Label>
              <div className="h-8 px-2.5 flex items-center bg-muted/60 rounded-md border text-xs font-medium text-muted-foreground select-none">
                Auto-captured (PKT)
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Region</Label>
              <Input
                value={
                  city.includes("Umerkot") ||
                  city.includes("Badin") ||
                  city.includes("Jamshoro") ||
                  city.includes("Usta") ||
                  city.includes("Khairpur")
                    ? "ROS (Sindh)"
                    : "ROSP (Punjab)"
                }
                disabled
                className="h-8 text-xs bg-muted"
              />
            </div>
          </div>

          {/* 4-Wheeler Automobile Matrix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b pb-1">
              <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">
                Automobile Matrix (4W Models)
              </h4>
              <span className="text-[11px] text-muted-foreground">Inquiries, Test Drives & On-Spot Conversions</span>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 text-[11px]">
                    <TableHead className="font-semibold">Model</TableHead>
                    <TableHead className="text-center">Test Drive</TableHead>
                    <TableHead className="text-center">Sales Enq</TableHead>
                    <TableHead className="text-center">Exchange Enq</TableHead>
                    <TableHead className="text-center">Used Car Enq</TableHead>
                    <TableHead className="text-center">Evaluation</TableHead>
                    <TableHead className="text-center">Financing</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FOUR_WHEELERS.map((model) => {
                    const row = fourWheelData[model] || {};
                    return (
                      <TableRow key={model} className="text-xs">
                        <TableCell className="font-semibold">{model}</TableCell>
                        <TableCell className="p-1 text-center">
                          <Input
                            type="number"
                            value={row.testDrive || 0}
                            onChange={(e) => handleCellChange(model, "testDrive", e.target.value)}
                            className="h-7 w-16 text-center mx-auto text-xs"
                          />
                        </TableCell>
                        <TableCell className="p-1 text-center">
                          <Input
                            type="number"
                            value={row.salesEnquiry || 0}
                            onChange={(e) => handleCellChange(model, "salesEnquiry", e.target.value)}
                            className="h-7 w-16 text-center mx-auto text-xs"
                          />
                        </TableCell>
                        <TableCell className="p-1 text-center">
                          <Input
                            type="number"
                            value={row.exchangeEnquiry || 0}
                            onChange={(e) => handleCellChange(model, "exchangeEnquiry", e.target.value)}
                            className="h-7 w-16 text-center mx-auto text-xs"
                          />
                        </TableCell>
                        <TableCell className="p-1 text-center">
                          <Input
                            type="number"
                            value={row.usedCarEnquiry || 0}
                            onChange={(e) => handleCellChange(model, "usedCarEnquiry", e.target.value)}
                            className="h-7 w-16 text-center mx-auto text-xs"
                          />
                        </TableCell>
                        <TableCell className="p-1 text-center">
                          <Input
                            type="number"
                            value={row.freeEvaluation || 0}
                            onChange={(e) => handleCellChange(model, "freeEvaluation", e.target.value)}
                            className="h-7 w-16 text-center mx-auto text-xs"
                          />
                        </TableCell>
                        <TableCell className="p-1 text-center">
                          <Input
                            type="number"
                            value={row.financing || 0}
                            onChange={(e) => handleCellChange(model, "financing", e.target.value)}
                            className="h-7 w-16 text-center mx-auto text-xs"
                          />
                        </TableCell>
                        <TableCell className="p-1 text-center font-bold">
                          <Input
                            type="number"
                            value={row.conversion || 0}
                            onChange={(e) => handleCellChange(model, "conversion", e.target.value)}
                            className="h-7 w-16 text-center mx-auto text-xs font-bold bg-primary/5 border-primary/30"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Aftersales & Workshop Operations */}
          <div className="space-y-2">
            <div className="border-b pb-1">
              <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">
                Aftersales, Workshop & Parts Consumption
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg border">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Free Check-ups Done (Qty)</Label>
                <Input
                  type="number"
                  value={checkups}
                  onChange={(e) => setCheckups(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Free Oil Changes Done (Qty)</Label>
                <Input
                  type="number"
                  value={oilChanges}
                  onChange={(e) => setOilChanges(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Next Appointments Given</Label>
                <Input
                  type="number"
                  value={appointments}
                  onChange={(e) => setAppointments(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Parts Sales & Consumption (PKR)</Label>
                <Input
                  type="number"
                  value={partsSales}
                  onChange={(e) => setPartsSales(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Supervisor Field Observation / Special Remarks</Label>
            <Input value={observation} onChange={(e) => setObservation(e.target.value)} className="h-8 text-xs" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            {errorMessage && (
              <span className="text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-1.5 rounded border border-red-200">
                {errorMessage}
              </span>
            )}
            <Button type="submit" size="sm" className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving to Cloud...
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  Save Master Event Inquiry Record
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
