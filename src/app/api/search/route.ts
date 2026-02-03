import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import path from "path";
import fs from "fs/promises";
import Fuse from 'fuse.js'


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const indexPath = path.join(process.cwd(), `search`, "index.json"); // Make sure this "uploads" directory exists

  // Fuse search
  const allGifs = await prisma.gif.findMany({
    include: {
      tags: true,
    },
  });

  const fuseOptions = {
    // isCaseSensitive: false,
    includeScore: true, // default false
    // ignoreDiacritics: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: .4,
    // distance: 100,
    // useExtendedSearch: false,
    ignoreLocation: true, // match anywhere in descriptions
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: [
      "name",
      "description",
      "tags.name"
    ]
  }

  const fuse = new Fuse(allGifs, fuseOptions);
  // Normalize query: replace hyphens/underscores with spaces for looser matching
  const normalizedQuery = query?.replace(/[-_]+/g, ' ') || '';
  const fuseResults = fuse.search(normalizedQuery)
  console.log(`fuseResults`, fuseResults)
  // end fuse search

  try {
    await fs.access(indexPath);
  } catch {
    console.log("No index exists, let's make one.");
    await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/search/updateIndex`, {
      method: "POST",
    });
  }

  // const data = await fs.readFile(indexPath, "utf8");
  // const idx = lunr.Index.load(JSON.parse(data).index);

  try {
    /** prior Lunr implementation

     const results = idx.search(query);

    const matchingGifs = await prisma.gif.findMany({
      where: {
        id: { in: results.map((r) => r.ref) },
      },
    });

    const orderedGifs = results.map(result => {
      return matchingGifs.find(gif => gif.id === result.ref)
    })
    */

    return NextResponse.json({
      gifs: fuseResults.map(fs => fs.item),
      status: 200,
    });
  } catch (e) {
    return NextResponse.json({
      message: `Search failed: ${e}`,
      status: 500,
    });
  }
}
