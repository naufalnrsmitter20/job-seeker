import React from "react";
import InfoSection from "./_components/info-section";
import { nextGetServerSession } from "@/lib/AuthOptions";
import { findHumanResource } from "@/utils/query/human.resource.query";

export default async function page() {
  const session = await nextGetServerSession();
  const findHumanResourceData = await findHumanResource({
    userId: session?.user?.id,
  });
  return <InfoSection data={findHumanResourceData!} />;
}
