/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'CDC Bot - 25 de Mayo',
  },
}

module.exports = nextConfig

