import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { Suspense } from "react";
import ProductForm from "../_components/form";

export default async function Page() {
  const pageTitle = "Create New User";
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ProductForm pageTitle={pageTitle} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
