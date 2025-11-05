import React from "react";
import DataTableListingPage from "./_components/listing";
import { findAllPositionApplied } from "@/utils/query/position.applied.query";

export default async function page() {
  const data = await findAllPositionApplied();
  return <DataTableListingPage data={data} />;
}
