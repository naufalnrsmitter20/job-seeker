import React from "react";
import DataTableListingPage from "./_components/listing";
import { findAllAvailablePosition } from "@/utils/query/available.position.query";
import { nextGetServerSession } from "@/lib/AuthOptions";
import { findHumanResource } from "@/utils/query/human.resource.query";
import { findUser } from "@/utils/query/user.query";

export default async function page() {
  const session = await nextGetServerSession();
  const findUserData = await findUser({
    id: session?.user?.id,
  });
  const findHRD = await findHumanResource({
    id: findUserData?.HumanResource?.id,
  });
  const data = await findAllAvailablePosition({
    Company: {
      humanResourceId: findHRD?.id,
    },
  });
  return <DataTableListingPage data={data} />;
}
