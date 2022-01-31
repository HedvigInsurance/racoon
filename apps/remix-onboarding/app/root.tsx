import {
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'remix'

import type { MetaFunction } from 'remix'
import { i18n } from './i18n.server'
import styles from './tailwind.css'
import { useRemixI18Next } from 'remix-i18next'

type LoaderData = {
  locale: string
  i18n: any
  ENV: {
    GOOGLE_SITE_VERIFICATION?: string
    GOOGLE_TAG_MANAGER_ID?: string
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'New Remix App',
    viewport: 'width=device-width, initial-scale=1',
  }
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const url = new URL(request.url)
  const locale = url.pathname.split('/')[1]

  return {
    locale,
    i18n: await i18n.getTranslations(locale, 'common'),
    ENV: {
      GOOGLE_SITE_VERIFICATION: process.env.REMIX_PUBLIC_GOOGLE_SITE_VERIFICATION,
      GOOGLE_TAG_MANAGER_ID: process.env.REMIX_PUBLIC_GOOGLE_TAG_MANAGER_ID,
    },
  }
}

export default function App() {
  const data = useLoaderData<LoaderData>()
  useRemixI18Next(data.locale)

  return (
    <html lang={data.locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="google-site-verification" content={data.ENV.GOOGLE_SITE_VERIFICATION} />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />

        {data.ENV.GOOGLE_TAG_MANAGER_ID && (
          <>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${data.ENV.GOOGLE_TAG_MANAGER_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>

            <script
              id="gtm-base"
              dangerouslySetInnerHTML={{
                __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${data.ENV.GOOGLE_TAG_MANAGER_ID}');
          `,
              }}
            />
          </>
        )}

        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
