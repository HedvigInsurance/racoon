import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/
const DEFAULT_LOCALE = 'se-en'

export function middleware(request: NextRequest) {
  const shouldHandleLocale =
    !PUBLIC_FILE.test(request.nextUrl.pathname) &&
    !request.nextUrl.pathname.includes('/api/') &&
    request.nextUrl.locale === 'default';

  return shouldHandleLocale
    ? NextResponse.redirect(`/${DEFAULT_LOCALE}${request.nextUrl.pathname}`)
    : undefined;
}
