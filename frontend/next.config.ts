import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'https://project-management-2-uqia.onrender.com/api/auth/:path*',
      },
      {
        source: '/api/tasks/:path*',
        destination: 'https://project-management-2-uqia.onrender.com/api/tasks/:path*',
      },
      {
        source: '/api/projects/:path*',
        destination: 'https://project-management-2-uqia.onrender.com/api/projects/:path*',
      },
    ];
  },
};

export default nextConfig;
