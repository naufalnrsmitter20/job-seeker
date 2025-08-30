import { notFound } from "next/navigation";
import Form from "./form";
import { UserGetPayload } from "@/types/entity.relations";
import { findUser } from "@/utils/query/user.query";

type TUserViewPageProps = {
  id: string;
};

export default async function UserViewPage({ id }: TUserViewPageProps) {
  let user = null;
  let pageTitle = "Create New User";

  if (id !== "new") {
    const data = await findUser({
      id: id,
    });
    user = data as UserGetPayload;
    if (!user) {
      notFound();
    }
    pageTitle = `Edit User`;
  }

  return <Form initialData={user} pageTitle={pageTitle} />;
}
