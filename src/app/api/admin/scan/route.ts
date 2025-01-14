import { uploadFormat } from "@/app/utilities/gifurl";
import prisma from "@/db";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sizeOf from "image-size";
import { listBucket } from "@/app/utilities/s3";

export async function GET() {
  // scan a local directory
  const session = await getServerSession(authOptions);

  const checkFile = async (filename: string, fileSource) => {
    const name = filename.split(".");
    const type = filename.split(".").pop();
    if (type !== "gif") {
      console.log("not a valid file type");
      return;
    }
    name.pop();
    const existingGif = await prisma.gif.findFirst({
      where: {
        filename: filename,
      },
    });

    if (!existingGif) {
      const filePath = path.join(fileSource, filename);

      let dimensions = { width: 500, height: 500 };
      try {
        dimensions = sizeOf(filePath);
      } catch (e) {
        console.log(`Couldn't get dimensions, letting it fall through ${e}`);
      }

      const newgif = await prisma.gif.create({
        data: {
          name: name.join(),
          filename: filename,
          userId: session?.id,
          width: dimensions.width,
          height: dimensions.height,
        },
      });

      newGifs++;
      console.log(`Added ${newgif.name} to database`, newGifs);
    }
  };

  let newGifs = 0;
  if (!session) {
    return new NextResponse(null, { status: 403 });
  }
  if (uploadFormat() === "local") {
    const filesPath = path.join(
      process.cwd(),
      "public",
      process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY || ""
    );

    const files = await fs.readdir(filesPath);

    const checks = files.map((file) => {
      return checkFile(file, filesPath);
    });
    await Promise.all(checks);
    return NextResponse.json({ newGifs });
  } else {
    const bucket = await listBucket();
    const checks = bucket?.map((file) => {
      return checkFile(file, process.env.NEXT_PUBLIC_IMAGE_HOST_URL);
    });
    await Promise.all(checks);

    // update search index
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/search/updateIndex`, {
      method: "POST",
    });
    return NextResponse.json({ newGifs });
  }

  return NextResponse.json({ newGifs });
}
