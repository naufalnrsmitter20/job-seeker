import React from "react";
import InfoSection from "./_components/info-section";
import { nextGetServerSession } from "@/lib/AuthOptions";
import { findHumanResource } from "@/utils/query/human.resource.query";
import { findUser } from "@/utils/query/user.query";

export default async function page() {
  const session = await nextGetServerSession();
  const findUserData = await findUser({
    id: session?.user?.id,
  });
  const findHumanResourceData = await findHumanResource({
    id: findUserData?.HumanResource?.id,
  });
  return <InfoSection data={findHumanResourceData!} />;
}
