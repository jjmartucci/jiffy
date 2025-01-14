import { NextResponse } from "next/server";
import { UploadProcess } from "@/app/utilities/gifurl";

export async function GET() {
  let type: UploadProcess = "local";

  if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.S3_BUCKET_NAME
  ) {
    type = "S3";
  }

  return NextResponse.json({ type });
}
