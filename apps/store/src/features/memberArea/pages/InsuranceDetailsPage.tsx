import { NextPageWithLayout } from 'next'
import { useMemberAreaMemberInfoQuery } from '@/services/graphql/generated'
import { MemberAreaLayout } from '../components/MemberAreaLayout'
import { InsuranceDetailsSection } from '../InsuranceSection/InsuranceDetailsSection'

export const InsuranceDetailsPage: NextPageWithLayout = () => {
  const { loading } = useMemberAreaMemberInfoQuery()
  return <>{loading ? 'Loading...' : <InsuranceDetailsSection />}</>
}

InsuranceDetailsPage.getLayout = (children) => <MemberAreaLayout>{children}</MemberAreaLayout>
