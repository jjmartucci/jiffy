import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return new Response(null, { status: 500 });
  }
  const gif = await prisma.gif.findUnique({
    where: {
      id: id,
    },
    include: {
      tags: true,
    },
  });

  // update the view count
  if (gif) {
    await prisma.gif.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ gif });
  }

  return new Response(null, { status: 500 });
}
