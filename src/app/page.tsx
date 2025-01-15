import prisma from "../db";
import SearchBar from "@/components/SearchBar/SearchBar";
import SearchResults from "@/components/SearchResults/SearchResults";

export const revalidate = 60;

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

  return (
    <div>
      <SearchBar />
      <SearchResults searchResults={gifs} />
    </div>
  );
}
