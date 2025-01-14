import Prisma from "@/db";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ guid: string }> }
) {
  const guid = (await params).guid;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Validate the GUID
  if (typeof guid !== "string") {
    return res.status(400).json({ message: "Invalid GUID" });
  }

  try {
    // Look up the image record in the database using the GUID
    const image = await Prisma.gif.findUnique({
      where: {
        id: guid,
      },
    });

    if (!image || !image.imageUrl) {
      return res.status(400).json({ message: "Image not found" });
    }
    const imagePath = path.join(process.cwd(), image.imageUrl); // Update the file extension as needed

    // Read the file and convert it to a buffer
    const imageData = fs.readFileSync(imagePath);

    // Determine the MIME type (if known, or you could use a library to get the MIME type)
    const mimeType = "image/gif"; // Update this based on your image type or use a library like `mime`

    // Set the appropriate headers
    const headers = new Headers();
    headers.set("Content-Type", mimeType);
    headers.set("Content-Length", `${imageData.length}`);

    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Send the binary data
    return new Response("Hello, Next.js!", {
      status: 200,
      headers,
    });
    res.status(200).send(imageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await Prisma.$disconnect();
  }
}
