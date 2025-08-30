"use client";

import { type ColumnDef, type ColumnFiltersState, type SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search, Building2, Calendar, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/format";
import { FileText } from "lucide-react";

type Application = {
  id: string;
  applyingStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  applyDate: Date;
  AvailablePosition: {
    id: string;
    positionName: string;
    Company: {
      name: string;
    };
  } | null;
};

const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "AvailablePosition.positionName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2 lg:px-3">
        Position
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.AvailablePosition?.positionName || "N/A"}</div>,
  },
  {
    accessorKey: "AvailablePosition.Company.name",
    header: "Company",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-blue-600" />
        {row.original.AvailablePosition?.Company?.name || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "applyDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2 lg:px-3">
        Applied Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        {formatDate(row.getValue("applyDate"))}
      </div>
    ),
  },
  {
    accessorKey: "applyingStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("applyingStatus") as string;
      return <Badge className={status === "ACCEPTED" ? "bg-green-100 text-green-700" : status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 bg-transparent">
        <ExternalLink className="h-4 w-4 mr-2" />
        View Details
      </Button>
    ),
  },
];

export function ApplicationsSection({ applications }: { applications: Application[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: applications,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <Card>
      <div className="space-y-4">
        <CardHeader>
          <div>
            <CardTitle className="text-blue-900">Job Applications</CardTitle>
            <CardDescription>Track your job application history and status</CardDescription>
          </div>
        </CardHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search positions or companies..." value={globalFilter ?? ""} onChange={(event) => setGlobalFilter(String(event.target.value))} className="pl-10" />
              </div>
              <Select
                value={(table.getColumn("applyingStatus")?.getFilterValue() as string[])?.join(",") || ""}
                onValueChange={(value) => {
                  const column = table.getColumn("applyingStatus");
                  if (value === "all") {
                    column?.setFilterValue(undefined);
                  } else {
                    column?.setFilterValue(value.split(","));
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="ACCEPTED">ACCEPTED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Application History</CardTitle>
            <CardDescription>{table.getFilteredRowModel().rows.length} application(s) found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="bg-transparent">
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="bg-transparent">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {applications.length === 0 && (
          <Card className="border-dashed border-blue-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 text-center mb-4">Start applying for jobs to see your application history here.</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Card>
  );
}
