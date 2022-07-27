/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "assets.media-platform.com",
      "lh3.googleusercontent.com",
      "cdn.sanity.io",
    ],
  },
};

module.exports = nextConfig;
