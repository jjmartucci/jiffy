import { Badge, Flex } from "@mantine/core";
import Link from "next/link";
import prisma from "@/db";
import SearchBar from "@/components/SearchBar/SearchBar";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { gifs: true },
      },
    },
    orderBy: {
      gifs: {
        _count: "desc",
      },
    },
  });

  const untaggedCount = await prisma.gif.count({
    where: {
      tags: {
        none: {},
      },
    },
  });

  return (
    <div>
      <SearchBar />
      <h1>Tags</h1>
      <Flex gap="sm" wrap="wrap" justify="center">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            size="lg"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
            component={Link}
            href={`/tags/${encodeURIComponent(tag.name)}`}
            style={{ cursor: "pointer" }}
          >
            {tag.name} ({tag._count.gifs})
          </Badge>
        ))}
        {untaggedCount > 0 && (
          <Badge
            size="lg"
            variant="outline"
            color="gray"
            component={Link}
            href="/tags/untagged"
            style={{ cursor: "pointer" }}
          >
            untagged ({untaggedCount})
          </Badge>
        )}
      </Flex>
    </div>
  );
}
