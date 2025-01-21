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

export const createUrl = (baseUrl: string, ...parts: Array<string>) => {
  // Remove trailing slash from the base URL
  baseUrl = baseUrl.replace(/\/+$/, "");

  // Normalize each part by removing leading and trailing slashes
  parts = parts.map((part) => part.replace(/^\/+|\/+$/g, ""));

  // Join the base URL with the normalized parts
  return [baseUrl, ...parts].join("/");
};
