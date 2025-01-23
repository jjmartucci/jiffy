import { NextRequest, NextResponse } from "next/server";
import { serversideAuth } from "@/app/utilities/serversideAuth";
import path from "path";
import fs from "fs/promises";

export async function PUT(request: NextRequest) {
  console.info("Running /api/admin/restore");
  await serversideAuth(true);

  const formData = await request.formData();
  const file = formData.get("file") as File;

  // get the location of the database on the server
  const existingDbPath = path.join(process.cwd(), "db", "jiffy.db");
  const backupPath = path.join(process.cwd(), "db", "jiffy-backup.db");
  const newDbPath = path.join(process.cwd(), "db", `jiffy-temp.db`);

  // save the uploaded db file to a temporary location
  try {
    const buffer = await file.arrayBuffer();
    await fs.writeFile(newDbPath, Buffer.from(buffer));
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }

  // make a copy of the existing db
  try {
    await fs.copyFile(existingDbPath, backupPath);
  } catch (e) {
    return NextResponse.json(
      { error: `Couldn't backup existing database ${e}` },
      { status: 500 }
    );
  }

  // rename the temp db to the main db and delete the temp file
  try {
    await fs.rename(newDbPath, existingDbPath);
    // await fs.unlink(newDbPath);
  } catch (e) {
    return NextResponse.json(
      { error: `Couldn't restore the db ${e}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Database restored" }, { status: 200 });
}
