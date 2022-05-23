import type { NextPage } from 'next'
import { DebuggerPage } from '@/components/DebuggerPage/DebuggerPage'

const NextDebuggerPage: NextPage = () => {
  return <DebuggerPage />
}

export const getStaticProps = () => {
  return {
    props: {},
    notFound: process.env.VERCEL_ENV === 'production',
  }
}

export default NextDebuggerPage
