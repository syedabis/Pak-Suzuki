"use client";
import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";
import { cn } from "cn";
import {
  Copy,
  Eye,
  EyeOff,
  FileText,
  MoreHorizontal,
  Power,
  Shield,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { getInitials } from "@/lib/utils";

import { statusMeta, type SupervisorUser } from "./data";

function PasswordCell({ password }: { password?: string }) {
  const [show, setShow] = useState(false);
  const val = password || "paksuzuki2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(val);
    toast.success("Password copied to clipboard");
  };

  return (
    <div className="flex items-center gap-1.5 font-mono text-xs">
      <span className="bg-muted px-2 py-0.5 rounded text-foreground">{show ? val : "••••••••"}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 text-muted-foreground hover:text-foreground"
        onClick={() => setShow(!show)}
        title={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 text-muted-foreground hover:text-foreground"
        onClick={handleCopy}
        title="Copy password"
      >
        <Copy className="size-3.5" />
      </Button>
    </div>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  const status = isActive ? "Active" : "Deactivated";
  const meta = statusMeta[status];

  return (
    <Badge className={cn("gap-1.5 border px-2 py-0.5 font-medium text-xs", meta.badgeClass)} variant="outline">
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {status}
    </Badge>
  );
}

function RoleBadge({ role }: { role: string }) {
  const normalized = role.toLowerCase().trim();
  if (normalized.includes("admin")) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-zinc-900/20 bg-zinc-900/10 text-zinc-900 dark:border-zinc-100/20 dark:bg-zinc-100/10 dark:text-zinc-100 font-semibold text-xs py-0.5 px-2"
      >
        <Shield className="size-3 text-primary" />
        {role}
      </Badge>
    );
  }
  if (normalized.includes("k-carry") || normalized.includes("kcarry")) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold text-xs py-0.5 px-2"
      >
        <Sparkles className="size-3 text-amber-500" />
        {role}
      </Badge>
    );
  }
  if (normalized.includes("interception") || normalized.includes("visitor")) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-xs py-0.5 px-2"
      >
        <Users className="size-3 text-emerald-500" />
        {role}
      </Badge>
    );
  }
  if (normalized.includes("master")) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400 font-semibold text-xs py-0.5 px-2"
      >
        <FileText className="size-3 text-purple-500" />
        {role}
      </Badge>
    );
  }
  if (normalized.includes("view") || normalized.includes("viewer")) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-xs py-0.5 px-2"
      >
        <Eye className="size-3 text-blue-500" />
        {role}
      </Badge>
    );
  }
  return <span className="text-xs font-medium text-foreground">{role}</span>;
}

export const usersColumns: ColumnDef<DataTableFeatures, SupervisorUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Subscribe
          source={table.atoms.rowSelection}
          selector={() =>
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected() && "indeterminate")
          }
        >
          {(checked) => (
            <Checkbox
              aria-label="Select all supervisors"
              checked={checked}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
          )}
        </Subscribe>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
          {(checked) => (
            <Checkbox
              aria-label={`Select ${row.original.name}`}
              checked={checked}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
          )}
        </Subscribe>
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "search",
    accessorFn: (row) => `${row.name} ${row.email} ${row.employee_id} ${row.assigned_city} ${row.assigned_dealer}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "Supervisor / User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar size="sm" className="font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
          <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate font-semibold text-foreground text-sm flex items-center gap-1.5">
            {row.original.name}
            {row.original.role === "System Administrator" && <Shield className="size-3.5 text-zinc-500" />}
          </div>
          <div className="truncate text-muted-foreground text-xs">{row.original.email}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "employee_id",
    header: "Emp ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded border border-border">
        {row.original.employee_id}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    filterFn: "equalsString",
    cell: ({ row }) => <RoleBadge role={row.original.role} />,
  },
  {
    accessorKey: "assigned_city",
    header: "Assigned City & Dealer",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="font-semibold text-foreground">{row.original.assigned_city}</span>
        <span className="text-muted-foreground truncate max-w-[170px]">{row.original.assigned_dealer}</span>
      </div>
    ),
  },
  {
    accessorKey: "station_venue",
    header: "Station & Region",
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="text-foreground">{row.original.station_venue}</span>
        <span className="text-muted-foreground font-mono">{row.original.region}</span>
      </div>
    ),
  },
  {
    id: "password",
    header: "Mobile Password",
    cell: ({ row }) => <PasswordCell password={row.original.password} />,
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => <StatusBadge isActive={row.original.is_active} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const user = row.original;
      // Extract custom handlers passed via table.options.meta
      const meta = table.options.meta as
        | {
            onToggleStatus?: (user: SupervisorUser) => void;
            onDelete?: (user: SupervisorUser) => void;
            isAdmin?: boolean;
          }
        | undefined;

      const isAdmin = meta?.isAdmin ?? true;

      const handleCopyCredentials = () => {
        const text = `Pak Suzuki OpsPulse Login Credentials:\nEmail: ${user.email}\nPassword: ${user.password || "paksuzuki2026"}\nRole: ${user.role}\nAssigned City: ${user.assigned_city}\nStation: ${user.station_venue}`;
        navigator.clipboard.writeText(text);
        toast.success("Login credentials copied to clipboard");
      };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={`Open actions for ${user.name}`}
                className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
                size="icon-sm"
                variant="ghost"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={handleCopyCredentials} className="gap-2 text-xs">
                <Copy className="size-3.5" /> Copy Login Credentials
              </DropdownMenuItem>

              {isAdmin ? (
                <>
                  <DropdownMenuItem onClick={() => meta?.onToggleStatus?.(user)} className="gap-2 text-xs">
                    {user.is_active ? (
                      <>
                        <UserX className="size-3.5 text-amber-500" /> Deactivate Account
                      </>
                    ) : (
                      <>
                        <UserCheck className="size-3.5 text-emerald-500" /> Activate Account
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => meta?.onDelete?.(user)}
                    className="gap-2 text-xs text-destructive focus:text-destructive"
                  >
                    <Trash2 className="size-3.5" /> Delete User
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1 text-[11px] text-muted-foreground italic">
                    Read-only: Modifications restricted to Admins
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
];
