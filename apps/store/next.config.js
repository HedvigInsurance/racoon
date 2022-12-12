const withTM = require('next-transpile-modules')
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  images: {
    domains: ['a.storyblok.com', 'promise.hedvig.com'],
  },
  productionBrowserSourceMaps: true,
  i18n,
}

module.exports = withTM(['ui'])(nextConfig)
