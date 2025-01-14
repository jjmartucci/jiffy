import type { NextConfig } from "next";

let imageHost;
if (process.env.NEXT_PUBLIC_IMAGE_HOST_URL) {
  imageHost = new URL(process.env.NEXT_PUBLIC_IMAGE_HOST_URL);
}

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: imageHost!.hostname,
        port: "",
        pathname: `${imageHost!.pathname}**`,
        search: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: `${imageHost!.pathname}**`,
        search: "",
      },
    ],
  },
};

export default nextConfig;
