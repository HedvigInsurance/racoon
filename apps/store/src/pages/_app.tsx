import { AppProps } from 'next/app'
import Head from 'next/head'
import * as Datadog from '@/services/datadog'

Datadog.initRum()

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
