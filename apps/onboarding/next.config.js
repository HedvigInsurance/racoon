const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n,
  async redirects() {
    return [
      {
        source: '/forever/:code',
        destination: '/forever?code=:code',
        permanent: true,
      },
    ]
  },
}
