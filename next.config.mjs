/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard/ecommerce",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/dashboard/ecommerce",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
