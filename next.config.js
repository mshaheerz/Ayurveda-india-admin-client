/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/admin',
          permanent: true,
        },
      ]
    },
  }
  
