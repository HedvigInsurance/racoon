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
  publicRuntimeConfig: {
    routingLocales: i18n.locales.filter((locale) => locale !== 'default'),
  },
}

module.exports = nextConfig
