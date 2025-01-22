"use client";
import { Stack, Textarea, TextInput } from "@mantine/core";
import { Prisma } from "@prisma/client";

import { Dispatch, SetStateAction } from "react";
import { TagSelect } from "../TagSelect/TagSelect";

type Props = {
  data: Prisma.GifSelect;
  tags: [string];
  setTags: Dispatch<SetStateAction<Array<string>>>;
  imageUrl: string;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  views: number;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
};
const EditGifForm = ({
  description,
  name,
  setName,
  setDescription,
  tags,
  setTags,
}: Props) => {
  return (
    <>
      <Stack>
        <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea
          placeholder="I am a gif of [something] showing [humorous situation]."
          autosize
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          minRows={2}
        />

        <TagSelect label="Tags" value={tags} setValue={setTags} />
      </Stack>
    </>
  );
};

export default EditGifForm;
