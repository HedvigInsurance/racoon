const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
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
    ]
  },
}

// script-src: NOT SAFE - https://www.hyperxiao.top/en/posts/6
// style-src: consider emotion + nonce: https://emotion.sh/docs/@emotion/cache#nonce
const ContentSecurityPolicy = `
  default-src 'self';
  script-src https://app.storyblok.com https://widget.intercom.io https://js.intercomcdn.com https://www.googletagmanager.com https://dc.insurely.com https://vercel.live 'unsafe-inline' 'unsafe-eval' 'self';
  style-src 'unsafe-inline' 'self';
  font-src https://fonts.intercomcdn.com 'self';
  img-src https://promise.hedvig.com https://*.storyblok.com https://downloads.intercomcdn.com https://static.intercomassets.com https://www.googletagmanager.com blob: data: 'self';
  media-src https://*.storyblok.com;
  connect-src https://*.browser-intake-datadoghq.eu https://*.google-analytics.com https://api-iam.intercom.io wss://*.intercom.io https://*.hedvigit.com 'self';
  worker-src blob:;
  object-src data:;
  frame-src https://dc.insurely.com;
`

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
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
]

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
