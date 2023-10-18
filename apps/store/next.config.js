const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const experimentJson = require('./experiment.json')
const { SiteCsp, StoryblokCsp } = require('./next-csp.config')
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  experimental: {
    instrumentationHook: true,
    strictNextHead: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Required for nested selectors like `${LargeWrapper}:focus-within > &`
    emotion: true,
  },
  images: {
    domains: ['a.storyblok.com', 'assets.hedvig.com'],
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
  webpack(config) {
    // Suppress known warnings from webpack.cache.PackFileCacheStrategy/webpack.FileSystemInfo comlpaining about PNP modules
    config.infrastructureLogging = { level: 'error' }
    return config
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
  redirects() {
    const locales = ['no', 'no-en', 'dk', 'dk-en']
    const shutDownMarketsInfo = [
      ...locales.map((locale) => ({
        source: `/${locale}/new-member/:path*`,
        destination: `/${locale}/info`,
        permanent: true,
        locale: false,
      })),
    ]

    const oldSiteRedirects =
      process.env.FEATURE_OLD_SITE_REDIRECTS === 'true'
        ? [
            {
              source: '/new-member(.*)',
              destination: '/se',
              permanent: true,
              locale: false,
            },
            {
              source: '/se/new-member(.*)',
              destination: '/se',
              permanent: true,
              locale: false,
            },
            {
              source: '/se-en/new-member(.*)',
              destination: '/se-en',
              permanent: true,
              locale: false,
            },
          ]
        : []

    let memberAreaDefault = []
    if (process.env.NEXT_PUBLIC_FEATURE_MEMBER_AREA === 'true') {
      memberAreaDefault = [
        {
          source: '/member',
          destination: '/member/insurances',
          permanent: false,
        },
      ]
    }

    return [
      ...shutDownMarketsInfo,
      ...oldSiteRedirects,
      ...getExperimentVariantRedirects(),
      ...memberAreaDefault,
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

/**
 * @returns {import('next').Redirect[]}
 * */
const getExperimentVariantRedirects = () => {
  if (typeof process.env.NEXT_PUBLIC_EXPERIMENT_ID !== 'string') return []

  const variantSlug = experimentJson.variants.find((item) => item.slug).slug
  if (!variantSlug) return []

  return [
    {
      source: [experimentJson.slug, variantSlug].join(''),
      destination: experimentJson.slug,
      permanent: false,
      locale: false,
    },
  ]
}

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js %O', module.exports)
