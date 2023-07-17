const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const { SiteCsp, StoryblokCsp } = require('./next-csp.config')
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  experimental: {
    instrumentationHook: true,
  },
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
    const locales = ['no', 'no-en', 'dk', 'dk-en']
    const shutDownMarketsInfo = [
      ...locales.map((locale) => ({
        source: `/${locale}/new-member`,
        destination: `/${locale}/info`,
        permanent: true,
        locale: false,
      })),
      ...locales.map((locale) => ({
        source: `/${locale}/new-member/offer/:slug*`,
        destination: `/${locale}/info`,
        permanent: true,
        locale: false,
      })),
    ]
    const oldSiteRedirects =
      process.env.FEATURE_OLD_SITE_REDIRECTS === 'true'
        ? [
            {
              source: '/(se/)?new-member(/hedvig)?',
              has: [
                {
                  type: 'query',
                  key: 'code',
                },
              ],
              permanent: false,
              destination: '/api/campaign/:code?code=&next=/se/forsakringar',
              locale: false,
            },
            {
              source: '/(se/)?new-member/car',
              has: [
                {
                  type: 'query',
                  key: 'code',
                },
              ],
              destination: '/api/campaign/:code?code=&next=/se/forsakringar/bilforsakring',
              permanent: false,
              locale: false,
            },
            {
              source: '/(se/)?new-member/car',
              destination: '/se/forsakringar/bilforsakring',
              permanent: false,
              locale: false,
            },
            {
              source: '/se/new-member/home-insurance',
              has: [
                {
                  type: 'query',
                  key: 'code',
                },
              ],
              destination: '/api/campaign/:code?code=&next=/se/forsakringar/hemforsakring',
              permanent: false,
              locale: false,
            },
            {
              source: '/se/new-member/home-insurance',
              destination: '/se/forsakringar/hemforsakring',
              permanent: false,
              locale: false,
            },
            {
              source: '/se-en/new-member/home-insurance',
              has: [
                {
                  type: 'query',
                  key: 'code',
                },
              ],
              destination: '/api/campaign/:code?code=&next=/se-en/insurances/home-insurance',
              permanent: false,
              locale: false,
            },
            {
              source: '/se-en/new-member/home-insurance',
              destination: '/se-en/insurances/home-insurance',
              permanent: false,
              locale: false,
            },
            {
              source: '/se/new-member/car/registration-number',
              destination: '/se/forsakringar/bilforsakring',
              permanent: false,
              locale: false,
            },
          ]
        : []
    return [...shutDownMarketsInfo, ...oldSiteRedirects]
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
