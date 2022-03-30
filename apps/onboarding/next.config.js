const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n,
  pageExtensions: ['page.tsx', 'api.ts', 'next.tsx', 'next.ts'],
  images: {
    domains: ['promise.hedvig.com'],
  },
}
