/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@travel-gacha/api',
    '@travel-gacha/store',
    '@travel-gacha/ui',
    '@travel-gacha/utils',
    '@travel-gacha/types'
  ]
};

export default nextConfig;
