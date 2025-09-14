"use server";

import { nextGetServerSession } from "@/lib/AuthOptions";
import { createAddress, deleteAddress, findAddress, updateAddress } from "../query/address.query";
import { findEmployee } from "../query/employee.query";
import { revalidatePath } from "next/cache";

export const updateAddressById = async (data: FormData, id?: string) => {
  try {
    const session = await nextGetServerSession();

    const city = data.get("city") as string;
    const country = data.get("country") as string;
    const state = data.get("state") as string;
    const street = data.get("street") as string;
    const zip = data.get("zip") as string;

    const findEmployeeById = await findEmployee({ userId: session?.user?.id });
    if (findEmployeeById && findEmployeeById?._count?.address > 2) {
      throw new Error("Max address limit reached");
    }

    if (id == null || !id) {
      const create = await createAddress({
        city,
        country,
        state,
        street,
        zip,
        createdAt: new Date(),
        updatedAt: new Date(),
        employeeId: findEmployeeById?.id,
      });
      if (!create) throw new Error("Create failed");
    } else {
      const findById = await findAddress({ id });
      const update = await updateAddress(id, {
        city: city ?? findById?.city,
        country: country ?? findById?.country,
        state: state ?? findById?.state,
        street: street ?? findById?.street,
        zip: zip ?? findById?.zip,
        updatedAt: new Date(),
      });
      if (!update) throw new Error("Update failed");
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { message: "Berhasil mengupdate alamat!", error: false };
  } catch (error) {
    return { message: (error as Error).message, error: true };
  }
};

export const deleteAddressById = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user?.id) return { error: true, message: "Unauthorized" };

    const findAddressById = await findAddress({ id });
    if (!findAddressById) return { error: true, message: "Address not found" };

    const del = await deleteAddress(id);
    if (!del) throw new Error("Delete failed");

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { message: "Berhasil dihapus!", error: false };
  } catch (error) {
    return {
      message: (error as Error).message,
      error: true,
    };
  }
};
