import { NextResponse } from "next/server";
import { serversideAuth } from "@/app/utilities/serversideAuth";
import { uploadFile } from "@/app/utilities/s3";
import path from "path";

export async function POST() {
  await serversideAuth();

  // get the location of the database on the server
  const dbPath = path.join(process.cwd(), "db", "jiffy.db");

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
