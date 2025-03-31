import SearchResults from "@/components/SearchResults/SearchResults";

import type { Metadata } from 'next'
import {createUrl} from "@/app/utilities/gifurl";


export async function generateMetadata(
    { params }: {
        params: Promise<{ tag: string }>;
    },
): Promise<Metadata> {
    // read route params
    const tag = (await params).tag;
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/prisma/tags/getGifsByTag?tag=${tag}`
    );
    const {taggedGifs} = await data.json();
    const imageUrl = createUrl(
        process.env.NEXT_PUBLIC_IMAGE_HOST_URL,
        taggedGifs.gifs[0].filename
    );

    return {
        title: `Gifs tagged: ${taggedGifs.name}`,
        openGraph: {
            images: [imageUrl],
        },
    }
}


export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ tag: string }>;
}) {
    const tag = (await params).tag;
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/prisma/tags/getGifsByTag?tag=${tag}`
    );
    const {taggedGifs} = await data.json();

    return (
        <div>
        <h1>{taggedGifs.name}</h1>
            <SearchResults searchResults={taggedGifs.gifs} />
        </div>
    )
}
