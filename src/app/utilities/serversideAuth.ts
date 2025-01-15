import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/db";

export const serversideAuth = async (requiresAdmin = false) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(null, { status: 403 });
  }
  if (requiresAdmin) {
    const user = prisma.user.findUnique({
      where: {
        id: session.id,
      },
      include: {
        role: true,
      },
    });

    if (user.role.name !== "admin") {
      return new NextResponse(null, { status: 403 });
    }
  }

  return session;
};
