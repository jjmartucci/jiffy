import { NextResponse } from "next/server";
import { serversideAuth } from "@/app/utilities/serversideAuth";
import { uploadFile } from "@/app/utilities/s3";
import { getDbPath } from "@/app/utilities/dbPath";

export async function POST() {
  await serversideAuth();

  const dbPath = getDbPath();

  // execute S3 upload to the db storage location
  try {
    await uploadFile(dbPath);
    return NextResponse.json(
      { message: "DB backup up succesfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
