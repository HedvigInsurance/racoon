import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { countries } from '@/lib/l10n/countries'
import { normalizeLocale, routingLocale } from '@/lib/l10n/locales'
import { isLocale } from '@/utils/isLocale'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  if (isLocale(normalizeLocale(req.nextUrl.locale))) {
    return
  }

  const country = req.geo?.country
  const nextURL = req.nextUrl.clone()
  switch (country) {
    case countries.NO.id:
      nextURL.pathname = routingLocale(countries.NO.defaultLocale)
      break
    case countries.DK.id:
      nextURL.pathname = routingLocale(countries.DK.defaultLocale)
      break
    case countries.SE.id:
      nextURL.pathname = routingLocale(countries.SE.defaultLocale)
      break
    default:
      console.debug(`Routing visitor from ${country} to country selector`)
      nextURL.pathname = '/country-selector'
      return NextResponse.rewrite(nextURL)
  }

  // DD logger cannot be used in middleware since Pino isn't support in Edge runtime (2022-09-27//siau)
  // Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime
  console.debug(`Routing visitor from ${country} to ${nextURL}`)
  return NextResponse.redirect(nextURL)
}
