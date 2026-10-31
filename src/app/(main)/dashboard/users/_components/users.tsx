"use client";
import * as React from "react";

import {
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { Download, Eye, Lock, Plus, RefreshCw, Search, Shield, UserCheck, UserPlus, Wifi } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dataTableFeatures } from "@/lib/data-table-features";
import { supabase } from "@/lib/supabase";
import { useUserSession } from "@/context/user-context";

import { filters, initialSupervisors, type SupervisorUser } from "./data";
import { usersColumns } from "./users-columns";
import { UsersTable } from "./users-table";

export function Users({ initialData }: { initialData?: SupervisorUser[] }) {
  const { isAdmin, isViewer } = useUserSession();
  const [data, setData] = React.useState<SupervisorUser[]>(initialData || initialSupervisors);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = React.useState(false);

  // Dialog State
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form State
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "paksuzuki2026",
    employee_id: `PSMC-VIEW-${Math.floor(100 + Math.random() * 900)}`,
    role: "Dashboard View Access",
    assigned_city: "Karachi",
    assigned_dealer: "Pak Suzuki Head Office",
    station_venue: "Digital Portal Viewer",
    region: "ROS",
  });

  const handleRoleChange = (newRole: string) => {
    let empPrefix = "PSMC-SUP";
    let city = form.assigned_city;
    let dealer = form.assigned_dealer;
    let venue = form.station_venue;

    if (newRole === "Dashboard View Access") {
      empPrefix = "PSMC-VIEW";
      city = "Karachi";
      dealer = "Pak Suzuki Head Office";
      venue = "Digital Portal Viewer";
    } else if (newRole === "Dashboard Admin Access" || newRole === "System Administrator") {
      empPrefix = "PSMC-ADM";
      city = "Karachi";
      dealer = "Pak Suzuki Motor Co.";
      venue = "Head Office";
    } else if (newRole === "K-Carry Form Access Only") {
      empPrefix = "PSMC-KCY";
      venue = "K-Carry Survey Station";
    } else if (newRole === "Visitor Interception Form Access Only") {
      empPrefix = "PSMC-INT";
      venue = "Visitor Interception Point";
    } else if (newRole === "Daily Master Sheet Access Only") {
      empPrefix = "PSMC-MST";
      venue = "Master Audit Station";
    } else if (newRole === "View Access for All Forms") {
      empPrefix = "PSMC-MVIEW";
      venue = "Mobile Field Viewer";
    }

    setForm((prev) => ({
      ...prev,
      role: newRole,
      employee_id: `${empPrefix}-${Math.floor(100 + Math.random() * 900)}`,
      assigned_city: city,
      assigned_dealer: dealer,
      station_venue: venue,
    }));
  };

  // Table State
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({
    search: false,
  });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch live supervisors from Supabase
  const fetchSupervisors = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: sups, error } = await supabase
        .from("supervisors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Error fetching supervisors:", error.message);
      } else if (sups && sups.length > 0) {
        setData(sups as SupervisorUser[]);
      }
    } catch (err) {
      console.warn("Network error fetching supervisors:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and Realtime Subscription
  React.useEffect(() => {
    fetchSupervisors();

    const channel = supabase
      .channel("supervisors-realtime-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "supervisors" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const newRow = payload.new as SupervisorUser;
          setData((prev) => [newRow, ...prev.filter((item) => item.id !== newRow.id)]);
          toast.info(`New supervisor added: ${newRow.name}`);
        } else if (payload.eventType === "UPDATE") {
          const updated = payload.new as SupervisorUser;
          setData((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        } else if (payload.eventType === "DELETE") {
          const deletedId = (payload.old as { id: string }).id;
          setData((prev) => prev.filter((item) => item.id !== deletedId));
        }
      })
      .subscribe((status) => {
        setIsRealtimeActive(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSupervisors]);

  // Action Handlers
  const handleToggleStatus = async (user: SupervisorUser) => {
    const updatedStatus = !user.is_active;
    try {
      const { error } = await supabase
        .from("supervisors")
        .update({ is_active: updatedStatus, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) {
        toast.error(`Failed to update status: ${error.message}`);
      } else {
        setData((prev) => prev.map((item) => (item.id === user.id ? { ...item, is_active: updatedStatus } : item)));
        toast.success(
          `Supervisor ${user.name} is now ${updatedStatus ? "Active (Can login to Mobile)" : "Deactivated (Mobile access blocked)"}`,
        );
      }
    } catch {
      toast.error("Network error while updating status");
    }
  };

  const handleDelete = async (user: SupervisorUser) => {
    if (!confirm(`Are you sure you want to delete supervisor ${user.name} (${user.email})?`)) {
      return;
    }
    try {
      const { error } = await supabase.from("supervisors").delete().eq("id", user.id);
      if (error) {
        toast.error(`Failed to delete supervisor: ${error.message}`);
      } else {
        setData((prev) => prev.filter((item) => item.id !== user.id));
        toast.success(`Supervisor ${user.name} removed successfully.`);
      }
    } catch {
      toast.error("Network error while deleting supervisor");
    }
  };

  // Create Supervisor Submit
  const handleCreateSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.employee_id.trim()) {
      toast.error("Please fill in Name, Email, Password, and Employee ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newSup = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
        employee_id: form.employee_id.trim().toUpperCase(),
        role: form.role,
        assigned_city: form.assigned_city,
        assigned_dealer: form.assigned_dealer,
        station_venue: form.station_venue,
        region: form.region,
        is_active: true,
      };

      const { data: inserted, error } = await supabase.from("supervisors").insert([newSup]).select().single();

      if (error) {
        if (error.message.includes("unique") || error.code === "23505") {
          toast.error("A supervisor with this Email or Employee ID already exists.");
        } else {
          toast.error(`Failed to create supervisor: ${error.message}`);
        }
      } else {
        if (inserted) {
          setData((prev) => [inserted as SupervisorUser, ...prev.filter((i) => i.id !== inserted.id)]);
        }
        if (form.role === "Dashboard View Access" || form.role === "Dashboard Admin Access") {
          toast.success(`User "${form.name}" created with "${form.role}"! They can now sign in at /login.`);
        } else {
          toast.success(`Supervisor "${form.name}" created! Credentials ready for Mobile App & Web.`);
        }
        setIsAddOpen(false);
        // Reset form with new random emp ID
        setForm({
          name: "",
          email: "",
          password: "paksuzuki2026",
          employee_id: `PSMC-VIEW-${Math.floor(100 + Math.random() * 900)}`,
          role: "Dashboard View Access",
          assigned_city: "Karachi",
          assigned_dealer: "Pak Suzuki Head Office",
          station_venue: "Digital Portal Viewer",
          region: "ROS",
        });
      }
    } catch {
      toast.error("Network error while creating supervisor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Employee ID", "Name", "Email", "Password", "Role", "City", "Dealer", "Venue", "Region", "Status"];
    const rows = data.map((u) => [
      u.employee_id,
      `"${u.name}"`,
      u.email,
      u.password || "paksuzuki2026",
      `"${u.role}"`,
      `"${u.assigned_city}"`,
      `"${u.assigned_dealer}"`,
      `"${u.station_venue}"`,
      u.region,
      u.is_active ? "Active" : "Deactivated",
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pak_suzuki_supervisors_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Supervisor directory exported as CSV");
  };

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns: usersColumns,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    meta: {
      onToggleStatus: handleToggleStatus,
      onDelete: handleDelete,
      isAdmin,
    },
  });

  const searchQuery = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const roleFilter = (table.getColumn("role")?.getFilterValue() as string | undefined) ?? filters.role[0];
  const cityFilter = (table.getColumn("assigned_city")?.getFilterValue() as string | undefined) ?? filters.city[0];
  const statusFilter = (table.getColumn("is_active")?.getFilterValue() as string | undefined) ?? filters.status[0];

  function setColumnSelectFilter(columnId: string, value: string) {
    if (columnId === "is_active") {
      table.getColumn(columnId)?.setFilterValue(value === "All" ? undefined : value === "Active");
    } else {
      table.getColumn(columnId)?.setFilterValue(value === "All" ? undefined : value);
    }
    table.setPageIndex(0);
  }

  return (
    <Card className="border-border">
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl leading-none font-bold">Supervisors & User Management</CardTitle>
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                isRealtimeActive
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-zinc-100 text-zinc-500 border-zinc-200"
              }`}
              title={isRealtimeActive ? "Live Supabase Realtime WebSocket Active" : "Connecting..."}
            >
              <span
                className={`size-1.5 rounded-full ${isRealtimeActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`}
              />
              {isRealtimeActive ? "Live Cloud Sync" : "Syncing"}
            </div>
          </div>
          <CardDescription className="max-w-xl leading-snug mt-1 text-xs text-muted-foreground">
            Manage field supervisors, territorial assignments, and mobile login credentials for the Pak Suzuki Caravan
            2026 App.
          </CardDescription>
        </div>

        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-8 w-full md:w-60">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-8 text-xs"
              placeholder="Search supervisors..."
              value={searchQuery}
              onChange={(event) => {
                table.getColumn("search")?.setFilterValue(event.target.value || undefined);
                table.setPageIndex(0);
              }}
            />
          </InputGroup>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchSupervisors}
            disabled={isLoading}
            className="h-8 text-xs gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-8 text-xs gap-1.5">
            <Download className="size-3.5" /> Export Directory
          </Button>

          {isAdmin ? (
            <Button
              size="sm"
              onClick={() => setIsAddOpen(true)}
              className="h-8 text-xs gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              <UserPlus className="size-3.5" /> + Add User
            </Button>
          ) : (
            <Button
              size="sm"
              disabled
              variant="outline"
              className="h-8 text-xs gap-1.5 opacity-60 cursor-not-allowed"
              title="Only Dashboard Admins can create new users"
            >
              <Lock className="size-3.5" /> + Add User (Admin Only)
            </Button>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-0">
        {!isAdmin && (
          <div className="mx-4 mt-2 flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3.5 py-2.5 text-xs text-blue-700 dark:text-blue-300">
            <Eye className="size-4 shrink-0 text-blue-500" />
            <span>
              <strong>Dashboard View Access:</strong> You are currently logged in with read-only view access. Adding,
              deactivating, or deleting users is restricted to Dashboard Administrators.
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={(value) => setColumnSelectFilter("role", value)}>
              <SelectTrigger size="sm" className="h-8 text-xs">
                <span className="text-muted-foreground mr-1">Role:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {filters.role.map((option) => (
                    <SelectItem key={option} value={option} className="text-xs">
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* City Filter */}
            <Select value={cityFilter} onValueChange={(value) => setColumnSelectFilter("assigned_city", value)}>
              <SelectTrigger size="sm" className="h-8 text-xs">
                <span className="text-muted-foreground mr-1">City:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {filters.city.map((option) => (
                    <SelectItem key={option} value={option} className="text-xs">
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => setColumnSelectFilter("is_active", value)}>
              <SelectTrigger size="sm" className="h-8 text-xs">
                <span className="text-muted-foreground mr-1">Status:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {filters.status.map((option) => (
                    <SelectItem key={option} value={option} className="text-xs">
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-muted-foreground font-mono">
            Total Supervisors: <span className="font-bold text-foreground">{data.length}</span> (Active:{" "}
            {data.filter((d) => d.is_active).length})
          </div>
        </div>

        {/* Data Table */}
        <UsersTable table={table} />
      </CardContent>

      {/* ADD SUPERVISOR / USER MODAL DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="size-5" />
              Create New User / Supervisor
            </DialogTitle>
            <DialogDescription className="text-xs">
              This will create a new user account in Supabase. Assign &quot;Dashboard View Access&quot; for read-only
              access, or &quot;Dashboard Admin Access&quot; for full administrative permissions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSupervisor} className="space-y-3.5 py-2">
            {/* 1. Account Role (Full Width for perfect alignment) */}
            <div className="space-y-1.5">
              <Label htmlFor="sup-role" className="text-xs font-semibold">
                Account Role *
              </Label>
              <Select value={form.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="sup-role" className="h-9 w-full min-w-0 text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="K-Carry Form Access Only">📱 K-Carry Form Access Only (Mobile App)</SelectItem>
                  <SelectItem value="Visitor Interception Form Access Only">
                    📱 Visitor Interception Access Only (Mobile App)
                  </SelectItem>
                  <SelectItem value="Daily Master Sheet Access Only">
                    📱 Daily Master Sheet Access Only (Mobile App)
                  </SelectItem>
                  <SelectItem value="View Access for All Forms">
                    📱 View Access for All Forms (Mobile App - Read Only)
                  </SelectItem>
                  <SelectItem value="On-Ground Lead Supervisor">
                    📱 On-Ground Lead Supervisor (Mobile App - Full Access)
                  </SelectItem>
                  <SelectItem value="Dashboard View Access">
                    🌐 Dashboard View Access (Web Portal - Read Only)
                  </SelectItem>
                  <SelectItem value="Dashboard Admin Access">
                    🌐 Dashboard Admin Access (Web Portal - Full Control)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Full Name & Employee ID */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 min-w-0">
                <Label htmlFor="sup-name" className="text-xs font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="sup-name"
                  placeholder="e.g. Asad Khan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="h-8 text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label htmlFor="sup-empid" className="text-xs font-semibold">
                  Employee ID *
                </Label>
                <Input
                  id="sup-empid"
                  placeholder="PSMC-VIEW-109"
                  value={form.employee_id}
                  onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                  required
                  className="h-8 text-xs font-mono uppercase w-full"
                />
              </div>
            </div>

            {/* 3. Login Email & Login Password */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 min-w-0">
                <Label htmlFor="sup-email" className="text-xs font-semibold">
                  Login Email *
                </Label>
                <Input
                  id="sup-email"
                  type="email"
                  placeholder="name@paksuzuki.com.pk"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="h-8 text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label htmlFor="sup-password" className="text-xs font-semibold">
                  Login Password *
                </Label>
                <Input
                  id="sup-password"
                  placeholder="paksuzuki2026"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="h-8 text-xs font-mono w-full"
                />
              </div>
            </div>

            {/* 4. City & Dealer */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 min-w-0">
                <Label htmlFor="sup-city" className="text-xs font-semibold">
                  Assigned City *
                </Label>
                <Input
                  id="sup-city"
                  placeholder="e.g. Karachi"
                  value={form.assigned_city}
                  onChange={(e) => setForm({ ...form, assigned_city: e.target.value })}
                  required
                  className="h-8 text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label htmlFor="sup-dealer" className="text-xs font-semibold">
                  Assigned Dealer *
                </Label>
                <Input
                  id="sup-dealer"
                  placeholder="e.g. Suzuki Jacobabad Motors"
                  value={form.assigned_dealer}
                  onChange={(e) => setForm({ ...form, assigned_dealer: e.target.value })}
                  required
                  className="h-8 text-xs w-full"
                />
              </div>
            </div>

            {/* 5. Venue & Region */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 min-w-0">
                <Label htmlFor="sup-venue" className="text-xs font-semibold">
                  Station Venue *
                </Label>
                <Input
                  id="sup-venue"
                  placeholder="e.g. Grain Market Ground"
                  value={form.station_venue}
                  onChange={(e) => setForm({ ...form, station_venue: e.target.value })}
                  required
                  className="h-8 text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label htmlFor="sup-region" className="text-xs font-semibold">
                  Region
                </Label>
                <Select value={form.region} onValueChange={(val) => setForm({ ...form, region: val })}>
                  <SelectTrigger className="h-8 text-xs w-full min-w-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROS">ROS (Rest of Sindh / Rural)</SelectItem>
                    <SelectItem value="ROSP">ROSP (Rest of Sindh Plains)</SelectItem>
                    <SelectItem value="South">South Region</SelectItem>
                    <SelectItem value="North">North Region</SelectItem>
                    <SelectItem value="Central">Central Region</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                disabled={isSubmitting}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {isSubmitting ? "Creating Supervisor..." : "Create & Activate Supervisor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
