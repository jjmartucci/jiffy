"use client";
import SearchResults from "@/components/SearchResults/SearchResults";
import { Badge, Flex, Space, Tabs } from "@mantine/core";
import { Gif, Tag } from "@prisma/client";
import Link from "next/link";

type Props = {
  gifs: Array<Gif>;
  newGifs: Array<Gif>;
  tags: Array<Tag>;
  defaultTab?: string;
};

const HomepageTabs = ({ gifs, newGifs, tags, defaultTab }: Props) => {
  const validTabs = ["popular", "recent", "tags"];
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
          <Tabs.Tab value="tags">Tags</Tabs.Tab>
        </Tabs.List>
      </Flex>
      <Space h="lg" />
      <Tabs.Panel value="popular">
        <SearchResults searchResults={gifs} />
      </Tabs.Panel>

      <Tabs.Panel value="recent">
        <SearchResults searchResults={newGifs} />
      </Tabs.Panel>

      <Tabs.Panel value="tags">
        <Flex gap="sm" wrap="wrap" justify="center">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              size="lg"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
              component={Link}
              href={`/tags/${tag.id}`}
              style={{ cursor: "pointer" }}
            >
              {tag.name}
            </Badge>
          ))}
        </Flex>
      </Tabs.Panel>
    </Tabs>
  );
};

export default HomepageTabs;
