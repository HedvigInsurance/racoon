const path = require('path')
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
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      const originalEntry = config.entry
      config.entry = async () => {
        const wdrPath = path.resolve(__dirname, './src/utils/whyDidYouRender.ts')
        const entries = await originalEntry()
        if (entries['main.js'] && !entries['main.js'].includes(wdrPath)) {
          entries['main.js'].push(wdrPath)
        }
        return entries
      }
    }

    return config
  },
}

module.exports = nextConfig
