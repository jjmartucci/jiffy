"use client";
import { Button, Flex, Space } from "@mantine/core";
import Link from "next/link";

type Props = {
  active?: "popular" | "recent" | "tags";
};

const TopNav = ({ active }: Props) => {
  return (
    <>
      <Flex
        mih={50}
        gap="sm"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Button
          component={Link}
          href="/?tab=popular"
          variant={active === "popular" ? "filled" : "light"}
          color="violet"
          radius="xl"
        >
          Popular
        </Button>
        <Button
          component={Link}
          href="/?tab=recent"
          variant={active === "recent" ? "filled" : "light"}
          color="violet"
          radius="xl"
        >
          Recent
        </Button>
        <Button
          component={Link}
          href="/tags"
          variant={active === "tags" ? "filled" : "light"}
          color="violet"
          radius="xl"
        >
          Tags
        </Button>
      </Flex>
      <Space h="lg" />
    </>
  );
};

export default TopNav;
