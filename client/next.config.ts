import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackPluginRuntimeStrategy: "forceWorkerThreads" as any,
  },
};

export default nextConfig;
