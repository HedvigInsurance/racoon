const gtmInjectedOrigins = [
  'https://*.onetrust.com',
  'https://*.cookielaw.org',
  'https://*.hotjar.com',
  'https://*.hotjar.io',
  'https://sc-static.net',
  'https://*.snapchat.com',
  'https://*.facebook.net',
  'https://*.facebook.com',
  'https://*.doubleclick.net',
  'https://*.google.com',
  'https://*.google.se',
  'https://*.googleadservices.com',
  'https://*.google-analytics.com',
  'https://ion.hedvig.com',
]

const scriptSrc = [
  // Storyblok
  'https://app.storyblok.com',
  // Google
  'https://*.googletagmanager.com',
  'https://*.google-analytics.com',
  'https://translate.googleapis.com',
  'https://tpc.googlesyndication.com',
  // C1 - Customer First
  'https://c1.hedvig.com',

  // GTM injected scripts
  ...gtmInjectedOrigins,

  // OLD market web
  'https://cdn.adt387.com',
  'http://widget.trustpilot.com',
  'https://widget.trustpilot.com',

  'https://dc.insurely.com',
  'https://vercel.live',
  "'unsafe-inline'",
  "'unsafe-eval'",
  "'self'",
]
const styleSrc = [
  // GTM preview mode
  'https://fonts.googleapis.com',
  'https://*.googletagmanager.com',

  'https://*.gstatic.com',

  // Google Optimize
  'https://optimize.google.com',

  "'unsafe-inline'",
  "'self'",
]
const fontSrc = [
  // GTM preview mode
  'https://fonts.gstatic.com',
  // Vercel
  'https://*.vercel.com',
  // OLD market web
  'https://cdn.hedvig.com',
  "'self'",
]
const imgSrc = [
  'https://promise.hedvig.com',
  'https://*.storyblok.com',
  // Google
  'https://*.gstatic.com', // www + fonts
  'https://www.googletagmanager.com',
  // Vercel
  'https://assets.vercel.com',
  'https://vercel.com',
  'https://vercel.live',
  // Server-side Google Tag Manager
  'https://sgtm.hedvig.com',

  ...gtmInjectedOrigins,

  // OLD market web
  'http://a.storyblok.com',
  'https://a.storyblok.com',
  'https://www.dev.hedvigit.com',

  'blob:',
  'data:',
  "'self'",
]
const mediaSrc = [
  'https://dc.insurely.com',
  'https://vercel.live',
  'https://a.storyblok.com',
  "'self'",
]
const connectSrc = [
  // Server-side Google Tag Manager
  'https://sgtm.hedvig.com',
  // Our logging
  'https://*.browser-intake-datadoghq.eu',
  // Vercel preview comments
  'https://*.pusher.com/',
  'wss://*.pusher.com',
  // Vercel Live
  'https://vercel.live',
  'https://vercel.com',
  // Google
  'https://www.gstatic.com',
  // Facebook
  'https://connect.facebook.net',

  ...gtmInjectedOrigins,

  // OLD market web
  'https://api.storyblok.com',

  'https://*.hedvigit.com',
  "'self'",
]
const frameSrc = [
  'https://dc.insurely.com',
  'https://player.vimeo.com',
  'https://vercel.live', // Vercel Live
  'https://www.googletagmanager.com',
  'https://tpc.googlesyndication.com',
  'https://*.googleapis.com',
  'https://checkout.test.trustly.com',
  'https://checkout.trustly.com',

  // C1 - Customer First
  'https://c1.hedvig.com',

  // GTM-injected scripts
  'https://*.snapchat.com',
  'https://*.hotjar.com',

  // OLD market web
  'https://www.youtube.com/',
  'https://widget.trustpilot.com/',

  // Google Optimize
  'https://optimize.google.com',

  "'self'",
]

// NOTE: report-to rule with Report-to header is recommended, but it's not universally supported and
// is impossible to test on localhost with non-TLS, so we're not using it
//
// script-src: NOT SAFE - https://www.hyperxiao.top/en/posts/6
// style-src: consider emotion + nonce: https://emotion.sh/docs/@emotion/cache#nonce

const ContentSecurityPolicy = `
  default-src 'self';
  child-src blob: 'self';
  script-src ${scriptSrc.join(' ')};
  style-src ${styleSrc.join(' ')}; 
  font-src ${fontSrc.join(' ')};
  img-src ${imgSrc.join(' ')};
  media-src ${mediaSrc.join(' ')};
  connect-src ${connectSrc.join(' ')};
  worker-src blob: 'self';
  object-src data:;
  frame-src ${frameSrc.join(' ')};
  report-uri /api/csp-reports;
`

module.exports = {
  SiteCsp: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  // Remove CSP from Storyblok editor - only internal users need it, and we don't want to maintain another whitelist
  StoryblokCsp: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
}
