const nextConfig = {
  output: "export", // Set the output directory for static site generation
  reactStrictMode: true, // Enable React strict mode
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint during production builds
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*", // Proxy to Backend
      },
      {
        source: "/uploads/:path*", // Proxy uploads requests to the backend
        destination: "http://localhost:3001/uploads/:path*",
      },
      {
        source: "/:path*",
        destination: "/", // General fallback route
      },
    ];
  },
};

export default nextConfig;
