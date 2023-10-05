import { NextPageWithLayout } from 'next'
import { Insurances } from '@/features/memberArea/components/InsurancesSection'
import { useMemberAreaMemberInfoQuery } from '@/services/apollo/generated'
import { LayoutWithMenu } from '../components/LayoutWithMenu'

export const InsurancePage: NextPageWithLayout = () => {
  const { loading } = useMemberAreaMemberInfoQuery()
  return <>{loading ? 'Loading...' : <Insurances />}</>
}

InsurancePage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>
