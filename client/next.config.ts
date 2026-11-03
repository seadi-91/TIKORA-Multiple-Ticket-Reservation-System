import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    turbopackPluginRuntimeStrategy: "forceWorkerThreads" as any,
  },
};

export default nextConfig;
