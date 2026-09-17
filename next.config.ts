import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  async redirects() {
    return [{ source: "/notes", destination: "/thoughts", permanent: true }];
  },
};

export default nextConfig;
