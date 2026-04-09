/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' removed to allow API routes to work in a server environment
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
