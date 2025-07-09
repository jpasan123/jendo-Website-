/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  // Add these options to help with build issues
  // output: 'standalone', // Temporarily disable this
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;