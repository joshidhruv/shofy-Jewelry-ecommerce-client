/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.ibb.co",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "defx-store-dev.s3.ap-south-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
