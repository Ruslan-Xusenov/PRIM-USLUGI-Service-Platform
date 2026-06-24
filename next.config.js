/** @type {import('next').NextConfig} */
const isMobile = process.env.BUILD_TARGET === 'mobile';

const nextConfig = {
  output: isMobile ? 'export' : undefined,
  serverExternalPackages: ['better-sqlite3'],
  images: {
    unoptimized: isMobile,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // For mobile, we disable features that need a server
  ...(isMobile && {
    trailingSlash: true,
  }),
};

module.exports = nextConfig;