/**
 * Create or update a gif record
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(request: NextRequest) {
  const formData = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(null, { status: 403 });
  }

  const tagdb = formData.tags.map((tag) => {
    return {
      where: {
        name: tag,
      },
      update: {},
      create: {
        name: tag,
        createdId: session?.id,
      },
    };
  });

  const tags = tagdb.map((tag) => {
    return prisma.tag.upsert(tag);
  });
  const newTagSet = await Promise.all(tags);

  const gifData = {
    id: formData.id,
    name: formData.name,
    filename: formData.filename,
    description: formData.description,
    width: parseInt(formData.width),
    height: parseInt(formData.height),
    userId: session?.id,
  };

  const createdGif = await prisma.gif.update({
    where: {
      id: gifData.id,
    },
    data: {
      ...gifData,
      tags: {
        set: newTagSet,
      },
    },
    include: {
      tags: true,
    },
  });

  fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/search/updateIndex`, {
    method: "POST",
  });
  return NextResponse.json({ success: true, gif: createdGif });
}
