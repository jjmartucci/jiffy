import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
  waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3BucketName = process.env.S3_BUCKET_NAME;
const s3Prefix = process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY;

export const getS3Client = () => {
  if (!accessKeyId || !secretAccessKey || !s3BucketName) {
    return null;
  }
  const client = new S3Client({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return client;
};

export const listBucket = async (): Promise<Array<string>> => {
  const s3Client = getS3Client();
  if (!s3Client) {
    return [];
  }
  const command = new ListObjectsV2Command({
    Bucket: s3BucketName,
    Prefix: s3Prefix,
  });

  try {
    let isTruncated = true;

    let contents: Array<string> = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await s3Client.send(command);
      const contentsList = Contents.map((c) => c.Key.split("/").pop());
      contents = contentsList;
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }

    return contents;
    //writeFileSync("./gifs.json", JSON.stringify(contents, null, 2), "utf8");
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const deleteS3Keys = async ({ keys }: { keys: [string] }) => {
  const client = getS3Client();

  try {
    const { Deleted } = await client.send(
      new DeleteObjectsCommand({
        Bucket: s3BucketName,
        Delete: {
          Objects: keys.map((k) => ({ Key: k })),
        },
      })
    );
    for (const key in keys) {
      await waitUntilObjectNotExists(
        { client },
        { Bucket: s3BucketName, Key: key }
      );
    }
    console.log(
      `Successfully deleted ${Deleted.length} objects from S3 bucket. Deleted objects:`
    );
    console.log(Deleted.map((d) => ` • ${d.Key}`).join("\n"));
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "NoSuchBucket"
    ) {
      console.error(
        `Error from S3 while deleting objects from ${bucketName}. The bucket doesn't exist.`
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while deleting objects from ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
};
