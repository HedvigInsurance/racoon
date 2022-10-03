const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  images: {
    domains: ['a.storyblok.com'],
  },
  productionBrowserSourceMaps: true,
  i18n,
  // Temporary fix for normalizing locales.  Will be replaced with redirect configuration
  async redirects() {
    return [
      {
        source: '/sv-se',
        destination: '/se',
        permanent: true,
      },
      {
        source: '/da-dk',
        destination: '/dk',
        permanent: true,
      },
      {
        source: '/nb-no',
        destination: '/no',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
