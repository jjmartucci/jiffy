import { NextRequest, NextResponse } from "next/server";
import { createUrl } from "@/app/utilities/gifurl";

/** Get a single url based on a search parameter */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  // just hit the internal search and return the first result
  const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/search?query=${query}`, {
    method: "GET",
  });

  const {gifs} = await req.json()
  console.log(`found gifs`, gifs);

  if (gifs.length === 0) {
    return NextResponse.json({
      gif: "",
      status: 200,
    });
  }

  const bestMatch =  gifs.gifs[0];

  const imageUrl = createUrl(
    process.env.NEXT_PUBLIC_IMAGE_HOST_URL,
    bestMatch?.filename
  );

  return NextResponse.json({
    gif: imageUrl,
    status: 200,
  });
}
