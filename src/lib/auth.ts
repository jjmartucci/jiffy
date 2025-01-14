import Prisma from "@/db";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Username and Password",
      credentials: {
        name: {
          label: "Name",
          type: "name",
          placeholder: "username",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.name || !credentials.password) {
          return null;
        }
        const user = await Prisma.user.findUnique({
          where: {
            name: credentials.name,
          },
          include: {
            role: true,
          },
        });
        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }
        return {
          id: user.id,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // This is called whenever a JWT is created or updated
      if (user) {
        token.id = user.id; // Add user id to the token
        token.role = user.role;
      }
      return token; // Return the updated token
    },
    async session({ session, token }) {
      // On session retrieval, merge token properties into the session
      session.id = token.id; // Add id from token to session
      session.role = token.role;
      return session; // Return the updated session
    },
  },
};
