import HomepageTabs from "@/components/HomepageTabs/HomepageTabs";
import prisma from "../db";
import SearchBar from "@/components/SearchBar/SearchBar";

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

  const newGifs = await prisma.gif.findMany({
    skip: 0,
    take: 20,
    include: {
      tags: true,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <div>
      <SearchBar />
      <HomepageTabs gifs={gifs} newGifs={newGifs} />
    </div>
  );
}
