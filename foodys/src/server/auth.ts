import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import { isPasswordValid } from "~/utils/hash";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  interface User {
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        login: { label: "Email or nickname", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: unknown) {
        if (
          !(
            typeof credentials === "object" &&
            credentials !== null &&
            "login" in credentials &&
            typeof credentials.login === "string" &&
            "password" in credentials &&
            typeof credentials.password === "string"
          )
        ) {
          return null;
        }

        const user = credentials.login.includes("@")
          ? await db.user.findFirst({
              where: {
                email: credentials.login,
              },
            })
          : await db.user.findFirst({
              where: {
                nickname: credentials.login,
              },
            });

        if (user === null) {
          return null;
        }
        if (!user.password) {
          return null;
        }
        const isPasswordMatch = await isPasswordValid(
          credentials.password,
          user.password
        );
        if (!isPasswordMatch) {
          return null;
        }

        let name = undefined;
        if (user.name) {
          name = user.name;
        } else if (user.firstName && user.lastName) {
          name = `${user.firstName} ${user.lastName}`;
        }

        return { id: user.id, name };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
