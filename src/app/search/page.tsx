import SearchBar from "@/components/SearchBar/SearchBar";
import SearchResults from "@/components/SearchResults/SearchResults";
import noResults from "@/images/no-results.gif";
import { Center, Stack, Title } from "@mantine/core";
import Image from "next/image";
export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).q;

  const callSearch = async (searchString: string) => {
    const searchURL = new URL("/api/search", process.env.NEXT_PUBLIC_BASE_PATH);
    searchURL.searchParams.set("query", searchString);
    const searchFetch = await fetch(searchURL.toString());
    const response = await searchFetch.json();

    return response.gifs;
  };

  const searchResults = await callSearch(query);

  return (
    <>
      <SearchBar />
      <Title order={2}>{`${searchResults.length} ${query} gifs`}</Title>
      <SearchResults searchResults={searchResults} />
      {searchResults.length === 0 && (
        <div>
          <Center>
            <Stack>
              <Title order={2}>{`No results for ${query}`}</Title>
              <Image src={noResults} alt="No results found" />
            </Stack>
          </Center>
        </div>
      )}
    </>
  );
}
