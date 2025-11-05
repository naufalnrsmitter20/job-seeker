"use server";

import { nextGetServerSession } from "@/lib/AuthOptions";
import { createAvailablePosition, deleteAvailablePosition, findAvailablePosition, updateAvailablePosition } from "../query/available.position.query";
import { revalidatePath } from "next/cache";
import { applyingStatus, jobStatus, userRole } from "@prisma/client";
import { findHumanResource } from "../query/human.resource.query";
import { findEmployee, updateEmployee } from "../query/employee.query";
import { createPositionApplied, deletePositionApplied, findPositionApplied, updatePositionApplied } from "../query/position.applied.query";
import { transporter } from "@/lib/mailer";

export const updateAvailablePositionWithId = async (data: FormData, id: string | null) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user?.id) return { error: true, message: "Unauthorized" };

    const positionName = data.get("positionName") as string;
    const capacity = Number(data.get("capacity"));
    const about = data.get("about") as string;
    const description = data.getAll("description") as string[];
    const requirements = data.getAll("requirements") as string[];
    const benefits = data.getAll("benefits") as string[];
    const status = data.get("status") as string;
    const submissionStartDate = data.get("submissionStartDate") as string;
    const submissionEndDate = data.get("submissionEndDate") as string;
    const salaryStartRange = Number(data.get("salaryStartRange"));
    const salaryEndRange = Number(data.get("salaryEndRange"));

    const findHRD = await findHumanResource({ userId: session.user.id });

    if (!findHRD) return { error: true, message: "Human Resource not found" };

    if (!findHRD.Company) return { error: true, message: "Company not found! please fill your company data" };

    if (!id || id == null) {
      const create = await createAvailablePosition({
        positionName,
        capacity,
        about,
        status: status as jobStatus,
        description,
        requirements,
        benefits,
        submissionStartDate: new Date(submissionStartDate),
        submissionEndDate: new Date(submissionEndDate),
        salaryStartRange,
        salaryEndRange,
        createdAt: new Date(),
        updatedAt: new Date(),
        Company: {
          connect: { id: findHRD.Company.id },
        },
      });
      if (!create) throw new Error("Create failed");
      revalidatePath("/hrd/jobs");
      revalidatePath("/admin/jobs");
      revalidatePath("/", "layout");
      return { message: "Berhasil ditambahkan!", error: false };
    } else {
      const findPosition = await findAvailablePosition({ id });
      if (!findPosition) return { error: true, message: "Position not found" };
      const update = await updateAvailablePosition(findPosition.id as string, {
        positionName: positionName ?? findPosition.positionName,
        capacity: capacity ?? findPosition.capacity,
        about: about ?? findPosition.about,
        status: (status as jobStatus) ?? findPosition.status,
        description: description.length > 0 ? description : findPosition.description,
        requirements: requirements.length > 0 ? requirements : findPosition.requirements,
        benefits: benefits.length > 0 ? benefits : findPosition.benefits,
        submissionStartDate: submissionStartDate ?? findPosition.submissionStartDate,
        submissionEndDate: submissionEndDate ?? findPosition.submissionEndDate,
        salaryStartRange: salaryStartRange ?? findPosition.salaryStartRange,
        salaryEndRange: salaryEndRange ?? findPosition.salaryEndRange,
        updatedAt: new Date(),
      });
      if (!update) throw new Error("Update failed");
      revalidatePath("/hrd/jobs");
      revalidatePath("/admin/jobs");
      revalidatePath("/", "layout");
      return { message: "Berhasil diupdate!", error: false };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Gagal mengupdate portofolio",
      error: true,
    };
  }
};

export const deletePositionById = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user?.id) return { error: true, message: "Unauthorized" };

    const findPosition = await findAvailablePosition({ id });
    if (!findPosition) return { error: true, message: "Position not found" };
    const del = deleteAvailablePosition(id);
    if (!del) throw new Error("Delete failed");

    revalidatePath("/hrd/jobs");
    revalidatePath("/admin/jobs");
    revalidatePath("/", "layout");
    return { message: "Berhasil dihapus!", error: false };
  } catch (error) {
    console.error(error);
    return {
      message: "Gagal mengupdate portofolio",
      error: true,
    };
  }
};

export const applyJobPosition = async (positionId: string) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user?.id) return { error: true, message: "Unauthorized" };
    const findEmployeeById = await findEmployee({ userId: session?.user?.id as string });

    if (!findEmployeeById) return { error: true, message: "You are not a Employee, cannot apply for a job" };

    const findPosition = await findAvailablePosition({ id: positionId });
    if (!findPosition) return { error: true, message: "Position not found" };
    if (findPosition.status !== "OPEN") return { error: true, message: "Position is not open" };

    const existingApplication = await findPositionApplied({
      availablePositionId: positionId,
      employeeId: findEmployeeById.id as string,
      NOT: { applyingStatus: "REJECTED" },
    });
    if (existingApplication) return { error: true, message: "You have already applied for this position" };

    const apply = await createPositionApplied({
      applyDate: new Date(),
      applyingStatus: "PENDING",
      availablePositionId: positionId,
      employeeId: findEmployeeById?.id as string,
    });
    if (!apply) throw new Error("Apply failed");

    revalidatePath("/jobs");
    revalidatePath("/");
    revalidatePath("/hrd/jobs");
    revalidatePath("/admin/jobs");
    revalidatePath("/", "layout");
    return { message: "Lamaran berhasil dikirim!", error: false };
  } catch (error) {
    console.error(error);
    return {
      message: "Gagal mengupdate portofolio",
      error: true,
    };
  }
};

export const manageJobApplication = async (applicationId: string, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user?.id) return { error: true, message: "Unauthorized" };

    const findApplication = await findPositionApplied({ id: applicationId });
    if (!findApplication) return { error: true, message: "Application not found" };

    const applyingStatusData = data.get("applyingStatus") as applyingStatus;

    const update = await updatePositionApplied(findApplication.id as string, {
      applyingStatus: applyingStatusData ?? findApplication.applyingStatus,
    });

    const insertOnCompany = await updateEmployee(
      { id: findApplication.Employee?.id as string },
      {
        companyId: applyingStatusData === "ACCEPTED" ? findApplication.AvailablePosition?.companyId : null,
        updatedAt: new Date(),
      }
    );

    const companyName = findApplication.AvailablePosition?.Company.name;
    const position = findApplication.AvailablePosition?.positionName;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: findApplication.Employee?.user?.email,
      subject: `Informasi Lamaran Anda di ${companyName}`,
      html:
        applyingStatusData === "ACCEPTED"
          ? `
      <p>Halo,</p>
      <p>Kami dengan senang hati menginformasikan bahwa Anda <b>DITERIMA</b> untuk posisi <b>${position}</b> di ${companyName}.</p>
      <p>Tim HRD kami akan segera menghubungi Anda untuk tahap selanjutnya.</p>
      <br/>
      <p>Salam hangat,<br/>Tim Rekrutmen ${companyName}</p>
      `
          : `
      <p>Halo,</p>
      <p>Terima kasih telah melamar untuk posisi <b>${position}</b> di ${companyName}.</p>
      <p>Setelah pertimbangan yang matang, kami mohon maaf bahwa Anda <b>belum dapat kami terima</b> untuk posisi ini.</p>
      <p>Kami menghargai minat dan usaha Anda, dan semoga sukses untuk kesempatan lainnya.</p>
      <br/>
      <p>Hormat kami,<br/>Tim Rekrutmen ${companyName}</p>
      `,
    });

    if (!update && !insertOnCompany) throw new Error("Update failed");

    revalidatePath("/hrd/applications");
    revalidatePath("/admin/applications");
    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return { error: false, message: "Berhasil mengelola lamaran!" };
  } catch (error) {
    console.error(error);
    return {
      message: "Gagal mengupdate portofolio",
      error: true,
    };
  }
};

export const deletePositionAppliedById = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (!["ADMIN", "HRD"].includes(session?.user?.role as userRole)) return { error: true, message: "Unauthorized!" };

    const del = await deletePositionApplied(id);

    if (!del) throw new Error("Delete failed");

    revalidatePath("/profile");
    revalidatePath("/hrd/applications");
    revalidatePath("/admin/applications");
    revalidatePath("/", "layout");
    return { message: "Berhasil dihapus!", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal menghapus Applications",
      error: true,
    };
  }
};
