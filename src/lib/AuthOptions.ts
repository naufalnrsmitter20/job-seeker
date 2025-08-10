import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { DefaultJWT } from "next-auth/jwt";
import { compare, compareSync, hashSync } from "bcrypt";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { createUser, findUser } from "@/utils/query/user.query";
import { loginWithGoogle } from "@/utils/login.with.google";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      email: string;
      password: string;
      name: string;
      role: string;
      image: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    image: string;
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: { maxAge: 60 * 60 * 24 * 7 },
  pages: {
    signIn: "/login",
    error: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Masukkan Email Anda",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Masukkan Password Anda",
        },
        confirmPassword: {
          label: "Konfirmasi Password",
          type: "password",
          placeholder: "Konfirmasi Password Anda",
        },
        name: {
          label: "Nama Lengkap",
          type: "text",
          placeholder: "Masukkan Nama Lengkap",
        },
        action: { type: "text" },
        loginType: { type: "text" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
            confirmPassword?: string;
            name?: string;
            action: "login" | "register";
            loginType?: "user" | "staff";
          };

          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!existingUser) {
            throw new Error("User tidak ditemukan.");
          } else {
            const isValidPassword = compareSync(password, existingUser.password);
            const isValid = await compare(password, existingUser.password);
            if (!isValid) throw new Error("Password Salah!");
            if (!existingUser.verified) throw new Error("Email belum diverifikasi.");
            if (!isValidPassword) throw new Error("Password Salah!");
            revalidatePath("/signin");
            revalidatePath("/");
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            password: existingUser.password,
            role: existingUser.role,
            image: existingUser.profile_picture || "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png",
          };
        } catch (error) {
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith("/") ? new URL(url, baseUrl).toString() : url;
    },
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          if (user.email) {
            const existingUser = await findUser({ email: user.email });
            if (!existingUser) {
              const newUser = await loginWithGoogle(user);
              if (!newUser) {
                throw new Error("Failed to create user");
              }
              return true;
            }
          }
        }
        if (account?.provider === "credentials") {
          if (user.email) {
            return true;
          }
        }
        if (user.email) {
          const userDatabase = await findUser({ email: user.email });
          if (!userDatabase) {
            revalidatePath("/");
          }
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async jwt({ token, user }) {
      try {
        if (user?.email) {
          const userDatabase = await findUser({ email: user.email });
          if (userDatabase) {
            token.email = userDatabase.email;
            token.id = userDatabase.id;
            token.role = userDatabase.role;
            token.picture = userDatabase.profile_picture || "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png";
          }
        }
        return token;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token.email && session.user) {
          session.user.id = token.id;
          session.user.email = token.email || "";
          session.user.name = token.name || "";
          session.user.password = token.password || "";
          session.user.role = token.role;
          session.user.image = token.picture || "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png";
        }
        return session;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return session;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const nextGetServerSession = () => getServerSession(authOptions);
