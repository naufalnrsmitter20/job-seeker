import React from "react";
import DataTableListingPage from "./_components/listing";
import { findAllUser } from "@/utils/query/user.query";

export default async function page() {
  const data = await findAllUser();
  return <DataTableListingPage data={data} />;
}
