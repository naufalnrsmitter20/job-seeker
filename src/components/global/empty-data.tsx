import React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileWarning } from "lucide-react";
export default function EmptyData({ title }: { title: string }) {
  return (
    <div className="w-full">
      <Alert className="my-4 max-w-xl mx-auto bg-blue-100">
        <FileWarning />
        <AlertTitle>Data {title} tidak ditemukan!</AlertTitle>
        <AlertDescription>Silakan coba lagi nanti.</AlertDescription>
      </Alert>
    </div>
  );
}
