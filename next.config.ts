import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Compress responses
  compress: true,
  // Power HTTP headers for SEO & security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security headers (also a ranking signal)
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), interest-cohort=()" },
        ],
      },
      {
        // Long cache for static assets
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  // Redirect www to non-www (canonical domain consolidation)
  async redirects() {
    return [
      {
        source: "/(.*)",
        has: [{ type: "host", value: "www.wastemytime.fun" }],
        destination: "https://wastemytime.fun/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
