import type { NextPage } from 'next'
import { PageLayout } from '@/components/forever/PageLayout'
import { Ready } from '@/components/forever/Ready'

const ForeverPageReady: NextPage = () => {
  return (
    <PageLayout>
      <Ready />
    </PageLayout>
  )
}

export { getServerSideProps } from './index.page'

export default ForeverPageReady
