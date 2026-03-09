/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sarve-pratibha/shared'],
  typescript: {
    // Type errors are checked in CI via `tsc --noEmit`
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
