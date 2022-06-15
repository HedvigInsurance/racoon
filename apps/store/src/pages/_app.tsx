import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'ui'
import * as Datadog from '@/services/datadog'

Datadog.initRum()

const cache = createCache({ key: 'next' })

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <CacheProvider value={cache}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}

export default MyApp
