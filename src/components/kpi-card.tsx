import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCard({ title, value, icon, subtle }: { title: string; value: string | number; icon?: React.ReactNode; subtle?: string }) {
  return (
    <Card className="border-blue-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-900">{value}</div>
        {subtle ? <p className="text-xs text-gray-500 mt-1">{subtle}</p> : null}
      </CardContent>
    </Card>
  );
}
