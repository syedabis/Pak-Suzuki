"use client";
import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";
import { cn } from "cn";
import { Copy, Eye, EyeOff, MoreHorizontal, Power, Shield, Trash2, UserCheck, UserX } from "lucide-react";
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
    cell: ({ row }) => <span className="text-xs font-medium text-foreground">{row.original.role}</span>,
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
          }
        | undefined;

      const handleCopyCredentials = () => {
        const text = `Pak Suzuki OpsPulse Login Credentials:\nEmail: ${user.email}\nPassword: ${user.password || "paksuzuki2026"}\nAssigned City: ${user.assigned_city}\nStation: ${user.station_venue}`;
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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleCopyCredentials} className="gap-2 text-xs">
                <Copy className="size-3.5" /> Copy Mobile Credentials
              </DropdownMenuItem>
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
                <Trash2 className="size-3.5" /> Delete Supervisor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
];
