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
    const RESULT_LIMIT = 10;
    const localResults = fuseResults.map(fr => fr.item);
    let gifs: unknown[] = localResults;

    if (localResults.length < RESULT_LIMIT && process.env.GIPHY_API_KEY && normalizedQuery) {
      const needed = RESULT_LIMIT - localResults.length;
      const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${encodeURIComponent(normalizedQuery)}&limit=${needed}&rating=g`;
      try {
        const giphyRes = await fetch(giphyUrl);
        const giphyData = await giphyRes.json();
        const giphyGifs = (giphyData.data ?? []).map((gif: {
          id: string;
          title: string;
          url: string;
          images: { original: { url: string; width: string; height: string } };
        }) => ({
          id: `giphy_${gif.id}`,
          name: gif.title || gif.id,
          filename: `https://media.giphy.com/media/${gif.id}/giphy.gif`,
          width: parseInt(gif.images.original.width) || 480,
          height: parseInt(gif.images.original.height) || 270,
          description: null,
          views: 0,
          source: 'giphy' as const,
          giphyPageUrl: gif.url,
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: '',
        }));
        gifs = [...localResults, ...giphyGifs];
      } catch (e) {
        console.error('Giphy fetch failed', e);
      }
    }

    return NextResponse.json({
      gifs,
      status: 200,
    });
  } catch (e) {
    return NextResponse.json({
      message: `Search failed: ${e}`,
      status: 500,
    });
  }
}
