"use client";
import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { DateRange } from "react-day-picker";
import { PositionAppliedGetPayload } from "@/types/entity.relations";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<PositionAppliedGetPayload>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.AvailablePosition?.positionName,
    id: "positionName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2 lg:px-3">
          Position Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="font-medium">{row.getValue("positionName") || "No Name"}</div>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.Employee?.name,
    id: "employeeName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2 lg:px-3">
          Employee Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="font-medium">{row.getValue("employeeName") || "No Name"}</div>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.Employee?.user?.email,
    id: "employeeEmail",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2 lg:px-3">
          Employee Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="font-medium">{row.getValue("employeeEmail") || "No Name"}</div>
      </div>
    ),
  },
  {
    accessorKey: "applyingStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("applyingStatus") as string;
      return <Badge className={status === "ACCEPTED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "applyDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2 lg:px-3">
          Apply At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatDate(row.getValue("applyDate")),
    filterFn: (row, id, value: DateRange) => {
      const date = new Date(row.getValue(id));
      const from = value?.from;
      const to = value?.to;

      if (from && to) {
        return date >= from && date <= to;
      }
      if (from) {
        return date >= from;
      }
      if (to) {
        return date <= to;
      }
      return true;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      return <CellAction data={user} />;
    },
  },
];
