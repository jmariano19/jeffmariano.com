import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // The AI Advisor story now lives inside the AI Canvas case study (chapter 01).
  async redirects() {
    return [
      { source: "/case-studies/verizon-ai", destination: "/case-studies/ai-conversational-canvas#where-it-started", permanent: false },
    ];
  },
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
