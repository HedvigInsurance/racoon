import { RemixServer, createCookie } from 'remix'
import { getRecommendedLocale, localesList } from './lib/i18n'

import type { EntryContext } from 'remix'
import { RemixI18NextProvider } from 'remix-i18next'
import { i18nextInit } from './services/i18next'
import { renderToString } from 'react-dom/server'

const LOCALE_COOKIE_NAME = 'HEDVIG_LOCALE'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const url = new URL(request.url)
  const cookie = createCookie(LOCALE_COOKIE_NAME)

  if (!localesList.some((locale) => url.pathname.startsWith(`/${locale}/`))) {
    const data = await cookie.parse(request.headers.get('Cookie'))
    const locale = data ?? getRecommendedLocale(request.headers)

    const newLocation = `/${locale}${url.pathname}`
    return new Response(newLocation, {
      status: 302,
      headers: {
        Location: newLocation,
        'Set-Cookie': await cookie.serialize(locale),
      },
    })
  }

  const markup = renderToString(
    <RemixI18NextProvider i18n={await i18nextInit()}>
      <RemixServer context={remixContext} url={request.url} />
    </RemixI18NextProvider>,
  )

  responseHeaders.set('Content-Type', 'text/html')
  responseHeaders.set('Set-Cookie', await cookie.serialize(url.pathname.split('/')[1]))

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
