import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { serversideAuth } from "@/app/utilities/serversideAuth";

export async function DELETE(request: NextRequest) {
  await serversideAuth();
  const data = await request.json();
  const userId = data.userId;

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return NextResponse.json({
      deletedUser,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
