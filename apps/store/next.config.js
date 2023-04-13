const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const { SiteCsp, StoryblokCsp } = require('./next-csp.config')
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['a.storyblok.com', 'promise.hedvig.com'],
  },
  productionBrowserSourceMaps: true,
  i18n,
  transpilePackages: ['ui'],
  // Docs: https://nextjs.org/docs/advanced-features/security-headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/editor(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: StoryblokCsp,
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/forever',
        has: [{ type: 'query', key: 'code', value: '(?<code>.*)' }],
        destination: '/forever/:code',
      },
      {
        source: '/se/blogg',
        destination: 'https://www.hedvig.com/se/blogg',
        locale: false,
      },
      {
        source: '/se/blogg/:slug',
        destination: 'https://www.hedvig.com/se/blogg/:slug',
        locale: false,
      },
      {
        source: '/en-se/blog',
        destination: 'https://www.hedvig.com/se-en/blog',
        locale: false,
      },
      {
        source: '/dk',
        destination: 'https://www.hedvig.com/dk',
        locale: false,
      },
    ]
  },
})

const securityHeaders = [
  // Reduce latency when the user clicks a link
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: SiteCsp,
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
]

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js %O', module.exports)
