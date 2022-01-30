import {
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'remix'

import type { MetaFunction } from 'remix'

type LoaderData = {
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

export const loader: LoaderFunction = (): LoaderData => {
  return {
    ENV: {
      GOOGLE_SITE_VERIFICATION: process.env.REMIX_PUBLIC_GOOGLE_SITE_VERIFICATION,
      GOOGLE_TAG_MANAGER_ID: process.env.REMIX_PUBLIC_GOOGLE_TAG_MANAGER_ID,
    },
  }
}

export default function App() {
  const data = useLoaderData<LoaderData>()

  return (
    <html lang="en">
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
