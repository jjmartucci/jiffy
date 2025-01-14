import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  const tags = await prisma.tag.findMany({});

  return NextResponse.json({
    tags: tags.map((t) => t.name),
  });
}
