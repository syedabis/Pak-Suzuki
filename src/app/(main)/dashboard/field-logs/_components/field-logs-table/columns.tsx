import type { ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";

import type { OrderRow } from "./schema";

function formatOrderDate(date: string) {
  try {
    return format(parseISO(date), "h:mm a, d MMM");
  } catch {
    return date;
  }
}

function PaymentBadge({ status }: { status: OrderRow["payment"] }) {
  if (status === "Bank Financing (Meezan)") {
    return (
      <Badge
        className="border-emerald-700/25 text-emerald-700 dark:border-emerald-300/25 dark:text-emerald-300"
        variant="outline"
      >
        <span className="size-1.5 rounded-full bg-current" />
        Meezan Ijarah
      </Badge>
    );
  }

  if (status === "Bank Financing (Alfalah)") {
    return (
      <Badge className="border-blue-700/25 text-blue-700 dark:border-blue-300/25 dark:text-blue-300" variant="outline">
        <span className="size-1.5 rounded-full bg-current" />
        Alfalah Auto
      </Badge>
    );
  }

  if (status === "Pay Order / PayPro") {
    return (
      <Badge
        className="border-purple-700/25 text-purple-700 dark:border-purple-300/25 dark:text-purple-300"
        variant="outline"
      >
        <span className="size-1.5 rounded-full bg-current" />
        Pay Order
      </Badge>
    );
  }

  if (status === "Trade-In Advance") {
    return (
      <Badge className="border-sky-700/25 text-sky-700 dark:border-sky-300/25 dark:text-sky-300" variant="outline">
        <span className="size-1.5 rounded-full bg-current" />
        Trade-In Equity
      </Badge>
    );
  }

  return (
    <Badge
      className="border-amber-700/25 text-amber-700 dark:border-amber-300/25 dark:text-amber-300"
      variant="outline"
    >
      <span className="size-1.5 rounded-full bg-current" />
      Token Advance
    </Badge>
  );
}

function FulfillmentBadge({ status }: { status: OrderRow["fulfillment"] }) {
  if (status === "Certified Booked") {
    return (
      <Badge
        className="border-green-700/25 text-green-700 dark:border-green-300/25 dark:text-green-300"
        variant="outline"
      >
        <span className="size-1.5 rounded-full bg-current" />
        Certified Booked
      </Badge>
    );
  }

  if (status === "130-Pt Inspected") {
    return (
      <Badge className="border-blue-700/25 text-blue-700 dark:border-blue-300/25 dark:text-blue-300" variant="outline">
        <span className="size-1.5 rounded-full bg-current" />
        130-Pt Certified
      </Badge>
    );
  }

  if (status === "Test Drive Completed") {
    return (
      <Badge
        className="border-purple-700/25 text-purple-700 dark:border-purple-300/25 dark:text-purple-300"
        variant="outline"
      >
        <span className="size-1.5 rounded-full bg-current" />
        Test Drive Done
      </Badge>
    );
  }

  if (status === "Financing Approved") {
    return (
      <Badge
        className="border-emerald-700/25 text-emerald-700 dark:border-emerald-300/25 dark:text-emerald-300"
        variant="outline"
      >
        <span className="size-1.5 rounded-full bg-current" />
        Lease Approved
      </Badge>
    );
  }

  return (
    <Badge
      className="border-orange-700/25 text-orange-700 dark:border-orange-300/25 dark:text-orange-300"
      variant="outline"
    >
      <span className="size-1.5 rounded-full bg-current" />
      Trade-In Appraised
    </Badge>
  );
}

export function createFieldLogsColumns(
  onSelectVisit?: (visit: OrderRow) => void,
): ColumnDef<DataTableFeatures, OrderRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="w-10">
          <Subscribe
            source={table.atoms.rowSelection}
            selector={() =>
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected() && "indeterminate")
            }
          >
            {(checked) => (
              <Checkbox
                aria-label="Select all visits"
                checked={checked}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              />
            )}
          </Subscribe>
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-10">
          <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
            {(checked) => (
              <Checkbox
                aria-label={`Select visit ${row.original.id}`}
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
      accessorKey: "id",
      header: "Token & Vehicle",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="font-medium font-mono text-xs leading-none">{row.original.id}</div>
          <div className="text-muted-foreground text-xs">{row.original.items}</div>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "customer",
      header: "Attendee & Venue Hall",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="font-medium text-foreground text-xs">{row.original.customer}</div>
          <div className="truncate text-[11px] text-muted-foreground">{row.original.area}</div>
        </div>
      ),
    },
    {
      accessorKey: "agent",
      header: "Consultant / Inspector",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-xs">{row.original.agent}</span>
        </div>
      ),
    },
    {
      id: "statusSummary",
      header: "Gala Activity & Settlement",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FulfillmentBadge status={row.original.fulfillment} />
          <PaymentBadge status={row.original.payment} />
        </div>
      ),
      filterFn: (row, _columnId, value) => {
        if (value === "Certified Booked") {
          return row.original.fulfillment === "Certified Booked";
        }
        if (value === "130-Pt Inspected") {
          return row.original.fulfillment === "130-Pt Inspected";
        }
        if (value === "Test Drive Completed") {
          return row.original.fulfillment === "Test Drive Completed";
        }
        if (value === "Financing Approved") {
          return row.original.fulfillment === "Financing Approved";
        }
        if (value === "Trade-in Appraised") {
          return row.original.fulfillment === "Trade-in Appraised";
        }
        return true;
      },
    },
    {
      accessorKey: "total",
      header: () => <div className="w-28">Valuation / Lease</div>,
      cell: ({ row }) => <div className="w-28 font-medium tabular-nums">{row.original.total}</div>,
    },
    {
      accessorKey: "date",
      header: () => <div className="w-36">Timestamp</div>,
      cell: ({ row }) => <div className="w-36 text-muted-foreground text-xs">{formatOrderDate(row.original.date)}</div>,
    },
    {
      id: "actions",
      header: () => <div className="flex w-full justify-end">Actions</div>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex w-full justify-end">
              <Button aria-label="Open visit actions" size="icon-sm" variant="ghost">
                <MoreHorizontal />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Gala Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onSelectVisit?.(row.original)}>
                View 130-Pt Diagnostic & Notes
              </DropdownMenuItem>
              <DropdownMenuItem>Verify Inspection Certificate</DropdownMenuItem>
              <DropdownMenuItem>Print Token Receipt</DropdownMenuItem>
              <DropdownMenuItem>Copy Token ID</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableHiding: false,
      enableSorting: false,
    },
  ];
}
