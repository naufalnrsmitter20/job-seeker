import React from "react";
import DataTableListingPage from "./_components/listing";
import { findAllAvailablePosition } from "@/utils/query/available.position.query";

export default async function page() {
  const data = await findAllAvailablePosition();
  return <DataTableListingPage data={data} />;
}
