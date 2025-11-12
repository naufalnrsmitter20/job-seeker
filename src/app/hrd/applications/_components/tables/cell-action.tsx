"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { PositionAppliedGetPayload } from "@/types/entity.relations";
import { deletePositionAppliedById, manageJobApplication } from "@/utils/actions/position.actions";
import { applyingStatus } from "@prisma/client";
import { IconDotsVertical, IconCheck, IconX, IconEye, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CellActionProps {
  data: PositionAppliedGetPayload;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    const toastId = toast.loading("Deleting Applications...");
    try {
      const del = await deletePositionAppliedById(data.id);
      if (del.error) {
        toast.error(del.message, { id: toastId });
        setOpen(false);
      } else {
        toast.success(del.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error deleting Applications:", error);
      toast.error((error as Error).message, { id: toastId });
      setOpen(false);
    }
  };

  const handleChangeStatus = async (status: applyingStatus) => {
    const toastId = toast.loading("Processing...");
    try {
      const formData = new FormData();
      formData.append("applyingStatus", status);
      const updateStatus = await manageJobApplication(data.id, formData);
      if (updateStatus.error) {
        toast.error(updateStatus.message, { id: toastId });
        return;
      } else {
        toast.success(updateStatus.message, { id: toastId });
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting Applications:", error);
      toast.error((error as Error).message, { id: toastId });
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onConfirm} loading={loading} />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => handleChangeStatus("ACCEPTED")}>
            <IconCheck className="mr-2 h-4 w-4" /> Accept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleChangeStatus("REJECTED")}>
            <IconX className="mr-2 h-4 w-4" /> Reject
          </DropdownMenuItem>
          <Separator className="my-2" />
          <DropdownMenuItem onClick={() => router.push(`/hrd/applications/view-user/${data.Employee?.userId}`)}>
            <IconEye className="mr-2 h-4 w-4" /> View User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
