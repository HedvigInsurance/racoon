const gtmInjectedOrigins = [
  'https://*.onetrust.com',
  'https://*.cookielaw.org',
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
  '*.ads.linkedin.com',
]

const adyenOrigins = [
  'https://checkoutshopper-live.adyen.com',
  'https://checkoutshopper-test.adyen.com',
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

  ...gtmInjectedOrigins,
  ...adyenOrigins,

  // Adtraction
  'https://cdn.adt387.com',

  // Trustpilot Widget
  'http://widget.trustpilot.com',
  'https://widget.trustpilot.com',

  // Insurely
  'https://blocks.insurely.com',
  'https://dc.insurely.com',

  // Affiliate tracking
  'https://addrevenue.io',

  // Clearbits partnership tracking
  'https://tag.clearbitscripts.com',
  'https://x.clearbitjs.com',

  // Linkedin
  'https://snap.licdn.com',

  // Vercel Speed Insights
  'https://va.vercel-scripts.com',

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
  // Hedvig CDN S3 bucket
  'https://cdn.hedvig.com',
  'data:',
  "'self'",
]
const imgSrc = [
  'https://promise.hedvig.com',
  'https://assets.hedvig.com',
  // Hedvig CDN S3 bucket
  'https://cdn.hedvig.com',
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

  ...adyenOrigins,
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
  // Hedvig CDN S3 bucket
  'https://cdn.hedvig.com',
  'https://dc.insurely.com',
  'https://vercel.live',
  'https://a.storyblok.com',
  'https://s3.eu-central-1.amazonaws.com',
  "'self'",
]
const connectSrc = [
  // Server-side Google Tag Manager
  'https://sgtm.hedvig.com',
  // Our logging and RUM
  'https://browser-intake-datadoghq.eu',
  // Vercel preview comments
  'https://*.pusher.com/',
  'wss://*.pusher.com',
  // Vercel Live
  'https://vercel.live',
  'https://vercel.com',
  // Google
  'https://www.gstatic.com',
  'https://translate.googleapis.com',
  // Facebook
  'https://connect.facebook.net',
  // Linkedin
  'https://px.ads.linkedin.com',

  ...adyenOrigins,
  ...gtmInjectedOrigins,

  // Affiliate tracking
  'https://addrevenue.io',

  // Clearbits partnership tracking
  'https://app.clearbit.com',

  // PCMS / Insurance documents
  'https://promise.hedvig.com',
  'https://promise-cms.s3.eu-central-1.amazonaws.com',

  'https://*.hedvigit.com',
  "'self'",
]
const frameSrc = [
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

  // Trustpilot
  'https://widget.trustpilot.com/',

  // Google Optimize
  'https://optimize.google.com',

  // Google Doubleclick
  'https://td.doubleclick.net',

  // Insurely
  'https://blocks.insurely.com',

  'https://dev.hedvigit.com',

  ...adyenOrigins,

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

export const SiteCsp = ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
// Remove CSP from Storyblok editor - only internal users need it, and we don't want to maintain another whitelist
export const StoryblokCsp = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
