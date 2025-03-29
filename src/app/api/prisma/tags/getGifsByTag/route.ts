import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get("tag");

    console.log(`getting gifs for ${tag}`)
    if (!tag) {
        return new Response(null, { status: 500 });
    }
    const taggedGifs = await prisma.tag.findUnique({
        where: {
            id: parseInt(tag)
        },
        include: {
            gifs: true,
        },
    });



    // update the view count
    if (taggedGifs) {
        return NextResponse.json({ taggedGifs });
    }

    return new Response(null, { status: 500 });
}
