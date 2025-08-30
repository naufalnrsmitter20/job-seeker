import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { Suspense } from "react";
import ProductForm from "../_components/form";
import { findAllHumanResource } from "@/utils/query/human.resource.query";

export default async function Page() {
  const pageTitle = "Create New Company";
  const allHRD = await findAllHumanResource({
    Company: null,
  });

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ProductForm hrd={allHRD} pageTitle={pageTitle} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
