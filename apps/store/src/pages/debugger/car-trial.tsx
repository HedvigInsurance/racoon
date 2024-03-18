import { GetServerSideProps } from 'next'

export { DebuggerCarTrialPage as default } from '@/features/carDealership/DebuggerCarTrial/DebuggerCarTrialPage'

// @ts-expect-error not an async function
export const getServerSideProps: GetServerSideProps = () => {
  if (process.env.VERCEL_ENV === 'production')
    return {
      notFound: true,
    }

  return {
    props: {},
  }
}
