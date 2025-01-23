import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { serversideAuth } from "@/app/utilities/serversideAuth";

export async function PATCH(request: NextRequest) {
  await serversideAuth();

  const data = await request.json();
  const userId = data.userId;
  const password = await hash(data.password, 12);
  const isAdmin = data.isAdmin;

  const role = await prisma.role.findUnique({
    where: {
      name: isAdmin ? "admin" : "user",
    },
  });

  let user;
  try {
    user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.username,
        password: password,
        roleId: role.id,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: e }, { status: 500 });
  }

  return NextResponse.json({
    user,
  });
}
