import React from "react";
import DataTableListingPage from "./_components/listing";
import { nextGetServerSession } from "@/lib/AuthOptions";
import { findHumanResource } from "@/utils/query/human.resource.query";
import { findAllPositionApplied } from "@/utils/query/position.applied.query";
import { findUser } from "@/utils/query/user.query";

export default async function page() {
  const session = await nextGetServerSession();
  const findUserData = await findUser({
    id: session?.user?.id,
  });
  const findHRD = await findHumanResource({
    id: findUserData?.HumanResource?.id,
  });
  const data = await findAllPositionApplied({
    AvailablePosition: {
      companyId: findHRD?.Company?.id,
      Company: {
        humanResourceId: findHRD?.id,
      },
    },
  });
  return <DataTableListingPage data={data} />;
}
