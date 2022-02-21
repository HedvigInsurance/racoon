import Head from 'next/head'
import type { NextPage } from 'next'
import { PageLayout } from './components/page-layout'

const LoadingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hedvig | Loading</title>
        <meta property="og:title" content="Hedvig" />
      </Head>
      <PageLayout>
        <div>Loading...</div>
      </PageLayout>
    </>
  )
}

export default LoadingPage
