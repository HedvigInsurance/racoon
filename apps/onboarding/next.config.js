const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['promise.hedvig.com'],
  },
  compiler: {
    emotion: true,
  },
  productionBrowserSourceMaps: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['ui'],
}

module.exports = nextConfig
