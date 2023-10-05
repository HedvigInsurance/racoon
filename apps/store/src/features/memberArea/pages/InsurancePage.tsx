import { NextPageWithLayout } from 'next'
import { Insurances } from '@/features/memberArea/components/InsurancesSection'
import { useMemberAreaMemberInfoQuery } from '@/services/apollo/generated'
import { LayoutWithMenu } from '../components/LayoutWithMenu'

export const InsurancePage: NextPageWithLayout = () => {
  const { data, loading } = useMemberAreaMemberInfoQuery()

  return (
    <>
      {loading && 'Loading...'}
      {data && <Insurances data={data} />}
    </>
  )
}

InsurancePage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>
