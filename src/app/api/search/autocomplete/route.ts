import { NextResponse } from "next/server";
import prisma from "@/db";

export async function GET() {
  const gifs = await prisma.gif.findMany();

  // const tags = await prisma.tag.findMany({});

  const names = gifs.map((g) => g.name);
  const uniqueNames = [...new Set(names)];

  const searchTerms = uniqueNames;

  return NextResponse.json({ searchTerms });
}
