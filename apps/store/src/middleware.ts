import { get as getFromConfig } from '@vercel/edge-config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { countries } from '@/utils/l10n/countries'
import { isRoutingLocale, toRoutingLocale } from '@/utils/l10n/localeUtils'
import { LOCALE_COOKIE_KEY } from './utils/l10n/locales'

export const config = {
  matcher: [
    '/', // Failsafe, always match root
    // Anything that can be a subject to redirect
    '/((?!api|_next|favicon.ico).*)',
  ],
}

export async function middleware(req: NextRequest) {
  if (!isRoutingLocale(req.nextUrl.locale)) {
    // Workaround for Vercel edge middleware matching requests for static resources despite config specifying not to do so
    if (req.nextUrl.pathname !== '/') {
      return
    }
    return countrySelectorMiddleware(req)
  } else {
    return redirectMiddleware(req)
  }
}

const countrySelectorMiddleware = (req: NextRequest): NextResponse => {
  const nextURL = req.nextUrl.clone()
  const cookiePath = req.cookies.get(LOCALE_COOKIE_KEY)

  if (cookiePath) {
    nextURL.pathname = cookiePath.value
    console.log(`Found user preference in cookies: ${cookiePath.value}, redirecting`)
    return NextResponse.redirect(nextURL)
  }

  const country = req.geo?.country

  switch (country) {
    case countries.NO.id:
      nextURL.pathname = toRoutingLocale(countries.NO.defaultLocale)
      break
    case countries.DK.id:
      nextURL.pathname = toRoutingLocale(countries.DK.defaultLocale)
      break
    case countries.SE.id:
      nextURL.pathname = toRoutingLocale(countries.SE.defaultLocale)
      break
    default:
      console.log(`Routing visitor from ${country} to country selector`)
      nextURL.pathname = '/country-selector'
      return NextResponse.rewrite(nextURL)
  }

  // DD logger cannot be used in middleware since Pino isn't support in Edge runtime (2022-09-27//siau)
  // Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime
  console.log(`Routing visitor from ${country} to ${nextURL}`)
  return NextResponse.redirect(nextURL)
}

type Redirect = {
  from: string
  to: string
  temporary?: boolean
}

const redirectMiddleware = async (req: NextRequest): Promise<NextResponse | undefined> => {
  let redirects: Array<Redirect> | undefined
  try {
    redirects = await getFromConfig<Array<Redirect> | undefined>('redirects')
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
    if (reqUrl.pathname.startsWith(redirect.from)) {
      console.log(
        `Applying ${redirect.temporary ? 'temporary' : 'permanent'} redirect ${redirect.from} -> ${
          redirect.to
        }`,
      )
      const redirectUrl = new URL(redirect.to, req.nextUrl)
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
