import { NextPageWithLayout } from 'next'
import { useMemberAreaMemberInfoQuery } from '@/services/graphql/generated'
import { MemberAreaLayout } from '../components/MemberAreaLayout'
import { PaymentsSection } from '../PaymentsSection/PaymentsSection'

export const PaymentsPage: NextPageWithLayout = () => {
  const { loading } = useMemberAreaMemberInfoQuery()
  return <>{loading ? 'Loading...' : <PaymentsSection />}</>
}

PaymentsPage.getLayout = (children) => <MemberAreaLayout>{children}</MemberAreaLayout>
