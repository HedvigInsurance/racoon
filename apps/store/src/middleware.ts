import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { countries } from '@/utils/l10n/countries'
import { isRoutingLocale, toRoutingLocale } from '@/utils/l10n/localeUtils'
import { LOCALE_COOKIE_KEY } from './utils/l10n/locales'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  if (isRoutingLocale(req.nextUrl.locale)) {
    return
  }

  const nextURL = req.nextUrl.clone()
  const cookiePath = req.cookies.get(LOCALE_COOKIE_KEY)

  if (cookiePath) {
    nextURL.pathname = cookiePath.value
    console.log(`Found user preference in cookies: ${cookiePath}, redirecting`)
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
