"use client";
import SearchBar from "@/components/SearchBar/SearchBar";
import SearchResults from "@/components/SearchResults/SearchResults";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const search = searchParams.get("q");

  const callSearch = async (searchString: string) => {
    console.log(searchString);
    const searchURL = new URL("/api/search", window.location.href);
    searchURL.searchParams.set("query", searchString);
    const searchFetch = await fetch(searchURL.toString());
    const response = await searchFetch.json();
    setSearchResults(response.gifs);
  };

  useEffect(() => {
    callSearch(search);
  }, [search]);

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return (
    <>
      <SearchBar />
      <SearchResults searchResults={searchResults} />
    </>
  );
}
