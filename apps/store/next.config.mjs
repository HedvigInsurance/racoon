import nextBundleAnalyzer from '@next/bundle-analyzer'
import { apiPlugin, storyblokInit } from '@storyblok/js'
import experimentJson from './experiment.json' assert { type: 'json' }

import { SiteCsp, StoryblokCsp } from './next-csp.config.mjs'
import i18nConfig from './next-i18next.config.js'

/** @type {import('next').NextConfig} */
const config = {
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.hedvig.com',
      },
    ],
  },
  productionBrowserSourceMaps: true,
  i18n: i18nConfig.i18n,
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

    return [foreverRedirect]
  },
  async redirects() {
    // Redirect all NO/DK pages to home page (except customer service pages)
    const noDkRedirects = [
      {
        source: '/no/((?!hjelp/kundeservice|payment/connect-legacy).*)',
        destination: '/no',
        permanent: true,
        locale: false,
      },
      {
        source: '/no-en/((?!help/customer-service|payment/connect-legacy).*)',
        destination: '/no-en',
        permanent: true,
        locale: false,
      },
      {
        source: '/dk/((?!hjaelp/kundeservice|payment/connect-legacy).*)',
        destination: '/dk',
        permanent: true,
        locale: false,
      },
      {
        source: '/dk-en/((?!help/customer-service|payment/connect-legacy).*)',
        destination: '/dk-en',
        permanent: true,
        locale: false,
      },
    ]

    // Redirect old web-onboarding pages to root
    const oldSiteRedirects = [
      {
        source: '/new-member(.*)',
        destination: '/se/forsakringar',
        permanent: true,
        locale: false,
      },
      {
        source: '/se/new-member(.*)',
        destination: '/se/forsakringar',
        permanent: true,
        locale: false,
      },
      {
        source: '/se-en/new-member(.*)',
        destination: '/se-en/insurances',
        permanent: true,
        locale: false,
      },
    ]

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

    let storyblokRedirects = []
    if (process.env.NEXT_PUBLIC_FEATURE_STORYBLOK_REDIRECTS === 'true') {
      storyblokRedirects = await getStoryblokRedirects()
    }

    return [
      ...noDkRedirects,
      ...oldSiteRedirects,
      ...getExperimentVariantRedirects(),
      ...memberAreaDefault,
      ...storyblokRedirects,
    ]
  },
}

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

/**
 * Fetch redirects from Storyblok datasource
 * */
const getStoryblokRedirects = async () => {
  const { storyblokApi } = storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  })

  if (!storyblokApi) throw new Error('Storyblok API not initialized')

  const cacheVersion = process.env.STORYBLOK_CACHE_VERSION
    ? parseInt(process.env.STORYBLOK_CACHE_VERSION)
    : NaN
  const isCacheVersionValid = !isNaN(cacheVersion)
  const cv = isCacheVersionValid ? cacheVersion : undefined

  try {
    const repsonse = await storyblokApi.getAll('cdn/datasource_entries', {
      datasource: 'permanent-redirects',
      cv,
    })

    const redirects = repsonse.map((entry) => ({
      source: entry.name,
      destination: entry.value,
      permanent: true,
      locale: false,
    }))

    return redirects
  } catch (error) {
    console.error('Error updating redirects', error)
  }
}

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})
const nextConfig = withBundleAnalyzer(config)
// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.mjs %O', nextConfig)
export default nextConfig
