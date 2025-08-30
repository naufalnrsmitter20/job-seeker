"use client";

import type React from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCcw, Search } from "lucide-react";
import { useEffect, useState } from "react";

export function SearchFilterBar({ placeholder = "Cari...", filters }: { placeholder?: string; filters?: { key: string; label: string; options: { label: string; value: string }[] }[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (q) next.set("q", q);
    else next.delete("q");
    next.set("page", "1");
    router.push(`?${next.toString()}`);
  };

  const onReset = () => {
    const next = new URLSearchParams();
    router.push(`?${next.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-2 md:items-center">
      <div className="relative md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="pl-9" />
      </div>
      {filters?.map((f) => {
        const curr = params.get(f.key) ?? "";
        return (
          <Select
            key={f.key}
            value={curr}
            onValueChange={(val) => {
              const next = new URLSearchParams(params.toString());
              if (val) next.set(f.key, val);
              else next.delete(f.key);
              next.set("page", "1");
              router.push(`?${next.toString()}`);
            }}
          >
            <SelectTrigger className="md:w-56">
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua {f.label}</SelectItem>
              {f.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
      <div className="flex gap-2">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Cari
        </Button>
        <Button type="button" variant="outline" onClick={onReset} className="border-blue-200 text-blue-600 bg-transparent">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </form>
  );
}
