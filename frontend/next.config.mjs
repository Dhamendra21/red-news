/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any hostname for now as per current behavior
    }
  ]
  },
  allowedDevOrigins: ['10.119.255.185', 'localhost'],
};

export default nextConfig;
