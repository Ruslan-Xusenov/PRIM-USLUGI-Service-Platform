/** @type {import('next').NextConfig} */
const isMobile = process.env.BUILD_TARGET === 'mobile';

const nextConfig = {
  output: isMobile ? 'export' : undefined,
  serverExternalPackages: ['better-sqlite3'],
  images: {
    unoptimized: true,
  },
  // For mobile, we disable features that need a server
  ...(isMobile && {
    trailingSlash: true,
  }),
};

module.exports = nextConfig;