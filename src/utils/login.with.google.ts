"use server";

import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { createUser } from "./query/user.query";

export const loginWithGoogle = async (user: AdapterUser | User) => {
  const newUser = await createUser({
    email: user.email as string,
    name: user.name || (user?.email?.split("@")[0] as string),
    profile_picture: user.image || "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png",
    role: "USER",
    password: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    verified: true,
    Society: {
      create: {
        name: user.name || (user?.email?.split("@")[0] as string),
        phone: "",
        date_of_birth: new Date(),
        gender: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  });
  return newUser;
};
