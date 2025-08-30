"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PaginationControls({ page, pageSize, total }: { page: number; pageSize: number; total: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < lastPage;

  const update = (next: number) => {
    const q = new URLSearchParams(params.toString());
    q.set("page", String(next));
    router.push(`?${q.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="text-sm text-gray-600">
        Halaman {page} dari {lastPage} • Total {total}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={!canPrev} onClick={() => update(page - 1)}>
          Sebelumnya
        </Button>
        <Button variant="outline" disabled={!canNext} onClick={() => update(page + 1)}>
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}
