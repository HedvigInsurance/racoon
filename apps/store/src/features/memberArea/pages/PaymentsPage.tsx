import { NextPageWithLayout } from 'next'
import { useMemberAreaMemberInfoQuery } from '@/services/apollo/generated'
import { LayoutWithMenu } from '../components/LayoutWithMenu'
import { PaymentsSection } from '../PaymentsSection/PaymentsSection'

export const PaymentsPage: NextPageWithLayout = () => {
  const { loading } = useMemberAreaMemberInfoQuery()
  return <>{loading ? 'Loading...' : <PaymentsSection />}</>
}

PaymentsPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>
