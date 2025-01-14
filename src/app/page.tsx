import prisma from "../db";
import SearchBar from "@/components/SearchBar/SearchBar";
import SearchResults from "@/components/SearchResults/SearchResults";

export default async function Home() {
  const gifs = await prisma.gif.findMany({
    skip: 0,
    take: 20,
    include: {
      tags: true,
    },
    orderBy: [
      {
        views: "desc",
      },
    ],
  });

  console.log(gifs);
  return (
    <div>
      <SearchBar />
      <SearchResults searchResults={gifs} />
    </div>
  );
}
