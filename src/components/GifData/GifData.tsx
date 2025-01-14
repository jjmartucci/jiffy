"use client";
import {
  CopyButton,
  Button,
  Text,
  Stack,
  Title,
  Space,
  Flex,
  TextInput,
  Grid,
} from "@mantine/core";
import { Prisma } from "@prisma/client";
import { Badge } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

import EditGifForm from "./EditGifForm";

type Props = {
  data: Prisma.GifSelect;
  editMode: boolean;
  setGifTags: Dispatch<Array<string>>;
  tags: Array<Prisma.TagSelect>;
  imageUrl: string;
  views: number;
  description: string;
  setDescription: Dispatch<SetStateAction<string | true>>;
};
const GifData = ({
  data,
  tags,
  editMode,
  setGifTags,
  imageUrl,
  description,
  setDescription,
  views,
}: Props) => {
  if (!data) {
    return null;
  }

  return (
    <>
      <Stack>
        {editMode && (
          <EditGifForm
            tags={tags}
            setTags={setGifTags}
            description={description}
            setDescription={setDescription}
          ></EditGifForm>
        )}

        {!editMode && (
          <>
            <Title order={3}>Description</Title>

            <Text>{data.description}</Text>
            <Title order={3}>Tags</Title>

            <Flex gap="xs">
              {data.tags.map((t) => (
                <Badge
                  size="md"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  key={t.id}
                >
                  {t.name}
                </Badge>
              ))}
            </Flex>
          </>
        )}
      </Stack>
      <Space h="xl" />
      <Stack>
        <Grid>
          <Grid.Col span={8}>
            <TextInput value={imageUrl} readOnly />
          </Grid.Col>
          <Grid.Col span={4}>
            <CopyButton value={imageUrl}>
              {({ copied, copy }) => (
                <Button color={copied ? "teal" : "blue"} onClick={copy}>
                  {copied ? "GIFs ahoy!" : "Copy url"}
                </Button>
              )}
            </CopyButton>
          </Grid.Col>
          <Grid.Col span={12}>
            <Text size="sm">Viewed {views + 1} times.</Text>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
};

export default GifData;
