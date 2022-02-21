import type { NextPage } from 'next'
import { PageLayout } from './components/page-layout'

const LoadingPage: NextPage = () => {
  return (
    <PageLayout>
      <div>Loading...</div>
    </PageLayout>
  )
}

export default LoadingPage
