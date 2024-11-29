// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/copilotkit/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/copilotkit_remote/:path*`, // Forward to FastAPI backend's CopilotKit endpoint
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/copilotkit/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_FRONTEND_URL || '*' }, // Restrict to frontend URL
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Requested-With' },
        ],
      },
    ];
  },
};

export default nextConfig;