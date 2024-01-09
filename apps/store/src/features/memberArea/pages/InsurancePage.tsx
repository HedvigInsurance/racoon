import { NextPageWithLayout } from 'next'
import { useMemberAreaMemberInfoQuery } from '@/services/graphql/generated'
import { MemberAreaLayout } from '../components/MemberAreaLayout'
import { Insurances } from '../InsuranceSection/InsurancesSection'

export const InsurancePage: NextPageWithLayout = () => {
  const { loading } = useMemberAreaMemberInfoQuery()
  return <>{loading ? 'Loading...' : <Insurances />}</>
}

InsurancePage.getLayout = (children) => <MemberAreaLayout>{children}</MemberAreaLayout>
