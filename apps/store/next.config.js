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
    // Required for nested selectors like `${LargeWrapper}:focus-within > &`
    emotion: true,
  },
  images: {
    domains: ['a.storyblok.com'],
  },
  productionBrowserSourceMaps: true,
  i18n,
  transpilePackages: ['ui', 'i18next'],
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
    const foreverRedirect = {
      source: '/forever',
      has: [{ type: 'query', key: 'code', value: '(?<code>.*)' }],
      destination: '/forever/:code',
    }

    const FALLBACK_ORIGIN_URL = process.env.FALLBACK_ORIGIN_URL

    if (!FALLBACK_ORIGIN_URL) {
      return [foreverRedirect]
    }

    return {
      beforeFiles: [
        // Static files needed for OLD market web
        {
          source: '/static/:path*',
          destination: `${process.env.FALLBACK_ORIGIN_URL}/static/:path*`,
        },
        {
          source: '/assets-next/:path*',
          destination: `${process.env.FALLBACK_ORIGIN_URL}/assets-next/:path*`,
        },
        {
          source: '/new-member-assets/:path*',
          destination: `${process.env.FALLBACK_ORIGIN_URL}/new-member-assets/:path*`,
        },
        {
          source: '/onboarding/_next/:path*',
          destination: `${process.env.FALLBACK_ORIGIN_URL}/_next/:path*`,
        },
        // Storyblok assets proxy
        {
          source: '/f/:path*',
          destination: `${process.env.FALLBACK_ORIGIN_URL}/f/:path*`,
        },
      ],
      afterFiles: [foreverRedirect],
      fallback: [
        // Avoid redirect to /default/:path* when URL locale is missing
        {
          source: '/default/:path*',
          destination: `${process.env.FALLBACK_ORIGIN_URL}/:path*`,
          locale: false,
        },
        {
          source: '/:path*',
          destination: `${process.env.FALLBACK_ORIGIN_URL}/:path*`,
          locale: false,
        },
      ],
    }
  },
  async redirects() {
    return process.env.NEXT_PUBLIC_FEATURE_HOMECOMING === 'true'
      ? [
          {
            source: '/no/new-member/:slug*',
            destination: `/no/info`,
            permanent: true,
            locale: false,
          },
          {
            source: '/no-en/new-member/:slug*',
            destination: `/no-en/info`,
            permanent: true,
            locale: false,
          },
          {
            source: '/dk/new-member/:slug*',
            destination: `/dk/info`,
            permanent: true,
            locale: false,
          },
          {
            source: '/dk-en/new-member/:slug*',
            destination: `/dk-en/info`,
            permanent: true,
            locale: false,
          },
        ]
      : []
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
