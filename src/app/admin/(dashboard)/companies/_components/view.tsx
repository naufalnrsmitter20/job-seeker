import { notFound } from "next/navigation";
import Form from "./form";
import { CompanyGetPayload } from "@/types/entity.relations";
import { findCompany } from "@/utils/query/company.query";
import { findAllHumanResource } from "@/utils/query/human.resource.query";

type TCompanyViewPageProps = {
  id: string;
};

export default async function CompanyViewPage({ id }: TCompanyViewPageProps) {
  let company = null;
  let pageTitle = "Create New Company";

  const allHRD = await findAllHumanResource({
    Company: null,
  });

  if (id !== "new") {
    const data = await findCompany({
      id: id,
    });
    company = data as CompanyGetPayload;
    if (!company) {
      notFound();
    }
    pageTitle = `Edit Company`;
  }

  return <Form hrd={allHRD} initialData={company} pageTitle={pageTitle} />;
}
