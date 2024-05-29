// next.config.mjs
const nextConfig = {
  output: "export", // Set the output directory for static site generation
  reactStrictMode: true, // Enable React strict mode
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint during production builds
  },
};

export default nextConfig;
