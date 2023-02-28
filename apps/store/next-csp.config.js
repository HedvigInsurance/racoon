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
]

const scriptSrc = [
  // Storyblok
  'https://app.storyblok.com',
  // Intercom
  'https://widget.intercom.io',
  'https://js.intercomcdn.com',
  // Google
  'https://*.googletagmanager.com',
  'https://*.google-analytics.com',

  // GTM injected scripts
  ...gtmInjectedOrigins,

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

  "'unsafe-inline'",
  "'self'",
]
const fontSrc = [
  'https://fonts.intercomcdn.com',
  // GTM preview mode
  'https://fonts.gstatic.com',
  // Vercel
  'https://*.vercel.com',
  "'self'",
]
const imgSrc = [
  'https://promise.hedvig.com',
  'https://*.storyblok.com',
  // Intercom
  'https://downloads.intercomcdn.com',
  'https://static.intercomassets.com',
  // Google
  'https://*.gstatic.com', // www + fonts
  'https://www.googletagmanager.com',
  // Vercel
  'https://assets.vercel.com',
  'https://vercel.com',
  'https://vercel.live',

  ...gtmInjectedOrigins,

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
  // Intercom
  'https://api-iam.intercom.io',
  'wss://*.intercom.io',
  // Vercel preview comments
  'https://*.pusher.com/',
  'wss://*.pusher.com',
  // Vercel Live
  'https://vercel.live',
  'https://vercel.com',
  // Google
  'https://www.gstatic.com',

  ...gtmInjectedOrigins,

  'https://*.hedvigit.com',
  "'self'",
]
const frameSrc = [
  'https://dc.insurely.com',
  'https://player.vimeo.com',
  'https://vercel.live', // Vercel Live

  // GTM-injected scripts
  'https://*.snapchat.com',
  'https://*.hotjar.com',

  "'self'",
]

// NOTE: report-to rule with Report-to header is recommended, but it's not universally supported and
// is impossible to test on localhost with non-TLS, so we're not using it
//
// script-src: NOT SAFE - https://www.hyperxiao.top/en/posts/6
// style-src: consider emotion + nonce: https://emotion.sh/docs/@emotion/cache#nonce

const ContentSecurityPolicy = `
  default-src 'self';
  script-src ${scriptSrc.join(' ')};
  style-src ${styleSrc.join(' ')}; 
  font-src ${fontSrc.join(' ')};
  img-src ${imgSrc.join(' ')};
  media-src ${mediaSrc.join(' ')};
  connect-src ${connectSrc.join(' ')};
  worker-src blob:;
  object-src data:;
  frame-src ${frameSrc.join(' ')};
  report-uri /api/csp-reports;
`

module.exports = {
  SiteCsp: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  // Remove CSP from Storyblok editor - only internal users need it, and we don't want to maintain another whitelist
  StoryblokCsp: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
}
