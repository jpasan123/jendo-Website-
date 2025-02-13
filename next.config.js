/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      }
    ],
  },
  // Exclude API routes from static export
  excludeDefaultMomentLocales: true,
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;