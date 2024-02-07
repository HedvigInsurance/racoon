import { GetServerSideProps, NextPage } from 'next'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext' // eslint-disable-next-line @typescript-eslint/require-await

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  patchNextI18nContext(context)
  const { params, locale } = context

  // TODO: Get sessionId and redirect to /manypets/migration/:shopSessionId if found
  console.log('policy page', params)

  return { redirect: { destination: `${locale}/manypets/`, permanent: false } }
}

// TODO: Maybe show loading indicator
const NextLoadingPage: NextPage = () => {
  return null
}

export default NextLoadingPage
