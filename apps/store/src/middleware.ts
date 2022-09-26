import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { countries } from '@/lib/l10n/countries'
import { normalizeLocale, routingLocale } from '@/lib/l10n/locales'
import { isLocale } from '@/utils/isLocale'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  if (isLocale(normalizeLocale(firstPathFragment(req.url)))) {
    return
  }
  const country = req.geo?.country
  switch (country) {
    case countries.NO.id:
      req.nextUrl.pathname = routingLocale(countries.NO.defaultLocale)
      break
    case countries.DK.id:
      req.nextUrl.pathname = routingLocale(countries.DK.defaultLocale)
      break
    case countries.SE.id:
      req.nextUrl.pathname = routingLocale(countries.SE.defaultLocale)
      break
    default:
      req.nextUrl.pathname = '/country-selector'
  }

  console.debug(`Routing visitor from ${country} to ${req.nextUrl}`)

  return NextResponse.rewrite(req.nextUrl)
}

const firstPathFragment = (url: string): string => {
  const fragments = new URL(url).pathname.split('/').filter(Boolean)
  return fragments[0]
}
