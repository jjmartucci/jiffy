"use client";
import { Prisma } from "@prisma/client";
import styles from "./GifPage.module.css";
import { Button, Dialog, Group, Space, Text, Title } from "@mantine/core";
import SkeletonImage from "../SkeletonImage/SkeletonImage";
import GifData from "../GifData/GifData";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createUrl } from "@/app/utilities/gifurl";
import { useRouter } from "next/navigation";

type Props = {
  gifData: Prisma.GifSelect;
};

const GifPage = ({ gifData }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [gif, setGif] = useState(gifData);
  const [editMode, setEditMode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [gifTags, setGifTags] = useState(
    gifData?.tags.map((t) => t.name) || []
  );
  const [newDescription, setNewDescription] = useState(
    gifData?.description || ""
  );
  const [newName, setNewName] = useState(gifData?.name || "");

  const imageUrl = createUrl(
    process.env.NEXT_PUBLIC_IMAGE_HOST_URL,
    gif?.filename
  );

  const editOrSave = async () => {
    if (!session) {
      return;
    }
    if (!editMode) {
      setEditMode(true);
      return;
    }
    // save changes
    if (editMode) {
      const updateData = {
        ...gif,
        name: newName,
        description: newDescription,
        tags: gifTags,
        user: session.id,
      };

      const upsert = await fetch("/api/gif/update", {
        method: "POST",
        body: JSON.stringify(updateData),
      });
      try {
        const response = await upsert.json();
        if (response.success) {
          setGif(response.gif);
        } else {
          setError("Something went wrong");
        }
      } catch {
        setError("Something went wrong");
      }
      setEditMode(false);
      return;
    }
  };

  const canEdit = () => {
    if (!session) {
      return false;
    }
    if (session?.role.name === "admin") {
      return true;
    }
    console.log(gif.createdBy);
    if (gif.userId === session?.id) {
      return true;
    }
    return false;
  };

  const deleteGif = async () => {
    setDeleting(true);
    await fetch("/api/gif/delete", {
      method: "POST",
      body: JSON.stringify({
        id: gifData.id,
      }),
    });
    setDeleting(false);
    router.push("/");
  };

  return (
    <main className={styles.GifPage}>
      <Title>{gif.name}</Title>
      <Space h="md" />
      <div className={styles.GifPage_Inner}>
        <SkeletonImage
          width={gif.width}
          height={gif.height}
          src={imageUrl}
          alt={`Gif named ${gif.name}`}
        />

        <div>
          <GifData
            data={gif}
            editMode={editMode}
            setEditMode={setEditMode}
            editOrSave={editOrSave}
            tags={gifTags}
            setGifTags={setGifTags}
            description={newDescription}
            setDescription={setNewDescription}
            imageUrl={imageUrl}
            views={gif.views}
            name={newName}
            setName={setNewName}
          />

          {canEdit() && (
            <>
              <Space h="xl" />
              <Group justify="space-between">
                <Button variant="outline" color="grape" onClick={editOrSave}>
                  {editMode ? `Save` : `Edit`}
                </Button>

                <Button
                  variant="light"
                  color="red"
                  onClick={deleteGif}
                  loading={deleting}
                >
                  Delete
                </Button>
              </Group>
            </>
          )}
        </div>
      </div>
      <Dialog
        opened={!!error}
        withCloseButton
        onClose={() => setError("")}
        size="lg"
        radius="md"
      >
        <Text size="sm" mb="xs" c="red" fw={500}>
          {error}
        </Text>
      </Dialog>
    </main>
  );
};

export default GifPage;
