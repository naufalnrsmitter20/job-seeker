import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { Suspense } from "react";
import PositionForm from "../_components/form";

export default async function Page() {
  const pageTitle = "Create New Position";
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <PositionForm pageTitle={pageTitle} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
