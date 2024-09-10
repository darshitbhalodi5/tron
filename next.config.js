/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Remove the 'appDir' option as it's no longer needed in Next.js 14
  },
  async headers() {
    return [
      {
        source: '/sending',
        headers: [
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig