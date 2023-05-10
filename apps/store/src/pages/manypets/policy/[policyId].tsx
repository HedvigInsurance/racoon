import { GetServerSideProps, NextPage } from 'next'

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context

  // TODO: Get sessionId and redirect to /manypets/migration/:shopSessionId if found
  console.log('policy page', params)

  return { redirect: { destination: '/manypets/', permanent: false } }
}

// TODO: Maybe show loading indicator
const NextLoadingPage: NextPage = () => {
  return null
}

export default NextLoadingPage
