import { notFound } from "next/navigation";
import Form from "./form";
import { AvailablePositionPayload } from "@/types/entity.relations";
import { findAvailablePosition } from "@/utils/query/available.position.query";

type TPositionViewPageProps = {
  id: string;
};

export default async function PositionViewPage({ id }: TPositionViewPageProps) {
  let position = null;
  const pageTitle = "Edit Position";

  const data = await findAvailablePosition({
    id: id,
  });
  position = data as AvailablePositionPayload;
  if (!position) {
    notFound();
  }

  return <Form initialData={position} pageTitle={pageTitle} />;
}
