"use client";
import { Autocomplete, AutocompleteProps, Group, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import GlowBox from "../GlowBox/GlowBox";
import { useEffect, useState } from "react";

import styles from "./SearchBar.module.css";

const SearchBar = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [gifCount, setGifCount] = useState();
  const [autocompleteTerms, setautocompleteTerms] = useState([]);
  const callSearch = (searchString: string) => {
    console.log(searchString);
    router.push(`/search?q=${searchString}`);
  };
  const getCount = async () => {
    const countRequest = await fetch("/api/admin/count");
    setGifCount((await countRequest.json()).gifCount);
  };
  const submitSearch = async (e: Event) => {
    e.preventDefault();
    callSearch(value);
  };
  const getAutocompleteOptions = async () => {
    const request = await fetch("/api/search/autocomplete");
    const data = (await request.json()).searchTerms;
    setautocompleteTerms(data);
  };

  useEffect(() => {
    getCount();
  }, []);

  const renderAutocompleteOption: AutocompleteProps["renderOption"] = ({
    option,
  }) => {
    return (
      <Group gap="sm">
        <div>
          <Text size="sm">{option.value}</Text>
        </div>
      </Group>
    );
  };

  useEffect(() => {
    getAutocompleteOptions();
  }, []);

  return (
    <form onSubmit={(e) => submitSearch(e)}>
      <GlowBox>
        <Autocomplete
          size="xl"
          placeholder={`Search all ${gifCount} gifs...`}
          limit={5}
          onFocus={() => setValue("")}
          value={value}
          onChange={(e) => setValue(e)}
          data={autocompleteTerms}
          renderOption={renderAutocompleteOption}
          comboboxProps={{
            transitionProps: { transition: "fade-down", duration: 200 },
          }}
          className={styles.Search_Input}
          onOptionSubmit={callSearch}
        />
      </GlowBox>
    </form>
  );
};

export default SearchBar;
