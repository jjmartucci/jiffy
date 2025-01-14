const UploadProcess = {
  local: "local",
  S3: "S3",
} as const;

export type UploadProcess = (typeof UploadProcess)[keyof typeof UploadProcess];

export const uploadFormat = () => {
  if (
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_REGION ||
    !process.env.S3_BUCKET_NAME
  ) {
    return UploadProcess.local;
  }
  return UploadProcess.S3;
};
