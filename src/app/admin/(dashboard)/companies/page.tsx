import React from "react";
import DataTableListingPage from "./_components/listing";
import { findAllCompany } from "@/utils/query/company.query";

export default async function page() {
  const data = await findAllCompany();
  return <DataTableListingPage data={data} />;
}
