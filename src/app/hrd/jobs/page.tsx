import React from "react";
import DataTableListingPage from "./_components/listing";
import { findAllAvailablePosition } from "@/utils/query/available.position.query";
import { nextGetServerSession } from "@/lib/AuthOptions";
import { findHumanResource } from "@/utils/query/human.resource.query";

export default async function page() {
  const session = await nextGetServerSession();
  const findHRD = await findHumanResource({
    id: session?.user?.id,
  });
  const data = await findAllAvailablePosition({
    Company: {
      humanResourceId: findHRD?.id,
    },
  });
  return <DataTableListingPage data={data} />;
}
