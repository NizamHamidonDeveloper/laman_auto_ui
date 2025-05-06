/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize build performance
  swcMinify: true,
  
  // Reduce memory usage during builds
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Enable webpack caching
  webpack: (config, { dev, isServer }) => {
    // Enable webpack caching
    config.cache = true;

    return config;
  },
}

module.exports = nextConfig 