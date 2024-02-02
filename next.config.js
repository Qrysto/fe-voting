/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/vote',
        destination: '/ranking',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
