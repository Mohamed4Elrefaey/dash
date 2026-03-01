/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://vax.teqnyah.com/api/:path*',
      },
    ]
  },
}

export default nextConfig
