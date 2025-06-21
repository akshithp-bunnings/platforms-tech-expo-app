/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  optimizeFonts: false,
  // Add the following redirect configuration
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
