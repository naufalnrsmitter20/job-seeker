"use server";

import { nextGetServerSession } from "@/lib/AuthOptions";
import { userRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createCompany, deleteCompany, findCompany, updateCompany } from "../query/company.query";
import { UploadImageCloudinary } from "../upload.image";
import { findHumanResource } from "../query/human.resource.query";

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

export const updateCompanyProfile = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();

    const findHRDById = await findHumanResource({
      userId: session?.user?.id,
    });
    if (!session?.user?.id) return { error: true, message: "Unauthorized" };
    if (!findHRDById) return { error: true, message: "HRD not found" };
    if (!findHRDById?.Company) return { error: true, message: "Company not found" };
    const name = data.get("name") as string;
    const address = data.get("address") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const website = data.get("website") as string;
    const description = data.get("description") as string;
    const type = data.get("type") as string;

    const update = await updateCompany(
      {
        id: findHRDById.Company.id,
      },
      {
        name: name ?? findHRDById.Company.name,
        address: address ?? findHRDById.Company.address,
        email: email ?? findHRDById.Company.email,
        phone: phone ?? findHRDById.Company.phone,
        website: website ?? findHRDById.Company.website,
        description: description ?? findHRDById.Company.description,
        type: type ?? findHRDById.Company.type,
      }
    );
    if (!update) return { error: true, message: "Gagal memperbarui profil perusahaan" };
    revalidatePath("/hrd/company-profile");
    revalidatePath("/profile");
    revalidatePath("/companies");
    revalidatePath("/", "layout");
    return { message: "Berhasil memperbarui profil perusahaan", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal mengupdate profil perusahaan",
      error: true,
    };
  }
};

export const updateCompanyLogo = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();
    const findHRDById = await findHumanResource({
      userId: session?.user?.id,
    });
    if (!session?.user?.id) return { error: true, message: "Unauthorized" };
    if (!findHRDById) return { error: true, message: "HRD not found" };
    if (!findHRDById?.Company) return { error: true, message: "Company not found" };

    const logo = data.get("logo") as File;
    const imageBuffer = await logo.arrayBuffer();
    const upload = await UploadImageCloudinary(Buffer.from(imageBuffer));
    const update = await updateCompany(
      {
        id: findHRDById.Company.id,
      },
      {
        logo: upload?.data?.url ?? findHRDById.Company.logo,
      }
    );
    if (!update) return { error: true, message: "Gagal memperbarui logo perusahaan" };
    revalidatePath("/hrd/company-profile");
    revalidatePath("/profile");
    revalidatePath("/companies");
    revalidatePath("/", "layout");
    return { message: "Berhasil memperbarui logo perusahaan", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal mengupdate logo perusahaan",
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
