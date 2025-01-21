import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import path from "path";
import fs from "fs/promises";
import lunr from "lunr";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
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
  try {
    const results = idx.search(query);
    console.log(`Found ${results.length} results for ${query}`);

    // first do a specific name search
    const matchingGifs = await prisma.gif.findMany({
      where: {
        id: { in: results.map((r) => r.ref) },
      },
    });

    console.log(`Returning ${matchingGifs.length} results for ${query}`);

    return NextResponse.json({
      gifs: [...matchingGifs],
      status: 200,
    });
  } catch (e) {
    return NextResponse.json({
      message: `Search failed: ${e}`,
      status: 500,
    });
  }
}
