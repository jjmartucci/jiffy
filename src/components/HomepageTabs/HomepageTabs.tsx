"use client";
import SearchResults from "@/components/SearchResults/SearchResults";
import { Flex, Space, Tabs } from "@mantine/core";
import { Gif } from "@prisma/client";
type Props = {
  gifs: Array<Gif>;
  newGifs: Array<Gif>;
};
const HomepageTabs = ({ gifs, newGifs }: Props) => {
  return (
    <Tabs color="violet" variant="pills" radius="xl" defaultValue="popular">
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
