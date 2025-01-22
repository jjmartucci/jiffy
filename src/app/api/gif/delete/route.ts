/**
 * Create or update a gif record
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { deleteFileByFilename } from "@/app/utilities/s3";
import { serversideAuth } from "@/app/utilities/serversideAuth";

export async function POST(request: NextRequest) {
  const formData = await request.json();
  await serversideAuth();

  const deleteGif = await prisma.gif.delete({
    where: {
      id: formData.id,
    },
  });
  await deleteFileByFilename(deleteGif.filename);

  return NextResponse.json({ success: true, gif: deleteGif });
}
