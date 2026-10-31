"use client";

import { useState, useEffect } from "react";

import { CheckCircle2, Megaphone, Plus, UserPlus, Users, Radio, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CUSTOMER_INTERCEPTIONS } from "@/data/suzuki-express/customer-interceptions";
import { TOUR_CITIES } from "@/data/suzuki-express/tour-schedule";
import type { AcquisitionChannel } from "@/data/suzuki-express/types";
import { supabase } from "@/lib/supabase";

const MARKETING_CHANNELS: AcquisitionChannel[] = [
  "Auto Rickshaw Banner",
  "Street Banner",
  "Facebook",
  "Dealership Calls",
  "Flyer",
  "Recorded Calls",
  "Youtube",
  "Television",
];

export function CustomerInterceptionForm() {
  const [items, setItems] = useState<any[]>(CUSTOMER_INTERCEPTIONS.slice(0, 8));
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [age, setAge] = useState("35");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<AcquisitionChannel>("Auto Rickshaw Banner");
  const [city, setCity] = useState("Usta Muhammad");
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch live entries from Supabase on mount & subscribe to Realtime updates
  useEffect(() => {
    async function loadInterceptions() {
      const { data, error } = await supabase
        .from("customer_interceptions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          sNo: d.s_no,
          name: d.name,
          gender: d.gender,
          age: d.age,
          contactNo: d.contact_no,
          channel: d.channel,
          city: d.city,
          eventDate: d.event_date,
          createdAt: d.created_at,
        }));
        setItems(mapped);
      }
    }

    loadInterceptions();

    // Subscribe to live WebSocket updates from Supabase
    const subscription = supabase
      .channel("public:customer_interceptions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "customer_interceptions" },
        (payload: any) => {
          const row = payload.new;
          setItems((prev) => [
            {
              id: row.id,
              sNo: row.s_no,
              name: row.name,
              gender: row.gender,
              age: row.age,
              contactNo: row.contact_no,
              channel: row.channel,
              city: row.city,
              eventDate: row.event_date,
              createdAt: row.created_at,
            },
            ...prev,
          ]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    const pktDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const newEntry = {
      name,
      gender,
      age: parseInt(age) || 30,
      contact_no: phone,
      channel,
      city,
      event_date: pktDate,
      supervisor_name: "Lead Supervisor",
    };

    try {
      const { data, error } = await supabase.from("customer_interceptions").insert(newEntry).select().single();

      if (!error && data) {
        setToastMessage(`Logged ${data.name} to Supabase in real-time!`);
      } else {
        // Fallback local update
        setItems((prev) => [
          {
            id: `INT-LIVE-${Date.now()}`,
            sNo: prev.length + 1,
            name,
            gender,
            age: parseInt(age) || 30,
            contactNo: phone,
            channel,
            city,
            eventDate: pktDate,
          },
          ...prev,
        ]);
        setToastMessage(`Logged ${name} locally!`);
      }
    } catch (err) {
      console.warn("Supabase insert error:", err);
    } finally {
      setIsSubmitting(false);
      setName("");
      setPhone("");
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Entry Form */}
      <Card className="lg:col-span-5 shadow-sm">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserPlus className="size-4 text-primary" />
            Visitor Interception Quick-Logger
          </CardTitle>
          <CardDescription className="text-xs">
            Log walk-in attendee demographics and marketing source attribution
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          {toastMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-md bg-emerald-500/10 p-2.5 text-xs text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              <span>{toastMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="visitor-name" className="text-xs font-semibold">
                Customer Name *
              </Label>
              <Input
                id="visitor-name"
                placeholder="e.g. Tariq Mehmood"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="visitor-gender" className="text-xs font-semibold">
                  Gender
                </Label>
                <Select value={gender} onValueChange={(v) => setGender(v as "Male" | "Female")}>
                  <SelectTrigger id="visitor-gender" className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="visitor-age" className="text-xs font-semibold">
                  Age
                </Label>
                <Input
                  id="visitor-age"
                  type="number"
                  min="18"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="visitor-phone" className="text-xs font-semibold">
                Contact Number *
              </Label>
              <Input
                id="visitor-phone"
                placeholder="0300-1234567"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="visitor-channel" className="text-xs font-semibold">
                How did you learn about this event?
              </Label>
              <Select value={channel} onValueChange={(v) => setChannel(v as AcquisitionChannel)}>
                <SelectTrigger id="visitor-channel" className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MARKETING_CHANNELS.map((ch) => (
                    <SelectItem key={ch} value={ch}>
                      {ch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="visitor-city" className="text-xs font-semibold">
                  Tour Stop / City
                </Label>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <Lock className="size-2.5" />
                  Locked (Schedule)
                </span>
              </div>
              <div className="h-8 px-2.5 flex items-center justify-between bg-muted/60 rounded-md border text-xs font-semibold text-foreground select-none">
                <span>{city}</span>
                <span className="text-[10px] text-muted-foreground font-medium">Active Tour Schedule</span>
              </div>
            </div>

            <Button type="submit" size="sm" className="w-full gap-2 mt-2">
              <Plus className="size-3.5" />
              Add Customer Interception
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Interception Activity Feed */}
      <Card className="lg:col-span-7 shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Megaphone className="size-4 text-primary" />
                Live Interception Log Feed
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time stream of intercepted visitors and marketing source verification
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[11px] font-normal">
              {items.length} Entries
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 text-[11px]">
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Date &amp; Time (PKT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="text-xs">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {item.gender}, {item.age} yrs
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-[11px]">{item.contactNo}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {item.channel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-[11px]">{item.city}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-xs">{item.eventDate || "2026-10-31"}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {item.createdAt
                            ? new Intl.DateTimeFormat("en-US", {
                                timeZone: "Asia/Karachi",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }).format(new Date(item.createdAt))
                            : "PKT"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
