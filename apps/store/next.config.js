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
              source: '/(se/)?new-member(/hedvig)?',
              has: [{ type: 'query', key: 'code' }],
              destination: '/api/campaign/:code?code=&next=/se/forsakringar',
              permanent: true,
              locale: false,
            },
            {
              source: '/se-en/new-member(/hedvig)?',
              has: [{ type: 'query', key: 'code' }],
              destination: '/api/campaign/:code?code=&next=/se-en/insurances',
              permanent: true,
              locale: false,
            },
            {
              source: '/(se/)?new-member(/hedvig)?',
              destination: '/se/forsakringar',
              permanent: true,
              locale: false,
            },
            {
              source: '/se-en/new-member(/hedvig)?',
              destination: '/se-en/insurances',
              permanent: true,
              locale: false,
            },
            ...CAR_INSURANCE_REDIRECTS,
            ...HOME_INSURANCE_REDIRECTS,
          ]
        : []
    return [...shutDownMarketsInfo, ...oldSiteRedirects, ...getExperimentVariantRedirects()]
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

const HOME_INSURANCE_SE_SOURCES = [
  '/se/new-member/home-insurance',
  '/se/new-member/home-accident-needer',
  '/se/new-member/home-switcher',
]
const HOME_INSURANCE_EN_SOURCES = [
  '/se-en/new-member/home-insurance',
  '/se-en/new-member/home-accident-needer',
  '/se-en/new-member/home-switcher',
]
const HOME_INSURANCE_REDIRECTS = [
  ...HOME_INSURANCE_SE_SOURCES.flatMap((source) => [
    {
      source,
      has: [{ type: 'query', key: 'code' }],
      destination: '/api/campaign/:code?code=&next=/se/forsakringar/hemforsakring',
      permanent: true,
      locale: false,
    },
    {
      source,
      destination: '/se/forsakringar/hemforsakring',
      permanent: true,
      locale: false,
    },
  ]),
  ...HOME_INSURANCE_EN_SOURCES.flatMap((source) => [
    {
      source,
      has: [{ type: 'query', key: 'code' }],
      destination: '/api/campaign/:code?code=&next=/se-en/insurances/home-insurance',
      permanent: true,
      locale: false,
    },
    {
      source,
      destination: '/se-en/insurances/home-insurance',
      permanent: true,
      locale: false,
    },
  ]),
]

const CAR_INSURANCE_REDIRECTS = [
  {
    source: '/(se/)?new-member/car',
    has: [{ type: 'query', key: 'code' }],
    destination: '/api/campaign/:code?code=&next=/se/forsakringar/bilforsakring',
    permanent: true,
    locale: false,
  },
  {
    source: '/se-en/new-member/car',
    has: [{ type: 'query', key: 'code' }],
    destination: '/api/campaign/:code?code=&next=/se-en/insurances/car-insurance',
    permanent: true,
    locale: false,
  },
  {
    source: '/(se/)?new-member/car/:path*',
    destination: '/se/forsakringar/bilforsakring',
    permanent: true,
    locale: false,
  },
  {
    source: '/se-en/new-member/car/:path*',
    destination: '/se-en/insurances/car-insurance',
    permanent: true,
    locale: false,
  },
  {
    source: '/new-member/initiate-car-cancellation',
    has: [{ type: 'query', key: 'contractId' }],
    destination: '/cancellation/car/initiate/:contractId',
    permanent: true,
  },
]

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js %O', module.exports)
