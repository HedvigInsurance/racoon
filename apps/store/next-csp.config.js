const scriptSrc = [
  'https://app.storyblok.com',
  'https://widget.intercom.io',
  'https://js.intercomcdn.com',
  'https://www.googletagmanager.com',
  'https://dc.insurely.com',
  'https://vercel.live',
  "'unsafe-inline'",
  "'unsafe-eval'",
  "'self'",
]
const styleSrc = [
  'https://fonts.googleapis.com', // GTM preview mode
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

  'blob:',
  'data:',
  "'self'",
]
const mediaSrc = [
  'https://dc.insurely.com',
  'https://vercel.live',
  // Storyblok
  'https://a.storyblok.com',
  "'self'",
]
const connectSrc = [
  // Server-side Google Tag Manager
  'https://sgtm.hedvig.com',
  // Our logging
  'https://*.browser-intake-datadoghq.eu',
  // Storyblok logging
  'https://*.sentry.io',
  // Intercom
  'https://api-iam.intercom.io',
  'wss://*.intercom.io',
  // Storyblok editor
  'https://app.storyblok.com',
  // Storyblok editor & Vercel preview comments
  'https://*.pusher.com/',
  'wss://*.pusher.com',
  // Vercel Live
  'https://vercel.live',
  'https://vercel.com',
  // Google
  'https://www.gstatic.com',
  'https://*.google-analytics.com',

  'https://*.hedvigit.com',
  "'self'",
]
const frameSrc = [
  'https://dc.insurely.com',
  'https://player.vimeo.com',
  'https://vercel.live', // Vercel Live
  "'self'", // Storyblok editor
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
  CspHeaderValue: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
}
