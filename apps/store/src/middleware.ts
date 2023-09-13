import { get as getFromConfig } from '@vercel/edge-config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { experimentMiddleware } from '@/services/Tracking/experimentMiddleware'
import { countries } from '@/utils/l10n/countries'
import { LOCALE_COOKIE_KEY } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'

export const config = {
  matcher: [
    '/', // Failsafe, always match root
    // Anything that can be a subject to redirect
    '/((?!api|_next|favicon.ico|favicon-32x32|site.webmanifest).*)',
  ],
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.locale === 'default') {
    return localeMiddleware(req)
  } else {
    const redirectResponse = await redirectMiddleware(req)
    if (redirectResponse) return redirectResponse

    return experimentMiddleware(req)
  }
}

const localeMiddleware = (req: NextRequest): NextResponse => {
  const nextURL = req.nextUrl.clone()
  const cookiePath = req.cookies.get(LOCALE_COOKIE_KEY)

  if (cookiePath) {
    nextURL.locale = cookiePath.value
    console.info(`Found user preference in cookies: ${cookiePath.value}, redirecting`)
    return NextResponse.redirect(nextURL)
  }

  // Default routing to /se
  nextURL.locale = toRoutingLocale(countries.SE.defaultLocale)
  console.info(`Routing visitor from ${req.url} to ${nextURL}`)
  return NextResponse.redirect(nextURL, 308)
}

type Redirect = {
  from: string
  to: string
  temporary?: boolean
}

const redirectMiddleware = async (req: NextRequest): Promise<NextResponse | undefined> => {
  let redirects: Array<Redirect> | undefined
  try {
    redirects = await getFromConfig<Array<Redirect>>('redirects')
  } catch (err) {
    console.warn('Failed to load redirects config', err)
    return
  }
  if (!redirects) {
    console.warn('No redirects in vercel config.  This is probably misconfiguration')
    return
  }
  for (const redirect of redirects) {
    if (!isValidRedirect(redirect)) {
      warnOnce(`Invalid URL in redirect ${JSON.stringify(redirect)}`)
      continue
    }
    // Cannot use req.nextUrl, it removes locale prefix
    const reqUrl = new URL(req.url)
    if (reqUrl.pathname === redirect.from) {
      console.log(
        `Applying ${redirect.temporary ? 'temporary' : 'permanent'} redirect ${redirect.from} -> ${
          redirect.to
        }`,
      )

      const redirectUrl = new URL(redirect.to, req.nextUrl)
      const serachParams = new URLSearchParams([
        ...Array.from(reqUrl.searchParams.entries()),
        ...Array.from(redirectUrl.searchParams.entries()),
      ])
      redirectUrl.search = serachParams.toString()
      return NextResponse.redirect(redirectUrl, redirect.temporary ? 307 : 308)
    }
  }
}

const urlRegex = /^(\/|https?:\/\/)/
const isValidRedirect = (redirect: unknown): redirect is Redirect => {
  if (typeof redirect !== 'object' || redirect == null) return false
  const { from, to, temporary = false } = redirect as Record<string, unknown>
  if (typeof from !== 'string' || typeof to !== 'string' || typeof temporary !== 'boolean') {
    return false
  }
  return urlRegex.test(from) && urlRegex.test(to)
}

const warnMessages = new Set()
const warnOnce = (message: string) => {
  if (warnMessages.has(message)) return
  warnMessages.add(message)
  console.warn(message)
}
