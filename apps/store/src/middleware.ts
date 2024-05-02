import { get as getFromConfig } from '@vercel/edge-config'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { experimentMiddleware } from '@/services/Tracking/experimentMiddleware'
import { FALLBACK_LOCALE, LOCALE_COOKIE_KEY, locales } from '@/utils/l10n/locales'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - debugger (internal tools)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     *
     * OR paths that contain a period (.) from public-folder
     */
    '/((?!api|debugger|_next/static|_next/image|.*\\.).*)',
    '/',
  ],
}

export async function middleware(req: NextRequest) {
  const localeRedirect = localeMiddleware(req)
  if (localeRedirect) return localeRedirect

  const configRedirect = await redirectMiddleware(req)
  if (configRedirect) return configRedirect

  return experimentMiddleware(req)
}

const localeMiddleware = (req: NextRequest): NextResponse | undefined => {
  const url = new URL(req.url)
  const firstSegment = url.pathname.split('/')[1]
  if (isRoutingLocale(firstSegment)) return

  const redirectToLocale = (locale: string) => {
    const targetUrl = req.nextUrl.clone()
    targetUrl.pathname = `/${locale}${targetUrl.pathname}`

    if (
      locale === locales['sv-SE'].routingLocale ||
      locale === locales[FALLBACK_LOCALE].routingLocale
    ) {
      return NextResponse.rewrite(targetUrl)
    }

    return NextResponse.redirect(targetUrl, 308)
  }

  const cookieLocale = req.cookies.get(LOCALE_COOKIE_KEY)?.value
  if (cookieLocale) {
    console.info(`Found user preference in cookies: ${cookieLocale}, redirecting`)
    return redirectToLocale(cookieLocale)
  }

  console.info(`Routing visitor from ${req.url} to default locale`)
  return redirectToLocale(locales[FALLBACK_LOCALE].routingLocale)
}

type Redirect = {
  from: string
  to: string
  temporary?: boolean
}

const redirectMiddleware = async (req: NextRequest): Promise<NextResponse | undefined> => {
  let redirects: ReadonlyArray<Redirect> | undefined
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
    const reqUrl = new URL(req.url)
    if (reqUrl.pathname === redirect.from) {
      console.log(
        `Applying ${redirect.temporary ? 'temporary' : 'permanent'} redirect ${redirect.from} -> ${
          redirect.to
        }`,
      )

      const redirectUrl = new URL(redirect.to, reqUrl.origin)
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
