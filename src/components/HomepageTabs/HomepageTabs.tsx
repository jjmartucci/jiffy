"use client";
import SearchResults from "@/components/SearchResults/SearchResults";
import { Button, Flex, Space, Tabs } from "@mantine/core";
import { Gif } from "@prisma/client";
import Link from "next/link";

type Props = {
  gifs: Array<Gif>;
  newGifs: Array<Gif>;
  defaultTab?: string;
};

const HomepageTabs = ({ gifs, newGifs, defaultTab }: Props) => {
  const validTabs = ["popular", "recent"];
  const initialTab = validTabs.includes(defaultTab || "") ? defaultTab : "popular";

  return (
    <Tabs color="violet" variant="pills" radius="xl" defaultValue={initialTab}>
      <Flex
        mih={50}
        gap="lg"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Tabs.List>
          <Tabs.Tab value="popular">Popular</Tabs.Tab>
          <Tabs.Tab value="recent">Recent</Tabs.Tab>
        </Tabs.List>
        <Button
          component={Link}
          href="/tags"
          variant="light"
          color="violet"
          radius="xl"
        >
          Tags
        </Button>
      </Flex>
      <Space h="lg" />
      <Tabs.Panel value="popular">
        <SearchResults searchResults={gifs} />
      </Tabs.Panel>

      <Tabs.Panel value="recent">
        <SearchResults searchResults={newGifs} />
      </Tabs.Panel>
    </Tabs>
  );
};

export default HomepageTabs;
