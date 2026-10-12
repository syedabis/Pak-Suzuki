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
  if (status === "Cash") {
    return (
      <Badge
        className="border-green-700/25 text-green-700 dark:border-green-300/25 dark:text-green-300"
        variant="outline"
      >
        <span className="size-1.5 rounded-full bg-current" />
        Cash
      </Badge>
    );
  }

  if (status === "Raast / Digital") {
    return (
      <Badge className="border-blue-700/25 text-blue-700 dark:border-blue-300/25 dark:text-blue-300" variant="outline">
        <span className="size-1.5 rounded-full bg-current" />
        Raast / Digital
      </Badge>
    );
  }

  return (
    <Badge
      className="border-yellow-700/25 text-yellow-700 dark:border-yellow-300/25 dark:text-yellow-300"
      variant="outline"
    >
      <span className="size-1.5 rounded-full bg-current" />
      Follow-up
    </Badge>
  );
}

function FulfillmentBadge({ status }: { status: OrderRow["fulfillment"] }) {
  if (status === "Delivered") {
    return (
      <Badge
        className="border-green-700/25 text-green-700 dark:border-green-300/25 dark:text-green-300"
        variant="outline"
      >
        <span className="size-1.5 rounded-full bg-current" />
        Delivered
      </Badge>
    );
  }

  if (status === "Sample Given") {
    return (
      <Badge className="border-blue-700/25 text-blue-700 dark:border-blue-300/25 dark:text-blue-300" variant="outline">
        <span className="size-1.5 rounded-full bg-current" />
        Sample Given
      </Badge>
    );
  }

  return (
    <Badge
      className="border-orange-700/25 text-orange-700 dark:border-orange-300/25 dark:text-orange-300"
      variant="outline"
    >
      <span className="size-1.5 rounded-full bg-current" />
      Revisit
    </Badge>
  );
}

export const recentOrdersColumns: ColumnDef<DataTableFeatures, OrderRow>[] = [
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
    header: "Receipt / SKU",
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
    header: "Household & Address",
  },
  {
    accessorKey: "agent",
    header: "Field Agent",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-xs">{row.original.agent}</span>
      </div>
    ),
  },
  {
    id: "statusSummary",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FulfillmentBadge status={row.original.fulfillment} />
        <PaymentBadge status={row.original.payment} />
      </div>
    ),
    filterFn: (row, _columnId, value) => {
      if (value === "Delivered") {
        return row.original.fulfillment === "Delivered";
      }
      if (value === "Sample Given") {
        return row.original.fulfillment === "Sample Given";
      }
      if (value === "Revisit Scheduled") {
        return row.original.fulfillment === "Revisit Scheduled";
      }
      if (value === "Digital Pay") {
        return row.original.payment === "Raast / Digital";
      }
      if (value === "Cash") {
        return row.original.payment === "Cash";
      }
      return true;
    },
  },
  {
    accessorKey: "total",
    header: () => <div className="w-24">Total (PKR)</div>,
    cell: ({ row }) => <div className="w-24 font-medium tabular-nums">{row.original.total}</div>,
  },
  {
    accessorKey: "date",
    header: () => <div className="w-36">Time</div>,
    cell: ({ row }) => <div className="w-36 text-muted-foreground text-xs">{formatOrderDate(row.original.date)}</div>,
  },
  {
    id: "actions",
    header: () => <div className="flex w-full justify-end">Actions</div>,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex w-full justify-end">
            <Button aria-label="Open visit actions" size="icon-sm" variant="ghost">
              <MoreHorizontal />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Visit Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>View Survey Answers</DropdownMenuItem>
            <DropdownMenuItem>View Customer Profile</DropdownMenuItem>
            <DropdownMenuItem>Contact Field Agent</DropdownMenuItem>
            <DropdownMenuItem>Print Cash Receipt</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableHiding: false,
    enableSorting: false,
  },
];
