import { NextPageWithLayout } from 'next'
import { useMemberAreaMemberInfoQuery } from '@/services/graphql/generated'
import { LayoutWithMenu } from '../components/LayoutWithMenu'
import { Insurances } from '../InsuranceSection/InsurancesSection'

export const InsurancePage: NextPageWithLayout = () => {
  const { loading } = useMemberAreaMemberInfoQuery()
  return <>{loading ? 'Loading...' : <Insurances />}</>
}

InsurancePage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>
