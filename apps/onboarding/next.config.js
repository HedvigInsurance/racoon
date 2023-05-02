const { i18n } = require('./next-i18next.config')

const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['promise.hedvig.com'],
    // Required to work with "assetPrefix": https://github.com/vercel/next.js/issues/20968#issuecomment-1015328088
    path: isProd ? `${process.env.ASSET_PREFIX}/_next/image` : undefined,
  },
  compiler: {
    emotion: true,
  },
  productionBrowserSourceMaps: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['ui'],
  assetPrefix: isProd ? process.env.ASSET_PREFIX : undefined,
}

module.exports = nextConfig
