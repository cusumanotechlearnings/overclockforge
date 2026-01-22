import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ... any existing configuration you have ...

  // Add this block to ignore type errors during Vercel build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
