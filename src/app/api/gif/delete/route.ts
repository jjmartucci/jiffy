/**
 * Create or update a gif record
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { deleteS3Keys } from "@/app/utilities/s3";
import { serversideAuth } from "@/app/utilities/serversideAuth";

export async function POST(request: NextRequest) {
  const formData = await request.json();
  await serversideAuth();

  const deleteGif = await prisma.gif.delete({
    where: {
      id: formData.id,
    },
  });
  deleteS3Keys({ keys: [deleteGif.filename] });

  return NextResponse.json({ success: true, gif: deleteGif });
}
