import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { countries } from '@/lib/l10n/countries'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  const country = req.geo && req.geo.country

  switch (country) {
    case countries.NO.id:
      req.nextUrl.pathname = countries.NO.defaultLocale
      break
    case countries.DK.id:
      req.nextUrl.pathname = countries.DK.defaultLocale
      break
    case countries.SE.id:
      req.nextUrl.pathname = countries.SE.defaultLocale
      break
    default:
      req.nextUrl.pathname = '/country-selector'
  }

  return NextResponse.rewrite(req.nextUrl)
}
