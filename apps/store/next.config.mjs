import nextBundleAnalyzer from '@next/bundle-analyzer'
import { apiPlugin, storyblokInit } from '@storyblok/js'
import experimentJson from './experiment.json' assert { type: 'json' }
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

import { SiteCsp, StoryblokCsp } from './next-csp.config.mjs'
import { patchServerConsole } from './src/utils/patchServerConsole.mjs'

patchServerConsole()

/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    instrumentationHook: true,
    strictNextHead: true,
    outputFileTracingIncludes: {
      // Fixes next-i18next config and resources not loading specifically in Vercel environment
      '*': ['./next-i18next.config.cjs', './public/locales/**/*'],
    },
    webpackBuildWorker: true,
  },
  logging: {
    fetches: {
      // Detailed fetch logs in dev move
      fullUrl: true,
    },
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
        source: '/no/((?!hjelp/kundeservice).*)',
        destination: '/no',
        permanent: true,
      },
      {
        source: '/no-en/((?!help/customer-service).*)',
        destination: '/no-en',
        permanent: true,
      },
      {
        source: '/dk/((?!hjaelp/kundeservice).*)',
        destination: '/dk',
        permanent: true,
      },
      {
        source: '/dk-en/((?!help/customer-service).*)',
        destination: '/dk-en',
        permanent: true,
      },
    ]

    // Redirect old web-onboarding pages to root
    const oldSiteRedirects = [
      {
        source: '/new-member(.*)',
        destination: '/se/forsakringar',
        permanent: true,
      },
      {
        source: '/se/new-member(.*)',
        destination: '/se/forsakringar',
        permanent: true,
      },
      {
        source: '/se-en/new-member(.*)',
        destination: '/se-en/insurances',
        permanent: true,
      },
    ]

    // GOTCHA: Cannot use nested capture groups, NextJs restriction
    const localeSegment = ':locale(\\w{2}|\\w{2}-\\w{2})'
    const memberAreaDefault = [
      {
        source: `/${localeSegment}/member`,
        destination: '/:locale/member/insurances',
        permanent: false,
      },
    ]

    let storyblokRedirects = []
    // It's OK to skip it locally to make startup a bit faster
    if (process.env.NEXT_PUBLIC_FEATURE_STORYBLOK_REDIRECTS === 'true') {
      storyblokRedirects = await getStoryblokRedirects()
      console.log(`Loaded ${storyblokRedirects.length} redirects from storyblok`)
    }

    const cartRedirects = [
      {
        source: '/se/cart',
        destination: '/se/checkout',
        permanent: true,
      },
      {
        source: '/se-en/cart',
        destination: '/se-en/checkout',
        permanent: true,
      },
    ]

    return [
      ...noDkRedirects,
      ...oldSiteRedirects,
      ...getExperimentVariantRedirects(),
      ...memberAreaDefault,
      ...storyblokRedirects,
      ...cartRedirects,
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

  const variantSlug = experimentJson.variants.find((item) => item.slug)?.slug
  if (!variantSlug) return []

  return [
    {
      source: [experimentJson.slug, variantSlug].join(''),
      destination: experimentJson.slug,
      permanent: false,
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

  const cacheVersion = parseInt(process.env.STORYBLOK_CACHE_VERSION, 10)
  try {
    const repsonse = await storyblokApi.getAll('cdn/datasource_entries', {
      datasource: 'permanent-redirects',
      ...(!isNaN(cacheVersion) ? { cv: cacheVersion } : {}),
    })

    const redirects = repsonse.map((entry) => ({
      source: entry.name,
      destination: entry.value,
      permanent: true,
    }))

    return redirects
  } catch (error) {
    console.error('Error updating redirects', error)
  }
}

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})
const withVanillaExtract = createVanillaExtractPlugin({
  transpilePackages: ['ui'],
})
const nextConfig = withVanillaExtract(withBundleAnalyzer(config))
// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.mjs %O', nextConfig)
export default nextConfig
