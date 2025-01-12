import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["stream-chat-react"],
  images: {
    domains: ['cdn.pixabay.com', 'mysterymtg.com']
  }
};

export default nextConfig;
