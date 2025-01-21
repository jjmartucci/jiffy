import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import path from "path";
import fs from "fs/promises";
import lunr from "lunr";
import { createUrl } from "@/app/utilities/gifurl";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const indexPath = path.join(process.cwd(), `search`, "index.json"); // Make sure this "uploads" directory exists

  try {
    await fs.access(indexPath);
  } catch {
    console.log("No index exists, let's make one.");
    await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/search/updateIndex`, {
      method: "POST",
    });
  }

  const data = await fs.readFile(indexPath, "utf8");

  const idx = lunr.Index.load(JSON.parse(data).index);
  const results = idx.search(query);

  if (results.length === 0) {
    return NextResponse.json({
      gif: "",
      status: 200,
    });
  }

  const bestMatch = await prisma.gif.findFirst({
    where: {
      id: results[0].ref,
    },
  });

  const imageUrl = createUrl(
    process.env.NEXT_PUBLIC_IMAGE_HOST_URL,
    bestMatch?.filename
  );

  return NextResponse.json({
    gif: imageUrl,
    status: 200,
  });
}
