/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Increase timeout for external image fetching
    minimumCacheTTL: 60,
    // Add device sizes for better optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Increase timeout for image optimization
  experimental: {
    // This helps with slow external image fetches
  },
  // Disable automatic trailing slash redirects to prevent redirect loops
  trailingSlash: false,
  // Optimize compiler for better performance
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Enable SWC minification for faster builds
  swcMinify: true,
}

module.exports = nextConfig
