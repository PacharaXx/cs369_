// next.config.mjs
const nextConfig = {
  output: "export", // Set the output directory for static site generation
  reactStrictMode: true, // Enable React strict mode
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint during production builds
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "http://localhost:3001/api/:path*", // Proxy to Backend
  //     },
  //     {
  //       source: '/:path*',
  //       destination: '/',
  //     },
  //   ];
  // },
};

export default nextConfig;
