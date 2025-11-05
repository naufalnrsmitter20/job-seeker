import React from "react";
import DataTableListingPage from "./_components/listing";
import { nextGetServerSession } from "@/lib/AuthOptions";
import { findHumanResource } from "@/utils/query/human.resource.query";
import { findAllPositionApplied } from "@/utils/query/position.applied.query";

export default async function page() {
  const session = await nextGetServerSession();
  const findHRD = await findHumanResource({
    id: session?.user?.id,
  });
  const data = await findAllPositionApplied({
    AvailablePosition: { companyId: findHRD?.Company?.id },
  });
  return <DataTableListingPage data={data} />;
}
