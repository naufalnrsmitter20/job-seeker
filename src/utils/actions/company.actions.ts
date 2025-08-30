"use server";

import { nextGetServerSession } from "@/lib/AuthOptions";
import { userRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createCompany, deleteCompany, findCompany, updateCompany } from "../query/company.query";
import { UploadImageCloudinary } from "../upload.image";

export const updateCompanyById = async (data: FormData, id?: string | null) => {
  try {
    const session = await nextGetServerSession();
    if (!["ADMIN", "HRD"].includes(session?.user?.role as userRole)) return { error: true, message: "Only Admin!" };

    const name = data.get("name") as string;
    const address = data.get("address") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const website = data.get("website") as string;
    const description = data.get("description") as string;
    const type = data.get("type") as string;
    const humanResourceId = data.get("humanResourceId") as string;
    const logo = data.get("logo") as File;
    const imageBuffer = logo ? await logo.arrayBuffer() : undefined;
    const upload = imageBuffer ? await UploadImageCloudinary(Buffer.from(imageBuffer)) : undefined;
    if (upload?.error) return { error: true, message: "Gagal mengupload logo" };

    if (!id || id == null) {
      const create = await createCompany({
        name,
        address,
        email,
        phone,
        website,
        description,
        type,
        humanResourceId,
        logo: upload?.data?.url ?? "",
      });
      if (!create) return { error: true, message: "Gagal membuat perusahaan" };
    } else {
      const findCompanyById = await findCompany({ id });
      const update = await updateCompany(
        { id },
        {
          name: name ?? findCompanyById?.name,
          address: address ?? findCompanyById?.address,
          email: email ?? findCompanyById?.email,
          phone: phone ?? findCompanyById?.phone,
          website: website ?? findCompanyById?.website,
          description: description ?? findCompanyById?.description,
          type: type ?? findCompanyById?.type,
          humanResourceId: humanResourceId ?? findCompanyById?.humanResourceId,
          logo: upload?.data?.url ?? findCompanyById?.logo,
        }
      );
      if (!update) return { error: true, message: "Gagal memperbarui perusahaan" };
    }
    revalidatePath("/companies");
    revalidatePath("/admin/companies");
    revalidatePath("/hrd/companies");
    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { message: "Berhasil disimpan!", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal menghapus perusahaan",
      error: true,
    };
  }
};

export const deleteCompanyById = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (!["ADMIN", "HRD"].includes(session?.user?.role as userRole)) return { error: true, message: "Only Admin!" };
    const del = await deleteCompany(id);

    if (!del) throw new Error("Delete failed");

    revalidatePath("/admin/companies");
    revalidatePath("/", "layout");
    return { message: "Berhasil dihapus!", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal menghapus perusahaan",
      error: true,
    };
  }
};
