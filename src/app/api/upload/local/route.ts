import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import Prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { constructFinalFileName } from "@/app/utilities/constructFinalFilename";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const name = formData.get("name") as string;
  const height = formData.get("height") as string;
  const width = formData.get("width") as string;
  const tags: [string] = JSON.parse(formData.get("tags") as string);
  const session = await getServerSession(authOptions);

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileType = file.name.split(".").pop() || "";
  const uniqueFilename = constructFinalFileName(name, fileType);
  const filePath = path.join(
    process.cwd(),
    `public/${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}`,
    uniqueFilename.filename
  ); // Make sure this "uploads" directory exists

  const buffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));

  const tagdb = tags.map((tag) => {
    return {
      where: {
        name: tag,
      },
      create: {
        name: tag,
        createdId: session?.id,
      },
    };
  });

  const createdGif = await Prisma.gif.create({
    data: {
      id: uniqueFilename.cuid,
      name: name,
      filename: uniqueFilename.filename,
      width: parseInt(width),
      height: parseInt(height),
      userId: session?.id,
      tags: {
        connectOrCreate: tagdb,
      },
    },
  });
  return NextResponse.json({ success: true, gif: createdGif });
}
