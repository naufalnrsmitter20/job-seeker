"use client";

import * as React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
}

export function DatePickerWithRange({ date, onDateChange }: DatePickerWithRangeProps) {
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
      <DayPicker mode="range" selected={date} onSelect={onDateChange} numberOfMonths={1} pagedNavigation captionLayout="dropdown" fromYear={2020} toYear={2035} />

      {date?.from && date?.to && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          {format(date.from, "dd MMM yyyy")} — {format(date.to, "dd MMM yyyy")}
        </p>
      )}
    </div>
  );
}
