/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Essential for Azure SWA
  output: 'export',
  images: {
    unoptimized: true
  },
  optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  // Fix Three.js transpilation issues
  transpilePackages: ['three'],
  async redirects() {
    return [
      {
        source: '/check-in',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;