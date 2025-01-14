/**
 * Create or update a gif record
 */

import { NextResponse } from "next/server";
import prisma from "@/db";
import lunr from "lunr";
import fs from "fs/promises";
import path from "path";

export async function POST() {
  console.log("Updating search index.");
  const searchFolder = path.join(process.cwd(), `search`);
  await fs.mkdir(searchFolder, { recursive: true });

  const indexPath = path.join(searchFolder, "index.json"); // Make sure this "uploads" directory exists
  const allGifs = await prisma.gif.findMany({
    include: {
      tags: true,
    },
  });

  const documents = allGifs.map((gif) => {
    const doc = {
      id: gif.id,
      name: gif.name,
      description: gif.description,
      tags: gif.tags.map((t) => t.name),
    };
    return doc;
  });

  const idx = lunr(function () {
    this.ref("id");
    this.field("name");
    this.field("description");
    this.field("tags");

    documents.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  const fileToStore = JSON.stringify({ index: idx, lastUpdate: Date.now() });
  await fs.writeFile(indexPath, Buffer.from(fileToStore));
  console.log("Finished updating search index.");

  return NextResponse.json({ success: true });
}
