/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  nextConfig,
  env: {
    NEXT_PUBLIC_ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  },
  images: {
    loader: "akamai",
    path: "",
  },
  experimental: {
    images: {
      unoptimized: true,
    },
  },
};
