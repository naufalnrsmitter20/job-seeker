"use server";

import { nextGetServerSession } from "@/lib/AuthOptions";
import { findUser } from "../query/user.query";
import { findEmployee } from "../query/employee.query";
import { createPortfolio, deletePortfolio, findPortfolio, updatePortfolio } from "../query/portfolio.query";
import { revalidatePath } from "next/cache";

export const updatePortofolioById = async (formData: FormData, id?: string) => {
  try {
    const session = await nextGetServerSession();
    if (session?.user?.id !== id) return { error: true, message: "Unauthorized" };
    const skill = formData.get("skill") as string;
    const file = formData.get("file") as string;
    const description = formData.get("description") as string;
    const findEmail = await findUser({ id });
    const findEmployeeId = await findEmployee({ userId: findEmail?.id });
    if (id == null || !findEmail) {
      const create = await createPortfolio({
        skill,
        file,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        employeeId: findEmployeeId?.id,
      });
      if (!create) throw new Error("Create failed");
    } else {
      const findPorto = await findPortfolio({ id });
      const update = await updatePortfolio(id, {
        skill: skill ?? findPorto?.skill,
        file: file ?? findPorto?.file,
        description: description ?? findPorto?.description,
        updatedAt: new Date(),
      });
      if (!update) throw new Error("Update failed");
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { message: "Berhasil mengupdate portofolio!", error: false };
  } catch (error) {
    console.error(error);
    return {
      message: "Gagal mengupdate portofolio",
      error: true,
    };
  }
};

export const deletePortofolioById = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (session?.user?.id !== id) return { error: true, message: "Unauthorized" };

    const findPorto = await findPortfolio({ id });
    if (!findPorto) return { error: true, message: "Portfolio not found" };

    const del = await deletePortfolio(id);
    if (!del) throw new Error("Delete failed");

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { message: "Berhasil dihapus!", error: false };
  } catch (error) {
    console.error(error);
    return {
      message: "Gagal menghapus portofolio",
      error: true,
    };
  }
};
