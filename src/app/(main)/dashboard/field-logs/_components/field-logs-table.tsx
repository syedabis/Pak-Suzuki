"use client";

import * as React from "react";

import { type ColumnFiltersState, type PaginationState, type SortingState, useTable } from "@tanstack/react-table";
import { ArrowUpDown, Download, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { dataTableFeatures } from "@/lib/data-table-features";

import { createFieldLogsColumns } from "./field-logs-table/columns";
import fieldLogsData from "./field-logs-table/data.json";
import { formatOrderCount, formatSelectedOrderCount, preventPaginationNavigation } from "./field-logs-table/formatters";
import { type OrderFilter, type OrderRow, orderFilters } from "./field-logs-table/schema";

const initialVisits = fieldLogsData as OrderRow[];

export function FieldLogsTable() {
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedVisit, setSelectedVisit] = React.useState<OrderRow | null>(null);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo(() => createFieldLogsColumns((visit) => setSelectedVisit(visit)), []);

  const filteredData = React.useMemo(() => {
    if (!globalFilter.trim()) return initialVisits;
    const query = globalFilter.toLowerCase();
    return initialVisits.filter(
      (item) =>
        item.customer.toLowerCase().includes(query) ||
        item.area.toLowerCase().includes(query) ||
        item.agent.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.items.toLowerCase().includes(query),
    );
  }, [globalFilter]);

  const table = useTable({
    features: dataTableFeatures,
    data: filteredData,
    columns,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  const activeFilter = (table.getColumn("statusSummary")?.getFilterValue() as OrderFilter | undefined) ?? "All";
  const orderCount = table.getFilteredRowModel().rows.length;
  const selectedOrderCount = table.getSelectedRowModel().rows.length;
  const visibleOrderCount = table.getRowModel().rows.length;
  const currentPage = table.state.pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const orderCountDescription =
    selectedOrderCount > 0 ? formatSelectedOrderCount(selectedOrderCount) : formatOrderCount(activeFilter, orderCount);

  const pageNumbers = React.useMemo(() => {
    if (pageCount <= 3) {
      return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];

    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, pageCount]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="font-semibold text-lg">Mega Gala & Expo Live Activity Log</CardTitle>
              <CardDescription className="text-foreground text-sm tabular-nums leading-none">
                {orderCountDescription}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  className="pl-8 text-xs"
                  placeholder="Search attendee, vehicle, VIN/token, hall..."
                  value={globalFilter}
                  onChange={(e) => {
                    setGlobalFilter(e.target.value);
                    table.setPageIndex(0);
                  }}
                />
                {globalFilter && (
                  <button
                    type="button"
                    className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setGlobalFilter("")}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <Button size="sm" variant="outline" className="shrink-0 gap-1.5">
                <Download className="size-4" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 px-0">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4">
            <ToggleGroup
              className="bg-muted p-0.75 text-muted-foreground **:data-[slot=toggle-group-item]:rounded-md **:data-[slot=toggle-group-item]:border **:data-[slot=toggle-group-item]:border-transparent **:data-[slot=toggle-group-item]:text-foreground/60 **:data-[slot=toggle-group-item]:hover:text-foreground [&_[data-slot=toggle-group-item][data-state=on]]:bg-background [&_[data-slot=toggle-group-item][data-state=on]]:text-foreground [&_[data-slot=toggle-group-item][data-state=on]]:shadow-sm dark:[&_[data-slot=toggle-group-item][data-state=on]]:border-input dark:[&_[data-slot=toggle-group-item][data-state=on]]:bg-input/30"
              onValueChange={(value) => {
                if (!value) return;
                table.getColumn("statusSummary")?.setFilterValue(value === "All" ? undefined : value);
                table.setPageIndex(0);
              }}
              size="sm"
              spacing={1}
              type="single"
              value={activeFilter}
            >
              {orderFilters.map((filter) => (
                <ToggleGroupItem key={filter} value={filter}>
                  {filter}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <Button
              size="icon-sm"
              variant="outline"
              title="Sort by Date"
              onClick={() => table.getColumn("date")?.toggleSorting(table.getColumn("date")?.getIsSorted() === "asc")}
            >
              <ArrowUpDown className="size-4" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table className="**:data-[slot='table-cell']:px-4.5 **:data-[slot='table-head']:px-4.5">
              <TableHeader className="border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-normal **:data-[slot='table-head']:text-foreground **:data-[slot='table-head']:text-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => setSelectedVisit(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="h-24 text-center text-muted-foreground" colSpan={columns.length}>
                      No gala records found matching your query.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-4 pt-2">
            <div className="text-muted-foreground text-xs tabular-nums">
              Showing {visibleOrderCount} of {orderCount} records
            </div>

            {pageCount > 1 && (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-disabled={!table.getCanPreviousPage()}
                      className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
                      href="#"
                      onClick={(e) => {
                        preventPaginationNavigation(e);
                        table.previousPage();
                      }}
                    />
                  </PaginationItem>

                  {pageNumbers.map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === currentPage}
                        onClick={(e) => {
                          preventPaginationNavigation(e);
                          table.setPageIndex(pageNumber - 1);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {pageCount > 3 && currentPage < pageCount - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      aria-disabled={!table.getCanNextPage()}
                      className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
                      href="#"
                      onClick={(e) => {
                        preventPaginationNavigation(e);
                        table.nextPage();
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gala Inspection & Buyer Details Modal */}
      <Dialog open={Boolean(selectedVisit)} onOpenChange={(open) => !open && setSelectedVisit(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg">Gala Transaction & 130-Pt Diagnostic Details</DialogTitle>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedVisit?.id}
              </Badge>
            </div>
            <DialogDescription>
              Logged on {selectedVisit?.date.replace("T", " at ")} by {selectedVisit?.agent}
            </DialogDescription>
          </DialogHeader>

          {selectedVisit && (
            <div className="flex flex-col gap-4 text-sm">
              <div className="rounded-lg bg-muted/60 p-3">
                <div className="font-semibold text-foreground">{selectedVisit.customer}</div>
                <div className="text-muted-foreground text-xs">{selectedVisit.area}</div>
                <div className="mt-2 flex items-center justify-between border-border/60 border-t pt-2 text-xs">
                  <span className="font-medium text-foreground">{selectedVisit.items}</span>
                  <span className="font-bold text-foreground tabular-nums">{selectedVisit.total}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  130-Point Diagnostic Appraisal & Buyer Profile
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border p-2">
                    <span className="text-muted-foreground">Trade-In / Current Car:</span>
                    <div className="font-medium text-foreground text-sm">
                      {selectedVisit.survey?.currentBrand ?? "None (First-time Buyer)"}
                    </div>
                  </div>
                  <div className="rounded border p-2">
                    <span className="text-muted-foreground">Verified Mileage / Odo:</span>
                    <div className="font-medium text-foreground text-sm">
                      {selectedVisit.survey?.monthlyLiters?.toLocaleString() ?? "N/A"} km
                    </div>
                  </div>
                </div>

                <div className="rounded border p-2 text-xs">
                  <span className="text-muted-foreground">Buyer Intent & Status:</span>
                  <div className="font-medium text-foreground">
                    {selectedVisit.survey?.decisionMaker ?? "On-Spot Booking"}
                  </div>
                </div>

                <div className="rounded border bg-card p-3 text-xs">
                  <span className="text-muted-foreground">Diagnostic Findings & Consultant Notes:</span>
                  <p className="mt-1 font-medium text-foreground italic">
                    "
                    {selectedVisit.survey?.reasonOrFeedback ?? "Vehicle verified through Pak Suzuki inspection funnel."}
                    "
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVisit(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
