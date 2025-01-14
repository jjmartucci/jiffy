import Prisma from "@/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  if (!data) {
    return NextResponse.json(
      { error: "No information to create Gif record with." },
      { status: 400 }
    );
  }

  const gif = await Prisma.gif.create({
    data: data,
  });

  return NextResponse.json({ success: true, fileName: gif.name });
}
