import Head from 'next/head'
import Link from 'next/link'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

export const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Hedvig member login</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <SpaceFlex direction="vertical">
        TODO: Login form here
        <Link href={'/member'}>Login</Link>
      </SpaceFlex>
    </>
  )
}
