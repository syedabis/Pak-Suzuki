"use client";

import { useState } from "react";

import { CheckCircle2, Flame, Send, Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TOUR_CITIES } from "@/data/suzuki-express/tour-schedule";
import { supabase } from "@/lib/supabase";

export function KCarrySurveyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    mobileNo: "",
    campaignLocation: "Usta Muhammad",
    leadStatus: "Hot",
    mainOccupation: "Farmer / Agriculture",
    mainRequirement: "Goods Transportation",
    currentVehicle: "Suzuki Ravi",
    mostImportantFeature: "Fuel Economy",
    biggestTransportProblem: "High Fuel Cost",
    heardAboutKCarryBefore: "Yes",
    knowsReplacementForRavi: "Yes",
    suitableReplacementForRavi: "Yes",
    reasonablePriceRange: "PKR 22–24 lakh",
    wouldConsiderBuying: "Definitely Yes",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.mobileNo.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.from("k_carry_surveys").insert({
        respondent_name: formData.customerName.trim(),
        contact_no: formData.mobileNo.trim(),
        city: formData.campaignLocation,
        lead_status: formData.leadStatus,
        main_occupation: formData.mainOccupation,
        main_requirement: formData.mainRequirement,
        current_vehicle: formData.currentVehicle,
        most_important_feature: formData.mostImportantFeature,
        biggest_transport_problem: formData.biggestTransportProblem,
        heard_about_kcarry_before: formData.heardAboutKCarryBefore,
        knows_replacement_for_ravi: formData.knowsReplacementForRavi,
        suitable_replacement_for_ravi: formData.suitableReplacementForRavi,
        reasonable_price_range: formData.reasonablePriceRange,
        would_consider_buying: formData.wouldConsiderBuying,
        notes: formData.notes.trim() || "",
        supervisor_name: "Web Portal Admin",
      });

      if (error) {
        console.warn("Supabase survey insert error:", error);
        setErrorMessage("Failed to save to cloud database. Please try again.");
      } else {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData((prev) => ({
            ...prev,
            customerName: "",
            mobileNo: "",
            notes: "",
          }));
        }, 3500);
      }
    } catch (err: any) {
      console.warn("Survey submit error:", err);
      setErrorMessage("Network error connecting to Supabase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-sm">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              K-CARRY Customer Feedback Survey
              <span className="text-xs font-normal rounded-full bg-primary/10 text-primary px-2.5 py-0.5">
                Season 5 Rural Tour
              </span>
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Data collection questionnaire authorized by Pak Suzuki Motor Company Ltd
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Lead Status:</span>
            <div className="flex gap-1">
              {(["Hot", "Warm", "Cold"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, leadStatus: status })}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                    formData.leadStatus === status
                      ? status === "Hot"
                        ? "bg-rose-500 text-white shadow-xs"
                        : status === "Warm"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-slate-700 text-white shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {status === "Hot" && "🔥 "}
                  {status === "Warm" && "⚡ "}
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-10" />
            </div>
            <h3 className="font-semibold text-lg">Survey Logged Successfully!</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Lead for <strong>{formData.customerName || "Customer"}</strong> registered under{" "}
              <strong>{formData.campaignLocation}</strong>. The data has been queued for sync with the central IMS
              reporting system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg border">
              <div className="space-y-1.5">
                <Label htmlFor="cust-name" className="text-xs font-semibold">
                  Customer Full Name *
                </Label>
                <Input
                  id="cust-name"
                  placeholder="e.g. Ghulam Rasool Bhatti"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cust-phone" className="text-xs font-semibold">
                  Mobile Number *
                </Label>
                <Input
                  id="cust-phone"
                  placeholder="0300-1234567"
                  required
                  value={formData.mobileNo}
                  onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tour-city" className="text-xs font-semibold">
                  Campaign Location (Tour Stop) *
                </Label>
                <Select
                  value={formData.campaignLocation}
                  onValueChange={(val) => setFormData({ ...formData, campaignLocation: val })}
                >
                  <SelectTrigger id="tour-city" className="h-9 text-sm">
                    <SelectValue placeholder="Select Tour City" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOUR_CITIES.map((c) => (
                      <SelectItem key={c.city} value={c.city}>
                        #{c.serialNo} {c.city} ({c.region})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SECTION A */}
            <div className="space-y-4 pt-2">
              <div className="border-b pb-1">
                <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">
                  Section A: Customer Usage & Utility Needs
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Q1 */}
                <div className="space-y-2 rounded-md border p-3.5 bg-card">
                  <Label className="text-xs font-semibold">1. What is your main occupation?</Label>
                  <RadioGroup
                    value={formData.mainOccupation}
                    onValueChange={(v) => setFormData({ ...formData, mainOccupation: v })}
                    className="grid grid-cols-2 gap-2 pt-1"
                  >
                    {[
                      "Farmer / Agriculture",
                      "Business / Trader",
                      "Shopkeeper",
                      "Transport / Delivery",
                      "Job / Employee",
                      "Other",
                    ].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`occ-${opt}`} className="size-3.5" />
                        <Label htmlFor={`occ-${opt}`} className="text-xs font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q2 */}
                <div className="space-y-2 rounded-md border p-3.5 bg-card">
                  <Label className="text-xs font-semibold">2. What is your main utility requirement?</Label>
                  <RadioGroup
                    value={formData.mainRequirement}
                    onValueChange={(v) => setFormData({ ...formData, mainRequirement: v })}
                    className="grid grid-cols-2 gap-2 pt-1"
                  >
                    {[
                      "Agriculture / Farm Work",
                      "Goods Transportation",
                      "Business / Shop",
                      "Delivery",
                      "Personal / Family Use",
                      "Other",
                    ].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`req-${opt}`} className="size-3.5" />
                        <Label htmlFor={`req-${opt}`} className="text-xs font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q3 */}
                <div className="space-y-2 rounded-md border p-3.5 bg-card md:col-span-2">
                  <Label className="text-xs font-semibold">
                    3. What vehicle do you currently use for carrying goods?
                  </Label>
                  <RadioGroup
                    value={formData.currentVehicle}
                    onValueChange={(v) => setFormData({ ...formData, currentVehicle: v })}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1"
                  >
                    {[
                      "Suzuki Ravi",
                      "FAW — Carrier",
                      "Hyundai — Shehzore",
                      "Forland — C10 / C10 Fortis",
                      "JAC — X200",
                      "Changan — M9 / other",
                      "Tractor / Trolley",
                      "Motorcycle / Loader",
                      "No Vehicle",
                    ].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`veh-${opt}`} className="size-3.5" />
                        <Label htmlFor={`veh-${opt}`} className="text-xs font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q4 */}
                <div className="space-y-2 rounded-md border p-3.5 bg-card">
                  <Label className="text-xs font-semibold">
                    4. Most important feature expected from utility vehicle?
                  </Label>
                  <RadioGroup
                    value={formData.mostImportantFeature}
                    onValueChange={(v) => setFormData({ ...formData, mostImportantFeature: v })}
                    className="grid grid-cols-2 gap-2 pt-1"
                  >
                    {[
                      "Load Carrying Capacity",
                      "Fuel Economy",
                      "Durability",
                      "Low Maintenance Cost",
                      "Comfort",
                      "Price",
                    ].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`feat-${opt}`} className="size-3.5" />
                        <Label htmlFor={`feat-${opt}`} className="text-xs font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q5 */}
                <div className="space-y-2 rounded-md border p-3.5 bg-card">
                  <Label className="text-xs font-semibold">5. Biggest challenge with current transport?</Label>
                  <RadioGroup
                    value={formData.biggestTransportProblem}
                    onValueChange={(v) => setFormData({ ...formData, biggestTransportProblem: v })}
                    className="grid grid-cols-2 gap-2 pt-1"
                  >
                    {[
                      "High Fuel Cost",
                      "Limited Load Capacity",
                      "High Maintenance Cost",
                      "Frequent Breakdowns",
                      "Lack of Comfort",
                      "No Major Problem",
                    ].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`prob-${opt}`} className="size-3.5" />
                        <Label htmlFor={`prob-${opt}`} className="text-xs font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* SECTION B */}
            <div className="space-y-4 pt-2">
              <div className="border-b pb-1">
                <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">
                  Section B: Suzuki K-CARRY Perception & Pricing
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Q6 */}
                <div className="space-y-2 rounded-md border p-3.5 bg-card">
                  <Label className="text-xs font-semibold">6. Before today, had you heard about Suzuki K-CARRY?</Label>
                  <RadioGroup
                    value={formData.heardAboutKCarryBefore}
                    onValueChange={(v) => setFormData({ ...formData, heardAboutKCarryBefore: v })}
                    className="flex gap-6 pt-1"
                  >
                    {["Yes", "No"].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`q6-${opt}`} />
                        <Label htmlFor={`q6-${opt}`} className="text-xs font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q7 */}
                <div className="space-y-2 rounded-md border p-3.5 bg-card">
                  <Label className="text-xs font-semibold">
                    7. Did you know K-CARRY is being introduced to replace Ravi?
                  </Label>
                  <RadioGroup
                    value={formData.knowsReplacementForRavi}
                    onValueChange={(v) => setFormData({ ...formData, knowsReplacementForRavi: v })}
                    className="flex gap-6 pt-1"
                  >
                    {["Yes", "No"].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`q7-${opt}`} />
                        <Label htmlFor={`q7-${opt}`} className="text-xs font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q8 */}
                <div className="space-y-2 rounded-md border p-3.5 bg-card">
                  <Label className="text-xs font-semibold">
                    8. After seeing K-CARRY, is it a suitable replacement for Ravi?
                  </Label>
                  <RadioGroup
                    value={formData.suitableReplacementForRavi}
                    onValueChange={(v) => setFormData({ ...formData, suitableReplacementForRavi: v })}
                    className="flex gap-4 pt-1"
                  >
                    {["Yes", "No", "Not Sure"].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`q8-${opt}`} />
                        <Label htmlFor={`q8-${opt}`} className="text-xs font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q9 */}
                <div className="space-y-2 rounded-md border p-3.5 bg-card">
                  <Label className="text-xs font-semibold">9. What price range would you consider reasonable?</Label>
                  <RadioGroup
                    value={formData.reasonablePriceRange}
                    onValueChange={(v) => setFormData({ ...formData, reasonablePriceRange: v })}
                    className="grid grid-cols-2 gap-2 pt-1"
                  >
                    {["PKR 22–24 lakh", "PKR 24–27 lakh", "PKR 28–30 lakh", "Above PKR 30 lakh"].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`q9-${opt}`} />
                        <Label htmlFor={`q9-${opt}`} className="text-xs font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q10 */}
                <div className="space-y-2 rounded-md border p-3.5 bg-card md:col-span-2">
                  <Label className="text-xs font-semibold">
                    10. If K-CARRY meets your requirements and price, would you buy?
                  </Label>
                  <RadioGroup
                    value={formData.wouldConsiderBuying}
                    onValueChange={(v) => setFormData({ ...formData, wouldConsiderBuying: v })}
                    className="flex flex-wrap gap-4 pt-1"
                  >
                    {["Definitely Yes", "Maybe / Needs More Information", "No"].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`q10-${opt}`} />
                        <Label htmlFor={`q10-${opt}`} className="text-xs font-normal cursor-pointer">
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-semibold">
                Customer Remarks / Trade-In Details
              </Label>
              <Input
                id="notes"
                placeholder="e.g. Inquiring about Meezan Islamic financing; wants evaluation on 2018 Ravi"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="h-9 text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              {errorMessage && (
                <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200">
                  {errorMessage}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, customerName: "", mobileNo: "", notes: "" })}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button type="submit" size="sm" className="gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Saving to Cloud...
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    Submit K-CARRY Survey Record
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
