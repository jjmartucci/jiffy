import { NextResponse, type NextRequest } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  PutObjectAclCommand,
} from "@aws-sdk/client-s3";
import Prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { constructFinalFileName } from "@/app/utilities/constructFinalFilename";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3BucketName = process.env.S3_BUCKET_NAME;

export async function GET(request: NextRequest) {
  if (!accessKeyId || !secretAccessKey || !s3BucketName) {
    return new NextResponse(null, { status: 500 });
  }
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const contentType = searchParams.get("contentType");
  const filetype = searchParams.get("filetype") || "";

  if (!name || !contentType) {
    return new NextResponse(null, { status: 500 });
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
  const uniqueFilename = constructFinalFileName(name!, filetype);
  const s3Key = `${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}${uniqueFilename.filename}`;
  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: s3Key,
    ContentType: contentType,
  });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

  if (signedUrl)
    return NextResponse.json({
      key: s3Key,
      signedUrl,
      filename: uniqueFilename.filename,
      cuid: uniqueFilename.cuid,
    });
  return new Response(null, { status: 500 });
}

/**
 * Handle updating ACL and creating record after file is uploaded by client to
 * presigned URL.
 */
export async function POST(request: NextRequest) {
  const formData = await request.json();
  const session = await getServerSession(authOptions);

  const command = new PutObjectAclCommand({
    Bucket: s3BucketName,
    Key: formData.key,
    ACL: "public-read", // Set the ACL to public-read
  });

  if (!accessKeyId || !secretAccessKey || !s3BucketName) {
    return new NextResponse(null, { status: 500 });
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

  try {
    const response = await client.send(command);
    console.log(response);
    console.log("File ACL updated successfully.");
  } catch (err) {
    return NextResponse.json(
      { error: `Error updating ACL: ${err}` },
      { status: 500 }
    );
  }

  const tagdb = formData.tags.map((tag) => {
    return {
      where: {
        name: tag,
      },
      create: {
        name: tag,
        createdId: session?.id,
      },
    };
  });

  const createdGif = await Prisma.gif.create({
    data: {
      id: formData.cuid,
      name: formData.name,
      filename: formData.filename,
      width: parseInt(formData.width),
      height: parseInt(formData.height),
      userId: session?.id,
      description: formData.description,
      tags: {
        connectOrCreate: tagdb,
      },
    },
  });

  // update the search index with the new gif included
  fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/search/updateIndex`, {
    method: "POST",
  });
  return NextResponse.json({ success: true, gif: createdGif });
}
