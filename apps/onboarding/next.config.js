const { i18n } = require('./next-i18next.config')
const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const moduleExports = {
  reactStrictMode: true,
  i18n,
  pageExtensions: ['page.tsx', 'api.ts', 'next.tsx', 'next.ts'],
}

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
