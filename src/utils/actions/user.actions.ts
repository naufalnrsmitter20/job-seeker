"use server";

import { userRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createUser, deleteUser, findUser, updateUser } from "@/utils/query/user.query";
import { nextGetServerSession } from "@/lib/AuthOptions";
import { hash } from "bcrypt";
import { createEmployee, updateEmployee } from "../query/employee.query";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import { createHumanResource, updateHumanResource } from "../query/human.resource.query";
import { UploadImageCloudinary } from "../upload.image";

export const updateUserWithId = async (id: string | null, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    const userRole = session?.user?.role;

    const email = data.get("email") as string;
    const name = data.get("name") as string;
    const role = data.get("role") as userRole;
    const password = data.get("password") as string;
    const date_of_birth = data.get("date_of_birth") as string;
    const gender = data.get("gender") as string;
    const phone = data.get("phone") as string;
    const position = data.get("position") as string;

    if (userRole !== "ADMIN") {
      return { error: true, message: "Unauthorized" };
    }

    const findEmail = await findUser({ email });
    if (id && userRole !== "ADMIN") {
      const findById = await findUser({ id });

      if (findById?.role !== userRole) {
        return { error: true, message: "Unauthorized" };
      }
    }

    if (id == null && !findEmail) {
      const create = await createUser({
        email,
        name,
        role,
        password: await hash(password, 10),
        profile_picture: "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png",
      });
      if (["EMPLOYEE", "USER"].includes(role)) {
        await createEmployee({
          userId: create.id,
          name,
          date_of_birth,
          gender,
          phone,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else if (role === "HRD") {
        await createHumanResource({
          userId: create.id,
          name,
          position: position as string,
        });
      }
      const token = randomBytes(32).toString("hex");
      await prisma.emailVerificationToken.create({
        data: {
          user: {
            connect: { id: create.id },
          },
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verifikasi Email Anda",
        html: `<p>Klik link berikut untuk verifikasi akun:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>`,
      });
      if (!create) throw new Error("Update failed");
    } else if (id || findEmail) {
      const findById = await findUser({ id: id || findEmail?.id });
      const update = await updateUser(id ? { id } : { email }, {
        email: email ?? findById?.email,
        name: name ?? findById?.name,
        role: role ?? findById?.role,
        password: password ? await hash(password, 10) : findById?.password,
        profile_picture: findById?.profile_picture || "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png",
      });

      if (["EMPLOYEE", "USER"].includes(role)) {
        if (update.Employee) {
          await updateEmployee(
            { userId: update.id },
            {
              name: name || findById?.Employee?.name,
              date_of_birth: date_of_birth ? new Date(date_of_birth) : findById?.Employee?.date_of_birth,
              gender: gender || findById?.Employee?.gender,
              phone: phone || findById?.Employee?.phone,
              updatedAt: new Date(),
            }
          );
        } else {
          await createEmployee({
            userId: update.id,
            name,
            date_of_birth: new Date(date_of_birth),
            gender,
            phone,
          });
        }
      } else if (role === "HRD") {
        if (update.HumanResource) {
          await updateHumanResource(
            { userId: update.id },
            {
              name,
              position: position as string,
            }
          );
        } else {
          await createHumanResource({
            userId: update.id,
            name,
            position: position as string,
          });
        }
      }
      if (!update) throw new Error("Update failed");
      const token = randomBytes(32).toString("hex");
      await prisma.emailVerificationToken.create({
        data: {
          user: {
            connect: { id: update.id },
          },
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verifikasi Email Anda",
        html: `<p>Klik link berikut untuk verifikasi akun:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>`,
      });
    }

    revalidatePath("/admin/users");
    revalidatePath("/register");
    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { message: "Berhasil disimpan!", error: false };
  } catch (e) {
    console.error(e);
    const error = e as Error;
    return {
      message: error.message.includes("PRIMARY") ? "Email sudah ada!" : "Gagal mengubah user",
      error: true,
    };
  }
};

export const updatePersonalInfo = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { error: true, message: "Unauthorized" };
    }
    const userId = session.user.id;
    const name = data.get("name") as string;
    const date_of_birth_raw = data.get("date_of_birth") as string;
    const gender = data.get("gender") as string;
    const phone = data.get("phone") as string;

    const date_of_birth = date_of_birth_raw ? new Date(date_of_birth_raw) : null;

    const update = await updateUser(
      { id: userId },
      {
        name,
        updatedAt: new Date(),
        Employee: {
          update: {
            name,
            date_of_birth,
            gender,
            phone,
            updatedAt: new Date(),
          },
        },
      }
    );
    if (!update) throw new Error("Update failed");
    revalidatePath("/admin/users");
    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { message: "Berhasil disimpan!", error: false };
  } catch (error) {
    console.error(error);
    return {
      message: "Gagal mengubah informasi pribadi",
      error: true,
    };
  }
};

export const registerUser = async (data: FormData) => {
  try {
    const email = data.get("email") as string;
    const name = data.get("name") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;
    const date_of_birth = data.get("date_of_birth") as string;
    const gender = data.get("gender") as string;
    const phone = data.get("phone") as string;

    if (password !== confirmPassword) {
      return { error: true, message: "Password tidak cocok!" };
    }

    const create = await createUser({
      email,
      name,
      role: "USER",
      password: await hash(password, 10),
      profile_picture: "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png",
      createdAt: new Date(),
      updatedAt: new Date(),
      Employee: {
        create: {
          name,
          date_of_birth: new Date(date_of_birth),
          gender,
          phone,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    });
    if (!create) throw new Error("Registration failed");

    const token = randomBytes(32).toString("hex");
    await prisma.emailVerificationToken.create({
      data: {
        user: {
          connect: { id: create.id },
        },
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verifikasi Email Anda",
      html: `<p>Klik link berikut untuk verifikasi akun:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>`,
    });

    revalidatePath("/login");
    revalidatePath("/admin/users");
    revalidatePath("/register");
    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { message: "Berhasil mendaftar!", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal mendaftar, silakan coba lagi",
      error: true,
    };
  }
};

export const registerHumanResource = async (data: FormData) => {
  try {
    const companyName = data.get("companyName") as string;
    const companyEmail = data.get("companyEmail") as string;
    const companyAddress = data.get("companyAddress") as string;
    const companyPhone = data.get("companyPhone") as string;
    const name = data.get("name") as string;
    const industry = data.get("industry") as string;
    const position = data.get("position") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      return { error: true, message: "Password tidak cocok!" };
    }

    const create = await createUser({
      email: companyEmail,
      name,
      role: "HRD",
      password: await hash(password, 10),
      profile_picture: "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png",
      createdAt: new Date(),
      updatedAt: new Date(),
      HumanResource: {
        create: {
          name,
          position,
          Company: {
            create: {
              email: companyEmail,
              name: companyName,
              type: industry,
              phone: companyPhone,
              description: "empty",
              address: companyAddress,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
      },
    });
    if (!create) throw new Error("Registration failed");

    const token = randomBytes(32).toString("hex");
    await prisma.emailVerificationToken.create({
      data: {
        user: {
          connect: { id: create.id },
        },
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: companyEmail,
      subject: "Verifikasi Email Anda",
      html: `<p>Klik link berikut untuk verifikasi akun:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>`,
    });

    revalidatePath("/login");
    revalidatePath("/admin/users");
    revalidatePath("/register");
    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { message: "Berhasil mendaftar!", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal mendaftar, silakan coba lagi",
      error: true,
    };
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (session?.user?.role != "ADMIN") return { error: true, message: "Only Admin!" };

    const del = await deleteUser(id);

    if (!del) throw new Error("Delete failed");

    revalidatePath("/admin/users");
    revalidatePath("/", "layout");
    return { message: "Berhasil dihapus!", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal menghapus user",
      error: true,
    };
  }
};

export const updateUserProfilePicture = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();
    const userId = session?.user?.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: true, message: "User not found" };

    const image = data.get("image") as File;
    const imageBuffer = await image.arrayBuffer();
    const upload = await UploadImageCloudinary(Buffer.from(imageBuffer));

    await updateUser({ id: userId }, { profile_picture: upload?.data?.url || "" });

    return { message: "Profile picture updated successfully", error: false };
  } catch (e) {
    console.error(e);
    return {
      message: "Gagal memperbarui foto profil",
      error: true,
    };
  }
};
