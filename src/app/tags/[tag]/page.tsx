import GifPage from "@/components/GifPage/GifPage";
import Gif from "@/components/Gif/Gif";
import SearchResults from "@/components/SearchResults/SearchResults";

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
