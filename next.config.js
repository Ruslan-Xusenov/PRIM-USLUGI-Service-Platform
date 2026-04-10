/** @type {import('next').NextConfig} */
const isMobile = process.env.BUILD_TARGET === 'mobile';

const nextConfig = {
  output: isMobile ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  // For mobile, we disable features that need a server
  ...(isMobile && {
    trailingSlash: true,
  }),
};

module.exports = nextConfig;