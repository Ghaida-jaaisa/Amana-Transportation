import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // يعطّل فشل البناء بسبب أخطاء ESLint
  },
};

export default nextConfig;
