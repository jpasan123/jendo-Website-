/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      }
    ],
  },
  experimental: {
    appDir: true,
  }
};

module.exports = nextConfig;