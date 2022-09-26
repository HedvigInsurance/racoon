import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { countries } from '@/lib/l10n/countries'
import { routingLocale } from '@/lib/l10n/locales'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  const country = req.geo && req.geo.country

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

  console.info(`Routing visitor from ${country} to ${nextURL}`)
  return NextResponse.redirect(nextURL)
}
