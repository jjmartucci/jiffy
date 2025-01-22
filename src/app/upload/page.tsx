"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import Gif from "@/components/Gif/Gif";
import {
  Button,
  Dialog,
  TextInput,
  Text,
  Textarea,
  Stack,
  Paper,
  Grid,
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { PhotoIcon } from "@/components/icons/icons";
import { useDisclosure } from "@mantine/hooks";

import "@mantine/dropzone/styles.css";
import styles from "./page.module.css";

import Unauthorized from "@/components/Unauthorized/Unauthorized";
import { TagSelect } from "@/components/TagSelect/TagSelect";

const UploadPage = () => {
  const [files, setFiles] = React.useState<FileWithPath[]>([]);

  const [gifName, setGifName] = React.useState("");
  const [error, setError] = React.useState("");
  const [gifTags, setGifTags] = React.useState([]);
  const [gifDescription, setGifDescription] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  // const [success, setSuccess] = React.useState(false);
  const [fileLoading, setFileLoading] = React.useState(false);
  // const [tagOptions, setTagOptions] = React.useState([]);
  const [displayFile, setDisplayFile] = React.useState<
    string | ArrayBuffer | null
  >(null);

  const [uploadedGif, setUploadedGif] = React.useState<Prisma.GifSelect | null>(
    null
  );
  const displayImage = React.useRef<HTMLImageElement | null>(null);
  const [opened, { toggle, close }] = useDisclosure(false);

  const { data: session } = useSession();

  useEffect(() => {
    const getTags = async () => {
      //const tags = await fetch("/api/prisma/tags/listAll");
      //const list = (await tags.json()).tags;
      // setTagOptions(list);
    };
    getTags();
  }, []);

  const showNewGifAndResetForm = (gif: Prisma.GifSelect) => {
    toggle();
    setUploadedGif(gif);
    // setSuccess(true);
    setFiles(null);
    setDisplayFile("");
    setGifName("");
    setGifDescription("");
    setGifTags([]);
  };

  const removeFiles = () => {
    setFiles(null);
    setDisplayFile(null);
  };

  const handleFileChange = (files: FileWithPath[]) => {
    setFileLoading(true);

    const reader = new FileReader();
    reader.onloadend = function () {
      setDisplayFile(reader.result); // Set the Base64 string as the src
    };

    if (files && files.length > 0) {
      const nameSplit = files[0].name.split(".");
      nameSplit.pop();
      setFiles(files[0]);
      setGifName(nameSplit.join());
      reader.readAsDataURL(files[0]);
    }
    setFileLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (files.length === 0) {
      setError("Hey, I need a gif!");

      return;
    }
    if (!gifName) {
      setError("Give me a name at least!");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result;

      // Check what kind of upload we need to handle
      const uploadType = await (
        await fetch("/api/upload/getProcessType")
      ).json();

      const imageWidth = displayImage.current?.width;
      const imageHeight = displayImage.current?.height;

      // Do the local upload
      if (uploadType.type === "local") {
        const formData = new FormData();
        formData.append("file", files);
        formData.append("name", gifName);
        formData.append("tags", JSON.stringify(gifTags));
        formData.append("height", `${imageHeight}`);
        formData.append("width", `${imageWidth}`);
        formData.append("description", gifDescription);

        const localSave = await fetch("/api/upload/local", {
          method: "POST",
          body: formData,
        });

        console.log(localSave);
        // handle success / errors then return
        if (localSave.status === 200) {
          setUploading(false);
          showNewGifAndResetForm((await localSave.json()).gif);
          return;
        }

        // show error
        setUploading(false);
        return;
      }

      // Handle S3 Uploads
      if (fileData) {
        // Get a presigned URL
        const presignedURL = new URL("/api/presigned", window.location.href);
        const filetype = files.name.split(".").pop() || "";
        presignedURL.searchParams.set("name", gifName);
        presignedURL.searchParams.set("contentType", files.type);
        presignedURL.searchParams.set("filetype", filetype);
        fetch(presignedURL.toString())
          .then((res) => res.json())
          .then((res) => {
            const body = new Blob([fileData], { type: files.type });
            fetch(res.signedUrl, {
              body,
              method: "PUT",
            }).then(async () => {
              // update ACL to public read
              const aclData = new FormData();
              const body = {
                key: res.key,
                cuid: res.cuid,
                filename: res.filename,
                name: gifName,
                width: imageWidth,
                height: imageHeight,
                tags: gifTags,
                description: gifDescription,
              };
              aclData.append("key", res.key);
              const presignedPost = await fetch("/api/presigned", {
                method: "POST",
                body: JSON.stringify(body),
              });
              const newGif = await presignedPost.json();
              setUploading(false);
              showNewGifAndResetForm(newGif.gif);
            });
          });
      }
    };
    reader.readAsArrayBuffer(files);
  };

  /* put this in a toast or something
       {success && (
          <div>
            <Gif data={uploadedGif} />
          </div>
        )}
          */

  if (session === null) {
    return <Unauthorized />;
  }
  return (
    <div>
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit}>
        <Grid className={styles.Upload_Form}>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Paper shadow="xs" p="xl">
              {!displayFile && (
                <Dropzone
                  accept={{
                    "image/*": [], // All images
                  }}
                  onDrop={(e) => {
                    handleFileChange(e);
                  }}
                  loading={fileLoading}
                >
                  <Dropzone.Accept>Feed me seymour</Dropzone.Accept>
                  <Dropzone.Reject>Nah!</Dropzone.Reject>
                  <Dropzone.Idle>
                    <PhotoIcon />
                    <Text size="xl" inline>
                      Gimme a gif
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      And make it a good one.
                    </Text>
                  </Dropzone.Idle>
                </Dropzone>
              )}
              {displayFile && (
                <Stack>
                  <img
                    src={displayFile}
                    ref={displayImage}
                    alt={gifDescription}
                  />
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={() => removeFiles()}
                  >
                    Wait, not that one
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
            <Paper shadow="xs" p="xl">
              <Stack>
                {error && (
                  <Text size="xs" fw={500} c="red">
                    {error}
                  </Text>
                )}
                <TextInput
                  label="Gif me a name"
                  id="name"
                  name="name"
                  value={gifName}
                  onChange={(e) => setGifName(e.target.value)}
                  required
                />

                <TagSelect value={gifTags} setValue={setGifTags} />
                <Textarea
                  placeholder="I am a gif of [something] showing [humorous situation]."
                  label="Description"
                  autosize
                  value={gifDescription}
                  onChange={(e) => setGifDescription(e.target.value)}
                  minRows={2}
                />

                <Button variant="filled" type="submit" loading={uploading}>
                  Upload
                </Button>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </form>
      <Dialog
        opened={opened}
        withCloseButton
        onClose={close}
        size="lg"
        radius="md"
      >
        <Text size="sm" mb="xs" fw={500}>
          File uploaded!
        </Text>
        <Gif data={uploadedGif} />
      </Dialog>
    </div>
  );
};

export default UploadPage;
