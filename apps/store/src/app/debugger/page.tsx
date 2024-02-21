import Head from 'next/head'
import { RootLayout } from '../[locale]/RootLayout'
import { CreateSessionForm } from './CreateSessionForm'

const Page = () => {
  return (
    <RootLayout locale={'se-en'}>
      <div style={wrapperStyle}>
        <Head>
          <meta name="robots" content="noindex,nofollow" />
        </Head>
        <CreateSessionForm />
      </div>
    </RootLayout>
  )
}

export default Page

export const metadata = {
  robots: 'noindex, nofollow',
}

const wrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  maxWidth: '20rem',
  marginInline: 'auto',
}
