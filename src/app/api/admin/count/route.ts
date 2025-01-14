import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  const gifCount = await prisma.gif.count();
  return NextResponse.json({
    gifCount,
  });
}
