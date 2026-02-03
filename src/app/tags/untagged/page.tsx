import SearchResults from "@/components/SearchResults/SearchResults";
import SearchBar from "@/components/SearchBar/SearchBar";
import prisma from "@/db";

export const dynamic = "force-dynamic";

export default async function UntaggedPage() {
  const untaggedGifs = await prisma.gif.findMany({
    where: {
      tags: {
        none: {},
      },
    },
    include: {
      tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <SearchBar />
      <h1>Untagged</h1>
      <SearchResults searchResults={untaggedGifs} />
    </div>
  );
}
