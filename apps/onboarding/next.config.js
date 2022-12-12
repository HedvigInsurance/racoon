const withTM = require('next-transpile-modules')
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
  // We need to enable topLevelAwait for the Pino logger
  webpack: (config) => {
    config.experiments = config.experiments || {}
    config.experiments.topLevelAwait = true
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withTM(['ui'])(nextConfig)
