/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  productionBrowserSourceMaps: true,
  i18n,
}

module.exports = nextConfig
