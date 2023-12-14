import { NextPageWithLayout } from 'next'
import { useMemberAreaMemberInfoQuery } from '@/services/graphql/generated'
import { LayoutWithMenu } from '../components/LayoutWithMenu'
import { InsuranceDetailsSection } from '../InsuranceSection/InsuranceDetailsSection'

export const InsuranceDetailsPage: NextPageWithLayout = () => {
  const { loading } = useMemberAreaMemberInfoQuery()
  return <>{loading ? 'Loading...' : <InsuranceDetailsSection />}</>
}

InsuranceDetailsPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>
