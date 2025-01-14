import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const password = await hash(data.password, 12);
  const isAdmin = data.admin;

  const role = await prisma.role.findUnique({
    where: {
      name: isAdmin ? "admin" : "user",
    },
  });

  let user;
  try {
    user = await prisma.user.create({
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
